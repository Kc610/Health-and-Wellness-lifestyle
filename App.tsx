
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import IntelTicker from './components/IntelTicker';
import BiometricScanner from './components/BiometricScanner';
import BioFeedbackLoop from './components/BioFeedbackLoop';
import Philosophy from './components/Philosophy';
import IntelligenceGrid from './components/IntelligenceGrid';
import ProtocolStore from './components/ProtocolStore';
import OptimizationAssistant from './components/OptimizationAssistant';
import LiveCoach from './components/LiveCoach';
import ProfileModal from './components/ProfileModal';
import VideoAnalyzer from './components/VideoAnalyzer';
import Footer from './components/Footer';
import { sounds } from './services/ui-sounds';
import { loadingTracker } from './services/loading';
import { UserProfile } from './types';

const INITIAL_PROFILE: UserProfile = {
  age: '',
  weight: '',
  height: '',
  activityLevel: 'moderate',
  goals: ''
};

const App: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bio_baseline');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  useEffect(() => {
    return loadingTracker.subscribe((loading) => {
      setIsGlobalLoading(loading);
    });
  }, []);

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

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('bio_baseline', JSON.stringify(profile));
  };

  return (
    <div className="relative min-h-screen">
      {/* Global Neural Link Loader */}
      <div className={`fixed top-0 left-0 w-full h-[2px] z-[1000] overflow-hidden pointer-events-none transition-opacity duration-300 ${isGlobalLoading ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-primary/20"></div>
        <div className="absolute inset-0 bg-primary shadow-[0_0_10px_#00FF7F] animate-shimmer"></div>
      </div>

      {!isInitialized && (
        <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center p-8">
          <div className="max-w-md w-full text-center space-y-12">
            <div className="relative size-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-2 border-primary animate-pulse-slow rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-5xl">favorite</span>
              </div>
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tighter text-white">
              Initialize <span className="text-primary italic">Pulse Sync</span>
            </h2>
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.4em]">
              Stabilizing vitality markers... link state optimal.
            </p>
            <button 
              onClick={handleStart}
              className="w-full bg-primary text-black py-6 font-black text-sm tracking-[0.3em] uppercase hover:bg-white transition-all transform active:scale-95 shadow-[0_0_30px_rgba(0,255,127,0.2)]"
            >
              Sync Pulse
            </button>
          </div>
        </div>
      )}

      <div className="grainy-overlay fixed inset-0 z-[60]"></div>
      
      <Header 
        onOpenAssistant={toggleAssistant} 
        onOpenCoach={toggleCoach}
        onOpenProfile={() => { sounds.playBlip(); setIsProfileOpen(true); }}
        onOpenVideo={() => { sounds.playBlip(); setIsVideoOpen(true); }}
      />
      <IntelTicker />
      
      <main className="pt-28">
        <Hero />
        <BiometricScanner />
        <BioFeedbackLoop />
        <Philosophy />
        <IntelligenceGrid />
        <ProtocolStore />
        
        <section className="py-24 border-y border-white/5 bg-gradient-to-b from-transparent to-primary/5">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="bg-surface-dark border border-white/10 p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
              
              <div className="max-w-xl relative z-10">
                <h4 className="font-display text-4xl font-black mb-6 uppercase tracking-tighter">Initialize Your Helix</h4>
                <p className="text-slate-400 mb-8 font-light text-lg">The world's most advanced biological optimization toolkit. Engineered for those who refuse to settle for the standard human baseline.</p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => sounds.playClick()}
                    className="bg-white text-black px-8 py-4 font-black text-xs tracking-widest uppercase hover:bg-primary transition-colors shadow-xl"
                  >
                    Secure Helix Access
                  </button>
                  <button 
                    onClick={() => sounds.playClick()}
                    className="border border-white/20 px-8 py-4 font-black text-xs tracking-widest uppercase hover:bg-white/5 transition-colors"
                  >
                    Browse Vitality Feed
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                {[
                  { label: "Active Pulses", value: "12K+" },
                  { label: "Sync Rate", value: "98.4%" },
                  { label: "Bio-Verified", value: "100%" },
                  { label: "Latency", value: "0.2ms" }
                ].map((stat, i) => (
                  <div key={i} className="p-8 bg-black/40 border border-white/5 text-center group hover:border-primary/50 transition-all hover:-translate-y-1">
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
        <div className="absolute inset-0 bg-primary blur-2xl opacity-10 group-hover:opacity-30 transition-opacity rounded-full"></div>
        <div className="relative size-16 bg-primary text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group-hover:rotate-12">
          <span className="material-symbols-outlined text-3xl font-bold">query_stats</span>
        </div>
        <div className="absolute -top-12 right-0 bg-surface-dark border border-primary/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all pointer-events-none">
          Synchronize Agent
        </div>
      </button>

      {isAssistantOpen && <OptimizationAssistant onClose={() => setIsAssistantOpen(false)} />}
      {isCoachOpen && <LiveCoach profile={userProfile} onClose={() => setIsCoachOpen(false)} />}
      {isProfileOpen && <ProfileModal profile={userProfile} onSave={handleSaveProfile} onClose={() => setIsProfileOpen(false)} />}
      {isVideoOpen && <VideoAnalyzer onClose={() => setIsVideoOpen(false)} />}
    </div>
  );
};

export default App;
