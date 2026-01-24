
import React from 'react';

const Philosophy: React.FC = () => {
  return (
    <section className="py-40 bg-background-dark overflow-hidden relative border-y border-white/5">
      <div className="absolute -right-20 bottom-0 text-[20rem] font-black manifesto-stroke whitespace-nowrap opacity-5 leading-none select-none pointer-events-none text-primary">
        VITALITY
      </div>
      
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-12 gap-16 items-center">
          <div className="col-span-12 lg:col-span-7">
            <p className="text-primary font-bold tracking-[0.5em] uppercase mb-8 text-xs flex items-center gap-6">
              <span className="w-12 h-px bg-primary"></span>
              The Synergy Thesis
            </p>
            <h3 className="font-display text-5xl md:text-8xl font-black mb-16 leading-none uppercase tracking-tighter text-white">
              Vitality <br/>Without <span className="text-primary italic">Boundaries.</span>
            </h3>
            <div className="space-y-10 text-xl text-neutral-400 font-light leading-relaxed max-w-2xl">
              <p>
                At <span className="text-white font-bold">Hello Healthy</span>, we treat the human organism as a dynamic <span className="text-primary font-bold">Bio-Nexus</span>. Health isn't a static target; it's a high-frequency performance state that must be calibrated.
              </p>
              <p>
                Our collective is a high-performance network of visionaries committed to refining the biological experience through precision protocols and neural strands that bridge the gap between human and peak hardware.
              </p>
            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-5">
            <div className="p-16 border border-white/10 bg-neutral-900/20 backdrop-blur-3xl relative overflow-hidden group shadow-[0_0_80px_rgba(0,0,0,1)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-40"></div>
              <div className="absolute -top-4 -left-4 size-16 border-t border-l border-primary/30"></div>
              <div className="absolute -bottom-4 -right-4 size-16 border-b border-r border-primary/30"></div>
              
              <h4 className="font-display text-3xl font-black mb-12 flex items-center gap-6 uppercase tracking-tighter text-white">
                <span className="text-primary font-black text-5xl">01.</span> Vitality Strands
              </h4>
              
              <div className="space-y-6">
                <NodeLink 
                  icon="monitor_heart" 
                  title="Healthy Sync" 
                  description="Real-time biological coordination" 
                />
                <NodeLink 
                  icon="auto_awesome" 
                  title="Vitality Stream" 
                  description="Encrypted biological optimization" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface NodeLinkProps {
  icon: string;
  title: string;
  description: string;
}

const NodeLink: React.FC<NodeLinkProps> = ({ icon, title, description }) => (
  <a className="flex items-center justify-between p-8 bg-black/40 border border-white/10 hover:border-primary transition-all group/link shadow-xl" href="#">
    <div className="flex items-center gap-6">
      <span className="material-symbols-outlined text-4xl text-neutral-600 group-hover/link:text-primary transition-colors">{icon}</span>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white">{title}</p>
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">{description}</p>
      </div>
    </div>
    <span className="material-symbols-outlined group-hover/link:translate-x-2 transition-transform opacity-0 group-hover/link:opacity-100 text-primary">arrow_forward</span>
  </a>
);

export default Philosophy;
