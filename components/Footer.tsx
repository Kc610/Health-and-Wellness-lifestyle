
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="py-32 bg-background-dark border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-16">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-5 mb-8">
            <Logo className="size-12" />
            <h2 className="font-display text-2xl font-black tracking-[0.3em] uppercase text-white">Hello <span className="text-primary italic">Healthy</span></h2>
          </div>
          <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-[0.4em] max-w-sm leading-relaxed">Built for the elite biological standard. Vitality without compromise through the Neural Helix.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-16 text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400">
          {['Protocols', 'Helix Access', 'Vitality Strands', 'Bio-Privacy'].map(item => (
            <a key={item} className="hover:text-primary transition-colors relative group" href="#">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all"></span>
            </a>
          ))}
        </div>
        
        <div className="flex gap-6">
          <SocialLink icon="monitor_heart" />
          <SocialLink icon="dna" />
        </div>
      </div>
      
      <div className="mt-24 text-center border-t border-white/[0.03] pt-12 pb-6">
        <p className="text-[11px] text-zinc-700 font-black uppercase tracking-[0.8em] hover:text-primary/40 transition-colors cursor-default select-none">
          © 2025 HELLO HEALTHY PULSE <span className="mx-6 text-white/5">|</span> SYSTEMS OPTIMIZED <span className="mx-6 text-white/5">|</span> v4.0.0-PRO
        </p>
      </div>
    </footer>
  );
};

const SocialLink: React.FC<{ icon: string }> = ({ icon }) => (
  <a className="size-14 border border-white/5 bg-white/[0.02] flex items-center justify-center hover:border-primary/40 hover:bg-primary/5 transition-all group" href="#">
    <span className="material-symbols-outlined text-zinc-500 group-hover:text-primary group-hover:scale-110 transition-transform">{icon}</span>
  </a>
);

export default Footer;
