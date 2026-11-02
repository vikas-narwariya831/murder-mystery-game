import React, { useState } from 'react';
import { Sparkles, Key, Check, ExternalLink, Code2 } from 'lucide-react';
import { getApiKey, setCustomApiKey } from '../services/geminiService';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ isOpen, onClose }) => {
  const [keyInput, setKeyInput] = useState(getApiKey());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setCustomApiKey(keyInput);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  const tech = [
    { name: 'React 19 + TypeScript', color: 'bg-sky-100 text-sky-700 border-sky-200' },
    { name: 'Vite', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { name: 'Three.js / R3F', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { name: 'Tailwind CSS', color: 'bg-teal-100 text-teal-700 border-teal-200' },
    { name: 'Gemini 3.8 Flash', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { name: 'React Three Postprocessing', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-white/10">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">About This Project</h3>
              <p className="text-slate-400 text-xs">Portfolio showcase · AI-powered game</p>
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
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Technical Highlights</h4>
            {[
              'Real-time 3D scene with React Three Fiber + custom lighting, shadows, bloom & vignette post-processing',
              'AI character agents powered by Gemini 3.8 Flash with constrained behavioral system prompts per suspect',
              'Game state machine: clue discovery → safe puzzle → AI interrogation → accusation → escape',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* API Key */}
          <div>
            <label className="flex items-center justify-between text-sm font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5"><Key className="w-4 h-4 text-amber-500" /> Gemini API Key</span>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                className="text-xs text-sky-600 hover:underline flex items-center gap-1 font-normal">
                Get free key <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="AIzaSy... (stays in memory, not stored)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all">
              Close
            </button>
            <button onClick={handleSave}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 transition-all">
              {saved ? <><Check className="w-4 h-4 text-emerald-400" /> Saved!</> : 'Save API Key'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
