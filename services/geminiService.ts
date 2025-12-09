import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBusinessInsight = async (prompt: string, context?: string): Promise<string> => {
  try {
    const fullPrompt = `
      You are an expert business consultant for a tech company named 'R Tech'.
      
      Context provided: ${context || 'General tech company advice'}
      
      User Query: ${prompt}
      
      Please provide a concise, actionable, and professional response.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI assistant.";
  }
};