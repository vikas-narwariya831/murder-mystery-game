import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface Clue3DViewerProps {
  clueId: string;
  isScanning: boolean;
}

export const ForensicClue3DViewer: React.FC<Clue3DViewerProps> = ({ clueId, isScanning }) => {
  const objectGroupRef = useRef<THREE.Group>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);
  const liquidRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Smooth 3D specimen hovering & orbital inspection rotation
    if (objectGroupRef.current) {
      objectGroupRef.current.rotation.y = t * 0.7;
      objectGroupRef.current.position.y = Math.sin(t * 1.5) * 0.08;
    }

    // Interactive Laser Scanner effect
    if (scanRingRef.current) {
      if (isScanning) {
        scanRingRef.current.visible = true;
        scanRingRef.current.position.y = Math.sin(t * 5) * 1.1;
      } else {
        scanRingRef.current.visible = false;
      }
    }

    // Mug liquid slight ripple
    if (liquidRef.current) {
      liquidRef.current.scale.y = 1 + Math.sin(t * 4) * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* High-Key Clean Studio Lighting for Forensic Clue Specimen */}
      <ambientLight intensity={1.8} color="#ffffff" />
      <directionalLight position={[4, 6, 4]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[-4, -3, -4]} intensity={0.9} color="#38bdf8" />
      <pointLight position={[0, 3, 0]} intensity={18} color="#ffffff" />

      {/* 3D LASER SPECTROMETER SCAN PLANE */}
      <mesh ref={scanRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.01, 1.8, 32]} />
        <meshBasicMaterial 
          color="#38bdf8" 
          transparent 
          opacity={0.45} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Ground Specimen Reflection Pedestal */}
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <cylinderGeometry args={[1.6, 1.8, 0.15, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.12, 0]}>
        <ringGeometry args={[1.3, 1.5, 32]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* SPECIMEN 3D MODELS */}
      <group ref={objectGroupRef}>

        {/* 1. BROKEN CERAMIC ESPRESSO MUG WITH POISON RESIDUE */}
        {clueId === 'broken-mug' && (
          <group position={[0, -0.2, 0]}>
            {/* Main Ceramic Mug Cylinder */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.65, 0.55, 1.1, 32, 1, true]} />
              <meshStandardMaterial 
                color="#f8fafc" 
                roughness={0.2} 
                metalness={0.1} 
                side={THREE.DoubleSide} 
              />
            </mesh>

            {/* Mug Bottom Base */}
            <mesh position={[0, -0.52, 0]}>
              <cylinderGeometry args={[0.55, 0.55, 0.06, 32]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
            </mesh>

            {/* Lethal Cyanide Espresso Liquid Inside */}
            <mesh ref={liquidRef} position={[0, -0.15, 0]}>
              <cylinderGeometry args={[0.6, 0.52, 0.6, 32]} />
              <meshStandardMaterial 
                color="#261005" 
                roughness={0.1} 
                metalness={0.3} 
                emissive="#047857" 
                emissiveIntensity={isScanning ? 0.8 : 0.2} 
              />
            </mesh>

            {/* Mug Handle */}
            <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.35, 0.08, 16, 32, Math.PI]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.2} />
            </mesh>

            {/* Shattered Ceramic Fracture Chips on Pedestal */}
            <mesh position={[-0.7, -0.9, 0.4]} rotation={[0.4, 0.5, 0]}>
              <coneGeometry args={[0.2, 0.1, 4]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
            <mesh position={[0.6, -0.9, -0.5]} rotation={[-0.3, 0.8, 0.2]}>
              <boxGeometry args={[0.25, 0.05, 0.15]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
          </group>
        )}

        {/* 2. UNLABELED CYANIDE GLASS DROPPER VIAL */}
        {clueId === 'cyanide-vial' && (
          <group position={[0, -0.1, 0]}>
            {/* Glass Cylinder Vial */}
            <mesh castShadow>
              <cylinderGeometry args={[0.28, 0.28, 1.2, 24]} />
              <meshPhysicalMaterial 
                color="#e0f2fe" 
                transmission={0.9} 
                opacity={1} 
                transparent 
                roughness={0.05} 
                ior={1.5} 
                thickness={0.5} 
              />
            </mesh>

            {/* Chemical Cyanide Liquid Inside Dropper */}
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.75, 24]} />
              <meshStandardMaterial 
                color="#065f46" 
                emissive="#10b981" 
                emissiveIntensity={isScanning ? 1.5 : 0.6} 
                roughness={0.2} 
              />
            </mesh>

            {/* Black Rubber Pipette Squeeze Bulb */}
            <mesh position={[0, 0.75, 0]}>
              <sphereGeometry args={[0.26, 20, 20]} />
              <meshStandardMaterial color="#18181b" roughness={0.7} />
            </mesh>

            {/* Dropper Cap Screw Ring */}
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.32, 0.32, 0.18, 24]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        )}

        {/* 3. EXECUTIVE LEVEL 5 GOLDEN MASTER KEYCARD */}
        {clueId === 'keycard-override' && (
          <group position={[0, 0, 0]} rotation={[0.4, 0.3, 0]}>
            {/* Titanium RFID Card Body */}
            <RoundedBox args={[1.9, 1.2, 0.06]} radius={0.06} smoothness={4} castShadow>
              <meshStandardMaterial 
                color="#d97706" 
                metalness={0.9} 
                roughness={0.15} 
                emissive="#f59e0b"
                emissiveIntensity={0.2}
              />
            </RoundedBox>

            {/* Smart Microchip Embed */}
            <mesh position={[-0.45, 0, 0.035]}>
              <boxGeometry args={[0.35, 0.35, 0.01]} />
              <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
            </mesh>

            {/* Black Magnetic Security Stripe */}
            <mesh position={[0, 0.28, -0.035]}>
              <boxGeometry args={[1.85, 0.25, 0.01]} />
              <meshStandardMaterial color="#09090b" roughness={0.4} />
            </mesh>
          </group>
        )}

        {/* 4. QUANTUM TERMINAL HARDWARE DRIVE */}
        {clueId === 'tampered-terminal' && (
          <group position={[0, -0.1, 0]}>
            {/* Encrypted Hardware Key / USB Module */}
            <RoundedBox args={[0.7, 1.4, 0.25]} radius={0.04} smoothness={4} castShadow>
              <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
            </RoundedBox>
            {/* Gold Connector Tip */}
            <mesh position={[0, 0.85, 0]}>
              <boxGeometry args={[0.42, 0.35, 0.12]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Glowing Activity LED */}
            <mesh position={[0, -0.3, 0.13]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial 
                color="#ef4444" 
                emissive="#ef4444" 
                emissiveIntensity={3} 
              />
            </mesh>
          </group>
        )}

      </group>
    </group>
  );
};
