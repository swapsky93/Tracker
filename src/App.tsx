// ─────────────────────────────────────────────────────────────────────────────
// CHANGES TO App.tsx — ONLY THESE PARTS NEED TO BE UPDATED
// Everything else (UI, layout, tabs, metrics, history) stays exactly the same.
// ─────────────────────────────────────────────────────────────────────────────


// ── CHANGE 1: Add isFetching state near your other useState declarations ──────
// Add this alongside your existing useState hooks (around line 60):

const [isFetching, setIsFetching] = useState(false);


// ── CHANGE 2: Add fetchAIResponse helper function ─────────────────────────────
// Add this new function right above handleAnalyze:

const fetchAIResponse = async () => {
  if (!query.trim()) {
    setAnalysisError("Enter a query first before fetching AI response.");
    return;
  }
  setIsFetching(true);
  setAnalysisError(null);
  try {
    const res = await fetch("/api/fetch-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query.trim(), engine }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Fetch failed.");
    setAiResponseText(data.aiResponse);
    triggerNotification("AI response auto-fetched via NVIDIA NIM!");
  } catch (err: any) {
    setAnalysisError("Could not fetch AI response: " + err.message);
  } finally {
    setIsFetching(false);
  }
};


// ── CHANGE 3: Replace handleAnalyze with this updated version ─────────────────
// Key change: aiResponseText is now optional — backend auto-fetches if empty.
// Also reads back autoFetchedAiResponse from the server to populate the textarea.

const handleAnalyze = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!brand.trim() || !query.trim()) {
    setAnalysisError("Brand and Query are required. AI Response will be auto-fetched if empty.");
    return;
  }

  setIsAnalyzing(true);
  setAnalysisError(null);

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: brand.trim(),
        query: query.trim(),
        engine,
        aiResponseText: aiResponseText.trim(), // empty = backend will auto-fetch
      }),
    });

    if (!response.ok) throw new Error("Backend analysis failed.");

    const result = await response.json();

    // ── Auto-populate textarea if backend fetched the response ────────────────
    if (result.autoFetchedAiResponse && !aiResponseText.trim()) {
      setAiResponseText(result.autoFetchedAiResponse);
    }

    const newRecord: GeoRecord = {
      id: "record-" + Date.now(),
      timestamp: new Date().toISOString(),
      engine,
      input: {
        brand,
        query,
        aiResponseText: result.autoFetchedAiResponse || aiResponseText,
      },
      result,
    };

    const updated = [newRecord, ...records];
    saveRecordsCustom(updated);
    setSelectedRecordId(newRecord.id);
    triggerNotification("Analysis successful!");
  } catch (err) {
    setAnalysisError("Failed to reach the analysis engine.");
  } finally {
    setIsAnalyzing(false);
  }
};


// ── CHANGE 4: Update the AI Response textarea section in the JSX ──────────────
// Find the "AI-Generated Response Text" label block and replace it with this:
// (Around line 390 in your current App.tsx)

/*
  FIND this label:
    <label className="text-xs font-semibold text-gray-600">
      AI-Generated Response Text <span className="text-rose-500">*</span>
    </label>

  REPLACE the entire div wrapping it with:
*/

<div>
  <div className="flex items-center justify-between mb-1">
    <label className="text-xs font-semibold text-gray-600">
      AI-Generated Response Text
      <span className="text-gray-400 font-normal ml-1">(optional — auto-fetched if empty)</span>
    </label>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1 border rounded">
        {aiResponseText.length} chars
      </span>
      {/* NEW: Fetch button */}
      <button
        type="button"
        onClick={fetchAIResponse}
        disabled={isFetching || !query.trim()}
        className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-all flex items-center gap-1 ${
          isFetching || !query.trim()
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 cursor-pointer"
        }`}
      >
        {isFetching ? (
          <><RefreshCw className="w-2.5 h-2.5 animate-spin" /> Fetching...</>
        ) : (
          <><Sparkles className="w-2.5 h-2.5" /> Auto-Fetch</>
        )}
      </button>
    </div>
  </div>
  <textarea
    rows={6}
    value={aiResponseText}
    onChange={(e) => setAiResponseText(e.target.value)}
    placeholder="Leave empty to auto-fetch via NVIDIA NIM, or paste manually to override..."
    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-mono leading-relaxed"
    id="input-response-text"
  />
  <span className="text-[10px] text-gray-400 mt-1 block leading-relaxed">
    Auto-fetched via <span className="font-semibold text-indigo-600">NVIDIA NIM (Llama 3.3 70B)</span> · 
    Or paste exact text so citation indicators like{" "}
    <code className="bg-gray-100 px-0.5 rounded font-bold">[1]</code> are preserved.
  </span>
</div>


// ── CHANGE 5: Update the submit button note at the bottom ─────────────────────
// Find this line and update it:
//   <span className="font-semibold text-indigo-700">models/gemini-3.5-flash</span>
// Replace with:

<p className="text-[10px] text-center text-gray-500">
  Auto-fetch via{" "}
  <span className="font-semibold text-indigo-700">NVIDIA NIM · Llama 3.3 70B</span>
  {" "}· Analysis via{" "}
  <span className="font-semibold text-indigo-700">Gemini 2.5 Flash</span>
</p>


// ─────────────────────────────────────────────────────────────────────────────
// REQUIRED: Add to your .env file
// ─────────────────────────────────────────────────────────────────────────────
//
// GEMINI_API_KEY=your_existing_gemini_key
// NVIDIA_API_KEY=nvapi-xxxxxxxxxxxx   ← get free at build.nvidia.com
//
// ─────────────────────────────────────────────────────────────────────────────
// REQUIRED: Install the openai package
// ─────────────────────────────────────────────────────────────────────────────
//
// npm install openai
//
// ─────────────────────────────────────────────────────────────────────────────
