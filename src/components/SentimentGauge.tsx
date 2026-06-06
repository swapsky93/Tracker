// import React, { useState, useEffect } from "react";
// import { motion } from "motion/react";

// interface SentimentGaugeProps {
//   score: number | null;
// }

// export function SentimentGauge({ score }: SentimentGaugeProps) {
//   const [isBrandAbsent, setIsBrandAbsent] = useState(false);

//   useEffect(() => {
//     // Looks for the "BRAND ABSENT" label anywhere in your app's DOM tree
//     const checkDomForAbsence = () => {
//       const pageText = document.body.innerText || "";
//       if (pageText.includes("BRAND ABSENT") || pageText.includes("Brand Absent")) {
//         setIsBrandAbsent(true);
//       } else {
//         setIsBrandAbsent(false);
//       }
//     };

//     // Run immediately on mount
//     checkDomForAbsence();

//     // Optional: Watch for dynamic updates if the user switches brands without reloading
//     const observer = new MutationObserver(checkDomForAbsence);
//     observer.observe(document.body, { childList: true, subtree: true });

//     return () => observer.disconnect();
//   }, []);

//   // Force Null state if explicitly absent in the DOM OR if score is missing
//   if (score === null || score === undefined || isBrandAbsent) {
//     return (
//       <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-xl border border-gray-100 h-full min-h-[180px]" id="sentiment-gauge-null">
//         <span className="text-gray-400 text-sm font-medium">Sentiment N/A</span>
//         <span className="text-gray-300 text-xs mt-1 text-center">Brand was not mentioned</span>
//       </div>
//     );
//   }

//   // Map score from [-1.0, 1.0] to [0, 180] degrees for gauge needle rotation
//   const percentage = (score + 1) / 2; // [0, 1] Range
//   const angle = percentage * 180 - 90; // [-90, 90] degrees

//   // Color mapping
//   let colorClass = "text-yellow-500";
//   let strokeColor = "#EAB308";
//   let description = "Neutral reference";

//   if (score >= 0.6) {
//     colorClass = "text-emerald-600";
//     strokeColor = "#059669";
//     description = "Strong Endorsement";
//   } else if (score >= 0.2) {
//     colorClass = "text-teal-600";
//     strokeColor = "#0D9488";
//     description = "Favorable Mention";
//   } else if (score <= -0.6) {
//     colorClass = "text-rose-600";
//     strokeColor = "#E11D48";
//     description = "Strongly Skeptical";
//   } else if (score <= -0.2) {
//     colorClass = "text-amber-600";
//     strokeColor = "#D97706";
//     description = "Critical Mention";
//   }

//   return (
//     <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm h-full" id="sentiment-gauge-active">
//       <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Response Sentiment</h4>
      
//       {/* Semi-circular gauge */}
//       <div className="relative w-40 h-24 flex items-end justify-center overflow-hidden">
//         <svg className="w-40 h-20 overflow-visible" viewBox="0 0 100 50">
//           <defs>
//             <linearGradient id="sentiment-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor="#E11D48" /> {/* Rose */}
//               <stop offset="30%" stopColor="#D97706" /> {/* Amber */}
//               <stop offset="50%" stopColor="#EAB308" /> {/* Yellow */}
//               <stop offset="70%" stopColor="#0D9488" /> {/* Teal */}
//               <stop offset="100%" stopColor="#059669" /> {/* Emerald */}
//             </linearGradient>
//           </defs>
          
//           {/* Track Arc */}
//           <path
//             d="M 10 50 A 40 40 0 0 1 90 50"
//             fill="none"
//             stroke="#F3F4F6"
//             strokeWidth="10"
//             strokeLinecap="round"
//           />
          
//           {/* Gradient Display Arc */}
//           <path
//             d="M 10 50 A 40 40 0 0 1 90 50"
//             fill="none"
//             stroke="url(#sentiment-gradient)"
//             strokeWidth="10"
//             strokeLinecap="round"
//             className="opacity-90"
//           />

//           {/* Needle Pin */}
//           <circle cx="50" cy="50" r="4" fill="#374151" />
          
//           {/* Animated Needle */}
//           <motion.line
//             x1="50"
//             y1="50"
//             x2="50"
//             y2="15"
//             stroke="#1F2937"
//             strokeWidth="2.5"
//             strokeLinecap="round"
//             initial={{ rotate: -90, originX: "50px", originY: "50px" }}
//             animate={{ rotate: angle }}
//             transition={{ type: "spring", stiffness: 100, damping: 15 }}
//           />
//         </svg>
        
//         {/* Scale indicators */}
//         <span className="absolute left-2 bottom-0 text-[10px] text-rose-500 font-bold">-1.0</span>
//         <span className="absolute left-[45%] bottom-14 text-[10px] text-gray-400 font-semibold">0.0</span>
//         <span className="absolute right-2 bottom-0 text-[10px] text-emerald-600 font-bold">+1.0</span>
//       </div>

//       <div className="text-center mt-3">
//         <div className="flex items-center justify-center gap-1.5">
//           <span className={`text-2xl font-bold tracking-tight ${colorClass}`}>
//             {score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)}
//           </span>
//         </div>
//         <p className={`text-xs font-semibold mt-0.5 ${colorClass}`}>{description}</p>
//       </div>
//     </div>
//   );
// }


// import React from "react";
// import { motion } from "motion/react";

// interface SentimentGaugeProps {
//   score: number | null;
// }

// export function SentimentGauge({ score }: SentimentGaugeProps) {
//   // ✅ FIX: Removed the buggy DOM MutationObserver entirely. 
//   // Your data adapter utility already sets score to null when "Brand Absent" occurs!

//   // Force Null state if explicitly absent or if score is missing
//   if (score === null || score === undefined) {
//     return (
//       <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-xl border border-gray-100 h-full min-h-[180px]" id="sentiment-gauge-null">
//         <span className="text-gray-400 text-sm font-medium">Sentiment N/A</span>
//         <span className="text-gray-300 text-xs mt-1 text-center">Brand was not mentioned</span>
//       </div>
//     );
//   }

//   // Map score from [-1.0, 1.0] to [0, 180] degrees for gauge needle rotation
//   const percentage = (score + 1) / 2; // [0, 1] Range
//   const angle = percentage * 180 - 90; // [-90, 90] degrees

//   // Color mapping
//   let colorClass = "text-yellow-500";
//   let description = "Neutral reference";

//   if (score >= 0.6) {
//     colorClass = "text-emerald-600";
//     description = "Strong Endorsement";
//   } else if (score >= 0.2) {
//     colorClass = "text-teal-600";
//     description = "Favorable Mention";
//   } else if (score <= -0.6) {
//     colorClass = "text-rose-600";
//     description = "Strongly Skeptical";
//   } else if (score <= -0.2) {
//     colorClass = "text-amber-600";
//     description = "Critical Mention";
//   }

//   return (
//     <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm h-full" id="sentiment-gauge-active">
//       <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Response Sentiment</h4>
      
//       {/* Semi-circular gauge */}
//       <div className="relative w-40 h-24 flex items-end justify-center overflow-hidden">
//         <svg className="w-40 h-20 overflow-visible" viewBox="0 0 100 50">
//           <defs>
//             <linearGradient id="sentiment-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//               <stop offset="0%" stopColor="#E11D48" /> {/* Rose */}
//               <stop offset="30%" stopColor="#D97706" /> {/* Amber */}
//               <stop offset="50%" stopColor="#EAB308" /> {/* Yellow */}
//               <stop offset="70%" stopColor="#0D9488" /> {/* Teal */}
//               <stop offset="100%" stopColor="#059669" /> {/* Emerald */}
//             </linearGradient>
//           </defs>
          
//           {/* Track Arc */}
//           <path
//             d="M 10 50 A 40 40 0 0 1 90 50"
//             fill="none"
//             stroke="#F3F4F6"
//             strokeWidth="10"
//             strokeLinecap="round"
//           />
          
//           {/* Gradient Display Arc */}
//           <path
//             d="M 10 50 A 40 40 0 0 1 90 50"
//             fill="none"
//             stroke="url(#sentiment-gradient)"
//             strokeWidth="10"
//             strokeLinecap="round"
//             className="opacity-90"
//           />

//           {/* Needle Pin */}
//           <circle cx="50" cy="50" r="4" fill="#374151" />
          
//           {/* Animated Needle */}
//           <motion.line
//             x1="50"
//             y1="50"
//             x2="50"
//             y2="15"
//             stroke="#1F2937"
//             strokeWidth="2.5"
//             strokeLinecap="round"
//             initial={{ rotate: -90, originX: "50px", originY: "50px" }}
//             animate={{ rotate: angle }}
//             transition={{ type: "spring", stiffness: 100, damping: 15 }}
//           />
//         </svg>
        
//         {/* Scale indicators */}
//         <span className="absolute left-2 bottom-0 text-[10px] text-rose-500 font-bold">-1.0</span>
//         <span className="absolute left-[45%] bottom-14 text-[10px] text-gray-400 font-semibold">0.0</span>
//         <span className="absolute right-2 bottom-0 text-[10px] text-emerald-600 font-bold">+1.0</span>
//       </div>

//       <div className="text-center mt-3">
//         <div className="flex items-center justify-center gap-1.5">
//           <span className={`text-2xl font-bold tracking-tight ${colorClass}`}>
//             {score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)}
//           </span>
//         </div>
//         <p className={`text-xs font-semibold mt-0.5 ${colorClass}`}>{description}</p>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { motion } from "motion/react";

interface SentimentGaugeProps {
  score: number | null;
}

export function SentimentGauge({ score }: SentimentGaugeProps) {
  // ✅ Cleaned: Buggy MutationObserver and state hook removed completely.
  // Your App.tsx adapter now handles setting score to null cleanly.

  // Force Null state if explicitly absent or if score is missing
  if (score === null || score === undefined) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-xl border border-gray-100 h-full min-h-[180px]" id="sentiment-gauge-null">
        <span className="text-gray-400 text-sm font-medium">Sentiment N/A</span>
        <span className="text-gray-300 text-xs mt-1 text-center">Brand was not mentioned</span>
      </div>
    );
  }

  // Map score from [-1.0, 1.0] to [0, 180] degrees for gauge needle rotation
  const percentage = (score + 1) / 2; // [0, 1] Range
  const angle = percentage * 180 - 90; // [-90, 90] degrees

  // Color mapping
  let colorClass = "text-yellow-500";
  let description = "Neutral reference";

  if (score >= 0.6) {
    colorClass = "text-emerald-600";
    description = "Strong Endorsement";
  } else if (score >= 0.2) {
    colorClass = "text-teal-600";
    description = "Favorable Mention";
  } else if (score <= -0.6) {
    colorClass = "text-rose-600";
    description = "Strongly Skeptical";
  } else if (score <= -0.2) {
    colorClass = "text-amber-600";
    description = "Critical Mention";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm h-full" id="sentiment-gauge-active">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Response Sentiment</h4>

      {/* Semi-circular gauge */}
      <div className="relative w-40 h-24 flex items-end justify-center overflow-hidden">
        <svg className="w-40 h-20 overflow-visible" viewBox="0 0 100 50">
          <defs>
            <linearGradient id="sentiment-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E11D48" />
              <stop offset="30%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="70%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="10"
            strokeLinecap="round"
          />

          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="url(#sentiment-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            className="opacity-90"
          />

          <circle cx="50" cy="50" r="4" fill="#374151" />

          <motion.line
            x1="50"
            y1="50"
            x2="50"
            y2="15"
            stroke="#1F2937"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ rotate: -90, originX: "50px", originY: "50px" }}
            animate={{ rotate: angle }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          />
        </svg>

        <span className="absolute left-2 bottom-0 text-[10px] text-rose-500 font-bold">-1.0</span>
        <span className="absolute left-[45%] bottom-14 text-[10px] text-gray-400 font-semibold">0.0</span>
        <span className="absolute right-2 bottom-0 text-[10px] text-emerald-600 font-bold">+1.0</span>
      </div>

      <div className="text-center mt-3">
        <div className="flex items-center justify-center gap-1.5">
          <span className={`text-2xl font-bold tracking-tight ${colorClass}`}>
            {score > 0 ? `+${score.toFixed(2)}` : score.toFixed(2)}
          </span>
        </div>
        <p className={`text-xs font-semibold mt-0.5 ${colorClass}`}>{description}</p>
      </div>
    </div>
  );
}
