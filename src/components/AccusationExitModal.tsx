import React, { useState } from 'react';
import type { Suspect, ClueItem } from '../types/game';
import { ShieldAlert, AlertTriangle, Key, CheckCircle, XCircle, Link2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../services/audioService';

interface AccusationModalProps {
  isOpen: boolean;
  onClose: () => void;
  suspects: Suspect[];
  clues: ClueItem[];
  isSafeOpened: boolean;
  onGameWin: () => void;
  onGameLose: (reason: string) => void;
}

export const AccusationExitModal: React.FC<AccusationModalProps> = ({
  isOpen, onClose, suspects, clues, isSafeOpened, onGameWin, onGameLose,
}) => {
  const [selectedId, setSelectedId] = useState('');
  const [linkedEvidenceIds, setLinkedEvidenceIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const discoveredClues = clues.filter(c => c.discovered);

  // Toggle evidence pin
  const toggleEvidenceLink = (id: string) => {
    sounds.playBeep(700);
    setLinkedEvidenceIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Calculate dynamic Conviction Score
  const convictionScore = Math.min(
    100,
    (selectedId === 'evelyn' ? 40 : 15) + (linkedEvidenceIds.length * 20)
  );

  const handleSubmit = () => {
    if (!isSafeOpened) {
      sounds.playError();
      setError('You must unlock the wall safe to retrieve the Master Keycard first!');
      return;
    }
    if (!selectedId) {
      sounds.playError();
      setError('Please select a prime suspect to formally file the charge!');
      return;
    }

    const chosen = suspects.find(s => s.id === selectedId);
    if (chosen?.isGuilty) {
      sounds.playSafeSuccess();
      confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 } });
      onGameWin();
    } else {
      sounds.playError();
      onGameLose(
        `Wrong accusation! You accused ${chosen?.name} who had verified alibi logs. The true culprit Evelyn Cross used the emergency distraction to erase the evidence and escape!`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header Banner */}
        <div className="bg-red-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Penthouse Blast Exit & Warrant</h3>
              <p className="text-red-100 text-xs mt-0.5">Link evidence and pin the prime murderer to escape</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Escape Status Checklist */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-sm ${
              isSafeOpened ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              {isSafeOpened
                ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                : <XCircle className="w-5 h-5 text-slate-400 shrink-0" />
              }
              <div>
                <p className="font-bold text-slate-800 text-xs">Master Keycard</p>
                <p className={`text-[11px] ${isSafeOpened ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                  {isSafeOpened ? '✓ Acquired from Safe' : 'Locked in wall safe'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col justify-center">
              <div className="flex items-center justify-between text-xs font-bold text-sky-800 mb-1">
                <span>Conviction Probability</span>
                <span>{convictionScore}%</span>
              </div>
              <div className="w-full h-2 bg-sky-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-600 rounded-full transition-all duration-300" 
                  style={{ width: `${convictionScore}%` }} 
                />
              </div>
            </div>
          </div>

          {/* 1. Suspect Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Choose Prime Suspect to Accuse:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {suspects.filter(s => s.id !== 'aria').map(s => {
                const isSelected = selectedId === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      sounds.playBeep(850);
                      setSelectedId(s.id);
                      setError(null);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-red-500 bg-red-50/80 shadow-md ring-2 ring-red-200'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                    }`}
                  >
                    <img 
                      src={s.avatar} 
                      alt={s.name} 
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm shrink-0" 
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">{s.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{s.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Interactive Evidence Pinning Board */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span>2. Pin Incriminating Clues to Case Board:</span>
              <span className="text-[10px] text-sky-600 font-normal">Click items to pin</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {discoveredClues.map(c => {
                const isLinked = linkedEvidenceIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => toggleEvidenceLink(c.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer text-xs transition-all flex items-center justify-between ${
                      isLinked
                        ? 'bg-sky-600 text-white border-sky-700 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <span className="truncate font-semibold">{c.title}</span>
                    <Link2 className={`w-3.5 h-3.5 shrink-0 ${isLinked ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all"
            >
              Resume Investigation
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/30"
            >
              <Key className="w-4 h-4" /> Final Accusation & Escape
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
