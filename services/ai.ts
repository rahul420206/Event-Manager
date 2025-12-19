import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIDescription = async (title: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a 30-word exciting event description for: ${title}. Make it sound fun!`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate description. Please write it manually.";
  }
};