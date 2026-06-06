import React from "react";
import { Award, ShieldAlert, CheckCircle2, Star, HelpingHand } from "lucide-react";

interface AuthorityMeterProps {
  score: number | null;
}

export function AuthorityMeter({ score }: AuthorityMeterProps) {
  if (score === null || score === undefined) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-xl border border-gray-100 h-full min-h-[180px]" id="authority-meter-null">
        <span className="text-gray-400 text-sm font-medium">Authority N/A</span>
        <span className="text-gray-300 text-xs mt-1 text-center">Brand was not mentioned</span>
      </div>
    );
  }

  // Descriptions for levels
  const levels = [
    { value: 1, label: "Minor Footnote", desc: "Background mention or passing footnote.", color: "bg-gray-400", textColor: "text-gray-600", bgLight: "bg-gray-50", icon: ShieldAlert },
    { value: 2, label: "Passing Reference", desc: "Mentioned briefly or marginally.", color: "bg-amber-400", textColor: "text-amber-700", bgLight: "bg-amber-50", icon: HelpingHand },
    { value: 3, label: "Relevant Tier", desc: "Listed as an equal option among several.", color: "bg-teal-400", textColor: "text-teal-700", bgLight: "bg-teal-50", icon: CheckCircle2 },
    { value: 4, label: "Preferred Option", desc: "A top-tier option with specialized features.", color: "bg-indigo-500", textColor: "text-indigo-700", bgLight: "bg-indigo-50", icon: Star },
    { value: 5, fill: true, label: "Market Leader", desc: "Uncontested first choice or primary recommendation.", color: "bg-rose-500", textColor: "text-rose-700", bgLight: "bg-rose-50", icon: Award }
  ];

  const currentLevel = levels[Math.max(0, Math.min(score - 1, 4))];
  const IconComponent = currentLevel.icon;

  return (
    <div className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 shadow-sm h-full" id="authority-meter-active">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 text-center">Contextual Authority</h4>
      
      {/* 5 columns resembling signal bars */}
      <div className="flex items-end justify-center gap-2.5 h-16 mb-4">
        {[1, 2, 3, 4, 5].map((level) => {
          const isActive = level <= score;
          let barColor = "bg-gray-100";
          if (isActive) {
            if (score === 5) barColor = "bg-gradient-to-t from-emerald-500 to-teal-400";
            else if (score >= 3) barColor = "bg-gradient-to-t from-indigo-500 to-indigo-400";
            else barColor = "bg-gradient-to-t from-amber-500 to-amber-400";
          }
          
          // Height corresponding to level (exponential scaling or simple step)
          const heightClass = [
            "h-4", // level 1
            "h-7", // level 2
            "h-10", // level 3
            "h-13", // level 4
            "h-16"  // level 5
          ][level - 1];

          return (
            <div key={level} className="flex flex-col items-center gap-1">
              <div 
                className={`w-4.5 rounded-t-sm transition-all duration-500 ${heightClass} ${barColor}`}
                title={`Level ${level}`}
              />
              <span className={`text-[9px] font-bold ${isActive ? "text-gray-700" : "text-gray-300"}`}>
                L{level}
              </span>
            </div>
          );
        })}
      </div>

      <div className={`mt-auto p-2.5 rounded-lg border border-opacity-35 text-center flex flex-col items-center justify-center ${currentLevel.bgLight} border-gray-100`}>
        <div className="flex items-center gap-1.5 mb-0.5">
          <IconComponent className={`w-4 h-4 ${currentLevel.textColor}`} />
          <span className={`text-xs font-bold ${currentLevel.textColor}`}>
            Level {score}: {currentLevel.label}
          </span>
        </div>
        <p className="text-[11px] text-gray-500 leading-normal">{currentLevel.desc}</p>
      </div>
    </div>
  );
}
