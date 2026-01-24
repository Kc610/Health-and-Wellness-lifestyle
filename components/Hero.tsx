
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
      {/* Background Depth */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Biological performance matrix" 
          className="w-full h-full object-cover scale-110 opacity-[0.15] transition-transform duration-[2s] ease-out grayscale"
          style={{ transform: `scale(${1.05 + scrollY * 0.0001}) translateY(${scrollY * 0.1}px)` }}
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=2070"
        />
        <div className="hero-gradient absolute inset-0 z-10"></div>
        
        {/* Moving Neural Grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ 
          backgroundImage: 'linear-gradient(#00FF7F 1px, transparent 1px), linear-gradient(90deg, #00FF7F 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          transform: `perspective(1000px) rotateX(45deg) translateY(${scrollY * 0.2}px)`
        }}></div>
      </div>

      {/* Metabolic HUD Overlay */}
      <div className="absolute top-40 right-12 hidden xl:block animate-float z-20">
        <div className="p-8 border-l-2 border-primary/50 bg-neutral-900/40 backdrop-blur-3xl space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-white/5">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.5em]">Cardiac Sync</p>
            <p className="text-4xl font-display font-black text-white">{Math.floor(pulseRate)} <span className="text-[10px] text-neutral-500 tracking-normal">BPM</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.5em]">Metabolic Flux</p>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-display font-bold text-white">{efficiency.toFixed(1)}%</p>
              <div className="h-1.5 w-32 bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-[2000ms] shadow-[0_0_10px_#00FF7F]" style={{ width: `${efficiency}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-8 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-4 px-10 py-3 mb-16 border border-primary/40 bg-primary/5 backdrop-blur-xl rounded-full shadow-[0_0_30px_rgba(0,255,127,0.1)] reveal-on-scroll">
          <span className="size-2 bg-primary rounded-full animate-ping"></span>
          <span className="text-primary text-[11px] font-black tracking-[0.6em] uppercase">Sector A-1 // Bio-Core Optimized</span>
        </div>
        
        <h2 className="font-display text-7xl md:text-[9.5rem] font-black tracking-tighter leading-[0.8] mb-12 drop-shadow-[0_20px_50px_rgba(0,0,0,1)] uppercase text-white text-glow">
          Evolving the <br/>
          <span className="text-primary italic relative inline-block group">
            Human <span className="text-white group-hover:text-primary transition-colors duration-500">Pulse</span>
            <svg className="absolute -bottom-6 left-0 w-full h-4 text-primary/30" viewBox="0 0 400 10" preserveAspectRatio="none">
              <path d="M0 5 Q 100 0 200 5 T 400 5" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="20 10" />
            </svg>
          </span>
        </h2>
        
        <p className="max-w-2xl text-lg md:text-xl text-neutral-400 font-light leading-relaxed mb-20 uppercase tracking-[0.2em]">
          Precision biological protocols designed for the elite collective. <br/>
          Your transformation into <span className="text-white font-bold tracking-widest">Hello Healthy</span> begins now.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
          <button 
            onClick={() => { sounds.playInject(); document.getElementById('protocols')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="group relative bg-primary text-black px-20 py-8 font-black text-sm tracking-[0.5em] uppercase overflow-hidden shadow-[0_0_60px_rgba(0,255,127,0.3)] hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-4">
              Access Helix
              <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-3">arrow_right_alt</span>
            </span>
            <div className="absolute inset-0 bg-white transform translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500"></div>
          </button>
          
          <button 
            onClick={() => sounds.playClick()}
            className="bg-neutral-900/50 border border-white/10 backdrop-blur-3xl text-white px-16 py-8 font-black text-sm tracking-[0.5em] uppercase hover:bg-white/10 transition-all hover:-translate-y-2 group border-b-2 border-b-primary/40"
          >
            Synergy Thesis
          </button>
        </div>
      </div>
      
      {/* Scroll Tip */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-8 opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white">Initialize Descent</p>
        <div className="w-[1px] h-20 bg-gradient-to-b from-primary via-primary/30 to-transparent animate-pulse shadow-[0_0_15px_#00FF7F]"></div>
      </div>
    </section>
  );
};

export default Hero;
