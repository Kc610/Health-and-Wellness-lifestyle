
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { sounds } from '../services/ui-sounds';

interface HeaderProps {
  onOpenAssistant: () => void;
  onOpenCoach: () => void;
  onOpenProfile: () => void;
  onOpenVideo: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAssistant, onOpenCoach, onOpenProfile, onOpenVideo }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-[150] w-full transition-all duration-500 ${scrolled ? 'h-16 bg-black/95 backdrop-blur-3xl border-b border-primary/20' : 'h-24 bg-transparent border-b border-transparent'}`}>
      <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <Logo className={`transition-all duration-500 ${scrolled ? 'size-9' : 'size-12'}`} />
          <h1 className="font-display text-xl font-black tracking-[0.3em] uppercase hidden sm:block text-white">
            Hello <span className="text-primary italic transition-colors group-hover:text-white">Healthy</span>
          </h1>
        </div>
        
        <nav className="hidden lg:flex items-center gap-14">
          {['Kinetic Intel', 'The Stacks', 'Optimization', 'Protocol Feed'].map((item, idx) => (
            <a 
              key={item}
              onClick={(e) => {
                e.preventDefault();
                sounds.playClick();
                if (idx === 0) onOpenVideo();
              }}
              className="text-[10px] font-black tracking-[0.5em] text-neutral-400 hover:text-primary transition-all uppercase relative group cursor-pointer" 
              href="#"
            >
              {item}
              <span className="absolute -bottom-2 left-1/2 w-0 h-[1.5px] bg-primary group-hover:w-full group-hover:left-0 transition-all duration-300 shadow-[0_0_8px_#00FF7F]"></span>
            </a>
          ))}
        </nav>
        
        <div className="flex items-center gap-6 sm:gap-10">
          <button 
            onClick={() => { sounds.playBlip(); onOpenProfile(); }}
            className="hidden md:flex items-center gap-3 text-[10px] font-black tracking-[0.2em] border border-white/10 px-7 py-3 text-neutral-400 hover:text-white hover:border-primary/50 transition-all bg-neutral-900/40 uppercase"
          >
            <span className="material-symbols-outlined text-lg">biotech</span>
            BIO-baseline
          </button>
          
          <button 
            onClick={() => { sounds.playBlip(); onOpenCoach(); }}
            className="flex items-center gap-3 text-[10px] font-black tracking-[0.4em] bg-primary/10 border border-primary/40 px-7 py-3 text-primary hover:bg-primary hover:text-black transition-all shadow-[0_0_25px_rgba(0,255,127,0.15)] relative overflow-hidden group uppercase"
          >
            <span className="material-symbols-outlined text-lg animate-pulse">sensors</span>
            PULSE LINK
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
