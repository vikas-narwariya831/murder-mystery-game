import React, { useState } from 'react';
import { 
  Skull, 
  Activity, 
  ArrowRight, 
  Clock,
  Sparkles
} from 'lucide-react';
import { sounds } from '../services/audioService';

interface VictimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToInterrogation: () => void;
}

export const VictimBodyModal: React.FC<VictimModalProps> = ({
  isOpen,
  onClose,
  onGoToInterrogation,
}) => {
  const [findings, setFindings] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleExamineBodyPart = (findingText: string, step: number) => {
    sounds.playBeep(800 + step * 100);
    if (!findings.includes(findingText)) {
      setFindings(prev => [...prev, findingText]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-600/30 border border-red-500/40 text-red-400">
              <Skull className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-red-400">
                On-Site Coroner Autopsy
              </span>
              <h3 className="text-lg font-bold">Victim: Vincent Vance (Age 42)</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Guided Interactive Body Examination */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>Estimated Time of Death: <strong>11:45 PM</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              <span>Cause: <strong>Asphyxiation via Cyanide</strong></span>
            </div>
          </div>

          {/* Interactive Examination Steps */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Step-by-Step Forensic Examination:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => handleExamineBodyPart(
                  'Bitter almond smell detected on lips and tongue.', 
                  1
                )}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  findings.some(f => f.includes('almond')) 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-white border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="font-bold text-xs mb-1">1. Inspect Mouth/Lips</div>
                <div className="text-[11px] text-slate-500">Check for poisoning or chemical burns</div>
              </button>

              <button
                onClick={() => handleExamineBodyPart(
                  'Hands clenched tightly; traces of fine silk glove fibers under fingernails.', 
                  2
                )}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  findings.some(f => f.includes('silk')) 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-white border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="font-bold text-xs mb-1">2. Inspect Hands</div>
                <div className="text-[11px] text-slate-500">Look for defense wounds or struggle fibers</div>
              </button>

              <button
                onClick={() => handleExamineBodyPart(
                  'Jacket pocket contains torn note with math equation for safe PIN.', 
                  3
                )}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  findings.some(f => f.includes('safe')) 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-white border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="font-bold text-xs mb-1">3. Search Pockets</div>
                <div className="text-[11px] text-slate-500">Retrieve documents or key receipts</div>
              </button>
            </div>
          </div>

          {/* Autopsy Findings Log */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-2">
            <span className="text-xs font-bold font-mono text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Coroner Observations ({findings.length}/3 Logged):
            </span>
            {findings.length === 0 ? (
              <p className="text-xs text-sky-700/80 italic">Click the buttons above to examine the body...</p>
            ) : (
              <ul className="space-y-1.5">
                {findings.map((f, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Next Detective Direction */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed">
            💡 <strong>Detective Deduction:</strong> The silk fibers point directly to someone wearing formal luxury gloves (Evelyn Cross was wearing silk gloves earlier in the penthouse!).
          </div>

          {/* Action to proceed */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all"
            >
              Close Dossier
            </button>
            <button
              onClick={() => {
                onClose();
                onGoToInterrogation();
              }}
              className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20"
            >
              <span>Confront Suspects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
