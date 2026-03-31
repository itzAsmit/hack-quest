"use client";

import React, { useRef } from "react";
import { Cylinder, Text3D, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function AlgoCoinModel(props: any) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005; // Base spin
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Coin main body */}
      <Cylinder args={[1.5, 1.5, 0.2, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#a8b8cc"
          metalness={1}
          roughness={0.15}
        />
      </Cylinder>
      
      {/* Coin border/rim */}
      <Cylinder args={[1.55, 1.55, 0.22, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color="#6EA8FF"
          metalness={0.8}
          roughness={0.2}
          emissive="#2A5C9A"
          emissiveIntensity={0.5}
        />
      </Cylinder>
      
      {/* Algorand Symbol (A) Placeholder using Basic Geometry or Text */}
      <group position={[0, 0, 0.11]}>
         {/* Simple A Shape using a cone and gap, or just a logo */}
         <mesh rotation={[Math.PI / 2, 0, 0]}>
           <cylinderGeometry args={[0, 0.6, 1.2, 3]} />
           <meshStandardMaterial color="#ffffff" emissive="#6EA8FF" emissiveIntensity={0.8} />
         </mesh>
      </group>
      
      {/* Back side symbol */}
      <group position={[0, 0, -0.11]} rotation={[0, Math.PI, 0]}>
         <mesh rotation={[Math.PI / 2, 0, 0]}>
           <cylinderGeometry args={[0, 0.6, 1.2, 3]} />
           <meshStandardMaterial color="#ffffff" emissive="#6EA8FF" emissiveIntensity={0.8} />
         </mesh>
      </group>
    </group>
  );
}
