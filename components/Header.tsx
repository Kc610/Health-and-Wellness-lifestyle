
import React from 'react';
import Logo from './Logo';

interface HeaderProps {
  onOpenAssistant: () => void;
  onOpenCoach: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAssistant, onOpenCoach }) => {
  return (
    <header className="fixed top-0 z-[80] w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo className="size-10" />
          <h1 className="font-display text-xl font-extrabold tracking-[0.2em] uppercase">
            Hello <span className="text-primary italic">Healthy</span>
          </h1>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10">
          {['The Stacks', 'Optimization', 'Protocol Intel', 'Nodes'].map((item) => (
            <a 
              key={item}
              className="text-[10px] font-bold tracking-[0.3em] hover:text-primary transition-colors uppercase relative group" 
              href="#"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </nav>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={onOpenCoach}
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] bg-primary/10 border border-primary/20 px-4 py-2 text-primary hover:bg-primary hover:text-black transition-all"
          >
            <span className="material-symbols-outlined text-lg">settings_voice</span>
            NEURAL LINK
          </button>
          <button 
            onClick={onOpenAssistant}
            className="hidden md:flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg">terminal</span>
            SYNC AGENT
          </button>
          <button className="text-[10px] font-bold tracking-[0.3em] border border-white/20 px-8 py-3 hover:bg-white hover:text-black transition-all">
            LOGIN
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
