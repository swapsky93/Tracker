// import express from "express";
// import path from "path";
// import { createServer as createViteServer } from "vite";
// import { GoogleGenAI } from "@google/genai";
// import OpenAI from "openai"; // npm install openai
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(express.json({ limit: "5mb" }));

// const PORT = 3000;

// // ── Gemini Client (existing) ──────────────────────────────────────────────────
// let aiClient: GoogleGenAI | null = null;
// function getGeminiClient(): GoogleGenAI {
//   if (!aiClient) {
//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) throw new Error("GEMINI_API_KEY is required.");
//     aiClient = new GoogleGenAI({ apiKey });
//   }
//   return aiClient;
// }

// // ── NVIDIA NIM Client (NEW) ───────────────────────────────────────────────────
// // Get your free key at: https://build.nvidia.com → Sign up → Get API Key
// let nvidiaClient: OpenAI | null = null;
// function getNvidiaClient(): OpenAI {
//   if (!nvidiaClient) {
//     const apiKey = process.env.NVIDIA_API_KEY;
//     if (!apiKey) throw new Error("NVIDIA_API_KEY is required.");
//     nvidiaClient = new OpenAI({
//       baseURL: "https://integrate.api.nvidia.com/v1",
//       apiKey,
//     });
//   }
//   return nvidiaClient;
// }

// // ── NEW: Auto-fetch AI response using NVIDIA NIM ──────────────────────────────
// // This replaces the manual copy-paste step from Google AI Overview
// async function fetchAIResponse(query: string, engine: string): Promise<string> {
//   try {
//     const nvidia = getNvidiaClient();

//     const engineContext: Record<string, string> = {
//       "Google Search Overview": "Google AI Overview (SGE)",
//       "Perplexity": "Perplexity AI",
//       "ChatGPT Search": "ChatGPT with web search",
//       "Gemini": "Google Gemini",
//       "Claude": "Anthropic Claude",
//       "Apple Intelligence": "Apple Intelligence",
//       "Meta AI": "Meta AI",
//     };

//     const engineLabel = engineContext[engine] || engine;

//     const completion = await nvidia.chat.completions.create({
//       model: "meta/llama-3.3-70b-instruct",
//       messages: [
//         {
//           role: "system",
//           content: `You are simulating a ${engineLabel} search response. 
// Given a search query, generate a realistic, factual AI-generated overview response 
// as ${engineLabel} would show it — 150-280 words, mentioning relevant brands, 
// products, and competitors naturally. Be objective and informative. 
// Do NOT say you are simulating — just write the response directly.`,
//         },
//         {
//           role: "user",
//           content: `Generate a ${engineLabel} response for this query: ${query}`,
//         },
//       ],
//       max_tokens: 500,
//       temperature: 0.4,
//     });

//     return completion.choices[0]?.message?.content?.trim() ?? "";
//   } catch (err: any) {
//     console.error("NVIDIA NIM fetch error:", err.message);
//     throw new Error("Failed to auto-fetch AI response from NVIDIA NIM.");
//   }
// }


// async function extractCompetitors(brand: string, responseText: string, query: string): Promise<string[]> {
//   try {
//     const nvidia = getNvidiaClient();
//     const completion = await nvidia.chat.completions.create({
//       model: "meta/llama-3.3-70b-instruct",
//       messages: [
//         {
//           role: "system",
//           content: `You are a strict brand analyst. Extract ONLY competitor brand names that are:
// 1. Directly mentioned in the provided text
// 2. In the SAME industry/category as the target brand
// 3. Actually relevant to the user query

// Return ONLY a valid JSON array like: ["Brand1", "Brand2"]
// If no valid competitors found, return: []
// No markdown, no explanation. Raw JSON array only.`,
//         },
//         {
//           role: "user",
//           content: `Target brand: "${brand}"
// User query: "${query}"

// Text to analyze (ONLY extract brands mentioned IN THIS TEXT, same industry as "${brand}"):
// """
// ${responseText}
// """

// Rules:
// - ONLY brands explicitly mentioned in the text above
// - ONLY brands in the same category as "${brand}"
// - NEVER add brands not present in the text
// - NEVER include "${brand}" itself
// - If unsure about relevance, exclude it

// Return JSON array:`,
//         },
//       ],
//       max_tokens: 200,
//       temperature: 0.0,
//     });

//     const raw = completion.choices[0]?.message?.content?.trim() ?? "[]";
//     // Strip any accidental markdown
//     const clean = raw.replace(/```json|```/g, "").trim();
//     const parsed = JSON.parse(clean);
//     return Array.isArray(parsed) ? parsed : [];
//   } catch (err: any) {
//     console.error("Competitor extraction error:", err.message);
//     return []; // graceful fallback — don't break the whole audit
//   }
// }

// // ── UPDATED: /api/analyze — now with auto-fetch + dynamic competitors ─────────
// app.post("/api/analyze", async (req, res) => {
//   try {
//     const { brand, query, aiResponseText, engine } = req.body;

//     if (!brand || !query) {
//       return res.status(400).json({ error: "Missing required fields: brand and query." });
//     }

//     // ── STEP 1: Auto-fetch AI response if not provided ────────────────────────
//     // If user left the textarea empty OR sent an empty string, auto-fetch it
//     let resolvedAiResponse: string = aiResponseText?.trim() ?? "";

//     if (!resolvedAiResponse) {
//       console.log(`[Auto-fetch] No AI response provided. Fetching for query: "${query}" on engine: "${engine}"`);
//       resolvedAiResponse = await fetchAIResponse(query, engine || "Google Search Overview");
//       console.log(`[Auto-fetch] Fetched ${resolvedAiResponse.length} chars successfully.`);
//     }

//     // ── STEP 2: Extract competitors dynamically via NVIDIA NIM ────────────────
//     // const dynamicCompetitors = await extractCompetitors(brand, resolvedAiResponse); //orig
//     const dynamicCompetitors = await extractCompetitors(brand, resolvedAiResponse, query);
//     console.log(`[Competitors] Detected: ${dynamicCompetitors.join(", ")}`);

//     // ── STEP 3: Run GEO analysis via Gemini (your existing logic) ─────────────
//     const ai = getGeminiClient();

//     const promptObj = `You are an expert Digital Intelligence Analyst specializing in GEO.
// Analyze the following AI response for the brand "${brand.trim()}" regarding the query "${query.trim()}".

// AI Response:
// """${resolvedAiResponse}"""

// The following competitors have already been detected in this response: ${dynamicCompetitors.join(", ") || "none"}.
// Include them in your Competitors_Mentioned field.

// Output your analysis STRICTLY as a single JSON object. Do not include markdown formatting, code blocks, or explanations. Use this schema:
// {
//   "Brand_Mentioned": boolean,
//   "Sentiment": number (between -1.0 and 1.0),
//   "Contextual_Authority": number (integer 1-5),
//   "Competitors_Mentioned": string[],
//   "Citation_Detected": boolean,
//   "Recommendation_Priority": string,
//   "Summary_of_Framing": string
// }`;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: promptObj,
//       config: {
//         tools: [{ googleSearch: {} }],
//         systemInstruction: "You are an objective expert GEO analyst. Output only valid JSON.",
//       },
//     });

//     const textOutput = response.text;
//     if (!textOutput) throw new Error("Empty response from Gemini AI.");

//     const cleanJson = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();
//     const parsed = JSON.parse(cleanJson);

//     // ── STEP 4: Return result + the auto-fetched AI response back to frontend ──
//     // Frontend uses `autoFetchedAiResponse` to populate the textarea automatically
//     return res.json({
//       ...parsed,
//       Competitors_Mentioned: dynamicCompetitors.length > 0 ? dynamicCompetitors : (parsed.Competitors_Mentioned ?? []),
//       autoFetchedAiResponse: resolvedAiResponse, // ← NEW: sent back to frontend
//     });

//   } catch (error: any) {
//     console.error("Analysis Error:", error);
//     return res.status(500).json({ error: error.message || "An error occurred." });
//   }
// });

// // ── NEW: /api/fetch-response — standalone endpoint to just fetch AI response ──
// // Called when user clicks a "Fetch" button next to the textarea
// app.post("/api/fetch-response", async (req, res) => {
//   try {
//     const { query, engine } = req.body;
//     if (!query) return res.status(400).json({ error: "Query is required." });

//     const aiResponse = await fetchAIResponse(query, engine || "Google Search Overview");
//     return res.json({ aiResponse });
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// });

// // ── Server setup (unchanged) ──────────────────────────────────────────────────
// async function startServer() {
//   if (process.env.NODE_ENV !== "production") {
//     const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
//     app.use(vite.middlewares);
//   } else {
//     const distPath = path.join(process.cwd(), "dist");
//     app.use(express.static(distPath));
//     app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
//   }
//   app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
// }

// startServer();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "5mb" }));

const PORT = process.env.PORT || 3000;

// ── Gemini Client ─────────────────────────────────────────────────────────────
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is required.");
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// ── NVIDIA NIM Client ─────────────────────────────────────────────────────────
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

// ── Auto-fetch AI response (NVIDIA NIM only — no SerpAPI) ────────────────────
async function fetchAIResponse(query: string, engine: string): Promise<{ text: string; citations: string[] }> {
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

  try {
    const nvidia = getNvidiaClient();
    const completion = await nvidia.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [
        {
          role: "system",
          content: `You are simulating a ${engineLabel} search response.
Write a realistic, factual response of 150-280 words for the given query.
Naturally mention real competing brands that actually exist in that market and location.
If it is a local business query, mention actual known local and national competitors by name.
Do NOT say you are simulating — just write the response directly.`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      max_tokens: 500,
      temperature: 0.4,
    });
    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    return { text, citations: [] };
  } catch (err: any) {
    console.error("[NVIDIA NIM] Error:", err.message);
    throw new Error("Failed to fetch AI response from NVIDIA NIM.");
  }
}

// ── Dynamically extract competitors using NVIDIA NIM ──────────────────────────
async function extractCompetitors(brand: string, responseText: string, query: string): Promise<string[]> {
  try {
    const nvidia = getNvidiaClient();
    const completion = await nvidia.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [
        {
          role: "system",
          content: `You are a strict brand analyst. Extract ONLY competitor brand names that are:
1. Directly mentioned in the provided text
2. In the SAME industry/category as the target brand
3. Actually relevant to the user query

Return ONLY a valid JSON array like: ["Brand1", "Brand2"]
If no valid competitors found, return: []
No markdown, no explanation. Raw JSON array only.`,
        },
        {
          role: "user",
          content: `Target brand: "${brand}"
User query: "${query}"

Text to analyze (ONLY extract brands mentioned IN THIS TEXT, same industry as "${brand}"):
"""
${responseText}
"""

Rules:
- ONLY brands explicitly mentioned in the text above
- ONLY brands in the same category as "${brand}"
- NEVER add brands not present in the text
- NEVER include "${brand}" itself
- If unsure about relevance, exclude it

Return JSON array:`,
        },
      ],
      max_tokens: 200,
      temperature: 0.0,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "[]";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err: any) {
    console.error("[Competitors] Extraction error:", err.message);
    return [];
  }
}

// ── POST /api/analyze ─────────────────────────────────────────────────────────
app.post("/api/analyze", async (req, res) => {
  try {
    const { brand, query, aiResponseText, engine } = req.body;

    if (!brand || !query) {
      return res.status(400).json({ error: "Missing required fields: brand and query." });
    }

    // STEP 1: Auto-fetch AI response if not provided
    let resolvedAiResponse: string = aiResponseText?.trim() ?? "";
    let resolvedCitations: string[] = [];

    if (!resolvedAiResponse) {
      console.log(`[Auto-fetch] Fetching for: "${query}" on engine: "${engine}"`);
      const fetched = await fetchAIResponse(query, engine || "Google Search Overview");
      resolvedAiResponse = fetched.text;
      resolvedCitations = fetched.citations;
      console.log(`[Auto-fetch] Got ${resolvedAiResponse.length} chars.`);
    }

    // STEP 2: Extract competitors dynamically
    const dynamicCompetitors = await extractCompetitors(brand, resolvedAiResponse, query);
    console.log(`[Competitors] Detected: ${dynamicCompetitors.join(", ") || "none"}`);

    // STEP 3: GEO analysis via Gemini
    const ai = getGeminiClient();

    const promptObj = `You are an expert Digital Intelligence Analyst specializing in GEO.
Analyze the following AI response for the brand "${brand.trim()}" regarding the query "${query.trim()}".

AI Response:
"""${resolvedAiResponse}"""

The following competitors have already been detected in this response: ${dynamicCompetitors.join(", ") || "none"}.
Include them in your Competitors_Mentioned field.

Output your analysis STRICTLY as a single JSON object. No markdown, no code blocks:
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

    return res.json({
      ...parsed,
      Competitors_Mentioned: dynamicCompetitors.length > 0 ? dynamicCompetitors : (parsed.Competitors_Mentioned ?? []),
      Citation_Detected: resolvedCitations.length > 0 || parsed.Citation_Detected,
      autoFetchedAiResponse: resolvedAiResponse,
      citations: resolvedCitations,
    });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return res.status(500).json({ error: error.message || "An error occurred." });
  }
});

// ── POST /api/fetch-response ──────────────────────────────────────────────────
app.post("/api/fetch-response", async (req, res) => {
  try {
    const { query, engine } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required." });

    const { text, citations } = await fetchAIResponse(query, engine || "Google Search Overview");
    return res.json({ aiResponse: text, citations });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ── POST /api/brand-audit ─────────────────────────────────────────────────────
// Uses ONLY Gemini + Google Search grounding — no SerpAPI needed
app.post("/api/brand-audit", async (req, res) => {
  try {
    const { brand, website, industry } = req.body;
    if (!brand) return res.status(400).json({ error: "Brand name is required." });

    const ai = getGeminiClient();

    // CALL 1: Full SEO + GEO Audit via Gemini with live Google Search
    const seoPrompt = `You are an expert SEO analyst. Using Google Search, research the following brand thoroughly and analyze its online presence.

Brand Name: "${brand}"
Website: "${website || "unknown — search for it"}"
Industry: "${industry || "search and determine from context"}"

Search Google for:
1. The brand's actual website and homepage content
2. "${brand} site:${website || brand.toLowerCase().replace(/\s+/g, "")}.com" to find indexed pages
3. "${brand} ${industry || ""} reviews competitors"
4. "best ${industry || "alternatives"} alternatives to ${brand}"
5. "${brand} ${industry || ""} ${website ? website.split(".")[0] : ""}"

Based on your Google Search findings, provide a COMPLETE audit as a single JSON object. Use REAL data from search results wherever possible. Be specific and accurate.

Return ONLY this JSON schema (no markdown, no code blocks):

{
  "overallScore": <number 0-100 based on actual online presence>,
  "scoreLabel": <"Excellent" | "Good" | "Needs Work" | "Critical">,
  "issuesSummary": {
    "critical": <number of critical issues found>,
    "needsWork": <number of moderate issues>,
    "wins": <number of positive signals>
  },
  "trafficOpportunity": {
    "additionalVisitsPerMonth": <realistic estimate based on keyword gaps>,
    "currentEstimatedVisits": <estimated current monthly visits>,
    "potentialVisits": <current + additional>,
    "multipleOfCurrentTraffic": <"2.5" format string>,
    "timeframe": "6 months"
  },
  "seoSignals": {
    "title": <actual page title if found via search, else best guess>,
    "metaDescriptionLength": <estimated character count>,
    "h1Count": <estimated number>,
    "httpsEnabled": <true if website uses https>,
    "imagesMissingAlt": <estimated number>,
    "totalImages": <estimated number>,
    "schemaMarkup": <true | false based on search snippets>,
    "openGraphTags": <true | false>
  },
  "categoryScores": [
    { "category": "Image Optimization", "score": <0-100>, "details": [<2-3 specific findings>] },
    { "category": "Heading Structure", "score": <0-100>, "details": [<2-3 specific findings>] },
    { "category": "Technical SEO", "score": <0-100>, "details": [<2-3 specific findings>] },
    { "category": "Content Quality", "score": <0-100>, "details": [<2-3 specific findings>] },
    { "category": "Meta Tags & Open Graph", "score": <0-100>, "details": [<2-3 specific findings>] }
  ],
  "keywordOpportunities": [
    {
      "keyword": <real relevant keyword for this brand/industry>,
      "volumePerMonth": <realistic monthly search volume>,
      "currentRank": <"not ranking" or "#N">,
      "potentialRank": <"3" as string>,
      "visitLift": <realistic visit increase>,
      "beatingYou": <actual competitor domain beating them>
    }
  ],
  "competitorsBeatYou": [
    {
      "rank": <1-5>,
      "domain": <real competitor domain>,
      "outranksOnKeywords": <number>,
      "visitsAtRisk": <realistic number>
    }
  ],
  "whatsWorking": [<3-4 genuine positive findings from search>],
  "topSuggestions": [
    { "priority": 1, "title": <specific actionable title>, "description": <detailed specific action> },
    { "priority": 2, "title": <specific actionable title>, "description": <detailed specific action> },
    { "priority": 3, "title": <specific actionable title>, "description": <detailed specific action> },
    { "priority": 4, "title": <specific actionable title>, "description": <detailed specific action> }
  ],
  "biggestOpportunity": {
    "title": <the single biggest gap>,
    "score": <urgency score 0-100>,
    "details": [<2-3 specifics>]
  },
  "geoRemediation": {
    "contentGaps": [<3-4 specific content pieces missing for AI visibility>],
    "citationOpportunities": [<3-4 specific directories, platforms to get cited on>],
    "entityStrengthening": [<3-4 ways to strengthen brand entity for AI engines>],
    "aiVisibilityFixes": [<3-4 specific fixes to appear in ChatGPT, Gemini, Perplexity responses>]
  }
}`;

    const seoResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: seoPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are an expert SEO and GEO analyst.
Always use the Google Search tool to find REAL, CURRENT data about the brand before generating the audit.
Search multiple times with different queries to gather comprehensive data.
Output only valid JSON — no markdown, no code blocks, no explanation.`,
      },
    });

    const seoText = seoResponse.text;
    if (!seoText) throw new Error("Empty response from Gemini SEO analysis.");

    // CALL 2: Competitor & keyword deep dive
    const competitorPrompt = `You are an expert competitive SEO analyst. Search Google to find real competitors and keyword data for:

Brand: "${brand}"
Industry: "${industry || "determine from context"}"
Website: "${website || "search for it"}"

Search for:
1. "top ${industry || "brands"} competitors ${brand}"
2. "${industry || brand} near me" or "${industry || brand} in India"
3. "${brand} vs [competitor]" searches
4. Best keywords this brand SHOULD rank for but probably doesn't

Return a JSON object with ONLY these two arrays (real data from search):

{
  "additionalKeywords": [
    {
      "keyword": <real high-value keyword>,
      "volumePerMonth": <realistic volume>,
      "currentRank": <"not ranking" or "#N">,
      "potentialRank": "3",
      "visitLift": <number>,
      "beatingYou": <real competing domain>
    }
  ],
  "additionalCompetitors": [
    {
      "rank": <number>,
      "domain": <real competitor domain>,
      "outranksOnKeywords": <number>,
      "visitsAtRisk": <number>
    }
  ]
}

Return ONLY valid JSON. No markdown.`;

    let additionalData: any = { additionalKeywords: [], additionalCompetitors: [] };
    try {
      const competitorResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: competitorPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "Expert SEO analyst. Use Google Search for real data. Return only valid JSON.",
        },
      });
      const compText = competitorResponse.text || "";
      const cleanComp = compText.replace(/```json/g, "").replace(/```/g, "").trim();
      additionalData = JSON.parse(cleanComp);
    } catch (e) {
      console.warn("[Brand Audit] Competitor deep dive failed, using primary data only.");
    }

    // Parse primary audit result
    const cleanSeo = seoText.replace(/```json/g, "").replace(/```/g, "").trim();
    const auditResult = JSON.parse(cleanSeo);

    // Merge additional keywords & competitors if primary has fewer than expected
    if ((auditResult.keywordOpportunities?.length ?? 0) < 4 && additionalData.additionalKeywords?.length > 0) {
      auditResult.keywordOpportunities = [
        ...(auditResult.keywordOpportunities ?? []),
        ...additionalData.additionalKeywords,
      ].slice(0, 6);
    }

    if ((auditResult.competitorsBeatYou?.length ?? 0) < 3 && additionalData.additionalCompetitors?.length > 0) {
      auditResult.competitorsBeatYou = [
        ...(auditResult.competitorsBeatYou ?? []),
        ...additionalData.additionalCompetitors,
      ].slice(0, 5);
    }

    // Recalculate totals
    auditResult.trafficOpportunity.potentialVisits =
      auditResult.trafficOpportunity.currentEstimatedVisits +
      auditResult.trafficOpportunity.additionalVisitsPerMonth;

    const multiple = (
      auditResult.trafficOpportunity.potentialVisits /
      Math.max(1, auditResult.trafficOpportunity.currentEstimatedVisits)
    ).toFixed(1);
    auditResult.trafficOpportunity.multipleOfCurrentTraffic = multiple;

    return res.json({ success: true, audit: auditResult, brand, website });

  } catch (error: any) {
    console.error("[Brand Audit] Error:", error);
    return res.status(500).json({ error: error.message || "Audit failed." });
  }
});

// ── Server setup ──────────────────────────────────────────────────────────────
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

