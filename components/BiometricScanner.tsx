
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
        
        // Visual effect
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
    <section className="py-24 bg-black border-y border-white/10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-primary font-bold tracking-[0.3em] uppercase mb-6 text-sm flex items-center gap-4">
            <span className="w-8 h-px bg-primary"></span>
            Biometric Audit
          </p>
          <h3 className="font-display text-5xl font-bold mb-8 uppercase tracking-tighter">
            Audit Your <br/><span className="text-primary">Genetic Hardware.</span>
          </h3>
          <p className="text-slate-400 text-lg font-light leading-relaxed mb-10 max-w-md">
            Connect your neural node to our vision core for a real-time biological optimization audit. 
            Identify bottlenecks in your metabolic and neural circuitry.
          </p>

          {!hasPermission && (
            <button 
              onClick={() => { sounds.playClick(); setHasPermission(true); }}
              className="bg-primary text-black px-10 py-5 font-black text-xs tracking-widest uppercase hover:bg-white transition-all flex items-center gap-3"
            >
              <span className="material-symbols-outlined">videocam</span>
              Initialize Optical Sync
            </button>
          )}

          {analysis && (
            <div className="p-8 border border-primary/30 bg-primary/5 font-mono animate-fade-in">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-[10px] text-primary/50 uppercase tracking-widest mb-1">Genetic Tier</p>
                  <p className="text-xl font-bold uppercase">{analysis.geneticTier}</p>
                </div>
                <div>
                  <p className="text-[10px] text-primary/50 uppercase tracking-widest mb-1">Neural Latency</p>
                  <p className="text-xl font-bold uppercase">{analysis.neuralLatency}</p>
                </div>
                <div>
                  <p className="text-[10px] text-primary/50 uppercase tracking-widest mb-1">Metabolic Efficiency</p>
                  <p className="text-xl font-bold uppercase">{analysis.metabolicEfficiency}</p>
                </div>
                <div>
                  <p className="text-[10px] text-primary/50 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xl font-bold uppercase text-primary">AUDITED</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed italic text-slate-300 border-t border-primary/20 pt-4">
                "{analysis.protocolRecommendation}"
              </p>
            </div>
          )}
        </div>

        <div className="relative group">
          <div className="aspect-square max-w-md mx-auto relative rounded-full overflow-hidden border-4 border-white/10 group-hover:border-primary/50 transition-colors">
            {!hasPermission ? (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-dark text-slate-700">
                <span className="material-symbols-outlined text-8xl">sensors_off</span>
              </div>
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className={`w-full h-full object-cover scale-x-[-1] ${isScanning ? 'blur-md' : ''}`}
              />
            )}
            
            {/* HUD Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-primary/40 animate-scan"></div>
              <div className="absolute inset-0 border-[40px] border-black/20"></div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-4">
                <div className="size-2 rounded-full bg-red-500 animate-pulse"></div>
                <div className="text-[8px] font-black text-white/50 uppercase tracking-widest">Rec Link Active</div>
              </div>
            </div>

            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-primary font-mono text-[10px] font-bold uppercase tracking-[0.5em]">Decompiling Biometrics...</p>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" width="400" height="300"></canvas>
          
          {hasPermission && !isScanning && (
            <button 
              onClick={handleScan}
              disabled={isCapturing}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white text-black size-20 rounded-full font-black text-[10px] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group-hover:bg-primary"
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
          animation: scan 3s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default BiometricScanner;
