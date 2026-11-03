import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { PandaDetective } from './PandaDetective';

interface ServerVault3DProps {
  activeNode: number;
  solvedNodes: number[];
  isBreached: boolean;
  isHacking?: boolean;
}

// Generates procedural dynamic green/cyan binary code stream texture on canvas
function useBinaryMatrixTexture(isHacking: boolean, isBreached: boolean) {
  const { canvas, ctx, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const context = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return { canvas: c, ctx: context, texture: tex };
  }, []);

  const columns = useMemo(() => {
    const cols = 28;
    return Array.from({ length: cols }, () => ({
      y: Math.random() * 256,
      speed: 4 + Math.random() * 8,
      chars: Array.from({ length: 16 }, () => (Math.random() > 0.5 ? '1' : '0')),
    }));
  }, []);

  useFrame(() => {
    if (!ctx) return;

    // Dark semi-transparent fade background for trailing matrix effect
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 13px monospace';
    const textColor = isBreached 
      ? '#22c55e' 
      : isHacking 
      ? '#38bdf8' 
      : '#0284c7';

    columns.forEach((col, i) => {
      const x = i * 18 + 8;
      col.y += isHacking ? col.speed * 2.2 : col.speed * 0.9;
      if (col.y > 270) {
        col.y = -20;
      }

      col.chars.forEach((char, j) => {
        const charY = (col.y - j * 14);
        if (charY > 0 && charY < 256) {
          if (Math.random() < 0.15) {
            col.chars[j] = Math.random() > 0.5 ? '1' : '0';
          }
          if (j === 0) {
            ctx.fillStyle = '#ffffff';
          } else {
            ctx.fillStyle = textColor;
          }
          ctx.fillText(char, x, charY);
        }
      });
    });

    ctx.fillStyle = isBreached ? '#10b981' : isHacking ? '#38bdf8' : '#0ea5e9';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(isBreached ? '>> ACCESS GRANTED: VAULT KEYCARD UNLOCKED' : isHacking ? '>> INJECTING HARMONIC CIPHER... [11010101]' : '>> QUANTUM VAULT TERMINAL ACTIVE', 12, 20);

    texture.needsUpdate = true;
  });

  return texture;
}

export const ServerVault3D: React.FC<ServerVault3DProps> = ({
  activeNode,
  solvedNodes,
  isBreached,
  isHacking = false,
}) => {
  const centralHoloRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const screenGlowRef = useRef<THREE.PointLight>(null);
  const keycardRef = useRef<THREE.Group>(null);
  const safeVaultDoorRef = useRef<THREE.Group>(null);

  const binaryTexture = useBinaryMatrixTexture(isHacking, isBreached);

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
      const pulseSpeed = isHacking ? 12 : 4;
      screenGlowRef.current.intensity = (isHacking ? 2.8 : 1.4) + Math.sin(t * pulseSpeed) * 0.3;
    }

    // Floating Master Keycard inside Safe / Vault
    if (keycardRef.current) {
      keycardRef.current.rotation.y = t * 1.5;
      keycardRef.current.position.y = (isBreached ? 2.1 : 1.4) + Math.sin(t * 3) * 0.08;
    }

    // Vault Door Swing open when breached
    if (safeVaultDoorRef.current) {
      const targetRot = isBreached ? -Math.PI * 0.6 : 0;
      safeVaultDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        safeVaultDoorRef.current.rotation.y,
        targetRot,
        0.05
      );
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ── REALISTIC MODERN CORPORATE DATACENTER LIGHTING (NATURAL & VIBRANT) ── */}
      <ambientLight intensity={1.5} color="#e0f2fe" />
      <directionalLight position={[6, 12, 6]} intensity={2.6} color="#ffffff" castShadow />
      <directionalLight position={[-6, 10, -4]} intensity={1.8} color="#bae6fd" />
      <pointLight 
        position={[0, 4.2, 0]} 
        intensity={isBreached ? 25 : 15} 
        color={isBreached ? '#10b981' : '#38bdf8'} 
        distance={22} 
      />

      {/* Ceiling Fluorescent Office Light Panels */}
      {[-3.5, 0, 3.5].map((x, i) => (
        <group key={i} position={[x, 5.5, 0]}>
          <mesh>
            <boxGeometry args={[1.6, 0.08, 6]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#ffffff" 
              emissiveIntensity={2.0} 
            />
          </mesh>
          <pointLight position={[0, -0.3, 0]} intensity={14} color="#ffffff" distance={9} />
        </group>
      ))}

      {/* ── REALISTIC REAL-WORLD DATACENTER RAISED FLOOR (Brushed Titanium Gray Tiles) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[26, 22]} />
        <meshStandardMaterial color="#64748b" roughness={0.35} metalness={0.4} />
      </mesh>
      {/* Metallic Floor Seams */}
      <gridHelper args={[26, 26, '#94a3b8', '#cbd5e1']} position={[0, 0.005, 0]} />

      {/* ── ARCHITECTURAL SERVER ROOM WALLS (Warm Silver-Gray Tech Panels - NOT BLACK) ── */}
      {/* Back Wall */}
      <mesh position={[0, 3.2, -6.5]} receiveShadow>
        <planeGeometry args={[26, 7.5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.45} metalness={0.25} />
      </mesh>
      {/* Stainless Steel Cable Raceway & Wall Skirting */}
      <mesh position={[0, 0.25, -6.48]}>
        <boxGeometry args={[26, 0.4, 0.05]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Upper High-Voltage Cable Tray */}
      <mesh position={[0, 5.0, -6.45]}>
        <boxGeometry args={[26, 0.25, 0.12]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-12, 3.2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[22, 7.5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.45} metalness={0.25} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[12, 3.2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[22, 7.5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.45} metalness={0.25} />
      </mesh>

      {/* ── 3D SERVER TOWER RACKS (Real-World Enterprise Server Cabinets) ── */}
      {[-4.8, -2.6, 2.6, 4.8].map((xPos, idx) => {
        const isRackActive = (activeNode === 1 && idx === 0) || (activeNode === 2 && idx === 1) || (activeNode === 3 && idx === 2);
        const isRackSolved = solvedNodes.includes(idx + 1);

        return (
          <group key={idx} position={[xPos, 0, -2.4]}>
            {/* Enterprise Server Rack Metal Frame */}
            <RoundedBox args={[1.5, 4.2, 1.3]} radius={0.05} smoothness={4} position={[0, 2.1, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.3} />
            </RoundedBox>

            {/* Front Server Blade Drawers (Steel Chassis) */}
            {[0.6, 1.2, 1.8, 2.4, 3.0, 3.6].map((y, slotIdx) => (
              <group key={slotIdx} position={[0, y, 0.64]}>
                <mesh>
                  <planeGeometry args={[1.32, 0.48]} />
                  <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
                </mesh>

                {/* Perforated Hex Ventilation Mesh Grille */}
                {[-0.25, 0, 0.25].map((gx, gIdx) => (
                  <mesh key={gIdx} position={[gx, -0.06, 0.01]}>
                    <planeGeometry args={[0.16, 0.12]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.6} />
                  </mesh>
                ))}

                {/* Status Activity LEDs */}
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
                      emissiveIntensity={isRackActive || isRackSolved ? 2.5 : 0.4}
                    />
                  </mesh>
                ))}
              </group>
            ))}

            {/* Top Server Beacon Halo */}
            <mesh position={[0, 4.25, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
              <meshStandardMaterial 
                color={isRackSolved ? '#10b981' : isRackActive ? '#0284c7' : '#94a3b8'}
                emissive={isRackSolved ? '#10b981' : isRackActive ? '#0284c7' : '#475569'}
                emissiveIntensity={1.8} 
              />
            </mesh>
          </group>
        );
      })}

      {/* ── HEAVY REINFORCED DATA VAULT SAFE (IN BACK WALL) ── */}
      <group position={[0, 1.4, -6.1]}>
        <RoundedBox args={[2.2, 2.2, 0.6]} radius={0.06} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </RoundedBox>

        {/* Vault Interior Chamber */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.8, 1.8, 0.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>

        {/* Interior Vault Light */}
        <pointLight 
          position={[0, 0.6, 0.2]} 
          intensity={isBreached ? 14 : 4} 
          color={isBreached ? '#10b981' : '#f59e0b'} 
          distance={4} 
        />

        {/* ── FLOATING HACKED MASTER KEYCARD INSIDE VAULT ── */}
        <group ref={keycardRef} position={[0, 0, 0.2]}>
          <RoundedBox args={[0.7, 0.44, 0.025]} radius={0.02} smoothness={3} castShadow>
            <meshStandardMaterial 
              color={isBreached ? '#fbbf24' : '#94a3b8'} 
              metalness={0.9} 
              roughness={0.15} 
              emissive={isBreached ? '#f59e0b' : '#000000'}
              emissiveIntensity={isBreached ? 1.0 : 0}
            />
          </RoundedBox>
          <mesh position={[-0.16, 0, 0.015]}>
            <planeGeometry args={[0.18, 0.15]} />
            <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.1, -0.015]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.66, 0.09]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>

        {/* ── HEAVY REINFORCED VAULT DOOR (SWINGS OPEN) ── */}
        <group ref={safeVaultDoorRef} position={[-0.95, 0, 0.3]}>
          <RoundedBox args={[1.9, 2.0, 0.2]} radius={0.04} smoothness={4} position={[0.95, 0, 0]} castShadow>
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.25} />
          </RoundedBox>

          {/* Heavy Chrome Vault Locking Dial & Wheel */}
          <group position={[0.95, 0, 0.12]}>
            <mesh>
              <torusGeometry args={[0.35, 0.04, 16, 32]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
            </mesh>
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((rad, sIdx) => (
              <mesh key={sIdx} rotation={[0, 0, rad]}>
                <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
              </mesh>
            ))}
            <mesh position={[0, 0, 0.03]}>
              <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial 
                color={isBreached ? '#10b981' : '#ef4444'} 
                emissive={isBreached ? '#10b981' : '#ef4444'} 
                emissiveIntensity={2.5} 
              />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── CENTRAL MASTER WORKSTATION & DESK ── */}
      <group position={[0, 0, 0.8]}>
        {/* Sleek Enterprise Gray Command Desk */}
        <RoundedBox args={[3.2, 0.12, 1.4]} radius={0.04} smoothness={4} position={[0, 0.9, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.3} />
        </RoundedBox>

        {/* Desk Chrome Legs */}
        {[-1.4, 1.4].map((lx, li) => (
          <group key={li} position={[lx, 0.45, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.9, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.44, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
          </group>
        ))}

        {/* ── MAIN HIGH-TECH PC SYSTEM TOWER ON DESK ── */}
        <group position={[1.2, 1.35, 0]}>
          <RoundedBox args={[0.32, 0.72, 0.62]} radius={0.03} smoothness={4} castShadow>
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
          </RoundedBox>
          <mesh position={[-0.165, 0, 0]}>
            <planeGeometry args={[0.56, 0.66]} />
            <meshPhysicalMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} transparent opacity={0.6} />
          </mesh>
          {[0.15, -0.15].map((fy, fi) => (
            <mesh key={fi} position={[0, fy, 0.315]}>
              <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
              <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.5} />
            </mesh>
          ))}
        </group>

        {/* ── DUAL ULTRAWIDE HACKING MONITORS WITH 11010101 BINARY MATRIX ANIMATION ── */}
        {/* Center Main PC Monitor */}
        <group position={[0, 1.45, -0.1]}>
          <RoundedBox args={[1.5, 0.85, 0.06]} radius={0.02} smoothness={3} castShadow>
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </RoundedBox>
          {/* Active 11010101 Binary Code Stream Screen */}
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[1.44, 0.79]} />
            <meshStandardMaterial 
              map={binaryTexture}
              emissiveMap={binaryTexture}
              emissive="#ffffff"
              emissiveIntensity={isHacking ? 1.4 : 0.85}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, -0.48, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.35, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.63, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.03, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
        </group>

        {/* Left Angled Secondary Telemetry Monitor with Binary stream */}
        <group position={[-1.15, 1.45, 0.05]} rotation={[0, 0.35, 0]}>
          <RoundedBox args={[0.85, 0.75, 0.05]} radius={0.02} smoothness={3} castShadow>
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.8, 0.7]} />
            <meshStandardMaterial 
              map={binaryTexture}
              emissiveMap={binaryTexture}
              emissive="#ffffff"
              emissiveIntensity={isHacking ? 1.2 : 0.7}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.3, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
        </group>

        {/* Keyboard & Mouse Pad */}
        <group position={[0, 0.98, 0.3]}>
          <mesh position={[-0.1, 0, 0]}>
            <boxGeometry args={[0.7, 0.025, 0.24]} />
            <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Keycaps Glow */}
          <mesh position={[-0.1, 0.015, 0]}>
            <planeGeometry args={[0.66, 0.2]} />
            <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={isHacking ? 2.5 : 1.2} />
          </mesh>
          {/* Ergonomic Mouse */}
          <mesh position={[0.42, 0.015, 0]}>
            <capsuleGeometry args={[0.035, 0.07, 4, 8]} />
            <meshStandardMaterial color="#0284c7" metalness={0.5} />
          </mesh>
        </group>

        {/* Ambient screen bounce light */}
        <pointLight 
          ref={screenGlowRef} 
          position={[0, 1.5, 0.5]} 
          intensity={1.5} 
          color={isBreached ? '#34d399' : '#38bdf8'} 
          distance={4} 
        />

        {/* ── HOLOGRAPHIC QUANTUM CIPHER PROJECTION ABOVE DESK ── */}
        <group ref={centralHoloRef} position={[0, 2.5, -0.1]}>
          <mesh>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial 
              color="#38bdf8" 
              emissive={isBreached ? '#34d399' : '#38bdf8'} 
              emissiveIntensity={2.5} 
              transparent 
              opacity={0.85} 
            />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[0.65, 0]} />
            <meshStandardMaterial 
              color="#0284c7" 
              emissive={isBreached ? '#10b981' : '#0ea5e9'} 
              emissiveIntensity={1.8} 
              wireframe 
            />
          </mesh>
          <mesh ref={ring1Ref}>
            <torusGeometry args={[0.9, 0.02, 16, 48]} />
            <meshStandardMaterial color="#6366f1" emissive="#818cf8" emissiveIntensity={2} />
          </mesh>
          <mesh ref={ring2Ref}>
            <torusGeometry args={[1.1, 0.02, 16, 48]} />
            <meshStandardMaterial color="#06b6d4" emissive="#22d3ee" emissiveIntensity={1.8} />
          </mesh>
        </group>
      </group>

      {/* ── DETECTIVE PANDA HACKING AT THE CONSOLE (PERFECT SEATED POSITION) ── */}
      <group position={[0, 0, 1.55]}>
        <PandaDetective 
          position={[0, 0, 0]}
          rotation={[0, Math.PI, 0]}
          scale={0.0105}
          isSitting={!isHacking}
          isHacking={isHacking}
          isWalking={false}
        />
      </group>
    </group>
  );
};
