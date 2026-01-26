
const express = require('express');
const cors = require('cors');
// Import GoogleGenAI and Modality from the correct package
const { GoogleGenAI, Type, Modality } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Polyfill API_KEY if GEMINI_API_KEY is present but API_KEY is not
if (!process.env.API_KEY && process.env.GEMINI_API_KEY) {
  process.env.API_KEY = process.env.GEMINI_API_KEY;
}

// Initialize GoogleGenAI with named parameter apiKey
const genAI = new GoogleGenAI({apiKey: process.env.API_KEY});

// CENTRALIZED AGENT PERSONA
const SYSTEM_PROMPT = `You are the Hello Healthy Chief Synergy Agent. 
Professional, analytical, high-performance persona. 
Use terminology like 'Pulse', 'Helix', 'Neural Synergy', and 'Optimization'. 
Always return responses in the requested JSON format.`;

// --- BIOMETRIC SCANNER ROUTE ---
app.post('/api/analyze-biometrics', async (req, res) => {
  try {
    const { image } = req.body;
    // Fix: Using ai.models.generateContent directly instead of deprecated getGenerativeModel
    // Fix: Moved systemInstruction to the top level config of generateContent
    const result = await genAI.models.generateContent({
      model: "gemini-3-flash-preview", // Updated model name to 'gemini-3-flash-preview' for image generation/editing tasks.
      systemInstruction: SYSTEM_PROMPT,
      contents: [
        {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: image } },
            { text: "Perform vitality audit on this specimen." }
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
          }
        }
      }
    });
    // Fix: Access .text property directly, and ensure parsing is robust.
    res.json(JSON.parse(result.text));
  } catch (error) {
    console.error("Link Error:", error);
    res.status(500).json({ error: "Biometric Core Offline" });
  }
});

// --- VOICE SYNTHESIS (TTS) ---
app.post('/api/speak-protocol', async (req, res) => {
  try {
    const { text } = req.body;
    // Fix: Using ai.models.generateContent directly instead of deprecated getGenerativeModel
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash-preview-tts", // Updated model name to 'gemini-2.5-flash-preview-tts' for text-to-speech tasks.
      contents: [{ parts: [{ text: `System Broadcast: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
      }
    });
    // Fix: Access candidates safely for audio data.
    const audioData = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    res.json({ audio: audioData });
  } catch (error) {
    res.status(500).json({ error: "Voice Core Failure" });
  }
});

app.listen(3001, () => console.log("NEURAL CORE ONLINE: PORT 3001"));
