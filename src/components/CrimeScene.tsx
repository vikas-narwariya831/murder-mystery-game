import React, { useState } from 'react';
import type { ClueItem, SafePuzzle } from '../types/game';
import { InteractiveForensicModal } from './InteractiveForensicModal';
import { VictimBodyModal } from './VictimBodyModal';
import { CrimeRoomCanvas } from './CrimeRoomCanvas';

interface SceneProps {
  clues: ClueItem[];
  onDiscoverClue: (clueId: string) => void;
  isSafeOpened: boolean;
  onOpenSafeModal: () => void;
  onOpenExitDoorModal?: () => void;
  onGoToInterrogation: () => void;
  safePuzzle?: SafePuzzle;
  isBriefingActive?: boolean;
}

export const CrimeScene: React.FC<SceneProps> = ({
  clues, onDiscoverClue, isSafeOpened, onOpenSafeModal, onGoToInterrogation, safePuzzle, isBriefingActive,
}) => {
  const [inspectClue, setInspectClue] = useState<ClueItem | null>(null);
  const [isVictimModalOpen, setIsVictimModalOpen] = useState(false);

  const handleInspect = (clueId: string) => {
    onDiscoverClue(clueId);
    const target = clues.find(c => c.id === clueId);
    if (target) setInspectClue({ ...target, discovered: true });
  };

  return (
    <div className="w-full h-full">
      {/* 3D Immersive Crime Scene Canvas (Interactive In-Game Objects) */}
      <CrimeRoomCanvas
        clues={clues}
        onInspectClue={handleInspect}
        isSafeOpened={isSafeOpened}
        onOpenSafe={onOpenSafeModal}
        onInspectBody={() => setIsVictimModalOpen(true)}
        onGoToInterrogation={onGoToInterrogation}
        isBriefingActive={isBriefingActive}
      />

      {/* Interactive Forensic Modal */}
      <InteractiveForensicModal
        clue={inspectClue}
        onClose={() => setInspectClue(null)}
        safePuzzle={safePuzzle}
      />

      {/* Victim Autopsy Modal */}
      <VictimBodyModal
        isOpen={isVictimModalOpen}
        onClose={() => setIsVictimModalOpen(false)}
        onGoToInterrogation={onGoToInterrogation}
      />
    </div>
  );
};
