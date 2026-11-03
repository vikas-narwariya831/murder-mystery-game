import React from 'react';
import { ShieldAlert, Sparkles, Database, CheckCircle2 } from 'lucide-react';

interface WaterOrbLoaderProps {
  progress: number;
  item: string;
}

export const WaterOrbLoader: React.FC<WaterOrbLoaderProps> = ({ progress, item }) => {
  const rounded = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-6 text-white select-none overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none -bottom-20 -right-20" />

      {/* Header Badge */}
      <div className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-lg backdrop-blur-md animate-fade-in">
        <ShieldAlert className="w-4 h-4 text-cyan-400" />
        <span className="text-[11px] font-mono tracking-widest text-slate-300 font-bold uppercase">
          CYBERSECURITY PROTOCOL 404 • ASSET PRELOAD
        </span>
      </div>

      {/* ── 3D WATER FILL CIRCLE / ORB ── */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-2.5 bg-gradient-to-b from-slate-800/80 via-slate-900 to-slate-950 shadow-[0_0_50px_rgba(6,182,212,0.35)] border border-cyan-500/30">
        
        {/* Outer Rotating Sci-Fi Ring */}
        <div className="absolute -inset-2 rounded-full border border-dashed border-cyan-400/40 animate-spin [animation-duration:20s]" />
        
        {/* Inner Glass Orb Shell */}
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner bg-slate-950/90 flex items-center justify-center">
          
          {/* Water Fill Liquid Container */}
          <div 
            className="absolute inset-x-0 bottom-0 transition-all duration-300 ease-out"
            style={{ height: `${rounded}%` }}
          >
            {/* Water Gradient Body */}
            <div className="w-full h-full bg-gradient-to-t from-cyan-600 via-sky-500 to-teal-400 opacity-90 shadow-[0_0_30px_rgba(6,182,212,0.8)]" />

            {/* Top Animated Liquid Waves */}
            <svg 
              className="absolute -top-6 left-0 w-[200%] h-8 text-teal-300 fill-current opacity-80 animate-wave"
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
            >
              <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,-20 1200,40 L1200,120 L0,120 Z" />
            </svg>
            <svg 
              className="absolute -top-7 left-0 w-[200%] h-9 text-cyan-200 fill-current opacity-50 animate-wave-reverse"
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
            >
              <path d="M0,30 C200,-30 400,80 600,20 C800,-40 1000,70 1200,25 L1200,120 L0,120 Z" />
            </svg>
          </div>

          {/* Liquid Specular Light Reflex (Glass Reflection Effect) */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none" />

          {/* Center Digital Percentage Display */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {rounded}
              <span className="text-2xl text-cyan-300">%</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-200 font-bold mt-1 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
              {rounded >= 100 ? 'INITIALIZED' : 'BUFFERING'}
            </span>
          </div>

          {/* Subtle Rising Bubbles */}
          <div className="absolute bottom-2 left-1/4 w-2 h-2 rounded-full bg-white/60 animate-ping [animation-duration:2s]" />
          <div className="absolute bottom-4 right-1/3 w-1.5 h-1.5 rounded-full bg-white/70 animate-ping [animation-duration:1.5s]" />
        </div>
      </div>

      {/* Progress Information Card */}
      <div className="mt-8 text-center max-w-sm w-full space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Database className="w-3.5 h-3.5" />
            <span>STREAMING FORENSIC ASSETS</span>
          </span>
          <span>{rounded}/100</span>
        </div>

        {/* Dynamic Asset Status Bar */}
        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300 shadow-inner">
          <span className="truncate max-w-[240px] text-left text-slate-300">
            {item ? item : 'Pre-allocating WebGL memory...'}
          </span>
          {rounded >= 100 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
          ) : (
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin shrink-0 ml-2" />
          )}
        </div>

        <p className="text-[11px] text-slate-500 font-mono text-center pt-1">
          Pre-caching 3D character models, soundscape & shaders for zero lag gameplay.
        </p>
      </div>
    </div>
  );
};
