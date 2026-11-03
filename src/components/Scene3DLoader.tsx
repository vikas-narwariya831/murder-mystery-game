import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface Scene3DLoaderProps {
  progress?: number;
  label?: string;
}

export const Scene3DLoader: React.FC<Scene3DLoaderProps> = ({ 
  progress = 0, 
  label = "INITIALIZING FORENSIC MATRIX" 
}) => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate sci-fi particles
  const particleCount = 60;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.2 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = t * 0.9;
      outerRingRef.current.rotation.y = t * 1.2;
    }
    if (midRingRef.current) {
      midRingRef.current.rotation.y = -t * 1.4;
      midRingRef.current.rotation.z = t * 0.8;
    }
    if (innerCoreRef.current) {
      const scale = 1 + Math.sin(t * 6) * 0.08;
      innerCoreRef.current.scale.set(scale, scale, scale);
      innerCoreRef.current.rotation.y = t * 2.0;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.3;
      particlesRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
  });

  const displayPercent = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <group position={[0, 1.8, 0]}>
      {/* Dynamic Lighting for 3D Loader */}
      <pointLight position={[0, 0, 0]} intensity={25} color="#38bdf8" distance={10} />
      <pointLight position={[0, 2, 2]} intensity={15} color="#818cf8" distance={8} />

      {/* Floating Particles Dust */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#38bdf8" transparent opacity={0.7} />
      </points>

      {/* Outer Holographic Torus Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.5, 0.03, 16, 64]} />
        <meshStandardMaterial 
          color="#0284c7" 
          emissive="#38bdf8" 
          emissiveIntensity={2.5} 
          roughness={0.1} 
          metalness={0.9} 
        />
      </mesh>

      {/* Mid Gimbal Ring */}
      <mesh ref={midRingRef}>
        <torusGeometry args={[1.1, 0.035, 16, 64]} />
        <meshStandardMaterial 
          color="#6366f1" 
          emissive="#818cf8" 
          emissiveIntensity={2.8} 
          roughness={0.1} 
          metalness={0.9} 
        />
      </mesh>

      {/* Core Quantum Floating Polyhedron */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial 
          color="#0f172a" 
          emissive="#06b6d4" 
          emissiveIntensity={1.8} 
          wireframe 
        />
      </mesh>

      {/* Solid Inner Glowing Crystal Core */}
      <mesh scale={0.4}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial 
          color="#38bdf8" 
          emissive="#38bdf8" 
          emissiveIntensity={4.0} 
          transparent 
          opacity={0.85} 
        />
      </mesh>

      {/* Hologram Floating 3D Text Display */}
      <group position={[0, -1.8, 0]}>
        <Text
          position={[0, 0.35, 0]}
          fontSize={0.28}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          {`${displayPercent}%`}
        </Text>

        <Text
          position={[0, 0, 0]}
          fontSize={0.12}
          color="#cbd5e1"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          {label.toUpperCase()}
        </Text>

        <Text
          position={[0, -0.22, 0]}
          fontSize={0.09}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
        >
          COMPILING SHADERS & STREAMING GEOMETRY...
        </Text>
      </group>
    </group>
  );
};
