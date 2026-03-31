"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { HeroSection } from "./HeroSection";
import { ReadyToStart } from "./ReadyToStart";
import { TransparencySection } from "./TransparencySection";
import { HighlightsSection } from "./HighlightsSection";
import { Footer } from "./Footer";
import { EarthModel } from "./EarthModel";
import { AlgoCoinModel } from "./AlgoCoinModel";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const HERO_LOCK_MS = 6000;

const EarthSceneWrapper = () => {
  const earthRef = useRef<THREE.Group>(null);
  const coinRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (!earthRef.current || !coinRef.current) return;

    // Timeline for the transformation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".transform-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Initial setup
    gsap.set(earthRef.current.position, { x: 3, y: 0, z: 0 }); // Hero phase Right 
    gsap.set(earthRef.current.scale, { x: 2, y: 2, z: 2 });
    gsap.set(coinRef.current.position, { x: 0, y: 0, z: 0 }); // We will move Earth to center left, and swap
    gsap.set(coinRef.current.scale, { x: 0, y: 0, z: 0 }); // hide initially
    gsap.set(coinRef.current.rotation, { x: Math.PI / 2, y: 0, z: 0 }); // lay flat initially or vertical

    // Phase B: Move left & center
    tl.to(earthRef.current.position, {
      x: -2,
      duration: 1,
      ease: "power2.inOut",
    }, 0);

    // Phase C: Morph to Coin
    // Scale down earth, scale up coin
    tl.to(earthRef.current.scale, {
      x: 0, y: 0, z: 0,
      duration: 0.5,
      ease: "power3.in",
    }, 1);

    tl.to(coinRef.current.scale, {
      x: 2.5, y: 2.5, z: 2.5,
      duration: 0.8,
      ease: "power3.out",
    }, 1.2);
    
    tl.to(coinRef.current.position, {
      x: -2, y: 0, z: 0,
      duration: 0,
    }, 1);
    
    tl.to(coinRef.current.rotation, {
      y: Math.PI * 4, // spin reveal
      x: Math.PI / 2.5, 
      duration: 1.5,
      ease: "power2.out",
    }, 1.2);

  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} intensity={1.5} penumbra={1} color="#6EA8FF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
      
      <group ref={earthRef} visible={false}>
        <EarthModel />
      </group>

      
      <group ref={coinRef} visible={false}>
        <AlgoCoinModel />
      </group>


      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

export function StickyEarthTransform() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    window.scrollTo({ top: 0, behavior: "auto" });
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      setIntroComplete(true);
      document.body.style.overflow = previousOverflow;
      ScrollTrigger.refresh();
    }, HERO_LOCK_MS);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useGSAP(() => {
    // Text opacity animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".transform-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Text reveals
    tl.to(".text-1", { opacity: 1, y: 0, duration: 0.2 }, 0.1);
    tl.to(".text-1", { opacity: 0, y: -50, duration: 0.2 }, 0.4);

    tl.to(".text-2", { opacity: 1, y: 0, duration: 0.2 }, 0.5);
    tl.to(".text-2", { opacity: 0, y: -50, duration: 0.2 }, 0.8);

    tl.to(".text-3", { opacity: 1, y: 0, duration: 0.2 }, 0.9);
    tl.to(".text-3", { opacity: 0, y: -50, duration: 0.2 }, 1.3);

    tl.to(".text-4", { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 0.5 }, 1.4);
    
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full relative bg-[#05070D] text-white overflow-hidden">
      {/* 400vh container to drive scroll */}
      <div className="transform-container w-full h-[400vh] relative">
        
        {/* Sticky Canvas and overlays */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          
          <div className="absolute inset-0 z-0 text-[#05070D]">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
              <React.Suspense fallback={null}>
                <EarthSceneWrapper />
              </React.Suspense>
            </Canvas>
          </div>

          
          {/* Overlays */}
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center">
             {/* Text 1 */}
             <div className="text-1 absolute w-full text-center px-4 md:px-20 top-1/2 left-0 -translate-y-1/2 opacity-0">

                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
                  Global. Liquid. Programmable.
                </h2>
             </div>

             {/* Text 2 */}
             <div className="text-2 absolute w-full text-center px-4 md:px-20 top-1/2 left-0 -translate-y-1/2 opacity-0">

                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-glow">
                  From Global Infrastructure...
                </h2>
             </div>

             {/* Text 3 */}
             <div className="text-3 absolute w-full text-center px-4 md:px-20 top-1/2 left-0 -translate-y-1/2 opacity-0">

                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
                  ...To ALGO-Native Internet Money
                </h2>
             </div>

             {/* Text 4 - Coin Reveal Text */}
             <div className="text-4 absolute md:left-[55%] md:w-1/2 px-4 top-1/2 -translate-y-1/2 opacity-0 blur-md scale-95 flex flex-col gap-6">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase text-glow drop-shadow-2xl">
                  ALGORAND
                </h2>
                <h3 className="text-3xl text-[rgba(255,255,255,0.7)] font-light">
                   To the Future of Internet Finance
                </h3>
             </div>
          </div>

          {/* Hero Section overlays on top of the first vh */}
          <div className="absolute inset-x-0 top-0 h-screen pointer-events-auto">
             <HeroSection introComplete={introComplete} />
          </div>

        </div>
      </div>

      {/* Continuation of page */}
      <div className="relative z-20 bg-[#05070D]">
        <ReadyToStart />
        <TransparencySection />
        <HighlightsSection />
        <Footer />
      </div>
    </div>
  );
}
