"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const words = ["Developers", "Founders", "Marketers", "Creators", "Students"];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setFading(false);
      }, 400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      className="relative min-h-screen bg-[#080808] text-white overflow-hidden flex flex-col"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] sm:w-[700px] sm:h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)" }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 65%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.018) 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)" }}
        />
      </div>

      {/* ── Nav ── */}
      {/* CHANGE: Added mobile hamburger menu, collapsed nav links on small screens */}
      <nav
        className="relative z-20 flex items-center justify-between px-5 sm:px-10 py-4 sm:py-5"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
          >
            C
          </div>
          <span className="font-semibold tracking-tight text-white/90">Crazly</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden sm:flex items-center gap-6 text-sm text-white/40">
          <span className="hover:text-white/70 transition-colors cursor-pointer">Workflows</span>
          <span className="hover:text-white/70 transition-colors cursor-pointer">Pricing</span>
          <span className="hover:text-white/70 transition-colors cursor-pointer">Docs</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/workflows"
            className="text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-white/10 active:scale-95"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
          >
            {/* CHANGE: Shorter label on mobile to save space */}
            <span className="hidden sm:inline">Get started</span>
            <span className="sm:hidden">Start</span>
          </Link>

          {/* CHANGE: Hamburger button — only shows on mobile */}
          <button
            className="sm:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span
              className="block w-5 h-0.5 bg-white/50 rounded transition-all duration-200"
              style={{ transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none" }}
            />
            <span
              className="block w-5 h-0.5 bg-white/50 rounded transition-all duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-0.5 bg-white/50 rounded transition-all duration-200"
              style={{ transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }}
            />
          </button>
        </div>
      </nav>

      {/* CHANGE: Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="sm:hidden relative z-10 mx-5 mb-2 rounded-2xl overflow-hidden"
          style={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
        >
          {["Workflows", "Pricing", "Docs"].map((item) => (
            <div
              key={item}
              className="px-5 py-3.5 text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/[0.05] last:border-0"
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {/* ── Hero ── */}
      {/* CHANGE: Tighter padding on mobile (pt-8 pb-16), larger on desktop (pt-12 pb-24) */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-24">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium mb-8 sm:mb-10"
          style={{
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.25)",
            color: "#a5b4fc",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(8px)",
            transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
          {/* CHANGE: Shorter badge text on mobile */}
          <span className="hidden sm:inline">AI Workflow Intelligence · MVP</span>
          <span className="sm:hidden">AI Workflow Intelligence</span>
        </div>

        {/* Headline */}
        {/* CHANGE: Fluid font size — clamp from 36px mobile to 80px desktop */}
        <h1
          className="font-bold leading-[1.08] tracking-tight mb-4 max-w-4xl"
          style={{
            fontSize: "clamp(36px, 8vw, 80px)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <span className="text-white">The AI playbook</span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a5b4fc 50%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            built for{" "}
          </span>
          {/* CHANGE: min-width shrinks on mobile so it doesn't overflow */}
          <span
            className="inline-block min-w-[160px] sm:min-w-[280px] text-left"
            style={{
              background: "linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: fading ? 0 : 1,
              transform: fading ? "translateY(-6px)" : "translateY(0)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
            }}
          >
            {words[wordIndex]}
          </span>
        </h1>

        {/* Subheadline */}
        {/* CHANGE: Smaller text on mobile (text-sm), larger on desktop (text-lg) */}
        <p
          className="text-sm sm:text-lg text-white/40 max-w-xs sm:max-w-lg leading-relaxed mb-10 sm:mb-12 px-2"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
          }}
        >
          Stop experimenting with AI. Get exact tools, exact prompts,
          and step-by-step execution systems for your real work.
        </p>

        {/* CTA group */}
        {/* CHANGE: Stack buttons vertically on mobile, side by side on desktop */}
        <div
          className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-6 sm:px-0"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.45s, transform 0.6s ease 0.45s",
          }}
        >
          <Link
            href="/workflows"
            className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              boxShadow: "0 0 0 1px rgba(99,102,241,0.5), 0 8px 32px rgba(99,102,241,0.25)",
            }}
          >
            Generate my workflow
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          <button
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-medium text-white/50 hover:text-white/80 transition-all duration-200"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            See how it works
          </button>
        </div>

        {/* Stats strip */}
        {/* CHANGE: Tighter gap on mobile */}
        <div
          className="mt-12 sm:mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease 0.6s",
          }}
        >
          {[
            { value: "5 roles", label: "covered" },
            { value: "30+", label: "AI tools mapped" },
            { value: "100%", label: "free in MVP" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-base sm:text-lg font-bold text-white/80">{stat.value}</p>
              <p className="text-xs text-white/30 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature strip ── */}
      {/* CHANGE: Single column on mobile, 3 cols on desktop. Removed border-radius overflow clipping that broke on mobile */}
      <section
        className="relative z-10 border-t border-white/[0.06] px-5 sm:px-10 py-10 sm:py-12"
        style={{
          background: "rgba(255,255,255,0.01)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.6s ease 0.7s",
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: "⌥",
              title: "Pick your role",
              body: "Developer, Founder, Creator, Marketer, Student — Crazly knows your context.",
            },
            {
              icon: "◎",
              title: "Describe the problem",
              body: "Type what you're stuck on. No AI jargon required. Just your real-world situation.",
            },
            {
              icon: "⚡",
              title: "Execute the workflow",
              body: "Get exact tools and ordered steps. No fluff, no theory — just execution.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 px-5 sm:px-7 py-6 sm:py-8 rounded-2xl hover:bg-white/[0.02] transition-colors duration-300"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  fontFamily: "monospace",
                  color: "#a5b4fc",
                }}
              >
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white/85 mb-1.5">{f.title}</p>
                <p className="text-sm text-white/35 leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      {/* CHANGE: Stack footer items on very small screens */}
      <footer className="relative z-10 border-t border-white/[0.05] px-5 sm:px-10 py-4 sm:py-5 flex flex-col sm:flex-row items-center gap-1 sm:justify-between">
        <span className="text-xs text-white/20">© 2025 Crazly</span>
        <span className="text-xs text-white/20">Stop experimenting. Start executing.</span>
      </footer>
    </main>
  );
}