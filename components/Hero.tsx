
import React, { useEffect, useState } from 'react';
import { sounds } from '../services/ui-sounds';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [pulseRate, setPulseRate] = useState(72);
  const [efficiency, setEfficiency] = useState(94.2);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(() => {
      setPulseRate(prev => Math.max(60, Math.min(85, prev + (Math.random() - 0.5) * 2)));
      setEfficiency(prev => Math.max(90, Math.min(99, prev + (Math.random() - 0.5) * 0.1)));
    }, 2000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background-dark">
      {/* Background Enhancements */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="High-performance biological visualization" 
          className="w-full h-full object-cover scale-110 opacity-20 transition-transform duration-1000 ease-out grayscale hover:grayscale-0"
          style={{ transform: `scale(${1.1 + scrollY * 0.0002}) translateY(${scrollY * 0.1}px)` }}
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=2070"
        />
        <div className="hero-gradient absolute inset-0 z-10"></div>
        
        {/* Animated Digital Grid - Neutralized */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ 
          backgroundImage: 'linear-gradient(#00FF7F 1px, transparent 1px), linear-gradient(90deg, #00FF7F 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          transform: `perspective(1000px) rotateX(60deg) translateY(${scrollY * 0.25}px)`
        }}></div>
      </div>

      {/* Metabolic HUD Overlay - Neutralized */}
      <div className="absolute top-40 right-12 hidden xl:block animate-float z-20">
        <div className="p-8 border-l-2 border-primary/40 bg-interface-gray/40 backdrop-blur-2xl space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-primary/80 uppercase tracking-[0.4em]">Cardiac Sync</p>
            <p className="text-4xl font-display font-black text-white">{Math.floor(pulseRate)} <span className="text-[10px] text-zinc-500 tracking-normal">BPM</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] font-black text-primary/80 uppercase tracking-[0.4em]">Metabolic Efficiency</p>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-display font-bold text-white">{efficiency.toFixed(1)}%</p>
              <div className="h-1 w-24 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary shadow-[0_0_10px_#00FF7F] transition-all duration-1000" style={{ width: `${efficiency}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-8 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-3 px-8 py-3 mb-16 border border-primary/30 bg-primary/5 backdrop-blur-md rounded-full shadow-[0_0_30px_rgba(0,255,127,0.1)] reveal-on-scroll">
          <span className="size-2 bg-primary rounded-full animate-ping"></span>
          <span className="text-primary text-[10px] font-black tracking-[0.5em] uppercase">Sector A-1 // Neural Status: Optimized</span>
        </div>
        
        <h2 className="font-display text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-12 drop-shadow-[0_20px_50px_rgba(0,0,0,1)] uppercase text-white text-glow">
          Evolving the <br/>
          <span className="text-primary italic relative inline-block group">
            Human <span className="text-white group-hover:text-primary transition-colors">Pulse</span>
            <svg className="absolute -bottom-4 left-0 w-full h-3 text-primary/40" viewBox="0 0 400 10" preserveAspectRatio="none">
              <path d="M0 5 Q 100 0 200 5 T 400 5" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="15 10" />
            </svg>
          </span>
        </h2>
        
        <p className="max-w-2xl text-lg md:text-xl text-zinc-400 font-light leading-relaxed mb-20 uppercase tracking-[0.15em]">
          Precision biological protocols designed for the elite collective. <br/>
          Your transformation into <span className="text-white font-bold tracking-widest">Hello Healthy</span> begins at the cellular level.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
          <button 
            onClick={() => { sounds.playInject(); document.getElementById('protocols')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="group relative bg-primary text-black px-20 py-8 font-black text-sm tracking-[0.4em] uppercase overflow-hidden shadow-[0_0_60px_rgba(0,255,127,0.3)] hover:scale-105 transition-all"
          >
            <span className="relative z-10 flex items-center gap-4">
              Access The Helix
              <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-3">arrow_right_alt</span>
            </span>
            <div className="absolute inset-0 bg-white transform translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
          
          <button 
            onClick={() => sounds.playClick()}
            className="bg-white/5 border border-white/10 backdrop-blur-2xl text-white px-16 py-8 font-black text-sm tracking-[0.4em] uppercase hover:bg-white/10 transition-all hover:-translate-y-2 group border-b-2 border-b-primary/40"
          >
            Synergy Thesis
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 opacity-60">
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white">Initialize Descent</p>
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary via-primary/50 to-transparent animate-pulse shadow-[0_0_10px_#00FF7F]"></div>
      </div>
    </section>
  );
};

export default Hero;
