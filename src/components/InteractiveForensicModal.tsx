import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { ClueItem, SafePuzzle } from '../types/game';
import { 
  FileText,
  HelpCircle,
  Check,
  XCircle,
  Cpu,
  RefreshCw,
  Lock,
  Unlock,
  Radio,
  ScanLine
} from 'lucide-react';
import { sounds } from '../services/audioService';
import { generateCriticalLoopPuzzle, type CodeRiddle } from '../services/gameService';
import { ForensicClue3DViewer } from './ForensicClue3DViewer';
import confetti from 'canvas-confetti';

interface ForensicModalProps {
  clue: ClueItem | null;
  onClose: () => void;
  safePuzzle?: SafePuzzle;
}

export const InteractiveForensicModal: React.FC<ForensicModalProps> = ({ clue, onClose, safePuzzle }) => {
  const [highlightSecret, setHighlightSecret] = useState(false);
  const [isLaserScanning, setIsLaserScanning] = useState(false);

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

  const handleTriggerLaserScan = () => {
    sounds.playBeep(1200, 'sawtooth', 0.25);
    setIsLaserScanning(true);
    setTimeout(() => {
      sounds.playBeep(880, 'sine', 0.15);
      setIsLaserScanning(false);
      setHighlightSecret(true);
    }, 2400);
  };

  const has3DModel = ['broken-mug', 'cyanide-vial', 'keycard-override', 'tampered-terminal'].includes(clue.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl max-w-2xl w-full shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-slate-700/80 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header - Sleek Cyberpunk Forensic Dossier Theme */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-mono text-[11px] font-bold border border-sky-500/30">
                FORENSIC SPECIMEN #{clue.id.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 font-mono">Chain of Custody: Secured</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">{clue.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Central Clean Specimen Viewport (3D Interactive Render vs Document) */}
        <div className="p-6 space-y-4 overflow-y-auto bg-slate-900">
          
          <div className="relative min-h-[300px] bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center p-4 overflow-hidden shadow-inner">
            
            {/* Viewport Action Controls (3D Laser Spectrometer Scan) */}
            {has3DModel && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                <button
                  onClick={handleTriggerLaserScan}
                  disabled={isLaserScanning}
                  className="px-3 py-1.5 rounded-xl bg-sky-600/90 hover:bg-sky-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ScanLine className={`w-3.5 h-3.5 ${isLaserScanning ? 'animate-spin text-cyan-200' : ''}`} />
                  <span>{isLaserScanning ? 'SCANNING 3D SPECTRA...' : '3D SPECTRAL SCAN'}</span>
                </button>
              </div>
            )}

            {/* ── 3D REAL-TIME WEBGL SPECIMEN VIEWER (FOR MUG, VIAL, KEYCARD) ── */}
            {has3DModel ? (
              <div className="w-full h-72">
                <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.2, 3.2], fov: 42 }}>
                  <OrbitControls enableZoom={true} enablePan={false} minDistance={2} maxDistance={6} />
                  <ForensicClue3DViewer clueId={clue.id} isScanning={isLaserScanning} />
                </Canvas>
                <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  🖱️ Drag to rotate 3D specimen in 360°
                </div>
              </div>
            ) : (
              /* 1. TORN LAB NOTEBOOK DOCUMENT */
              <div className="w-full flex items-center justify-center">
                <div className="w-full max-w-lg bg-[#fffdf0] border-2 border-amber-300/80 rounded-xl p-5 shadow-xl text-slate-900 font-sans relative">
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
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-700 font-mono text-[11px] text-emerald-400 shadow-inner">
                        <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                          <span>Algorithm Loop Snippet</span>
                          <span className="text-sky-400 font-bold">Execution Trace</span>
                        </div>
                        <pre className="overflow-x-auto leading-tight text-slate-200">
                          {riddle.codeSnippet}
                        </pre>
                      </div>

                      <div className="text-xs font-bold text-slate-800 flex items-start gap-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{riddle.question}</span>
                      </div>

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
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Chemical / Forensic Findings Strip */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-1.5">
              <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> SPECTRAL FORENSIC TELEMETRY
              </span>
              <span className="text-emerald-400 font-bold">VERIFIED EVIDENCE</span>
            </div>
            
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              {clue.id === 'torn-note' && !isAnswerCorrect
                ? 'Fragment is heavily encrypted. Solve the algorithmic loop above to decrypt the Wall Safe passcode.'
                : clue.secretDetail}
            </p>

            {highlightSecret && (
              <div className="mt-2 p-2 bg-sky-950/70 border border-sky-500/40 rounded-xl text-xs font-mono text-sky-300 animate-fade-in">
                ✨ <strong>Chemical Mass Spectrometry:</strong> Trace almond scent corresponds to 99.4% concentrated Potassium Cyanide. Administered within 10 minutes of victim death.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
