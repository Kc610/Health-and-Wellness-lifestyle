

import React, { useState, useRef, useEffect } from 'react';
import { analyzeBiometrics, NeuralLinkError } from '../services/gemini';
import { sounds } from '../services/ui-sounds';

const BiometricScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setHasPermission(false);
    }
  };

  const handleScan = async () => {
    sounds.playInject();
    setIsCapturing(true);
    setAnalysis(null);
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 400, 300);
        const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
        
        setIsScanning(true);
        try {
          const result = await analyzeBiometrics(base64);
          setAnalysis(result);
        } catch (e) {
          console.error(e);
        } finally {
          setIsScanning(false);
          sounds.playBlip();
        }
      }
    }
    setIsCapturing(false);
  };

  useEffect(() => {
    if (hasPermission) {
      startCamera();
    }
  }, [hasPermission]);

  return (
    <section className="py-32 bg-black border-y border-white/5 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1">
          <p className="text-primary font-bold tracking-[0.5em] uppercase mb-8 text-xs flex items-center gap-4">
            <span className="w-12 h-px bg-primary"></span>
            Biometric Baseline Audit
          </p>
          <h3 className="font-display text-6xl font-black mb-10 uppercase tracking-tighter leading-tight">
            Transcend Your <br/><span className="text-primary italic text-glow animate-pulse">Limitations.</span>
          </h3>
          <p className="text-slate-400 text-xl font-light leading-relaxed mb-12 max-w-lg">
            Connect your neural node to our vision core for a sub-cellular biological optimization audit. 
            Identify performance bottlenecks in your metabolic circuitry and neural flow.
          </p>

          {!hasPermission && (
            <button 
              onClick={() => { sounds.playClick(); setHasPermission(true); }}
              className="group relative bg-primary text-black px-12 py-6 font-black text-xs tracking-[0.4em] uppercase overflow-hidden hover:bg-white transition-all flex items-center gap-4 shadow-[0_0_30px_rgba(0,255,127,0.2)]"
            >
              <span className="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform duration-500">biotech</span>
              <span className="relative z-10">Link Optical Hardware</span>
              <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
            </button>
          )}

          {analysis && (
            <div className="p-10 border border-primary/20 bg-primary/5 font-mono animate-glitch relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-30">
                <span className="material-symbols-outlined text-4xl text-primary animate-pulse">verified</span>
              </div>
              <div className="grid grid-cols-2 gap-10 mb-10">
                <div>
                  <p className="text-[9px] text-primary/60 uppercase tracking-widest mb-2 font-black">Genetic Archetype</p>
                  <p className="text-2xl font-bold uppercase tracking-tight text-white">{analysis.geneticTier}</p>
                </div>
                <div>
                  <p className="text-[9px] text-primary/60 uppercase tracking-widest mb-2 font-black">Neural Latency</p>
                  <p className="text-2xl font-bold uppercase tracking-tight text-white">{analysis.neuralLatency}</p>
                </div>
                <div>
                  <p className="text-[9px] text-primary/60 uppercase tracking-widest mb-2 font-black">Metabolic Flow</p>
                  <p className="text-2xl font-bold uppercase tracking-tight text-white">{analysis.metabolicEfficiency}</p>
                </div>
                <div>
                  <p className="text-[9px] text-primary/60 uppercase tracking-widest mb-2 font-black">Link State</p>
                  <p className="text-2xl font-bold uppercase text-primary animate-pulse font-black">SYNCED</p>
                </div>
              </div>
              <div className="border-t border-primary/20 pt-8">
                 <p className="text-[9px] text-primary/50 uppercase tracking-[0.3em] mb-3 font-black">Protocol Recommendation:</p>
                 <p className="text-sm leading-relaxed italic text-slate-300">
                    "{analysis.protocolRecommendation}"
                 </p>
              </div>
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2 flex flex-col items-center">
          <div className="relative group w-full max-w-lg">
            {/* Visual Scan Area */}
            <div className="aspect-square relative rounded-full overflow-hidden border-[12px] border-white/5 shadow-2xl group-hover:border-primary/20 transition-all duration-700 bg-surface-dark">
              {!hasPermission ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 gap-6">
                  <span className="material-symbols-outlined text-9xl opacity-10">sensors_off</span>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">Awaiting Neural Link...</p>
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className={`w-full h-full object-cover scale-x-[-1] transition-all duration-700 ${isScanning ? 'blur-2xl scale-110 opacity-50' : ''}`}
                />
              )}
              
              {/* Scan Overlay HUD */}
              <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-0 left-0 w-full h-full bg-primary/10 transition-opacity duration-700 ${isScanning ? 'opacity-100' : 'opacity-0'}`}></div>
                
                {/* Scanner Line Animation */}
                {hasPermission && (
                   <div className="absolute top-0 left-0 w-full h-1/2 border-b-2 border-primary/40 bg-gradient-to-b from-primary/5 to-transparent animate-scan shadow-[0_5px_15px_rgba(0,255,127,0.4)]"></div>
                )}
                
                {/* HUD Elements */}
                <div className="absolute top-8 left-8 size-20 border-t-2 border-l-2 border-primary/30"></div>
                <div className="absolute top-8 right-8 size-20 border-t-2 border-r-2 border-primary/30"></div>
                <div className="absolute bottom-8 left-8 size-20 border-b-2 border-l-2 border-primary/30"></div>
                <div className="absolute bottom-8 right-8 size-20 border-b-2 border-r-2 border-primary/30"></div>

                <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="size-1.5 rounded-full bg-red-500 animate-ping"></div>
                    <div className="text-[8px] font-black text-red-500/80 uppercase tracking-[0.4em]">LIVE SYNC // NODE-07</div>
                  </div>
                </div>

                {/* Rotating Compass / Radar */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <div className="size-[80%] border border-dashed border-primary rounded-full animate-[spin_20s_linear_infinite]"></div>
                   <div className="size-[60%] border border-primary/40 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
                </div>
              </div>

              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md">
                  <div className="size-28 relative mb-6">
                    <div className="absolute inset-0 border-[6px] border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-4 border-[2px] border-primary/20 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="material-symbols-outlined text-primary text-4xl">database</span>
                    </div>
                  </div>
                  <p className="text-primary font-mono text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">De-Coding Genome...</p>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" width="400" height="300"></canvas>
            
            {hasPermission && !isScanning && (
              <button 
                onClick={handleScan}
                disabled={isCapturing}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white text-black size-32 rounded-full font-black text-[10px] flex flex-col items-center justify-center shadow-[0_20px_60px_rgba(0,255,127,0.3)] hover:scale-110 active:scale-90 transition-all group-hover:bg-primary group-hover:text-black z-20 uppercase tracking-[0.3em] border-[6px] border-black outline outline-2 outline-white/10"
              >
                <span className="material-symbols-outlined text-4xl mb-1">face_retouching_natural</span>
                Audit
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BiometricScanner;
