
import React from 'react';

const Philosophy: React.FC = () => {
  return (
    <section className="py-32 bg-black overflow-hidden relative">
      <div className="absolute -right-20 bottom-0 text-[18rem] font-black manifesto-stroke whitespace-nowrap opacity-5 leading-none select-none pointer-events-none text-primary">
        VITALITY
      </div>
      
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-12 gap-12 items-center">
          <div className="col-span-12 lg:col-span-7">
            <p className="text-primary font-bold tracking-[0.3em] uppercase mb-6 text-sm flex items-center gap-4">
              <span className="w-8 h-px bg-primary"></span>
              The Synergy Thesis
            </p>
            <h3 className="font-display text-5xl md:text-7xl font-bold mb-12 leading-tight uppercase tracking-tighter">
              Vitality <br/>Without Boundaries.
            </h3>
            <div className="space-y-8 text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
              <p>
                At <span className="text-white font-bold">Hello Healthy</span>, we treat the human organism as a dynamic <span className="text-primary font-bold">Bio-Nexus</span>. Health isn't a state; it's a high-frequency frequency that must be tuned.
              </p>
              <p>
                Our collective is a high-performance network of visionaries committed to refining the biological experience through precision protocols and neural strands that bridge the gap between human and peak.
              </p>
            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-5">
            <div className="p-12 border border-white/10 bg-surface-dark relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
              <div className="absolute -top-4 -left-4 size-12 border-t border-l border-primary/20"></div>
              <div className="absolute -bottom-4 -right-4 size-12 border-b border-r border-primary/20"></div>
              
              <h4 className="font-display text-2xl font-bold mb-8 flex items-center gap-4 uppercase tracking-tighter">
                <span className="text-primary font-black text-4xl">01.</span> Vitality Strands
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
  <a className="flex items-center justify-between p-6 bg-white/5 border border-white/10 hover:border-primary transition-all group/link" href="#">
    <div className="flex items-center gap-4">
      <span className="material-symbols-outlined text-3xl text-slate-500 group-hover/link:text-primary transition-colors">{icon}</span>
      <div>
        <p className="text-sm font-black uppercase tracking-widest">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
    <span className="material-symbols-outlined group-hover/link:translate-x-1 transition-transform opacity-0 group-hover/link:opacity-100 text-primary">arrow_forward</span>
  </a>
);

export default Philosophy;
