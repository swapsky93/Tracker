export interface RawAuditData {
  // Global historical database baselines
  totalAudits: number;
  historicalMentionRate: number;    // e.g., 0.75 for 75%
  globalGeoSentiment: number;       // e.g., 0.68
  
  // Real-time live test snapshot data
  enginePresence: "Brand Present" | "Brand Absent";
  liveResponseSentiment: number;    // e.g., 0.80
}

export interface UIStateAdapter {
  // Cleaned metrics ready for UI elements
  globalMetrics: {
    totalAudits: number;
    shareOfVoiceText: string;
    historicalSentiment: number;
  };
  liveMetrics: {
    presenceStatus: "Brand Present" | "Brand Absent";
    // Returns null if the brand is absent to trigger your SentimentGauge fallback UI
    gaugeScore: number | null; 
    hasContradictionWarning: boolean;
    warningMessage: string | null;
  };
}

/**
 * Adapter utility that formats raw audit metrics for the dashboard.
 * Prevents UI contradictions when historical data conflicts with real-time absence.
 */
export function adaptAuditDataToUI(data: RawAuditData): UIStateAdapter {
  const isAbsent = data.enginePresence === "Brand Absent";

  // Build the unified layout payload safely
  return {
    globalMetrics: {
      totalAudits: data.totalAudits,
      // Clear up naming confusion: label it as historical Share of Voice
      shareOfVoiceText: `${(data.historicalMentionRate * 100).toFixed(0)}% Historical Share`,
      historicalSentiment: data.globalGeoSentiment,
    },
    liveMetrics: {
      presenceStatus: data.enginePresence,
      // FIX: Force score to null if absent so the SentimentGauge shows "N/A"
      gaugeScore: isAbsent ? null : data.liveResponseSentiment,
      
      // Flags to feed warning banners or tooltip highlights in the UI
      hasContradictionWarning: isAbsent && data.historicalMentionRate > 0.4,
      warningMessage: isAbsent 
        ? `Note: While this specific AI reply omitted the brand, your historical regional visibility remains high at ${(data.historicalMentionRate * 100).toFixed(0)}%.`
        : null,
    },
  };
}
