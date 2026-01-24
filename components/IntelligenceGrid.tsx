
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
    <section className="py-40 bg-surface-dark relative overflow-hidden">
      {/* Dynamic Background Shine */}
      <div className="absolute -top-40 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full opacity-30 pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
          <div>
            <h3 className="font-display text-5xl font-black mb-6 uppercase tracking-tighter text-white text-glow">Collective Vitality</h3>
            <p className="text-zinc-500 uppercase text-[11px] font-bold tracking-[0.5em]">Real-time optimization pulses from the network</p>
          </div>
          <button 
            onClick={() => { sounds.playClick(); fetchLogs(); }}
            disabled={isLoading}
            className={`text-xs font-black tracking-[0.3em] uppercase flex items-center gap-3 transition-all ${error ? 'text-safety-orange hover:text-white' : 'text-primary hover:opacity-80'} disabled:opacity-30 border border-white/5 bg-white/5 px-8 py-4 backdrop-blur-xl`}
          >
            {isLoading ? 'SYNCING PULSE...' : error ? 'RE-INITIALIZE SYNC' : 'REFRESH VITALITY FEED'} 
            <span className={`material-symbols-outlined text-xl ${isLoading ? 'animate-spin' : ''}`}>
              {error ? 'error' : 'refresh'}
            </span>
          </button>
        </div>

        {error ? (
          <div className="border border-safety-orange/40 bg-safety-orange/5 p-24 text-center animate-glitch-subtle backdrop-blur-2xl">
            <span className="material-symbols-outlined text-safety-orange text-8xl mb-8">heart_broken</span>
            <h4 className="font-display text-3xl font-black text-white uppercase mb-6">Pulse Link Interrupted</h4>
            <p className="text-safety-orange/80 font-mono text-sm uppercase tracking-[0.3em] mb-12 max-w-xl mx-auto">
              {error}
            </p>
            <button 
              onClick={() => { sounds.playInject(); fetchLogs(); }}
              className="px-16 py-6 bg-safety-orange text-black font-black text-xs uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(255,140,0,0.2)]"
            >
              Restart Vitality Probe
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-black/40 border border-white/5 animate-pulse flex flex-col justify-end p-10 gap-6">
                  <div className="h-4 bg-white/10 w-2/3 rounded"></div>
                  <div className="h-10 bg-white/10 w-full rounded"></div>
                  <div className="h-4 bg-white/10 w-1/2 rounded"></div>
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
          20% { transform: translate(-1.5px, 1.5px); }
          40% { transform: translate(-1.5px, -1.5px); }
          60% { transform: translate(1.5px, 1.5px); }
          80% { transform: translate(1.5px, -1.5px); }
          100% { transform: translate(0); }
        }
        .animate-glitch-subtle {
          animation: glitch-subtle 0.8s ease-in-out infinite alternate;
        }
      `}</style>
    </section>
  );
};

const LogCard: React.FC<{ log: OptimizationLog }> = ({ log }) => {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden bg-black border border-white/10 hover:border-primary/50 transition-all duration-700 hover:-translate-y-4 shadow-2xl">
      <img 
        alt="Biological visualization" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-50 group-hover:scale-110 transition-all duration-[1.5s]" 
        src={`https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800&seed=${log.id}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
      
      <div className="absolute top-6 left-6">
        <span className="px-4 py-1.5 bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
          PULSE: {log.nodeType}
        </span>
      </div>

      <div className="absolute bottom-10 left-10 right-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-[11px] font-black uppercase text-primary mb-3 tracking-[0.3em]">{log.category}</p>
        <h5 className="text-4xl font-display font-black mb-6 tracking-tighter text-white leading-none">
          {log.value} <span className="block text-[11px] font-normal text-zinc-500 uppercase tracking-[0.4em] mt-2">{log.metric}</span>
        </h5>
        
        <div className="flex items-center gap-4 border-t border-white/10 pt-6">
          <div className="size-10 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center group-hover:border-primary/50 transition-colors">
             <span className="material-symbols-outlined text-lg text-primary">biotech</span>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-white uppercase">{log.user}</p>
            <p className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase">{log.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceGrid;
