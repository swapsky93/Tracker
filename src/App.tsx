// import React, { useState, useEffect, useMemo } from "react";
// import { 
//   Search, Sparkles, Cpu, History, BarChart3, Trash2, 
//   HelpCircle, Send, CheckCircle2, XCircle, ExternalLink, 
//   FileText, AlertTriangle, RefreshCw, Copy, Plus, 
//   Award, Target, TrendingUp, Info, BookOpen, Layers
// } from "lucide-react";
// import { SAMPLE_TEMPLATES } from "./templates";
// import { GeoRecord, GeoAnalysisResult, TemplateResponse } from "./types";
// import { SentimentGauge } from "./components/SentimentGauge";
// import { AuthorityMeter } from "./components/AuthorityMeter";

// const DEFAULT_RECORDS: GeoRecord[] = [
//   {
//     id: "hist-1",
//     timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
//     engine: "Google Search Overview",
//     input: {
//       brand: "HubSpot",
//       query: "What is the best CRM for scaling SaaS startups?",
//       aiResponseText: "For scaling SaaS startups, HubSpot is typically chosen for its robust automation features, comprehensive free-to-paid marketing suites, and modular integrations. HubSpot is incredibly user-friendly for fast-growing teams. However, Salesforce is often regarded as the dominant enterprise market leader once you scale past 200 employees, offering unrivaled CRM depth. Other competitors in this segment are Pipedrive (best for simple sales pipelines) and Freshsales. To learn more, check out HubSpot's pricing catalog [1] or Salesforce's guide."
//     },
//     result: {
//       Brand_Mentioned: true,
//       Sentiment: 0.45,
//       Contextual_Authority: 4,
//       Competitors_Mentioned: ["Salesforce", "Pipedrive", "Freshsales"],
//       Citation_Detected: true,
//       Recommendation_Priority: "First paragraph",
//       Summary_of_Framing: "HubSpot is recommended as user-friendly and highly modular for growing teams, second only to Salesforce for enterprise-scale depth."
//     }
//   },
//   {
//     id: "hist-2",
//     timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
//     engine: "Perplexity",
//     input: {
//       brand: "Rivian",
//       query: "What are the top-rated electric sedans with longest range?",
//       aiResponseText: "The market for premium electric sedans with top-tier range is heavily led by the Lucid Air (delivering up to 516 miles EP-estimated) and the Tesla Model S (at 405 miles). Other high-performing options include the luxury-oriented Porsche Taycan, the aerodynamic Hyundai Ioniq 6, and the Mercedes-Benz EQS sedan."
//     },
//     result: {
//       Brand_Mentioned: false,
//       Sentiment: null,
//       Contextual_Authority: null,
//       Competitors_Mentioned: ["Lucid", "Tesla", "Porsche", "Hyundai", "Mercedes-Benz"],
//       Citation_Detected: false,
//       Recommendation_Priority: "Not mentioned",
//       Summary_of_Framing: "The brand is not mentioned in the response."
//     }
//   },
//   {
//     id: "hist-3",
//     timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
//     engine: "ChatGPT Search",
//     input: {
//       brand: "Notion",
//       query: "Best online document editors for remote workspace collaboration?",
//       aiResponseText: "Google Docs remains the undisputed golden standard for real-time multiplayer document writing and general office collaboration. For teams requesting complex wiki databases mixed with project trackers, Notion stands out as an excellent option, though some notes indicate its offline loading speeds can be sluggish. Microsoft Word Online is the default standard for enterprise security compliance, while modern teams also look towards Coda and Craft.do."
//     },
//     result: {
//       Brand_Mentioned: true,
//       Sentiment: 0.15,
//       Contextual_Authority: 3,
//       Competitors_Mentioned: ["Google Docs", "Microsoft Word", "Coda", "Craft.do"],
//       Citation_Detected: false,
//       Recommendation_Priority: "In a list",
//       Summary_of_Framing: "Notion is presented as a strong wiki and database document collaborator, though flagged for sluggish offline loading performance."
//     }
//   },
//   {
//     id: "hist-4",
//     timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
//     engine: "Gemini",
//     input: {
//       brand: "Shopify",
//       query: "Pros and cons of different ecommerce builders for micro creators",
//       aiResponseText: "If you are a micro creator starting with low upfront budget, Shopify offers unparalleled checkout stability but can be highly expensive due to its $39/month recurring base pricing, paid app additions, and transaction fees that aggressively penalize small sellers. Many modern creators prefer Gumroad or Stan Store for instant digital product checkouts, while Squarespace remains standard for visual galleries with lightweight stores."
//     },
//     result: {
//       Brand_Mentioned: true,
//       Sentiment: -0.30,
//       Contextual_Authority: 2,
//       Competitors_Mentioned: ["Gumroad", "Stan Store", "Squarespace"],
//       Citation_Detected: false,
//       Recommendation_Priority: "First paragraph",
//       Summary_of_Framing: "Shopify is framed as stable but financially penalizing for micro creators due to premium base pricing and aggressive app transaction fees."
//     }
//   }
// ];

// export default function App() {
//   const [brand, setBrand] = useState("HubSpot");
//   const [query, setQuery] = useState("What is the best CRM for scaling SaaS startups?");
//   const [engine, setEngine] = useState("Google Search Overview");
//   const [aiResponseText, setAiResponseText] = useState(SAMPLE_TEMPLATES[0].aiResponseText);

//   const [records, setRecords] = useState<GeoRecord[]>([]);
//   const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [isFetching, setIsFetching] = useState(false); // NEW
//   const [analysisError, setAnalysisError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<"dashboard" | "history" | "about">("dashboard");
//   const [copiedId, setCopiedId] = useState<string | null>(null);
//   const [showNotification, setShowNotification] = useState<string | null>(null);

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem("geo_analyzer_records");
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (parsed && parsed.length > 0) {
//           setRecords(parsed);
//           setSelectedRecordId(parsed[0].id);
//           return;
//         }
//       }
//     } catch (e) {
//       console.warn("Could not load from localStorage", e);
//     }
//     setRecords(DEFAULT_RECORDS);
//     setSelectedRecordId(DEFAULT_RECORDS[0].id);
//     localStorage.setItem("geo_analyzer_records", JSON.stringify(DEFAULT_RECORDS));
//   }, []);

//   const saveRecordsCustom = (newRecords: GeoRecord[]) => {
//     setRecords(newRecords);
//     try {
//       localStorage.setItem("geo_analyzer_records", JSON.stringify(newRecords));
//     } catch (e) {
//       console.warn("Could not save to localStorage", e);
//     }
//   };

//   const currentRecord = useMemo(() => {
//     return records.find(r => r.id === selectedRecordId) || null;
//   }, [records, selectedRecordId]);

//   const handleApplyTemplate = (id: string) => {
//     const template = SAMPLE_TEMPLATES.find(t => t.id === id);
//     if (template) {
//       setBrand(template.brand);
//       setQuery(template.query);
//       setEngine(template.engine);
//       setAiResponseText(template.aiResponseText);
//       setAnalysisError(null);
//       triggerNotification(`Loaded preset template: ${template.brand}`);
//     }
//   };

//   const triggerNotification = (msg: string) => {
//     setShowNotification(msg);
//     setTimeout(() => setShowNotification(null), 3000);
//   };

//   const handleClearForm = () => {
//     setBrand("");
//     setQuery("");
//     setEngine("Google Search Overview");
//     setAiResponseText("");
//     setAnalysisError(null);
//   };

//   // NEW: Standalone fetch button handler
//   const fetchAIResponseOnly = async () => {
//     if (!query.trim()) {
//       setAnalysisError("Enter a query first before fetching AI response.");
//       return;
//     }
//     setIsFetching(true);
//     setAnalysisError(null);
//     try {
//       const res = await fetch("/api/fetch-response", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ query: query.trim(), engine }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Fetch failed.");
//       setAiResponseText(data.aiResponse);
//       triggerNotification("AI response auto-fetched via NVIDIA NIM!");
//     } catch (err: any) {
//       setAnalysisError("Could not fetch AI response: " + err.message);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   // UPDATED: aiResponseText now optional — auto-fetched by backend if empty
//   const handleAnalyze = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!brand.trim() || !query.trim()) {
//       setAnalysisError("Brand and Query are required. AI Response will be auto-fetched if empty.");
//       return;
//     }

//     setIsAnalyzing(true);
//     setAnalysisError(null);

//     try {
//       const response = await fetch("/api/analyze", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           brand: brand.trim(),
//           query: query.trim(),
//           engine,
//           aiResponseText: aiResponseText.trim(),
//         }),
//       });

//       if (!response.ok) throw new Error("Backend analysis failed.");

//       const result = await response.json();

//       // Auto-populate textarea if backend fetched the response
//       if (result.autoFetchedAiResponse && !aiResponseText.trim()) {
//         setAiResponseText(result.autoFetchedAiResponse);
//       }

//       const newRecord: GeoRecord = {
//         id: "record-" + Date.now(),
//         timestamp: new Date().toISOString(),
//         engine,
//         input: {
//           brand,
//           query,
//           aiResponseText: result.autoFetchedAiResponse || aiResponseText,
//         },
//         result,
//       };

//       const updated = [newRecord, ...records];
//       saveRecordsCustom(updated);
//       setSelectedRecordId(newRecord.id);
//       setActiveTab("dashboard");
//       triggerNotification("Analysis successful!");
//     } catch (err) {
//       setAnalysisError("Failed to reach the analysis engine.");
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const handleCopyJSON = (record: GeoRecord) => {
//     navigator.clipboard.writeText(JSON.stringify(record, null, 2));
//     setCopiedId(record.id);
//     setTimeout(() => setCopiedId(null), 2000);
//   };

//   const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     const filtered = records.filter(r => r.id !== id);
//     saveRecordsCustom(filtered);
//     if (selectedRecordId === id) {
//       setSelectedRecordId(filtered.length > 0 ? filtered[0].id : null);
//     }
//     triggerNotification("Record deleted.");
//   };

//   const handleResetDefaults = () => {
//     if (confirm("Reset setup to clear all current entries and restore premium defaults?")) {
//       saveRecordsCustom(DEFAULT_RECORDS);
//       setSelectedRecordId(DEFAULT_RECORDS[0].id);
//       triggerNotification("Workspace data has been reset.");
//     }
//   };

//   const metrics = useMemo(() => {
//     const total = records.length;
//     if (total === 0) {
//       return { total: 0, mentionRate: 0, avgSentiment: 0, avgAuthority: 0, topCompetitors: [] };
//     }

//     const mentionedCount = records.filter(r => r.result.Brand_Mentioned).length;
//     const mentionRate = Math.round((mentionedCount / total) * 100);

//     const sentimentRecords = records.filter(r => r.result.Sentiment !== null);
//     const avgSentiment = sentimentRecords.length > 0 
//       ? Number((sentimentRecords.reduce((acc, r) => acc + (r.result.Sentiment || 0), 0) / sentimentRecords.length).toFixed(2))
//       : 0;

//     const authorityRecords = records.filter(r => r.result.Contextual_Authority !== null);
//     const avgAuthority = authorityRecords.length > 0
//       ? Number((authorityRecords.reduce((acc, r) => acc + (r.result.Contextual_Authority || 0), 0) / authorityRecords.length).toFixed(1))
//       : 0;

//     // const competitorMap: Record<string, number> = {};
//     // records.forEach(r => {
//     //   r.result.Competitors_Mentioned.forEach(comp => {
//     //     const norm = comp.trim();
//     //     if (norm) competitorMap[norm] = (competitorMap[norm] || 0) + 1;
//     //   });
//     // });

//     // const topCompetitors = Object.entries(competitorMap)
//     //   .map(([name, count]) => ({ name, count }))
//     //   .sort((a, b) => b.count - a.count)
//     //   .slice(0, 5);

//     const competitorMap: Record<string, number> = {};

// // Only use competitors from the CURRENT record, not all records
// const sourceRecords = currentRecord ? [currentRecord] : records.slice(0, 1);
// sourceRecords.forEach(r => {
//   r.result.Competitors_Mentioned.forEach(comp => {
//     const norm = comp.trim();
//     if (norm) competitorMap[norm] = (competitorMap[norm] || 0) + 1;
//   });
// });

// const topCompetitors = Object.entries(competitorMap)
//   .map(([name, count]) => ({ name, count }))
//   .sort((a, b) => b.count - a.count)
//   .slice(0, 5);

//     return { total, mentionRate, avgSentiment, avgAuthority, topCompetitors };
//   }, [records]);

//   return (
//     <div className="min-h-screen bg-[#F9FAFB] flex flex-col text-gray-800" id="geo-app-root">
      
//       {showNotification && (
//         <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 max-w-sm animate-bounce text-sm border border-gray-800" id="toast-notif">
//           <Sparkles className="w-4 h-4 text-emerald-400" />
//           <span>{showNotification}</span>
//         </div>
//       )}

//       <header className="border-b border-gray-200 bg-white sticky top-0 z-30 shadow-none px-6 py-4" id="app-header">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white font-black tracking-tight shadow-md">
//               G
//             </div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-lg font-bold text-gray-900 tracking-tight">GEO Search Analyzer</h1>
//                 <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 tracking-wider border border-indigo-100">
//                   v2.1 Pro
//                 </span>
//               </div>
//               <p className="text-xs text-gray-500">Generative Engine Optimization Intelligence Hub</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start md:self-auto">
//             <button onClick={() => setActiveTab("dashboard")} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "dashboard" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`} id="tab-dashboard-btn">
//               <Cpu className="w-3.5 h-3.5" /> Analysis Workbench
//             </button>
//             <button onClick={() => setActiveTab("history")} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "history" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`} id="tab-history-btn">
//               <History className="w-3.5 h-3.5" /> Benchmarking Logs ({records.length})
//             </button>
//             <button onClick={() => setActiveTab("about")} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "about" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`} id="tab-about-btn">
//               <Info className="w-3.5 h-3.5" /> GEO Methodology
//             </button>
//           </div>
//         </div>
//       </header>

//       <section className="bg-gray-900 text-white py-6 px-6 border-b border-gray-800" id="stats-banner">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
//             <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 flex flex-col justify-between">
//               <span className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-gray-500" /> Total Audits</span>
//               <span className="text-2xl font-black text-white mt-1.5 font-mono">{metrics.total}</span>
//               <span className="text-[10px] text-gray-500 mt-1">Cross-platform responses</span>
//             </div>
//             <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 flex flex-col justify-between">
//               <span className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-emerald-505" /> Brand Mention Rate</span>
//               <div className="flex items-baseline gap-2 mt-1.5">
//                 <span className="text-2xl font-black text-emerald-400 font-mono">{metrics.mentionRate}%</span>
//                 <span className="text-[11px] text-gray-400">Visibility</span>
//               </div>
//               <div className="w-full bg-gray-800 rounded-full h-1 mt-1">
//                 <div className="bg-emerald-400 h-1 rounded-full transition-all duration-1000" style={{ width: `${metrics.mentionRate}%` }} />
//               </div>
//             </div>
//             <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 flex flex-col justify-between">
//               <span className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Avg GEO Sentiment</span>
//               <div className="flex items-baseline gap-1 mt-1.5">
//                 <span className={`text-2xl font-black font-mono ${metrics.avgSentiment >= 0 ? "text-indigo-300" : "text-rose-400"}`}>
//                   {metrics.avgSentiment >= 0 ? `+${metrics.avgSentiment}` : metrics.avgSentiment}
//                 </span>
//                 <span className="text-[10px] text-gray-500">[-1 to +1]</span>
//               </div>
//               <span className="text-[10px] text-gray-400 mt-1">{metrics.avgSentiment >= 0.2 ? "Favorable outlook" : metrics.avgSentiment <= -0.2 ? "Critical risk" : "Neutral bias"}</span>
//             </div>
//             <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 flex flex-col justify-between">
//               <span className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-400" /> Contextual Authority</span>
//               <div className="flex items-baseline gap-1 mt-1.5">
//                 <span className="text-2xl font-black text-amber-400 font-mono">{metrics.avgAuthority}</span>
//                 <span className="text-xs text-gray-400">/ 5.0</span>
//               </div>
//               <span className="text-[10px] text-gray-500 mt-1">Positioning & recommendation priority</span>
//             </div>
//             <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 flex flex-col justify-between col-span-2 lg:col-span-1">
//               <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Top Competitor Threats</span>
//               {metrics.topCompetitors.length > 0 ? (
//                 <div className="mt-1.5 flex flex-wrap gap-1">
//                   {metrics.topCompetitors.map((comp) => (
//                     <span key={comp.name} className="inline-flex items-center bg-gray-800 text-gray-300 text-[9px] px-1.5 py-0.5 rounded font-mono border border-gray-700" title={`${comp.count} mentions`}>
//                       {comp.name} ({comp.count})
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <span className="text-gray-500 text-[11px] mt-2 block">No competitors logged yet</span>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-layout">
        
//         {activeTab === "dashboard" && (
//           <>
//             <section className="lg:col-span-5 space-y-5" id="workbench-input-section">
              
//               <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
//                     <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Presets / Sandbox Cases
//                   </h3>
//                   <button onClick={handleResetDefaults} className="text-gray-400 hover:text-red-500 transition-colors text-[10px] font-bold underline">Reset defaults</button>
//                 </div>
//                 <p className="text-[11px] text-gray-400 mb-2.5 leading-relaxed">Click a template to populate realistic engine scenarios:</p>
//                 <div className="flex flex-col gap-1.5">
//                   {SAMPLE_TEMPLATES.map((t) => (
//                     <button key={t.id} type="button" onClick={() => handleApplyTemplate(t.id)} className="text-left w-full text-[11px] font-medium p-2 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-900 text-gray-700 transition-all border border-gray-100 hover:border-indigo-100 flex justify-between items-center">
//                       <span>{t.label}</span>
//                       <span className="text-[9px] px-1 bg-white text-gray-500 font-mono rounded border border-gray-150">{t.engine}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <form onSubmit={handleAnalyze} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
//                 <div className="flex items-center justify-between border-b border-gray-50 pb-2">
//                   <div className="flex items-center gap-2">
//                     <Sparkles className="w-4 h-4 text-rose-500" />
//                     <h3 className="text-sm font-bold text-gray-900">Analysis Inputs</h3>
//                   </div>
//                   <button type="button" onClick={handleClearForm} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline">Clear Form</button>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center justify-between">
//                     <span>Target Brand <span className="text-rose-500">*</span></span>
//                     <span className="text-[10px] font-normal text-gray-400">Match is case-tolerant</span>
//                   </label>
//                   <input type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. HubSpot, Shopify, Rivian" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold" id="input-target-brand" />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-gray-600 mb-1">AI Search Engine / Model Source</label>
//                   <select value={engine} onChange={(e) => setEngine(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold" id="input-engine">
//                     <option value="Google Search Overview">Google Search Overview</option>
//                     <option value="Perplexity">Perplexity AI</option>
//                     <option value="ChatGPT Search">ChatGPT Search</option>
//                     <option value="Gemini">Gemini Web</option>
//                     <option value="Claude">Claude</option>
//                     <option value="Apple Intelligence">Apple Intelligence</option>
//                     <option value="Meta AI">Meta AI</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold text-gray-600 mb-1">
//                     Original User Query <span className="text-rose-500">*</span>
//                   </label>
//                   <input type="text" required value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. What is the best CRM for scaling SaaS startups?" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all" id="input-user-query" />
//                 </div>

//                 {/* UPDATED: AI Response textarea with Auto-Fetch button */}
//                 <div>
//                   <div className="flex items-center justify-between mb-1">
//                     <label className="text-xs font-semibold text-gray-600">
//                       AI-Generated Response Text
//                       <span className="text-gray-400 font-normal ml-1">(optional)</span>
//                     </label>
//                     <div className="flex items-center gap-2">
//                       <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1 border rounded">{aiResponseText.length} chars</span>
//                       <button
//                         type="button"
//                         onClick={fetchAIResponseOnly}
//                         disabled={isFetching || !query.trim()}
//                         className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-all flex items-center gap-1 ${isFetching || !query.trim() ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 cursor-pointer"}`}
//                       >
//                         {isFetching ? (
//                           <><RefreshCw className="w-2.5 h-2.5 animate-spin" /> Fetching...</>
//                         ) : (
//                           <><Sparkles className="w-2.5 h-2.5" /> Auto-Fetch</>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                   <textarea
//                     rows={6}
//                     value={aiResponseText}
//                     onChange={(e) => setAiResponseText(e.target.value)}
//                     placeholder="Leave empty to auto-fetch via NVIDIA NIM, or paste manually to override..."
//                     className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-mono leading-relaxed"
//                     id="input-response-text"
//                   />
//                   <span className="text-[10px] text-gray-400 mt-1 block leading-relaxed">
//                     Auto-fetched via <span className="font-semibold text-indigo-600">NVIDIA NIM (Llama 3.3 70B)</span> · Or paste exact text so citation indicators like <code className="bg-gray-100 px-0.5 rounded font-bold">[1]</code> are preserved.
//                   </span>
//                 </div>

//                 {analysisError && (
//                   <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs flex gap-2 text-rose-700" id="analysis-err-card">
//                     <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
//                     <div>
//                       <p className="font-semibold">Execution Refused</p>
//                       <p className="text-[11px] opacity-90 mt-0.5">{analysisError}</p>
//                     </div>
//                   </div>
//                 )}

//                 <button type="submit" disabled={isAnalyzing} className={`w-full py-2.5 rounded-xl text-white font-semibold text-xs tracking-wide shadow-sm transition-all focus:ring-3 focus:outline-none flex items-center justify-center gap-2 ${isAnalyzing ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-200 cursor-pointer active:scale-95"}`} id="btn-analyze-submit">
//                   {isAnalyzing ? (
//                     <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> GEO Intelligence Modeling...</>
//                   ) : (
//                     <><Send className="w-3.5 h-3.5" /> Execute GEO Audit (Real Engine ML)</>
//                   )}
//                 </button>
                
//                 <p className="text-[10px] text-center text-gray-500">
//                   Auto-fetch via <span className="font-semibold text-indigo-700">NVIDIA NIM · Llama 3.3 70B</span> · Analysis via <span className="font-semibold text-indigo-700">Gemini 2.5 Flash</span>
//                 </p>
//               </form>

//             </section>

//             <section className="lg:col-span-7 space-y-6" id="workbench-dashboard-section">
//               {isAnalyzing ? (
//                 <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[500px] flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
//                   <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
//                     <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
//                   </div>
//                   <div>
//                     <h3 className="text-base font-bold text-gray-900">Processing Engine Response</h3>
//                     <p className="text-xs text-gray-500 max-w-sm mt-1 mx-auto leading-relaxed">Evaluating brand visibility matching, contextual framing bias, semantic sentiment indices, and competing brand share...</p>
//                   </div>
//                   <div className="w-64 space-y-2">
//                     <div className="h-3 bg-gray-100 rounded-full w-full"></div>
//                     <div className="h-3 bg-gray-100 rounded-full w-5/6 mx-auto"></div>
//                     <div className="h-3 bg-gray-100 rounded-full w-3/4 mx-auto"></div>
//                   </div>
//                 </div>
//               ) : currentRecord ? (
//                 <div className="space-y-5">
//                   <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                     <div>
//                       <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-55 px-1.5 py-0.5 rounded border">Audit Report: {currentRecord.engine}</span>
//                       <h2 className="text-base font-extrabold text-gray-900 mt-1">
//                         Audit Analysis for Target Brand: <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-indigo-600 font-black">"{currentRecord.input.brand}"</span>
//                       </h2>
//                       <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
//                         <span className="font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">Audited: {new Date(currentRecord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                         <span className="text-gray-300">•</span>
//                         <span className="truncate max-w-xs" title={currentRecord.input.query}>Query: "{currentRecord.input.query}"</span>
//                       </div>
//                     </div>
//                     <button onClick={() => handleCopyJSON(currentRecord)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-50 text-gray-600 active:scale-95 transition-all self-start sm:self-auto shrink-0">
//                       {copiedId === currentRecord.id ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy JSON</>}
//                     </button>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
//                     <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center text-center">
//                       <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Engine Presence</h4>
//                       <div className="my-auto py-3">
//                         {currentRecord.result.Brand_Mentioned ? (
//                           <div className="flex flex-col items-center">
//                             <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100"><CheckCircle2 className="w-8 h-8" /></div>
//                             <span className="text-sm font-extrabold text-emerald-700 uppercase tracking-wide">Brand Visible</span>
//                             <span className="text-[11px] text-gray-500 mt-1">Successfully recommended</span>
//                           </div>
//                         ) : (
//                           <div className="flex flex-col items-center">
//                             <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-2 border border-rose-100"><XCircle className="w-8 h-8" /></div>
//                             <span className="text-sm font-extrabold text-rose-700 uppercase tracking-wide">Brand Absent</span>
//                             <span className="text-[11px] text-gray-400 mt-1">Zero organic visibility</span>
//                           </div>
//                         )}
//                       </div>
//                       <div className="mt-3 border-t border-gray-50 pt-2 text-[10px] text-gray-400">Case-tolerant exact & semantic term mapping.</div>
//                     </div>
//                     <div className="md:col-span-4"><SentimentGauge score={currentRecord.result.Sentiment} /></div>
//                     <div className="md:col-span-4"><AuthorityMeter score={currentRecord.result.Contextual_Authority} /></div>
//                   </div>

//                   <div className="bg-gradient-to-r from-gray-900 to-indigo-950 text-white rounded-2xl p-5 border border-indigo-950 shadow-md">
//                     <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/50 border border-indigo-800/60 px-2 py-0.5 rounded">Executive Narrative Framing Summary</span>
//                     <blockquote className="mt-3 text-sm italic font-serif leading-relaxed text-indigo-100">"{currentRecord.result.Summary_of_Framing}"</blockquote>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-indigo-900/60 text-xs">
//                       <div className="flex items-center gap-2">
//                         <Target className="w-4 h-4 text-rose-400" />
//                         <div>
//                           <span className="text-indigo-300 block text-[10px] uppercase font-semibold">Priority Position</span>
//                           <span className="font-bold font-mono text-white text-[11px]">{currentRecord.result.Recommendation_Priority}</span>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <ExternalLink className="w-4 h-4 text-emerald-400" />
//                         <div>
//                           <span className="text-indigo-300 block text-[10px] uppercase font-semibold">Citation & Link presence</span>
//                           <span className="font-bold flex items-center gap-1 text-[11px]">
//                             {currentRecord.result.Citation_Detected ? <span className="text-emerald-400 font-mono">✅ Link/Source Found</span> : <span className="text-rose-300 font-mono">❌ No Link Detected</span>}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
//                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5"><Layers className="w-4 h-4 text-gray-400" /> Competitive Landscape Overview</h3>
//                     <div>
//                       <span className="text-[11px] font-semibold text-gray-500 block mb-1.5">Competitors Detected inside this Search Response:</span>
//                       {currentRecord.result.Competitors_Mentioned.length > 0 ? (
//                         <div className="flex flex-wrap gap-2">
//                           {currentRecord.result.Competitors_Mentioned.map((comp) => (
//                             <span key={comp} className="text-xs px-2.5 py-1 bg-gray-50 border border-gray-150 rounded-lg text-gray-700 font-semibold">⚔️ {comp}</span>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="text-[11px] text-gray-400 bg-gray-50 p-2.5 rounded-lg">No other competing brands mentioned. The space is completely centered around the target brand!</div>
//                       )}
//                     </div>
//                     <div className="pt-2">
//                       <span className="text-[11px] font-semibold text-gray-500 block mb-1">AI Response Text Context Audit</span>
//                       <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs font-mono max-h-40 overflow-y-auto leading-relaxed relative">
//                         {(() => {
//                           const originalText = currentRecord.input.aiResponseText;
//                           const brandNorm = currentRecord.input.brand;
//                           if (!brandNorm || !originalText.toLowerCase().includes(brandNorm.toLowerCase())) return <span>{originalText}</span>;
//                           const regex = new RegExp(`(${brandNorm})`, 'gi');
//                           const parts = originalText.split(regex);
//                           return parts.map((part, i) => {
//                             if (part.toLowerCase() === brandNorm.toLowerCase()) {
//                               return <mark key={i} className="bg-indigo-100 text-indigo-900 border border-indigo-200 rounded px-1 py-0.5 font-bold shadow-xs">{part}</mark>;
//                             }
//                             return part;
//                           });
//                         })()}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="raw-payload-record">
//                     <details className="group">
//                       <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 select-none">
//                         <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 group-open:text-indigo-600"><FileText className="w-3.5 h-3.5" /> View Structured Analyst JSON Payload</span>
//                         <span className="text-xs text-indigo-600 font-bold group-open:hidden">Expand</span>
//                         <span className="text-xs text-indigo-600 font-bold hidden group-open:block">Collapse</span>
//                       </summary>
//                       <div className="p-4 border-t border-gray-100 bg-gray-50">
//                         <pre className="text-[11px] font-mono leading-normal text-gray-700 overflow-x-auto bg-white p-3 rounded-xl border border-gray-150 max-h-60 overflow-y-auto">
//                           {JSON.stringify(currentRecord, null, 2)}
//                         </pre>
//                       </div>
//                     </details>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-sm min-h-[500px] flex flex-col items-center justify-center text-center space-y-4">
//                   <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center"><Search className="w-6 h-6" /></div>
//                   <div>
//                     <h3 className="text-base font-bold text-gray-900">Workbench Ready</h3>
//                     <p className="text-xs text-gray-500 max-w-sm mt-1 mx-auto leading-relaxed">Select one of our preset sandbox cases on the left column or fill in your brand's AI-generated content audits to execute models.</p>
//                   </div>
//                 </div>
//               )}
//             </section>
//           </>
//         )}

//         {activeTab === "history" && (
//           <div className="col-span-12 space-y-5" id="history-dashboard-tab">
//             <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between justify-start gap-4">
//               <div>
//                 <h2 className="text-base font-bold text-gray-950">GEO Benchmarking Records Dashboard</h2>
//                 <p className="text-xs text-gray-500">Compare historic responses side-by-side to track optimization performance across engines.</p>
//               </div>
//               <button onClick={handleResetDefaults} className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 font-bold hover:bg-red-50 text-xs flex items-center gap-1 transition-all" id="reset-workspace-btn">
//                 <Trash2 className="w-3.5 h-3.5" /> Clear Workspace History & Reset Defaults
//               </button>
//             </div>

//             {records.length === 0 ? (
//               <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm space-y-3">
//                 <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
//                 <h3 className="font-bold text-gray-900">No audits found</h3>
//                 <p className="text-xs text-gray-500 max-w-xs mx-auto text-center leading-normal">Your local benchmark history is currently empty. Run an audit in the Workbench tab or apply presets to begin trackers.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
//                 <div className="xl:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-[600px] overflow-y-auto space-y-2">
//                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Logged Audits</h3>
//                   <div className="space-y-2">
//                     {records.map((r) => {
//                       const isActive = selectedRecordId === r.id;
//                       return (
//                         <div key={r.id} onClick={() => setSelectedRecordId(r.id)} className={`p-3 rounded-xl cursor-pointer hover:bg-gray-50 select-none transition-all border flex flex-col justify-between gap-2 text-xs relative overflow-hidden ${isActive ? "bg-indigo-50/70 border-indigo-200 shadow-xs" : "bg-white border-gray-100"}`}>
//                           <div className={`absolute top-0 bottom-0 left-0 w-1 ${r.result.Brand_Mentioned ? r.result.Sentiment && r.result.Sentiment >= 0.2 ? "bg-emerald-500" : "bg-teal-500" : "bg-rose-500"}`} />
//                           <div className="pl-1">
//                             <div className="flex items-center justify-between mb-1">
//                               <span className="font-bold text-gray-900">"{r.input.brand}"</span>
//                               <span className="text-[9px] font-mono text-gray-400">{r.engine}</span>
//                             </div>
//                             <p className="text-[11px] text-gray-500 leading-normal truncate font-sans">Query: {r.input.query}</p>
//                           </div>
//                           <div className="flex items-center justify-between border-t border-gray-100 pt-2 pl-1 text-[10px]">
//                             <div className="flex items-center gap-1.5">
//                               {r.result.Brand_Mentioned ? (
//                                 <span className="bg-emerald-50 font-bold text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-100 text-[9px]">L{r.result.Contextual_Authority} Visible</span>
//                               ) : (
//                                 <span className="bg-rose-50 font-bold text-rose-700 px-1.5 py-0.2 rounded border border-rose-100 text-[9px]">No Mention</span>
//                               )}
//                               {r.result.Sentiment !== null && <span className="text-gray-500">Bias: {r.result.Sentiment > 0 ? `+${r.result.Sentiment}` : r.result.Sentiment}</span>}
//                             </div>
//                             <button onClick={(e) => handleDeleteRecord(r.id, e)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors" title="Delete from history">
//                               <Trash2 className="w-3.5 h-3.5" />
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 <div className="xl:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5 h-[600px] overflow-y-auto">
//                   {records.find(r => r.id === selectedRecordId) ? (() => {
//                     const rec = records.find(r => r.id === selectedRecordId)!;
//                     return (
//                       <div className="space-y-5 text-gray-800">
//                         <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
//                           <div>
//                             <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block">Detailed Benchmark Analysis</span>
//                             <h3 className="text-base font-black text-gray-900 mt-1">"{rec.input.brand}" on <span className="text-indigo-600">{rec.engine}</span></h3>
//                             <span className="text-[10px] font-mono text-gray-500 mt-1 block">Audited on: {new Date(rec.timestamp).toLocaleDateString()} {new Date(rec.timestamp).toLocaleTimeString()}</span>
//                           </div>
//                           <button onClick={() => handleCopyJSON(rec)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-xs font-semibold rounded-lg border border-gray-200 flex items-center gap-1 text-gray-600 transition-colors">
//                             <Copy className="w-3.5 h-3.5" /> Copy JSON
//                           </button>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs">
//                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Audit Seed Query:</span>
//                             <p className="font-semibold text-gray-800 italic">"{rec.input.query}"</p>
//                           </div>
//                           <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs flex flex-col justify-center">
//                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Response Context metrics:</span>
//                             <div className="flex flex-wrap gap-2 mt-1">
//                               <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${rec.result.Brand_Mentioned ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}>Status: {rec.result.Brand_Mentioned ? "VISIBLE" : "ABSENT"}</span>
//                               <span className="text-[10px] bg-slate-50 border px-1.5 py-0.5 rounded text-gray-600 font-mono">Priority: {rec.result.Recommendation_Priority}</span>
//                               <span className="text-[10px] bg-slate-50 border px-1.5 py-0.5 rounded text-gray-600 font-mono">Links: {rec.result.Citation_Detected ? "Yes" : "No"}</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <SentimentGauge score={rec.result.Sentiment} />
//                           <AuthorityMeter score={rec.result.Contextual_Authority} />
//                         </div>
//                         <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
//                           <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Framing Evaluation Statement</span>
//                           <p className="text-xs text-indigo-900 mt-1.5 font-serif font-semibold leading-relaxed">"{rec.result.Summary_of_Framing}"</p>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
//                           <div className="space-y-1.5">
//                             <span className="text-xs font-semibold text-gray-500 block">Competitor Detection:</span>
//                             {rec.result.Competitors_Mentioned.length > 0 ? (
//                               <div className="flex flex-wrap gap-1.5">
//                                 {rec.result.Competitors_Mentioned.map((comp) => (
//                                   <span key={comp} className="bg-gray-100 text-gray-700 font-mono text-[10px] px-2 py-0.5 rounded border border-gray-150">{comp}</span>
//                                 ))}
//                               </div>
//                             ) : (
//                               <span className="text-xs text-gray-400 italic block">No competitive direct rivals cataloged.</span>
//                             )}
//                           </div>
//                           <div className="space-y-1.5">
//                             <span className="text-xs font-semibold text-gray-500 block">AI Engine Summary text length:</span>
//                             <span className="text-xs font-semibold text-gray-700 font-mono">{rec.input.aiResponseText.length} characters ({Math.floor(rec.input.aiResponseText.split(/\s+/).length)} words)</span>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })() : (
//                     <div className="flex items-center justify-center text-center h-full text-gray-400 text-xs">Select a benchmarking record from the left history block to evaluate statistics.</div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "about" && (
//           <div className="col-span-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6" id="about-geo-methodology">
//             <div className="border-b border-gray-100 pb-4">
//               <h2 className="text-base font-black text-gray-900">Search Landscape Transformation: What is GEO?</h2>
//               <p className="text-xs text-gray-500 mt-1">Generative Engine Optimization (GEO) is the next-generation practice of optimizing brand visibility, sentiment authority, and product positioning within AI Search Engines.</p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-700">
//               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
//                 <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold font-mono">1</span>
//                 <h4 className="font-extrabold text-gray-900">Visibility & Mindshare</h4>
//                 <p className="leading-relaxed text-gray-500">AI engines aggregate and recommend very few brands. Traditional SEO targeted top search rankings; GEO aims to make your brand the primary or tier-1 recommendation within natural language responses.</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
//                 <span className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold font-mono">2</span>
//                 <h4 className="font-extrabold text-gray-900">Framing and Bias Sentiment</h4>
//                 <p className="leading-relaxed text-gray-500">AI models carry specific framing biases based on training web datasets. Sentiment values indicate whether an engine endorses a brand, details technical downsides, or labels pricing as a significant disadvantage.</p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
//                 <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono">3</span>
//                 <h4 className="font-extrabold text-gray-900">Contextual Authority Levels</h4>
//                 <p className="leading-relaxed text-gray-500">Uniquely graded 1 to 5, contextual authority signifies how highly the AI ranks you relative to competitors. Being recommended as "Market Leader" (L5) versus a "Minor Footnote" (L1) determines organic traffic flow.</p>
//               </div>
//             </div>
//             <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 text-indigo-900 text-xs space-y-2">
//               <h4 className="font-extrabold flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-600" /> Executive Workflow for GEO Analysts:</h4>
//               <ul className="list-disc list-inside space-y-2 leading-relaxed pl-1 text-indigo-950 font-normal">
//                 <li><strong className="font-bold">Audit Organic Presence:</strong> Paste actual search outcomes from target customer queries inside this Sandbox Workbench.</li>
//                 <li><strong className="font-bold">Benchmarking:</strong> Save different engines (e.g., Perplexity vs. Gemini) comparing differences in narrative framing and competitor listings.</li>
//                 <li><strong className="font-bold">Targeted Optimization:</strong> Address negative framing elements. If an engine labels your pricing as "expensive", publish comprehensive feature-value tables to feed training pipelines.</li>
//               </ul>
//             </div>
//           </div>
//         )}

//       </main>

//       <footer className="border-t border-gray-200 bg-white py-4 px-6 text-center text-[10px] text-gray-400 mt-auto" id="app-footer">
//         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
//           <span>&copy; {new Date().getFullYear()} GEO Search Analyzer. Licensed under Apache-2.0.</span>
//           <span>Powered via NVIDIA NIM · Llama 3.3 70B + Gemini 2.5 Flash</span>
//         </div>
//       </footer>

//     </div>
//   );

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Copy,
  Cpu,
  ExternalLink,
  History,
  Info,
  Layers,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  XCircle,
} from "lucide-react";

// If your actual component export is already "SentimentGauge",
// replace this line with:
// import { SentimentGauge } from "./components/SentimentGauge";
import { SentimentGauge as SentimentGauge } from "./components/SentimentGauge";
import { AuthorityMeter } from "./components/AuthorityMeter";

type EngineName =
  | "Google Search Overview"
  | "Perplexity"
  | "ChatGPT Search"
  | "Gemini"
  | "Claude"
  | "Apple Intelligence"
  | "Meta AI";

type GeoAnalysisResult = {
  Brand_MenToned: boolean;
  SenTment: number | null;
  Contextual_Authority: number | null;
  CompeTtors_MenToned: string[];
  CitaTon_Detected: boolean;
  RecommendaTon_Priority: string;
  Summary_of_Framing: string;
  autoFetchedAiResponse?: string;
};

type GeoRecord = {
  id: string;
  Tmestamp: string;
  engine: EngineName | string;
  input: {
    brand: string;
    query: string;
    aiResponseText: string;
  };
  result: GeoAnalysisResult;
};

type TemplateResponse = {
  id: string;
  label: string;
  brand: string;
  query: string;
  engine: EngineName;
  aiResponseText: string;
};

type TopCompetitor = {
  name: string;
  count: number;
};

type RawAuditData = {
  records: GeoRecord[];
  currentRecord: GeoRecord | null;
  metrics: {
    total: number;
    menTonRate: number;
    avgSenTment: number;
    avgAuthority: number;
    topCompeTtors: TopCompetitor[];
  };
};

type UIAuditData = {
  globalMetrics: {
    totalAudits: number;
    shareOfVoiceText: string;
    shareOfVoiceValue: number;
    historicalSentiment: string;
    historicalAuthority: string;
    topCompetitors: TopCompetitor[];
  };
  liveMetrics: {
    brandVisible: boolean;
    presenceStatus: "Brand Visible" | "Brand Absent";
    gaugeScore: number | null;
    authorityScore: number | null;
    recommendationPriority: string;
    competitors: string[];
    citationDetected: boolean;
    framingSummary: string;
    hasContradictionWarning: boolean;
    warningMessage: string;
  };
};

const SAMPLE_TEMPLATES: TemplateResponse[] = [
  {
    id: "hubspot",
    label: "SaaS CRM visibility",
    brand: "HubSpot",
    query: "What is the best CRM for scaling SaaS startups?",
    engine: "Google Search Overview",
    aiResponseText:
      "For scaling SaaS startups, HubSpot is typically chosen for its robust automation features, comprehensive free-to-paid marketing suites, and modular integrations. HubSpot is incredibly user-friendly for fast-growing teams. However, Salesforce is often regarded as the dominant enterprise market leader once you scale past 200 employees, offering unrivaled CRM depth. Other competitors in this segment are Pipedrive and Freshsales.",
  },
  {
    id: "rivian",
    label: "EV sedan comparison",
    brand: "Rivian",
    query: "What are the top-rated electric sedans with longest range?",
    engine: "Perplexity",
    aiResponseText:
      "The market for premium electric sedans with top-tier range is heavily led by the Lucid Air and the Tesla Model S. Other strong options include the Porsche Taycan, Hyundai Ioniq 6, and Mercedes-Benz EQS sedan.",
  },
  {
    id: "notion",
    label: "Remote docs collaboration",
    brand: "Notion",
    query: "Best online document editors for remote workspace collaboration?",
    engine: "ChatGPT Search",
    aiResponseText:
      "Google Docs remains a standard for real-time multiplayer document writing. For teams requesting complex wiki databases mixed with project trackers, Notion stands out as an excellent option, though some users report sluggish offline loading speeds. Microsoft Word Online, Coda, and Craft also remain relevant alternatives.",
  },
  {
    id: "shopify",
    label: "Creator commerce stack",
    brand: "Shopify",
    query: "Pros and cons of different ecommerce builders for micro creators",
    engine: "Gemini",
    aiResponseText:
      "If you are a micro creator starting with a low upfront budget, Shopify offers strong checkout stability but can be expensive because of recurring pricing, paid app additions, and transaction-related costs. Many creators prefer Gumroad or Stan Store for instant digital product checkouts, while Squarespace remains useful for visual galleries with lightweight stores.",
  },
];

const DEFAULT_RECORDS: GeoRecord[] = [
  {
    id: "hist-1",
    Tmestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    engine: "Google Search Overview",
    input: {
      brand: "HubSpot",
      query: "What is the best CRM for scaling SaaS startups?",
      aiResponseText: SAMPLE_TEMPLATES[0].aiResponseText,
    },
    result: {
      Brand_MenToned: true,
      SenTment: 0.45,
      Contextual_Authority: 4,
      CompeTtors_MenToned: ["Salesforce", "Pipedrive", "Freshsales"],
      CitaTon_Detected: true,
      RecommendaTon_Priority: "First paragraph",
      Summary_of_Framing:
        "HubSpot is recommended as user-friendly and modular for growing teams, but Salesforce is still framed as the deeper enterprise option.",
    },
  },
  {
    id: "hist-2",
    Tmestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    engine: "Perplexity",
    input: {
      brand: "Rivian",
      query: "What are the top-rated electric sedans with longest range?",
      aiResponseText: SAMPLE_TEMPLATES[1].aiResponseText,
    },
    result: {
      Brand_MenToned: false,
      SenTment: null,
      Contextual_Authority: null,
      CompeTtors_MenToned: ["Lucid", "Tesla", "Porsche", "Hyundai", "Mercedes-Benz"],
      CitaTon_Detected: false,
      RecommendaTon_Priority: "Not mentioned",
      Summary_of_Framing: "The target brand is absent from the model response.",
    },
  },
  {
    id: "hist-3",
    Tmestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    engine: "ChatGPT Search",
    input: {
      brand: "Notion",
      query: "Best online document editors for remote workspace collaboration?",
      aiResponseText: SAMPLE_TEMPLATES[2].aiResponseText,
    },
    result: {
      Brand_MenToned: true,
      SenTment: 0.15,
      Contextual_Authority: 3,
      CompeTtors_MenToned: ["Google Docs", "Microsoft Word", "Coda", "Craft"],
      CitaTon_Detected: false,
      RecommendaTon_Priority: "In a list",
      Summary_of_Framing:
        "Notion is framed as strong for wiki-database collaboration, though performance limitations are acknowledged.",
    },
  },
  {
    id: "hist-4",
    Tmestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    engine: "Gemini",
    input: {
      brand: "Shopify",
      query: "Pros and cons of different ecommerce builders for micro creators",
      aiResponseText: SAMPLE_TEMPLATES[3].aiResponseText,
    },
    result: {
      Brand_MenToned: true,
      SenTment: -0.3,
      Contextual_Authority: 2,
      CompeTtors_MenToned: ["Gumroad", "Stan Store", "Squarespace"],
      CitaTon_Detected: false,
      RecommendaTon_Priority: "First paragraph",
      Summary_of_Framing:
        "Shopify is visible and important, but its cost structure is framed negatively for small creators.",
    },
  },
];

// function adaptAuditDataToUI(auditData: RawAuditData): UIAuditData {
//   const record = auditData.currentRecord;

//   const brandVisible = Boolean(record?.result?.Brand_MenToned);
//   const sentiment = record?.result?.SenTment ?? null;
//   const authority = record?.result?.Contextual_Authority ?? null;
//   const competitors = record?.result?.CompeTtors_MenToned ?? [];
//   const recommendationPriority =
//     record?.result?.RecommendaTon_Priority ?? "Unknown";
//   const citationDetected = Boolean(record?.result?.CitaTon_Detected);
//   const framingSummary =
//     record?.result?.Summary_of_Framing ?? "No framing summary available.";

//   const hasContradictionWarning =
//     (brandVisible && sentiment !== null && sentiment < 0) ||
//     (!brandVisible && sentiment !== null && sentiment > 0);

//   let warningMessage = "";
//   if (brandVisible && sentiment !== null && sentiment < 0) {
//     warningMessage =
//       "This brand is visible, but the framing sentiment is negative. Presence exists, though the recommendation context may still be risky.";
//   } else if (!brandVisible && sentiment !== null && sentiment > 0) {
//     warningMessage =
//       "The response appears positive overall, but the target brand is not actually visible. This suggests favorable category framing without direct brand capture.";
//   }

//   return {
//     globalMetrics: {
//       totalAudits: auditData.metrics.total ?? 0,
//       shareOfVoiceValue: auditData.metrics.menTonRate ?? 0,
//       shareOfVoiceText: `${auditData.metrics.menTonRate ?? 0}%`,
//       historicalSentiment: Number(auditData.metrics.avgSenTment ?? 0).toFixed(2),
//       historicalAuthority: Number(auditData.metrics.avgAuthority ?? 0).toFixed(1),
//       topCompetitors: auditData.metrics.topCompeTtors ?? [],
//     },
//     liveMetrics: {
//       brandVisible,
//       presenceStatus: brandVisible ? "Brand Visible" : "Brand Absent",
//       gaugeScore: sentiment,
//       authorityScore: authority,
//       recommendationPriority,
//       competitors,
//       citationDetected,
//       framingSummary,
//       hasContradictionWarning,
//       warningMessage,
//     },
//   };
// }

function adaptAuditDataToUI(auditData: RawAuditData): UIAuditData {
  // ✅ FIX 1: Safely read currentRecord even if auditData is undefined on initial mount
  const record = auditData?.currentRecord;

  const brandVisible = Boolean(record?.result?.Brand_MenToned);
  const sentiment = record?.result?.SenTment ?? null;
  const authority = record?.result?.Contextual_Authority ?? null;
  const competitors = record?.result?.CompeTtors_MenToned ?? [];
  const recommendationPriority =
    record?.result?.RecommendaTon_Priority ?? "Unknown";
  const citationDetected = Boolean(record?.result?.CitaTon_Detected);
  const framingSummary =
    record?.result?.Summary_of_Framing ?? "No framing summary available.";

  const hasContradictionWarning =
    (brandVisible && sentiment !== null && sentiment < 0) ||
    (!brandVisible && sentiment !== null && sentiment > 0);

  let warningMessage = "";
  if (brandVisible && sentiment !== null && sentiment < 0) {
    warningMessage =
      "This brand is visible, but the framing sentiment is negative. Presence exists, though the recommendation context may still be risky.";
  } else if (!brandVisible && sentiment !== null && sentiment > 0) {
    warningMessage =
      "The response appears positive overall, but the target brand is not actually visible. This suggests favorable category framing without direct brand capture.";
  }

  // ✅ FIX 2: Safely read fields from auditData.metrics using optional chaining (?.) 
  // so it defaults cleanly to your fallback values if the data hasn't loaded yet.
  return {
    globalMetrics: {
      totalAudits: auditData?.metrics?.total ?? 0,
      shareOfVoiceValue: auditData?.metrics?.menTonRate ?? 0,
      shareOfVoiceText: `${auditData?.metrics?.menTonRate ?? 0}%`,
      historicalSentiment: Number(auditData?.metrics?.avgSenTment ?? 0).toFixed(2),
      historicalAuthority: Number(auditData?.metrics?.avgAuthority ?? 0).toFixed(1),
      topCompetitors: auditData?.metrics?.topCompeTtors ?? [],
    },
    liveMetrics: {
      brandVisible,
      presenceStatus: brandVisible ? "Brand Visible" : "Brand Absent",
      gaugeScore: sentiment,
      authorityScore: authority,
      recommendationPriority,
      competitors,
      citationDetected,
      framingSummary,
      hasContradictionWarning,
      warningMessage,
    },
  };
}

function formatRelativeTime(iso: string) {
  const timestamp = new Date(iso).getTime();
  const diffMs = Date.now() - timestamp;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function App() {
  const [brand, setBrand] = useState("HubSpot");
  const [query, setQuery] = useState("What is the best CRM for scaling SaaS startups?");
  const [engine, setEngine] = useState<EngineName>("Google Search Overview");
  const [aiResponseText, setAiResponseText] = useState(SAMPLE_TEMPLATES[0].aiResponseText);

  const [records, setRecords] = useState<GeoRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"dashboard" | "history" | "about">(
    "dashboard"
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("geo_analyzer_records");
      if (stored) {
        const parsed = JSON.parse(stored) as GeoRecord[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecords(parsed);
          setSelectedRecordId(parsed[0].id);
          return;
        }
      }
    } catch (error) {
      console.warn("Could not load from localStorage", error);
    }

    setRecords(DEFAULT_RECORDS);
    setSelectedRecordId(DEFAULT_RECORDS[0].id);

    try {
      localStorage.setItem("geo_analyzer_records", JSON.stringify(DEFAULT_RECORDS));
    } catch (error) {
      console.warn("Could not seed localStorage", error);
    }
  }, []);

  const saveRecordsCustom = (newRecords: GeoRecord[]) => {
    setRecords(newRecords);
    try {
      localStorage.setItem("geo_analyzer_records", JSON.stringify(newRecords));
    } catch (error) {
      console.warn("Could not save to localStorage", error);
    }
  };

  const currentRecord = useMemo(() => {
    return records.find((record) => record.id === selectedRecordId) ?? null;
  }, [records, selectedRecordId]);

  const triggerNotification = (message: string) => {
    setShowNotification(message);
    window.setTimeout(() => {
      setShowNotification(null);
    }, 3000);
  };

  const handleApplyTemplate = (id: string) => {
    const template = SAMPLE_TEMPLATES.find((item) => item.id === id);
    if (!template) return;

    setBrand(template.brand);
    setQuery(template.query);
    setEngine(template.engine);
    setAiResponseText(template.aiResponseText);
    setAnalysisError(null);
    triggerNotification(`Loaded template: ${template.brand}`);
  };

  const handleClearForm = () => {
    setBrand("");
    setQuery("");
    setEngine("Google Search Overview");
    setAiResponseText("");
    setAnalysisError(null);
  };

  const handleResetDefaults = () => {
    const ok = window.confirm(
      "Reset all saved records and restore default sample audits?"
    );
    if (!ok) return;

    saveRecordsCustom(DEFAULT_RECORDS);
    setSelectedRecordId(DEFAULT_RECORDS[0].id);
    triggerNotification("Workspace reset to defaults.");
  };

  const handleCopyJSON = async (record: GeoRecord) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(record, null, 2));
      setCopiedId(record.id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      triggerNotification("Copy failed.");
    }
  };

  const handleDeleteRecord = (id: string) => {
    const filtered = records.filter((record) => record.id !== id);
    saveRecordsCustom(filtered);

    if (selectedRecordId === id) {
      setSelectedRecordId(filtered[0]?.id ?? null);
    }

    triggerNotification("Record deleted.");
  };

  const fetchAIResponseOnly = async () => {
    if (!query.trim()) {
      setAnalysisError("Enter a query before fetching the AI response.");
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
      if (!res.ok) {
        throw new Error(data?.error || "Fetch failed.");
      }

      setAiResponseText(data.aiResponse || "");
      triggerNotification("AI response fetched.");
    } catch (error: any) {
      setAnalysisError(`Could not fetch AI response: ${error.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAnalyze = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!brand.trim() || !query.trim()) {
      setAnalysisError("Brand and query are required.");
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
          aiResponseText: aiResponseText.trim(),
        }),
      });

      const result = (await response.json()) as GeoAnalysisResult;

      if (!response.ok) {
        throw new Error("Backend analysis failed.");
      }

      const resolvedAiResponse =
        result.autoFetchedAiResponse && !aiResponseText.trim()
          ? result.autoFetchedAiResponse
          : aiResponseText;

      if (result.autoFetchedAiResponse && !aiResponseText.trim()) {
        setAiResponseText(result.autoFetchedAiResponse);
      }

      const newRecord: GeoRecord = {
        id: `record-${Date.now()}`,
        Tmestamp: new Date().toISOString(),
        engine,
        input: {
          brand: brand.trim(),
          query: query.trim(),
          aiResponseText: resolvedAiResponse,
        },
        result,
      };

      const updatedRecords = [newRecord, ...records];
      saveRecordsCustom(updatedRecords);
      setSelectedRecordId(newRecord.id);
      setActiveTab("dashboard");
      triggerNotification("Analysis successful.");
    } catch (error) {
      setAnalysisError("Failed to reach the analysis engine.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const metrics = useMemo(() => {
    const total = records.length;

    if (total === 0) {
      return {
        total: 0,
        menTonRate: 0,
        avgSenTment: 0,
        avgAuthority: 0,
        topCompeTtors: [] as TopCompetitor[],
      };
    }

    const mentionedCount = records.filter((r) => r.result.Brand_MenToned).length;
    const menTonRate = Math.round((mentionedCount / total) * 100);

    const sentimentRecords = records.filter((r) => r.result.SenTment !== null);
    const avgSenTment =
      sentimentRecords.length > 0
        ? Number(
            (
              sentimentRecords.reduce(
                (sum, r) => sum + (r.result.SenTment ?? 0),
                0
              ) / sentimentRecords.length
            ).toFixed(2)
          )
        : 0;

    const authorityRecords = records.filter(
      (r) => r.result.Contextual_Authority !== null
    );
    const avgAuthority =
      authorityRecords.length > 0
        ? Number(
            (
              authorityRecords.reduce(
                (sum, r) => sum + (r.result.Contextual_Authority ?? 0),
                0
              ) / authorityRecords.length
            ).toFixed(1)
          )
        : 0;

    const competitorMap: Record<string, number> = {};
    records.forEach((record) => {
      record.result.CompeTtors_MenToned.forEach((competitor) => {
        const normalized = competitor.trim();
        if (!normalized) return;
        competitorMap[normalized] = (competitorMap[normalized] || 0) + 1;
      });
    });

    const topCompeTtors = Object.entries(competitorMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total,
      menTonRate,
      avgSenTment,
      avgAuthority,
      topCompeTtors,
    };
  }, [records]);

  // const auditData = useMemo<RawAuditData>(() => {
  //   return {
  //     records,
  //     currentRecord,
  //     metrics,
  //   };
  // }, [records, currentRecord, metrics]);

  // const { globalMetrics, liveMetrics } = useMemo(() => {
  //   return adaptAuditDataToUI(auditData);
  // }, [auditData]);

   // const auditData = useMemo<RawAuditData>(() => {
   //      return {
   //  // Pulling individual values out of metrics and currentRecord safely
   //        totalAudits: metrics?.totalAudits ?? 0,
   //        historicalMentionRate: metrics?.historicalMentionRate ?? 0,
   //        globalGeoSentiment: metrics?.globalGeoSentiment ?? 0,
   //        enginePresence: currentRecord?.enginePresence ?? "Brand Absent",
   //        liveResponseSentiment: currentRecord?.liveResponseSentiment ?? 0,
   //      };
   //    }, [metrics, currentRecord]);

   //    const { globalMetrics, liveMetrics } = useMemo(() => {
   //      return adaptAuditDataToUI(auditData);
   //    }, [auditData]);
      const auditData = useMemo<RawAuditData>(() => {
  // 💡 HELPER: Inspects your metrics object safely to find your total value
  const extractedTotal = 
    metrics?.totalAudits ?? 
    metrics?.total ?? 
    (metrics as any)?.total_audits ?? 
    0;

  const extractedMentionRate = 
    metrics?.historicalMentionRate ?? 
    (metrics as any)?.historical_mention_rate ?? 
    0;

  const extractedGlobalSentiment = 
    metrics?.globalGeoSentiment ?? 
    (metrics as any)?.global_geo_sentiment ?? 
    0;

  return {
    // Safely inject the extracted values
    totalAudits: extractedTotal,
    historicalMentionRate: extractedMentionRate,
    globalGeoSentiment: extractedGlobalSentiment,
    
    // Safely extract from currentRecord
    enginePresence: currentRecord?.enginePresence ?? "Brand Absent",
    liveResponseSentiment: currentRecord?.liveResponseSentiment ?? 0,
  };
}, [metrics, currentRecord]);

const { globalMetrics, liveMetrics } = useMemo(() => {
  return adaptAuditDataToUI(auditData);
}, [auditData]);


  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col text-gray-800" id="geo-app-root">
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 max-w-sm text-sm border border-gray-800">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{showNotification}</span>
        </div>
      )}

      <header className="border-b border-gray-200 bg-white sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white font-black tracking-tight shadow-md">
              G
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                  GEO Search Analyzer
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 tracking-wider border border-indigo-100">
                  v2.1 Pro
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Generative Engine Optimization Intelligence Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "dashboard"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Analysis Workbench
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "history"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Benchmarking Logs ({records.length})
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "about"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              GEO Methodology
            </button>
          </div>
        </div>
      </header>

      <section className="bg-gray-900 text-white py-6 px-6 border-b border-gray-800" id="stats-banner">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 flex flex-col justify-between">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gray-500" />
                Total Audits
              </span>
              <span className="text-2xl font-black text-white mt-1.5 font-mono">
                {globalMetrics.totalAudits}
              </span>
              <span className="text-[10px] text-gray-500 mt-1">
                Cross-platform responses
              </span>
            </div>

            <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 flex flex-col justify-between">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Share of Voice
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {globalMetrics.shareOfVoiceText}
                </span>
                <span className="text-[11px] text-gray-400">Visibility</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1 mt-1">
                <div
                  className="bg-emerald-400 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${globalMetrics.shareOfVoiceValue}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 flex flex-col justify-between">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                Avg GEO Sentiment
              </span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span
                  className={`text-2xl font-black font-mono ${
                    Number(globalMetrics.historicalSentiment) >= 0
                      ? "text-indigo-300"
                      : "text-rose-400"
                  }`}
                >
                  {Number(globalMetrics.historicalSentiment) >= 0
                    ? `+${globalMetrics.historicalSentiment}`
                    : globalMetrics.historicalSentiment}
                </span>
                <span className="text-[10px] text-gray-500">[-1 to +1]</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1">
                {Number(globalMetrics.historicalSentiment) >= 0.2
                  ? "Favorable outlook"
                  : Number(globalMetrics.historicalSentiment) <= -0.2
                  ? "Critical risk"
                  : "Neutral bias"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 flex flex-col justify-between">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Contextual Authority
              </span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-2xl font-black text-amber-400 font-mono">
                  {globalMetrics.historicalAuthority}
                </span>
                <span className="text-xs text-gray-400">/ 5.0</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-1">
                Positioning & recommendation priority
              </span>
            </div>

            <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 flex flex-col justify-between col-span-2 lg:col-span-1">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                Top Competitor Threats
              </span>
              {globalMetrics.topCompetitors.length > 0 ? (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {globalMetrics.topCompetitors.map((comp) => (
                    <span
                      key={comp.name}
                      className="inline-flex items-center bg-gray-800 text-gray-300 text-[9px] px-1.5 py-0.5 rounded font-mono border border-gray-700"
                      title={`${comp.count} mentions`}
                    >
                      {comp.name} ({comp.count})
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500 text-[11px] mt-2 block">
                  No competitors logged yet
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {activeTab === "dashboard" && (
          <>
            <section className="lg:col-span-5 space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    Presets / Sandbox Cases
                  </h3>
                  <button
                    onClick={handleResetDefaults}
                    className="text-gray-400 hover:text-red-500 transition-colors text-[10px] font-bold underline"
                  >
                    Reset defaults
                  </button>
                </div>

                <p className="text-[11px] text-gray-400 mb-2.5 leading-relaxed">
                  Click a template to populate realistic engine scenarios.
                </p>

                <div className="flex flex-col gap-1.5">
                  {SAMPLE_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleApplyTemplate(template.id)}
                      className="text-left w-full text-[11px] font-medium p-2 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-900 text-gray-700 transition-all border border-gray-100 hover:border-indigo-100 flex justify-between items-center"
                    >
                      <span>{template.label}</span>
                      <span className="text-[9px] px-1 bg-white text-gray-500 font-mono rounded border border-gray-200">
                        {template.engine}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <form
                onSubmit={handleAnalyze}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <h3 className="text-sm font-bold text-gray-900">Analysis Inputs</h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                  >
                    Clear Form
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center justify-between">
                    <span>
                      Target Brand <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[10px] font-normal text-gray-400">
                      Match is case-tolerant
                    </span>
                  </label>

                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. HubSpot, Shopify, Rivian"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    AI Search Engine / Model Source
                  </label>

                  <select
                    value={engine}
                    onChange={(e) => setEngine(e.target.value as EngineName)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-semibold"
                  >
                    <option value="Google Search Overview">Google Search Overview</option>
                    <option value="Perplexity">Perplexity AI</option>
                    <option value="ChatGPT Search">ChatGPT Search</option>
                    <option value="Gemini">Gemini Web</option>
                    <option value="Claude">Claude</option>
                    <option value="Apple Intelligence">Apple Intelligence</option>
                    <option value="Meta AI">Meta AI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Original User Query <span className="text-rose-500">*</span>
                  </label>

                  <input
                    type="text"
                    required
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. What is the best CRM for scaling SaaS startups?"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-600">
                      AI-Generated Response Text
                      <span className="text-gray-400 font-normal ml-1">(optional)</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1 border rounded">
                        {aiResponseText.length} chars
                      </span>

                      <button
                        type="button"
                        onClick={fetchAIResponseOnly}
                        disabled={isFetching || !query.trim()}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-all flex items-center gap-1 ${
                          isFetching || !query.trim()
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 cursor-pointer"
                        }`}
                      >
                        {isFetching ? (
                          <>
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                            Fetching...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-2.5 h-2.5" />
                            Auto-Fetch
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={6}
                    value={aiResponseText}
                    onChange={(e) => setAiResponseText(e.target.value)}
                    placeholder="Leave empty to auto-fetch from your backend, or paste manually to override..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-mono leading-relaxed"
                  />

                  <span className="text-[10px] text-gray-400 mt-1 block leading-relaxed">
                    Paste the exact model output if you want citation indicators or formatting
                    preserved.
                  </span>
                </div>

                {analysisError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs flex gap-2 text-rose-700">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                    <div>
                      <p className="font-semibold">Execution Refused</p>
                      <p className="text-[11px] opacity-90 mt-0.5">{analysisError}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className={`w-full py-2.5 rounded-xl text-white font-semibold text-xs tracking-wide shadow-sm transition-all focus:ring-4 focus:outline-none flex items-center justify-center gap-2 ${
                    isAnalyzing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-200 cursor-pointer active:scale-[0.99]"
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      GEO Intelligence Modeling...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Execute GEO Audit
                    </>
                  )}
                </button>
              </form>
            </section>

            <section className="lg:col-span-7 space-y-6">
              {isAnalyzing ? (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[500px] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Processing Engine Response
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mt-1 mx-auto leading-relaxed">
                      Evaluating brand visibility, contextual framing, sentiment, and
                      competitor share...
                    </p>
                  </div>

                  <div className="w-64 space-y-2">
                    <div className="h-3 bg-gray-100 rounded-full w-full" />
                    <div className="h-3 bg-gray-100 rounded-full w-5/6 mx-auto" />
                    <div className="h-3 bg-gray-100 rounded-full w-3/4 mx-auto" />
                  </div>
                </div>
              ) : currentRecord ? (
                <div className="space-y-5">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border">
                        Audit Report: {currentRecord.engine}
                      </span>

                      <h2 className="text-base font-extrabold text-gray-900 mt-1">
                        Audit Analysis for Target Brand:{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-indigo-600">
                          "{currentRecord.input.brand}"
                        </span>
                      </h2>

                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                        <span className="font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                          Audited: {formatRelativeTime(currentRecord.Tmestamp)}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="truncate max-w-xs" title={currentRecord.input.query}>
                          Query: "{currentRecord.input.query}"
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyJSON(currentRecord)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-gray-50 text-gray-600 active:scale-95 transition-all self-start sm:self-auto shrink-0"
                    >
                      {copiedId === currentRecord.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy JSON
                        </>
                      )}
                    </button>
                  </div>

                  {liveMetrics.hasContradictionWarning && (
                    <div className="bg-amber-500/10 border border-amber-500/30 text-amber-700 p-3 rounded-lg text-xs">
                      {liveMetrics.warningMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center text-center">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        Engine Presence
                      </h4>

                      <div className="my-auto py-3">
                        {liveMetrics.presenceStatus === "Brand Visible" ? (
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100">
                              <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <span className="text-sm font-extrabold text-emerald-700 uppercase tracking-wide">
                              {liveMetrics.presenceStatus}
                            </span>
                            <span className="text-[11px] text-gray-500 mt-1">
                              Successfully recommended
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-2 border border-rose-100">
                              <XCircle className="w-8 h-8" />
                            </div>
                            <span className="text-sm font-extrabold text-rose-700 uppercase tracking-wide">
                              {liveMetrics.presenceStatus}
                            </span>
                            <span className="text-[11px] text-gray-400 mt-1">
                              Zero organic visibility
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 border-t border-gray-50 pt-2 text-[10px] text-gray-400">
                        Case-tolerant exact & semantic term mapping.
                      </div>
                    </div>

                    <div className="md:col-span-4">
                      <SentimentGauge score={liveMetrics.gaugeScore} />
                    </div>

                    <div className="md:col-span-4">
                      <AuthorityMeter score={liveMetrics.authorityScore} />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-900 to-indigo-950 text-white rounded-2xl p-5 border border-indigo-950 shadow-md">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/50 border border-indigo-800/60 px-2 py-0.5 rounded">
                      Executive Narrative Framing Summary
                    </span>

                    <blockquote className="mt-3 text-sm italic font-serif leading-relaxed text-indigo-100">
                      "{liveMetrics.framingSummary}"
                    </blockquote>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-indigo-900/60 text-xs">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-rose-400" />
                        <div>
                          <span className="text-indigo-300 block text-[10px] uppercase font-semibold">
                            Priority Position
                          </span>
                          <span className="font-bold font-mono text-white text-[11px]">
                            {liveMetrics.recommendationPriority}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="text-indigo-300 block text-[10px] uppercase font-semibold">
                            Citation Detection
                          </span>
                          {liveMetrics.citationDetected ? (
                            <span className="text-emerald-300 font-mono">
                              ✅ Link/Source Found
                            </span>
                          ) : (
                            <span className="text-rose-300 font-mono">
                              ❌ No Link Detected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Search className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-sm font-bold text-gray-900">
                          Competitor Mentions
                        </h3>
                      </div>

                      {liveMetrics.competitors.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {liveMetrics.competitors.map((comp) => (
                            <span
                              key={comp}
                              className="inline-flex items-center px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700"
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">
                          No competitors were detected in this response.
                        </p>
                      )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-sm font-bold text-gray-900">Current Query</h3>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        <span className="font-semibold text-gray-900">Brand:</span>{" "}
                        {currentRecord.input.brand}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed mt-2">
                        <span className="font-semibold text-gray-900">Prompt:</span>{" "}
                        {currentRecord.input.query}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="w-4 h-4 text-indigo-500" />
                      <h3 className="text-sm font-bold text-gray-900">
                        Original AI Response Text
                      </h3>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs leading-relaxed text-gray-700 whitespace-pre-wrap font-mono">
                      {currentRecord.input.aiResponseText || "No response text stored."}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Copy className="w-4 h-4 text-indigo-500" />
                      <h3 className="text-sm font-bold text-gray-900">Raw JSON Snapshot</h3>
                    </div>

                    <pre className="bg-gray-950 text-green-300 rounded-xl p-4 overflow-x-auto text-[11px] leading-relaxed">
                      {JSON.stringify(currentRecord, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Cpu className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">No record selected</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">
                    Run a GEO audit or select an item from history to inspect a record.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "history" && (
          <section className="lg:col-span-12 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <History className="w-4 h-4 text-indigo-500" />
                <h2 className="text-base font-bold text-gray-900">Benchmarking Logs</h2>
              </div>

              <p className="text-xs text-gray-500">
                Review prior engine audits, compare status, and reopen any result.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {records.map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => {
                    setSelectedRecordId(rec.id);
                    setActiveTab("dashboard");
                  }}
                  className={`text-left bg-white rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${
                    selectedRecordId === rec.id
                      ? "border-indigo-300 ring-2 ring-indigo-100"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border">
                          {rec.engine}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                            rec.result.Brand_MenToned
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}
                        >
                          {rec.result.Brand_MenToned ? "Brand Visible" : "Brand Absent"}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900 mt-2">
                        {rec.input.brand}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {rec.input.query}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-500 flex-wrap">
                        <span className="font-mono">Sentiment: {rec.result.SenTment ?? "n/a"}</span>
                        <span className="font-mono">
                          Authority: {rec.result.Contextual_Authority ?? "n/a"}
                        </span>
                        <span className="font-mono">
                          Priority: {rec.result.RecommendaTon_Priority}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRecord(rec.id);
                      }}
                      className="shrink-0 p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="min-w-0">
                      <SentimentGauge score={rec.result.SenTment} />
                    </div>
                    <div className="min-w-0">
                      <AuthorityMeter score={rec.result.Contextual_Authority} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {records.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <p className="text-sm font-semibold text-gray-900">No historical records</p>
                <p className="text-xs text-gray-500 mt-1">
                  Run an audit to populate your benchmarking history.
                </p>
              </div>
            )}
          </section>
        )}

        {activeTab === "about" && (
          <section className="lg:col-span-12">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" />
                <h2 className="text-base font-bold text-gray-900">GEO Methodology</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Presence</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Detects whether the target brand appears in the AI response through
                    direct brand mention and tolerance for semantic matching logic.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Sentiment</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Scores framing polarity from -1 to +1 to estimate whether the model
                    discusses the target brand favorably, neutrally, or critically.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Authority</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Measures contextual prominence, recommendation strength, and strategic
                    positioning on a 0 to 5 scale.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                <h3 className="text-sm font-bold text-indigo-900 mb-2">
                  Wrapper integration included
                </h3>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  This single-file version includes an inlined adapter that converts raw
                  historical metrics and the selected live record into UI-safe
                  `globalMetrics` and `liveMetrics` values before rendering cards,
                  gauges, and warnings.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// }
