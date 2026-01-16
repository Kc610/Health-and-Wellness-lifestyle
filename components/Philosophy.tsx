
import React from 'react';

const Philosophy: React.FC = () => {
  return (
    <section className="py-32 bg-black overflow-hidden relative">
      <div className="absolute -left-20 top-0 text-[18rem] font-black manifesto-stroke whitespace-nowrap opacity-5 leading-none select-none pointer-events-none">
        EVOLVE NOW
      </div>
      
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-12 gap-12 items-center">
          <div className="col-span-12 lg:col-span-7">
            <p className="text-primary font-bold tracking-[0.3em] uppercase mb-6 text-sm flex items-center gap-4">
              <span className="w-8 h-px bg-primary"></span>
              The Core Thesis
            </p>
            <h3 className="font-display text-5xl md:text-7xl font-bold mb-12 leading-tight uppercase tracking-tighter">
              Performance <br/>Without Limits.
            </h3>
            <div className="space-y-8 text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
              <p>
                At <span className="text-white font-bold">Hello Healthy</span>, we reject the standard baseline of human health. We treat the biological system as 
                <span className="text-white font-bold"> hardware</span> that can be audited, patched, and optimized for peak output.
              </p>
              <p>
                Our collective is a high-performance network of athletes, bio-engineers, and visionaries committed to pushing the boundaries of what is biologically possible through data-driven protocols.
              </p>
            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-5">
            <div className="p-12 border border-white/10 bg-surface-dark relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -top-4 -left-4 size-8 border-t border-l border-primary"></div>
              <div className="absolute -bottom-4 -right-4 size-8 border-b border-r border-primary"></div>
              
              <h4 className="font-display text-2xl font-bold mb-8 flex items-center gap-4 uppercase tracking-tighter">
                <span className="text-primary font-black text-4xl">01.</span> Neural Nodes
              </h4>
              
              <div className="space-y-6">
                <NodeLink 
                  icon="hub" 
                  title="Healthy Sync" 
                  description="Real-time protocol coordination" 
                />
                <NodeLink 
                  icon="send" 
                  title="Intel Stream" 
                  description="Encrypted biological patches" 
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
    <span className="material-symbols-outlined group-hover/link:translate-x-1 transition-transform opacity-0 group-hover/link:opacity-100">arrow_forward</span>
  </a>
);

export default Philosophy;
