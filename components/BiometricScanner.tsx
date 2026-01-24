
import React, { useState, useRef, useEffect } from 'react';
import { analyzeBiometrics } from '../services/gemini';
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
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 400, 300);
        const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
        
        setIsScanning(true);
        const result = await analyzeBiometrics(base64);
        setAnalysis(result);
        setIsScanning(false);
        sounds.playBlip();
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
    <section className="py-32 bg-background-dark border-y border-white/5 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <p className="text-primary font-bold tracking-[0.5em] uppercase mb-8 text-xs flex items-center gap-6">
            <span className="w-12 h-px bg-primary"></span>
            Biometric Audit
          </p>
          <h3 className="font-display text-5xl md:text-7xl font-black mb-10 uppercase tracking-tighter leading-tight text-white">
            Audit Your <br/><span className="text-primary italic">Genetic Hardware.</span>
          </h3>
          <p className="text-neutral-400 text-lg font-light leading-relaxed mb-12 max-w-lg">
            Connect your neural node to our vision core for a real-time biological optimization audit. 
            Identify bottlenecks in your metabolic and neural circuitry.
          </p>

          {!hasPermission && (
            <button 
              onClick={() => { sounds.playClick(); setHasPermission(true); }}
              className="bg-primary text-black px-12 py-6 font-black text-xs tracking-[0.5em] uppercase hover:bg-white transition-all flex items-center gap-4 shadow-xl"
            >
              <span className="material-symbols-outlined text-xl">videocam</span>
              Initialize Optical Sync
            </button>
          )}

          {analysis && (
            <div className="p-10 border border-primary/30 bg-primary/5 font-mono animate-fade-in shadow-2xl backdrop-blur-3xl">
              <div className="grid grid-cols-2 gap-10 mb-10">
                <div>
                  <p className="text-[10px] text-primary/60 uppercase tracking-widest mb-2">Genetic Tier</p>
                  <p className="text-xl font-bold uppercase text-white">{analysis.geneticTier}</p>
                </div>
                <div>
                  <p className="text-[10px] text-primary/60 uppercase tracking-widest mb-2">Neural Latency</p>
                  <p className="text-xl font-bold uppercase text-white">{analysis.neuralLatency}</p>
                </div>
                <div>
                  <p className="text-[10px] text-primary/60 uppercase tracking-widest mb-2">Metabolic Flux</p>
                  <p className="text-xl font-bold uppercase text-white">{analysis.metabolicEfficiency}</p>
                </div>
                <div>
                  <p className="text-[10px] text-primary/60 uppercase tracking-widest mb-2">Status</p>
                  <p className="text-xl font-bold uppercase text-primary text-glow">AUDITED</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed italic text-neutral-300 border-t border-primary/20 pt-6">
                "{analysis.protocolRecommendation}"
              </p>
            </div>
          )}
        </div>

        <div className="relative group">
          <div className="aspect-square max-w-lg mx-auto relative rounded-full overflow-hidden border-8 border-white/5 group-hover:border-primary/40 transition-all duration-700 shadow-[0_0_100px_rgba(0,0,0,1)]">
            {!hasPermission ? (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-neutral-800">
                <span className="material-symbols-outlined text-9xl">sensors_off</span>
              </div>
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className={`w-full h-full object-cover scale-x-[-1] grayscale contrast-125 ${isScanning ? 'blur-xl' : ''}`}
              />
            )}
            
            {/* HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-primary animate-scan shadow-[0_0_15px_#00FF7F]"></div>
              <div className="absolute inset-0 border-[60px] border-background-dark/30"></div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-4 bg-black/40 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md">
                <div className="size-2 rounded-full bg-red-600 animate-pulse"></div>
                <div className="text-[9px] font-black text-white/70 uppercase tracking-[0.4em]">Rec Link Active</div>
              </div>
            </div>

            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl z-20">
                <div className="size-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
                <p className="text-primary font-mono text-xs font-black uppercase tracking-[0.6em] animate-pulse">Decompiling Biometrics...</p>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" width="400" height="300"></canvas>
          
          {hasPermission && !isScanning && (
            <button 
              onClick={handleScan}
              disabled={isCapturing}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white text-black size-24 rounded-full font-black text-xs flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-90 transition-all duration-300 group-hover:bg-primary uppercase tracking-widest z-30"
            >
              SCAN
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default BiometricScanner;
