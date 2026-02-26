"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const sections = [
  {
    slug: "what-is-crazly",
    title: "What is Crazly?",
    content: `Crazly is an AI Workflow Intelligence Platform. Instead of teaching you AI theory, Crazly gives you exact tools, exact prompts, and step-by-step execution systems — matched to your specific role and problem.

You come with a real problem. Crazly gives you a real workflow to solve it. No fluff, no 30-minute YouTube videos, no experimenting. Just structured execution.`,
  },
  {
    slug: "how-to-use",
    title: "How to use Crazly",
    content: `Using Crazly is three steps:

1. Select your role — Developer, Content Creator, Marketing, Student, or Startup Founder. This tells Crazly what kind of work you do.

2. Describe your problem — Type what you're stuck on in plain English. Be specific. "I need to build a landing page fast" works better than "help with web."

3. Execute the workflow — Crazly returns a structured workflow with recommended tools and step-by-step execution. Follow it. Get results.`,
  },
  {
    slug: "free-vs-pro",
    title: "Free vs Pro",
    content: `Free plan includes:
- 1 workflow per session
- All 5 professional roles
- Tool recommendations
- Step-by-step execution plans

Pro plan ($9/month or ₹749/month) adds:
- Unlimited workflows
- Exact AI prompts per step (copy-paste ready)
- Scripts and templates
- Priority access to new roles and workflows
- Early access to new features`,
  },
  {
    slug: "workflows",
    title: "Available workflows",
    content: `Crazly currently supports 5 professional roles:

Developer — AI-powered development workflow using GitHub Copilot, Cursor, ChatGPT, Warp, and Codeium.

Content Creator — Content ideation, scripting, editing and publishing workflow using ChatGPT, Descript, Canva AI, ElevenLabs, and Jasper.

Marketing — Full campaign workflow using HubSpot AI, Surfer SEO, AdCreative.ai, and Zapier.

Student — Learning acceleration workflow using Notion AI, Anki, Wolfram Alpha, and Grammarly.

Startup Founder — Idea validation to launch workflow using ChatGPT, Notion AI, Copy.ai, Fireflies, and Mixpanel.

New workflows are added weekly.`,
  },
  {
    slug: "payments",
    title: "Payments & billing",
    content: `Payment integration is coming soon. We're integrating Razorpay to support:
- UPI (India)
- Credit and debit cards (worldwide)
- NetBanking (India)
- International cards

Indian users will be charged in INR (₹749/month). International users will be charged in USD ($9/month).

No contracts. Cancel anytime from your account settings.`,
  },
  {
    slug: "roadmap",
    title: "Product roadmap",
    content: `Phase 1 (Now) — Fake AI MVP. Pre-built workflows simulate intelligence. Validate demand.

Phase 2 — Smart recommendations. Real user accounts, NLP workflow matching, email capture.

Phase 3 — Real AI. LLM-powered workflow generation using GPT-4 / Claude API with streaming.

Phase 4 — Automation Marketplace. Users create, share, and sell their own workflows.

Phase 5 — Enterprise. Team accounts, SSO, custom AI fine-tuning, admin dashboards.`,
  },
];

export default function DocsPage() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState("what-is-crazly");

  useEffect(() => { setMounted(true); }, []);

  const current = sections.find(s => s.slug === active)!;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* BG */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0)", backgroundSize: "36px 36px" }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-5 sm:px-10 py-4 border-b border-white/[0.06]"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease" }}>
        <Link href="/" className="flex items-center gap-2.5 group">
        <video
  src="/videos/logo.mp4"
  autoPlay
  loop
  muted
  playsInline
  className="w-8 h-8 rounded-lg object-cover"
/>
          <span className="font-semibold tracking-tight text-white/90">Crazly</span>
          <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/10">Docs</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/workflows"
            className="text-sm px-4 py-2 rounded-xl font-medium text-white/60 hover:text-white/90 transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            Try Crazly →
          </Link>
        </div>
      </nav>

      {/* Layout */}
      <div className="relative z-10 flex flex-col sm:flex-row flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 py-10 gap-8">

        {/* Sidebar */}
        <aside className="sm:w-56 shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-white/25 font-semibold mb-3 px-2">Contents</p>
          <nav className="flex flex-col gap-0.5">
            {sections.map(s => (
              <button key={s.slug} onClick={() => setActive(s.slug)}
                className="text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
                style={{
                  background: active === s.slug ? "rgba(99,102,241,0.1)" : "transparent",
                  color: active === s.slug ? "#a5b4fc" : "rgba(255,255,255,0.45)",
                  borderLeft: active === s.slug ? "2px solid #6366f1" : "2px solid transparent",
                  fontWeight: active === s.slug ? 600 : 400,
                }}>
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="mb-2">
            <p className="text-[10px] uppercase tracking-widest text-[#6366f1] font-semibold mb-2">Documentation</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">{current.title}</h1>
          </div>
          <div className="prose prose-invert max-w-none">
            {current.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm sm:text-base text-white/55 leading-relaxed mb-5 whitespace-pre-line">{para}</p>
            ))}
          </div>

          {/* Nav arrows */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/[0.06]">
            {sections.findIndex(s => s.slug === active) > 0 ? (
              <button onClick={() => setActive(sections[sections.findIndex(s => s.slug === active) - 1].slug)}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors">
                ← {sections[sections.findIndex(s => s.slug === active) - 1].title}
              </button>
            ) : <div />}
            {sections.findIndex(s => s.slug === active) < sections.length - 1 ? (
              <button onClick={() => setActive(sections[sections.findIndex(s => s.slug === active) + 1].slug)}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors">
                {sections[sections.findIndex(s => s.slug === active) + 1].title} →
              </button>
            ) : <div />}
          </div>
        </main>
      </div>
    </div>
  );
}