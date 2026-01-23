
const express = require('express');
const cors = require('cors');
const { GoogleGenAI, Type, Modality } = require('@google/genai'); // Added Modality
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize GoogleGenAI once
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); // Correct initialization

// CENTRALIZED AGENT PERSONA
const SYSTEM_PROMPT = `You are the Hello Healthy Chief Synergy Agent. 
Professional, analytical, high-performance persona. 
Use terminology like 'Pulse', 'Helix', 'Neural Synergy', and 'Optimization'. 
Always return responses in the requested JSON format.`;

// --- BIOMETRIC SCANNER ROUTE ---
app.post('/api/analyze-biometrics', async (req, res) => {
  try {
    const { image } = req.body;
    const response = await ai.models.generateContent({ // Correct API call
      model: "gemini-3-flash-preview", // Updated model as per guidelines
      contents: [
        { inlineData: { mimeType: "image/jpeg", data: image } },
        { text: "Perform vitality audit on this specimen." }
      ],
      config: { // Correct config object
        systemInstruction: SYSTEM_PROMPT,
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
    // Correct way to get text
    const text = response.text;
    if (!text) {
      throw new Error("No text response from model");
    }
    res.json(JSON.parse(text)); 
  } catch (error) {
    console.error("Link Error:", error);
    res.status(500).json({ error: "Biometric Core Offline", details: error.message });
  }
});

// --- VOICE SYNTHESIS (TTS) ---
app.post('/api/speak-protocol', async (req, res) => {
  try {
    const { text } = req.body;
    const response = await ai.models.generateContent({ // Correct API call
      model: "gemini-2.5-flash-preview-tts", // Updated model as per guidelines
      contents: [{ parts: [{ text: `System Broadcast: ${text}` }] }],
      config: { // Correct config object
        responseModalities: [Modality.AUDIO], // Use Modality enum
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
      }
    });
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data; // Correct way to get data
    if (!audioData) {
      throw new Error("No audio data returned from model");
    }
    res.json({ audio: audioData });
  } catch (error) {
    console.error("Voice Core Failure:", error);
    res.status(500).json({ error: "Voice Core Failure", details: error.message });
  }
});

app.listen(3001, () => console.log("NEURAL CORE ONLINE: PORT 3001"));
