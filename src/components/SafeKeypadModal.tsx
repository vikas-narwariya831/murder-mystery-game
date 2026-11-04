import React, { useState } from 'react';
import { Lock, Unlock, AlertCircle, KeyRound, Delete, Sparkles, Shield, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../services/audioService';
import type { SafePuzzle } from '../types/game';
import { verifySafePasscodeOnBackend } from '../services/gameService';

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
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleSubmit = async () => {
    if (pin.length !== 4 || isVerifying) return;
    setIsVerifying(true);
    setError(null);

    try {
      const res = await verifySafePasscodeOnBackend(pin, correctCode);
      if (res.unlocked) {
        sounds.playSafeSuccess();
        onSuccessUnlock();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } else {
        sounds.playError();
        setError(res.message || 'ACCESS DENIED: INCORRECT COMBINATION');
        setShake(true);
        setPin('');
        setTimeout(() => setShake(false), 500);
      }
    } catch {
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
    } finally {
      setIsVerifying(false);
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
                  : 'border-slate-600 bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 shadow-black/50'
              }`}
            >
              {isAlreadyOpened ? (
                <Unlock className="w-9 h-9 text-emerald-400 animate-pulse" />
              ) : (
                <Lock className="w-9 h-9 text-amber-400" />
              )}
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-600 text-xs font-mono tracking-widest text-slate-300 uppercase mb-1">
            <Shield className="w-3.5 h-3.5 text-sky-400" /> Biometric Safe Relay
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">
            {isAlreadyOpened ? 'VAULT DECRYPTED' : 'ENTER 4-DIGIT PIN'}
          </h2>
        </div>

        {/* Unlocked State */}
        {isAlreadyOpened ? (
          <div className="space-y-4">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 text-center">
              <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1 font-mono uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Security Lock Disengaged
              </div>
              <p className="text-xs text-slate-300 mb-4 font-mono">
                Safe mechanism has released the internal compartment lock.
              </p>

              {/* Inside the safe: Keycard Item */}
              <div className={`p-4 rounded-xl border-2 transition-all ${
                keycardGrabbed 
                  ? 'bg-slate-900/60 border-slate-700 opacity-60' 
                  : 'bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-500/10'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md flex-shrink-0">
                    <KeyRound className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">FOUND INSIDE:</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">LEVEL 4 CLEARANCE</span>
                    </div>
                    <div className="font-bold text-white text-sm truncate">Executive RFID Keycard</div>
                    <div className="text-[11px] text-slate-400">Grants biometric passage through Penthouse Exit Door.</div>
                  </div>
                </div>

                {!keycardGrabbed ? (
                  <button
                    onClick={handleGrabKeycard}
                    className="mt-3 w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-lg text-xs font-mono uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    Take Keycard into Inventory
                  </button>
                ) : (
                  <div className="mt-2 text-center text-xs text-emerald-400 font-mono">
                    ✓ Stored in Evidence Belt. Penthouse Door is now unlocked!
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-sm transition-all"
            >
              Close Safe
            </button>
          </div>
        ) : (
          /* Locked Keypad State */
          <div className="space-y-4">
            {/* Display screen */}
            <div className={`relative bg-slate-950 rounded-2xl p-4 border-2 transition-all ${
              shake 
                ? 'border-red-500 shadow-lg shadow-red-500/20 translate-x-1' 
                : 'border-slate-800 shadow-inner'
            }`}>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1">
                <span>COMBINATION CODE</span>
                <span className="text-sky-400">{pin.length} / 4 DIGITS</span>
              </div>
              <div className="flex justify-center gap-3 py-1">
                {[0, 1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className={`w-11 h-12 rounded-xl flex items-center justify-center text-xl font-mono font-black transition-all ${
                      pin[i] 
                        ? 'bg-sky-500/20 border-2 border-sky-400 text-sky-300 shadow-lg shadow-sky-500/20 scale-105' 
                        : 'bg-slate-900 border border-slate-800 text-slate-600'
                    }`}
                  >
                    {pin[i] || '•'}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-red-400 font-mono">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Keypad Digits */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  onClick={() => handleKey(num)}
                  className="py-3.5 bg-slate-800 hover:bg-slate-700 active:bg-sky-700 text-white font-bold text-lg rounded-xl border border-slate-600 shadow-md transition-all active:scale-95 font-mono"
                >
                  {num}
                </button>
              ))}
              <button 
                onClick={handleClear}
                className="py-3.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 text-xs font-mono font-bold rounded-xl border border-slate-600 transition-all active:scale-95"
              >
                CLR
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
              disabled={pin.length !== 4 || isVerifying}
              className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-600/30 active:scale-98 font-mono tracking-wider uppercase"
            >
              {isVerifying ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" /> Verifying with Server Vault...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Disengage Vault Lock
                </>
              )}
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
