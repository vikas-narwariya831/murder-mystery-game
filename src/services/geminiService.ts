// Backward-compatibility re-exporting from gameService (now backed by backend axios)
export {
  generateCriticalLoopPuzzle,
  askSuspectAI,
  checkBackendHealth,
  setCustomApiKey,
  getApiKey,
  type CodeRiddle
} from './gameService';
