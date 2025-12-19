import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEventDescription = async (title: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a short, exciting description for an event titled: "${title}". Keep it under 50 words.`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error generating description. Please try again.";
  }
};