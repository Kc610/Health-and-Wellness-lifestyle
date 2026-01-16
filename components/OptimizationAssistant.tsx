
import React, { useState, useEffect, useRef } from 'react';
import { createOptimizationChat } from '../services/gemini';
import { ChatMessage } from '../types';

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
    } catch (error) {
      console.error("Agent error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Communication link unstable. Resetting neural node...", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-end">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-xl bg-surface-dark border-l border-white/10 h-full flex flex-col shadow-2xl animate-slide-left">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-symbols-outlined text-primary text-xl animate-pulse">terminal</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-primary">Neural Optimization Agent</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Protocol Sync v3.1.4</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="size-10 flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth font-mono text-sm"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 border ${msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-primary/5 border-primary/20 text-primary'}`}>
                <div className="text-[10px] opacity-40 mb-2 uppercase tracking-widest">
                  {msg.role === 'user' ? 'SUBJECT' : 'AGENT'} - {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-primary/5 border border-primary/20 p-4">
                <div className="flex gap-1">
                  <div className="size-1.5 bg-primary animate-bounce"></div>
                  <div className="size-1.5 bg-primary animate-bounce [animation-delay:0.2s]"></div>
                  <div className="size-1.5 bg-primary animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 border-t border-white/10 bg-black/40">
          <div className="relative">
            <input 
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Inject bio-data or optimization query..."
              className="w-full bg-surface-dark border border-white/10 px-6 py-4 pr-24 text-sm font-mono focus:outline-none focus:border-primary transition-colors placeholder:text-slate-600"
            />
            <button 
              type="submit"
              disabled={isTyping}
              className="absolute right-2 top-2 bottom-2 bg-primary text-black px-4 font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
            >
              INJECT
            </button>
          </div>
          <p className="mt-3 text-[9px] text-slate-600 uppercase tracking-widest text-center">
            CAUTION: DATA STREAMS ARE AUDITED BY THE COLLECTIVE INTEL CORE
          </p>
        </form>
      </div>
      
      <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default OptimizationAssistant;
