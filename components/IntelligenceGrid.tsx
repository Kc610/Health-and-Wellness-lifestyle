
import React, { useState, useEffect } from 'react';
import { generateOptimizationLogs, NeuralLinkError } from '../services/gemini';
import { OptimizationLog } from '../types';
import { sounds } from '../services/ui-sounds';

const IntelligenceGrid: React.FC = () => {
  const [logs, setLogs] = useState<OptimizationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateOptimizationLogs();
      if (data && data.length > 0) {
        setLogs(data);
      }
    } catch (err) {
      if (err instanceof NeuralLinkError) {
        setError(err.message);
      } else {
        setError("Fatal Vitality Error. Pulse unit unresponsive.");
      }
      sounds.playBlip();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <section className="py-32 bg-surface-dark relative overflow-hidden border-y border-white/5">
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <span className="h-px w-10 bg-primary"></span>
               <p className="text-primary uppercase text-[10px] font-black tracking-[0.5em]">Collective Network Stream</p>
            </div>
            <h3 className="font-display text-6xl font-black mb-4 uppercase tracking-tighter">Vitality <span className="text-primary italic">Output</span></h3>
            <p className="text-slate-500 uppercase text-[11px] font-bold tracking-[0.4em]">Sub-millisecond biological telemetry from the global collective</p>
          </div>
          <button 
            onClick={() => { sounds.playClick(); fetchLogs(); }}
            disabled={isLoading}
            className={`px-8 py-4 border font-black text-[10px] tracking-widest uppercase flex items-center gap-3 transition-all ${error ? 'border-safety-orange text-safety-orange hover:bg-safety-orange hover:text-black' : 'border-primary/30 text-primary hover:bg-primary hover:text-black'} disabled:opacity-30 backdrop-blur-md`}
          >
            {isLoading ? 'SYNCING...' : error ? 'RE-INITIALIZE' : 'REFRESH FEED'} 
            <span className={`material-symbols-outlined text-lg ${isLoading ? 'animate-spin' : ''}`}>
              {error ? 'error' : 'sync_alt'}
            </span>
          </button>
        </div>

        {error ? (
          <div className="border border-safety-orange/20 bg-safety-orange/5 p-20 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,140,0,0.1)_0%,transparent_70%)]"></div>
            <span className="material-symbols-outlined text-safety-orange text-8xl mb-8 relative z-10">heart_broken</span>
            <h4 className="font-display text-3xl font-bold text-white uppercase mb-6 relative z-10">Neural Node Severed</h4>
            <p className="text-safety-orange/70 font-mono text-xs uppercase tracking-[0.3em] mb-12 max-w-lg mx-auto relative z-10">
              {error}. The vitality collective remains operational, but your local link has high latency.
            </p>
            <button 
              onClick={() => { sounds.playInject(); fetchLogs(); }}
              className="px-16 py-6 bg-safety-orange text-black font-black text-xs uppercase tracking-[0.4em] hover:bg-white transition-all shadow-2xl relative z-10"
            >
              Re-Establish Pulse Link
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-[3/4.5] bg-black/40 border border-white/10 animate-pulse flex flex-col justify-end p-10 gap-6">
                  <div className="h-4 bg-white/5 w-1/3"></div>
                  <div className="h-10 bg-white/5 w-full"></div>
                  <div className="h-6 bg-white/5 w-1/2"></div>
                </div>
              ))
            ) : (
              logs.map((log, i) => (
                <LogCard key={log.id || i} log={log} index={i} />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const LogCard: React.FC<{ log: OptimizationLog; index: number }> = ({ log, index }) => {
  // Hotlink high-fidelity images based on category or index
  const imageSources = [
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=800"
  ];
  const imageUrl = imageSources[index % imageSources.length];

  return (
    <div 
      className="group relative aspect-[3/4.5] overflow-hidden bg-black border border-white/10 hover:border-primary/50 transition-all duration-700 hover:-translate-y-3 shadow-2xl animate-fade-in-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <img 
        alt="Biological Visualization" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-50 group-hover:scale-110 transition-all duration-1000" 
        src={imageUrl}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      
      <div className="absolute top-6 left-6">
        <div className="flex items-center gap-2">
           <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
           <span className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
             Node: {log.nodeType || 'ALPHA'}
           </span>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 right-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-[10px] font-black uppercase text-primary mb-3 tracking-[0.3em]">{log.category}</p>
        <h5 className="text-4xl font-display font-bold mb-6 tracking-tighter text-white group-hover:text-primary transition-colors">
          {log.value} <span className="block text-[11px] font-normal text-slate-500 uppercase tracking-[0.2em] mt-2 italic">{log.metric}</span>
        </h5>
        
        <div className="flex items-center gap-4 border-t border-white/10 pt-6">
          <div className="size-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
             <span className="material-symbols-outlined text-lg text-primary">dynamic_feed</span>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-100 uppercase">{log.user}</p>
            <p className="text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">{log.location}</p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default IntelligenceGrid;
