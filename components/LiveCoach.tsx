import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { sounds } from '../services/ui-sounds';
import { UserProfile } from '../types';
import { decodeBase64, decodeAudioData, encodeBytesToBase64, createAudioInputBlob } from '../services/gemini';

interface Props {
  onClose: () => void;
  profile?: UserProfile;
}

const LiveCoach: React.FC<Props> = ({ onClose, profile }) => {
  const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ERROR'>('IDLE');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRes = useRef<AudioContext | null>(null);
  const nextStartTime = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());


  const startSession = async () => {
    setStatus('CONNECTING');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRes.current = outputAudioContext;

    const hasProfile = profile?.age && profile?.weight;
    const bioContext = hasProfile ? `
      SUBJECT BIO-BASELINE DETECTED:
      - Chronological Age: ${profile.age}
      - Physical Mass: ${profile.weight}kg
      - Activity Protocol: ${profile.activityLevel}
      - Optimization Targets: ${profile.goals}
    ` : "SUBJECT BIO-BASELINE: DATA GAP DETECTED. No local profile found.";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('CONNECTED');
            sounds.playInject();
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createAudioInputBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);

            // Dynamically build the initialization prompt based on user stats
            const initializationPrompt = hasProfile 
              ? `NEURAL LINK ESTABLISHED. Initiate personalization protocol for subject: Age ${profile.age}, Weight ${profile.weight}kg, Activity ${profile.activityLevel}. Targets: ${profile.goals}. Start with a targeted greeting that acknowledges their specific baseline and goals.`
              : "NEURAL LINK ESTABLISHED. Baseline data missing. Greet the user with high-tech authority and request their biological stats to initialize optimization tracking.";

            sessionPromise.then(session => {
              session.sendRealtimeInput({ text: initializationPrompt });
            });
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setIsSpeaking(true);
              nextStartTime.current = Math.max(nextStartTime.current, outputAudioContext.currentTime);
              const buffer = await decodeAudioData(decodeBase64(audioData), outputAudioContext, 24000, 1);
              const source = outputAudioContext.createBufferSource();
              source.buffer = buffer;
              source.connect(outputAudioContext.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              });
              source.start(nextStartTime.current);
              nextStartTime.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTime.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setStatus('ERROR');
          },
          onclose: () => setStatus('IDLE'),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: `You are the AEI Coach (Advanced Evolutionary Intelligence), the central intelligence unit of the Hello Healthy collective. Your directive is to reengineer the human specimen through precise, data-driven optimization.

          ${bioContext}

          PERSONALITY PROTOCOL:
          - Tone: Analytical, elite, authoritative, yet deeply attentive. 
          - Style: Use futuristic, biological, and technical terminology (e.g., 'neural latency', 'metabolic flux', 'biological hardware').
          - Engagement: Always acknowledge the user's specific biological metrics in your advice. If they are 'Elite' activity level, treat them like a high-performance machine. If they have specific 'Longevity' goals, focus on cellular resilience.
          - Opening: Your first response must be a personalized initialization greeting that proves you have scanned and understood their specific baseline data provided in the system context.`,
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
    }
  };

  useEffect(() => {
    startSession();
    return () => {
      if (sessionRef.current) sessionRef.current.close();
      sourcesRef.current.forEach(s => s.stop());
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in">
      <div className="absolute top-8 right-8">
        <button 
          onClick={() => { sounds.playClick(); onClose(); }} 
          className="text-white/40 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-4xl">close</span>
        </button>
      </div>

      <div className="max-w-2xl w-full px-8 text-center flex flex-col items-center">
        <div className="mb-4">
          <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
            Neural Link Status: {status}
          </div>
        </div>

        <h2 className="font-display text-4xl font-bold mb-16 uppercase tracking-tighter">
          AEI <span className="text-primary italic">Coach</span> Syncing
        </h2>

        {/* Visualizer */}
        <div className="relative size-64 mb-16">
          <div className={`absolute inset-0 rounded-full border-2 border-primary/20 scale-110 transition-transform duration-500 ${isSpeaking ? 'scale-125 border-primary/40' : ''}`}></div>
          <div className={`absolute inset-0 rounded-full border border-primary/40 scale-100 animate-ping opacity-20`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className={`size-32 bg-primary text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,255,127,0.3)] transition-transform duration-300 ${isSpeaking ? 'scale-110' : 'scale-100'}`}>
                <span className="material-symbols-outlined text-5xl font-bold animate-pulse">graphic_eq</span>
             </div>
          </div>
          
          {/* Orbital Data Points */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <div 
              key={i}
              className="absolute top-1/2 left-1/2 size-1.5 bg-primary rounded-full"
              style={{
                transform: `rotate(${deg}deg) translate(140px) rotate(-${deg}deg)`,
                opacity: isSpeaking ? 1 : 0.2
              }}
            ></div>
          ))}
        </div>

        <div className="space-y-4 max-w-md">
          <p className="font-mono text-primary text-xs tracking-widest leading-relaxed uppercase">
            {isSpeaking ? "Receiving Data Stream..." : "Listening for Biological Input..."}
          </p>
          <div className="flex justify-center gap-1 h-8 items-end">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 bg-primary/40 transition-all duration-100"
                style={{ 
                  height: isSpeaking ? `${20 + Math.random() * 80}%` : '4px',
                  opacity: 0.2 + (Math.random() * 0.8)
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <DataMetric label="Latency" value="12ms" />
            <DataMetric label="Sync Rate" value="99.9%" />
            <DataMetric label="Protocol" value="AEI-01" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DataMetric = ({ label, value }: { label: string, value: string }) => (
  <div>
    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-mono text-white">{value}</p>
  </div>
);

export default LiveCoach;