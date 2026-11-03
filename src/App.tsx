import React, { useState, useEffect } from 'react';
import { 
  getInitialClues, 
  generateRandomSafePuzzle, 
  INITIAL_SAFE_PUZZLE, 
  INITIAL_SUSPECTS 
} from './data/gameData';
import type { ClueItem, Suspect, GameState, SafePuzzle } from './types/game';
import { CrimeScene } from './components/CrimeScene';
import { PrisonInterrogationRoom } from './components/PrisonInterrogationRoom';
import { SafeKeypadModal } from './components/SafeKeypadModal';
import { AccusationExitModal } from './components/AccusationExitModal';
import { PortfolioModal } from './components/PortfolioModal';
import { CaseBriefingModal } from './components/CaseBriefingModal';
import { WaterOrbLoader } from './components/WaterOrbLoader';
import {
  Search, MessageSquare, Key, RotateCcw,
  ShieldAlert, FileText, Sparkles, Trophy, Skull
} from 'lucide-react';

export const App: React.FC = () => {
  // Global 3D & Audio Asset Preloading State (Water Circle Fill)
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [currentPreloadItem, setCurrentPreloadItem] = useState('Initializing Memory...');

  const [currentPuzzle, setCurrentPuzzle] = useState<SafePuzzle>(INITIAL_SAFE_PUZZLE);
  const [activeTab, setActiveTab] = useState<'scene' | 'interrogation'>('scene');
  const [clues, setClues] = useState<ClueItem[]>(() => getInitialClues(INITIAL_SAFE_PUZZLE));
  const [suspects] = useState<Suspect[]>(INITIAL_SUSPECTS);
  const [isSafeModalOpen, setIsSafeModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(true);
  const [endgameReason, setEndgameReason] = useState('');
  const [gameState, setGameState] = useState<GameState>({
    isDoorUnlocked: false,
    isSafeOpened: false,
    gameStatus: 'investigating',
    discoveredClues: [],
    safeCode: INITIAL_SAFE_PUZZLE.code,
    safePuzzle: INITIAL_SAFE_PUZZLE,
    safeAttemptsLeft: 5,
    timeRemainingSeconds: 1200,
  });

  // Preload all heavy 3D assets, textures, and audio files at App startup
  useEffect(() => {
    const assetsToLoad = [
      { name: 'Panda Detective 3D Mesh (FBX)', url: '/Panda_Character.fbx', weight: 40 },
      { name: 'Panda Detective Texture (4K)', url: '/Panda01_Holotna_Game_Studio_Texture.jpg', weight: 20 },
      { name: 'Executive Gaming Chair (OBJ)', url: '/Cadeira.obj', weight: 20 },
      { name: 'Forensic Dialogue Audio Track', url: '/nana_dialogue.mp3', weight: 10 },
      { name: 'Suspect Caricature Portrait', url: '/nana_cartoon.jpg', weight: 10 },
    ];

    let currentSum = 0;

    const loadAll = async () => {
      for (const asset of assetsToLoad) {
        setCurrentPreloadItem(`Loading ${asset.name}...`);
        try {
          await fetch(asset.url, { cache: 'force-cache' });
        } catch {
          // If fetch fails, keep progressing gracefully
        }
        currentSum += asset.weight;
        setPreloadProgress(Math.min(100, currentSum));
        // Small stagger for smooth organic wave motion
        await new Promise(r => setTimeout(r, 220));
      }

      setCurrentPreloadItem('Compiling WebGL Shaders...');
      setPreloadProgress(100);
      
      // Reveal the App smoothly
      setTimeout(() => {
        setIsAppLoaded(true);
      }, 650);
    };

    loadAll();
  }, []);

  const discoveredCount = clues.filter(c => c.discovered).length;
  const totalClues = clues.length;

  const handleDiscoverClue = (clueId: string) => {
    setClues(prev => prev.map(c => c.id === clueId ? { ...c, discovered: true } : c));
    if (!gameState.discoveredClues.includes(clueId)) {
      setGameState(prev => ({ ...prev, discoveredClues: [...prev.discoveredClues, clueId] }));
    }
  };

  const handleSafeUnlock = () => {
    setGameState(prev => ({ ...prev, isSafeOpened: true }));
    setClues(prev => prev.map(c => c.id === 'keycard-override' ? { ...c, discovered: true } : c));
  };

  const handleGameWin = () => {
    setIsExitModalOpen(false);
    setGameState(prev => ({ ...prev, gameStatus: 'won' }));
    setEndgameReason('You successfully cornered Evelyn Cross with incontrovertible forensic proof! The emergency blast doors unsealed — case closed.');
  };

  const handleGameLose = (reason: string) => {
    setIsExitModalOpen(false);
    setGameState(prev => ({ ...prev, gameStatus: 'lost' }));
    setEndgameReason(reason);
  };

  const handleRestart = () => {
    const newPuzzle = generateRandomSafePuzzle();
    setCurrentPuzzle(newPuzzle);
    setClues(getInitialClues(newPuzzle));
    setGameState({
      isDoorUnlocked: false, 
      isSafeOpened: false,
      gameStatus: 'investigating', 
      discoveredClues: [],
      safeCode: newPuzzle.code, 
      safePuzzle: newPuzzle,
      safeAttemptsLeft: 5, 
      timeRemainingSeconds: 1200,
    });
    setActiveTab('scene');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* ── 3D CIRCULAR WATER FILL PRELOADER ────────────────── */}
      {!isAppLoaded && (
        <WaterOrbLoader 
          progress={preloadProgress} 
          item={currentPreloadItem} 
        />
      )}

      {/* ── CLEAN MINIMAL UNIFIED NAVBAR (NO CLUTTER) ───────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs border border-slate-700">
                <ShieldAlert className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-sm sm:text-base leading-tight tracking-tight">
                  The Midnight Protocol
                </h1>
              </div>
            </div>

            {/* Center: Clean Segmented Tab Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveTab('scene')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'scene'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-sky-500" />
                <span>3D Penthouse</span>
              </button>

              <button
                onClick={() => setActiveTab('interrogation')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'interrogation'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                <span>3D Interrogation</span>
              </button>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Case Briefing Button */}
              <button
                onClick={() => setIsBriefingModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Case Brief</span>
              </button>

              {/* Safe Status Button - Only shows code if torn-note clue is discovered! */}
              <button
                onClick={() => setIsSafeModalOpen(true)}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  gameState.isSafeOpened
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>
                  {gameState.isSafeOpened 
                    ? 'Safe Unlocked' 
                    : clues.find(c => c.id === 'torn-note')?.discovered 
                      ? `Safe [${gameState.safeCode}]` 
                      : 'Wall Safe [Locked]'
                  }
                </span>
              </button>

              {/* Clues Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700">
                <span className="text-sky-600">{discoveredCount}</span>
                <span className="text-slate-400">/</span>
                <span>{totalClues}</span>
                <span className="hidden sm:inline text-slate-500 font-sans font-medium text-[11px]">Clues</span>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleRestart}
                className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 border border-slate-200 transition-all"
                title="Restart Game"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT (IMMERSIVE FULLSCREEN 3D VIEWPORT) ── */}
      <main className="flex-1 w-full relative overflow-hidden" style={{ height: 'calc(100vh - 64px - 41px)' }}>

        {/* WIN SCREEN */}
        {gameState.gameStatus === 'won' && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white border border-emerald-200 rounded-2xl p-10 text-center shadow-xl">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                <Trophy className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Case Solved! 🎉</h2>
              <p className="text-slate-600 leading-relaxed mb-8">{endgameReason}</p>
              <div className="flex justify-center gap-3">
                <button onClick={handleRestart}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm">
                  Play Again
                </button>
                <button onClick={() => setIsPortfolioModalOpen(true)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all">
                  View Project Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOSE SCREEN */}
        {gameState.gameStatus === 'lost' && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white border border-red-200 rounded-2xl p-10 text-center shadow-xl">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
                <Skull className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Investigation Failed</h2>
              <p className="text-slate-600 leading-relaxed mb-8">{endgameReason}</p>
              <button onClick={handleRestart}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-all">
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* GAME ACTIVE */}
        {gameState.gameStatus === 'investigating' && (
          <div>
            {activeTab === 'scene' ? (
              <CrimeScene
                clues={clues}
                onDiscoverClue={handleDiscoverClue}
                isSafeOpened={gameState.isSafeOpened}
                onOpenSafeModal={() => setIsSafeModalOpen(true)}
                onOpenExitDoorModal={() => setIsExitModalOpen(true)}
                onGoToInterrogation={() => setActiveTab('interrogation')}
                safePuzzle={currentPuzzle}
                isBriefingActive={isBriefingModalOpen}
              />
            ) : (
              <PrisonInterrogationRoom
                suspects={suspects}
                clues={clues}
                onAccuseSuspect={() => setIsExitModalOpen(true)}
                onBackToScene={() => setActiveTab('scene')}
              />
            )}
          </div>
        )}
      </main>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-3 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Interactive 3D Murder Mystery & Escape Room</span>
          </span>
          <button 
            onClick={() => setIsPortfolioModalOpen(true)}
            className="hover:text-slate-600 transition-colors underline font-medium"
          >
            About & Architecture
          </button>
        </div>
      </footer>

      {/* ── ONBOARDING & INTERACTION MODALS ────────────────── */}
      <CaseBriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
      />

      <SafeKeypadModal
        isOpen={isSafeModalOpen}
        onClose={() => setIsSafeModalOpen(false)}
        correctCode={gameState.safeCode}
        safePuzzle={currentPuzzle}
        isAlreadyOpened={gameState.isSafeOpened}
        onSuccessUnlock={handleSafeUnlock}
        isNoteFound={clues.find(c => c.id === 'torn-note')?.discovered}
      />

      <AccusationExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        suspects={suspects}
        clues={clues}
        isSafeOpened={gameState.isSafeOpened}
        onGameWin={handleGameWin}
        onGameLose={handleGameLose}
      />

      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
      />
    </div>
  );
};

export default App;
