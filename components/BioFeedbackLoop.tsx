
import React, { useState, useEffect } from 'react';
import { sounds } from '../services/ui-sounds';

const BioFeedbackLoop: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [activeMetric, setActiveMetric] = useState(0);

  const metrics = [
    { label: 'Neural Latency', unit: 'ms', target: '12' },
    { label: 'Metabolic Flux', unit: 'u/s', target: '0.84' },
    { label: 'Cellular ATP', unit: 'pct', target: '99.2' },
    { label: 'V02 Max Sync', unit: 'ml/kg', target: '82.4' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(prev => {
        const next = [...prev, Math.random() * 100];
        if (next.length > 50) next.shift();
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-40 bg-background-dark border-b border-white/5 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-4">
            <h3 className="font-display text-5xl font-black mb-10 uppercase tracking-tighter text-white">Bio-Feedback <br/><span className="text-primary italic">Loop</span></h3>
            <p className="text-neutral-500 text-sm font-light leading-relaxed mb-16 uppercase tracking-[0.3em]">
              Direct telemetry from the Hello Healthy Vitality Helix. Monitor your biological trajectory in high-fidelity.
            </p>
            
            <div className="space-y-5">
              {metrics.map((m, i) => (
                <button 
                  key={m.label}
                  onClick={() => { sounds.playClick(); setActiveMetric(i); }}
                  className={`w-full p-8 border transition-all duration-300 text-left flex justify-between items-center group shadow-xl ${activeMetric === i ? 'bg-primary border-primary text-black' : 'border-white/10 bg-neutral-900/30 text-neutral-400 hover:border-primary/50'}`}
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 opacity-60">{m.label}</p>
                    <p className="text-2xl font-display font-bold uppercase">{m.target} <span className="text-[10px] font-mono tracking-normal">{m.unit}</span></p>
                  </div>
                  <span className={`material-symbols-outlined text-3xl transition-transform ${activeMetric === i ? 'rotate-90' : 'group-hover:translate-x-2'}`}>
                    pulse
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-neutral-900/20 border border-white/10 p-2 shadow-[0_0_100px_rgba(0,0,0,1)]">
             <div className="bg-background-dark/80 p-10 md:p-16 relative overflow-hidden border border-white/5">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] mb-2">Live Telemetry Feed // Cluster A-1</p>
                    <p className="text-neutral-600 text-[10px] font-mono uppercase tracking-[0.4em] italic">Encrypted Vitality Stream Active</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="size-2.5 rounded-full bg-primary animate-ping"></div>
                    <div className="size-2.5 rounded-full bg-primary/20"></div>
                  </div>
                </div>

                <div className="h-[350px] flex items-end gap-[3px]">
                  {dataPoints.map((p, i) => (
                    <div 
                      key={i}
                      className="flex-1 bg-primary/20 hover:bg-primary transition-all duration-500 relative group"
                      style={{ height: `${p}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {Math.floor(p)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-white/10">
                   {['Synapse', 'Resilience', 'Output', 'Stability'].map(tag => (
                     <div key={tag}>
                        <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-3">{tag} Index</p>
                        <p className="text-2xl font-display font-bold text-white tracking-tighter">{(Math.random() * 10).toFixed(1)} <span className="text-[10px] opacity-40">SR</span></p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BioFeedbackLoop;
