import { GoogleGenAI } from "@google/genai";
import { Faculty } from "../types";
import { SYSTEM_INSTRUCTION_BASE } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateChatResponse = async (
  message: string,
  facultyData: Faculty[],
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  const client = getClient();
  if (!client) return "I'm sorry, I cannot connect to the server right now (Missing API Key).";

  // Inject real-time faculty status into the system instruction or context
  const facultyStatusSummary = facultyData.map(f => 
    `${f.name} (${f.department}): ${f.status} (Next: ${f.nextAvailableSlot || 'Unknown'})`
  ).join('\n');

  const systemInstruction = `
    ${SYSTEM_INSTRUCTION_BASE}
    
    CURRENT FACULTY STATUS (Real-time data):
    ${facultyStatusSummary}
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I didn't get a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble retrieving information right now. Please try again later.";
  }
};
