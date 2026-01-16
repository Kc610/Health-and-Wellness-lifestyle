
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

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
  } catch (err) {
    console.error("TTS Synthesis failed:", err);
  }
  return null;
};

export const generateOptimizationLogs = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 4 high-performance bio-optimization data logs for a futuristic training collective. Each log needs a specific node level, a high-tech metric, a result, and a pseudo-anonymous username from a global city.",
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
    return parsed || [];
  } catch (err) {
    console.error("Failed to fetch logs:", err);
    return [];
  }
};

export const generateProductIntel = async (productTitle: string, baseDescription: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate this biological supplement description into a high-tech "Protocol Intel Report" for the Human Evolution Collective. 
      Product: ${productTitle}
      Original Info: ${baseDescription}
      Use cold, analytical, futuristic terminology. Format as a briefing with "Primary Function", "Neural Impact", and "Biological Patch Version".`,
    });
    return response.text || "INTEL DECRYPTION FAILED. ACCESS DENIED.";
  } catch (err) {
    return "NEURAL NODE TIMEOUT. RETRY PROTOCOL.";
  }
};

export const generateIntelLeaks = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 10 short, futuristic 'intel leaks'. Phrases should be short, cryptic, and high-tech.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    const parsed = safeParseJson(response.text);
    return parsed || ["LINK STABLE", "NODES ACTIVE", "ENCRYPTED"];
  } catch (err) {
    return ["LINK STABLE", "NODES ACTIVE", "ENCRYPTED"];
  }
};

export const analyzeBiometrics = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: "Analyze this specimen for biological optimization potential. Return JSON." }
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
          }
        }
      }
    });
    return safeParseJson(response.text);
  } catch (err) {
    return null;
  }
};

export const createOptimizationChat = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are the Hello Healthy Chief Optimization Agent. Professional, analytical, high-performance persona. Goal: biological optimization advice.",
    }
  });
};
