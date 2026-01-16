
import React from 'react';
import Logo from './Logo';
import { sounds } from '../services/ui-sounds';

interface HeaderProps {
  onOpenAssistant: () => void;
  onOpenCoach: () => void;
  onOpenProfile: () => void;
  onOpenVideo: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAssistant, onOpenCoach, onOpenProfile, onOpenVideo }) => {
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
          <a onClick={() => { sounds.playClick(); onOpenVideo(); }} className="text-[10px] font-bold tracking-[0.3em] hover:text-primary transition-colors uppercase relative group cursor-pointer text-primary">
            Kinetic Intel
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"></span>
          </a>
          {['The Stacks', 'Optimization', 'Protocol Intel', 'Vitality Strands'].map((item) => (
            <a 
              key={item}
              onClick={() => sounds.playClick()}
              className="text-[10px] font-bold tracking-[0.3em] hover:text-primary transition-colors uppercase relative group cursor-pointer" 
              href="#"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </nav>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => { sounds.playBlip(); onOpenProfile(); }}
            className="hidden sm:flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] border border-white/10 px-4 py-2 text-slate-400 hover:text-white hover:border-white/30 transition-all"
          >
            <span className="material-symbols-outlined text-lg">ecg</span>
            VITAL-DATA
          </button>
          <button 
            onClick={() => { sounds.playBlip(); onOpenCoach(); }}
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] bg-primary/10 border border-primary/20 px-4 py-2 text-primary hover:bg-primary hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,127,0.1)]"
          >
            <span className="material-symbols-outlined text-lg">monitor_heart</span>
            PULSE LINK
          </button>
          <button 
            onClick={() => sounds.playClick()}
            className="text-[10px] font-bold tracking-[0.3em] border border-white/20 px-8 py-3 hover:bg-white hover:text-black transition-all"
          >
            LOGIN
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
