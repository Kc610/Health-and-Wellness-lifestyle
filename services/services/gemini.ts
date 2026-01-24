import { loadingTracker } from "./loading";

const PROXY_URL = "http://localhost:3001/api";

// Helper for proxy communication
async function coreFetch(endpoint: string, data: any) {
  loadingTracker.start();
  try {
    const response = await fetch(`${PROXY_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Neural Core Link Severed");
    return await response.json();
  } finally {
    loadingTracker.end();
  }
}

export const analyzeBiometrics = async (base64Image: string) => {
  return await coreFetch('/analyze-biometrics', { image: base64Image });
};

export const speakProtocol = async (text: string) => {
  const data = await coreFetch('/speak-protocol', { text });
  
  // Decoding the 24kHz PCM audio returned by Gemini
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const binaryString = atob(data.audio);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  
  // Normalize PCM16 to Float32
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
};