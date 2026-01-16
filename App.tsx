
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import IntelTicker from './components/IntelTicker';
import BiometricScanner from './components/BiometricScanner';
import Philosophy from './components/Philosophy';
import IntelligenceGrid from './components/IntelligenceGrid';
import ProtocolStore from './components/ProtocolStore';
import OptimizationAssistant from './components/OptimizationAssistant';
import LiveCoach from './components/LiveCoach';
import Footer from './components/Footer';
import { sounds } from './services/ui-sounds';

const App: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleStart = () => {
    sounds.playInject();
    setIsInitialized(true);
    setIsCoachOpen(true);
  };

  const toggleAssistant = () => {
    sounds.playBlip();
    setIsAssistantOpen(!isAssistantOpen);
  };

  const toggleCoach = () => {
    sounds.playBlip();
    setIsCoachOpen(!isCoachOpen);
  };

  return (
    <div className="relative min-h-screen">
      {!isInitialized && (
        <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center p-8">
          <div className="max-w-md w-full text-center space-y-12">
            <div className="flex justify-center mb-8">
              <div className="size-24 border-2 border-primary animate-spin rounded-full flex items-center justify-center">
                <div className="size-16 border-2 border-primary/30 animate-reverse-spin rounded-full"></div>
              </div>
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tighter text-white">
              Initialize <span className="text-primary italic">Hello Healthy</span>
            </h2>
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.4em]">
              Bypassing neural encryption... system check optimal.
            </p>
            <button 
              onClick={handleStart}
              className="w-full bg-primary text-black py-6 font-black text-sm tracking-[0.3em] uppercase hover:bg-white transition-all transform active:scale-95"
            >
              Enter Node
            </button>
          </div>
          <style>{`
            @keyframes reverse-spin {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }
            .animate-reverse-spin {
              animation: reverse-spin 3s linear infinite;
            }
          `}</style>
        </div>
      )}

      <div className="grainy-overlay fixed inset-0 z-[60]"></div>
      
      <Header 
        onOpenAssistant={toggleAssistant} 
        onOpenCoach={toggleCoach}
      />
      <IntelTicker />
      
      <main className="pt-28">
        <Hero />
        <BiometricScanner />
        <Philosophy />
        <IntelligenceGrid />
        <ProtocolStore />
        
        <section className="py-24 border-y border-white/5">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="bg-black p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
              
              <div className="max-w-xl relative z-10">
                <h4 className="font-display text-4xl font-black mb-6 uppercase tracking-tighter">Begin Your Protocol</h4>
                <p className="text-slate-400 mb-8 font-light text-lg">The world's most advanced biological optimization toolkit. Engineered for those who refuse to settle.</p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => sounds.playClick()}
                    className="bg-white text-black px-8 py-4 font-black text-xs tracking-widest uppercase hover:bg-primary transition-colors"
                  >
                    Secure Membership
                  </button>
                  <button 
                    onClick={() => sounds.playClick()}
                    className="border border-white/20 px-8 py-4 font-black text-xs tracking-widest uppercase hover:bg-white/5 transition-colors"
                  >
                    Access Intel Node
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                {[
                  { label: "Active Nodes", value: "12K+" },
                  { label: "Success Rate", value: "84%" },
                  { label: "Peer Reviewed", value: "100%" },
                  { label: "Neural Sync", value: "24/7" }
                ].map((stat, i) => (
                  <div key={i} className="p-8 bg-surface-dark border border-white/5 text-center group hover:border-primary/50 transition-colors">
                    <p className="text-4xl font-display font-bold text-primary mb-1">{stat.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating Action Button for AI Assistant */}
      <button 
        onClick={toggleAssistant}
        className="fixed bottom-8 right-8 z-[70] group"
      >
        <div className="absolute inset-0 bg-primary blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
        <div className="relative size-16 bg-primary text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95">
          <span className="material-symbols-outlined text-3xl font-bold">terminal</span>
        </div>
        <div className="absolute -top-12 right-0 bg-surface-dark border border-primary/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          Sync Neural Agent
        </div>
      </button>

      {isAssistantOpen && (
        <OptimizationAssistant onClose={() => setIsAssistantOpen(false)} />
      )}

      {isCoachOpen && (
        <LiveCoach onClose={() => setIsCoachOpen(false)} />
      )}
    </div>
  );
};

export default App;
