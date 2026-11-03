import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface ServerVault3DProps {
  activeNode: number;
  solvedNodes: number[];
  isBreached: boolean;
}

export const ServerVault3D: React.FC<ServerVault3DProps> = ({
  activeNode,
  solvedNodes,
  isBreached,
}) => {
  const centralCoreRef = useRef<THREE.Group>(null);
  const dataRaysRef = useRef<THREE.Points>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const laserBeamRef = useRef<THREE.Mesh>(null);

  // Floating stream matrix particles
  const particleCount = 180;
  const particlePositions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 6 - 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Central Core Pulse & Float
    if (centralCoreRef.current) {
      centralCoreRef.current.rotation.y = t * 0.8;
      centralCoreRef.current.position.y = 1.8 + Math.sin(t * 2) * 0.1;
    }

    // Holographic Gyroscopic Firewall Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 1.2;
      ring1Ref.current.rotation.y = t * 0.6;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 1.5;
      ring2Ref.current.rotation.z = t * 0.9;
    }

    // Laser Beam Scan Frequency
    if (laserBeamRef.current) {
      laserBeamRef.current.scale.y = 1 + Math.sin(t * 8) * 0.15;
    }

    // Cyberpunk Particle Drift
    if (dataRaysRef.current) {
      dataRaysRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── HIGH-TECH SERVER ROOM STUDIO LIGHTING ── */}
      <ambientLight intensity={0.5} color="#0f172a" />
      <directionalLight position={[6, 12, 6]} intensity={1.5} color="#38bdf8" />
      <directionalLight position={[-6, 12, -6]} intensity={1.2} color="#6366f1" />
      <pointLight position={[0, 4, 0]} intensity={isBreached ? 45 : 30} color={isBreached ? '#10b981' : '#06b6d4'} distance={14} />

      {/* Ground Cyber Floor with Reflective Blue Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[26, 26]} />
        <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
      </mesh>
      <gridHelper args={[26, 26, '#38bdf8', '#0f172a']} position={[0, 0.005, 0]} />

      {/* Vault Back Firewall Wall */}
      <mesh position={[0, 3.5, -8]}>
        <planeGeometry args={[26, 8]} />
        <meshStandardMaterial color="#020617" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Floating Cybernetic Particles */}
      <points ref={dataRaysRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.06} 
          color={isBreached ? '#34d399' : '#38bdf8'} 
          transparent 
          opacity={0.8} 
        />
      </points>

      {/* ── 3D SERVER TOWER RACKS (Left & Right Corridors) ── */}
      {[-4.5, -2.2, 2.2, 4.5].map((xPos, idx) => {
        const isRackActive = (activeNode === 1 && idx === 0) || (activeNode === 2 && idx === 1) || (activeNode === 3 && idx === 2);
        const isRackSolved = solvedNodes.includes(idx + 1);

        return (
          <group key={idx} position={[xPos, 0, -2.5]}>
            {/* Server Rack Heavy Matte Black Casing */}
            <RoundedBox args={[1.3, 3.8, 1.2]} radius={0.04} smoothness={4} position={[0, 1.9, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#090d16" metalness={0.85} roughness={0.25} />
            </RoundedBox>

            {/* Front Server Blade Tray Slots */}
            {[0.6, 1.2, 1.8, 2.4, 3.0].map((y, slotIdx) => (
              <group key={slotIdx} position={[0, y, 0.61]}>
                {/* Horizontal Tray Plate */}
                <mesh>
                  <planeGeometry args={[1.15, 0.45]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
                </mesh>

                {/* Blinking Blade LED Activity Indicators */}
                {[-0.45, -0.25, -0.05, 0.15, 0.35].map((xLed, ledIdx) => (
                  <mesh key={ledIdx} position={[xLed, 0, 0.01]}>
                    <sphereGeometry args={[0.025, 8, 8]} />
                    <meshBasicMaterial 
                      color={
                        isRackSolved 
                          ? '#10b981' 
                          : isRackActive 
                          ? (ledIdx % 2 === 0 ? '#38bdf8' : '#f59e0b') 
                          : '#475569'
                      } 
                    />
                  </mesh>
                ))}
              </group>
            ))}

            {/* Top Server Tower Pillar Status Halo */}
            <mesh position={[0, 3.9, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.08, 16]} />
              <meshBasicMaterial 
                color={isRackSolved ? '#10b981' : isRackActive ? '#38bdf8' : '#334155'} 
              />
            </mesh>
          </group>
        );
      })}

      {/* ── CENTRAL FLOATING QUANTUM MAINFRAME CORE ── */}
      <group ref={centralCoreRef}>
        {/* Core Glowing Hologram Icosahedron */}
        <mesh>
          <icosahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial 
            color="#0284c7" 
            emissive={isBreached ? '#10b981' : '#0284c7'} 
            emissiveIntensity={3.0} 
            wireframe 
          />
        </mesh>

        {/* Solid Inner Quantum Crystal */}
        <mesh scale={0.5}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color="#38bdf8" 
            emissive={isBreached ? '#34d399' : '#38bdf8'} 
            emissiveIntensity={4.5} 
            transparent 
            opacity={0.85} 
          />
        </mesh>

        {/* Outer Counter-Rotating Firewall Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.6, 0.03, 16, 64]} />
          <meshStandardMaterial 
            color="#6366f1" 
            emissive="#818cf8" 
            emissiveIntensity={2.5} 
          />
        </mesh>
        <mesh ref={ring2Ref}>
          <torusGeometry args={[2.0, 0.03, 16, 64]} />
          <meshStandardMaterial 
            color="#06b6d4" 
            emissive="#22d3ee" 
            emissiveIntensity={2.2} 
          />
        </mesh>
      </group>

      {/* Quantum Power Feed Base Pedestal */}
      <group position={[0, 0.1, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[2.2, 2.6, 0.25, 32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <ringGeometry args={[1.8, 2.1, 32]} />
          <meshBasicMaterial 
            color={isBreached ? '#10b981' : '#38bdf8'} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      </group>

      {/* Laser Link Data Cables to Floor */}
      <mesh ref={laserBeamRef} position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3.6, 12]} />
        <meshBasicMaterial 
          color={isBreached ? '#34d399' : '#38bdf8'} 
          transparent 
          opacity={0.7} 
        />
      </mesh>
    </group>
  );
};
