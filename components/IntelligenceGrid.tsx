
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
    <section className="py-32 bg-surface-dark relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h3 className="font-display text-4xl font-bold mb-4 uppercase tracking-tighter">Collective Vitality</h3>
            <p className="text-slate-500 uppercase text-[10px] font-bold tracking-[0.4em]">Real-time optimization pulses from the network</p>
          </div>
          <button 
            onClick={() => { sounds.playClick(); fetchLogs(); }}
            disabled={isLoading}
            className={`text-xs font-black tracking-widest uppercase flex items-center gap-2 transition-all ${error ? 'text-safety-orange hover:text-white' : 'text-primary hover:opacity-80'} disabled:opacity-30`}
          >
            {isLoading ? 'SYNCING PULSE...' : error ? 'RE-INITIALIZE SYNC' : 'REFRESH VITALITY FEED'} 
            <span className={`material-symbols-outlined text-lg ${isLoading ? 'animate-spin' : ''}`}>
              {error ? 'error' : 'refresh'}
            </span>
          </button>
        </div>

        {error ? (
          <div className="border border-safety-orange/30 bg-safety-orange/5 p-16 text-center animate-glitch-subtle">
            <span className="material-symbols-outlined text-safety-orange text-6xl mb-6">heart_broken</span>
            <h4 className="font-display text-2xl font-bold text-white uppercase mb-4">Pulse Link Interrupted</h4>
            <p className="text-safety-orange/70 font-mono text-xs uppercase tracking-[0.2em] mb-10 max-w-md mx-auto">
              {error}
            </p>
            <button 
              onClick={() => { sounds.playInject(); fetchLogs(); }}
              className="px-12 py-4 bg-safety-orange text-black font-black text-xs uppercase tracking-widest hover:bg-white transition-colors shadow-2xl"
            >
              Restart Vitality Probe
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-black border border-white/5 animate-pulse flex flex-col justify-end p-8 gap-4">
                  <div className="h-4 bg-white/10 w-2/3"></div>
                  <div className="h-8 bg-white/10 w-full"></div>
                  <div className="h-4 bg-white/10 w-1/2"></div>
                </div>
              ))
            ) : (
              logs.map((log, i) => (
                <LogCard key={log.id || i} log={log} />
              ))
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes glitch-subtle {
          0% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(-1px, -1px); }
          60% { transform: translate(1px, 1px); }
          80% { transform: translate(1px, -1px); }
          100% { transform: translate(0); }
        }
        .animate-glitch-subtle {
          animation: glitch-subtle 0.5s ease-in-out infinite alternate;
        }
      `}</style>
    </section>
  );
};

const LogCard: React.FC<{ log: OptimizationLog }> = ({ log }) => {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden bg-black border border-white/5 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2">
      <img 
        alt="Biological visualization" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000" 
        src={`https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800&seed=${log.id}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-primary text-black text-[9px] font-black uppercase tracking-wider shadow-lg">
          PULSE: {log.nodeType}
        </span>
      </div>

      <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform">
        <p className="text-[10px] font-black uppercase text-primary mb-2 tracking-[0.2em]">{log.category}</p>
        <h5 className="text-3xl font-display font-bold mb-4 tracking-tighter text-white">
          {log.value} <span className="block text-[10px] font-normal text-slate-400 uppercase tracking-widest mt-1">{log.metric}</span>
        </h5>
        
        <div className="flex items-center gap-3 border-t border-white/10 pt-4">
          <div className="size-8 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center">
             <span className="material-symbols-outlined text-sm text-primary">biotech</span>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-100 uppercase">{log.user}</p>
            <p className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">{log.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceGrid;
