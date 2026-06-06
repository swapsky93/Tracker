import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai"; // npm install openai
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "5mb" }));

const PORT = 3000;

// ── Gemini Client (existing) ──────────────────────────────────────────────────
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is required.");
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// ── NVIDIA NIM Client (NEW) ───────────────────────────────────────────────────
// Get your free key at: https://build.nvidia.com → Sign up → Get API Key
let nvidiaClient: OpenAI | null = null;
function getNvidiaClient(): OpenAI {
  if (!nvidiaClient) {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) throw new Error("NVIDIA_API_KEY is required.");
    nvidiaClient = new OpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey,
    });
  }
  return nvidiaClient;
}

// ── NEW: Auto-fetch AI response using NVIDIA NIM ──────────────────────────────
// This replaces the manual copy-paste step from Google AI Overview
async function fetchAIResponse(query: string, engine: string): Promise<string> {
  try {
    const nvidia = getNvidiaClient();

    const engineContext: Record<string, string> = {
      "Google Search Overview": "Google AI Overview (SGE)",
      "Perplexity": "Perplexity AI",
      "ChatGPT Search": "ChatGPT with web search",
      "Gemini": "Google Gemini",
      "Claude": "Anthropic Claude",
      "Apple Intelligence": "Apple Intelligence",
      "Meta AI": "Meta AI",
    };

    const engineLabel = engineContext[engine] || engine;

    const completion = await nvidia.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [
        {
          role: "system",
          content: `You are simulating a ${engineLabel} search response. 
Given a search query, generate a realistic, factual AI-generated overview response 
as ${engineLabel} would show it — 150-280 words, mentioning relevant brands, 
products, and competitors naturally. Be objective and informative. 
Do NOT say you are simulating — just write the response directly.`,
        },
        {
          role: "user",
          content: `Generate a ${engineLabel} response for this query: ${query}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.4,
    });

    return completion.choices[0]?.message?.content?.trim() ?? "";
  } catch (err: any) {
    console.error("NVIDIA NIM fetch error:", err.message);
    throw new Error("Failed to auto-fetch AI response from NVIDIA NIM.");
  }
}

// ── NEW: Dynamically extract competitors using NVIDIA NIM ─────────────────────
// Replaces hardcoded competitor list — now dynamically reads from response text
async function extractCompetitors(brand: string, responseText: string): Promise<string[]> {
  try {
    const nvidia = getNvidiaClient();

    const completion = await nvidia.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [
        {
          role: "system",
          content: `You are a brand analyst. Extract all competitor brand names mentioned in the given text.
Return ONLY a valid JSON array of strings like: ["Brand1", "Brand2", "Brand3"]
No markdown, no explanation, no code blocks. Just the raw JSON array.`,
        },
        {
          role: "user",
          content: `Target brand to EXCLUDE: "${brand}"
          
Text to analyze:
"""
${responseText}
"""

Extract all competitor/other brand names mentioned (exclude "${brand}" itself):`,
        },
      ],
      max_tokens: 200,
      temperature: 0.1,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "[]";
    // Strip any accidental markdown
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err: any) {
    console.error("Competitor extraction error:", err.message);
    return []; // graceful fallback — don't break the whole audit
  }
}

// ── UPDATED: /api/analyze — now with auto-fetch + dynamic competitors ─────────
app.post("/api/analyze", async (req, res) => {
  try {
    const { brand, query, aiResponseText, engine } = req.body;

    if (!brand || !query) {
      return res.status(400).json({ error: "Missing required fields: brand and query." });
    }

    // ── STEP 1: Auto-fetch AI response if not provided ────────────────────────
    // If user left the textarea empty OR sent an empty string, auto-fetch it
    let resolvedAiResponse: string = aiResponseText?.trim() ?? "";

    if (!resolvedAiResponse) {
      console.log(`[Auto-fetch] No AI response provided. Fetching for query: "${query}" on engine: "${engine}"`);
      resolvedAiResponse = await fetchAIResponse(query, engine || "Google Search Overview");
      console.log(`[Auto-fetch] Fetched ${resolvedAiResponse.length} chars successfully.`);
    }

    // ── STEP 2: Extract competitors dynamically via NVIDIA NIM ────────────────
    const dynamicCompetitors = await extractCompetitors(brand, resolvedAiResponse);
    console.log(`[Competitors] Detected: ${dynamicCompetitors.join(", ")}`);

    // ── STEP 3: Run GEO analysis via Gemini (your existing logic) ─────────────
    const ai = getGeminiClient();

    const promptObj = `You are an expert Digital Intelligence Analyst specializing in GEO.
Analyze the following AI response for the brand "${brand.trim()}" regarding the query "${query.trim()}".

AI Response:
"""${resolvedAiResponse}"""

The following competitors have already been detected in this response: ${dynamicCompetitors.join(", ") || "none"}.
Include them in your Competitors_Mentioned field.

Output your analysis STRICTLY as a single JSON object. Do not include markdown formatting, code blocks, or explanations. Use this schema:
{
  "Brand_Mentioned": boolean,
  "Sentiment": number (between -1.0 and 1.0),
  "Contextual_Authority": number (integer 1-5),
  "Competitors_Mentioned": string[],
  "Citation_Detected": boolean,
  "Recommendation_Priority": string,
  "Summary_of_Framing": string
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptObj,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are an objective expert GEO analyst. Output only valid JSON.",
      },
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("Empty response from Gemini AI.");

    const cleanJson = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    // ── STEP 4: Return result + the auto-fetched AI response back to frontend ──
    // Frontend uses `autoFetchedAiResponse` to populate the textarea automatically
    return res.json({
      ...parsed,
      Competitors_Mentioned: dynamicCompetitors.length > 0 ? dynamicCompetitors : (parsed.Competitors_Mentioned ?? []),
      autoFetchedAiResponse: resolvedAiResponse, // ← NEW: sent back to frontend
    });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return res.status(500).json({ error: error.message || "An error occurred." });
  }
});

// ── NEW: /api/fetch-response — standalone endpoint to just fetch AI response ──
// Called when user clicks a "Fetch" button next to the textarea
app.post("/api/fetch-response", async (req, res) => {
  try {
    const { query, engine } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required." });

    const aiResponse = await fetchAIResponse(query, engine || "Google Search Overview");
    return res.json({ aiResponse });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ── Server setup (unchanged) ──────────────────────────────────────────────────
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
}

startServer();
