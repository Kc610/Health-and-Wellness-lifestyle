
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
          <SocialLink icon="science" />
          <SocialLink icon="public" />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 mt-24">
        {/* FDA Badges */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          <Badge label="FDA Registered" sub="Facility" />
          <Badge label="GMP Certified" sub="Practice" />
          <Badge label="Made In USA" sub="Domestic" />
          <Badge label="Non-GMO" sub="verified" />
          <Badge label="3rd Party" sub="Lab Tested" />
        </div>

        <div className="text-center border-t border-white/[0.03] pt-12 pb-6">
          <p className="text-[11px] text-zinc-700 font-black uppercase tracking-[0.8em] hover:text-primary/40 transition-colors cursor-default select-none">
            © 2025 HELLO HEALTHY PULSE <span className="mx-6 text-white/5">|</span> SYSTEMS OPTIMIZED <span className="mx-6 text-white/5">|</span> v4.0.0-PRO
          </p>
          <p className="text-[9px] text-zinc-800 mt-4 max-w-4xl mx-auto uppercase tracking-widest leading-relaxed">
            *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult your neural health professional before optimizing.
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialLink: React.FC<{ icon: string }> = ({ icon }) => (
  <a className="size-14 border border-white/5 bg-white/[0.02] flex items-center justify-center hover:border-primary/40 hover:bg-primary/5 transition-all group" href="#">
    <span className="material-symbols-outlined text-zinc-500 group-hover:text-primary group-hover:scale-110 transition-transform">{icon}</span>
  </a>
);

const Badge: React.FC<{ label: string; sub: string }> = ({ label, sub }) => (
  <div className="border border-white/10 px-6 py-3 bg-white/[0.01] flex flex-col items-center justify-center min-w-[140px] hover:border-primary/30 hover:bg-primary/[0.02] transition-colors">
    <span className="material-symbols-outlined text-2xl text-zinc-600 mb-1">verified_user</span>
    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</span>
    <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-wider">{sub}</span>
  </div>
);

export default Footer;
