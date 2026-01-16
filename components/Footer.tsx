
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="py-20 bg-black border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Logo className="size-8" />
            <h2 className="font-display text-lg font-extrabold tracking-[0.2em] uppercase">Hello <span className="text-primary">Healthy</span></h2>
          </div>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">Built for the elite. Biological optimization without compromise.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {['Protocols', 'Hardware', 'Intel Nodes', 'Privacy'].map(item => (
            <a key={item} className="hover:text-primary transition-colors" href="#">{item}</a>
          ))}
        </div>
        
        <div className="flex gap-4">
          <SocialLink icon="alternate_email" />
          <SocialLink icon="terminal" />
        </div>
      </div>
      
      <div className="mt-20 text-center border-t border-white/5 pt-10 pb-4">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.6em] hover:text-primary transition-colors cursor-default select-none">
          © 2024 HELLO HEALTHY NODE <span className="mx-4 text-white/10">|</span> ALL SYSTEMS ACTIVE <span className="mx-4 text-white/10">|</span> VERSION 3.1.4
        </p>
      </div>
    </footer>
  );
};

const SocialLink: React.FC<{ icon: string }> = ({ icon }) => (
  <a className="size-10 border border-white/10 flex items-center justify-center hover:border-primary transition-colors group" href="#">
    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">{icon}</span>
  </a>
);

export default Footer;
