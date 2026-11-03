import React from 'react';
import { 
  Search, 
  Key, 
  MessageSquare, 
  DoorOpen, 
  ArrowRight,
  ShieldCheck,
  FolderGit2
} from 'lucide-react';

interface CaseBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaseBriefingModal: React.FC<CaseBriefingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in pointer-events-auto"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 rounded-3xl border border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-w-xl w-full overflow-hidden animate-scale-up pointer-events-auto relative z-[101] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Badge - Sleek Executive Navy / Slate Theme */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-6 py-5 text-white flex items-center justify-between border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-400/30 backdrop-blur-md flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold border border-sky-500/30">
                OFFICIAL DOSSIER #404
              </span>
              <h2 className="text-xl font-bold tracking-tight mt-0.5 text-white">
                The Midnight Protocol
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono font-medium">
            <FolderGit2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Forensic Case</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 bg-slate-900">
          {/* Synopsis */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-inner">
            <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider mb-1">
              Incident Report:
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              At <strong className="text-white">11:45 PM</strong>, CEO Vincent Vance was found dead in Penthouse Suite 404 from potassium cyanide poisoning. The building is on lockdown. You must find the culprit to unseal the blast doors.
            </p>
          </div>

          {/* 4 Step Mission Roadmap */}
          <div>
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Protocol Objectives:
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex items-start gap-2.5 shadow-sm">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 mt-0.5 border border-sky-500/20">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">1. Explore 3D Room</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Click floor to walk. Click corpse, laptop & mug to find 5 clues.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex items-start gap-2.5 shadow-sm">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mt-0.5 border border-amber-500/20">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">2. Crack Wall Safe</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Calculate PIN from the <strong className="text-slate-200 font-mono">Torn Lab Note</strong> formula to extract the Master Keycard.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex items-start gap-2.5 shadow-sm">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mt-0.5 border border-purple-500/20">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">3. 3D Interrogation</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Sit with suspects in the cell. Slam evidence on the table to break them.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex items-start gap-2.5 shadow-sm">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5 border border-emerald-500/20">
                  <DoorOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">4. Accuse & Escape</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Accuse the true killer at the Blast Door to escape lockdown.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Controls Tip */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3.5 py-2.5 rounded-xl border border-slate-700/70">
            <span className="font-mono font-bold text-sky-400">🎮 Controls:</span>
            <span>Left-click to move/interact · Drag mouse to orbit 3D camera.</span>
          </div>
        </div>

        {/* Footer Button - Executive Navy/Sky CTA */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Ready to solve the mystery?
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center gap-2 cursor-pointer z-50 pointer-events-auto"
          >
            <span>Start Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
