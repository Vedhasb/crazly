"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Detect rough region via timezone for INR vs USD
function useRegion() {
  const [isIndia, setIsIndia] = useState(false);
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setIsIndia(tz.startsWith("Asia/Kolkata") || tz.startsWith("Asia/Calcutta"));
    } catch {}
  }, []);
  return isIndia;
}

const freeFeatures = [
  "1 workflow per session",
  "5 AI roles",
  "Tool recommendations",
  "Step-by-step execution plan",
  "Mobile + desktop access",
];

const proFeatures = [
  "Unlimited workflows",
  "Exact AI prompts per step",
  "Copy-paste ready scripts",
  "Pro templates library",
  "Priority new roles & workflows",
  "Early access to new features",
  "Email support",
];

export default function PricingPage() {
  const isIndia = useRegion();
  const [mounted, setMounted] = useState(false);
  const [annually, setAnnually] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const monthlyUSD = 9;
  const annualUSD  = 7;
  const monthlyINR = 749;
  const annualINR  = 599;

  const price    = isIndia ? (annually ? annualINR  : monthlyINR)  : (annually ? annualUSD  : monthlyUSD);
  const currency = isIndia ? "₹" : "$";
  const period   = annually ? "/mo, billed yearly" : "/month";

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* BG */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 65%)" }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0)", backgroundSize: "36px 36px" }} />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)" }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-5 sm:px-10 py-4 border-b border-white/[0.06]"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <video
  src="/videos/logo.mp4"
  autoPlay
  loop
  muted
  playsInline
  className="w-8 h-8 rounded-lg object-cover"
/>
          <span className="font-semibold tracking-tight text-white/90">Crazly</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/workflows"
            className="text-sm px-4 py-2 rounded-xl font-medium text-white/60 hover:text-white/90 transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            Try free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-5 pt-16 pb-10 sm:pt-20 sm:pb-12"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(12px)", transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s" }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
          Simple, honest pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Start free.<br />
          <span style={{ background: "linear-gradient(135deg, #6366f1, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Upgrade when ready.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-white/40 max-w-md mx-auto leading-relaxed">
          No credit card required to start. Upgrade to Pro for the exact prompts, scripts, and templates that turn workflows into results.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-3 mt-8 px-4 py-2 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <span className={`text-sm font-medium transition-colors ${!annually ? "text-white" : "text-white/40"}`}>Monthly</span>
          <button
            onClick={() => setAnnually(!annually)}
            className="relative w-10 h-6 rounded-full transition-all"
            style={{ background: annually ? "linear-gradient(135deg, #6366f1, #818cf8)" : "rgba(255,255,255,0.1)" }}>
            <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200"
              style={{ left: annually ? "calc(100% - 20px)" : "4px" }} />
          </button>
          <span className={`text-sm font-medium transition-colors ${annually ? "text-white" : "text-white/40"}`}>
            Annual
            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
              style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
              Save 20%
            </span>
          </span>
        </div>

        {/* Region indicator */}
        {mounted && (
          <p className="mt-3 text-[11px] text-white/25">
            {isIndia ? "🇮🇳 Prices in Indian Rupees (INR)" : "🌍 Prices in USD"}
          </p>
        )}
      </section>

      {/* Plans */}
      <section className="relative z-10 flex-1 px-5 sm:px-10 pb-20"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* FREE */}
          <div className="flex flex-col rounded-2xl p-6 sm:p-8"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-2">Free</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-white">{currency}0</span>
              </div>
              <p className="text-sm text-white/35">Forever free. No card needed.</p>
            </div>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/60">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px]"
                    style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/workflows"
              className="block text-center py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white/90 transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
              Get started free
            </Link>
          </div>

          {/* PRO */}
          <div className="relative flex flex-col rounded-2xl p-6 sm:p-8 overflow-hidden"
            style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.35)", boxShadow: "0 0 60px rgba(99,102,241,0.08)" }}>

            {/* Glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)" }} />

            {/* Badge */}
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "white" }}>
              MOST POPULAR
            </div>

            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-widest text-[#818cf8] font-semibold mb-2">Pro</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-white">{currency}{price}</span>
                <span className="text-sm text-white/40 mb-1.5">{period}</span>
              </div>
              <p className="text-sm text-white/35">
                {annually
                  ? `Billed ${currency}${isIndia ? annualINR * 12 : annualUSD * 12} annually.`
                  : "Cancel anytime."}
              </p>
            </div>

            <ul className="flex flex-col gap-3 mb-8 flex-1">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/75">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px]"
                    style={{ background: "rgba(99,102,241,0.25)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA — payment coming soon */}
            <button
  onClick={async () => {
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: isIndia ? 749 : 9,
        currency: isIndia ? "INR" : "USD",
      }),
    });
    const { orderId } = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: isIndia ? 749 * 100 : 9 * 100,
      currency: isIndia ? "INR" : "USD",
      name: "Crazly",
      description: "Pro Plan — Monthly",
      order_id: orderId,
      handler: async function (response: any) {
        try {
          const res = await fetch("/api/upgrade-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const data = await res.json();
          if (data.success) {
            window.location.href = "/workflows?upgraded=true";
          } else {
            alert("Payment received but upgrade failed. Save this ID: " + response.razorpay_payment_id);
          }
        } catch (err) {
          alert("Payment received! Save this ID: " + response.razorpay_payment_id);
        }
      },
      prefill: { name: "", email: "" },
      theme: { color: "#6366f1" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }}
  className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", boxShadow: "0 4px 24px rgba(99,102,241,0.3)" }}>
  Get Pro — {currency}{price}{period.split(",")[0]}
</button>
            <p className="text-[10px] text-white/25 text-center mt-2.5">
              Payment integration coming soon · Razorpay (India + worldwide)
            </p>
          </div>
        </div>

        {/* FAQ / reassurance strip */}
        <div className="max-w-4xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: "🔒", title: "Secure payments", body: "Razorpay — trusted by 10M+ businesses in India." },
            { icon: "↩️", title: "Cancel anytime",  body: "No contracts. Cancel from your account in one click." },
            { icon: "🌍", title: "Works worldwide", body: "Cards, UPI, NetBanking, PayPal — all supported." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 px-5 py-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold text-white/70 mb-0.5">{item.title}</p>
                <p className="text-xs text-white/35 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] px-5 sm:px-10 py-4 flex flex-col sm:flex-row items-center gap-1 sm:justify-between">
        <span className="text-xs text-white/20">© 2025 Crazly</span>
        <Link href="/" className="text-xs text-white/20 hover:text-white/40 transition-colors">← Back to home</Link>
      </footer>
    </div>
  );
}