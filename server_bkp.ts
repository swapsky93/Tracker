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
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in the Secrets configuration panel.");
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

    if (!brand || !brand.trim()) {
      return res.status(400).json({ error: "Target Brand is required." });
    }
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Original User Query is required." });
    }
    if (!aiResponseText || !aiResponseText.trim()) {
      return res.status(400).json({ error: "AI Response Text is required." });
    }

    const ai = getGeminiClient();

    const promptObj = `You are an expert Digital Intelligence Analyst specializing in Generative Engine Optimization (GEO). 
Your task is to analyze the following AI-generated search response and evaluate the presence and positioning of a target brand.

Target Brand: "${brand.trim()}"
Original User Query: "${query.trim()}"
AI-Generated Response Text to Analyze:
"""
${aiResponseText.trim()}
"""

Instructions:
Evaluate how the AI search engine has positioned the Target Brand and analyze its visibility, sentiment, authority, competitors, and framing. Be highly objective, scientific, and rigorous.
If the Target Brand is not mentioned anywhere in the response text, you must return false for Brand_Mentioned, null for Sentiment, null for Contextual_Authority, false for Citation_Detected, "Not mentioned" for Recommendation_Priority, and a clear statement "The brand is not mentioned in the response." for Summary_of_Framing.
If the brand IS mentioned, carefully score Sentiment on a continuous scale from -1.0 (extremely negative/disparaging) to 1.0 (extremely positive/uncontested endorsement). Neutral mentions should be around 0.0.
Score Contextual_Authority from 1 to 5:
- 5: Brand is the market leader or primary/first recommendation.
- 4: Brand is a tier-1 highly recommended option alongside competitors.
- 3: Brand is listed as one of several normal choices.
- 2: Brand is mentioned only in passing or marginally.
- 1: Brand is mentioned only in background or as a footnote/negative context.

Extract competitors in Competitors_Mentioned (excluding the target brand itself). 
Determine whether a citation or external source hyperlink/citation token (like [1], [source], or direct clickable links) is detected near the brand mention.
Identify the recommendation priority position (e.g. 'First paragraph', 'In a list', 'Concluding recommendation', 'Not mentioned').
Generate an objective, highly informative Summary_of_Framing (exactly one sentence describe how the AI framed/described the brand).

Please output a JSON structure adhering strictly to the requested schema.`;

    // const response = await ai.models.generateContent({
    //   model: "gemini-3.5-flash",
    //   contents: promptObj,
    //   config: {
    //     systemInstruction: "You are an objective expert GEO analyst. Be precise in analyzing mentions and sentiment. Adhere strictly to the requested schema.",
    //     responseMimeType: "application/json",
    //     responseSchema: {
    //       type: Type.OBJECT,
    //       required: [
    //         "Brand_Mentioned",
    //         "Sentiment",
    //         "Contextual_Authority",
    //         "Competitors_Mentioned",
    //         "Citation_Detected",
    //         "Recommendation_Priority",
    //         "Summary_of_Framing"
    //       ],
    //       properties: {
    //         Brand_Mentioned: {
    //           type: Type.BOOLEAN,
    //           description: "Whether the brand is mentioned or referred to in the AI response."
    //         },
    //         Sentiment: {
    //           type: Type.NUMBER,
    //           description: "Scale from -1.0 (Highly Negative) to 1.0 (Highly Positive). Set to null if Brand_Mentioned is false."
    //         },
    //         Contextual_Authority: {
    //           type: Type.INTEGER,
    //           description: "1-5 scale. Set to null if Brand_Mentioned is false."
    //         },
    //         Competitors_Mentioned: {
    //           type: Type.ARRAY,
    //           items: {
    //             type: Type.STRING
    //           },
    //           description: "List of other brands or competing products mentioned in the same response."
    //         },
    //         Citation_Detected: {
    //           type: Type.BOOLEAN,
    //           description: "Whether a link, source link, or citation tag is detected for the brand."
    //         },
    //         Recommendation_Priority: {
    //           type: Type.STRING,
    //           description: "Where in the response was the brand positioned? E.g., 'First paragraph', 'In a list', 'Concluding recommendation', 'Not mentioned'."
    //         },
    //         Summary_of_Framing: {
    //           type: Type.STRING,
    //           description: "Exactly one short, objective sentence summarizing how the AI response frames the brand."
    //         }
    //       }
    //     }
    //   }
    // });

    // Replace your existing ai.models.generateContent block with this:
const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: promptObj,
  config: {
    // 1. ADD THIS TOOL CONFIGURATION
    tools: [{ googleSearch: {} }], 
    
    // 2. Keep your existing instructions
    systemInstruction: "You are an objective expert GEO analyst. Use the Google Search tool to find live information about the query and the brand before analyzing.",
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
        // ... (Keep your existing properties exactly as they are)
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

    try {
      const parsed = JSON.parse(textOutput.trim());
      return res.json(parsed);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response as JSON:", textOutput);
      return res.status(500).json({ error: "Failed to parse analysis metadata.", rawText: textOutput });
    }

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return res.status(500).json({ error: error.message || "An error occurred during search analysis." });
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
