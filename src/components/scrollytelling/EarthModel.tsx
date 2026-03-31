"use client";

import React, { useRef } from "react";
import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function EarthModel(props: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // We can add subtle glow or rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group {...props}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <meshStandardMaterial 
          color="#0a1930" 
          emissive="#0f2547"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </Sphere>
      
      {/* Atmosphere / Glow Shell */}
      <Sphere args={[1.52, 32, 32]}>
        <meshPhysicalMaterial 
          color="#6EA8FF"
          transparent
          opacity={0.15}
          roughness={0}
          transmission={0.9}
          thickness={0.5}
        />
      </Sphere>
      
      {/* Light dot representation of cities/nodes */}
      <points>
        <sphereGeometry args={[1.51, 32, 32]} />
        <pointsMaterial 
          size={0.02} 
          color="#6EA8FF" 
          transparent 
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
