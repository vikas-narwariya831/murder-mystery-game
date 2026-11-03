import React, { useState, useEffect } from 'react';
import type { ClueItem, SafePuzzle } from '../types/game';
import { 
  RotateCw,
  Search,
  FileText,
  Sparkles,
  Volume2,
  CheckCircle,
  HelpCircle,
  Check,
  XCircle,
  Cpu,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';
import { sounds } from '../services/audioService';
import { generateCriticalLoopPuzzle, type CodeRiddle } from '../services/geminiService';
import confetti from 'canvas-confetti';

interface ForensicModalProps {
  clue: ClueItem | null;
  onClose: () => void;
  safePuzzle?: SafePuzzle;
}

export const InteractiveForensicModal: React.FC<ForensicModalProps> = ({ clue, onClose, safePuzzle }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [highlightSecret, setHighlightSecret] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Critical Loop Decryption Challenge State
  const [riddle, setRiddle] = useState<CodeRiddle | null>(null);
  const [isLoadingRiddle, setIsLoadingRiddle] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  useEffect(() => {
    if (clue && clue.id === 'torn-note' && !riddle) {
      loadNewPuzzle();
    }
  }, [clue]);

  const loadNewPuzzle = async () => {
    setIsLoadingRiddle(true);
    setSelectedOption(null);
    setAnswerSubmitted(false);
    try {
      const newRiddle = await generateCriticalLoopPuzzle();
      setRiddle(newRiddle);
    } catch {
      // Handled by service fallback
    } finally {
      setIsLoadingRiddle(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerCorrect) return; // Already solved
    setSelectedOption(idx);
    sounds.playBeep(700);
  };

  const handleVerifyAnswer = () => {
    if (selectedOption === null || !riddle) return;
    setAnswerSubmitted(true);
    if (selectedOption === riddle.correctOptionIndex) {
      setIsAnswerCorrect(true);
      sounds.playSafeSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } else {
      sounds.playError();
    }
  };

  if (!clue) return null;

  const handleRotate = () => {
    sounds.playBeep(650);
    setRotation(prev => (prev + 90) % 360);
  };

  const handleToggleHighlight = () => {
    sounds.playBeep(850);
    setHighlightSecret(prev => !prev);
  };

  const handlePlayVoice = () => {
    setIsPlayingAudio(true);
    sounds.playBeep(500, 'triangle', 0.2);
    setTimeout(() => {
      sounds.playBeep(600, 'sine', 0.2);
      setIsPlayingAudio(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header - Crisp & Clean White Theme */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 font-mono text-[11px] font-bold">
                EVIDENCE SPECIMEN #{clue.id.toUpperCase()}
              </span>
              <span className="text-xs text-slate-500 font-medium">Chain of Custody: Secured</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{clue.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Central Clean Specimen Viewport (100% Bright, High Contrast, Readable!) */}
        <div className="p-6 space-y-4 overflow-y-auto">
          
          <div className="relative min-h-[280px] bg-gradient-to-b from-slate-100 to-slate-200/80 rounded-2xl border-2 border-slate-300 flex items-center justify-center p-6 overflow-hidden shadow-inner">
            
            {/* Viewport Action Controls (Zoom & Rotate) */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
              <button
                onClick={handleRotate}
                title="Rotate Specimen"
                className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow-sm border border-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <RotateCw className="w-3.5 h-3.5" /> Rotate
              </button>
              <button
                onClick={() => setZoomLevel(prev => (prev === 1 ? 1.25 : 1))}
                className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow-sm border border-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Search className="w-3.5 h-3.5" /> {zoomLevel === 1 ? 'Zoom 1.25x' : 'Reset Zoom'}
              </button>
            </div>

            {/* ACTUAL SPECIMEN DISPLAY - BRIGHT, CLEAN & HIGHLY LEGIBLE */}
            <div 
              style={{ 
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease'
              }}
              className="w-full flex items-center justify-center"
            >

              {/* 1. TORN LAB NOTEBOOK PAGE */}
              {clue.id === 'torn-note' && (
                <div className="w-full max-w-lg bg-[#fffdf0] border-2 border-amber-300/80 rounded-xl p-5 shadow-xl text-slate-900 font-sans relative">
                  {/* Torn Edge Effect Header */}
                  <div className="flex items-center justify-between border-b-2 border-dashed border-amber-300 pb-2 mb-3">
                    <span className="font-mono text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-4 h-4 text-amber-600" /> Dr. Vincent Vance • Encrypted Lab Notebook
                    </span>
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                      BURNED FRAGMENT
                    </span>
                  </div>

                  <p className="text-slate-700 text-xs italic font-serif leading-relaxed mb-3">
                    "...In case of executive breach, safe decryption formula is protected by an algorithmic logic cipher. Crack the loop trace to reveal the Wall Safe PIN..."
                  </p>

                  {/* LOOP RIDDLE CHALLENGE CONTAINER */}
                  {isLoadingRiddle ? (
                    <div className="p-6 bg-slate-900 rounded-xl text-center text-sky-400 font-mono text-xs flex flex-col items-center justify-center gap-2 border border-slate-700">
                      <Cpu className="w-6 h-6 animate-spin text-sky-400" />
                      <span>Deciphering Quantum Execution Logic...</span>
                    </div>
                  ) : riddle ? (
                    <div className="space-y-3">
                      {/* Code Snippet Box */}
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-700 font-mono text-[11px] text-emerald-400 shadow-inner">
                        <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                          <span>Algorithm Loop Snippet</span>
                          <span className="text-sky-400 font-bold">JavaScript / Python Trace</span>
                        </div>
                        <pre className="overflow-x-auto leading-tight text-slate-200">
                          {riddle.codeSnippet}
                        </pre>
                      </div>

                      {/* Question */}
                      <div className="text-xs font-bold text-slate-800 flex items-start gap-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{riddle.question}</span>
                      </div>

                      {/* 4 Interactive Choice Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        {riddle.options.map((opt, idx) => {
                          const isSelected = selectedOption === idx;
                          const isCorrect = isAnswerCorrect && idx === riddle.correctOptionIndex;
                          const isWrong = answerSubmitted && isSelected && !isAnswerCorrect;

                          return (
                            <button
                              key={idx}
                              onClick={() => handleSelectOption(idx)}
                              disabled={isAnswerCorrect}
                              className={`p-2.5 rounded-lg border text-xs font-mono font-bold text-left transition-all flex items-center justify-between ${
                                isCorrect
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xs'
                                  : isWrong
                                  ? 'bg-red-100 border-red-500 text-red-900'
                                  : isSelected
                                  ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-xs ring-1 ring-amber-500'
                                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                              {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                              {isWrong && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Action buttons (Verify or Regenerate) */}
                      {!isAnswerCorrect ? (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={handleVerifyAnswer}
                            disabled={selectedOption === null}
                            className="flex-1 py-2 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 disabled:opacity-40 text-white rounded-lg font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 uppercase font-mono tracking-wider"
                          >
                            <Lock className="w-3.5 h-3.5" /> Verify Answer & Decrypt Safe Code
                          </button>
                          <button
                            onClick={loadNewPuzzle}
                            className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all"
                            title="Regenerate another logic puzzle"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : null}

                      {/* Wrong answer error message */}
                      {answerSubmitted && !isAnswerCorrect && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-[11px] font-mono text-red-700 text-center">
                          ❌ Incorrect Loop Trace! Re-calculate iterations carefully or try another option.
                        </div>
                      )}

                      {/* UNLOCKED: HIGH VISIBILITY PIN FORMULA BOX (ONLY SHOWS AFTER CORRECT ANSWER!) */}
                      {isAnswerCorrect && (
                        <div className="bg-emerald-50 border-2 border-emerald-500 p-3.5 rounded-xl text-center shadow-md animate-fade-in space-y-1">
                          <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-emerald-800 uppercase">
                            <Unlock className="w-4 h-4 text-emerald-600" /> Loop Decrypted Successfully!
                          </div>
                          <div className="text-[11px] text-emerald-700 italic">
                            {riddle.explanation}
                          </div>
                          <div className="text-lg font-mono font-black text-slate-900 tracking-wider pt-1">
                            {safePuzzle 
                              ? `(${safePuzzle.year} × ${safePuzzle.multiplier}) - ${safePuzzle.offset} = ` 
                              : "(1998 × 4) - 500 = "
                            }
                            <span className="text-red-600 bg-white px-2.5 py-1 rounded-md border border-red-400 text-2xl font-black ml-1.5 shadow-sm">
                              {safePuzzle ? safePuzzle.code : "7492"}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-700 font-semibold pt-1">
                            Use PIN <strong className="text-red-700 font-mono text-xs">{safePuzzle ? safePuzzle.code : "7492"}</strong> on the Wall Safe to get the Keycard!
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {highlightSecret && (
                    <div className="mt-3 p-2 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-mono text-emerald-800 animate-pulse text-center">
                      ✨ Forensic Analysis: Paper fibers verify written by Vincent Vance 2 hours prior to demise.
                    </div>
                  )}
                </div>
              )}

              {/* 2. LAPTOP TERMINAL */}
              {clue.id === 'tampered-terminal' && (
                <div className="w-full max-w-md bg-slate-950 rounded-xl border-2 border-sky-400 p-4 shadow-2xl font-mono text-xs text-sky-300">
                  <div className="flex items-center justify-between border-b border-sky-800 pb-2 mb-2 text-slate-400 text-[11px]">
                    <span className="text-sky-400 font-bold">● CEO QUANTUM TERMINAL [11:38 PM]</span>
                    <span className="text-red-400 font-bold">UNSENT DRAFT</span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div><span className="text-slate-500">To:</span> Board Oversight Committee</div>
                    <div><span className="text-slate-500">Subject:</span> <strong className="text-amber-300">Patent Theft by VP Evelyn Cross</strong></div>
                  </div>
                  <div className="my-2.5 p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-200 leading-relaxed">
                    "I have obtained concrete cryptographic evidence that Evelyn liquidated our quantum keys to offshore accounts. I will confront her tonight..."
                  </div>
                  <div className="text-emerald-400 text-[11px] font-bold">
                    ✓ FORENSIC LOG: Unauthorized USB device extracted at 11:39 PM.
                  </div>
                </div>
              )}

              {/* 3. SHATTERED COFFEE MUG */}
              {clue.id === 'broken-mug' && (
                <div className="w-full max-w-md bg-white rounded-xl border-2 border-red-300 p-5 shadow-xl text-center space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-red-100 border-4 border-red-400 flex items-center justify-center text-3xl shadow-inner">
                    ☕
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Shattered Espresso Mug Resiude</h4>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-mono text-red-900">
                    🔬 <strong>Chemical Lab Result:</strong> 99.4% Potassium Cyanide (KCN) concentration detected. Smell matches strong bitter almonds.
                  </div>
                </div>
              )}

              {/* 4. CYANIDE DROPPER */}
              {clue.id === 'cyanide-vial' && (
                <div className="w-full max-w-md bg-white rounded-xl border-2 border-purple-300 p-5 shadow-xl text-center space-y-3">
                  <div className="w-16 h-24 mx-auto rounded-xl bg-purple-100 border-2 border-purple-500 flex items-center justify-center text-2xl shadow-inner">
                    🧪
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Unlabeled 30ml Glass Dropper</h4>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs font-mono text-purple-900">
                    🔬 <strong>Lab Finding:</strong> Smudged with fine silk glove fibers. Dropper residue matches the cyanide inside the espresso mug.
                  </div>
                </div>
              )}

              {/* 5. MASTER KEYCARD */}
              {clue.id === 'keycard-override' && (
                <div className="w-80 h-44 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 p-4 shadow-2xl border-2 border-yellow-200 text-slate-900 flex flex-col justify-between">
                  <div className="flex justify-between font-mono text-xs font-bold">
                    <span>SECURITY OVERRIDE</span>
                    <span>LEVEL 5</span>
                  </div>
                  <div className="text-2xl font-black tracking-widest text-slate-900">MASTER KEYCARD</div>
                  <div className="text-xs font-mono font-bold text-slate-800">
                    Use at the Left Blast Door to escape!
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Interactive Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleHighlight}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  highlightSecret
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {highlightSecret ? 'Hide Highlights' : 'Highlight Clue Details'}
              </button>

              <button
                onClick={handlePlayVoice}
                disabled={isPlayingAudio}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Volume2 className={`w-3.5 h-3.5 text-sky-600 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                {isPlayingAudio ? 'Playing Tape Audio...' : 'Audio Forensics Tape'}
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Forensic Status: <span className="text-emerald-600 font-bold">Verified ✓</span>
            </div>
          </div>

          {/* Forensic Finding Description Card */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 font-mono">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Detective Case Analysis:
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed font-sans font-medium">
              {clue.secretDetail}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            Store in Evidence Bag & Close
          </button>
        </div>
      </div>
    </div>
  );
};
