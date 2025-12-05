import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize the client only if the key exists to prevent immediate crashes, 
// though actual calls will fail gracefully if key is missing.
const ai = new GoogleGenAI({ apiKey });

export const generateBusinessInsight = async (prompt: string, context?: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please provide a valid API_KEY in the environment.";
  }

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
