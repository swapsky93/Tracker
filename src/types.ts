export interface GeoAnalysisResult {
  Brand_Mentioned: boolean;
  Sentiment: number | null; // Scale -1.0 to 1.0 (or null if not mentioned)
  Contextual_Authority: number | null; // 1 to 5 (or null if not mentioned)
  Competitors_Mentioned: string[];
  Citation_Detected: boolean;
  Recommendation_Priority: string;
  Summary_of_Framing: string;
}

export interface GeoAnalysisInput {
  brand: string;
  query: string;
  aiResponseText: string;
}

export interface GeoRecord {
  id: string;
  timestamp: string; // ISO string
  engine: string; // e.g. "Google Search Overview", "Perplexity", "ChatGPT Search", "Gemini"
  input: GeoAnalysisInput;
  result: GeoAnalysisResult;
}

export interface TemplateResponse {
  id: string;
  label: string;
  brand: string;
  query: string;
  engine: string;
  aiResponseText: string;
}
