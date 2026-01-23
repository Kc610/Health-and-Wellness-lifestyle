
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { sounds } from '../services/ui-sounds';
import { UserProfile } from '../types';

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

  // Base64 Helpers
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async () => {
    setStatus('CONNECTING');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRes.current = outputAudioContext;

    // Robust safety for profile access
    const safeProfile = {
      age: profile?.age || 'Unknown',
      weight: profile?.weight || 'Unknown',
      activityLevel: profile?.activityLevel || 'Moderate',
      goals: profile?.goals || 'General Optimization'
    };

    const hasProfile = profile?.age && profile?.weight;
    const bioContext = `
      SUBJECT BIO-BASELINE:
      - Chronological Age: ${safeProfile.age}
      - Physical Mass: ${safeProfile.weight}kg
      - Activity Protocol: ${safeProfile.activityLevel}
      - Optimization Targets: ${safeProfile.goals}
    `;

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
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);

            const initializationPrompt = hasProfile 
              ? `NEURAL LINK ESTABLISHED. Initiate personalization protocol for subject baseline: ${bioContext}. Start with a targeted greeting that proves you have scanned and understood their specific baseline and targets.`
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
              const buffer = await decodeAudioData(decode(audioData), outputAudioContext, 24000, 1);
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
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/98 backdrop-blur-2xl animate-fade-in">
      <div className="absolute top-12 right-12">
        <button 
          onClick={() => { sounds.playClick(); onClose(); }} 
          className="size-16 flex items-center justify-center border border-white/10 rounded-full text-white/40 hover:text-primary hover:border-primary transition-all group"
        >
          <span className="material-symbols-outlined text-4xl group-hover:rotate-90 transition-transform">close</span>
        </button>
      </div>

      <div className="max-w-3xl w-full px-12 text-center flex flex-col items-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-4 px-6 py-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.5em] rounded-full">
            <span className="size-2 bg-primary rounded-full animate-ping"></span>
            Sync State: {status}
          </div>
        </div>

        <h2 className="font-display text-6xl font-black mb-20 uppercase tracking-tighter">
          AEI <span className="text-primary italic">CORE</span> LINK
        </h2>

        {/* Dynamic Orbital Visualizer */}
        <div className="relative size-80 mb-20">
          <div className={`absolute inset-0 rounded-full border-2 border-primary/10 scale-125 transition-transform duration-500 ${isSpeaking ? 'scale-150 border-primary/30' : ''}`}></div>
          <div className={`absolute inset-0 rounded-full border border-primary/20 scale-100 animate-ping-slow opacity-30`}></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className={`size-48 bg-primary text-black rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(0,255,127,0.3)] transition-all duration-300 ${isSpeaking ? 'scale-110' : 'scale-100'}`}>
                <span className="material-symbols-outlined text-7xl font-bold animate-pulse">graphic_eq</span>
             </div>
          </div>
          
          {/* Pulsing Data Strands */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <div 
              key={i}
              className="absolute top-1/2 left-1/2 w-px h-12 bg-primary origin-bottom"
              style={{
                transform: `rotate(${deg}deg) translate(0, -140px)`,
                opacity: isSpeaking ? 0.8 : 0.2,
                transition: 'opacity 0.3s ease'
              }}
            ></div>
          ))}
        </div>

        <div className="space-y-6 max-w-lg w-full">
          <p className="font-mono text-primary text-[11px] font-black tracking-[0.6em] leading-relaxed uppercase animate-pulse">
            {isSpeaking ? "Broadcasting Intel Helix..." : "Subject Voice Monitoring Active..."}
          </p>
          <div className="flex justify-center gap-1.5 h-12 items-end">
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 bg-primary/60 transition-all duration-75 ease-out"
                style={{ 
                  height: isSpeaking ? `${20 + Math.random() * 80}%` : '6px',
                  opacity: 0.3 + (Math.random() * 0.7)
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="mt-24 border-t border-white/10 pt-12 w-full">
          <div className="grid grid-cols-3 gap-12">
            <DataMetric label="Latency" value="0.08ms" />
            <DataMetric label="Sync Fidelity" value="99.9%" />
            <DataMetric label="Neural Tier" value="Master" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DataMetric = ({ label, value }: { label: string, value: string }) => (
  <div className="group">
    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">{label}</p>
    <p className="text-xl font-mono text-white tracking-tighter font-bold">{value}</p>
  </div>
);

export default LiveCoach;
