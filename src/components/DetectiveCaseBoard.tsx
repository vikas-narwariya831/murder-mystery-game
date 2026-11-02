import React from 'react';
import type { ClueItem } from '../types/game';
import { 
  Coffee, 
  FileText, 
  Terminal, 
  FlaskConical, 
  Key, 
  CheckCircle2, 
  HelpCircle,
  Briefcase
} from 'lucide-react';

interface CaseBoardProps {
  clues: ClueItem[];
  onSelectClue: (clue: ClueItem) => void;
}

export const DetectiveCaseBoard: React.FC<CaseBoardProps> = ({
  clues,
  onSelectClue,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee': return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'FileText': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5 text-purple-400" />;
      case 'Key': return <Key className="w-5 h-5 text-yellow-400" />;
      default: return <HelpCircle className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="bg-noir-950/70 border border-noir-700 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-noir-cyan" />
          <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-gray-200">
            Detective Evidence Locker & Bag
          </h3>
        </div>
        <div className="text-[11px] font-mono text-cyan-400">
          {clues.filter(c => c.discovered).length} of {clues.length} Items Logged
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {clues.map((clue) => {
          return (
            <div
              key={clue.id}
              onClick={() => clue.discovered && onSelectClue(clue)}
              className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                clue.discovered
                  ? 'bg-noir-800 border-cyan-500/40 hover:border-cyan-400 cursor-pointer shadow-md'
                  : 'bg-noir-900/50 border-noir-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded bg-black/40 border border-noir-700">
                  {getIcon(clue.iconName)}
                </div>
                {clue.discovered ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[9px] font-mono text-gray-500">???</span>
                )}
              </div>

              <div>
                <div className="font-semibold text-xs text-white truncate">
                  {clue.discovered ? clue.title : 'Unidentified Clue'}
                </div>
                <div className="text-[10px] text-gray-400 line-clamp-1 mt-0.5 font-mono">
                  {clue.discovered ? clue.secretDetail : 'Explore the crime scene'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
