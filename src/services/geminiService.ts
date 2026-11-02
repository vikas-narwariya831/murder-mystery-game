let apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

export const setCustomApiKey = (key: string) => {
  apiKey = key.trim();
};

export const getApiKey = () => apiKey;

export interface CodeRiddle {
  codeSnippet: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

// Fallback pool of high quality critical loop / algorithmic puzzles if offline/no API key/quota exhausted
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

// Fallback model list if free tier limit is hit on one model
const MODEL_CANDIDATES = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-3.8-flash'
];

export async function generateCriticalLoopPuzzle(): Promise<CodeRiddle> {
  const currentKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (currentKey) {
    for (const model of MODEL_CANDIDATES) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentKey}`;

        const prompt = `You are a cybersecurity puzzle generator for an interactive detective murder mystery game.
Generate ONE critical, tricky JavaScript / Python loop code trace puzzle.
The puzzle must contain:
1. A short clean code snippet (4-7 lines) with loops (for, while, nested or accumulator loop) that requires careful mental tracing.
2. A clear critical question about its execution output.
3. Exactly 4 multiple-choice options.
4. The correct 0-indexed option index (0, 1, 2, or 3).
5. A short 1-line forensic explanation.

Output ONLY valid JSON strictly matching this schema, without markdown formatting or code fences:
{
  "codeSnippet": "let x = 0;...",
  "question": "What is the final value...",
  "options": ["A", "B", "C", "D"],
  "correctOptionIndex": 1,
  "explanation": "..."
}`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              responseMimeType: "application/json"
            }
          })
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawJson) {
            const parsed = JSON.parse(rawJson.trim());
            if (parsed && parsed.codeSnippet && Array.isArray(parsed.options) && parsed.options.length === 4) {
              return parsed as CodeRiddle;
            }
          }
        } else if (res.status === 429) {
          // Quota exhausted on this model, immediately try next candidate model
          continue;
        }
      } catch {
        continue;
      }
    }
  }

  // Graceful Fallback if quota is exceeded or offline: returns instantly with rich varied loop riddles!
  const randomIndex = Math.floor(Math.random() * FALLBACK_RIDDLES.length);
  return FALLBACK_RIDDLES[randomIndex];
}

// Intelligent scripted responses as instant fallback if API hangs or network fails
function getSmartFallbackReply(suspectPrompt: string, userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (suspectPrompt.includes('Evelyn Cross')) {
    if (msg.includes('cyanide') || msg.includes('poison') || msg.includes('mug')) {
      return "Cyanide? Don't be absurd, Detective! Vincent drank espresso constantly. Anyone could have touched that mug before I arrived. You have no proof tying me to it!";
    }
    if (msg.includes('silk') || msg.includes('glove')) {
      return "I wear Italian silk couture gloves daily—half the executives on the 40th floor do! Vincent probably bumped into me earlier during our strategy meeting. That proves nothing.";
    }
    if (msg.includes('patent') || msg.includes('email') || msg.includes('liquidat')) {
      return "(Eyes narrow coldly) Vincent's quantum patents were bleeding money. Even if I explored offshore partnerships, business disputes are not murder! Watch your accusations carefully.";
    }
    if (msg.includes('pantry') || msg.includes('11:42') || msg.includes('where were you')) {
      return "I told you: I was in the 4th-floor boardroom reviewing acquisitions until midnight. If sensor logs show my badge near the pantry, Marcus Vance could have easily forged my credential!";
    }
    return "I am mourning our CEO, Detective, not answering baseless theories. If you have actual forensics, present them. Otherwise, let me speak with legal counsel.";
  }

  if (suspectPrompt.includes('Marcus Vance')) {
    if (msg.includes('cyanide') || msg.includes('poison')) {
      return "Cyanide?! Oh god... Vincent always kept that espresso cup on his left desk riser! I didn't touch it, I swear! Check Evelyn's bag—she had a tiny glass dropper earlier!";
    }
    if (msg.includes('fight') || msg.includes('argue') || msg.includes('9:00')) {
      return "Yes, we screamed at each other at 9 PM about server budgets! But he's my brother—I wouldn't kill him! The server logs in Room B prove I was rebooting nodes between 11:15 and 12:30 AM!";
    }
    if (msg.includes('patent') || msg.includes('email')) {
      return "Vincent told me yesterday he caught Evelyn transferring quantum hashes to an offshore Cayman entity! That draft on his terminal was his final warning to her!";
    }
    return "Look at the telemetry, Detective! I'm neurotic, not a murderer. Evelyn is the one who had everything to lose if Vincent exposed her offshore liquidation!";
  }

  // A.R.I.A. (AI Facility)
  if (msg.includes('safe') || msg.includes('code') || msg.includes('formula')) {
    return "[A.R.I.A. TELEMETRY]: Safe combination algorithm located in Vincent Vance's lab notebook: (1998 * 4) - 500 = 7492. Code 7492 verified for emergency keycard extraction.";
  }
  if (msg.includes('pantry') || msg.includes('timeline')) {
    return "[A.R.I.A. SENSOR LOG]: At 11:38 PM: Terminal intrusion logged. At 11:42 PM: Pantry door opened with Evelyn Cross keycard. At 11:45 PM: CEO vital pulse flatline.";
  }
  return "[A.R.I.A. ONLINE]: Executive lockdown active. Sensor data indicates toxic asphyxiation in suite 404. What timestamp query do you require?";
}

export async function askSuspectAI(
  systemPrompt: string,
  history: Array<{ role: 'user' | 'model'; text: string }>,
  userMessage: string
): Promise<string> {
  const currentKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (currentKey) {
    for (const model of MODEL_CANDIDATES) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentKey}`;

        const contents = [
          ...history.slice(-4).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          })),
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ];

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            }
          })
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim()) {
            return text.trim();
          }
        } else if (res.status === 429) {
          // Quota exhausted on this model, try next candidate model
          continue;
        }
      } catch {
        continue;
      }
    }
  }

  // Instant Smart Scripted Fallback Response (Never crashes when quota is exhausted!)
  await new Promise(resolve => setTimeout(resolve, 350));
  return getSmartFallbackReply(systemPrompt, userMessage);
}
