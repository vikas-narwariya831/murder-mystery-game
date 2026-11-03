import React from 'react';
import { 
  Search, 
  Key, 
  MessageSquare, 
  DoorOpen, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface CaseBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaseBriefingModal: React.FC<CaseBriefingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in pointer-events-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-scale-up pointer-events-auto relative z-[101]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full font-bold">
                CONFIDENTIAL DOSSIER #404
              </span>
              <h2 className="text-xl font-bold tracking-tight mt-0.5">
                The Midnight Protocol
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-rose-100 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Powered</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Synopsis */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="text-xs font-mono font-bold text-slate-500 uppercase mb-1">
              Incident Report:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              At <strong>11:45 PM</strong>, CEO Vincent Vance was found dead in Penthouse Suite 404 from potassium cyanide poisoning. The building is on lockdown. You must find the culprit to unseal the blast doors.
            </p>
          </div>

          {/* 4 Step Mission Roadmap */}
          <div>
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              How To Play & Escape:
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-xs">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600 mt-0.5">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">1. Explore 3D Room</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Click floor to walk. Click corpse, laptop & mug to find 5 clues.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-xs">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 mt-0.5">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">2. Crack Wall Safe</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Calculate PIN from the <strong className="text-slate-800 font-mono">Torn Lab Note</strong> formula to extract the Master Keycard.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-xs">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">3. 3D Interrogation</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Sit with suspects in the cell. Slam evidence on the table to break them.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-xs">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 mt-0.5">
                  <DoorOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">4. Accuse & Escape</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Accuse the true killer at the Blast Door to escape lockdown.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Controls Tip */}
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
            <span className="font-mono font-bold text-slate-700">🎮 Controls:</span>
            <span>Left-click to move/interact · Drag mouse to orbit 3D camera.</span>
          </div>
        </div>

        {/* Footer Button */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
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
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-red-600/20 transition-all flex items-center gap-2 cursor-pointer z-50 pointer-events-auto"
          >
            <span>Start Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
