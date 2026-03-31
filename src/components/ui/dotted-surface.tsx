'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
  /** Color of the dots — defaults to a cool blue-white for HackQuest's dark theme */
  dotColor?: [number, number, number];
  /** Opacity ceiling for dots (0–1) */
  dotOpacity?: number;
  /** How far the mouse pushes dots (px equiv). Default 120 */
  mouseInfluence?: number;
  /** Fade the whole surface out as the user scrolls (px). 0 = no fade */
  scrollFadeDistance?: number;
};

export function DottedSurface({
  className,
  dotColor = [160, 200, 255],
  dotOpacity = 0.7,
  mouseInfluence = 120,
  scrollFadeDistance = 800,
  children,
  ...props
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 9999, y: 9999 }); // off-screen initially
  const scrollOpacityRef = useRef(1);

  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    points: THREE.Points;
    animationId: number;
    count: number;
    AMOUNTX: number;
    AMOUNTY: number;
    SEPARATION: number;
  } | null>(null);

  // ─── mouse tracking ────────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 9999, y: 9999 };
  }, []);

  // ─── scroll opacity ────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    if (scrollFadeDistance <= 0) return;
    const scrollY = window.scrollY;
    scrollOpacityRef.current = Math.max(0, 1 - scrollY / scrollFadeDistance);
  }, [scrollFadeDistance]);

  useEffect(() => {
    if (!containerRef.current) return;

    const SEPARATION = 130;
    const AMOUNTX = 50;
    const AMOUNTY = 70;

    // ─── Scene ────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    camera.position.set(0, 400, 1400);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    containerRef.current.appendChild(renderer.domElement);

    // ─── Geometry ─────────────────────────────────────────────────
    const total = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(total * 3);
    const colors = new Float32Array(total * 3);
    const sizes = new Float32Array(total);

    const [r, g, b] = dotColor.map((c) => c / 255);

    let idx = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = z;
        colors[idx * 3] = r;
        colors[idx * 3 + 1] = g;
        colors[idx * 3 + 2] = b;
        sizes[idx] = 6;
        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader for variable-size dots with smooth circles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: dotOpacity },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: /* glsl */ `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vSize;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vSize = size;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vSize;
        uniform float uOpacity;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.25, dist) * uOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId: number;

    // ─── Animate ──────────────────────────────────────────────────
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const sizeAttr = geometry.attributes.size as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      const sz = sizeAttr.array as Float32Array;

      // Project mouse into 3-D space (approximate)
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const ndcX = (mx / window.innerWidth) * 2 - 1;
      const ndcY = -(my / window.innerHeight) * 2 + 1;

      const mouseVec = new THREE.Vector3(ndcX, ndcY, 0.5);
      mouseVec.unproject(camera);
      const dir = mouseVec.sub(camera.position).normalize();
      const planeY = 0;
      const t = (planeY - camera.position.y) / dir.y;
      const worldMouse = new THREE.Vector3(
        camera.position.x + dir.x * t,
        planeY,
        camera.position.z + dir.z * t,
      );

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const idx3 = i * 3;

          // base wave
          let yVal =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;

          // mouse repulsion
          const dx = pos[idx3] - worldMouse.x;
          const dz = pos[idx3 + 2] - worldMouse.z;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const radius = mouseInfluence * 8; // world-space radius
          if (dist < radius) {
            const strength = 1 - dist / radius;
            const push = strength * strength * 180;
            yVal += push;
            sz[i] = 6 + strength * 14; // grow dots near mouse
          } else {
            sz[i] = 6;
          }

          pos[idx3 + 1] = yVal;
          i++;
        }
      }

      posAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;

      // scroll fade
      (material.uniforms.uOpacity as any).value =
        dotOpacity * scrollOpacityRef.current;

      renderer.render(scene, camera);
      count += 0.08;
    };

    // ─── Resize ───────────────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        2,
      );
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    animate();

    sceneRef.current = {
      scene,
      camera,
      renderer,
      points,
      animationId,
      count,
      AMOUNTX,
      AMOUNTY,
      SEPARATION,
    };

    // ─── Cleanup ──────────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);

      cancelAnimationFrame(animationId);

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch {
          // already removed
        }
      }
    };
  }, [dotColor, dotOpacity, mouseInfluence, scrollFadeDistance, handleMouseMove, handleMouseLeave, handleScroll]);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none fixed inset-0 -z-[1]', className)}
      style={{ pointerEvents: 'none' }}
      {...props}
    >
      {children}
    </div>
  );
}
