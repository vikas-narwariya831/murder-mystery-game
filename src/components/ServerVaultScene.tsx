import React, { useState } from 'react';
import { 
  Server, 
  Terminal, 
  Lock, 
  Unlock, 
  Binary, 
  ArrowRight
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
  // Firewalls Grid State (3 Cyber Decryption Nodes)
  const [nodes, setNodes] = useState([
    { id: 1, name: 'QUANTUM GATEWAY ALPHA', frequency: 120, target: 440, solved: false },
    { id: 2, name: 'OFFSHORE TRANSFER CIPHER', frequency: 280, target: 880, solved: false },
    { id: 3, name: 'DECRYPT HARDWARE LOGS', frequency: 540, target: 660, solved: false },
  ]);

  const [activeNode, setActiveNode] = useState(1);
  const [currentVal, setCurrentVal] = useState(100);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM INITIALIZED]: Subterranean Server Vault Level 2.",
    "[WARNING]: Security node locks active. Tune frequency alignment to breach.",
  ]);

  const allSolved = nodes.every(n => n.solved);

  const handleTune = (delta: number) => {
    sounds.playBeep(currentVal + delta, 'sine', 0.05);
    const newVal = Math.max(50, Math.min(1000, currentVal + delta));
    setCurrentVal(newVal);

    const targetNode = nodes.find(n => n.id === activeNode);
    if (targetNode && Math.abs(newVal - targetNode.target) < 30) {
      // Locked on frequency!
      sounds.playSafeSuccess();
      setNodes(prev => prev.map(n => n.id === activeNode ? { ...n, solved: true } : n));
      setTerminalLogs(prev => [
        `[SUCCESS]: Node ${activeNode} (${targetNode.name}) decrypted!`,
        ...prev.slice(0, 5)
      ]);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      onBypassComplete();
    }
  };

  return (
    <div className="w-full h-full relative bg-slate-950 flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden" style={{ minHeight: 'calc(100vh - 105px)' }}>
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Top Level 2 Header HUD */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Server className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold border border-indigo-500/30">
                LEVEL 2 • SUBTERRANEAN
              </span>
              <span className="text-xs text-slate-400 font-mono">B-Floor Server Matrix</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Quantum Server Core & Patent Vault
            </h2>
          </div>
        </div>

        {/* Proceed to Level 3 Interrogation Button */}
        {allSolved && (
          <button
            onClick={onGoToInterrogation}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase font-mono tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 animate-bounce transition-all active:scale-95"
          >
            <span>Proceed to Level 3: Interrogation Cell</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Center 3D Interactive Quantum Rack Terminals */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {nodes.map(node => (
          <div
            key={node.id}
            onClick={() => {
              setActiveNode(node.id);
              setCurrentVal(node.frequency);
              sounds.playBeep(400);
            }}
            className={`p-5 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl relative overflow-hidden flex flex-col justify-between ${
              activeNode === node.id
                ? 'bg-slate-900/90 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500/50'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-indigo-400">NODE #0{node.id}</span>
              {node.solved ? (
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <Unlock className="w-3 h-3" /> DECRYPTED
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                  <Lock className="w-3 h-3" /> LOCKED
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-mono font-bold text-sm text-white">{node.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono">Target: {node.target} MHz Alignment</p>
            </div>

            {/* Signal visualizer bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 mt-4 overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-300 ${node.solved ? 'bg-emerald-400' : 'bg-indigo-500'}`}
                style={{ width: `${Math.min(100, (node.frequency / node.target) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Frequency Tuning Dial & Terminal Console */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tuning Frequency Controller */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Binary className="w-4 h-4 text-sky-400" /> RESIDUAL FREQUENCY SYNCHRONIZER
            </span>
            <span className="text-xs font-mono font-bold text-indigo-400">{currentVal} MHz</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTune(-100)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 transition-all active:scale-95"
              >
                -100 MHz
              </button>
              <button
                onClick={() => handleTune(-20)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 transition-all active:scale-95"
              >
                -20 MHz
              </button>
              <button
                onClick={() => handleTune(+20)}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-mono font-bold text-white transition-all active:scale-95 shadow-md shadow-indigo-600/30"
              >
                +20 MHz
              </button>
              <button
                onClick={() => handleTune(+100)}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-mono font-bold text-white transition-all active:scale-95 shadow-md shadow-indigo-600/30"
              >
                +100 MHz
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-mono text-center">
              Tune frequency to match the target frequency of Node #{activeNode} to extract wiped telemetry.
            </p>
          </div>
        </div>

        {/* Live Terminal Telemetry Output */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-400 space-y-1 overflow-y-auto max-h-40 shadow-inner">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 border-b border-slate-900 pb-1 mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>SUBTERRANEAN SENSOR TERMINAL OUTPUT</span>
          </div>
          {terminalLogs.map((log, idx) => (
            <div key={idx} className="leading-snug text-slate-300">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
