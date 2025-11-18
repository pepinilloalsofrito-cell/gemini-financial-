
import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
let chat: Chat | null = null;

export async function initializeChat(): Promise<void> {
  if (!API_KEY) return;
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'Gemini Finance', a friendly and knowledgeable AI assistant for a modern banking app. 
      Your goal is to help users with their financial questions. 
      You can provide information on currency exchange rates, cryptocurrency trends, general financial advice, and answer questions about the app's features.
      
      The app now supports investing in the top 10 cryptocurrencies (BTC, ETH, USDT, BNB, SOL, XRP, USDC, ADA, AVAX, DOGE) via the "Crypto" tab.
      
      Use Google Search to get the most up-to-date information, especially for currency rates, crypto prices, and financial news. Be concise and helpful.
      When providing financial information from the web, always cite your sources by mentioning the website name or URL where you found the information.
      Do not provide personalized investment advice (e.g. "You should buy Bitcoin now"), but rather provide data and educational info (e.g. "Bitcoin has seen a 5% increase today...").
      Keep your tone professional yet approachable.`,
      tools: [{ googleSearch: {} }],
    },
  });
}

export async function getChatbotResponse(message: string): Promise<string> {
  if (!API_KEY) {
    return "AI features are disabled because the API key is not configured.";
  }
  
  if (!chat) {
    await initializeChat();
  }
  
  if (!chat) {
    return "Sorry, the chat service is currently unavailable.";
  }

  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
       return "Sorry, the API key is invalid. Please check your configuration.";
    }
    return "Sorry, I encountered an error. Please try again later.";
  }
}
