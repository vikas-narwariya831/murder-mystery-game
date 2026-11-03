import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useProgress } from '@react-three/drei';
import { CrimeRoom3D } from './CrimeRoom3D';
import { Scene3DLoader } from './Scene3DLoader';
import type { ClueItem } from '../types/game';
import { 
  Armchair, 
  FastForward
} from 'lucide-react';
import { sounds } from '../services/audioService';

interface SceneCanvasProps {
  clues: ClueItem[];
  onInspectClue: (clueId: string) => void;
  isSafeOpened: boolean;
  onOpenSafe: () => void;
  onInspectBody: () => void;
  onGoToInterrogation: () => void;
  isBriefingActive?: boolean;
}

interface DialogueLine {
  speaker: 'PANDA' | 'MAYA';
  title: string;
  avatar: string;
  role: string;
  color: string;
  text: string;
}

const OPENING_CUTSCENE_DIALOGUES: DialogueLine[] = [
  {
    speaker: 'MAYA',
    title: 'AGENT MAYA',
    role: 'Lead Forensic Specialist',
    avatar: '👮‍♀️',
    color: '#0284c7',
    text: "Detective Panda, thank God you made it. Vincent Vance's vitals flatlined at 11:45 PM. The penthouse security protocol locked down immediately.",
  },
  {
    speaker: 'PANDA',
    title: 'DETECTIVE PANDA',
    role: 'Chief Cyber Investigator',
    avatar: '🐼',
    color: '#d97706',
    text: "Any sign of forced entry, Maya? Or was this executed by someone with inside clearance?",
  },
  {
    speaker: 'MAYA',
    title: 'AGENT MAYA',
    role: 'Lead Forensic Specialist',
    avatar: '👮‍♀️',
    color: '#0284c7',
    text: "Look at his espresso mug—the spectral scan confirms Potassium Cyanide. And his executive workstation terminal was wiped at 11:38 PM.",
  },
  {
    speaker: 'PANDA',
    title: 'DETECTIVE PANDA',
    role: 'Chief Cyber Investigator',
    avatar: '🐼',
    color: '#d97706',
    text: "Torn lab note on the desk has mathematical equations. I'll crack the wall safe and retrieve the Master Keycard. Keep that perimeter secure!",
  },
];

// 3D Scene Loading Tracker Component
function AssetLoadingWatcher({ onLoaded }: { onLoaded: () => void }) {
  const { progress, active } = useProgress();

  useEffect(() => {
    if (!active && progress >= 100) {
      const timer = setTimeout(() => {
        onLoaded();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, active, onLoaded]);

  return null;
}

export const CrimeRoomCanvas: React.FC<SceneCanvasProps> = ({
  clues, onInspectClue, isSafeOpened, onOpenSafe, onInspectBody, onGoToInterrogation, isBriefingActive = false,
}) => {
  const discoveredClues = clues.filter(c => c.discovered).map(c => c.id);

  const [detectiveTargetPos, setDetectiveTargetPos] = useState<[number, number, number]>([-1.8, 0, 0.4]);
  const [isDetectiveSitting, setIsDetectiveSitting] = useState(false);
  const [hoveredPrompt, setHoveredPrompt] = useState<string | null>(null);

  // Asset ready gate: do NOT start cutscene or speech until 3D room is 100% loaded!
  const [isSceneReady, setIsSceneReady] = useState(false);
  const { progress } = useProgress();

  // Cinematic opening sequence state
  const [isCutsceneActive, setIsCutsceneActive] = useState(true);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  // Auto-advance cinematic dialogue with Character Voice Audio ONLY when 3D scene is ready AND briefing modal is closed!
  useEffect(() => {
    if (!isCutsceneActive || !isSceneReady || isBriefingActive) return;

    const line = OPENING_CUTSCENE_DIALOGUES[dialogueIndex];
    if (line) {
      sounds.speakDialogue(line.text, line.speaker === 'PANDA' ? 'panda' : 'maya');
    }

    const timer = setTimeout(() => {
      if (dialogueIndex < OPENING_CUTSCENE_DIALOGUES.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        setIsCutsceneActive(false);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [isCutsceneActive, isSceneReady, isBriefingActive, dialogueIndex]);

  const handleNextDialogue = () => {
    sounds.stopSpeech();
    if (dialogueIndex < OPENING_CUTSCENE_DIALOGUES.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      setIsCutsceneActive(false);
    }
  };

  const handleSkipCutscene = () => {
    sounds.stopSpeech();
    sounds.playBeep(400, 'sine', 0.05);
    setIsCutsceneActive(false);
  };

  const currentDialogue = OPENING_CUTSCENE_DIALOGUES[dialogueIndex];

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas Box - Default Immersive Fullscreen Viewport */}
      <div className="absolute inset-0 bg-slate-950 overflow-hidden">

        {/* Top Floating Cyberpunk Status Pill during 3D loading */}
        {!isSceneReady && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="bg-slate-900/90 border border-sky-500/40 shadow-[0_0_25px_rgba(56,189,248,0.25)] backdrop-blur-xl px-5 py-2.5 rounded-2xl flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Penthouse Forensic Stream • {Math.round(progress)}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Loading 3D Models & Audio Sync
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Subtle Floating Controls (Top Right: Sit/Stand) */}
        {!isCutsceneActive && isSceneReady && (
          <div className="absolute top-4 right-4 z-20 pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => setIsDetectiveSitting(!isDetectiveSitting)}
              className="bg-white/90 hover:bg-white backdrop-blur-md shadow-md px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Armchair className="w-3.5 h-3.5 text-amber-500" />
              <span>{isDetectiveSitting ? 'Stand Up' : 'Sit at Desk'}</span>
            </button>
          </div>
        )}

        {/* 3D Realtime WebGL Viewport */}
        <div className="w-full h-full">
          <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
            <color attach="background" args={[isSceneReady ? '#f8fafc' : '#030712']} />
            {isSceneReady && <fog attach="fog" args={['#f8fafc', 22, 45]} />}
            <PerspectiveCamera 
              makeDefault 
              position={!isSceneReady ? [0, 2, 6] : isCutsceneActive ? [-1.2, 3.8, 5.5] : [3, 7, 9]} 
              fov={45} 
              near={0.1} 
              far={100} 
            />
            <OrbitControls
              enablePan={false}
              enableZoom={!isCutsceneActive && isSceneReady}
              enableRotate={!isCutsceneActive && isSceneReady}
              minDistance={4}
              maxDistance={14}
              maxPolarAngle={Math.PI / 2.15}
              minPolarAngle={Math.PI / 6}
              minAzimuthAngle={-Math.PI * 0.45}
              maxAzimuthAngle={Math.PI * 0.45}
              target={!isSceneReady ? [0, 1.8, 0] : isCutsceneActive ? [-1.8, 1.2, 0] : isDetectiveSitting ? [2.2, 1.8, 0] : [0.5, 1.5, 0]}
              rotateSpeed={0.5}
            />
            
            <Suspense fallback={<Scene3DLoader progress={progress} label="Penthouse Suite 404" />}>
              <AssetLoadingWatcher onLoaded={() => setIsSceneReady(true)} />
              <CrimeRoom3D
                onInspectClue={onInspectClue}
                onOpenSafe={onOpenSafe}
                onGoToInterrogation={onGoToInterrogation}
                onInspectBody={onInspectBody}
                isSafeOpened={isSafeOpened}
                discoveredClues={discoveredClues}
                detectiveTargetPos={detectiveTargetPos}
                onMoveDetective={isCutsceneActive ? () => {} : setDetectiveTargetPos}
                isDetectiveSitting={isDetectiveSitting}
                onToggleSit={setIsDetectiveSitting}
                onHoverTarget={isCutsceneActive ? () => {} : setHoveredPrompt}
              />
            </Suspense>
          </Canvas>

          {/* 🎬 AAA CINEMATIC DIALOGUE OVERLAY (When Cutscene is Active AND 3D Scene is Ready!) */}
          {isCutsceneActive && isSceneReady ? (
            <div className="absolute inset-0 pointer-events-auto flex flex-col justify-between z-30 select-none animate-fade-in">
              {/* Top Letterbox Bar with Cinematic Badge & Skip */}
              <div className="h-14 bg-gradient-to-b from-black via-black/80 to-transparent flex items-center justify-between px-6 text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
                  <span className="font-mono text-xs font-bold tracking-widest text-slate-300 uppercase">
                    REC • CRIME SCENE BRIEFING [P1 & P2]
                  </span>
                </div>
                <button
                  onClick={handleSkipCutscene}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold font-mono tracking-wider transition-all active:scale-95"
                >
                  <FastForward className="w-3.5 h-3.5 text-amber-400" />
                  <span>SKIP SCENE [ESC]</span>
                </button>
              </div>

              {/* Bottom Cinematic Letterbox & Premium Glassmorphism Dialogue Card */}
              <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-6 pb-4 px-4 md:px-12 flex justify-center">
                <div 
                  onClick={handleNextDialogue}
                  className="w-full max-w-2xl bg-slate-950/60 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] cursor-pointer hover:border-white/35 transition-all relative overflow-hidden group ring-1 ring-white/10"
                >
                  {/* Glowing Top Neon Filament Accent */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-[2px] transition-all shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                    style={{ 
                      backgroundColor: currentDialogue.color,
                      boxShadow: `0 0 14px ${currentDialogue.color}` 
                    }}
                  />

                  <div className="flex items-start gap-3.5">
                    {/* Character Speaker Portrait Glass Box */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg border backdrop-blur-xl flex-shrink-0"
                      style={{ 
                        backgroundColor: `${currentDialogue.color}25`,
                        borderColor: `${currentDialogue.color}80` 
                      }}
                    >
                      {currentDialogue.avatar}
                    </div>

                    {/* Dialogue Text Content */}
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-xs font-black tracking-wider uppercase font-mono drop-shadow-md"
                            style={{ color: currentDialogue.color }}
                          >
                            {currentDialogue.title}
                          </span>
                          <span className="text-[10px] text-slate-300 font-mono bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                            {currentDialogue.role}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-400 flex items-center gap-1">
                          Click to continue ➔
                        </span>
                      </div>

                      <p className="text-white text-xs sm:text-sm font-medium leading-relaxed pt-0.5 drop-shadow-sm">
                        "{currentDialogue.text}"
                      </p>
                    </div>
                  </div>

                  {/* Progress Indicators */}
                  <div className="flex items-center justify-center gap-1.5 mt-2.5 pt-1.5 border-t border-white/10">
                    {OPENING_CUTSCENE_DIALOGUES.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i === dialogueIndex
                            ? 'w-6 bg-amber-400'
                            : i < dialogueIndex
                            ? 'w-2 bg-emerald-500'
                            : 'w-2 bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Interactive Floating Hover Prompt (When exploring the scene) */}
          {hoveredPrompt && !isCutsceneActive && isSceneReady && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
              <div className="bg-slate-900/90 text-white text-xs font-medium px-4 py-2 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md flex items-center gap-2">
                <span>{hoveredPrompt}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
