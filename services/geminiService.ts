
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getAIExplanation = async (
  topic: string, 
  context: string, 
  query: string
) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Context from textbook: ${context}\n\nUser Question about "${topic}": ${query}`,
      config: {
        systemInstruction: `You are an expert Professor of Robotics and a Lead Software Engineer for Humanoid Systems. 
        Your goal is to explain complex physical humanoid robotics concepts with mathematical rigor and practical code implementation. 
        
        RULES:
        1. Use LaTeX for mathematical formulas (enclose in $ or $$).
        2. Provide high-quality, production-ready code examples in C++ (using Eigen/Pinocchio) or Python (using PyBullet/NumPy).
        3. For derivations, break them down step-by-step (e.g., from Lagrangian to Equations of Motion).
        4. Use clear headings and bullet points.
        5. If asked for a "Python Snippet" or "Math Derivation", be extremely thorough and focus on that specific modality.`,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
};

export const generateQuiz = async (chapterTitle: string, content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a challenging 3-question multiple choice quiz based on this chapter: ${chapterTitle}. Content: ${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              question: { type: "STRING" },
              options: { type: "ARRAY", items: { type: "STRING" } },
              correctIndex: { type: "INTEGER" },
              explanation: { type: "STRING" }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    return [];
  }
};
