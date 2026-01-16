
import React, { useEffect, useState } from 'react';
import { sounds } from '../services/ui-sounds';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          alt="Athletes in training" 
          className="w-full h-full object-cover scale-110 blur-[1px] opacity-40 transition-transform duration-700"
          style={{ transform: `scale(${1.1 + scrollY * 0.0002}) translateY(${scrollY * 0.3}px)` }}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhr7x0aOTOVu45iXgp9VsNy6WkJxf0O-j3fTwQjs6yi7Br2HZUF-yd48p6c72BlPDpOmGr6yg0PcjfXRH1Pn_AYvP8woOXVQSoQpjjAK8nFnfquoi2MHyz2mdWynIUjro9iXP8wBENr9NPyImk7S1bCWvWx-UuVX_V2DljgCkzs4PARAPnPjI28Y0XRmH-eXEe5AO3za4M0KC8JTonfkflqniVFADGVW2-900DgWc2Xy4h69M8dRtdwhVzDYXta5DfPG3bAdcVbuE"
        />
        <div className="hero-gradient absolute inset-0"></div>
        <div className="scanline"></div>
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
        <div className="inline-block px-4 py-1 mb-8 border border-primary/30 bg-primary/10 text-primary text-[10px] font-black tracking-[0.4em] uppercase animate-pulse">
          Protocol Status: Optimal
        </div>
        <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-none mb-10 transition-all duration-1000">
          HELLO <span className="text-primary italic">HEALTHY</span>:<br/>
          <span className="italic font-light">REENGINEERING THE</span><br/>
          HUMAN <span className="text-glow animate-pulse">SPECIMEN</span>.
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => sounds.playInject()}
            className="group relative bg-primary text-black px-12 py-6 font-black text-sm tracking-[0.2em] uppercase overflow-hidden"
          >
            <span className="relative z-10">Initialize Optimization</span>
            <div className="absolute inset-0 bg-white transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
          </button>
          <button 
            onClick={() => sounds.playClick()}
            className="bg-white/5 border border-white/20 backdrop-blur-md text-white px-12 py-6 font-black text-sm tracking-[0.2em] uppercase hover:bg-white/10 transition-all"
          >
            Access Intel
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <span className="material-symbols-outlined text-4xl">expand_more</span>
      </div>
    </section>
  );
};

export default Hero;
