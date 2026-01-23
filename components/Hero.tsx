
import React, { useEffect, useState } from 'react';
import { sounds } from '../services/ui-sounds';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth) - 0.5, 
        y: (e.clientY / window.innerHeight) - 0.5 
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToProtocols = () => {
    sounds.playClick();
    const protocolsSection = document.getElementById('protocols');
    if (protocolsSection) {
      protocolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black pt-20">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          alt="High-performance biology" 
          className="w-full h-full object-cover opacity-30 transition-transform duration-700 ease-out"
          style={{ 
            transform: `scale(${1.05 + scrollY * 0.0002}) translateY(${scrollY * 0.15}px) translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` 
          }}
          src="https://images.unsplash.com/photo-1614728263952-84ea206f99b6?q=80&w=2000&auto=format&fit=crop"
        />
        <div className="hero-gradient absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
        
        {/* Parallax Floating Data Points */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute size-px bg-primary/40 rounded-full animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `translateY(${scrollY * (0.05 + Math.random() * 0.2)}px)`,
                opacity: 0.1 + Math.random() * 0.4,
                boxShadow: '0 0 10px #00FF7F'
              }}
            ></div>
          ))}
        </div>

        {/* Dynamic Grid Floor */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ 
          backgroundImage: 'linear-gradient(#00FF7F 1px, transparent 1px), linear-gradient(90deg, #00FF7F 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          transform: `perspective(800px) rotateX(60deg) translateY(${scrollY * 0.3}px) translateZ(-100px)`
        }}></div>
      </div>

      {/* Side Status HUD */}
      <div className="absolute top-1/2 left-12 -translate-y-1/2 hidden xl:flex flex-col gap-12 opacity-50 animate-float pointer-events-none">
         <div className="space-y-2 border-l border-primary/40 pl-4 py-2 bg-primary/5">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Core Temp</p>
            <p className="font-mono text-xl font-bold">37.0°C</p>
         </div>
         <div className="space-y-2 border-l border-primary/40 pl-4 py-2 bg-primary/5">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Neural Load</p>
            <p className="font-mono text-xl font-bold">12.8%</p>
         </div>
         <div className="space-y-2 border-l border-primary/40 pl-4 py-2 bg-primary/5">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Helix Flow</p>
            <p className="font-mono text-xl font-bold">A-SYNC</p>
         </div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center mt-[-10vh]">
        <div className="inline-flex items-center gap-4 px-6 py-2 mb-12 border border-primary/30 bg-primary/5 text-primary text-[10px] font-black tracking-[0.5em] uppercase rounded-full backdrop-blur-md">
          <span className="size-2 bg-primary rounded-full animate-ping"></span>
          Vitality Collective // Sector 07 Gamma
        </div>
        
        <h2 className="font-display text-7xl md:text-[11rem] font-black tracking-tighter leading-[0.8] mb-12 drop-shadow-[0_0_80px_rgba(0,255,127,0.3)] select-none">
          REWRITE <span className="text-primary italic animate-pulse">THE</span><br/>
          <span className="font-light italic text-white/90">STANDARD.</span>
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => sounds.playInject()}
            className="group relative bg-primary text-black px-16 py-8 font-black text-sm tracking-[0.3em] uppercase overflow-hidden shadow-[0_0_50px_rgba(0,255,127,0.4)] hover:scale-105 transition-all active:scale-95"
          >
            <span className="relative z-10">Initiate Sync</span>
            <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
          </button>
          <button 
            onClick={scrollToProtocols} // Changed to scroll to protocols
            className="bg-white/5 border border-white/10 backdrop-blur-xl text-white px-16 py-8 font-black text-sm tracking-[0.3em] uppercase hover:bg-white/10 transition-all group overflow-hidden relative"
          >
            <span className="relative z-10">Access Stacks</span>
            <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>

        <div className="mt-20 flex justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           {['VO2 OPTIMIZED', 'NEURAL SYNERGY', 'GENETIC AUDIT'].map(tag => (
             <span key={tag} className="font-mono text-[9px] font-bold tracking-[0.4em] uppercase border-b border-primary/40 pb-1 text-primary">{tag}</span>
           ))}
        </div>
      </div>
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50 group cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] group-hover:text-primary transition-colors">Vertical Dive</p>
        <span className="material-symbols-outlined text-4xl group-hover:translate-y-2 transition-transform text-primary">keyboard_double_arrow_down</span>
      </div>
    </section>
  );
};

export default Hero;
