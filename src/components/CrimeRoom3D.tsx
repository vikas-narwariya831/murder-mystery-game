import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { RoundedBox, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { sounds } from '../services/audioService';
import { PandaDetective } from './PandaDetective';
import { GamingChair3D } from './GamingChair3D';

interface Scene3DProps {
  onInspectClue: (clueId: string) => void;
  onOpenSafe: () => void;
  onGoToInterrogation: () => void;
  onInspectBody: () => void;
  isSafeOpened: boolean;
  discoveredClues: string[];
  detectiveTargetPos: [number, number, number];
  onMoveDetective: (target: [number, number, number]) => void;
  isDetectiveSitting: boolean;
  onToggleSit: (sit: boolean) => void;
  onHoverTarget: (targetName: string | null) => void;
}

const DESK_BOUNDS = { minX: 0.1, maxX: 4.3, minZ: -1.6, maxZ: 1.8 };

function clampOutsideDesk(target: [number, number, number]): [number, number, number] {
  let [x, y, z] = target;
  if (x >= DESK_BOUNDS.minX && x <= DESK_BOUNDS.maxX && z >= DESK_BOUNDS.minZ && z <= DESK_BOUNDS.maxZ) {
    if (z > 0.6) z = 2.4;
    else if (x < 2.2) x = -0.6;
    else z = -2.2;
  }
  return [x, y, z];
}

/* ── NANA PATEKAR MEMORIAL FRAME (PHOTO + VOICE) ───────────── */
function NanaPatekarPainting({ onHoverTarget }: { onHoverTarget: (t: string | null) => void }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Stylized Nana Patekar Krantiveer cartoon caricature portrait
  const texture = useTexture('/nana_cartoon.jpg');

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setClicked(true);
    sounds.playNanaDialogue();
    onHoverTarget('🗣️ Nana Patekar: "Aa gaye meri maut ka tamasha dekhne?!"');
    setTimeout(() => setClicked(false), 2000);
  };

  return (
    <group 
      position={[0.2, 4.6, -8.35]}
      onClick={handleClick}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
        onHoverTarget('🖼️ Click for Nana Patekar Dialogue: "Aa gaye meri maut ka tamasha dekhne?!"');
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
        onHoverTarget(null);
      }}
      scale={clicked ? 1.08 : hovered ? 1.04 : 1}
    >
      {/* Heavy Ornate Teak Wood Frame */}
      <mesh castShadow>
        <boxGeometry args={[2.5, 3.4, 0.1]} />
        <meshStandardMaterial color="#78350f" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Gold Inner Bevel Rim */}
      <mesh position={[0, 0, 0.052]}>
        <boxGeometry args={[2.3, 3.2, 0.02]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Actual Portrait Photo Canvas */}
      <mesh position={[0, 0.35, 0.065]}>
        <planeGeometry args={[2.1, 2.2]} />
        <meshStandardMaterial map={texture} roughness={0.5} />
      </mesh>

      {/* Nana Caption Plaque at Bottom of Frame */}
      <group position={[0, -1.05, 0.065]}>
        <mesh>
          <planeGeometry args={[2.1, 0.7]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text
          position={[0, 0.18, 0.01]}
          fontSize={0.12}
          color="#ef4444"
          anchorX="center"
          anchorY="middle"
        >
          "AA GAYE MERI MAUT KA"
        </Text>
        <Text
          position={[0, -0.02, 0.01]}
          fontSize={0.14}
          color="#fcd34d"
          anchorX="center"
          anchorY="middle"
        >
          TAMASHA DEKHNE?!"
        </Text>
        <Text
          position={[0, -0.22, 0.01]}
          fontSize={0.08}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          🔊 [Click for Dialogue Audio]
        </Text>
      </group>
    </group>
  );
}

/* ── DETECTIVE AVATAR (PANDA 3D MODEL) ───────────────────── */
function DetectiveAvatar({ targetPos, isSitting }: { targetPos: [number, number, number]; isSitting: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3(-1, 0, 2.8));
  const targetVec = useRef(new THREE.Vector3(...targetPos));
  const [isWalking, setIsWalking] = useState(false);
  const [hasReachedChair, setHasReachedChair] = useState(false);

  React.useEffect(() => {
    if (isSitting) {
      setHasReachedChair(false);
      targetVec.current.set(2.2, 0, -1.05);
    } else {
      setHasReachedChair(false);
      targetVec.current.set(targetPos[0], targetPos[1], targetPos[2]);
    }
  }, [targetPos, isSitting]);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    const target = isSitting ? new THREE.Vector3(2.2, 0, -1.05) : targetVec.current;
    const dist = currentPos.current.distanceTo(target);

    // If sitting requested but hasn't walked to chair yet
    if (isSitting) {
      if (!hasReachedChair && dist > 0.15) {
        if (!isWalking) setIsWalking(true);
        const dir = new THREE.Vector3().subVectors(target, currentPos.current).normalize();
        currentPos.current.addScaledVector(dir, delta * 3.4);
        groupRef.current.position.copy(currentPos.current);
        groupRef.current.rotation.y = Math.atan2(dir.x, dir.z);
      } else {
        if (!hasReachedChair) setHasReachedChair(true);
        if (isWalking) setIsWalking(false);
        currentPos.current.copy(target);
        groupRef.current.position.copy(target);
        groupRef.current.rotation.y = 0; // Face desk
      }
      return;
    }

    // Normal walking on floor
    if (dist > 0.15) {
      if (!isWalking) setIsWalking(true);
      const dir = new THREE.Vector3().subVectors(targetVec.current, currentPos.current).normalize();
      currentPos.current.addScaledVector(dir, delta * 3.4);
      groupRef.current.position.copy(currentPos.current);
      groupRef.current.rotation.y = Math.atan2(dir.x, dir.z);
    } else {
      if (isWalking) setIsWalking(false);
    }
  });

  const shouldPlaySittingAnim = isSitting && hasReachedChair;

  return (
    <group ref={groupRef} position={[-1, 0, 2.8]}>
      {/* Ground Contact Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* 3D Panda Detective Character */}
      <PandaDetective
        scale={0.011}
        position={[0, shouldPlaySittingAnim ? 0.62 : 0, 0]}
        isWalking={isWalking}
        isSitting={shouldPlaySittingAnim}
      />
    </group>
  );
}

/* ── FORENSIC PARTNER AVATAR (2-PLAYER CO-OP DETECTIVE) ──────── */
function ForensicPartnerAvatar({ 
  onPartnerClick, 
  onHoverTarget 
}: { 
  onPartnerClick: () => void; 
  onHoverTarget: (t: string | null) => void;
}) {
  const partnerGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const [partnerTalking, setPartnerTalking] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.5) * 0.15;
      headRef.current.position.y = 1.62 + Math.sin(t * 3) * 0.015;
    }
  });

  const handlePartnerInteract = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setPartnerTalking(true);
    sounds.playBeep(650);
    onPartnerClick();
    setTimeout(() => setPartnerTalking(false), 3000);
  };

  return (
    <group 
      ref={partnerGroupRef} 
      position={[-2.4, 0, -0.6]} 
      rotation={[0, 0.8, 0]}
      onClick={handlePartnerInteract}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHoverTarget("👮 Agent Maya (Forensic Specialist) - Click to Consult");
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        onHoverTarget(null);
      }}
    >
      {/* Ground Contact Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.45, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Partner Body: Trenchcoat & Tactical Police Vest */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.48, 0.82, 0.28]} />
        <meshStandardMaterial color="#0284c7" roughness={0.5} />
      </mesh>
      {/* Tactical Badge & Radio */}
      <mesh position={[0.12, 1.25, 0.15]}>
        <planeGeometry args={[0.08, 0.1]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} />
      </mesh>
      {/* Radio Antenna */}
      <mesh position={[-0.18, 1.48, 0.1]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
        <meshStandardMaterial color="#09090b" />
      </mesh>

      {/* Legs (Standing beside victim examining evidence) */}
      <mesh position={[-0.13, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.065, 0.76, 12]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.13, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.065, 0.76, 12]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Boots */}
      <mesh position={[-0.13, 0.06, 0.06]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.22]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      <mesh position={[0.13, 0.06, 0.06]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.22]} />
        <meshStandardMaterial color="#020617" />
      </mesh>

      {/* Arms holding Digital Forensic Tablet */}
      <mesh position={[-0.24, 0.95, 0.15]} rotation={[0.6, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.5, 12]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      <mesh position={[0.24, 0.95, 0.15]} rotation={[0.6, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.5, 12]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* Glowing Forensic Tablet in Hands */}
      <group position={[0, 0.95, 0.35]} rotation={[-0.5, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.28, 0.02]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[0.38, 0.24]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.4} />
        </mesh>
      </group>

      {/* Head with Tactical Headset */}
      <group ref={headRef} position={[0, 1.62, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.16, 18, 18]} />
          <meshStandardMaterial color="#fed7aa" roughness={0.4} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.08, -0.02]}>
          <sphereGeometry args={[0.165, 16, 16]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.7} />
        </mesh>
        {/* Over-ear Comms Headset */}
        <mesh position={[0, 0.05, 0]}>
          <torusGeometry args={[0.17, 0.015, 8, 20]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <mesh position={[-0.17, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
      </group>

      {/* 3D Speech Bubble only when actively speaking */}
      {partnerTalking && (
        <group position={[0, 2.3, 0]}>
          <mesh>
            <planeGeometry args={[2.4, 0.45]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.92} />
          </mesh>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.09}
            color="#38bdf8"
            maxWidth={2.2}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
          >
            "Check the coffee mug and safe code!"
          </Text>
        </group>
      )}
    </group>
  );
}
function RealisticVictimBody({ onClick, onHover }: { onClick: () => void; onHover: (h: boolean) => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <group 
      position={[-1.2, 0, -1.2]} 
      rotation={[0, 0.5, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); onHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setIsHovered(false); onHover(false); document.body.style.cursor = 'default'; }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <planeGeometry args={[2.4, 3.2]} />
        <meshStandardMaterial color="#881337" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]}>
        <ringGeometry args={[1.1, 1.15, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0.02, 0.4]}>
        <circleGeometry args={[0.38, 24]} />
        <meshStandardMaterial color="#2a0808" roughness={0.1} />
      </mesh>
      <group position={[-0.8, 0, 0.8]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <coneGeometry args={[0.08, 0.22, 4]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.4} />
        </mesh>
      </group>
      <group position={[0, 0.16, 0]}>
        <mesh position={[-0.14, 0.06, -0.85]} rotation={[0.2, 0, 0.1]} castShadow>
          <boxGeometry args={[0.13, 0.1, 0.28]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0.14, 0.08, -0.75]} rotation={[-0.3, 0.2, 0]} castShadow>
          <boxGeometry args={[0.13, 0.1, 0.28]} />
          <meshStandardMaterial color="#09090b" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[-0.14, 0.12, -0.45]} rotation={[-1.4, 0.1, 0.1]} castShadow>
          <cylinderGeometry args={[0.085, 0.075, 0.85, 14]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh position={[0.16, 0.15, -0.38]} rotation={[-1.3, -0.2, 0.15]} castShadow>
          <cylinderGeometry args={[0.085, 0.075, 0.8, 14]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.2, 0.15]} rotation={[-1.55, 0, 0.1]} castShadow>
          <boxGeometry args={[0.54, 0.85, 0.26]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.32, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.18, 0.28]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0.02, 0.33, 0.21]} rotation={[-Math.PI / 2, 0, 0.1]}>
          <boxGeometry args={[0.045, 0.24, 0.01]} />
          <meshStandardMaterial color="#991b1b" />
        </mesh>
        <mesh position={[0.38, 0.12, 0.35]} rotation={[0.3, 0.6, 1.2]} castShadow>
          <cylinderGeometry args={[0.065, 0.055, 0.75, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <group position={[0, 0.24, 0.7]}>
          <mesh castShadow>
            <sphereGeometry args={[0.17, 18, 18]} />
            <meshStandardMaterial color="#fed7aa" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.07, -0.04]}>
            <sphereGeometry args={[0.175, 16, 16]} />
            <meshStandardMaterial color="#1c1917" roughness={0.9} />
          </mesh>
        </group>
      </group>
      {isHovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[1.3, 1.38, 36]} />
          <meshBasicMaterial color="#ef4444" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

interface SteamParticle {
  life: number;
  speed: number;
  driftX: number;
  driftZ: number;
  scale: number;
}

/* ── COFFEE STEAM PARTICLES ───────────────────────────────── */
function CoffeeSteam() {
  const steamMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const steamCount = 14;
  const particles = useMemo<SteamParticle[]>(() => {
    return Array.from({ length: steamCount }, (_, i) => ({
      life: i / steamCount,
      speed: 0.28 + Math.random() * 0.15,
      driftX: (Math.random() - 0.5) * 0.08,
      driftZ: (Math.random() - 0.5) * 0.08,
      scale: 0.03 + Math.random() * 0.02,
    }));
  }, [steamCount]);

  useFrame((state, delta) => {
    if (!steamMeshRef.current) return;
    const time = state.clock.getElapsedTime();

    particles.forEach((p: SteamParticle, i: number) => {
      p.life += delta * p.speed;
      if (p.life > 1) {
        p.life = 0;
        p.driftX = (Math.random() - 0.5) * 0.08;
        p.driftZ = (Math.random() - 0.5) * 0.08;
      }

      const rise = p.life * 0.5;
      const swirl = Math.sin(time * 2.5 + i) * 0.02 * p.life;
      const px = p.driftX * p.life + swirl;
      const py = 0.28 + rise;
      const pz = p.driftZ * p.life;

      const scale = p.scale * (0.6 + p.life * 1.5);
      dummy.position.set(px, py, pz);
      dummy.scale.set(scale, scale * 1.2, scale);
      dummy.updateMatrix();

      steamMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    steamMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={steamMeshRef}
      args={[undefined, undefined, steamCount]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial
        color="#f1f5f9"
        transparent
        opacity={0.3}
        roughness={0.9}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/* ── LAPTOP ───────────────────────────────────────────────── */
function RealisticLaptop({ onClick, onHover }: { onClick: (e: ThreeEvent<MouseEvent>) => void; onHover: (h: boolean) => void }) {
  const [hovered, setHovered] = useState(false);
  const screenRef = useRef<THREE.Mesh>(null);
  const codeLinesRef = useRef<THREE.Group>(null);
  const ledRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Pulse screen glow & code scanning effect
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.85 + Math.sin(t * 4) * 0.15;
    }
    if (codeLinesRef.current) {
      // Flowing terminal text lines scrolling upwards
      codeLinesRef.current.position.y = ((t * 0.15) % 0.12) - 0.06;
    }
    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = Math.sin(t * 8) > 0 ? 1.5 : 0.2;
    }
  });

  return (
    <group 
      position={[-0.8, 1.84, 0]}
      onClick={onClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); onHover(false); document.body.style.cursor = 'default'; }}
      scale={hovered ? 1.04 : 1}
    >
      {/* Keyboard Base */}
      <RoundedBox args={[0.9, 0.035, 0.62]} radius={0.02} castShadow>
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Keyboard Bed */}
      <mesh position={[0, 0.022, 0.06]}>
        <boxGeometry args={[0.78, 0.01, 0.38]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Touchpad */}
      <mesh position={[0, 0.022, 0.22]}>
        <boxGeometry args={[0.3, 0.005, 0.14]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Power LED Indicator */}
      <mesh ref={ledRef} position={[0.38, 0.025, -0.15]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
      </mesh>

      {/* Screen Lid (Opened at 105 degrees) */}
      <group position={[0, 0.03, -0.28]} rotation={[-0.3, 0, 0]}>
        {/* Metal Bezel */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.9, 0.56, 0.02]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>

        {/* Glowing Interactive Display Screen */}
        <mesh ref={screenRef} position={[0, 0.28, 0.015]}>
          <planeGeometry args={[0.84, 0.5]} />
          <meshStandardMaterial 
            color="#090d16" 
            emissive="#0284c7" 
            emissiveIntensity={0.85} 
            roughness={0.2}
          />
        </mesh>

        {/* Operating System UI: Top Status Bar */}
        <mesh position={[0, 0.505, 0.016]}>
          <planeGeometry args={[0.82, 0.035]} />
          <meshStandardMaterial color="#0369a1" emissive="#0284c7" emissiveIntensity={0.6} />
        </mesh>

        {/* Operating System UI: Live Terminal / Code Lines (Contained strictly inside 0.84 screen width) */}
        <group ref={codeLinesRef} position={[0, 0, 0]}>
          {[
            { y: 0.16, w: 0.42, x: -0.15, c: '#38bdf8' },
            { y: 0.11, w: 0.58, x: -0.07, c: '#38bdf8' },
            { y: 0.06, w: 0.35, x: -0.18, c: '#ef4444' }, // Red alert line
            { y: 0.01, w: 0.52, x: -0.10, c: '#38bdf8' },
            { y: -0.04, w: 0.65, x: -0.04, c: '#38bdf8' },
            { y: -0.09, w: 0.48, x: -0.12, c: '#f59e0b' }, // Amber warning
            { y: -0.14, w: 0.38, x: -0.17, c: '#38bdf8' },
          ].map((line, idx) => (
            <mesh key={`code-line-${idx}`} position={[line.x, 0.28 + line.y, 0.016]}>
              <planeGeometry args={[line.w, 0.022]} />
              <meshStandardMaterial 
                color={line.c} 
                emissive={line.c}
                emissiveIntensity={1.4}
              />
            </mesh>
          ))}
        </group>

        {/* Web Camera */}
        <mesh position={[0, 0.54, 0.016]}>
          <circleGeometry args={[0.007, 12]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>
    </group>
  );
}

/* ── MAIN SCENE ───────────────────────────────────────────── */
export const CrimeRoom3D: React.FC<Scene3DProps> = ({
  onInspectClue,
  onOpenSafe,
  onGoToInterrogation,
  onInspectBody,
  isSafeOpened,
  detectiveTargetPos,
  onMoveDetective,
  isDetectiveSitting,
  onToggleSit,
  onHoverTarget,
}) => {
  const safeDial = useRef<THREE.Mesh>(null);
  const [doorHovered, setDoorHovered] = useState(false);

  const handleFloorClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    sounds.playBeep(550, 'sine', 0.04);
    onToggleSit(false);
    const safeTarget = clampOutsideDesk([e.point.x, 0, e.point.z]);
    onMoveDetective(safeTarget);
  };

  useFrame((s) => {
    if (safeDial.current && !isSafeOpened) {
      safeDial.current.rotation.z = s.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={1.2} color="#f8fafc" />
      <directionalLight position={[7, 12, 6]} intensity={2.2} color="#fef08a" castShadow />
      <directionalLight position={[-7, 10, -5]} intensity={1.4} color="#e0f2fe" />
      <pointLight position={[2.2, 5.5, 0.6]} intensity={40} distance={12} color="#ffedd5" />
      <pointLight position={[-3.5, 3.5, -6.5]} intensity={25} distance={9} color="#0284c7" />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow onClick={handleFloorClick}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#451a03" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 4.5, -8.5]} receiveShadow>
        <boxGeometry args={[18, 9, 0.3]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.7} />
      </mesh>
      <mesh position={[-8.5, 4.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 9, 0.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Luxury Penthouse Glass Window with Frame (Z-fighting removed, placed forward at z = -8.32) */}
      <group position={[3.8, 4.6, -8.32]}>
        {/* Sleek Window Frame */}
        <mesh>
          <boxGeometry args={[5.3, 4.9, 0.04]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glass Pane */}
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[5.0, 4.6]} />
          <meshStandardMaterial 
            color="#38bdf8" 
            transparent 
            opacity={0.35} 
            roughness={0.1} 
            metalness={0.1}
            depthWrite={false}
          />
        </mesh>
        {/* Window Mullions */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.06, 4.6, 0.02]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[5.0, 0.06, 0.02]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* 🖼️ NANA PATEKAR MEMORIAL FRAME WITH PHOTO & AUDIO VOICE! */}
      <NanaPatekarPainting onHoverTarget={onHoverTarget} />

      {/* Plant */}
      <group position={[6.5, 0, -6.5]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.25, 0.9, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.7, 12, 12]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
      </group>

      {/* Detective Avatar (Player 1) */}
      <DetectiveAvatar targetPos={detectiveTargetPos} isSitting={isDetectiveSitting} />

      {/* Forensic Partner Agent Maya (Player 2 Co-Op Partner in Room) */}
      <ForensicPartnerAvatar 
        onPartnerClick={() => {
          onHoverTarget('👮 Maya: "I scanned the terminal intrusion at 11:38 PM. Check the espresso cup on the desk!"');
        }}
        onHoverTarget={onHoverTarget}
      />

      {/* Victim Corpse */}
      <RealisticVictimBody 
        onClick={() => {
          onToggleSit(false);
          onMoveDetective([-1.2, 0, 0.4]);
          onInspectBody();
        }}
        onHover={(h) => onHoverTarget(h ? "💀 Vincent Vance (Deceased CEO) - Click to Autopsy" : null)}
      />

      {/* Executive Desk & White Chair */}
      <group position={[2.2, 0, 0.6]}>
        <mesh position={[0, 1.78, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 0.12, 2.1]} />
          <meshStandardMaterial color="#29150d" roughness={0.25} />
        </mesh>
        {[-1.9, 1.9].map((x, i) =>
          [-0.85, 0.85].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.88, z]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 1.76, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
            </mesh>
          ))
        )}

        {/* Luxury 3D Gaming Chair Model */}
        <group 
          position={[0, 0, -1.65]}
          onClick={(e) => {
            e.stopPropagation();
            sounds.playBeep(750);
            onToggleSit(!isDetectiveSitting);
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
            onHoverTarget(isDetectiveSitting ? "🪑 Stand Up from Desk" : "🪑 Sit in Gaming Chair");
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
            onHoverTarget(null);
          }}
        >
          <GamingChair3D scale={0.022} position={[0, 0, 0]} accentColor="#dc2626" />
        </group>

        {/* Laptop */}
        <RealisticLaptop 
          onClick={(e) => {
            e.stopPropagation();
            onInspectClue('tampered-terminal');
          }}
          onHover={(h) => onHoverTarget(h ? "💻 CEO Quantum Workstation - Click to Inspect" : null)}
        />

        {/* Mug with Steaming Coffee */}
        <group 
          position={[1.0, 1.84, 0.3]}
          onClick={(e) => {
            e.stopPropagation();
            onInspectClue('broken-mug');
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
            onHoverTarget("☕ Shattered Espresso Mug - Click to Inspect");
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
            onHoverTarget(null);
          }}
        >
          {/* Ceramic Cup */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.1, 0.28, 24]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} />
          </mesh>
          {/* Coffee Liquid Surface */}
          <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.11, 20]} />
            <meshStandardMaterial color="#2c1a0e" roughness={0.1} />
          </mesh>
          {/* Animated Rising Steam Particles */}
          <CoffeeSteam />
        </group>

        {/* Note */}
        <group 
          position={[0.5, 1.85, -0.3]} 
          rotation={[0, 0.25, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onInspectClue('torn-note');
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
            onHoverTarget("📄 Torn Lab Note - Click to Solve Safe Code");
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
            onHoverTarget(null);
          }}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <planeGeometry args={[0.45, 0.6]} />
            <meshStandardMaterial color="#fef08a" />
          </mesh>
        </group>
      </group>

      {/* Ultra-Detailed Titanium Bank Vault / Wall Safe */}
      <group 
        position={[-3.5, 3.5, -8.3]}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSit(false);
          onMoveDetective([-3.5, 0, -6.5]);
          onOpenSafe();
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          onHoverTarget(isSafeOpened ? "🔓 Vault Unlocked - Keycard Retrieved" : "🔐 Titanium Digital Wall Safe [Locked] - Click to Crack PIN");
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          onHoverTarget(null);
        }}
      >
        {/* 1. Recessed Heavy Steel Wall Inset Casing */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.3, 2.1, 0.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 2. Reinforced Brushed Titanium Door Bevel */}
        <RoundedBox args={[2.08, 1.88, 0.22]} radius={0.04} position={[0, 0, 0.1]} castShadow>
          <meshStandardMaterial 
            color={isSafeOpened ? '#064e3b' : '#1e293b'} 
            metalness={0.85} 
            roughness={0.25} 
          />
        </RoundedBox>

        {/* 3. Heavy Locking Bolts (Top, Bottom, Left) */}
        {[-0.7, 0.7].map((y, i) => (
          <mesh key={`bolt-l-${i}`} position={[-1.02, y, 0.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={`bolt-t-${i}`} position={[x, 0.92, 0.1]}>
            <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}

        {/* 4. Heavy Brass Vault Wheel Spokes (Rotating Lock Mechanism) */}
        <group ref={safeDial} position={[-0.32, 0, 0.22]}>
          {/* Central Hub */}
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.08, 32]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Wheel Outer Ring */}
          <mesh position={[0, 0.02, 0]}>
            <torusGeometry args={[0.34, 0.035, 16, 32]} />
            <meshStandardMaterial color="#d97706" metalness={0.95} roughness={0.2} />
          </mesh>
          {/* 3 Vault Turn Spokes */}
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((rad, i) => (
            <mesh key={`spoke-${i}`} rotation={[0, 0, rad]}>
              <boxGeometry args={[0.72, 0.04, 0.035]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.95} roughness={0.15} />
            </mesh>
          ))}
          {/* Center Vault Logo Cap */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
        </group>

        {/* 5. Right Side: Electronic Digital Keypad & LED Display */}
        <group position={[0.55, 0, 0.22]}>
          {/* Keypad Housing Plate */}
          <mesh castShadow>
            <boxGeometry args={[0.62, 1.3, 0.05]} />
            <meshStandardMaterial color="#090d16" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Top LCD Status Display */}
          <mesh position={[0, 0.44, 0.03]}>
            <planeGeometry args={[0.52, 0.22]} />
            <meshStandardMaterial 
              color="#022c22" 
              emissive={isSafeOpened ? '#10b981' : '#0284c7'} 
              emissiveIntensity={isSafeOpened ? 1.4 : 0.8} 
            />
          </mesh>
          <Text
            position={[0, 0.44, 0.035]}
            fontSize={0.075}
            color={isSafeOpened ? '#6ee7b7' : '#38bdf8'}
            anchorX="center"
            anchorY="middle"
          >
            {isSafeOpened ? 'UNLOCKED' : 'PASS: ****'}
          </Text>

          {/* Keypad 3x4 Push Buttons Grid */}
          {[-0.14, 0, 0.14].map((btnX, col) =>
            [0.2, 0.06, -0.08, -0.22].map((btnY, row) => (
              <mesh key={`btn-${col}-${row}`} position={[btnX, btnY, 0.032]}>
                <boxGeometry args={[0.09, 0.08, 0.02]} />
                <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
              </mesh>
            ))
          )}

          {/* Biometric Fingerprint Scanner Glass */}
          <mesh position={[0, -0.42, 0.03]}>
            <planeGeometry args={[0.26, 0.18]} />
            <meshStandardMaterial 
              color="#047857" 
              emissive="#10b981" 
              emissiveIntensity={0.6} 
              roughness={0.1} 
            />
          </mesh>
        </group>

        {/* 6. Heavy Industrial Left Hinges */}
        {[-0.65, 0.65].map((hingeY, i) => (
          <group key={`hinge-${i}`} position={[-1.02, hingeY, 0.15]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.28, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0.08, 0, 0]}>
              <boxGeometry args={[0.16, 0.18, 0.05]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Air Vent */}
      <group 
        position={[-8.3, 6.2, 3.5]} 
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSit(false);
          onMoveDetective([-6.5, 0, 3.5]);
          onInspectClue('cyanide-vial');
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          onHoverTarget("💨 Ventilation Grill - Click to Search");
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          onHoverTarget(null);
        }}
      >
        <mesh castShadow>
          <boxGeometry args={[2.4, 1.1, 0.15]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} />
        </mesh>
      </group>

      {/* Realistic Executive Security Door / Exit Blast Door */}
      <group
        position={[-8.3, 3.2, -2]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSit(false);
          onMoveDetective([-6.5, 0, -2]);
          // Direct transition to Prison Interrogation Room when clicking the door
          sounds.playBeep(440, 'triangle', 0.2);
          onGoToInterrogation();
        }}
        onPointerOver={() => {
          setDoorHovered(true);
          document.body.style.cursor = 'pointer';
          onHoverTarget("🚪 Security Blast Door - Click to Enter Interrogation Chamber");
        }}
        onPointerOut={() => {
          setDoorHovered(false);
          document.body.style.cursor = 'default';
          onHoverTarget(null);
        }}
        scale={doorHovered ? 1.02 : 1}
      >
        {/* 1. Heavy Outer Architectural Architrave / Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.4, 6.6, 0.28]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* 2. Inner Frame Moldings */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[3.0, 6.3, 0.22]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* 3. Luxury Walnut / Mahogany Solid Door Leaf */}
        <mesh position={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[2.7, 6.0, 0.12]} />
          <meshStandardMaterial color="#2d150b" roughness={0.35} metalness={0.1} />
        </mesh>

        {/* 4. Architectural Inset Panels (Upper & Lower) */}
        {/* Upper Decorative Panel */}
        <mesh position={[0, 1.4, 0.145]}>
          <boxGeometry args={[2.2, 2.4, 0.03]} />
          <meshStandardMaterial color="#1c0d07" roughness={0.4} />
        </mesh>
        {/* Upper Panel Inset Trim */}
        <mesh position={[0, 1.4, 0.16]}>
          <boxGeometry args={[1.95, 2.15, 0.02]} />
          <meshStandardMaterial color="#3a1c0e" roughness={0.3} />
        </mesh>

        {/* Lower Decorative Panel */}
        <mesh position={[0, -1.4, 0.145]}>
          <boxGeometry args={[2.2, 2.4, 0.03]} />
          <meshStandardMaterial color="#1c0d07" roughness={0.4} />
        </mesh>
        {/* Lower Panel Inset Trim */}
        <mesh position={[0, -1.4, 0.16]}>
          <boxGeometry args={[1.95, 2.15, 0.02]} />
          <meshStandardMaterial color="#3a1c0e" roughness={0.3} />
        </mesh>

        {/* 5. Brushed Brass Modern Long Door Pull Handle */}
        <group position={[1.05, 0, 0.16]}>
          {/* Handle Vertical Bar */}
          <mesh position={[0, 0, 0.08]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 1.6, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Top Handle Standoff Mount */}
          <mesh position={[0, 0.7, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.08, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Bottom Handle Standoff Mount */}
          <mesh position={[0, -0.7, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.08, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* 6. Smart Electronic Keycard Lock Scanner */}
        <group position={[1.05, 0.95, 0.16]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.38, 0.05]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Keycard Status LED Bar */}
          <mesh position={[0, 0.1, 0.028]}>
            <planeGeometry args={[0.16, 0.04]} />
            <meshStandardMaterial 
              color={doorHovered ? '#22c55e' : '#ef4444'} 
              emissive={doorHovered ? '#22c55e' : '#ef4444'}
              emissiveIntensity={1.8}
            />
          </mesh>
          {/* Keypad Digits Plate */}
          <mesh position={[0, -0.06, 0.028]}>
            <planeGeometry args={[0.14, 0.16]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>

        {/* 7. Illuminated Emergency EXIT Sign Above Door */}
        <group position={[0, 3.25, 0.15]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 0.42, 0.08]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.042]}>
            <planeGeometry args={[1.38, 0.32]} />
            <meshStandardMaterial 
              color="#22c55e" 
              emissive="#22c55e" 
              emissiveIntensity={1.2} 
            />
          </mesh>
          <Text
            position={[0, 0, 0.045]}
            fontSize={0.18}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            EXIT ➔
          </Text>
        </group>
      </group>
    </>
  );
};
