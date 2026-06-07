import React, { useState } from "react";
import { Zap, ArrowUpRight, X, TrendingUp, CheckCircle2, Shield, CreditCard, Sparkles } from "lucide-react";

interface CaptureUpsideBannerProps {
  visitsGain?: number;    // e.g. 833
  brandName?: string;     // e.g. "HubSpot"
  stripePaymentLink?: string; // Your Stripe Payment Link URL
}

// ─── Stripe Checkout Modal ──────────────────────────────────────────────────
function StripeCheckoutModal({ onClose, visitsGain, brandName }: { onClose: () => void; visitsGain: number; brandName: string }) {
  const [tab, setTab] = useState<"card" | "upi">("card");
  const [email, setEmail] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + " / " + d.slice(2) : d;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In production: redirect to your Stripe Payment Link or call your backend
    // e.g. window.location.href = "https://buy.stripe.com/YOUR_LINK";
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header stripe */}
        <div className="bg-[#635BFF] px-6 pt-5 pb-4 text-white">
          <button onClick={onClose} className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-white/80 tracking-wide">GEO Ranker · Starter Plan</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight">$49</span>
            <span className="text-sm text-white/70 font-medium">/ month</span>
          </div>
          <p className="text-xs text-white/60 mt-0.5">₹4,953.56 / month · Billed monthly · Cancel anytime</p>
          
          {/* What you get */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["10 articles/mo", "Keyword rank tracking", "AI search visibility", "GEO analytics"].map(f => (
              <span key={f} className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full font-medium">{f}</span>
            ))}
          </div>
        </div>

        {step === "success" ? (
          <div className="p-8 flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-base font-black text-gray-900">You're activated!</h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              Welcome to GEO Ranker. Your dashboard is being set up — check your email at <strong>{email || "your inbox"}</strong> for next steps.
            </p>
            <button onClick={onClose} className="mt-2 w-full py-2.5 bg-[#635BFF] hover:bg-[#5147e6] text-white text-sm font-semibold rounded-xl transition-colors">
              Back to Analyzer
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Contact info */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#635BFF]/30 focus:border-[#635BFF] transition-all"
              />
            </div>

            {/* Payment method tabs */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-wider">Payment Method</label>
              
              {/* Apple Pay button */}
              <button
                type="button"
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mb-3 text-sm"
                onClick={() => alert("Apple Pay requires HTTPS + Safari. Set up your Stripe Payment Link to enable it.")}
              >
                {/* Apple logo SVG */}
                <svg className="w-4 h-4" viewBox="0 0 814 1000" fill="currentColor">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.3-150.3-109.2c-43.2-64.2-78.4-165.5-78.4-261.8 0-192 124.5-293.4 246.8-293.4 63.1 0 115.6 41.8 154.7 41.8 37.5 0 96.9-44.2 168.2-44.2zm-192.6-166.3c31.3-37.5 53.7-89.8 53.7-142.1 0-7.7-.6-15.4-1.9-21.7-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 84.7-55.1 137.7 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 134.9-70.2z"/>
                </svg>
                Pay
              </button>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Or pay with card</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Card form */}
              <form onSubmit={handlePay} className="space-y-3">
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                  {/* Card number */}
                  <div className="flex items-center px-3 py-2.5 gap-2">
                    <input
                      required
                      type="text"
                      value={cardNum}
                      onChange={e => setCardNum(formatCard(e.target.value))}
                      placeholder="1234 1234 1234 1234"
                      className="flex-1 text-sm outline-none bg-transparent placeholder-gray-300"
                    />
                    <div className="flex gap-1 shrink-0">
                      {["VISA","MC","AMEX","DC"].map(b => (
                        <span key={b} className="text-[8px] font-black px-1 py-0.5 border rounded text-gray-400 border-gray-200">{b}</span>
                      ))}
                    </div>
                  </div>
                  {/* Expiry + CVC */}
                  <div className="flex divide-x divide-gray-200">
                    <input
                      required
                      type="text"
                      value={expiry}
                      onChange={e => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM / YY"
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent placeholder-gray-300"
                    />
                    <input
                      required
                      type="text"
                      value={cvc}
                      onChange={e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="CVC"
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent placeholder-gray-300"
                    />
                  </div>
                </div>

                {/* Cardholder name */}
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Full name on card"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#635BFF]/30 focus:border-[#635BFF] transition-all"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#635BFF] hover:bg-[#5147e6] active:scale-[0.98]"}`}
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : (
                    <>Subscribe · $49/mo</>
                  )}
                </button>
              </form>
            </div>

            {/* Trust footer */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <Shield className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-400">Secured by </span>
              <span className="text-[10px] font-black text-gray-500 tracking-tight">stripe</span>
              <span className="text-gray-300 mx-1">·</span>
              <span className="text-[10px] text-gray-400">Terms</span>
              <span className="text-gray-300 mx-1">·</span>
              <span className="text-[10px] text-gray-400">Privacy</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Banner Component ───────────────────────────────────────────────────
export default function CaptureUpsideBanner({ visitsGain = 833, brandName = "your brand", stripePaymentLink }: CaptureUpsideBannerProps) {
  const [open, setOpen] = useState(false);

  const handleActivate = () => {
    // If you have a real Stripe Payment Link, uncomment:
    // if (stripePaymentLink) { window.open(stripePaymentLink, "_blank"); return; }
    setOpen(true);
  };

  return (
    <>
      <div className="w-full border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-violet-50 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-500">Capture the Upside</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-violet-200" />
          <p className="text-sm font-medium text-gray-700 truncate">
            Want to actually capture these{" "}
            <span className="font-black text-violet-700">+{visitsGain.toLocaleString()} visits/mo</span>
            {brandName !== "your brand" && (
              <span className="text-gray-500"> for <span className="font-semibold">{brandName}</span></span>
            )}
            ?
          </p>
        </div>

        <button
          onClick={handleActivate}
          className="shrink-0 flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-violet-200"
        >
          <Zap className="w-3.5 h-3.5" />
          Activate Geo Ranker
          <ArrowUpRight className="w-3 h-3 opacity-70" />
        </button>
      </div>

      {open && (
        <StripeCheckoutModal
          onClose={() => setOpen(false)}
          visitsGain={visitsGain}
          brandName={brandName}
        />
      )}
    </>
  );
}
