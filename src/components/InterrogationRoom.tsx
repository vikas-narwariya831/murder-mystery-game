import React, { useState, useRef, useEffect } from 'react';
import type { Suspect } from '../types/game';
import { askSuspectAI } from '../services/geminiService';
import { Send, Bot, UserCircle, Loader2, ShieldAlert, Lightbulb } from 'lucide-react';

interface InterrogationProps {
  suspects: Suspect[];
  onAccuseSuspect: (suspectId: string) => void;
}

export const InterrogationRoom: React.FC<InterrogationProps> = ({
  suspects: initialSuspects,
  onAccuseSuspect,
}) => {
  const [suspects, setSuspects] = useState<Suspect[]>(initialSuspects);
  const [activeSuspectId, setActiveSuspectId] = useState<string>(initialSuspects[0].id);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeSuspect = suspects.find(s => s.id === activeSuspectId) || suspects[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSuspect.messages, isLoading]);

  const handleSend = async (e?: React.FormEvent, presetMsg?: string) => {
    if (e) e.preventDefault();
    const text = (presetMsg || inputMessage).trim();
    if (!text || isLoading) return;
    setInputMessage('');
    setIsLoading(true);

    setSuspects(prev => prev.map(s =>
      s.id === activeSuspectId ? { ...s, messages: [...s.messages, { role: 'user', text }] } : s
    ));

    const aiReply = await askSuspectAI(activeSuspect.systemPrompt, activeSuspect.messages, text);

    setSuspects(prev => prev.map(s =>
      s.id === activeSuspectId ? { ...s, messages: [...s.messages, { role: 'model', text: aiReply }] } : s
    ));
    setIsLoading(false);
  };

  const quickQuestions = [
    "Where were you at 11:45 PM?",
    "What do you know about the coffee mug?",
    "Did you visit the private pantry?",
    "Tell me about the missing patent files.",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" style={{ height: '680px' }}>

      {/* Suspect Sidebar */}
      <div className="lg:col-span-4 flex flex-col gap-3 overflow-hidden">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-sky-500" />
            Suspects — Select to Interrogate
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Click a suspect, then type questions in the live AI chat.</p>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {suspects.map((s) => {
            const isActive = s.id === activeSuspectId;
            return (
              <div
                key={s.id}
                onClick={() => setActiveSuspectId(s.id)}
                className={`bg-white border rounded-xl p-3.5 cursor-pointer transition-all shadow-sm ${
                  isActive
                    ? 'border-sky-400 ring-2 ring-sky-100 shadow-sky-50'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-xl object-cover border-2 border-slate-200 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-slate-800 truncate">{s.name}</span>
                      {s.id === 'aria' && <Bot className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-sky-600 font-medium truncate">{s.role}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{s.alibi}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Accuse Button */}
        <button
          onClick={() => onAccuseSuspect(activeSuspect.id)}
          className="py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <ShieldAlert className="w-4 h-4" />
          Formally Accuse {activeSuspect.name.split(' ')[0]}
        </button>
      </div>

      {/* Chat Panel */}
      <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={activeSuspect.avatar} alt={activeSuspect.name} className="w-11 h-11 rounded-xl object-cover border-2 border-slate-200" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{activeSuspect.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">{activeSuspect.role}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{activeSuspect.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            AI Active
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {activeSuspect.messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-sky-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}>
                  <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isUser ? 'text-sky-200' : 'text-slate-400'}`}>
                    {isUser ? '🕵️ Detective' : `⚠️ ${activeSuspect.name}`}
                  </div>
                  <div className={isUser ? '' : 'font-mono text-xs'}>{msg.text}</div>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 text-sm text-slate-500 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                <span>Analyzing response...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="text-[11px]">Quick:</span>
          </div>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(undefined, q)}
              disabled={isLoading}
              className="flex-shrink-0 text-[11px] px-3 py-1 rounded-full bg-slate-100 hover:bg-sky-100 hover:text-sky-700 border border-slate-200 hover:border-sky-300 transition-all disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask ${activeSuspect.name} a question...`}
            disabled={isLoading}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
