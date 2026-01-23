

import React, { useState, useRef } from 'react';
import { analyzeVideoKinetic, NeuralLinkError } from '../services/gemini';
import { sounds } from '../services/ui-sounds';

interface Props {
  onClose: () => void;
}

const VideoAnalyzer: React.FC<Props> = ({ onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractFrames = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = async () => {
        const frames: string[] = [];
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 360;

        const duration = video.duration;
        const frameCount = 8;
        const interval = duration / frameCount;

        for (let i = 0; i < frameCount; i++) {
          setProgress(Math.round(((i + 1) / frameCount) * 50));
          video.currentTime = i * interval;
          await new Promise(r => video.onseeked = r);
          if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            frames.push(canvas.toDataURL('image/jpeg', 0.7).split(',')[1]);
          }
        }
        resolve(frames);
      };
      video.onerror = reject;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playInject();
    setIsProcessing(true);
    setReport(null);
    setError(null);
    setProgress(0);

    try {
      const frames = await extractFrames(file);
      setProgress(75);
      const result = await analyzeVideoKinetic(frames);
      setReport(result);
      setProgress(100);
      sounds.playBlip();
    } catch (err) {
      setError(err instanceof NeuralLinkError ? err.message : "KINETIC FEED DISRUPTED");
      sounds.playBlip();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-surface-dark border border-primary/30 p-8 shadow-[0_0_100px_rgba(0,255,127,0.1)] animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="font-display text-3xl font-black uppercase tracking-tighter text-white">Visual <span className="text-primary italic">Intelligence</span> Core</h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mt-1">Extracting kinetic markers from raw telemetry</p>
          </div>
          <button onClick={() => { sounds.playClick(); onClose(); }} className="text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {!report && !isProcessing && !error && (
          <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/10 bg-white/5 hover:border-primary/40 transition-colors group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <span className="material-symbols-outlined text-6xl text-slate-600 mb-6 group-hover:text-primary transition-colors group-hover:scale-110">video_library</span>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 group-hover:text-white transition-colors">Inject Kinetic Telemetry (MP4/MOV)</p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="video/*" 
              onChange={handleFileChange}
              className="hidden" 
            />
          </div>
        )}

        {isProcessing && (
          <div className="py-20 text-center space-y-8">
            <div className="relative size-24 mx-auto">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-primary">{progress}%</span>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-primary animate-pulse">
                {progress < 50 ? "Decompiling Frames..." : progress < 80 ? "Neural Processing..." : "Synthesizing Intel..."}
              </p>
              <div className="max-w-xs mx-auto mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="py-16 text-center border border-safety-orange/30 bg-safety-orange/5">
            <span className="material-symbols-outlined text-safety-orange text-5xl mb-4">error</span>
            <p className="font-mono text-xs font-bold uppercase text-safety-orange tracking-widest mb-6">{error}</p>
            <button 
              onClick={() => { setError(null); fileInputRef.current?.click(); }}
              className="px-8 py-3 bg-safety-orange text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors"
            >
              Retry Ingestion
            </button>
          </div>
        )}

        {report && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-black/40 border border-white/10 p-8 max-h-[50vh] overflow-y-auto">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-primary/20"></span> Generated Intel Briefing
              </h4>
              <div className="font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                {report}
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button 
                onClick={() => setReport(null)}
                className="text-[10px] font-black uppercase tracking-widest px-6 py-3 border border-white/10 hover:bg-white/5 transition-all"
              >
                Clear Cache
              </button>
              <button 
                onClick={() => sounds.playClick()}
                className="text-[10px] font-black uppercase tracking-widest px-8 py-3 bg-primary text-black hover:bg-white transition-all"
              >
                Download PDF Patch
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnalyzer;
