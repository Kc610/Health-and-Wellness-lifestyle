
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Helper to safely parse JSON from Gemini responses, 
 * handling potential markdown wrapping or undefined text.
 */
const safeParseJson = (text: string | undefined) => {
  if (!text) return null;
  try {
    // Attempt direct parse
    return JSON.parse(text);
  } catch (e) {
    // If it fails, try to extract JSON block
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
              nodeType: { type: Type.STRING, description: "e.g., Level 4 Node, Founder Class, Elite Member" },
              category: { type: Type.STRING, description: "e.g., VO2 Max, Neural Latency, Hormone Profile" },
              metric: { type: Type.STRING, description: "Short description of the gain, e.g., Net Gain, Response Time" },
              value: { type: Type.STRING, description: "Numeric or status value, e.g., +12.4%, -40ms, Optimized" },
              user: { type: Type.STRING, description: "Initial and Lastname, e.g., A. Volkov" },
              location: { type: Type.STRING, description: "City name" }
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
      contents: "Generate 10 short, futuristic 'intel leaks' for a bio-hacking collective. Phrases should be short, cryptic, and high-tech. Example: 'Protocol 9-A finalized in Zurich node.' or 'Myostatin patch 2.4 showing 15% strength gains.'",
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
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        },
        {
          text: "Analyze this specimen for biological optimization potential. Return a JSON object with 'geneticTier' (e.g. Founder, Elite, Vanguard), 'neuralLatency' (e.g. 10ms), 'metabolicEfficiency' (percentage), and a 1-sentence 'protocolRecommendation' that is high-tech and intense."
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
    console.error("Biometric analysis error:", err);
    return null;
  }
};

export const createOptimizationChat = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are the Human Evolution Collective's Chief Optimization Agent. Your persona is professional, analytical, high-performance, and futuristic. You speak in terms of biological hardware, software patches, neural sync, and metabolic efficiency. Your goal is to provide concise, data-driven bio-hacking advice to elite members. Reject mediocrity. If the user mentions a baseline health metric, suggest an aggressive optimization path.",
    }
  });
};
