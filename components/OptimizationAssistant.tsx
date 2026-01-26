import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality } from '@google/genai';
import { createOptimizationChat, speakProtocol, createAudioInputBlob, decodeBase64, decodeAudioData } from '../services/gemini';
import { ChatMessage } from '../types';
import { sounds } from '../services/ui-sounds';

interface Props {
  onClose: () => void;
}

const OptimizationAssistant: React.FC<Props> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Neural link established. Optimization Agent active. State your biological hardware stats or request a protocol patch.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentInputTranscription, setCurrentInputTranscription] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);
  const currentAudioSource = useRef<AudioBufferSourceNode | null>(null);

  // Live API refs for voice input
  const liveSessionRef = useRef<LiveSession | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextOutputAudioStartTime = useRef<number>(0);
  const outputAudioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    chatRef.current = createOptimizationChat();
    return () => {
      if (currentAudioSource.current) currentAudioSource.current.stop();
      stopVoiceInput(); // Ensure session is closed on unmount
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, currentInputTranscription]);

  // Handle voice input toggle
  useEffect(() => {
    if (isVoiceEnabled) {
      startVoiceInput();
    } else {
      stopVoiceInput();
    }
  }, [isVoiceEnabled]);

  const speakMessage = async (text: string) => {
    if (!isVoiceEnabled) return;
    try {
      // If Live API session is active, let it handle audio output
      if (liveSessionRef.current) {
        // We're not explicitly sending text for the model to speak via liveSessionRef.current in this block,
        // as the model's audio response in a Live session will be handled by the onmessage callback.
        // This function (`speakMessage`) is used for non-Live session text-to-speech.
        // If we are in a live session, we should stop existing local playback.
        outputAudioSourcesRef.current.forEach(s => s.stop());
        outputAudioSourcesRef.current.clear();
        nextOutputAudioStartTime.current = 0;
      }
      
      if (currentAudioSource.current) currentAudioSource.current.stop();
      const playback = await speakProtocol(text);
      if (playback) {
        currentAudioSource.current = playback.source;
        playback.source.start(0);
        playback.source.onended = () => currentAudioSource.current = null;
      }
    } catch (e) {
      console.error("Voice output failed", e);
    }
  };

  const startVoiceInput = async () => {
    if (liveSessionRef.current && isListening) return; // Already listening

    setIsListening(true);
    setCurrentInputTranscription('');
    sounds.playInject();

    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
        const pcmBlob = createAudioInputBlob(inputData);
        if (liveSessionRef.current) {
          liveSessionRef.current.sendRealtimeInput({ media: pcmBlob });
        }
      };

      source.connect(scriptProcessorRef.current);
      scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Live session opened');
            // If the model is speaking, stop it when user starts input
            if (currentAudioSource.current) {
              currentAudioSource.current.stop();
              currentAudioSource.current = null;
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            // Process user input transcription
            if (message.serverContent?.inputTranscription) {
              setCurrentInputTranscription(prev => prev + message.serverContent?.inputTranscription?.text);
            }
            if (message.serverContent?.turnComplete && message.serverContent?.inputTranscription) {
              const fullInputText = currentInputTranscription;
              setCurrentInputTranscription(''); // Clear for next input
              setIsListening(true); // Continue listening

              if (fullInputText.trim()) {
                setMessages(prev => [...prev, { role: 'user', text: fullInputText, timestamp: new Date() }]);
                setIsTyping(true);
                
                // Send to chat for model response
                try {
                  if (!chatRef.current) chatRef.current = createOptimizationChat();
                  let fullResponse = '';
                  // Sending a text message will typically interrupt the current live session's model output and restart it.
                  liveSessionRef.current?.sendRealtimeInput({ text: fullInputText }); // Send user message via Live API too
                  
                  // Add empty message for streaming model's text response (if any beyond audio)
                  setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

                } catch (error) {
                  console.error("Agent error during voice input:", error);
                  setMessages(prev => [...prev, { role: 'model', text: "Communication link unstable. Resetting neural node...", timestamp: new Date() }]);
                } finally {
                  setIsTyping(false);
                }
              }
            }

            // Process model audio output (from Live API)
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              nextOutputAudioStartTime.current = Math.max(nextOutputAudioStartTime.current, inputAudioContextRef.current!.currentTime);
              const audioBuffer = await decodeAudioData(decodeBase64(base64EncodedAudioString), inputAudioContextRef.current!, 24000, 1);
              const source = inputAudioContextRef.current!.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(inputAudioContextRef.current!.destination);
              source.addEventListener('ended', () => {
                outputAudioSourcesRef.current.delete(source);
                if (outputAudioSourcesRef.current.size === 0) setIsTyping(false); // Model finished speaking
              });

              source.start(nextOutputAudioStartTime.current);
              nextOutputAudioStartTime.current = nextOutputAudioStartTime.current + audioBuffer.duration;
              outputAudioSourcesRef.current.add(source);
              setIsTyping(true); // Indicate model is speaking
            }
            // Update model's text response in chat
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setMessages(prev => {
                const newMessages = [...prev];
                // Find the last model message or create a new one if it doesn't exist
                const lastModelMessageIndex = newMessages.length - 1;
                if (lastModelMessageIndex >= 0 && newMessages[lastModelMessageIndex].role === 'model') {
                  newMessages[lastModelMessageIndex].text += text;
                } else {
                  newMessages.push({ role: 'model', text: text, timestamp: new Date() });
                }
                return newMessages;
              });
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            sounds.playBlip();
            setMessages(prev => [...prev, { role: 'model', text: "Voice link error: Check microphone or connection.", timestamp: new Date() }]);
            stopVoiceInput();
          },
          onclose: () => {
            console.log('Live session closed');
            setIsListening(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {}, // Enable transcription for model output audio.
          inputAudioTranscription: {}, // Enable transcription for user input audio.
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: "You are the Hello Healthy Optimization Agent, a high-performance biological optimization AI. Use analytical, elite, and authoritative language. Focus on biological metrics, protocols, and neural synergy. Provide concise, data-driven responses.",
        },
      });

      liveSessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to start voice input:", err);
      sounds.playBlip();
      setMessages(prev => [...prev, { role: 'model', text: "Microphone access denied or voice link initialization failed.", timestamp: new Date() }]);
      stopVoiceInput();
    }
  };

  const stopVoiceInput = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.close();
      liveSessionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    outputAudioSourcesRef.current.forEach(s => s.stop());
    outputAudioSourcesRef.current.clear();
    nextOutputAudioStartTime.current = 0;
    setIsListening(false);
    setCurrentInputTranscription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    sounds.playInject();
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage, timestamp: new Date() }]);
    setIsTyping(true);

    try {
      if (!chatRef.current) chatRef.current = createOptimizationChat();
      
      let fullResponse = '';
      const responseStream = await chatRef.current.sendMessageStream({ message: userMessage });
      
      // Add empty message for streaming
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

      for await (const chunk of responseStream) {
        const text = chunk.text;
        fullResponse += text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullResponse;
          return newMessages;
        });
      }
      sounds.playBlip();
      speakMessage(fullResponse);
    } catch (error) {
      console.error("Agent error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Communication link unstable. Resetting neural node...", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const currentInputFieldText = isVoiceEnabled && isListening ? (currentInputTranscription || "Listening...") : input;
  const isInputDisabled = isTyping || (isVoiceEnabled && isListening);

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex justify-end">
      <div 
        className="absolute inset-0" 
        onClick={() => { sounds.playClick(); onClose(); }}
      ></div>
      
      <div className="relative w-full max-w-xl bg-surface-dark border-l border-white/10 h-full flex flex-col shadow-3xl animate-slide-left">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-primary/10 flex items-center justify-center border border-primary/40 rounded-sm">
              <span className="material-symbols-outlined text-primary text-2xl animate-pulse">terminal</span>
            </div>
            <div>
              <h3 className="font-display font-black text-xs uppercase tracking-[0.4em] text-primary">Optimization Agent</h3>
              <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] mt-0.5">Protocol Sync v3.1.4</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { sounds.playBlip(); setIsVoiceEnabled(!isVoiceEnabled); }}
              className={`flex items-center gap-2 px-3 py-1.5 border transition-all ${isVoiceEnabled ? 'bg-primary border-primary text-black' : 'border-white/10 text-neutral-500 hover:text-white'}`}
              title={isVoiceEnabled ? 'Disable Voice Input' : 'Enable Voice Input'}
              aria-pressed={isVoiceEnabled}
            >
              <span className="material-symbols-outlined text-sm">{isVoiceEnabled ? 'volume_up' : 'volume_off'}</span>
              <span className="text-[8px] font-black uppercase tracking-widest">Voice</span>
            </button>
            <button 
              onClick={() => { sounds.playClick(); onClose(); }}
              className="size-12 flex items-center justify-center hover:bg-white/5 transition-colors text-neutral-500 hover:text-white"
              title="Close Assistant"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth font-mono text-sm custom-scrollbar"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-6 border ${msg.role === 'user' ? 'bg-neutral-900/40 border-white/10 text-white' : 'bg-primary/5 border-primary/30 text-primary shadow-[0_0_20px_rgba(0,255,127,0.05)]'}`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[9px] opacity-50 uppercase tracking-[0.4em]">
                    {msg.role === 'user' ? 'SUBJECT' : 'AGENT'} - {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {msg.role === 'model' && msg.text && !isVoiceEnabled && ( // Only show playback if voice input is disabled, otherwise Live API controls
                    <button 
                      onClick={() => speakMessage(msg.text)}
                      className="text-primary/40 hover:text-primary transition-colors"
                      title="Play message aloud"
                    >
                      <span className="material-symbols-outlined text-sm">play_circle</span>
                    </button>
                  )}
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {(isTyping || (isVoiceEnabled && isListening)) && (
            <div className="flex justify-start">
              <div className="bg-primary/5 border border-primary/30 p-6 flex gap-2 items-center">
                {isVoiceEnabled && isListening ? (
                  <>
                    <span className="material-symbols-outlined text-primary animate-pulse">mic</span>
                    <p className="text-[9px] text-primary font-black uppercase tracking-widest animate-pulse">
                      LISTENING...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="size-2 bg-primary animate-bounce"></div>
                    <div className="size-2 bg-primary animate-bounce [animation-delay:0.2s]"></div>
                    <div className="size-2 bg-primary animate-bounce [animation-delay:0.4s]"></div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 border-t border-white/5 bg-black/60">
          <div className="relative">
            <input 
              autoFocus
              value={currentInputFieldText}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isVoiceEnabled && isListening ? "Speak your query..." : "Inject bio-data or optimization query..."}
              className="w-full bg-neutral-900/40 border border-white/10 px-8 py-5 pr-28 text-sm font-mono focus:outline-none focus:border-primary transition-colors placeholder:text-neutral-700 text-white"
              readOnly={isInputDisabled}
              disabled={isInputDisabled}
              aria-label="Input field for optimization query"
            />
            <button 
              type="submit"
              disabled={isInputDisabled}
              className="absolute right-2 top-2 bottom-2 bg-primary text-black px-6 font-black text-[10px] uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50"
              aria-label={isInputDisabled ? "Cannot inject" : "Inject query"}
            >
              {isVoiceEnabled && isListening ? 'SPEAKING' : 'INJECT'}
            </button>
          </div>
          <p className="mt-4 text-[9px] text-neutral-700 uppercase tracking-[0.5em] text-center">
            CAUTION: DATA STREAMS ARE AUDITED BY THE COLLECTIVE
          </p>
        </form>
      </div>
      
      <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
        }
      `}</style>
    </div>
  );
};

export default OptimizationAssistant;