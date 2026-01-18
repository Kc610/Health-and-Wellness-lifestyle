
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
    <section className="py-32 bg-black border-b border-white/5 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4">
            <h3 className="font-display text-4xl font-bold mb-6 uppercase tracking-tighter">Bio-Feedback <br/><span className="text-primary italic">Loop</span></h3>
            <p className="text-slate-500 text-sm font-light leading-relaxed mb-12 uppercase tracking-widest">
              Direct telemetry from the Hello Healthy Vitality Helix. Monitor your biological trajectory in high-fidelity.
            </p>
            
            <div className="space-y-4">
              {metrics.map((m, i) => (
                <button 
                  key={m.label}
                  onClick={() => { sounds.playClick(); setActiveMetric(i); }}
                  className={`w-full p-6 border transition-all text-left flex justify-between items-center group ${activeMetric === i ? 'bg-primary border-primary text-black' : 'border-white/10 bg-white/5 text-slate-400 hover:border-primary/50'}`}
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">{m.label}</p>
                    <p className="text-xl font-display font-bold uppercase">{m.target} <span className="text-xs font-mono">{m.unit}</span></p>
                  </div>
                  <span className={`material-symbols-outlined transition-transform ${activeMetric === i ? 'rotate-90' : 'group-hover:translate-x-1'}`}>
                    pulse
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-surface-dark border border-white/10 p-1 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYm8bpVMp3zgh88IMXrNDT78VKt-lQW01NBjX1WYsX3jVxzqHbxAlE4F9TRQxZ0vmq2NJxA16JrV9pHRqEycVlhvKYjmX4vq-KVXbrh9BosPqeXaKZ7z33vVQxX4TvJIdf1K4GlubGFYrPDRZ_ahItV7l3oTbULxr-VUO_MlXEMwJ0bbLNVpWzo_dduyZfR-RKtyS2GRatvb2ZwTWgtOJVzqZTlTpzGo_JG0vyS3v6DxK_D_XTEaaNFlQqEU_hINIfQ-J4LJdzHr4')] bg-repeat opacity-90">
             <div className="bg-black/80 p-8 md:p-12 relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-2">Live Telemetry Feed // Cluster A-1</p>
                    <p className="text-white/40 text-[9px] font-mono uppercase tracking-widest italic">Encrypted Vitality Stream Active</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="size-2 rounded-full bg-primary animate-ping"></div>
                    <div className="size-2 rounded-full bg-primary/40"></div>
                  </div>
                </div>

                <div className="h-[300px] flex items-end gap-[2px]">
                  {dataPoints.map((p, i) => (
                    <div 
                      key={i}
                      className="flex-1 bg-primary/20 hover:bg-primary transition-colors duration-300 relative group"
                      style={{ height: `${p}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {Math.floor(p)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
                   {['Synapse', 'Resilience', 'Output', 'Stability'].map(tag => (
                     <div key={tag}>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">{tag} Index</p>
                        <p className="text-lg font-display font-bold text-white tracking-tighter">{(Math.random() * 10).toFixed(1)} <span className="text-[10px] opacity-40">SR</span></p>
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
