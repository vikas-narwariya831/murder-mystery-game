export interface SafePuzzle {
  code: string;
  year: number;
  multiplier: number;
  offset: number;
  formulaStr: string;
}

export interface ClueItem {
  id: string;
  title: string;
  description: string;
  discovered: boolean;
  type: 'document' | 'chemical' | 'digital' | 'code';
  secretDetail: string;
  iconName: string;
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  isGuilty: boolean;
  alibi: string;
  systemPrompt: string;
  messages: Array<{
    role: 'user' | 'model';
    text: string;
  }>;
}

export interface GameState {
  currentLevel: 1 | 2 | 3; // 1: Penthouse Suite, 2: Server Vault, 3: Interrogation Cell
  isDoorUnlocked: boolean;
  isSafeOpened: boolean;
  gameStatus: 'intro' | 'investigating' | 'accusing' | 'won' | 'lost';
  discoveredClues: string[]; // Clue IDs
  safeCode: string;
  safePuzzle: SafePuzzle;
  safeAttemptsLeft: number;
  timeRemainingSeconds: number;
}
