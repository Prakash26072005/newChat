import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'; // Loads the .env variables into process.env

// Initialize the client. It automatically picks up process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

export const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Check if the user actually sent a prompt
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Call the Gemini API directly using the prompt from the request
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    // Send the AI's response text back to the client
    res.status(200).json({
      reply: response.text,
    });

  } catch (err) {
    console.error("Gemini API Error:", err);

    res.status(500).json({
      error: "AI Error processing your request",
    });
  }
};
