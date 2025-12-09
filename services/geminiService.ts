import { GoogleGenAI } from "@google/genai";

export const generateBusinessInsight = async (prompt: string, context?: string): Promise<string> => {
  try {
    // Initialize the client inside the function to avoid runtime crashes on app load
    // if the environment variable is missing or malformed.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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
    return "An error occurred while communicating with the AI assistant. Please check your API Key configuration.";
  }
};