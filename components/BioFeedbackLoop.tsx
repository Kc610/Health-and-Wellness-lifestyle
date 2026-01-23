
import React, { useState, useEffect } from 'react';
import { sounds } from '../services/ui-sounds';

const BioFeedbackLoop: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [activeMetric, setActiveMetric] = useState(0);

  const metrics = [
    { label: 'Neural Latency', unit: 'ms', target: '12.4' },
    { label: 'Metabolic Flux', unit: 'u/s', target: '0.88' },
    { label: 'Cellular ATP', unit: 'pct', target: '99.7' },
    { label: 'V02 Max Flow', unit: 'ml/kg', target: '84.2' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(prev => {
        const next = [...prev, 30 + Math.random() * 60];
        if (next.length > 60) next.shift();
        return next;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 bg-black border-b border-white/5 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4">
            <p className="text-primary font-bold tracking-[0.4em] uppercase mb-4 text-[10px]">Real-Time Monitoring</p>
            <h3 className="font-display text-5xl font-bold mb-8 uppercase tracking-tighter leading-none">Bio-Feedback <br/><span className="text-primary italic">Circuitry</span></h3>
            <p className="text-slate-500 text-sm font-light leading-relaxed mb-12 uppercase tracking-[0.2em]">
              High-frequency biological telemetry. Monitor cellular throughput and neural resonance across your local nexus.
            </p>
            
            <div className="space-y-4">
              {metrics.map((m, i) => (
                <button 
                  key={m.label}
                  onClick={() => { sounds.playClick(); setActiveMetric(i); }}
                  className={`w-full p-6 border transition-all text-left flex justify-between items-center group relative overflow-hidden ${activeMetric === i ? 'bg-primary border-primary text-black shadow-[0_0_30px_rgba(0,255,127,0.2)]' : 'border-white/10 bg-white/5 text-slate-400 hover:border-primary/40'}`}
                >
                  <div className="relative z-10">
                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${activeMetric === i ? 'text-black/60' : 'text-primary/60'}`}>{m.label}</p>
                    <p className="text-2xl font-display font-bold uppercase tracking-tighter">{m.target} <span className="text-xs font-mono">{m.unit}</span></p>
                  </div>
                  <span className={`material-symbols-outlined transition-transform duration-500 relative z-10 ${activeMetric === i ? 'rotate-180 scale-125' : 'group-hover:translate-x-2'}`}>
                    insights
                  </span>
                  {activeMetric === i && (
                    <div className="absolute inset-0 bg-white/10 animate-shimmer pointer-events-none"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-surface-dark border border-white/10 p-1 relative group perspective-1000">
             <div className="bg-black/90 p-10 md:p-14 relative overflow-hidden preserve-3d transition-transform duration-700 group-hover:rotate-y-1">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/20"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20"></div>
                <div className="absolute top-4 left-4 size-2 bg-primary rounded-full animate-ping"></div>
                
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-1">
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-3">
                       <span className="size-2 bg-primary rounded-full"></span>
                       LINKED FEED // NODE-G7
                    </p>
                    <p className="text-white/30 text-[9px] font-mono uppercase tracking-[0.3em]">Encrypted Pulse // Frequency: 440Hz</p>
                  </div>
                  <div className="flex items-center gap-6 px-4 py-2 bg-white/5 border border-white/10">
                     <div className="text-right">
                        <p className="text-[8px] font-black text-slate-500 uppercase">Latency</p>
                        <p className="text-xs font-mono text-primary font-bold">0.02ms</p>
                     </div>
                     <span className="material-symbols-outlined text-primary text-xl">settings_input_antenna</span>
                  </div>
                </div>

                {/* The Chart */}
                <div className="h-[350px] flex items-end gap-[3px] group/chart">
                  {dataPoints.map((p, i) => (
                    <div 
                      key={i}
                      className="flex-1 bg-primary/20 hover:bg-primary transition-all duration-300 relative group/bar"
                      style={{ 
                        height: `${p}%`,
                        opacity: 0.2 + (i / dataPoints.length) * 0.8
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-mono text-primary font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-1 py-0.5 border border-primary/20">
                        VAL: {Math.floor(p)}
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-primary shadow-[0_0_10px_#00FF7F]"></div>
                    </div>
                  ))}
                </div>

                <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-10 pt-10 border-t border-white/10 bg-white/5 p-6">
                   {[
                     { l: 'Synapse', v: '9.4' },
                     { l: 'Resilience', v: '8.1' },
                     { l: 'Flow', v: '9.8' },
                     { l: 'Sync', v: 'A+' }
                   ].map(stat => (
                     <div key={stat.l} className="group/stat">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 group-hover/stat:text-primary transition-colors">{stat.l} Index</p>
                        <p className="text-2xl font-display font-bold text-white tracking-tighter transition-transform group-hover/stat:scale-110 origin-left">{stat.v} <span className="text-[10px] opacity-30 font-mono">NODE</span></p>
                     </div>
                   ))}
                </div>
             </div>
             
             {/* HUD Corners */}
             <div className="absolute -top-4 -left-4 size-10 border-t-2 border-l-2 border-primary/20 group-hover:border-primary transition-colors"></div>
             <div className="absolute -bottom-4 -right-4 size-10 border-b-2 border-r-2 border-primary/20 group-hover:border-primary transition-colors"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BioFeedbackLoop;
