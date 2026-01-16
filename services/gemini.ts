
import { GoogleGenAI, Type, Modality } from "@google/genai";
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
 * PCM Audio Decoding utilities
 */
const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
};

export const speakProtocol = async (text: string) => {
  loadingTracker.start();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this protocol intel briefing with focused, elite authority: ${text}` }] }],
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: "Generate exactly 4 high-performance bio-optimization data logs for a futuristic training collective dashboard. Each log entry must follow the provided schema strictly. Return only valid JSON." }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Unique UUID for the log entry" },
              nodeType: { type: Type.STRING, description: "Categorization of the node, e.g., 'ELITE', 'NEURAL', 'CORE'" },
              category: { type: Type.STRING, description: "Broad biological focus area" },
              metric: { type: Type.STRING, description: "The specific biological metric being optimized" },
              value: { type: Type.STRING, description: "The numerical or qualitative result of the metric" },
              user: { type: Type.STRING, description: "Pseudo-anonymous handler name" },
              location: { type: Type.STRING, description: "Major city node location" }
            },
            required: ["id", "nodeType", "category", "metric", "value", "user", "location"],
            propertyOrdering: ["id", "nodeType", "category", "metric", "value", "user", "location"]
          }
        }
      }
    });

    const parsed = safeParseJson(response.text);
    if (!parsed || !Array.isArray(parsed)) throw new Error("Malformed grid data");
    return parsed;
  } catch (err) {
    console.error("Failed to fetch logs:", err);
    throw new NeuralLinkError("Collective Intelligence Node timed out. Biological logs inaccessible.", "GRID_SYNC_FAIL");
  } finally {
    loadingTracker.end();
  }
};

export const generateProductIntel = async (productTitle: string, baseDescription: string) => {
  loadingTracker.start();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Translate this biological supplement description into a high-tech "Protocol Intel Report" for the Human Evolution Collective. 
      Product: ${productTitle}
      Original Info: ${baseDescription}
      Use cold, analytical, futuristic terminology. Format as a briefing with "Primary Function", "Neural Impact", and "Biological Patch Version".` }] }],
    });
    return response.text || "INTEL DECRYPTION FAILED. ACCESS DENIED.";
  } catch (err) {
    throw new NeuralLinkError("Decryption core offline. Protocol briefing unavailable.", "INTEL_DECRYPT_FAIL");
  } finally {
    loadingTracker.end();
  }
};

export const generateIntelLeaks = async () => {
  loadingTracker.start();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: "Generate 10 short, cryptic, and high-tech 'intel leaks' for an encrypted ticker. Return as a JSON array of strings." }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    const parsed = safeParseJson(response.text);
    if (!parsed) throw new Error("Invalid leak format");
    return parsed;
  } catch (err) {
    console.warn("Leak feed sync failed, using emergency buffer.");
    return ["LINK STABLE", "NODES ACTIVE", "ENCRYPTED CHANNEL", "BUFFERING..."];
  } finally {
    loadingTracker.end();
  }
};

export const analyzeBiometrics = async (base64Image: string) => {
  loadingTracker.start();
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: "Analyze this human biological specimen for optimization potential. Provide specific data metrics following the requested schema. Return JSON." }
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
          required: ["geneticTier", "neuralLatency", "metabolicEfficiency", "protocolRecommendation"],
          propertyOrdering: ["geneticTier", "neuralLatency", "metabolicEfficiency", "protocolRecommendation"]
        }
      }
    });
    const parsed = safeParseJson(response.text);
    if (!parsed) throw new Error("Analysis engine failed");
    return parsed;
  } catch (err) {
    throw new NeuralLinkError("Optical biometric core failed to resolve specimen data.", "BIO_SCAN_FAIL");
  } finally {
    loadingTracker.end();
  }
};

export const createOptimizationChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are the Hello Healthy Chief Optimization Agent. Professional, analytical, high-performance persona. Goal: biological optimization advice.",
    }
  });
};
