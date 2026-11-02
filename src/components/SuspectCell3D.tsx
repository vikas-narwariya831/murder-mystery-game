import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface Suspect3DProps {
  suspectId: string;
  panicLevel: number;
}

export const SuspectCell3D: React.FC<Suspect3DProps> = ({ suspectId, panicLevel }) => {
  const headRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  const isEvelyn = suspectId === 'evelyn';
  const isMarcus = suspectId === 'marcus';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const tensionSpeed = panicLevel > 60 ? 4 : 2;

    // Idle breathing & nervousness
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(t * tensionSpeed) * (panicLevel > 60 ? 0.04 : 0.02);
    }
    // Head fidgeting when nervous
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.2) * (panicLevel > 60 ? 0.25 : 0.08);
      headRef.current.rotation.z = Math.sin(t * 2) * (panicLevel > 60 ? 0.08 : 0);
    }
    // Defensive folded arms gesture
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = Math.sin(t * 1.5) * 0.05 + 0.3;
      rightArmRef.current.rotation.z = -Math.sin(t * 1.5) * 0.05 - 0.3;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── LIGHTING (Prison Cell Cold Spotlight) ─────────── */}
      <ambientLight intensity={0.8} color="#e2e8f0" />
      <spotLight
        position={[0, 6, 2]}
        intensity={35}
        angle={0.6}
        penumbra={0.5}
        color={panicLevel > 60 ? '#fca5a5' : '#ffffff'}
        castShadow
      />
      <pointLight position={[0, 2, -3]} intensity={15} color="#38bdf8" />

      {/* ── PRISON CELL CONCRETE ROOM ─────────────────────── */}
      {/* Back Wall */}
      <mesh position={[0, 2.5, -4]}>
        <boxGeometry args={[10, 7, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* ── 3D SUSPECT AVATAR IN CELL ─────────────────────── */}
      <group ref={bodyRef} position={[0, 0, -1.8]}>
        {/* Shadow */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <circleGeometry args={[0.5, 20]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.35} />
        </mesh>

        {/* Shoes */}
        <mesh position={[-0.16, 0.08, 0]} castShadow>
          <boxGeometry args={[0.13, 0.1, 0.28]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.16, 0.08, 0]} castShadow>
          <boxGeometry args={[0.13, 0.1, 0.28]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.16, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.0, 14]} />
          <meshStandardMaterial color={isEvelyn ? '#1e1b4b' : '#334155'} />
        </mesh>
        <mesh position={[0.16, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.0, 14]} />
          <meshStandardMaterial color={isEvelyn ? '#1e1b4b' : '#334155'} />
        </mesh>

        {/* Torso */}
        <mesh position={[0, 1.58, 0]} castShadow>
          <boxGeometry args={[0.54, 0.88, 0.3]} />
          <meshStandardMaterial 
            color={
              isEvelyn ? '#4c1d95' : // Luxury aristocratic purple dress
              isMarcus ? '#f8fafc' : // White scientist lab coat
              '#0284c7' // AI holo synth
            } 
            roughness={0.5} 
          />
        </mesh>

        {/* Evelyn's Golden Necklace / Marcus Lab Badge */}
        {isEvelyn && (
          <mesh position={[0, 1.85, 0.155]}>
            <torusGeometry args={[0.08, 0.015, 8, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
        )}
        {isMarcus && (
          <mesh position={[-0.14, 1.8, 0.155]}>
            <planeGeometry args={[0.08, 0.12]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        )}

        {/* Arms (Crossed / Defensive) */}
        <mesh ref={leftArmRef} position={[-0.34, 1.55, 0.1]} rotation={[0.4, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.75, 12]} />
          <meshStandardMaterial 
            color={isEvelyn ? '#4c1d95' : isMarcus ? '#f8fafc' : '#0284c7'} 
          />
        </mesh>
        <mesh ref={rightArmRef} position={[0.34, 1.55, 0.1]} rotation={[0.4, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.07, 0.06, 0.75, 12]} />
          <meshStandardMaterial 
            color={isEvelyn ? '#4c1d95' : isMarcus ? '#f8fafc' : '#0284c7'} 
          />
        </mesh>

        {/* Silk Gloves on Evelyn's hands! */}
        {isEvelyn && (
          <mesh position={[0, 1.35, 0.2]}>
            <boxGeometry args={[0.25, 0.08, 0.08]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
          </mesh>
        )}

        {/* Head + Hair + Face */}
        <group ref={headRef} position={[0, 2.22, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.18, 18, 18]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.4} />
          </mesh>

          {/* Hair Styling */}
          {isEvelyn ? (
            // Elegant Dark Bun
            <group position={[0, 0.08, -0.04]}>
              <mesh>
                <sphereGeometry args={[0.19, 16, 16]} />
                <meshStandardMaterial color="#18181b" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.1, -0.1]}>
                <sphereGeometry args={[0.1, 14, 14]} />
                <meshStandardMaterial color="#18181b" />
              </mesh>
            </group>
          ) : (
            // Marcus Glasses & Messy Hair
            <group position={[0, 0.05, 0]}>
              <mesh position={[0, 0.08, -0.04]}>
                <sphereGeometry args={[0.185, 16, 16]} />
                <meshStandardMaterial color="#451a03" />
              </mesh>
              {/* Glasses frame */}
              <mesh position={[0, -0.02, 0.16]}>
                <boxGeometry args={[0.26, 0.06, 0.04]} />
                <meshStandardMaterial color="#000000" metalness={0.8} />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* ── 3D IRON PRISON CELL BARS (FOREGROUND) ─────────── */}
      <group position={[0, 2, 0.2]}>
        {[-2.2, -1.8, -1.4, -1.0, -0.6, -0.2, 0.2, 0.6, 1.0, 1.4, 1.8, 2.2].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 5.0, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Horizontal Crossbars */}
        {[-1.8, 0, 1.8].map((y, i) => (
          <mesh key={i} position={[0, y, 0.02]}>
            <boxGeometry args={[5.0, 0.08, 0.08]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Overhead CCTV Camera */}
      <group position={[2.2, 4.2, -0.8]} rotation={[0.4, -0.5, 0]}>
        <RoundedBox args={[0.2, 0.2, 0.4]} radius={0.02}>
          <meshStandardMaterial color="#1e293b" />
        </RoundedBox>
        <mesh position={[0, 0, 0.22]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
};
