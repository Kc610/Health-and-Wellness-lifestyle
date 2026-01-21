const express = require('express');
const cors = require('cors');
const { GoogleGenAI, Type } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const genAI = new GoogleGenAI(process.env.API_KEY);

// CENTRALIZED AGENT PERSONA
const SYSTEM_PROMPT = `You are the Hello Healthy Chief Synergy Agent. 
Professional, analytical, high-performance persona. 
Use terminology like 'Pulse', 'Helix', 'Neural Synergy', and 'Optimization'. 
Always return responses in the requested JSON format.`;

// --- BIOMETRIC SCANNER ROUTE ---
app.post('/api/analyze-biometrics', async (req, res) => {
  try {
    const { image } = req.body;
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent({
      contents: [
        { inlineData: { mimeType: "image/jpeg", data: image } },
        { text: "Perform vitality audit on this specimen." }
      ],
      generationConfig: {
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
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("Link Error:", error);
    res.status(500).json({ error: "Biometric Core Offline" });
  }
});

// --- VOICE SYNTHESIS (TTS) ---
app.post('/api/speak-protocol', async (req, res) => {
  try {
    const { text } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent({
      contents: [{ parts: [{ text: `System Broadcast: ${text}` }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
      }
    });
    const audioData = result.response.candidates[0].content.parts[0].inlineData.data;
    res.json({ audio: audioData });
  } catch (error) {
    res.status(500).json({ error: "Voice Core Failure" });
  }
});

app.listen(3001, () => console.log("NEURAL CORE ONLINE: PORT 3001"));