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
  const centralHoloRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const screenGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Floating Hologram above terminal
    if (centralHoloRef.current) {
      centralHoloRef.current.rotation.y = t * 0.9;
      centralHoloRef.current.position.y = 2.45 + Math.sin(t * 2.5) * 0.08;
    }

    // Holographic Gyro Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 1.4;
      ring1Ref.current.rotation.y = t * 0.7;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 1.6;
      ring2Ref.current.rotation.z = t * 1.1;
    }

    // Screen light pulse
    if (screenGlowRef.current) {
      screenGlowRef.current.intensity = 1.8 + Math.sin(t * 4) * 0.3;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── HIGH-TECH SERVER ROOM STUDIO LIGHTING ── */}
      <ambientLight intensity={1.4} color="#e2e8f0" />
      <directionalLight position={[6, 12, 6]} intensity={3.0} color="#f8fafc" castShadow />
      <directionalLight position={[-6, 10, -4]} intensity={2.2} color="#38bdf8" />
      <pointLight 
        position={[0, 4.2, 0]} 
        intensity={isBreached ? 40 : 28} 
        color={isBreached ? '#10b981' : '#38bdf8'} 
        distance={20} 
      />

      {/* Ceiling Fluorescent Server Room Light Panels */}
      {[-3, 0, 3].map((x, i) => (
        <group key={i} position={[x, 5.4, 0]}>
          <mesh>
            <boxGeometry args={[1.6, 0.08, 5]} />
            <meshStandardMaterial 
              color="#f8fafc" 
              emissive="#ffffff" 
              emissiveIntensity={1.8} 
            />
          </mesh>
          <pointLight position={[0, -0.2, 0]} intensity={12} color="#ffffff" distance={8} />
        </group>
      ))}

      {/* ── HIGH-TECH RAISED FLOOR (Clean Industrial Slate Tiles) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Crisp Server Room Floor Tile Lines */}
      <gridHelper args={[24, 24, '#64748b', '#475569']} position={[0, 0.005, 0]} />

      {/* ── MODERN SERVER ROOM WALLS (Datacenter Slate Panelling) ── */}
      {/* Back Wall */}
      <mesh position={[0, 3, -6]} receiveShadow>
        <planeGeometry args={[24, 6.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-11, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 6.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[11, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 6.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* ── 3D SERVER TOWER RACKS (Steel Gray Industrial Datacenter Racks) ── */}
      {[-4.8, -2.6, 2.6, 4.8].map((xPos, idx) => {
        const isRackActive = (activeNode === 1 && idx === 0) || (activeNode === 2 && idx === 1) || (activeNode === 3 && idx === 2);
        const isRackSolved = solvedNodes.includes(idx + 1);

        return (
          <group key={idx} position={[xPos, 0, -2.4]}>
            {/* Server Rack Solid Steel Chassis */}
            <RoundedBox args={[1.5, 4.2, 1.3]} radius={0.05} smoothness={4} position={[0, 2.1, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.35} />
            </RoundedBox>

            {/* Front Server Blade Unit Drawers (Visible Shelves) */}
            {[0.6, 1.2, 1.8, 2.4, 3.0, 3.6].map((y, slotIdx) => (
              <group key={slotIdx} position={[0, y, 0.64]}>
                {/* Horizontal Blade Module Faceplate */}
                <mesh>
                  <planeGeometry args={[1.32, 0.48]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
                </mesh>

                {/* Ventilation Slits */}
                {[-0.25, 0, 0.25].map((gx, gIdx) => (
                  <mesh key={gIdx} position={[gx, -0.06, 0.01]}>
                    <planeGeometry args={[0.16, 0.12]} />
                    <meshStandardMaterial color="#0f172a" />
                  </mesh>
                ))}

                {/* Blinking Activity LEDs */}
                {[-0.5, -0.35, -0.2, 0.35, 0.5].map((xLed, ledIdx) => (
                  <mesh key={ledIdx} position={[xLed, 0.08, 0.02]}>
                    <sphereGeometry args={[0.035, 8, 8]} />
                    <meshStandardMaterial 
                      color={
                        isRackSolved 
                          ? '#10b981' 
                          : isRackActive 
                          ? (ledIdx % 2 === 0 ? '#38bdf8' : '#f59e0b') 
                          : '#94a3b8'
                      }
                      emissive={
                        isRackSolved 
                          ? '#10b981' 
                          : isRackActive 
                          ? (ledIdx % 2 === 0 ? '#0284c7' : '#d97706') 
                          : '#475569'
                      }
                      emissiveIntensity={isRackActive || isRackSolved ? 3 : 0.4}
                    />
                  </mesh>
                ))}
              </group>
            ))}

            {/* Server Rack Crown LED Beacon */}
            <mesh position={[0, 4.25, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
              <meshStandardMaterial 
                color={isRackSolved ? '#10b981' : isRackActive ? '#38bdf8' : '#64748b'}
                emissive={isRackSolved ? '#10b981' : isRackActive ? '#0284c7' : '#475569'}
                emissiveIntensity={1.8} 
              />
            </mesh>
          </group>
        );
      })}

      {/* ── CENTRAL MASTER WORKSTATION & DESK (MAIN PC CONSOLE) ── */}
      <group position={[0, 0, 0.8]}>
        {/* Sleek Curved Command Desk */}
        <RoundedBox args={[3.2, 0.12, 1.4]} radius={0.04} smoothness={4} position={[0, 0.9, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
        </RoundedBox>

        {/* Desk Heavy Steel Legs */}
        {[-1.4, 1.4].map((lx, li) => (
          <group key={li} position={[lx, 0.45, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.9, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.44, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* ── MAIN HIGH-TECH PC SYSTEM TOWER ON DESK ── */}
        <group position={[1.2, 1.35, 0]}>
          {/* PC Chassis */}
          <RoundedBox args={[0.32, 0.72, 0.62]} radius={0.03} smoothness={4} castShadow>
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} />
          </RoundedBox>
          {/* Tempered Glass Side with Blue Glow */}
          <mesh position={[-0.165, 0, 0]}>
            <planeGeometry args={[0.56, 0.66]} />
            <meshPhysicalMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.2} transparent opacity={0.65} />
          </mesh>
          {/* Dual Cooling Fans */}
          {[0.15, -0.15].map((fy, fi) => (
            <mesh key={fi} position={[0, fy, 0.315]}>
              <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
            </mesh>
          ))}
        </group>

        {/* ── DUAL ULTRAWIDE HACKING MONITORS ── */}
        {/* Center Main PC Monitor */}
        <group position={[0, 1.45, -0.1]}>
          {/* Monitor Screen Frame */}
          <RoundedBox args={[1.5, 0.85, 0.06]} radius={0.02} smoothness={3} castShadow>
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.4} />
          </RoundedBox>
          {/* Glowing Active Cyber Hacking Display Screen */}
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[1.44, 0.79]} />
            <meshStandardMaterial 
              color={isBreached ? '#064e3b' : '#0369a1'} 
              emissive={isBreached ? '#10b981' : '#0284c7'} 
              emissiveIntensity={1.5} 
            />
          </mesh>
          {/* Stand & Base */}
          <mesh position={[0, -0.48, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.63, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.03, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
        </group>

        {/* Left Angled Secondary Telemetry Monitor */}
        <group position={[-1.15, 1.45, 0.05]} rotation={[0, 0.35, 0]}>
          <RoundedBox args={[0.85, 0.75, 0.05]} radius={0.02} smoothness={3} castShadow>
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.4} />
          </RoundedBox>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.8, 0.7]} />
            <meshStandardMaterial 
              color="#312e81" 
              emissive="#6366f1" 
              emissiveIntensity={1.3} 
            />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.3, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
        </group>

        {/* Keyboard & Mouse Pad */}
        <group position={[0, 0.98, 0.3]}>
          {/* Backlit Mechanical Keyboard */}
          <mesh position={[-0.1, 0, 0]}>
            <boxGeometry args={[0.7, 0.025, 0.24]} />
            <meshStandardMaterial color="#334155" metalness={0.6} />
          </mesh>
          {/* Glowing Keycaps Glow */}
          <mesh position={[-0.1, 0.015, 0]}>
            <planeGeometry args={[0.66, 0.2]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.8} />
          </mesh>
          {/* Ergonomic Gaming Mouse */}
          <mesh position={[0.42, 0.015, 0]}>
            <capsuleGeometry args={[0.035, 0.07, 4, 8]} />
            <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={1.5} />
          </mesh>
        </group>

        {/* Point light shining from PC monitor onto keyboard and detective desk */}
        <pointLight 
          ref={screenGlowRef} 
          position={[0, 1.5, 0.5]} 
          intensity={2.2} 
          color={isBreached ? '#34d399' : '#38bdf8'} 
          distance={4} 
        />

        {/* ── HOLOGRAPHIC QUANTUM NODE PROJECTION ABOVE DESK ── */}
        <group ref={centralHoloRef} position={[0, 2.5, -0.1]}>
          {/* Hologram Floating Core Mesh */}
          <mesh>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial 
              color="#38bdf8" 
              emissive={isBreached ? '#34d399' : '#38bdf8'} 
              emissiveIntensity={3.5} 
              transparent 
              opacity={0.85} 
            />
          </mesh>
          {/* Wireframe Gyroscope Cage */}
          <mesh>
            <icosahedronGeometry args={[0.65, 0]} />
            <meshStandardMaterial 
              color="#0284c7" 
              emissive={isBreached ? '#10b981' : '#0ea5e9'} 
              emissiveIntensity={2.5} 
              wireframe 
            />
          </mesh>
          {/* Holographic Concentric Rings */}
          <mesh ref={ring1Ref}>
            <torusGeometry args={[0.9, 0.02, 16, 48]} />
            <meshStandardMaterial color="#6366f1" emissive="#818cf8" emissiveIntensity={3} />
          </mesh>
          <mesh ref={ring2Ref}>
            <torusGeometry args={[1.1, 0.02, 16, 48]} />
            <meshStandardMaterial color="#06b6d4" emissive="#22d3ee" emissiveIntensity={2.8} />
          </mesh>
        </group>
      </group>

      {/* ── HIGH-TECH OPERATOR SWIVEL CHAIR ── */}
      <group position={[0, 0, 2.2]} rotation={[0, Math.PI, 0]}>
        {/* Seat cushion */}
        <RoundedBox args={[0.7, 0.1, 0.65]} radius={0.03} smoothness={3} position={[0, 0.65, 0]} castShadow>
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </RoundedBox>
        {/* Ergonomic Backrest */}
        <RoundedBox args={[0.65, 0.9, 0.1]} radius={0.04} smoothness={3} position={[0, 1.15, -0.3]} castShadow>
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </RoundedBox>
        {/* Hydraulic Stem & 5-Star Wheel Base */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.05, 5]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
