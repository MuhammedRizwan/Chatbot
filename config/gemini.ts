// Configures access to the Gemini API client for the backend.
import { GoogleGenerativeAI } from "@google/generative-ai";

// Shared Gemini client instance.
export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Helper to get the default Gemini model.
export const getGeminiModel = () =>
  genAI.getGenerativeModel({ model: "gemini-2.5-flash" });