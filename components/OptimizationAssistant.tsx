
import React, { useState, useEffect, useRef } from 'react';
import { createOptimizationChat } from '../services/gemini';
import { ChatMessage } from '../types';
import { sounds } from '../services/ui-sounds';

interface Props {
  onClose: () => void;
}

const OptimizationAssistant: React.FC<Props> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Neural link established. Optimization Agent active. State your biological hardware stats or request a protocol patch.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    chatRef.current = createOptimizationChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    sounds.playInject();
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage, timestamp: new Date() }]);
    setIsTyping(true);

    try {
      if (!chatRef.current) chatRef.current = createOptimizationChat();
      
      let fullResponse = '';
      const responseStream = await chatRef.current.sendMessageStream({ message: userMessage });
      
      // Add empty message for streaming
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

      for await (const chunk of responseStream) {
        const text = chunk.text;
        fullResponse += text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullResponse;
          return newMessages;
        });
      }
      sounds.playBlip();
    } catch (error) {
      console.error("Agent error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Communication link unstable. Resetting neural node...", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex justify-end">
      <div 
        className="absolute inset-0" 
        onClick={() => { sounds.playClick(); onClose(); }}
      ></div>
      
      <div className="relative w-full max-w-xl bg-surface-dark border-l border-white/10 h-full flex flex-col shadow-3xl animate-slide-left">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-primary/10 flex items-center justify-center border border-primary/40 rounded-sm">
              <span className="material-symbols-outlined text-primary text-2xl animate-pulse">terminal</span>
            </div>
            <div>
              <h3 className="font-display font-black text-xs uppercase tracking-[0.4em] text-primary">Optimization Agent</h3>
              <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] mt-0.5">Protocol Sync v3.1.4</p>
            </div>
          </div>
          <button 
            onClick={() => { sounds.playClick(); onClose(); }}
            className="size-12 flex items-center justify-center hover:bg-white/5 transition-colors text-neutral-500 hover:text-white"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth font-mono text-sm custom-scrollbar"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-6 border ${msg.role === 'user' ? 'bg-neutral-900/40 border-white/10 text-white' : 'bg-primary/5 border-primary/30 text-primary shadow-[0_0_20px_rgba(0,255,127,0.05)]'}`}>
                <div className="text-[9px] opacity-50 mb-4 uppercase tracking-[0.4em]">
                  {msg.role === 'user' ? 'SUBJECT' : 'AGENT'} - {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-primary/5 border border-primary/30 p-6 flex gap-2">
                <div className="size-2 bg-primary animate-bounce"></div>
                <div className="size-2 bg-primary animate-bounce [animation-delay:0.2s]"></div>
                <div className="size-2 bg-primary animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 border-t border-white/5 bg-black/60">
          <div className="relative">
            <input 
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject bio-data or optimization query..."
              className="w-full bg-neutral-900/40 border border-white/10 px-8 py-5 pr-28 text-sm font-mono focus:outline-none focus:border-primary transition-colors placeholder:text-neutral-700 text-white"
            />
            <button 
              type="submit"
              disabled={isTyping}
              className="absolute right-2 top-2 bottom-2 bg-primary text-black px-6 font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
            >
              INJECT
            </button>
          </div>
          <p className="mt-4 text-[9px] text-neutral-700 uppercase tracking-[0.5em] text-center">
            CAUTION: DATA STREAMS ARE AUDITED BY THE COLLECTIVE
          </p>
        </form>
      </div>
      
      <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
        }
      `}</style>
    </div>
  );
};

export default OptimizationAssistant;
