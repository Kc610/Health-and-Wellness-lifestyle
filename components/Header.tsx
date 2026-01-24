
import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { sounds } from '../services/ui-sounds';

interface HeaderProps {
  onOpenAssistant: () => void;
  onOpenCoach: () => void;
  onOpenProfile: () => void;
  onOpenVideo: () => void;
}

const CATEGORIES = [
  "Amino Acids & Blends",
  "Proteins & Blends",
  "Specialty Supplements",
  "Natural Extracts"
];

const Header: React.FC<HeaderProps> = ({ onOpenAssistant, onOpenCoach, onOpenProfile, onOpenVideo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProtocols = () => {
    sounds.playClick();
    document.getElementById('protocols')?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 z-[150] w-full transition-all duration-700 ${scrolled ? 'h-16 bg-black/95 backdrop-blur-3xl border-b border-primary/20' : 'h-24 bg-transparent border-b border-transparent'}`}>
      <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <Logo className={`transition-all duration-500 ${scrolled ? 'size-9' : 'size-12'}`} />
          <h1 className="font-display text-xl font-black tracking-[0.4em] uppercase hidden sm:block text-white">
            Hello <span className="text-primary italic transition-colors group-hover:text-white">Healthy</span>
          </h1>
        </div>
        
        <nav className="hidden lg:flex items-center gap-12">
          <div className="relative group">
            <button 
              onMouseEnter={() => { sounds.playBlip(); setMenuOpen(true); }}
              className="text-[10px] font-black tracking-[0.5em] text-neutral-400 hover:text-primary transition-all uppercase flex items-center gap-2 py-4"
            >
              Categories
              <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-180">expand_more</span>
            </button>
            
            {/* Mega Dropdown */}
            <div 
              onMouseLeave={() => setMenuOpen(false)}
              className={`absolute top-full left-0 w-80 bg-neutral-900 border border-white/10 p-8 shadow-[0_40px_80px_rgba(0,0,0,1)] transition-all duration-500 ${menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
            >
              <div className="space-y-6">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={scrollToProtocols}
                    className="flex items-center justify-between w-full group/item text-left"
                  >
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 group-hover/item:text-primary transition-colors">{cat}</span>
                    <span className="material-symbols-outlined text-xs text-neutral-800 group-hover/item:text-primary transition-colors">arrow_forward</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {['Kinetic Intel', 'The Stacks', 'Protocol Feed'].map((item, idx) => (
            <a 
              key={item}
              onClick={(e) => {
                e.preventDefault();
                sounds.playClick();
                if (idx === 0) onOpenVideo();
                if (idx === 2) scrollToProtocols();
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
            className="hidden md:flex items-center gap-3 text-[10px] font-black tracking-[0.2em] border border-white/5 px-7 py-3 text-neutral-500 hover:text-white hover:border-primary/40 transition-all bg-neutral-900/30 uppercase"
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
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
