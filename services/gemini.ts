
import { GoogleGenAI, Type, Modality, Blob } from "@google/genai";
import { loadingTracker } from "./loading";

/**
 * Custom Error for API interactions
 */
export class NeuralLinkError extends Error {
  constructor(public message: string, public code: string) {
    super(message);
    this.name = 'NeuralLinkError';
  }
}

/**
 * Helper to safely parse JSON from Gemini responses.
 */
const safeParseJson = (text: string | undefined) => {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        return null;
      }
    }
    return null;
  }
};

/**
 * Validates presence of API Key.
 */
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey.includes("your-api-key")) {
    throw new NeuralLinkError("Neural link severed. Authorization key missing.", "AUTH_FAIL");
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * PCM Audio Decoding utilities (for model output)
 */
export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number = 1): Promise<AudioBuffer> => {
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

/**
 * PCM Audio Encoding utility (for microphone input)
 */
export const encodeBytesToBase64 = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const createAudioInputBlob = (data: Float32Array): Blob => {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encodeBytesToBase64(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
};


export const speakProtocol = async (text: string) => {
  loadingTracker.start();
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this vitality protocol intel with focused, elite authority: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioCtx, 24000);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      return { source, audioCtx };
    }
    throw new Error("No audio data returned");
  } catch (err) {
    console.error("TTS Synthesis failed:", err);
    throw new NeuralLinkError("Neural voice link interrupted. Audio synthesis unavailable.", "VOICE_LINK_DOWN");
  } finally {
    loadingTracker.end();
  }
};

export const generateOptimizationLogs = async () => {
  loadingTracker.start();
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: "Generate exactly 4 high-performance vitality optimization logs for a futuristic training collective dashboard. Return only valid JSON." }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              nodeType: { type: Type.STRING },
              category: { type: Type.STRING },
              metric: { type: Type.STRING },
              value: { type: Type.STRING },
              user: { type: Type.STRING },
              location: { type: Type.STRING }
            },
            required: ["id", "nodeType", "category", "metric", "value", "user", "location"]
          }
        }
      }
    });

    const parsed = safeParseJson(response.text);
    if (!parsed || !Array.isArray(parsed)) throw new Error("Malformed grid data");
    return parsed;
  } catch (err) {
    if (err instanceof NeuralLinkError) throw err;
    throw new NeuralLinkError("Collective Intelligence Pulse timed out. Biological logs inaccessible.", "GRID_SYNC_FAIL");
  } finally {
    loadingTracker.end();
  }
};

export const generateProductIntel = async (productTitle: string, baseDescription: string) => {
  loadingTracker.start();
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Generate a high-tech "Vitality Intel Report" for: ${productTitle}. Info: ${baseDescription}. Use cold, futuristic terminology.` }] }],
    });
    return response.text || "INTEL DECRYPTION FAILED.";
  } catch (err) {
    throw new NeuralLinkError("Decryption core offline.", "INTEL_DECRYPT_FAIL");
  } finally {
    loadingTracker.end();
  }
};

export const generateIntelLeaks = async () => {
  loadingTracker.start();
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: "Generate 10 cryptic 'vitality leaks' for a ticker. Return as JSON array of strings." }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return safeParseJson(response.text) || ["PULSE STABLE"];
  } catch (err) {
    // Return robust static fallback to keep UI dynamic even on auth failure
    return [
      "LINK ESTABLISHED: NODE A-1",
      "BIOMETRIC DECRYPTION: ACTIVE",
      "NEURAL SYNC: 98.4%",
      "OPTIMIZATION PROTOCOL: ENGAGED",
      "VITALITY STREAMS: SECURE",
      "LATENCY: 0.002MS",
      "COLLECTIVE PULSE: STEADY",
      "HARDWARE AUDIT: COMPLETE",
      "BUFFERING KINETIC DATA...",
      "SYSTEM STATUS: OPTIMAL"
    ];
  } finally {
    loadingTracker.end();
  }
};

export const analyzeBiometrics = async (base64Image: string) => {
  loadingTracker.start();
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: base64Image } },
            { text: "Analyze this human specimen for vitality potential. Provide JSON stats." }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            geneticTier: { type: Type.STRING },
            neuralLatency: { type: Type.STRING },
            metabolicEfficiency: { type: Type.STRING },
            protocolRecommendation: { type: Type.STRING }
          },
          required: ["geneticTier", "neuralLatency", "metabolicEfficiency", "protocolRecommendation"]
        }
      }
    });
    return safeParseJson(response.text);
  } catch (err) {
    throw new NeuralLinkError("Optical biometric core failed.", "BIO_SCAN_FAIL");
  } finally {
    loadingTracker.end();
  }
};

export const analyzeVideoKinetic = async (frames: string[]) => {
  loadingTracker.start();
  try {
    const ai = getAiClient();
    const parts = [
      ...frames.map(data => ({ inlineData: { mimeType: "image/jpeg", data } })),
      { text: "Analyze this kinetic sequence. Provide a 'VITALITY PERFORMANCE AUDIT'." }
    ];
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts }],
    });
    return response.text || "DECODING FAILED.";
  } catch (err) {
    throw new NeuralLinkError("Visual Intelligence Core overload.", "VIDEO_INTEL_FAIL");
  } finally {
    loadingTracker.end();
  }
};

/**
 * Veo Video Generation for Product kinetic previews
 */
export const generateProductVideo = async (productTitle: string, onStatusUpdate?: (status: string) => void) => {
  loadingTracker.start();
  
  // 1. Mandatory API Key Selection for Veo
  const aistudio = (window as any).aistudio;
  if (aistudio && typeof aistudio.hasSelectedApiKey === 'function') {
    const hasSelected = await aistudio.hasSelectedApiKey();
    if (!hasSelected) {
      if (onStatusUpdate) onStatusUpdate("Awaiting project billing authorization...");
      await aistudio.openSelectKey();
      // Proceeding assuming success due to race condition instructions
    }
  }

  try {
    // Create fresh instance to ensure up-to-date key
    const ai = getAiClient();

    if (onStatusUpdate) onStatusUpdate("Initializing Veo Render Node...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A cinematic, ultra-high-definition slow motion product shot of ${productTitle}, a premium biological supplement. The bottle is surrounded by flowing green kinetic energy pulses and floating cellular structures in a dark, futuristic laboratory. Professional lighting, 4k resolution, bokeh.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    const reassuringMessages = [
      "Synthesizing Biological Kinetic Patterns...",
      "Ray-tracing Cellular Structures...",
      "Stabilizing Temporal Flux...",
      "Finalizing Vitality Visualization...",
      "Encoding Neural Stream..."
    ];
    let messageIdx = 0;

    while (!operation.done) {
      if (onStatusUpdate) {
        onStatusUpdate(reassuringMessages[messageIdx % reassuringMessages.length]);
        messageIdx++;
      }
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed: No link returned.");

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
  } catch (err: any) {
    if (err.message?.includes("Requested entity was not found")) {
      // Reset key state if billing/entity issue
      if (aistudio) await aistudio.openSelectKey();
    }
    throw new NeuralLinkError("Kinetic visualization core failure.", "VIDEO_GEN_FAIL");
  } finally {
    loadingTracker.end();
  }
};

export const createOptimizationChat = () => {
  const ai = getAiClient();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are the Hello Healthy Chief Synergy Agent. Professional, analytical, high-performance persona.",
    }
  });
};
