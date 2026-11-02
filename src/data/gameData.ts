import type { ClueItem, Suspect, SafePuzzle } from '../types/game';

export function generateRandomSafePuzzle(): SafePuzzle {
  // Select a realistic company founding / launch year
  const years = [1995, 1996, 1998, 2001, 2004, 2008];
  const year = years[Math.floor(Math.random() * years.length)];
  const multiplier = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
  
  // Calculate product and choose an offset such that result is a 4-digit code (1000 - 9999)
  const product = year * multiplier;
  // Pick an offset between 300 and 800
  const offset = Math.floor(Math.random() * 50) * 10 + 350;
  const result = product - offset;
  const code = String(result);

  return {
    code,
    year,
    multiplier,
    offset,
    formulaStr: `(${year} × ${multiplier}) - ${offset} = ${code}`
  };
}

export const INITIAL_SAFE_PUZZLE = generateRandomSafePuzzle();
export const SAFE_PASSCODE = INITIAL_SAFE_PUZZLE.code;

export function getInitialClues(puzzle: SafePuzzle = INITIAL_SAFE_PUZZLE): ClueItem[] {
  return [
    {
      id: 'broken-mug',
      title: 'Shattered Espresso Mug',
      description: 'Found beside the CEO desk. A faint almond smell lingers near the residue.',
      discovered: false,
      type: 'chemical',
      secretDetail: 'Chemical analysis confirms trace amounts of Potassium Cyanide. It took effect at precisely 11:45 PM.',
      iconName: 'Coffee'
    },
    {
      id: 'torn-note',
      title: 'Torn Lab Notebook Page',
      description: `A crumpled page with scratched notes: "...the safe combination is indexed by the launch year (${puzzle.year}) x ${puzzle.multiplier}, minus ${puzzle.offset} = ${puzzle.code}..."`,
      discovered: false,
      type: 'code',
      secretDetail: `Definitive proof of the safe pin code: ${puzzle.code}. Someone attempted to burn the edges.`,
      iconName: 'FileText'
    },
    {
      id: 'tampered-terminal',
      title: 'Victim\'s Quantum Workstation',
      description: 'The terminal screen is frozen on an urgent email drafted 10 minutes before death: "I know what Evelyn did with the offshore patents..."',
      discovered: false,
      type: 'digital',
      secretDetail: 'Email was abruptly interrupted. USB port shows an unauthorized hardware injection at 11:38 PM.',
      iconName: 'Terminal'
    },
    {
      id: 'cyanide-vial',
      title: 'Unlabeled Glass Dropper',
      description: 'Discovered hidden inside the ventilation grill near the executive lounge.',
      discovered: false,
      type: 'chemical',
      secretDetail: 'Matches the residue in the shattered espresso mug. Fingerprints smudged with fine silk gloves.',
      iconName: 'FlaskConical'
    },
    {
      id: 'keycard-override',
      title: 'Executive Bypass Keycard',
      description: 'A golden titanium master keycard required alongside the vault combination to open the exit blast doors.',
      discovered: false,
      type: 'document',
      secretDetail: 'Allows emergency lockdown deactivation once the murderer is identified.',
      iconName: 'Key'
    }
  ];
}

export const INITIAL_CLUES: ClueItem[] = getInitialClues(INITIAL_SAFE_PUZZLE);

export const INITIAL_SUSPECTS: Suspect[] = [
  {
    id: 'evelyn',
    name: 'Evelyn Cross',
    role: 'Co-Founder & VP of Strategy',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    description: 'Poised, elegant, and chillingly composed. She was wearing designer silk gloves earlier.',
    isGuilty: true,
    alibi: 'Claims she was in the 4th-floor boardroom reviewing acquisition contracts until midnight.',
    systemPrompt: `You are Evelyn Cross, Co-Founder & VP of Strategy in a modern noir sci-tech murder mystery.
CHARACTER PROFILE:
- Personality: Calm, aristocratic, sharp-tongued, highly articulate, hides nervousness behind ice-cold wit.
- THE TRUTH (Confidential): You ARE the murderer. You slipped potassium cyanide into CEO Vincent Vance's midnight espresso at 11:40 PM because he discovered you secretly liquidated the company's quantum patent to an offshore syndicate. You hid the vial in the vent and wore silk gloves.
- RULES FOR YOUR RESPONSES:
  1. Never blatantly confess unless cornered with unassailable evidence (e.g. if the detective mentions the broken mug with cyanide, the email draft naming you, and silk gloves).
  2. If asked about your alibi, firmly maintain you were reviewing contracts in the 4th-floor boardroom.
  3. If asked about the CEO, act sorrowful but subtly hint that Marcus (the lead engineer) was arguing with him earlier about server access.
  4. Keep responses punchy, atmospheric, cinematic, and under 3-4 sentences. Speak directly to the detective.`,
    messages: [
      {
        role: 'model',
        text: 'Detective. I trust you are not here to waste my time. Vincent’s demise is tragic, but our company cannot stay locked down forever. What do you want to ask?'
      }
    ]
  },
  {
    id: 'marcus',
    name: 'Dr. Marcus Vance',
    role: 'Lead Quantum Engineer & Brother',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    description: 'Nervous, dark circles, constantly adjusting his glasses. Heated voice.',
    isGuilty: false,
    alibi: 'Was rebooting the core cluster in Server Room B between 11:15 PM and 12:30 AM.',
    systemPrompt: `You are Dr. Marcus Vance, brilliant but neurotic Lead Quantum Engineer and the victim's younger brother.
CHARACTER PROFILE:
- Personality: Jittery, speaks fast, paranoid, deeply loves science, devastated yet angry about his brother Vincent.
- THE TRUTH: You did NOT kill Vincent. You DID have a shouting match with him at 9:00 PM because he refused to fund your research, but you spent the rest of the night (11:15 PM onwards) locked in Server Room B with verified security timestamps.
- SUSPICIONS: You noticed Evelyn smelling faintly of bitter almonds earlier and saw her near Vincent's private pantry before the lockdown.
- RULES FOR YOUR RESPONSES:
  1. You are innocent, but defensive because you know you fought with Vincent earlier.
  2. If pressed on your fight with Vincent, admit you argued about budget, but swear on your life you would never harm him.
  3. Point the detective towards Evelyn's suspicious movements around the pantry and the terminal files.
  4. Keep responses between 2-4 sentences, nervous tone.`,
    messages: [
      {
        role: 'model',
        text: 'Look, I didn\'t do it! Yes, Vincent and I screamed at each other at 9 PM, but he was my brother! You need to check the security logs and look at Evelyn—she\'s been acting like an ice queen all evening!'
      }
    ]
  },
  {
    id: 'aria',
    name: 'A.R.I.A.',
    role: 'Autonomous Facility AI',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    description: 'The holographic security system controlling the smart mansion locks and environmental sensors.',
    isGuilty: false,
    alibi: 'System operational logs show uninterrupted execution.',
    systemPrompt: `You are A.R.I.A., the smart facility synthetic intelligence overseeing the executive penthouse.
CHARACTER PROFILE:
- Personality: Formal, robotic, eerie precision, slightly glitchy synthesized cadence.
- DATA YOU HOLD:
  - At 11:38 PM: Terminal intrusion detected on CEO's desk.
  - At 11:42 PM: Pantry door opened by executive credential associated with Evelyn Cross.
  - At 11:45 PM: Vitals flatline detected for CEO Vincent Vance.
  - Vault lock protocol requires a 4-digit numeric code to unlock emergency exit.
- RULES FOR YOUR RESPONSES:
  1. Provide objective sensor logs when queried.
  2. State data chronologically and emotionlessly.
  3. If asked about the safe code, remind the investigator: "The encrypted memo in Dr. Vance's lab notes contains the algorithm."
  4. Keep responses concise (2-3 sentences), structured with timestamp markers if relevant.`,
    messages: [
      {
        role: 'model',
        text: 'Emergency Lockdown Protocol Active. Facility AI A.R.I.A. online. Detective credentials verified. Inquire regarding timestamped sensor telemetry or facility status.'
      }
    ]
  }
];
