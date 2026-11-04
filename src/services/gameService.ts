import apiClient from '../utils/apiClient';

export interface CodeRiddle {
  codeSnippet: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

// Built-in fallback riddles if backend is temporarily starting or offline
const FALLBACK_RIDDLES: CodeRiddle[] = [
  {
    codeSnippet: `let total = 0;\nfor (let i = 1; i <= 4; i++) {\n  total += (i * 2);\n}\nconsole.log(total);`,
    question: "Analyze this loop execution. What is the final value printed by console.log?",
    options: ["18", "20", "24", "16"],
    correctOptionIndex: 1,
    explanation: "Iteration i=1: 2 | i=2: 4 (sum=6) | i=3: 6 (sum=12) | i=4: 8 (sum=20). Total is 20."
  },
  {
    codeSnippet: `let count = 100;\nwhile (count > 20) {\n  count -= 25;\n}\nconsole.log(count);`,
    question: "Trace the while loop iteration carefully. What does count terminate at?",
    options: ["0", "20", "25", "15"],
    correctOptionIndex: 0,
    explanation: "100 -> 75 -> 50 -> 25 -> 0. When count reaches 0, 0 > 20 is false, loop exits."
  },
  {
    codeSnippet: `let x = 1;\nfor (let step = 0; step < 4; step++) {\n  if (step % 2 === 0) x *= 2;\n  else x += 3;\n}\nconsole.log(x);`,
    question: "Trace step 0 to 3. What is the final value of x?",
    options: ["13", "10", "15", "8"],
    correctOptionIndex: 0,
    explanation: "step 0 (even): 1*2=2 | step 1 (odd): 2+3=5 | step 2 (even): 5*2=10 | step 3 (odd): 10+3=13."
  },
  {
    codeSnippet: `let buffer = [];\nfor (let i = 3; i >= 0; i--) {\n  buffer.push(i * 3);\n}\nconsole.log(buffer[1] + buffer[3]);`,
    question: "What is the evaluated output of buffer[1] + buffer[3]?",
    options: ["6", "9", "12", "15"],
    correctOptionIndex: 0,
    explanation: "buffer is [9, 6, 3, 0]. buffer[1] is 6, buffer[3] is 0. 6 + 0 = 6."
  },
  {
    codeSnippet: `let sum = 0;\nfor (let k = 10; k > 0; k -= 3) {\n  sum += k;\n}\nconsole.log(sum);`,
    question: "What is the final value of sum after the loop finishes?",
    options: ["22", "18", "25", "15"],
    correctOptionIndex: 0,
    explanation: "Iterations: k=10 (sum=10), k=7 (sum=17), k=4 (sum=21), k=1 (sum=22). Next k=-2 breaks loop. Total is 22."
  },
  {
    codeSnippet: `let acc = 2;\nfor (let i = 0; i < 3; i++) {\n  acc = (acc * 2) - 1;\n}\nconsole.log(acc);`,
    question: "Carefully trace accumulator acc through 3 iterations. What is logged?",
    options: ["9", "7", "11", "5"],
    correctOptionIndex: 0,
    explanation: "Start=2. i=0: 2*2-1 = 3. i=1: 3*2-1 = 5. i=2: 5*2-1 = 9."
  }
];

let customApiKey = '';
export const setCustomApiKey = (key: string) => {
  customApiKey = key.trim();
};
export const getApiKey = () => customApiKey;

/**
 * Fetch dynamic AI critical-loop puzzle from backend
 */
export async function generateCriticalLoopPuzzle(): Promise<CodeRiddle> {
  try {
    const response = await apiClient.get<{ success: boolean; puzzle: CodeRiddle }>('/puzzle/critical-loop');
    if (response.data?.puzzle?.codeSnippet && Array.isArray(response.data?.puzzle?.options)) {
      return response.data.puzzle;
    }
  } catch (err) {
    console.warn('[GameService] Backend puzzle request failed, using cached fallback pool:', err);
  }

  const randomIndex = Math.floor(Math.random() * FALLBACK_RIDDLES.length);
  return FALLBACK_RIDDLES[randomIndex];
}

/**
 * Verify Wall Safe PIN Passcode on the backend
 */
export async function verifySafePasscodeOnBackend(
  pin: string,
  fallbackCode?: string,
  sessionId?: string
): Promise<{ success: boolean; unlocked: boolean; message: string }> {
  try {
    const response = await apiClient.post<{ success: boolean; unlocked: boolean; message: string }>('/puzzle/safe/verify', {
      pin,
      fallbackCode,
      sessionId
    });
    return response.data;
  } catch (err: any) {
    if (err.response?.data) {
      return err.response.data;
    }
    // Client fallback check if backend unreachable
    const isMatched = Boolean(fallbackCode && fallbackCode.trim() === pin.trim());
    return {
      success: isMatched,
      unlocked: isMatched,
      message: isMatched ? 'ACCESS GRANTED (Offline mode)' : 'ACCESS DENIED: INCORRECT COMBINATION'
    };
  }
}

/**
 * Interrogate suspect through backend AI proxy
 */
export async function askSuspectAI(
  suspectOrPrompt: string,
  messagesOrQuestion: any,
  userQuestionOrClues?: any,
  evidenceNotes?: string[]
): Promise<string> {
  let suspectId = 'marcus';
  let question = '';
  let unlockedClues: string[] = [];
  let notes: string[] = evidenceNotes || [];

  if (Array.isArray(messagesOrQuestion)) {
    const promptLower = suspectOrPrompt.toLowerCase();
    if (promptLower.includes('evelyn')) suspectId = 'evelyn';
    else if (promptLower.includes('aria') || promptLower.includes('a.r.i.a')) suspectId = 'aria';
    else suspectId = 'marcus';

    question = typeof userQuestionOrClues === 'string' ? userQuestionOrClues : '';
  } else {
    suspectId = suspectOrPrompt;
    question = typeof messagesOrQuestion === 'string' ? messagesOrQuestion : '';
    if (Array.isArray(userQuestionOrClues)) {
      unlockedClues = userQuestionOrClues;
    }
  }

  try {
    const response = await apiClient.post<{ success: boolean; reply: string }>('/interrogation/ask', {
      suspectId,
      userQuestion: question,
      unlockedClues,
      evidenceNotes: notes
    });

    if (response.data?.reply) {
      return response.data.reply;
    }
  } catch (err) {
    console.warn('[GameService] Backend interrogation request failed, using fallback:', err);
  }

  const fallbackQuotes: Record<string, string> = {
    marcus: "I was reviewing quarterly audit reports in the executive lounge. You're barking up the wrong tree, detective.",
    evelyn: "Vincent called me right before midnight asking for lab emergency protocols. His voice was shaking. That's all I know.",
    aria: "Access logs show thermal anomalies in Vault 04 at 23:42. Primary surveillance footage was purged from an internal terminal."
  };

  return fallbackQuotes[suspectId] || "I have nothing to say without my legal counsel present.";
}

/**
 * Check backend health
 */
export async function checkBackendHealth() {
  try {
    const res = await apiClient.get('/health');
    return res.data;
  } catch {
    return { status: 'offline', aiProxyAvailable: false };
  }
}
