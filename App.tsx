
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import IntelTicker from './components/IntelTicker';
import BiometricScanner from './components/BiometricScanner';
import BioFeedbackLoop from './components/BioFeedbackLoop';
import Philosophy from './components/Philosophy';
import IntelligenceGrid from './components/IntelligenceGrid';
import ProtocolStore from './components/ProtocolStore';
import ProductDetail from './components/ProductDetail';
import OptimizationAssistant from './components/OptimizationAssistant';
import LiveCoach from './components/LiveCoach';
import ProfileModal from './components/ProfileModal';
import VideoAnalyzer from './components/VideoAnalyzer';
import Footer from './components/Footer';
import { sounds } from './services/ui-sounds';
import { loadingTracker } from './services/loading';
import { speakProtocol } from './services/gemini';
import { UserProfile } from './types';

const INITIAL_PROFILE: UserProfile = {
  age: '',
  weight: '',
  height: '',
  activityLevel: 'moderate',
  goals: ''
};

const CALIBRATION_STEPS = [
  "Initializing Neural Link...",
  "Calibrating Biometric Hub...",
  "Syncing DNA Helix v4.0...",
  "Verifying Collective Clearance...",
  "Pulse State: Optimal."
];

const MainLayout: React.FC<{ 
  toggleAssistant: () => void; 
  toggleCoach: () => void;
  openProfile: () => void;
  openVideo: () => void;
}> = ({ toggleAssistant, toggleCoach, openProfile, openVideo }) => {
  return (
    <>
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
              <h4 className="font-display text-4xl font-black mb-6 uppercase tracking-tighter text-white">Initialize Your Helix</h4>
              <p className="text-neutral-400 mb-8 font-light text-lg">The world's most advanced biological optimization toolkit. Engineered for those who refuse to settle for the standard human baseline.</p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => sounds.playClick()}
                  className="bg-white text-black px-8 py-4 font-black text-xs tracking-widest uppercase hover:bg-primary transition-colors shadow-xl"
                >
                  Secure Helix Access
                </button>
                <button 
                  onClick={() => sounds.playClick()}
                  className="border border-white/20 px-8 py-4 font-black text-xs tracking-widest uppercase hover:bg-white/5 transition-colors text-white"
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
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const App: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [calibrationIdx, setCalibrationIdx] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(true);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bio_baseline');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  useEffect(() => {
    if (!isInitialized) {
      const interval = setInterval(() => {
        setCalibrationIdx(prev => {
          if (prev >= CALIBRATION_STEPS.length - 1) {
            clearInterval(interval);
            setIsCalibrating(false);
            return prev;
          }
          sounds.playBlip();
          return prev + 1;
        });
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isInitialized]);

  useEffect(() => {
    return loadingTracker.subscribe((loading) => {
      setIsGlobalLoading(loading);
    });
  }, []);

  const handleStart = async () => {
    sounds.playInject();
    setIsInitialized(true);
    // Voice Greeting
    try {
      const welcomeText = userProfile.goals 
        ? `Welcome back to the Collective. Neural link optimized for your ${userProfile.goals} protocols.`
        : "Neural link established. Welcome to Hello Healthy. Baseline profile pending.";
      const audio = await speakProtocol(welcomeText);
      if (audio) {
        audio.source.start(0);
      }
    } catch (e) {
      console.warn("Voice greeting failed");
    }
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
    <HashRouter>
      <div className="relative min-h-screen">
        {/* Global Neural Link Loader */}
        <div className={`fixed top-0 left-0 w-full h-[2px] z-[1000] overflow-hidden pointer-events-none transition-opacity duration-300 ${isGlobalLoading ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-primary/20"></div>
          <div className="absolute inset-0 bg-primary shadow-[0_0_10px_#00FF7F] animate-shimmer"></div>
        </div>

        {!isInitialized && (
          <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Visual Depth for Opening */}
            <div className="absolute inset-0 opacity-10">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#00FF7F22_0%,_transparent_70%)] animate-pulse-slow"></div>
               <div className="scanlines absolute inset-0"></div>
            </div>

            <div className="max-w-xl w-full text-center space-y-16 relative z-10">
              <div className="relative size-48 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping-slow"></div>
                <div className="absolute inset-4 border border-primary/40 rounded-full animate-[spin_10s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 size-3 bg-primary rounded-full shadow-[0_0_15px_#00FF7F]"></div>
                </div>
                <div className="absolute inset-8 border-2 border-primary animate-pulse-slow rounded-full flex items-center justify-center bg-black/50 backdrop-blur-xl">
                  <span className="material-symbols-outlined text-primary text-6xl">sensors</span>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="font-display text-5xl font-black uppercase tracking-tighter text-white">
                  Initialize <span className="text-primary italic">Pulse Sync</span>
                </h2>
                <div className="h-20 flex flex-col items-center justify-center gap-2">
                   <p className="font-mono text-[11px] text-primary uppercase tracking-[0.5em] animate-pulse">
                      {CALIBRATION_STEPS[calibrationIdx]}
                   </p>
                   <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_#00FF7F]" 
                        style={{ width: `${((calibrationIdx + 1) / CALIBRATION_STEPS.length) * 100}%` }}
                      ></div>
                   </div>
                </div>
              </div>

              <button 
                onClick={handleStart}
                disabled={isCalibrating}
                className={`w-full py-8 font-black text-sm tracking-[0.4em] uppercase transition-all transform active:scale-95 shadow-[0_0_50px_rgba(0,255,127,0.1)] border-2 ${isCalibrating ? 'border-white/5 text-neutral-800' : 'bg-primary border-primary text-black hover:bg-white hover:border-white shadow-[0_0_30px_rgba(0,255,127,0.3)]'}`}
              >
                {isCalibrating ? 'Calibrating Hardware...' : 'Engage Neural Link'}
              </button>
              
              <div className="flex justify-center gap-8 opacity-40">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-mono text-white tracking-widest uppercase">Biometrics OK</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></span>
                  <span className="text-[9px] font-mono text-white tracking-widest uppercase">Grid Linked</span>
                </div>
              </div>
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
          <Routes>
            <Route path="/" element={
              <MainLayout 
                toggleAssistant={toggleAssistant}
                toggleCoach={toggleCoach}
                openProfile={() => { sounds.playBlip(); setIsProfileOpen(true); }}
                openVideo={() => { sounds.playBlip(); setIsVideoOpen(true); }}
              />
            } />
            <Route path="/protocol/:handle" element={<ProductDetail />} />
          </Routes>
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
          <div className="absolute -top-12 right-0 bg-neutral-900 border border-primary/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all pointer-events-none text-white">
            Synchronize Agent
          </div>
        </button>

        {isAssistantOpen && <OptimizationAssistant onClose={() => setIsAssistantOpen(false)} />}
        {isCoachOpen && <LiveCoach profile={userProfile} onClose={() => setIsCoachOpen(false)} />}
        {isProfileOpen && <ProfileModal profile={userProfile} onSave={handleSaveProfile} onClose={() => setIsProfileOpen(false)} />}
        {isVideoOpen && <VideoAnalyzer onClose={() => setIsVideoOpen(false)} />}
      </div>
    </HashRouter>
  );
};

export default App;
