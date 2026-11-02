import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PandaDetective } from './PandaDetective';
import { GamingChair3D } from './GamingChair3D';

interface Scene3DInterrogationProps {
  suspectId: string;
  isSpeaking: boolean;
}

export const CinematicInterrogation3D: React.FC<Scene3DInterrogationProps> = ({
  suspectId,
  isSpeaking,
}) => {
  const suspectHeadRef = useRef<THREE.Group>(null);

  const isEvelyn = suspectId === 'evelyn';
  const isMarcus = suspectId === 'marcus';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (suspectHeadRef.current) {
      if (isSpeaking) {
        suspectHeadRef.current.position.y = 2.05 + Math.sin(t * 8) * 0.02;
        suspectHeadRef.current.rotation.y = Math.sin(t * 3) * 0.15;
      } else {
        suspectHeadRef.current.position.y = 2.05 + Math.sin(t * 2) * 0.01;
        suspectHeadRef.current.rotation.y = Math.sin(t * 0.8) * 0.05;
      }
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── HIGH-KEY STUDIO LIGHTING (BRIGHT & CRISP, ZERO BLACK VOID) ── */}
      <ambientLight intensity={2.2} color="#ffffff" />
      <hemisphereLight args={['#ffffff', '#cbd5e1', 1.2]} />
      <directionalLight position={[6, 9, 6]} intensity={1.8} color="#ffffff" castShadow />
      <directionalLight position={[-6, 9, -6]} intensity={1.4} color="#f0f9ff" />
      
      {/* Overhead Soft Box Over Table */}
      <pointLight position={[0, 4.4, 0]} intensity={30} distance={12} color="#ffffff" />

      {/* ── ENCLOSED 3D ROOM (WALLS ON ALL 4 SIDES + CEILING + FLOOR) ─ */}
      {/* 1. Floor: Clean Polished Slate / Cream Tiles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.05} />
      </mesh>
      <gridHelper args={[20, 20, '#cbd5e1', '#e2e8f0']} position={[0, 0.005, 0]} />

      {/* 2. Ceiling with Flush Recessed LED Light Fixtures */}
      <mesh position={[0, 5.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>
      {/* Recessed Ceiling Panels */}
      {[-2, 2].map((x, i) =>
        [-2, 2].map((z, j) => (
          <mesh key={`ceil-${i}-${j}`} position={[x, 5.78, z]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.5, 1.5]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
          </mesh>
        ))
      )}

      {/* 3. North Partition Wall (z = -6.0) with Two-Way Mirror Aperture */}
      {/* Left Wall Segment */}
      <mesh position={[-5.3, 2.9, -6.0]} receiveShadow>
        <boxGeometry args={[5.4, 6, 0.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>
      {/* Right Wall Segment */}
      <mesh position={[5.3, 2.9, -6.0]} receiveShadow>
        <boxGeometry args={[5.4, 6, 0.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>
      {/* Wall Bottom Segment below mirror */}
      <mesh position={[0, 0.75, -6.0]} receiveShadow>
        <boxGeometry args={[5.2, 1.5, 0.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>
      {/* Wall Top Segment above mirror */}
      <mesh position={[0, 5.0, -6.0]} receiveShadow>
        <boxGeometry args={[5.2, 1.8, 0.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>

      {/* Heavy Heavy Duty Two-Way Mirror Frame */}
      <mesh position={[0, 2.85, -6.0]}>
        <boxGeometry args={[5.4, 2.9, 0.24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 🪞 REALISTIC TWO-WAY / DOUBLE-SIDED OBSERVATION MIRROR */}
      <mesh position={[0, 2.85, -6.0]}>
        <planeGeometry args={[5.1, 2.6]} />
        <meshStandardMaterial 
          color="#38bdf8" 
          metalness={0.85} 
          roughness={0.15} 
          transparent 
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Wall Clock above mirror */}
      <mesh position={[0, 4.8, -5.87]}>
        <cylinderGeometry args={[0.35, 0.35, 0.05, 24]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* ── 🕵️ OBSERVATION ROOM ON OTHER SIDE (BEHIND THE TWO-WAY MIRROR) ── */}
      <group position={[0, 0, -8.6]}>
        {/* Dim Ambient Mood Light in Observation Room */}
        <pointLight position={[0, 3.8, 0]} intensity={18} distance={8} color="#0284c7" />

        {/* Observation Room Floor */}
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 5]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Observation Room Back Wall */}
        <mesh position={[0, 2.9, -2.5]}>
          <boxGeometry args={[8, 6, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Audio Surveillance Console Table */}
        <mesh position={[0, 1.5, 0.8]} castShadow>
          <boxGeometry args={[4.2, 0.1, 1.4]} />
          <meshStandardMaterial color="#334155" metalness={0.6} />
        </mesh>
        {/* Table Leg */}
        <mesh position={[-1.8, 0.75, 0.8]}>
          <cylinderGeometry args={[0.05, 0.05, 1.5, 12]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[1.8, 0.75, 0.8]}>
          <cylinderGeometry args={[0.05, 0.05, 1.5, 12]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>

        {/* Surveillance Monitors with Live Graphs */}
        {[-1.1, 0, 1.1].map((monX, i) => (
          <group key={`mon-${i}`} position={[monX, 1.85, 0.8]}>
            <mesh>
              <boxGeometry args={[0.9, 0.6, 0.04]} />
              <meshStandardMaterial color="#020617" />
            </mesh>
            <mesh position={[0, 0, 0.025]}>
              <planeGeometry args={[0.82, 0.52]} />
              <meshStandardMaterial 
                color="#042f2e" 
                emissive={i === 1 ? '#0284c7' : '#10b981'} 
                emissiveIntensity={1.2} 
              />
            </mesh>
          </group>
        ))}

        {/* Audio Reel-to-Reel Tape Recorder (Wiretapping) */}
        <group position={[-1.6, 1.62, 0.6]}>
          <mesh>
            <boxGeometry args={[0.6, 0.12, 0.4]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Rotating Tape Reels */}
          <mesh position={[-0.15, 0.08, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          <mesh position={[0.15, 0.08, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
        </group>

        {/* 🎧 INVESTIGATOR / AGENT LISTENING WITH HEADPHONES */}
        <group position={[0, 0, 1.8]}>
          {/* Swivel Chair */}
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[0.8, 0.1, 0.8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, 1.7, 0.35]}>
            <boxGeometry args={[0.7, 1.1, 0.08]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {/* Listening Agent Body (Facing Interrogation Room through mirror) */}
          <mesh position={[0, 1.6, 0]} castShadow>
            <boxGeometry args={[0.55, 0.85, 0.35]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>

          {/* Agent Head */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.5} />
          </mesh>

          {/* Hair */}
          <mesh position={[0, 2.26, 0.02]}>
            <sphereGeometry args={[0.175, 16, 16]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {/* 🎧 Professional Over-Ear Audio Headphones */}
          <group position={[0, 2.22, 0]}>
            {/* Headphone Band */}
            <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.18, 0.02, 8, 24, Math.PI]} />
              <meshStandardMaterial color="#0284c7" metalness={0.8} />
            </mesh>
            {/* Left Ear Cushion */}
            <mesh position={[-0.19, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>
            {/* Right Ear Cushion */}
            <mesh position={[0.19, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} />
            </mesh>
          </group>

          {/* Clipboard / Notepad in Hand */}
          <mesh position={[0, 1.45, -0.35]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.3, 0.42, 0.02]} />
            <meshStandardMaterial color="#fef08a" />
          </mesh>
        </group>
      </group>

      {/* 📹 CEILING CCTV SURVEILLANCE CAMERA (CORNER MOUNTED) */}
      <group position={[5.4, 5.2, 5.4]} rotation={[0.4, -Math.PI / 4, 0]}>
        {/* Wall Mounting Bracket */}
        <mesh>
          <boxGeometry args={[0.15, 0.15, 0.2]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.15, 0.15]}>
          <cylinderGeometry args={[0.025, 0.025, 0.25, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} />
        </mesh>
        {/* Dome Camera Body */}
        <group position={[0, -0.28, 0.22]} rotation={[-0.5, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.14, 0.35, 20]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          {/* Black Camera Lens Aperture */}
          <mesh position={[0, -0.18, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* 🔴 Blinking Red Recording LED */}
          <mesh position={[0, -0.18, 0.1]}>
            <sphereGeometry args={[0.02, 10, 10]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
          </mesh>
        </group>
      </group>

      {/* 5. West Side Wall (x = -6.0) with Heavy Security Door */}
      <mesh position={[-6.0, 2.9, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[14, 6, 0.2]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
      </mesh>
      {/* Interrogation Door */}
      <group position={[-5.88, 2.2, -1.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[2.0, 4.4, 0.08]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.5} />
        </mesh>
        {/* Door Window Wire Glass */}
        <mesh position={[0, 0.9, 0.05]}>
          <boxGeometry args={[0.6, 0.9, 0.02]} />
          <meshStandardMaterial color="#0284c7" transparent opacity={0.4} />
        </mesh>
        {/* Door Knob / Push Bar */}
        <mesh position={[0.65, 0, 0.06]}>
          <boxGeometry args={[0.1, 0.45, 0.08]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} />
        </mesh>
      </group>

      {/* 6. East Side Wall (x = +6.0) with Case Whiteboard & Photos */}
      <mesh position={[6.0, 2.9, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[14, 6, 0.2]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
      </mesh>
      {/* Investigation Whiteboard */}
      <group position={[5.88, 3.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[4.5, 2.6, 0.05]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[4.7, 2.8, 0.03]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        {/* Evidence Photos on Board */}
        <mesh position={[-1.2, 0.4, 0.03]}>
          <planeGeometry args={[0.6, 0.7]} />
          <meshStandardMaterial color="#fed7aa" />
        </mesh>
        <mesh position={[0.1, 0.3, 0.03]}>
          <planeGeometry args={[0.7, 0.8]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
        <mesh position={[1.3, 0.2, 0.03]}>
          <planeGeometry args={[0.65, 0.7]} />
          <meshStandardMaterial color="#fecdd3" />
        </mesh>
      </group>

      {/* ── CENTRAL MODERN WOOD & STEEL TABLE ───────────────── */}
      <group position={[0, 0, 0]}>
        {/* Table Top: Warm Teak Wood */}
        <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.12, 4.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Legs: Polished Chrome Steel */}
        {[-1.05, 1.05].map((x, i) =>
          [-1.8, 1.8].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.85, z]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 1.7, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
          ))
        )}

        {/* Evidence Dossier Folder on Table */}
        <mesh position={[0.2, 1.78, 0.5]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.7, 0.04, 0.9]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>

        {/* Audio Tape Recorder on Table */}
        <mesh position={[-0.4, 1.8, 0]} rotation={[0, -0.1, 0]}>
          <boxGeometry args={[0.55, 0.08, 0.38]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Red Recording LED Indicator */}
        <mesh position={[-0.22, 1.85, 0.08]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
        </mesh>

        {/* Water Cup for Suspect */}
        <mesh position={[0.45, 1.85, -1.0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.22, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={0.1} />
        </mesh>
      </group>

      {/* ── 1. DETECTIVE (SEATED IN 3D GAMING CHAIR) ────────── */}
      <group position={[0, 0, 2.0]} rotation={[0, Math.PI, 0]}>
        {/* Luxury 3D Gaming Chair Model */}
        <GamingChair3D scale={0.022} position={[0, 0, 0]} accentColor="#0284c7" />

        {/* Seated 3D Panda Detective - Sitting comfortably on chair cushion facing suspect */}
        <PandaDetective scale={0.011} position={[0, 0.62, 0.05]} isSitting={true} />
      </group>

      {/* ── 2. ACCUSED SUSPECT (SEATED OPPOSITE DETECTIVE) ───── */}
      <group position={[0, 0, -2.0]}>
        {/* White Swivel Chair */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[1.05, 0.12, 0.95]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.6, -0.42]} castShadow>
          <boxGeometry args={[0.95, 1.2, 0.08]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>

        {/* Suspect Torso */}
        <mesh position={[0, 1.45, 0]} castShadow>
          <boxGeometry args={[0.54, 0.85, 0.3]} />
          <meshStandardMaterial 
            color={isEvelyn ? '#6b21a8' : isMarcus ? '#e2e8f0' : '#0284c7'} 
            roughness={0.4} 
          />
        </mesh>

        {/* Evelyn's Golden Necklace / Marcus Lab Badge */}
        {isEvelyn && (
          <mesh position={[0, 1.72, 0.155]}>
            <torusGeometry args={[0.08, 0.015, 8, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
        )}
        {isMarcus && (
          <mesh position={[-0.14, 1.68, 0.155]}>
            <planeGeometry args={[0.08, 0.12]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        )}

        {/* Seated Legs */}
        <mesh position={[-0.16, 0.9, 0.4]} rotation={[-Math.PI / 2.2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.07, 0.95, 14]} />
          <meshStandardMaterial color={isEvelyn ? '#3b0764' : '#475569'} />
        </mesh>
        <mesh position={[0.16, 0.9, 0.4]} rotation={[-Math.PI / 2.2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.07, 0.95, 14]} />
          <meshStandardMaterial color={isEvelyn ? '#3b0764' : '#475569'} />
        </mesh>

        {/* Handcuffs on Table */}
        <group position={[0, 1.76, 0.4]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.35, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} />
          </mesh>
        </group>

        {/* Suspect Head with Hair & Facial Features */}
        <group ref={suspectHeadRef} position={[0, 2.05, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.17, 18, 18]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.4} />
          </mesh>

          {isEvelyn ? (
            <group position={[0, 0.08, -0.04]}>
              <mesh>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color="#18181b" roughness={0.8} />
              </mesh>
            </group>
          ) : (
            <group position={[0, 0.05, 0]}>
              <mesh position={[0, 0.08, -0.04]}>
                <sphereGeometry args={[0.185, 16, 16]} />
                <meshStandardMaterial color="#451a03" />
              </mesh>
              <mesh position={[0, -0.02, 0.16]}>
                <boxGeometry args={[0.26, 0.06, 0.04]} />
                <meshStandardMaterial color="#000000" metalness={0.8} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
};
