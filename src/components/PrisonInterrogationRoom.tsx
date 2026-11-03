import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { CinematicInterrogation3D } from './CinematicInterrogation3D';
import { Scene3DLoader } from './Scene3DLoader';
import type { Suspect, ClueItem } from '../types/game';
import { askSuspectAI } from '../services/geminiService';
import { 
  Loader2, 
  ShieldAlert, 
  ArrowLeft,
  Rotate3d,
  Flame,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { sounds } from '../services/audioService';

interface InterrogationRoomProps {
  suspects: Suspect[];
  clues: ClueItem[];
  onAccuseSuspect: (suspectId: string) => void;
  onBackToScene: () => void;
}

// Progressive Multi-Stage Dialogue Tree for each suspect
const SUSPECT_STAGES: Record<string, string[][]> = {
  evelyn: [
    // Stage 0 (Opening questions)
    [
      "Where were you at 11:45 PM when Vincent's vitals flatlined?",
      "Why was your lab badge recorded accessing Potassium Cyanide?",
      "We found evidence Vincent was cutting your research budget. Did you poison him?",
    ],
    // Stage 1 (After first answer - Pressing on timeline & motives)
    [
      "You claim you were in the lab, but the terminal logs show zero keystrokes between 11:30 and midnight!",
      "A torn lab note in Vincent's office contains your proprietary synthetic formula. How did it get there?",
      "Vincent threatened to report your unauthorized chemical synthesis to the board. That's motive for murder!",
    ],
    // Stage 2 (High pressure cross-examination)
    [
      "Your synthetic cyanide compound has a unique chemical signature found in the victim's espresso!",
      "The corridor camera clocked someone of your exact height exiting the executive floor right before the alarm!",
      "Your hands are trembling, Dr. Cross. Confess before forensics uncovers the rest of your traces!",
    ],
    // Stage 3 (Final confrontation / Breaking point)
    [
      "The autopsy report is in—the lethal dose was administered directly from your private lab vial!",
      "You knew Vincent was going to fire you at Monday's board meeting, didn't you?!",
      "Look at me, Evelyn! It's over. Give us the full confession and save yourself!",
    ],
  ],
  marcus: [
    // Stage 0
    [
      "Vincent caught you transferring proprietary patents to offshore entities.",
      "Your fingerprint was detected on the quantum terminal right before the murder.",
      "Did you slip cyanide into Vincent's espresso mug during the midnight review?",
    ],
    // Stage 1
    [
      "You needed Vincent eliminated before the audit tomorrow morning could expose your offshore accounts!",
      "Why was the server log scrubbed at 11:38 PM using your executive administrator credentials?",
      "A witness saw you arguing with Vincent near the coffee machine twenty minutes before he died!",
    ],
    // Stage 2
    [
      "We recovered the offshore transfer wire slips Vincent was clutching in his desk drawer!",
      "You stole the cipher formula to crack the wall safe and fled right after he collapsed!",
      "Stop lying, Marcus! Your alibi is completely shredded by the building security timestamps!",
    ],
    // Stage 3
    [
      "The financial fraud alone will put you away for decades. Do you really want murder added to it?!",
      "We found trace cyanide powder on the cuff of your designer jacket. Game over, Marcus!",
      "Sign the confession now or face first-degree capital murder charges!",
    ],
  ],
  aria: [
    // Stage 0
    [
      "You were the last person seen leaving the executive penthouse suite.",
      "Corridor security camera shows you running in a panic at 11:42 PM.",
      "Explain who gave you the security clearance keycard to Vincent's private floor.",
    ],
    // Stage 1
    [
      "A.R.I.A., your internal event logs recorded a manual override on the suite door at 11:40 PM. Who ordered it?",
      "The facility telemetry indicates you suppressed the silent toxicity alarm for four minutes!",
      "Did you assist one of the co-founders in executing this assassination?",
    ],
    // Stage 2
    [
      "A sub-routine in your core processor was modified to delete footage of the murder!",
      "You were ordered to eliminate Vincent because he discovered the unauthorized system breach!",
      "Query: Identify the user terminal that uploaded the cyanide deployment protocol!",
    ],
    // Stage 3
    [
      "Your logic circuits are overloading. The truth protocol cannot be bypassed any longer!",
      "State the name of Vincent Vance's true killer immediately under Supreme Investigative Order!",
      "Full system diagnostic initiated—extract all encrypted black box recordings now!",
    ],
  ],
};

export const PrisonInterrogationRoom: React.FC<InterrogationRoomProps> = ({
  suspects: initialSuspects,
  clues,
  onAccuseSuspect,
  onBackToScene,
}) => {
  const [suspects, setSuspects] = useState<Suspect[]>(initialSuspects);
  const [activeSuspectId, setActiveSuspectId] = useState<string>(initialSuspects[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [panicLevel, setPanicLevel] = useState<Record<string, number>>({
    evelyn: 15,
    marcus: 20,
    aria: 0,
  });

  // Track conversation progress stage (0, 1, 2, 3...) per suspect so new options appear!
  const [suspectStage, setSuspectStage] = useState<Record<string, number>>({
    evelyn: 0,
    marcus: 0,
    aria: 0,
  });

  // Active interrogation mode: 'questions' or 'evidence'
  const [dialogueMenuMode, setDialogueMenuMode] = useState<'questions' | 'evidence'>('questions');

  const [lastDialogueSpeaker, setLastDialogueSpeaker] = useState<'detective' | 'suspect'>('suspect');
  const [latestDialogueText, setLatestDialogueText] = useState<string>(
    "Detective Panda. I have nothing to say until my attorney arrives. You have zero evidence linking me to Vincent's death."
  );

  // Typewriter effect state for dialogue playback
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const activeSuspect = suspects.find(s => s.id === activeSuspectId) || suspects[0];
  const discoveredClues = clues.filter(c => c.discovered);

  // Run typewriter effect & trigger character voice whenever latestDialogueText updates
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;
    const textToType = latestDialogueText;

    // Trigger voice speech for detective or the active suspect
    sounds.speakDialogue(
      textToType, 
      lastDialogueSpeaker === 'detective' ? 'panda' : (activeSuspect.id as 'evelyn' | 'marcus' | 'aria')
    );

    const interval = setInterval(() => {
      index++;
      setDisplayedText(textToType.slice(0, index));
      if (index >= textToType.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 18);

    return () => {
      clearInterval(interval);
    };
  }, [latestDialogueText, lastDialogueSpeaker, activeSuspect.id]);

  const handleSendDialogue = async (text: string) => {
    if (!text || isLoading) return;
    setIsLoading(true);
    sounds.playBeep(700, 'sine', 0.08);

    setLastDialogueSpeaker('detective');
    setLatestDialogueText(text);

    // Real culprit (Evelyn) breaks down heavily; innocents remain composed or calm down!
    setPanicLevel(prev => {
      const current = prev[activeSuspectId] || 15;
      const isGuiltySuspect = activeSuspect.isGuilty; // Evelyn is true, Marcus and ARIA are false

      if (isGuiltySuspect) {
        // Guilty suspect's guilt and tension skyrockets when cornered with evidence!
        const hasChemicalEvidence = text.toLowerCase().includes('cyanide') || text.toLowerCase().includes('confronting') || text.toLowerCase().includes('vial') || text.toLowerCase().includes('formula');
        const boost = hasChemicalEvidence ? 26 : 18;
        return {
          ...prev,
          [activeSuspectId]: Math.min(100, current + boost)
        };
      } else if (activeSuspectId === 'aria') {
        // AI remains emotionless, tension stays near 0%
        return {
          ...prev,
          aria: 0
        };
      } else {
        // Innocent suspect (Marcus) is initially anxious, but stays firm around 20-35% and doesn't break down
        return {
          ...prev,
          marcus: Math.min(35, Math.max(15, current + (text.toLowerCase().includes('fingerprint') ? 5 : -4)))
        };
      }
    });

    try {
      const aiReply = await askSuspectAI(activeSuspect.systemPrompt, activeSuspect.messages, text);
      
      setSuspects(prev => prev.map(s =>
        s.id === activeSuspectId ? {
          ...s,
          messages: [
            ...s.messages,
            { role: 'user', text },
            { role: 'model', text: aiReply }
          ]
        } : s
      ));

      setLastDialogueSpeaker('suspect');
      setLatestDialogueText(aiReply);

      // Advance dialogue tree to next stage so brand new questions appear!
      setSuspectStage(prev => {
        const curStage = prev[activeSuspectId] || 0;
        const totalStages = SUSPECT_STAGES[activeSuspectId]?.length || 1;
        return {
          ...prev,
          [activeSuspectId]: (curStage + 1) % totalStages
        };
      });

    } catch {
      setLastDialogueSpeaker('suspect');
      setLatestDialogueText("My attorney advised me to remain silent! You have no hard proof!");
      setSuspectStage(prev => ({
        ...prev,
        [activeSuspectId]: ((prev[activeSuspectId] || 0) + 1) % (SUSPECT_STAGES[activeSuspectId]?.length || 1)
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfrontClue = (clue: ClueItem) => {
    sounds.playBeep(1100, 'sawtooth', 0.15);
    const slamText = `[CONFRONTING WITH ${clue.title.toUpperCase()}]: "${clue.secretDetail} Explain this immediately!"`;
    handleSendDialogue(slamText);
  };

  const currentPanic = panicLevel[activeSuspect.id] || 20;
  const currentStageIndex = suspectStage[activeSuspect.id] || 0;
  const currentQuestions = SUSPECT_STAGES[activeSuspect.id]?.[currentStageIndex] || [];

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900 select-none" style={{ minHeight: 'calc(100vh - 105px)' }}>
      
      {/* ── TOP SLENDER FLOATING HEADER HUD ── */}
      <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent px-4 py-2.5 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="font-bold text-xs text-white font-mono tracking-wider hidden sm:inline">
            POLICE HOLDING CELL
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono font-semibold border border-red-500/30">
            {activeSuspect.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Suspect Inmate Switcher Pills */}
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10">
            {suspects.map(s => {
              const isSelected = s.id === activeSuspectId;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    sounds.playBeep(650);
                    setActiveSuspectId(s.id);
                    setLatestDialogueText(s.messages[s.messages.length - 1]?.text || "I have nothing to say until my lawyer arrives.");
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>

          <button
            onClick={onBackToScene}
            className="bg-black/60 hover:bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15 text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Penthouse</span>
          </button>

          <button
            onClick={() => onAccuseSuspect(activeSuspect.id)}
            className="bg-red-600 hover:bg-red-500 px-3.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition-all flex items-center gap-1 active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Accuse
          </button>
        </div>
      </div>

      {/* ── FULLSCREEN 3D WEBGL VIEWPORT ── */}
      <div className="absolute inset-0 bg-slate-100">
        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={['#f8fafc']} />
          <fog attach="fog" args={['#f8fafc', 16, 40]} />
          <PerspectiveCamera makeDefault position={[-0.8, 2.3, 4.2]} fov={38} near={0.1} far={50} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2.5}
            maxDistance={5.8}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 6}
            minAzimuthAngle={-Math.PI * 0.42}
            maxAzimuthAngle={Math.PI * 0.42}
            target={[0.2, 1.45, -0.6]}
            rotateSpeed={0.5}
          />
          <Suspense fallback={<Scene3DLoader progress={100} label="Interrogation Unit" />}>
            <CinematicInterrogation3D
              suspectId={activeSuspect.id}
              isSpeaking={isLoading}
            />
          </Suspense>
        </Canvas>

        {/* Camera Orbit Drag Hint */}
        <div className="absolute top-14 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-300 pointer-events-none flex items-center gap-1.5">
          <Rotate3d className="w-3 h-3 text-sky-400" />
          <span>Drag mouse to orbit camera</span>
        </div>

        {/* ── COMPACT IN-GAME GLASSMORPHISM DIALOGUE & INTERROGATION HUD ── */}
        <div className="absolute bottom-3 inset-x-0 z-30 px-3 md:px-6 flex justify-center pointer-events-none">
          <div className="w-full max-w-3xl bg-slate-950/65 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] p-3 md:p-3.5 pointer-events-auto space-y-2 ring-1 ring-white/10 relative overflow-hidden">
            
            {/* Top Glowing Neon Accent Line */}
            <div 
              className="absolute top-0 left-0 right-0 h-[2px] transition-all"
              style={{ 
                backgroundColor: lastDialogueSpeaker === 'detective' ? '#f59e0b' : '#ef4444',
                boxShadow: `0 0 12px ${lastDialogueSpeaker === 'detective' ? '#f59e0b' : '#ef4444'}` 
              }}
            />

            {/* Top Speaker Row & Dynamic Tension Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {lastDialogueSpeaker === 'detective' ? '🐼' : '⛓️'}
                </span>
                <span className={`text-xs font-black font-mono uppercase tracking-wider drop-shadow-md ${
                  lastDialogueSpeaker === 'detective' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {lastDialogueSpeaker === 'detective' ? 'DETECTIVE PANDA' : activeSuspect.name}
                </span>
                <span className="text-[10px] font-mono text-slate-300 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 hidden sm:inline">
                  {lastDialogueSpeaker === 'detective' ? 'Investigator' : activeSuspect.role}
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Phase {currentStageIndex + 1}/4
                </span>
              </div>

              {/* Dynamic Tension Meter */}
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/10">
                <Flame className={`w-3.5 h-3.5 ${currentPanic >= 70 ? 'text-red-500 animate-bounce' : 'text-amber-400'}`} />
                <span className="text-[10px] font-mono text-slate-300">Tension:</span>
                <span className={`text-xs font-mono font-bold ${
                  currentPanic >= 75 
                    ? 'text-red-400 animate-pulse font-black' 
                    : currentPanic >= 50 
                    ? 'text-orange-400' 
                    : 'text-emerald-400'
                }`}>
                  {currentPanic}%
                </span>
                {currentPanic >= 75 ? (
                  <span className="text-[9px] font-mono font-bold text-red-300 bg-red-950 px-1 rounded animate-pulse border border-red-500/40">
                    BREAKING DOWN!
                  </span>
                ) : currentPanic <= 25 ? (
                  <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/60 px-1 rounded border border-emerald-500/30">
                    COMPOSED
                  </span>
                ) : null}
              </div>
            </div>

            {/* Subtitle Dialogue Text (Compact, clean font) */}
            <div className="text-white text-xs sm:text-sm font-medium leading-snug min-h-[34px] px-1 font-sans drop-shadow-sm">
              {isLoading ? (
                <span className="text-slate-300 italic flex items-center gap-2 font-mono text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                  {activeSuspect.name} is cracking under pressure...
                </span>
              ) : (
                <span>
                  "{displayedText}"
                  {isTyping && <span className="inline-block w-1.5 h-3.5 ml-1 bg-amber-400 animate-pulse" />}
                </span>
              )}
            </div>

            {/* Mode Switch Pills (Dialogue Options vs Confront Clues) */}
            <div className="pt-1.5 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setDialogueMenuMode('questions')}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                    dialogueMenuMode === 'questions'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white bg-white/10 backdrop-blur-md border border-white/10'
                  }`}
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Cross-Examine (Phase {currentStageIndex + 1})</span>
                </button>

                <button
                  onClick={() => setDialogueMenuMode('evidence')}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center gap-1 ${
                    dialogueMenuMode === 'evidence'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white bg-white/10 backdrop-blur-md border border-white/10'
                  }`}
                >
                  <Briefcase className="w-3 h-3" />
                  <span>Slam Clues ({discoveredClues.length})</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-amber-400/90 hidden sm:inline">
                ⚡ Answers unlock new confrontation angles
              </span>
            </div>

            {/* Direct Dynamic Detective Question Choices (Upgrades automatically after every answer!) */}
            {dialogueMenuMode === 'questions' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                {currentQuestions.map((q, idx) => (
                  <button
                    key={`${currentStageIndex}-${idx}`}
                    onClick={() => handleSendDialogue(q)}
                    disabled={isLoading}
                    className="text-left p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/80 text-[11px] text-slate-200 hover:text-amber-300 transition-all active:scale-98 disabled:opacity-40 leading-snug group flex flex-col justify-between backdrop-blur-md"
                  >
                    <span className="text-[9px] font-mono text-amber-400 font-bold block mb-0.5">
                      OPTION {idx + 1} ➔
                    </span>
                    <span className="line-clamp-2">"{q}"</span>
                  </button>
                ))}
              </div>
            )}

            {/* Physical Clues to Slam on Table */}
            {dialogueMenuMode === 'evidence' && (
              <div>
                {discoveredClues.length === 0 ? (
                  <div className="p-2 text-center text-[11px] font-mono text-slate-400 bg-white/5 rounded-xl border border-white/10">
                    No clues collected yet. Search the Penthouse Suite first.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {discoveredClues.map(c => (
                      <button
                        key={c.id}
                        onClick={() => handleConfrontClue(c)}
                        disabled={isLoading}
                        className="p-2 rounded-xl bg-white/5 hover:bg-red-500/25 border border-white/10 hover:border-red-400 text-left transition-all active:scale-95 disabled:opacity-40 group backdrop-blur-md"
                      >
                        <div className="font-bold text-[11px] text-slate-200 group-hover:text-red-300 truncate">
                          {c.title}
                        </div>
                        <div className="text-[9px] text-red-400 font-mono font-bold uppercase mt-0.5">
                          CONFRONT ➔
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};