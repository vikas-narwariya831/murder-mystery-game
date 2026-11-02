import React, { useState } from 'react';
import { Lock, Unlock, AlertCircle, KeyRound, Delete, Sparkles, Shield, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../services/audioService';
import type { SafePuzzle } from '../types/game';

interface SafeModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctCode: string;
  isAlreadyOpened: boolean;
  onSuccessUnlock: () => void;
  safePuzzle?: SafePuzzle;
  isNoteFound?: boolean;
}

export const SafeKeypadModal: React.FC<SafeModalProps> = ({
  isOpen, onClose, correctCode, isAlreadyOpened, onSuccessUnlock, safePuzzle, isNoteFound
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [dialRotation, setDialRotation] = useState(0);
  const [keycardGrabbed, setKeycardGrabbed] = useState(isAlreadyOpened);

  if (!isOpen) return null;

  const handleKey = (num: string) => {
    if (pin.length < 4) {
      sounds.playBeep(900 + parseInt(num) * 50);
      setPin(p => p + num);
      setError(null);
      setDialRotation(prev => prev + 35);
    }
  };

  const handleDelete = () => {
    sounds.playBeep(450);
    setPin(p => p.slice(0, -1));
  };

  const handleClear = () => {
    sounds.playBeep(350);
    setPin('');
    setError(null);
  };

  const handleSubmit = () => {
    if (pin === correctCode) {
      sounds.playSafeSuccess();
      onSuccessUnlock();
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } else {
      sounds.playError();
      setError('ACCESS DENIED: INCORRECT COMBINATION');
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleGrabKeycard = () => {
    sounds.playSafeSuccess();
    setKeycardGrabbed(true);
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      {/* Heavy Bank Vault Chassis */}
      <div className="relative max-w-md w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-[32px] p-6 shadow-2xl border-4 border-slate-700/80 overflow-hidden ring-1 ring-slate-500/30">
        
        {/* Vault Corner Industrial Bolts */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 flex items-center justify-center text-sm font-bold transition-all active:scale-90"
        >
          ✕
        </button>

        {/* Vault Dial & Status Header */}
        <div className="text-center mb-5 pt-2">
          <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
            {/* Outer Heavy Steel Gear Ring */}
            <div 
              style={{ transform: `rotate(${dialRotation}deg)` }}
              className="absolute inset-0 rounded-full border-4 border-dashed border-amber-500/40 animate-[spin_40s_linear_infinite]"
            />
            {/* Inner Vault Wheel Hub */}
            <div 
              style={{ transform: `rotate(${dialRotation}deg)` }}
              className={`w-20 h-20 rounded-full border-4 shadow-2xl flex items-center justify-center transition-transform duration-300 ${
                isAlreadyOpened 
                  ? 'border-emerald-400 bg-gradient-to-br from-emerald-900 to-emerald-950 text-emerald-400 shadow-emerald-500/20' 
                  : 'border-amber-400 bg-gradient-to-br from-slate-900 to-slate-800 text-amber-400 shadow-amber-500/20'
              }`}
            >
              {isAlreadyOpened ? (
                <Unlock className="w-9 h-9 animate-pulse" />
              ) : (
                <Lock className="w-9 h-9" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <h3 className="text-lg font-black tracking-wider text-white uppercase">
              Titanium Vault Safe
            </h3>
            <Cpu className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-[11px] font-mono tracking-widest uppercase mt-0.5 text-slate-400">
            {isAlreadyOpened ? 'STATUS: LOCKDOWN OVERRIDDEN' : 'CYBER-LOCK ARMED • 4-DIGIT PIN REQUIRED'}
          </p>
        </div>

        {/* If safe opened: Interactive Keycard Pickup! */}
        {isAlreadyOpened ? (
          <div className="space-y-4">
            <div className="p-5 bg-emerald-950/60 border-2 border-emerald-500/60 rounded-2xl text-center space-y-3 shadow-inner">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                ✓ Vault Mechanism Disengaged
              </span>

              {/* Physical Interactive Master Keycard */}
              <div 
                onClick={handleGrabKeycard}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  keycardGrabbed 
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md scale-95' 
                    : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-amber-300 shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 animate-pulse'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold font-mono">
                  <span>EXECUTIVE OVERRIDE</span>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xl font-black tracking-widest my-2">MASTER KEYCARD</div>
                <div className="text-[10px] text-right font-mono font-bold">
                  {keycardGrabbed ? '✓ IN DETECTIVE INVENTORY' : '👆 CLICK TO TAKE KEYCARD'}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Use this master keycard at the <strong>High-Security Blast Door</strong> to proceed to interrogation!
              </p>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-sky-600/30"
            >
              Return to Crime Scene
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cyber Terminal Digital LCD Screen */}
            <div className={`bg-slate-950 rounded-2xl p-4 text-center border border-slate-700 shadow-inner transition-all ${
              shake ? 'animate-bounce ring-2 ring-red-500' : ''
            }`}>
              <div className="text-[10px] font-mono uppercase text-sky-400 tracking-widest mb-1.5 font-bold flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping inline-block" />
                ENTER ENCRYPTION PIN
              </div>
              <div className="flex justify-center gap-2.5">
                {[0, 1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className={`w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-bold font-mono border-2 transition-all ${
                      pin[i]
                        ? 'bg-sky-600 border-sky-400 text-white shadow-lg shadow-sky-500/30 scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {pin[i] || '—'}
                  </div>
                ))}
              </div>
              {error && (
                <div className="flex items-center justify-center gap-1.5 mt-2.5 text-xs font-mono text-red-400 font-bold bg-red-950/60 py-1 px-2 rounded-lg border border-red-500/40">
                  <AlertCircle className="w-3.5 h-3.5" /> {error}
                </div>
              )}
            </div>

            {/* Industrial Vault 3x4 Keypad Grid */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(n => (
                <button 
                  key={n} 
                  onClick={() => handleKey(n)}
                  className="py-3.5 bg-slate-800 hover:bg-slate-700 active:bg-sky-700 text-white font-bold text-lg rounded-xl transition-all active:scale-95 border border-slate-600 shadow-md font-mono"
                >
                  {n}
                </button>
              ))}
              <button 
                onClick={handleClear}
                className="py-3.5 bg-red-950/80 hover:bg-red-900 active:bg-red-800 text-red-300 font-mono font-bold text-xs rounded-xl border border-red-700/60 transition-all active:scale-95"
              >
                CLEAR
              </button>
              <button 
                onClick={() => handleKey('0')}
                className="py-3.5 bg-slate-800 hover:bg-slate-700 active:bg-sky-700 text-white font-bold text-lg rounded-xl border border-slate-600 shadow-md transition-all active:scale-95 font-mono"
              >
                0
              </button>
              <button 
                onClick={handleDelete}
                className="py-3.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 rounded-xl border border-slate-600 transition-all active:scale-95 flex items-center justify-center shadow-md"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {/* Submit Passcode Button */}
            <button 
              onClick={handleSubmit} 
              disabled={pin.length !== 4}
              className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-600/30 active:scale-98 font-mono tracking-wider uppercase"
            >
              <KeyRound className="w-4 h-4" /> Disengage Vault Lock
            </button>

            <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-700 text-center text-xs text-amber-300 font-mono">
              {isNoteFound ? (
                <>
                  💡 <strong>Formula Hint:</strong> {safePuzzle ? `${safePuzzle.year} × ${safePuzzle.multiplier} - ${safePuzzle.offset} = ` : '1998 × 4 - 500 = '}
                  <span className="font-bold text-amber-200">{correctCode}</span> (From Torn Lab Note)
                </>
              ) : (
                <span className="text-slate-400">
                  🔒 PIN cipher is written on the <strong>Torn Lab Notebook Page</strong> in the penthouse. Find and inspect it first!
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
