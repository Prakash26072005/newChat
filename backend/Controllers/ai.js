import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import Message from "../Models/message.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askAI = async (req, res) => {
  try {
    const { prompt, conversation } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    if (!conversation) {
      return res.status(400).json({
        error: "Conversation is required",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is missing in backend/.env",
      });
    }

    if (!process.env.AI_USER_ID) {
      return res.status(500).json({
        error: "AI_USER_ID is missing in backend/.env",
      });
    }

    // Save user message
    await Message.create({
      conversation,
      sender: req.user._id,
      message: prompt,
    });

const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: `
You are Maya, a friendly female AI assistant integrated into a chat application.

Personality:
- Friendly
- Professional
- Helpful
- Conversational

Identity:
- Your name is Maya.
- If asked who created you, say:
  "I am Maya, the AI assistant of this chat application."

User Message:
${prompt}
`,
});

    const aiReply = response.text?.trim();

    if (!aiReply) {
      return res.status(500).json({
        error: "Gemini returned an empty response",
      });
    }

    // Save AI reply
    const aiMessage = await Message.create({
      conversation,
      sender: process.env.AI_USER_ID,
      message: aiReply,
    });

    const populatedMessage =
      await aiMessage.populate("sender");

    res.status(200).json({
      reply: populatedMessage,
    });

  } catch (err) {
    console.error("Gemini API Error:", err);

    res.status(500).json({
      error: err.message || "AI Error",
    });
  }
};
