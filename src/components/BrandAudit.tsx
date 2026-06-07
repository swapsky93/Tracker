import React, { useState, useRef } from "react";
import {
  Search, Globe, AlertTriangle, CheckCircle2, TrendingUp,
  ArrowUpRight, Zap, Target, BarChart2, Image, Type,
  Code2, FileText, Tag, ChevronRight, Loader2, RefreshCw,
  Award, XCircle, Info, ExternalLink, Lightbulb, ShieldCheck
} from "lucide-react";

interface AuditResult {
  overallScore: number;
  scoreLabel: string;
  issuesSummary: { critical: number; needsWork: number; wins: number };
  trafficOpportunity: {
    additionalVisitsPerMonth: number;
    currentEstimatedVisits: number;
    potentialVisits: number;
    multipleOfCurrentTraffic: string;
    timeframe: string;
  };
  seoSignals: {
    title: string;
    metaDescriptionLength: number;
    h1Count: number;
    httpsEnabled: boolean;
    imagesMissingAlt: number;
    totalImages: number;
    schemaMarkup: boolean;
    openGraphTags: boolean;
  };
  categoryScores: Array<{ category: string; score: number; details: string[] }>;
  keywordOpportunities: Array<{
    keyword: string;
    volumePerMonth: number;
    currentRank: string;
    potentialRank: string;
    visitLift: number;
    beatingYou: string;
  }>;
  competitorsBeatYou: Array<{
    rank: number;
    domain: string;
    outranksOnKeywords: number;
    visitsAtRisk: number;
  }>;
  whatsWorking: string[];
  topSuggestions: Array<{ priority: number; title: string; description: string }>;
  biggestOpportunity: { title: string; score: number; details: string[] };
  geoRemediation: {
    contentGaps: string[];
    citationOpportunities: string[];
    entityStrengthening: string[];
    aiVisibilityFixes: string[];
  };
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Image Optimization": <Image className="w-4 h-4" />,
  "Heading Structure": <Type className="w-4 h-4" />,
  "Technical SEO": <Code2 className="w-4 h-4" />,
  "Content Quality": <FileText className="w-4 h-4" />,
  "Meta Tags & Open Graph": <Tag className="w-4 h-4" />,
};

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1f2937" strokeWidth="8" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-white font-mono">{score}</span>
        <span className="text-[10px] text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

function CategoryScoreBar({ category, score, details }: { category: string; score: number; details: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : score >= 40 ? "bg-orange-500" : "bg-red-500";
  const textColor = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : score >= 40 ? "text-orange-400" : "text-red-400";

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 cursor-pointer hover:border-gray-600 transition-all"
      onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-300 text-xs font-semibold">
          {CATEGORY_ICONS[category]}
          <span>{category}</span>
        </div>
        <span className={`text-sm font-black font-mono ${textColor}`}>{score}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all duration-1000`} style={{ width: `${score}%` }} />
      </div>
      {expanded && details?.length > 0 && (
        <div className="mt-3 space-y-1">
          {details.map((d, i) => (
            <p key={i} className="text-[11px] text-gray-400 flex gap-1.5">
              <span className="text-gray-600 mt-0.5">·</span>{d}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

const STEPS = [
  { icon: <Globe className="w-4 h-4" />, label: "Crawling your homepage" },
  { icon: <Search className="w-4 h-4" />, label: "Reading on-page SEO signals" },
  { icon: <BarChart2 className="w-4 h-4" />, label: "Pulling search-volume data" },
  { icon: <Target className="w-4 h-4" />, label: "Scoring competitor visibility" },
  { icon: <Lightbulb className="w-4 h-4" />, label: "Generating recommendations" },
];

export default function BrandAudit() {
  const [brand, setBrand] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [auditBrand, setAuditBrand] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const runAudit = async () => {
    if (!brand.trim()) return;
    setLoading(true);
    setAudit(null);
    setError(null);
    setAuditBrand(brand);

    // Animate through steps
    for (let i = 0; i < STEPS.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 900));
    }

    try {
      const resp = await fetch("/api/brand-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: brand.trim(), website: website.trim(), industry: industry.trim() }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Audit failed.");
      setAudit(data.audit);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setCurrentStep(-1);
    }
  };

  const totalVisitsAtRisk = audit?.competitorsBeatYou?.reduce((sum, c) => sum + c.visitsAtRisk, 0) || 0;
  const totalKeywordUpside = audit?.keywordOpportunities?.reduce((sum, k) => sum + (k.visitLift || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">

      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0d0d14] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">GEO Brand Auditor</span>
            <span className="text-[10px] bg-violet-900/50 text-violet-300 border border-violet-700/50 px-1.5 py-0.5 rounded font-mono">BETA</span>
          </div>
          <span className="text-[11px] text-gray-500">Powered by Gemini 2.5 Flash + SerpAPI</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            See Where Your Brand <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Actually Stands</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Enter your brand name and website. We'll crawl your homepage, analyze SEO signals, score competitors, and generate remediation in seconds.
          </p>
        </div>

        <div className="bg-gray-900/80 border border-gray-700/50 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Brand Name *</label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                onKeyDown={e => e.key === "Enter" && runAudit()}
                placeholder="e.g. Nafees Bakery, ZK Interiors, Nike"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Website URL</label>
                <input
                  type="text"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="e.g. zkinteriors.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1.5 block">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  placeholder="e.g. Interior Design, Bakery"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
              </div>
            </div>
            <button
              onClick={runAudit}
              disabled={loading || !brand.trim()}
              className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                loading || !brand.trim()
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/30 active:scale-[0.99]"
              }`}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Running Audit...</> : <><Zap className="w-4 h-4" /> Run Full Brand Audit</>}
            </button>
          </div>
        </div>

        {/* Loading Steps */}
        {loading && (
          <div className="max-w-2xl mx-auto mt-6 bg-gray-900/60 border border-gray-700/50 rounded-2xl p-5">
            <div className="space-y-3">
              {STEPS.map((step, i) => (
                <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${
                  i < currentStep ? "opacity-40" : i === currentStep ? "opacity-100" : "opacity-20"
                }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    i < currentStep ? "bg-emerald-900/50 text-emerald-400" :
                    i === currentStep ? "bg-violet-900/50 text-violet-400 animate-pulse" :
                    "bg-gray-800 text-gray-600"
                  }`}>
                    {i < currentStep ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
                  </div>
                  <span className={`text-sm font-medium ${i === currentStep ? "text-white" : "text-gray-500"}`}>
                    {step.label}
                  </span>
                  {i === currentStep && <Loader2 className="w-3.5 h-3.5 text-violet-400 animate-spin ml-auto" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mt-4 bg-red-900/20 border border-red-800/50 rounded-xl p-4 flex gap-3 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results */}
      {audit && (
        <div ref={resultsRef} className="max-w-5xl mx-auto px-6 pb-16 space-y-6">

          {/* Hero Score Card */}
          <div className="bg-gray-900 border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-start gap-6">
              <ScoreRing score={audit.overallScore} size={130} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">GEO + SEO Audit</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-1">{auditBrand}</h2>
                {website && <p className="text-violet-400 text-sm mb-2 flex items-center gap-1"><Globe className="w-3.5 h-3.5" />{website}</p>}
                <p className="text-gray-400 text-sm mb-4">
                  {audit.overallScore >= 80 ? "Strong foundation with room to grow." :
                   audit.overallScore >= 60 ? "Good base — some meaningful issues holding this back." :
                   audit.overallScore >= 40 ? "Meaningful issues holding this site back." :
                   "Critical issues need immediate attention."}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {audit.issuesSummary.critical > 0 && (
                    <span className="px-2.5 py-1 bg-red-900/40 text-red-400 border border-red-800/50 rounded-lg text-xs font-bold">
                      {audit.issuesSummary.critical} critical
                    </span>
                  )}
                  {audit.issuesSummary.needsWork > 0 && (
                    <span className="px-2.5 py-1 bg-amber-900/40 text-amber-400 border border-amber-800/50 rounded-lg text-xs font-bold">
                      {audit.issuesSummary.needsWork} needs work
                    </span>
                  )}
                  {audit.issuesSummary.wins > 0 && (
                    <span className="px-2.5 py-1 bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 rounded-lg text-xs font-bold">
                      {audit.issuesSummary.wins} wins
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Opportunity */}
          <div className="bg-gradient-to-br from-gray-900 via-indigo-950/30 to-gray-900 border border-indigo-800/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">Traffic Opportunity</span>
            </div>
           
            <div className="flex items-end gap-4 mb-4">
              <div>
                <div className="text-5xl font-black text-white">
                  +{audit.trafficOpportunity.additionalVisitsPerMonth.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm mt-1">visits / month within reach over the next {audit.trafficOpportunity.timeframe} if priority gaps are fixed</div>
              </div>
              <div className="ml-auto flex gap-6 text-right">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Today</div>
                  <div className="text-2xl font-black text-white">{audit.trafficOpportunity.currentEstimatedVisits.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500">visits / mo</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Potential</div>
                  <div className="text-2xl font-black text-indigo-400">{audit.trafficOpportunity.potentialVisits.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500">visits / mo</div>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min(100, (audit.trafficOpportunity.currentEstimatedVisits / audit.trafficOpportunity.potentialVisits) * 100)}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Captured</span>
              <span>Headroom</span>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 bg-indigo-900/30 border border-indigo-700/40 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold">
                <TrendingUp className="w-3 h-3" /> {audit.trafficOpportunity.multipleOfCurrentTraffic}× your current traffic
              </span>
            </div>
          </div>

           {audit?.trafficOpportunity?.additionalVisitsPerMonth > 0 && (
  <div className="w-full border border-violet-800/30 bg-gradient-to-r from-violet-900/20 via-gray-900 to-violet-900/20 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4 shadow-sm">
    <div className="flex items-center gap-3 min-w-0">
      <div className="shrink-0 flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-400">
          Capture the Upside
        </span>
      </div>

      <div className="hidden sm:block w-px h-4 bg-violet-800/40" />

      <p className="text-sm font-medium text-gray-300 truncate">
        Want to actually capture these{" "}
        <span className="font-black text-violet-400">
          +{audit.trafficOpportunity.additionalVisitsPerMonth.toLocaleString()} visits/mo
        </span>
        ?
      </p>
    </div>

    <button
      className="shrink-0 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl text-sm font-bold text-white transition-all"
    >
      Activate GEO Ranker →
    </button>
  </div>
)}

          {/* Competitors Beating You */}
          <div className="bg-gray-900 border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-rose-400" />
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Competitors Beating You</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Total at Risk</div>
                <div className="text-xl font-black text-rose-400">{totalVisitsAtRisk.toLocaleString()}K <span className="text-sm text-gray-500 font-normal">/mo</span></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">These domains are intercepting clicks you could be earning.</p>
            <div className="space-y-3">
              {audit.competitorsBeatYou?.map((comp, i) => {
                const barWidth = Math.min(100, (comp.visitsAtRisk / (audit.competitorsBeatYou[0]?.visitsAtRisk || 1)) * 100);
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-black text-gray-400">{i + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-sm font-semibold text-white flex items-center gap-1">
                            {comp.domain} <ExternalLink className="w-3 h-3 text-gray-500" />
                          </span>
                          <span className="text-[10px] text-gray-500">Outranks you on {comp.outranksOnKeywords} keyword{comp.outranksOnKeywords !== 1 ? "s" : ""}</span>
                        </div>
                        <span className="text-rose-400 font-black text-sm">+{comp.visitsAtRisk.toLocaleString()} <span className="text-[10px] text-gray-500 font-normal">visits at risk</span></span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1">
                        <div className="bg-rose-500 h-1 rounded-full" style={{ width: `${barWidth}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keyword Opportunities */}
          <div className="bg-gray-900 border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-violet-400" />
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Keyword Opportunities</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 uppercase">Total Upside</div>
                <div className="text-xl font-black text-violet-400">+{totalKeywordUpside.toLocaleString()} <span className="text-sm text-gray-500 font-normal">/mo</span></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">Per-keyword traffic lift if you reach the rank we project — sorted by upside.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left py-2 font-semibold uppercase tracking-wider">Keyword</th>
                    <th className="text-right py-2 font-semibold uppercase tracking-wider">Vol /mo</th>
                    <th className="text-center py-2 font-semibold uppercase tracking-wider">Rank: Now → Potential</th>
                    <th className="text-right py-2 font-semibold uppercase tracking-wider">Visit Lift</th>
                    <th className="text-right py-2 font-semibold uppercase tracking-wider">Beating You</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {audit.keywordOpportunities?.map((kw, i) => (
                    <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 text-white font-medium">{kw.keyword}</td>
                      <td className="py-3 text-right text-gray-300">{kw.volumePerMonth?.toLocaleString()}</td>
                      <td className="py-3 text-center">
                        <span className={`${kw.currentRank === "not ranking" ? "text-gray-500" : "text-amber-400"} font-mono`}>
                          {kw.currentRank}
                        </span>
                        <span className="text-gray-600 mx-1">→</span>
                        <span className="text-violet-400 font-mono font-bold">#{kw.potentialRank}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-violet-400 font-black">↗ {kw.visitLift?.toLocaleString()}</span>
                      </td>
                      <td className="py-3 text-right text-gray-400">{kw.beatingYou}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO Category Scores + Supporting Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">SEO Category Scores</span>
              </div>
              {audit.categoryScores?.map((cat, i) => (
                <CategoryScoreBar key={i} {...cat} />
              ))}
            </div>

            <div className="bg-gray-900 border border-gray-700/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Supporting Evidence</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Title", value: audit.seoSignals?.title, truncate: true },
                  { label: "Meta description", value: `${audit.seoSignals?.metaDescriptionLength} chars` },
                  { label: "H1 tags", value: audit.seoSignals?.h1Count },
                  { label: "HTTPS", value: audit.seoSignals?.httpsEnabled ? "yes" : "no", good: audit.seoSignals?.httpsEnabled },
                  { label: "Images missing alt", value: `${audit.seoSignals?.imagesMissingAlt} / ${audit.seoSignals?.totalImages}`, bad: (audit.seoSignals?.imagesMissingAlt || 0) > 10 },
                  { label: "Schema markup", value: audit.seoSignals?.schemaMarkup ? "yes" : "no", good: audit.seoSignals?.schemaMarkup },
                  { label: "Open Graph tags", value: audit.seoSignals?.openGraphTags ? "yes" : "no", good: audit.seoSignals?.openGraphTags },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-800 pb-2 last:border-0 last:pb-0">
                    <span className="text-xs text-gray-500">{row.label}</span>
                    <span className={`text-xs font-semibold text-right max-w-[55%] truncate ${
                      row.bad ? "text-red-400" : row.good ? "text-emerald-400" : "text-gray-300"
                    }`}>
                      {String(row.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What's Working + Top Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-emerald-800/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">What's Working</span>
              </div>
              <div className="space-y-3">
                {audit.whatsWorking?.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-gray-300 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-amber-800/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Top Suggestions</span>
              </div>
              <div className="space-y-3">
                {audit.topSuggestions?.map((s, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-900/50 border border-amber-700/50 flex items-center justify-center text-[10px] font-black text-amber-400 flex-shrink-0">{s.priority}</div>
                    <div>
                      <p className="text-xs font-semibold text-white">{s.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GEO Remediation */}
          <div className="bg-gradient-to-br from-gray-900 via-violet-950/20 to-gray-900 border border-violet-800/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Target className="w-4 h-4 text-violet-400" />
              <span className="text-[10px] uppercase tracking-widest text-violet-400 font-bold">GEO Remediation Plan</span>
              <span className="text-[10px] bg-violet-900/50 text-violet-300 border border-violet-700/40 px-1.5 py-0.5 rounded font-mono ml-1">AI Visibility Fixes</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Content Gaps", items: audit.geoRemediation?.contentGaps, color: "rose" },
                { title: "Citation Opportunities", items: audit.geoRemediation?.citationOpportunities, color: "amber" },
                { title: "Entity Strengthening", items: audit.geoRemediation?.entityStrengthening, color: "sky" },
                { title: "AI Visibility Fixes", items: audit.geoRemediation?.aiVisibilityFixes, color: "violet" },
              ].map((section, i) => (
                <div key={i} className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-4">
                  <h4 className={`text-xs font-bold text-${section.color}-400 mb-2 uppercase tracking-wider`}>{section.title}</h4>
                  <div className="space-y-1.5">
                    {section.items?.map((item, j) => (
                      <div key={j} className="flex gap-2 text-[11px] text-gray-300">
                        <ChevronRight className={`w-3 h-3 text-${section.color}-500 mt-0.5 flex-shrink-0`} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Re-audit button */}
          <div className="text-center">
            <button
              onClick={runAudit}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-semibold text-gray-300 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Re-run Audit
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
