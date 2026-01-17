
import React, { useEffect, useState } from 'react';
import { sounds } from '../services/ui-sounds';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [pulseTime, setPulseTime] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(() => {
      setPulseTime(prev => (prev + 1) % 100);
    }, 50);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <img 
          alt="High-performance athlete" 
          className="w-full h-full object-cover scale-110 blur-[0.5px] opacity-30 transition-transform duration-700"
          style={{ transform: `scale(${1.05 + scrollY * 0.0001}) translateY(${scrollY * 0.2}px)` }}
          src="https://images.unsplash.com/photo-1548691905-57c36cc8d93f?auto=format&fit=crop&q=80&w=2069"
        />
        <div className="hero-gradient absolute inset-0"></div>
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'linear-gradient(#00FF7F 1px, transparent 1px), linear-gradient(90deg, #00FF7F 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: `perspective(500px) rotateX(60deg) translateY(${scrollY * 0.5}px)`
        }}></div>

        {/* Vitality Waveform Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <svg viewBox="0 0 1000 400" className="w-full h-full">
            <path 
              d="M0 200 L 100 200 L 120 180 L 140 220 L 160 200 L 300 200 L 320 50 L 340 350 L 360 200 L 500 200 L 520 150 L 540 250 L 560 200 L 800 200 L 820 190 L 840 210 L 860 200 L 1000 200" 
              fill="none" 
              stroke="#00FF7F" 
              strokeWidth="2" 
              className="animate-pulse-draw"
            />
          </svg>
        </div>
      </div>

      {/* Floating HUD Element */}
      <div className="absolute top-32 left-8 hidden lg:block animate-float opacity-40">
        <div className="p-6 border border-primary/20 bg-primary/5 backdrop-blur-md">
          <div className="text-[8px] font-black text-primary uppercase tracking-[0.4em] mb-4">Metabolic Flux</div>
          <div className="flex items-end gap-1 h-12">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-primary/40" 
                style={{ height: `${20 + Math.sin((pulseTime + i) * 0.5) * 30 + 50}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-1 mb-8 border border-primary/30 bg-primary/10 text-primary text-[10px] font-black tracking-[0.4em] uppercase">
          <span className="size-2 bg-primary rounded-full animate-ping"></span>
          Pulse Frequency: Stable // Vitality Sync Optimal
        </div>
        <h2 className="font-display text-6xl md:text-9xl font-black tracking-tighter leading-none mb-10 transition-all duration-1000 drop-shadow-2xl">
          HELLO <span className="text-primary italic">HEALTHY</span>:<br/>
          <span className="italic font-light">EVOLVING THE</span><br/>
          HUMAN <span className="text-glow animate-pulse">VITALITY</span>.
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => sounds.playInject()}
            className="group relative bg-primary text-black px-12 py-6 font-black text-sm tracking-[0.2em] uppercase overflow-hidden shadow-[0_0_30px_rgba(0,255,127,0.3)]"
          >
            <span className="relative z-10">Synchronize Vitals</span>
            <div className="absolute inset-0 bg-white transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
          </button>
          <button 
            onClick={() => sounds.playClick()}
            className="bg-white/5 border border-white/20 backdrop-blur-md text-white px-12 py-6 font-black text-sm tracking-[0.2em] uppercase hover:bg-white/10 transition-all group"
          >
            Access Protocol Helix
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <span className="material-symbols-outlined text-4xl">keyboard_double_arrow_down</span>
      </div>

      <style>{`
        @keyframes pulse-draw {
          0% { stroke-dasharray: 0 1000; opacity: 0; }
          20% { opacity: 1; }
          100% { stroke-dasharray: 1000 0; opacity: 0; }
        }
        .animate-pulse-draw {
          stroke-dasharray: 1000;
          animation: pulse-draw 4s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
