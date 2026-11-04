import React from 'react';
import { Sparkles, Check, Code2, Layers, Server } from 'lucide-react';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const tech = [
    { name: 'React 19 + TypeScript', color: 'bg-sky-100 text-sky-700 border-sky-200' },
    { name: 'Vite', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { name: 'Three.js / React Three Fiber', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { name: 'Tailwind CSS', color: 'bg-teal-100 text-teal-700 border-teal-200' },
    { name: 'Node.js & Express REST API', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { name: 'Axios Architecture', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { name: 'React Three Postprocessing', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-white/10">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">About This Project</h3>
              <p className="text-slate-400 text-xs">Interactive 3D Murder Mystery & Forensic Investigation</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Tech stack */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-500" /> Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {tech.map(t => (
                <span key={t.name} className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${t.color}`}>
                  {t.name}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" /> Technical Architecture
            </h4>
            {[
              'Real-time 3D forensic crime scene built with React Three Fiber, custom shadows, bloom and vignette lighting',
              'Decoupled client-server architecture with dedicated Express REST API & centralized Axios network layer',
              'Cryptographic safe keypad verification and procedural algorithmic loop puzzle engine',
              'Interactive multi-suspect cross-examination chamber with real-time anxiety & behavioral state tracking',
              'Full game state engine: clue discovery → safe deciphering → interrogation → final accusation'
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Backend Status Note */}
          <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-sky-500 text-white rounded-lg">
              <Server className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-sky-950">Standalone Microservice Backend</div>
              <div className="text-sky-700">All forensic validations and data persistence run on the dedicated backend service.</div>
            </div>
          </div>

          <div className="flex">
            <button onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-all shadow-md active:scale-98">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
