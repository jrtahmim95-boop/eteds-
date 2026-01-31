
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Parses natural language into a structured log entry.
 */
export const parseVoiceCommand = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert life-tracking assistant. Parse the following natural language tracking command into structured data.
    
    Rules:
    1. Category MUST be one of: Sleep, Study, Sports, Expense, Income, Prayer, Mood, General.
    2. If the user is vague (e.g., "I ran"), suggest 'Sports' and a default value of 1 hour or unit.
    3. Input: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          value: { type: Type.NUMBER },
          unit: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["category", "value", "unit", "description"],
      },
    },
  });

  try {
    return JSON.parse(response.text?.trim() || "{}");
  } catch (e) {
    return null;
  }
};

/**
 * Specialized parser for Vault commands.
 * Extracts labels and passwords from voice.
 */
export const parseVaultCommand = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a secure vault assistant. Extract the service/label and the password/value from the following request.
    
    Example: "Save my Netflix password as secure123" -> { "label": "Netflix", "value": "secure123", "category": "Personal" }
    
    Input: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "Name of the service or item." },
          value: { type: Type.STRING, description: "The actual password or sensitive value." },
          category: { type: Type.STRING, description: "Personal, Finance, Work, or Social." },
        },
        required: ["label", "value", "category"],
      },
    },
  });

  try {
    return JSON.parse(response.text?.trim() || "{}");
  } catch (e) {
    return null;
  }
};

export const searchGrounding = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: { tools: [{ googleSearch: {} }] },
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const mapsGrounding = async (query: string, location?: { latitude: number, longitude: number }) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: location ? {
          latLng: { latitude: location.latitude, longitude: location.longitude }
        } : undefined
      }
    },
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const deepThink = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 32768 } },
  });
  return response.text;
};

export const generateImage = async (prompt: string, aspectRatio: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: "1K"
      }
    },
  });
  
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16') => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });
  
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

export const analyzeImage = async (base64Data: string, mimeType: string, prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: prompt }
      ]
    }
  });
  return response.text;
};

export const textToSpeech = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const getQuickSummary = async (role: string, logs: any[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As an AI assistant for a ${role}, summarize these recent logs and give a 1-sentence productivity tip: ${JSON.stringify(logs.slice(0,5))}`,
  });
  return response.text;
};
