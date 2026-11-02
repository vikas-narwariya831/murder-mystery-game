import React, { useState } from 'react';
import type { ClueItem } from '../types/game';
import { 
  Laptop, 
  Coffee, 
  FileText, 
  Wind, 
  DoorClosed, 
  KeyRound, 
  Check, 
  HelpCircle,
  Eye,
  Sparkles
} from 'lucide-react';

interface VisualRoomProps {
  clues: ClueItem[];
  onInspectClue: (clueId: string) => void;
  isSafeOpened: boolean;
  onOpenSafe: () => void;
  onOpenExitDoor: () => void;
}

export const VisualRoomScene: React.FC<VisualRoomProps> = ({
  clues,
  onInspectClue,
  isSafeOpened,
  onOpenSafe,
  onOpenExitDoor,
}) => {
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null);

  const getClue = (id: string) => clues.find(c => c.id === id);

  const mugClue = getClue('broken-mug');
  const terminalClue = getClue('tampered-terminal');
  const noteClue = getClue('torn-note');
  const vialClue = getClue('cyanide-vial');

  return (
    <div className="space-y-4">
      {/* Visual Room Graphic Container */}
      <div className="relative w-full aspect-[16/9] min-h-[460px] max-h-[620px] rounded-2xl border-2 border-noir-600 bg-gradient-to-b from-[#0b0f19] via-[#101728] to-[#070a10] overflow-hidden shadow-2xl select-none">
        
        {/* Background Cyberpunk Penthouse Luxury Window */}
        <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-[#0e1628] to-transparent opacity-60 pointer-events-none">
          {/* City skyline neon silhouettes */}
          <div className="absolute inset-0 flex items-end justify-around opacity-30 px-6 pb-2">
            <div className="w-16 h-40 bg-cyan-900/60 rounded-t border-t border-cyan-400/30" />
            <div className="w-24 h-48 bg-purple-950/60 rounded-t border-t border-purple-400/30" />
            <div className="w-12 h-36 bg-blue-900/50 rounded-t" />
            <div className="w-20 h-52 bg-slate-900 rounded-t border-t border-cyan-500/20" />
            <div className="w-28 h-44 bg-indigo-950/50 rounded-t" />
          </div>
          <div className="absolute top-4 left-6 text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-black/50 px-2.5 py-1 rounded border border-cyan-500/30">
            Sector 7 • Penthouse Suite 404 • 11:58 PM [Crime Scene]
          </div>
        </div>

        {/* Ambient Room Lighting Cone from ceiling */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-full bg-gradient-to-b from-cyan-500/10 via-transparent to-red-500/5 pointer-events-none blur-2xl" />

        {/* 1. HOTSPOT: Heavy Blast Exit Door (Far Left) */}
        <div
          onClick={onOpenExitDoor}
          onMouseEnter={() => setHoveredSpot("Penthouse Blast Door (Emergency Exit Lockdown)")}
          onMouseLeave={() => setHoveredSpot(null)}
          className="absolute left-6 bottom-16 sm:bottom-20 w-32 sm:w-40 h-64 sm:h-80 rounded-t-xl border-2 border-red-500/60 bg-gradient-to-b from-red-950/80 to-noir-900 flex flex-col items-center justify-between p-3 cursor-pointer group hover:border-red-400 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-400 bg-black/60 px-2 py-0.5 rounded-full border border-red-500/30 animate-pulse">
            <DoorClosed className="w-3.5 h-3.5" /> BLAST DOOR
          </div>

          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-full border-2 border-red-500/40 flex items-center justify-center bg-noir-950 group-hover:scale-110 transition-transform">
              <span className="text-xs font-mono text-red-400 font-bold">LOCKED</span>
            </div>
            <div className="mt-2 text-[11px] text-gray-300 font-mono">
              Final Accusation & Escape
            </div>
          </div>

          <div className="text-[10px] font-mono text-red-400 underline group-hover:text-red-300">
            [Click to Escape]
          </div>
        </div>

        {/* 2. HOTSPOT: Titanium Wall Safe (Left Wall) */}
        <div
          onClick={onOpenSafe}
          onMouseEnter={() => setHoveredSpot("Titanium Wall Safe (Requires 4-Digit Passcode)")}
          onMouseLeave={() => setHoveredSpot(null)}
          className={`absolute left-44 sm:left-56 top-28 sm:top-36 w-24 sm:w-28 h-24 sm:h-28 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center p-2 group ${
            isSafeOpened
              ? 'border-emerald-400 bg-emerald-950/70 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
              : 'border-amber-500/70 bg-noir-800/90 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]'
          }`}
        >
          <div className="p-2 rounded-lg bg-black/50 border border-gray-700 group-hover:scale-110 transition-transform">
            <KeyRound className={`w-6 h-6 ${isSafeOpened ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`} />
          </div>
          <span className="text-[10px] font-mono font-bold mt-1 text-center text-gray-200">
            {isSafeOpened ? 'SAFE [OPEN]' : 'WALL SAFE'}
          </span>
          <span className="text-[9px] font-mono text-amber-300">
            {isSafeOpened ? 'Keycard Taken' : '[Click Keypad]'}
          </span>
        </div>

        {/* 3. HOTSPOT: Ceiling Air Vent (Top Right) */}
        <div
          onClick={() => vialClue && onInspectClue(vialClue.id)}
          onMouseEnter={() => setHoveredSpot("AC Ventilation Grill (Something glass is hidden inside)")}
          onMouseLeave={() => setHoveredSpot(null)}
          className={`absolute right-14 sm:right-28 top-8 w-28 sm:w-36 h-14 rounded-lg border cursor-pointer flex items-center justify-between px-3 transition-all ${
            vialClue?.discovered
              ? 'border-cyan-500/40 bg-noir-900/80 text-cyan-400'
              : 'border-amber-400/80 bg-amber-950/40 text-amber-300 hover:border-amber-300 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.2)]'
          }`}
        >
          <Wind className="w-5 h-5 shrink-0" />
          <div className="text-right">
            <div className="text-[10px] font-mono font-bold uppercase">Air Vent</div>
            <div className="text-[9px] font-mono text-gray-300">
              {vialClue?.discovered ? 'Vial Found ✓' : '[Inspect Grill]'}
            </div>
          </div>
        </div>

        {/* Central Executive Desk & Victim Station */}
        <div className="absolute right-12 sm:right-28 bottom-6 sm:bottom-10 w-[55%] sm:w-[50%] h-48 sm:h-56 rounded-2xl border-2 border-noir-600 bg-gradient-to-t from-noir-950 via-noir-800 to-slate-900/90 shadow-2xl p-4 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest border-b border-noir-700 pb-1 flex items-center justify-between">
            <span>CEO Private Workstation</span>
            <span className="text-red-400 font-bold">VICTIM WAS SEATED HERE</span>
          </div>

          {/* Items On the Desk */}
          <div className="grid grid-cols-3 gap-3 my-auto">
            {/* 4. HOTSPOT: Quantum Terminal Laptop */}
            <div
              onClick={() => terminalClue && onInspectClue(terminalClue.id)}
              onMouseEnter={() => setHoveredSpot("Victim's Quantum Workstation (Screen still turned on with unsent email)")}
              onMouseLeave={() => setHoveredSpot(null)}
              className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                terminalClue?.discovered
                  ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                  : 'border-cyan-400 bg-cyan-950/40 text-cyan-200 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-bounce'
              }`}
            >
              <Laptop className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
              <span className="text-[11px] font-bold font-mono">Terminal PC</span>
              <span className="text-[9px] text-gray-300 font-mono">
                {terminalClue?.discovered ? 'Examined ✓' : '[Inspect]'}
              </span>
            </div>

            {/* 5. HOTSPOT: Shattered Espresso Coffee Mug */}
            <div
              onClick={() => mugClue && onInspectClue(mugClue.id)}
              onMouseEnter={() => setHoveredSpot("Shattered Espresso Mug (Smells like bitter almonds / Cyanide)")}
              onMouseLeave={() => setHoveredSpot(null)}
              className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                mugClue?.discovered
                  ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                  : 'border-red-400 bg-red-950/40 text-red-200 hover:scale-105 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
              }`}
            >
              <Coffee className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
              <span className="text-[11px] font-bold font-mono">Coffee Mug</span>
              <span className="text-[9px] text-gray-300 font-mono">
                {mugClue?.discovered ? 'Cyanide Found ✓' : '[Inspect]'}
              </span>
            </div>

            {/* 6. HOTSPOT: Torn Lab Notebook */}
            <div
              onClick={() => noteClue && onInspectClue(noteClue.id)}
              onMouseEnter={() => setHoveredSpot("Torn Lab Note (Contains mathematical formula for the safe code)")}
              onMouseLeave={() => setHoveredSpot(null)}
              className={`p-2 sm:p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                noteClue?.discovered
                  ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                  : 'border-amber-400 bg-amber-950/40 text-amber-200 hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
              }`}
            >
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
              <span className="text-[11px] font-bold font-mono">Torn Note</span>
              <span className="text-[9px] text-gray-300 font-mono">
                {noteClue?.discovered ? 'Code Solved ✓' : '[Read Code]'}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 text-center font-mono">
            Click on items on the desk to inspect forensic details
          </div>
        </div>

        {/* Hover Inspection Inspector Bar at the bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-noir-950/90 border-t border-noir-700 px-4 py-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Target:</span>
            <span className="text-white font-semibold">
              {hoveredSpot || "Hover over objects in the room (Desk, Safe, Vent, Blast Door)..."}
            </span>
          </div>

          <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-noir-gold" />
            <span>Point & Click Scene Mode</span>
          </div>
        </div>
      </div>

      {/* Detective Objectives Walkthrough (Step-by-Step Clarity) */}
      <div className="bg-noir-800/90 border border-noir-700 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold mb-3">
          <HelpCircle className="w-4 h-4" /> Detective Investigation Protocol:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Step 1 */}
          <div className={`p-3 rounded-lg border text-xs ${
            clues.filter(c => c.discovered).length >= 3
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-noir-900 border-noir-700 text-gray-300'
          }`}>
            <div className="flex items-center justify-between font-mono font-bold mb-1">
              <span>STEP 1: Clues</span>
              {clues.filter(c => c.discovered).length >= 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <span className="text-[10px] text-amber-400">In Progress</span>}
            </div>
            <p className="text-[11px] text-gray-400">
              Click & inspect <strong>Coffee Mug</strong>, <strong>Terminal</strong>, and <strong>Air Vent</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`p-3 rounded-lg border text-xs ${
            isSafeOpened
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-noir-900 border-noir-700 text-gray-300'
          }`}>
            <div className="flex items-center justify-between font-mono font-bold mb-1">
              <span>STEP 2: Safe Code</span>
              {isSafeOpened ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <span className="text-[10px] text-amber-400">Locked</span>}
            </div>
            <p className="text-[11px] text-gray-400">
              Read <strong>Torn Note</strong> to calculate dynamic PIN & unlock safe for Keycard.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3 rounded-lg border bg-noir-900 border-noir-700 text-xs text-gray-300">
            <div className="flex items-center justify-between font-mono font-bold mb-1">
              <span>STEP 3: Interrogate</span>
              <span className="text-[10px] text-cyan-400">AI Chat</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Go to <strong>AI Interrogation Tab</strong> and cross-examine Evelyn & Marcus.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3 rounded-lg border bg-noir-900 border-noir-700 text-xs text-gray-300">
            <div className="flex items-center justify-between font-mono font-bold mb-1">
              <span>STEP 4: Escape</span>
              <span className="text-[10px] text-red-400">Final Arrest</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Click <strong>Blast Door</strong>, accuse Evelyn Cross, and unlock exit!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
