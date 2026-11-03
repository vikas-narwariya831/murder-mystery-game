import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ServerVault3D } from './ServerVault3D';
import { 
  Terminal, 
  Lock, 
  Unlock, 
  Binary, 
  ArrowRight,
  Rotate3d,
  Cpu,
  Wifi,
  ShieldAlert
} from 'lucide-react';
import { sounds } from '../services/audioService';
import confetti from 'canvas-confetti';

interface ServerVaultProps {
  onBypassComplete: () => void;
  onGoToInterrogation: () => void;
}

export const ServerVaultScene: React.FC<ServerVaultProps> = ({
  onBypassComplete,
  onGoToInterrogation,
}) => {
  // 3 Firewalls Grid State
  const [nodes, setNodes] = useState([
    { id: 1, name: 'QUANTUM GATEWAY ALPHA', frequency: 120, target: 440, solved: false },
    { id: 2, name: 'OFFSHORE TRANSFER CIPHER', frequency: 280, target: 880, solved: false },
    { id: 3, name: 'DECRYPT HARDWARE LOGS', frequency: 540, target: 660, solved: false },
  ]);

  const [activeNode, setActiveNode] = useState(1);
  const [currentVal, setCurrentVal] = useState(100);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[BREACH PROTOCOL INITIATED]: Connected to Subterranean Quantum Server Core.",
    "[CYBER INTRUSION]: Rotate 3D mainframe and align frequency harmonic to hack nodes.",
  ]);

  const allSolved = nodes.every(n => n.solved);
  const solvedNodeIds = nodes.filter(n => n.solved).map(n => n.id);

  const handleTune = (delta: number) => {
    sounds.playBeep(currentVal + delta, 'sine', 0.05);
    const newVal = Math.max(50, Math.min(1000, currentVal + delta));
    setCurrentVal(newVal);

    const targetNode = nodes.find(n => n.id === activeNode);
    if (targetNode && Math.abs(newVal - targetNode.target) < 30 && !targetNode.solved) {
      sounds.playSafeSuccess();
      setNodes(prev => prev.map(n => n.id === activeNode ? { ...n, solved: true } : n));
      setTerminalLogs(prev => [
        `[FIREWALL BREACHED]: Node #0${activeNode} (${targetNode.name}) decrypted successfully!`,
        ...prev.slice(0, 5)
      ]);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      onBypassComplete();
    }
  };

  return (
    <div className="w-full h-full relative bg-slate-900 overflow-hidden select-none" style={{ minHeight: 'calc(100vh - 105px)' }}>
      
      {/* ── REAL 3D WEBGL CYBER HACKING VAULT VIEWPORT ── */}
      <div className="absolute inset-0">
        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={['#e2e8f0']} />
          <PerspectiveCamera makeDefault position={[0, 2.6, 5.5]} fov={42} near={0.1} far={50} />
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={2.8} 
            maxDistance={10} 
            maxPolarAngle={Math.PI / 2.05} 
            minPolarAngle={Math.PI / 8}
            target={[0, 1.4, 0.4]}
            rotateSpeed={0.6}
          />
          <ServerVault3D 
            activeNode={activeNode} 
            solvedNodes={solvedNodeIds} 
            isBreached={allSolved} 
          />
        </Canvas>
      </div>

      {/* 3D Camera Orbit Drag Hint */}
      <div className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl text-[10px] font-mono text-slate-300 pointer-events-none flex items-center gap-1.5 shadow-lg">
        <Rotate3d className="w-3.5 h-3.5 text-sky-400 animate-spin [animation-duration:8s]" />
        <span>3D Cyber Mainframe: Drag mouse to orbit server racks</span>
      </div>

      {/* ── TOP HUD: LEVEL 2 OVERVIEW & PROCEED ACTION ── */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {allSolved ? (
          <button
            onClick={onGoToInterrogation}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase font-mono tracking-wider rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2 animate-bounce transition-all active:scale-95 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Proceed to Level 3: Interrogation Cell</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="px-3.5 py-1.5 bg-slate-900/90 border border-indigo-500/40 rounded-xl text-xs font-mono text-indigo-300 backdrop-blur-md flex items-center gap-2 shadow-lg">
            <Wifi className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>{solvedNodeIds.length}/3 Firewalls Breached</span>
          </div>
        )}
      </div>

      {/* ── BOTTOM CYBER HACKING TERMINAL DOCK ── */}
      <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-20 pointer-events-none flex flex-col md:flex-row gap-3">
        
        {/* Node Switcher Tabs */}
        <div className="flex-1 bg-slate-950/80 backdrop-blur-2xl border border-slate-800 rounded-2xl p-3 pointer-events-auto space-y-2 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" /> SELECT QUANTUM RACK NODE
            </span>
            <span className="text-[10px] font-mono text-slate-400">Target Frequency Matching</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {nodes.map(node => (
              <button
                key={node.id}
                onClick={() => {
                  setActiveNode(node.id);
                  setCurrentVal(node.frequency);
                  sounds.playBeep(450);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cursor-pointer ${
                  activeNode === node.id
                    ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold text-indigo-400">#0{node.id}</span>
                  {node.solved ? (
                    <Unlock className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Lock className="w-3 h-3 text-amber-400" />
                  )}
                </div>
                <div className="font-mono text-xs font-bold truncate text-slate-200">{node.name}</div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">{node.target} MHz</div>
              </button>
            ))}
          </div>
        </div>

        {/* Frequency Tuning & Injector Controller */}
        <div className="w-full md:w-80 bg-slate-950/80 backdrop-blur-2xl border border-slate-800 rounded-2xl p-3 pointer-events-auto space-y-2 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-indigo-400" /> HARMONIC INJECTOR
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">{currentVal} MHz</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => handleTune(-100)}
              className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] font-mono font-bold text-slate-300 border border-slate-700/80 active:scale-95 cursor-pointer transition-all"
            >
              -100
            </button>
            <button
              onClick={() => handleTune(-20)}
              className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] font-mono font-bold text-slate-300 border border-slate-700/80 active:scale-95 cursor-pointer transition-all"
            >
              -20
            </button>
            <button
              onClick={() => handleTune(+20)}
              className="py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-[11px] font-mono font-bold text-white shadow-md active:scale-95 cursor-pointer transition-all"
            >
              +20
            </button>
            <button
              onClick={() => handleTune(+100)}
              className="py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-[11px] font-mono font-bold text-white shadow-md active:scale-95 cursor-pointer transition-all"
            >
              +100
            </button>
          </div>

          {/* Console Mini-Log */}
          <div className="text-[10px] font-mono text-slate-400 truncate flex items-center gap-1 pt-0.5">
            <Terminal className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{terminalLogs[0]}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
