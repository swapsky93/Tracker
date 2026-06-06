import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "5mb" }));

const PORT = 3000;

// Lazy initialization of Gemini API
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Routes
app.post("/api/analyze", async (req, res) => {
  try {
    const { brand, query, aiResponseText } = req.body;

    if (!brand || !query || !aiResponseText) {
      return res.status(400).json({ error: "Missing required fields: brand, query, or aiResponseText." });
    }

    const ai = getGeminiClient();

    const promptObj = `You are an expert Digital Intelligence Analyst specializing in Generative Engine Optimization (GEO). 
    Your task is to analyze the following AI-generated search response and evaluate the presence and positioning of a target brand.

    Target Brand: "${brand.trim()}"
    Original User Query: "${query.trim()}"
    AI-Generated Response Text:
    """
    ${aiResponseText.trim()}
    """

    Instructions: Analyze visibility, sentiment, authority, competitors, and framing. 
    Use the Google Search tool provided to ground your analysis if necessary.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: promptObj,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are an objective expert GEO analyst. Adhere strictly to the JSON schema provided.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "Brand_Mentioned",
            "Sentiment",
            "Contextual_Authority",
            "Competitors_Mentioned",
            "Citation_Detected",
            "Recommendation_Priority",
            "Summary_of_Framing"
          ],
          properties: {
            Brand_Mentioned: { type: Type.BOOLEAN },
            Sentiment: { type: Type.NUMBER },
            Contextual_Authority: { type: Type.INTEGER },
            Competitors_Mentioned: { type: Type.ARRAY, items: { type: Type.STRING } },
            Citation_Detected: { type: Type.BOOLEAN },
            Recommendation_Priority: { type: Type.STRING },
            Summary_of_Framing: { type: Type.STRING }
          }
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      return res.status(500).json({ error: "Empty response from Gemini analysis." });
    }

    const parsed = JSON.parse(textOutput.trim());
    return res.json(parsed);

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return res.status(500).json({ error: error.message || "An error occurred during analysis." });
  }
});

// Configure Vite or Static Files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
