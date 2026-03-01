"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { workflows } from "@/lib/workflows";
import Link from "next/link";

type Role = "developer" | "contentCreator" | "marketing" | "student" | "startupFounder";

const roles: { key: Role; label: string; icon: string; description: string }[] = [
  { key: "developer",      label: "Developer", icon: "⌥", description: "Build & ship faster" },
  { key: "contentCreator", label: "Creator",   icon: "◈", description: "Grow your audience" },
  { key: "marketing",      label: "Marketing", icon: "◎", description: "Scale campaigns" },
  { key: "student",        label: "Student",   icon: "◇", description: "Learn smarter" },
  { key: "startupFounder", label: "Founder",   icon: "⬡", description: "Execute your vision" },
];

/* ─── LOGO ────────────────────────────────────────────────────── */
function Logo() {
  return (
    <video src="/videos/logo.mp4" autoPlay loop muted playsInline
      className="w-8 h-8 rounded-xl object-cover" />
  );
}

/* ─── TYPING DOTS ─────────────────────────────────────────────── */
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#a0a0ff] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }} />
      ))}
    </span>
  );
}

/* ─── TOOL BADGE ──────────────────────────────────────────────── */
function ToolBadge({ tool }: { tool: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70 hover:border-[#6366f1]/50 hover:text-white/90 transition-all duration-200 cursor-default">
      <span className="w-1 h-1 rounded-full bg-[#6366f1]" />
      {tool}
    </span>
  );
}

/* ─── EMAIL MODAL ─────────────────────────────────────────────── */
function EmailModal({ onClose, source }: { onClose: () => void; source: "workflow" | "upgrade" }) {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = () => {
    if (!email.includes("@")) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}>
      <div className="relative w-full max-w-md rounded-2xl p-6 sm:p-8"
        style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">✕</button>
        {!submitted ? (
          <>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
              style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
              <span className="text-lg">✉️</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {source === "upgrade" ? "Get early access to Pro" : "Save your workflow"}
            </h3>
            <p className="text-sm text-white/40 mb-6 leading-relaxed">
              {source === "upgrade"
                ? "Enter your email and we'll notify you when Pro launches with exact prompts, scripts & templates."
                : "Drop your email and we'll send this workflow + premium prompts to your inbox."}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                className="flex-1 px-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-[#6366f1]/50 placeholder:text-white/25" />
              <button onClick={handleSubmit} disabled={loading || !email.includes("@")}
                className="px-5 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
                {loading ? "..." : "Notify me"}
              </button>
            </div>
            <p className="text-[10px] text-white/20 mt-3 text-center">No spam. Unsubscribe anytime.</p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-bold text-white mb-2">You're on the list!</h3>
            <p className="text-sm text-white/40 mb-6">We'll reach out as soon as Pro is ready.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
              Back to Crazly
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function WorkflowsPage() {
  const { isSignedIn, user } = useUser();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [input, setInput]               = useState("");
  const [submittedInput, setSubmittedInput] = useState(""); // what was actually sent
  const [showResult, setShowResult]     = useState(false);
  const [isTyping, setIsTyping]         = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [animateIn, setAnimateIn]       = useState(false);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [promptCount, setPromptCount]   = useState(0); // how many prompts sent THIS session
  const [showEmail, setShowEmail]       = useState(false);
  const [emailSource, setEmailSource]   = useState<"workflow" | "upgrade">("workflow");
  const [emailShown, setEmailShown]     = useState(false);

  const inputRef  = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setAnimateIn(true); }, []);

  // Stream steps
  useEffect(() => {
    if (showResult && selectedRole) {
      const total = workflows[selectedRole].steps.length;
      setVisibleSteps(0);
      let count = 0;
      const iv = setInterval(() => {
        count++;
        setVisibleSteps(count);
        if (count >= total) {
          clearInterval(iv);
          if (!isSignedIn && !emailShown) {
            setTimeout(() => {
              setEmailShown(true);
              setEmailSource("workflow");
              setShowEmail(true);
            }, 900);
          }
        }
      }, 280);
      return () => clearInterval(iv);
    }
  }, [showResult, selectedRole, isSignedIn, emailShown]);

  useEffect(() => {
    if (showResult) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
    }
  }, [showResult, visibleSteps]);

  const fireWorkflow = (text: string) => {
    setSubmittedInput(text); // save what was typed so it shows in the bubble
    setInput("");             // clear input box
    setShowResult(false);
    setIsTyping(true);
    setPromptCount(c => c + 1);
    setTimeout(() => { setIsTyping(false); setShowResult(true); }, 1800);
  };

  const handleGenerate = () => {
    if (!input.trim() || !selectedRole || isTyping) return;
    // Non-signed-in users only get 1 prompt — redirect to sign in for more
    if (promptCount >= 1 && !isSignedIn) {
      window.location.href = "/sign-in";
      return;
    }
    fireWorkflow(input);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setShowResult(false);
    setIsTyping(false);
    setInput("");
    setSubmittedInput("");
    setPromptCount(0);
    setDrawerOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Input bar is locked (hidden gated) after 1st prompt for non-signed-in users
  const inputLocked = promptCount >= 1 && !isSignedIn;
  // Hide input completely once result shown and user is not signed in
  const hideInput = showResult && !isSignedIn;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {showEmail && !isSignedIn && (
        <EmailModal onClose={() => setShowEmail(false)} source={emailSource} />
      )}

      {/* BG */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06]"
        style={{ opacity: animateIn ? 1 : 0, transform: animateIn ? "none" : "translateY(-8px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-sm font-semibold tracking-tight text-white/90">Crazly</span>
          </Link>
          <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/20 font-medium">Workflow AI</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {selectedRole ? (
            <button className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/60"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}
              onClick={() => setDrawerOpen(true)}>
              <span style={{ fontFamily: "monospace" }}>{roles.find(r => r.key === selectedRole)?.icon}</span>
              {roles.find(r => r.key === selectedRole)?.label}
              <svg className="w-3 h-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          ) : (
            <button className="lg:hidden px-3 py-1.5 rounded-xl text-xs font-medium text-white/50"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={() => setDrawerOpen(true)}>Pick role ↓</button>
          )}

          <Link href="/pricing"
            className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
            Pricing
          </Link>

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <button className="text-xs px-3 py-1.5 rounded-xl font-medium text-white/60 hover:text-white/90 transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                Sign in
              </button>
            </SignInButton>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/40">AI Online</span>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-30 bg-black/60" style={{ backdropFilter: "blur(4px)" }}
            onClick={() => setDrawerOpen(false)} />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 rounded-t-2xl pb-8 pt-5 px-5"
            style={{ background: "rgba(12,12,12,0.98)", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none" }}>
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">Select your role</p>
            <div className="flex flex-col gap-2">
              {roles.map(role => {
                const active = selectedRole === role.key;
                return (
                  <button key={role.key} onClick={() => handleRoleSelect(role.key)}
                    className="flex items-center gap-4 w-full text-left px-4 py-3.5 rounded-2xl transition-all"
                    style={{ background: active ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)", border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-lg" style={{ fontFamily: "monospace", color: active ? "#a5b4fc" : "rgba(255,255,255,0.3)" }}>{role.icon}</span>
                    <div>
                      <p className={`text-sm font-semibold ${active ? "text-white" : "text-white/70"}`}>{role.label}</p>
                      <p className="text-xs text-white/30">{role.description}</p>
                    </div>
                    {active && <div className="ml-auto w-2 h-2 rounded-full bg-[#6366f1]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── LAYOUT ───────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col lg:flex-row flex-1 max-w-7xl mx-auto w-full">

        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col p-6 border-r border-white/[0.06]"
          style={{ opacity: animateIn ? 1 : 0, transform: animateIn ? "none" : "translateX(-12px)", transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s" }}>
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-4">Select your role</p>
          <div className="flex flex-col gap-2">
            {roles.map(role => {
              const active = selectedRole === role.key;
              return (
                <button key={role.key} onClick={() => handleRoleSelect(role.key)}
                  className="group relative flex items-center gap-3 w-full text-left px-3.5 py-3 rounded-xl transition-all duration-200"
                  style={{ background: active ? "rgba(99,102,241,0.12)" : "transparent", border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid transparent" }}>
                  {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#6366f1]" />}
                  <span className="text-base text-white/40 group-hover:text-white/60 transition-colors" style={{ fontFamily: "monospace" }}>{role.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium leading-tight ${active ? "text-white" : "text-white/60 group-hover:text-white/80"} transition-colors`}>{role.label}</p>
                    <p className="text-[11px] text-white/30 truncate">{role.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-8 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <p className="text-xs font-semibold text-white/70 mb-1">Go Pro</p>
            <p className="text-[11px] text-white/35 mb-3 leading-relaxed">Unlock exact prompts, scripts & templates for every workflow.</p>
            <Link href="/pricing" className="block text-center py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>See plans →</Link>
          </div>
        </aside>

        {/* Chat */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">

            {/* Empty state */}
            {!selectedRole && (
              <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center px-4"
                style={{ opacity: animateIn ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(129,140,248,0.1))", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <span className="text-xl sm:text-2xl">⚡</span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white/80 mb-2">Ready to execute.</h2>
                <p className="text-sm text-white/35 max-w-xs leading-relaxed hidden lg:block">Pick your role on the left, then describe the problem you're solving.</p>
                <p className="text-sm text-white/35 max-w-xs leading-relaxed lg:hidden">Tap "Pick role" above to get started.</p>
                <button className="lg:hidden mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
                  onClick={() => setDrawerOpen(true)}>Pick your role →</button>
              </div>
            )}

            {/* AI greeting */}
            {selectedRole && !showResult && !isTyping && (
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>AI</div>
                <div className="flex-1">
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl rounded-tl-sm text-sm text-white/75 leading-relaxed"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {isSignedIn && user?.firstName ? (
                      <>Hey <span className="text-[#818cf8] font-medium">{user.firstName}</span>! You're a <span className="text-[#818cf8] font-medium">{roles.find(r => r.key === selectedRole)?.label}</span> — tell me exactly what you're stuck on and I'll build your workflow.</>
                    ) : (
                      <>Hey! You're a <span className="text-[#818cf8] font-medium">{roles.find(r => r.key === selectedRole)?.label}</span> — tell me what you're stuck on. I'll generate your exact AI workflow and toolset.</>
                    )}
                  </div>
                  <p className="text-[10px] text-white/20 mt-1.5 ml-1">Crazly AI · now</p>
                </div>
              </div>
            )}

            {/* User message bubble — uses submittedInput not input */}
            {(isTyping || showResult) && submittedInput && (
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl ml-auto flex-row-reverse">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold bg-white/10 text-white/60">You</div>
                <div className="flex-1 flex flex-col items-end">
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl rounded-tr-sm text-sm text-white/85 leading-relaxed max-w-[85%] sm:max-w-sm"
                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
                    {submittedInput}
                  </div>
                  <p className="text-[10px] text-white/20 mt-1.5 mr-1">You · now</p>
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>AI</div>
                <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl rounded-tl-sm"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <TypingDots />
                </div>
              </div>
            )}

            {/* Workflow result */}
            {showResult && selectedRole && (
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>AI</div>
                <div className="flex-1 min-w-0">

                  {/* Title */}
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl rounded-tl-sm mb-2.5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[10px] uppercase tracking-widest text-[#6366f1] font-semibold mb-1">Workflow generated</p>
                    <p className="text-sm font-semibold text-white/90">{workflows[selectedRole].title}</p>
                  </div>

                  {/* Tools */}
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl mb-2.5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-2.5">Recommended Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {workflows[selectedRole].tools.map((tool, i) => <ToolBadge key={i} tool={tool} />)}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl mb-2.5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">Execution Steps</p>
                    <div className="space-y-3">
                      {workflows[selectedRole].steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2.5 sm:gap-3 transition-all duration-300"
                          style={{ opacity: i < visibleSteps ? 1 : 0, transform: i < visibleSteps ? "none" : "translateY(6px)" }}>
                          <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                            style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}>{i + 1}</div>
                          <p className="text-xs sm:text-sm text-white/65 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Premium lock */}
                  <div className="rounded-2xl overflow-hidden"
                    style={{ opacity: visibleSteps >= workflows[selectedRole].steps.length ? 1 : 0, transition: "opacity 0.4s ease 0.3s", background: "linear-gradient(135deg, rgba(251,191,36,0.06), rgba(245,158,11,0.04))", border: "1px solid rgba(251,191,36,0.2)" }}>
                    <div className="px-3.5 sm:px-4 py-3.5 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0"
                          style={{ background: "rgba(251,191,36,0.1)" }}>🔒</div>
                        <div>
                          <p className="text-sm font-semibold text-amber-300">Unlock Premium Prompts</p>
                          <p className="text-[11px] text-white/35">Exact AI prompts, scripts & pro templates</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {isSignedIn ? (
                          <Link href="/pricing"
                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-amber-900 hover:opacity-90 active:scale-95 transition-all text-center"
                            style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
                            Upgrade to Pro
                          </Link>
                        ) : (
                          <button onClick={() => { setEmailSource("upgrade"); setShowEmail(true); }}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-amber-900 hover:opacity-90 active:scale-95 transition-all"
                            style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)" }}>
                            Get early access
                          </button>
                        )}
                        <Link href="/pricing"
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white/90 text-center transition-all"
                          style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                          See plans
                        </Link>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-white/20 mt-2 ml-1">Crazly AI · now</p>
                </div>
              </div>
            )}

            {/* ── SIGN IN WALL — shown AFTER result for non-signed-in users ── */}
            {hideInput && (
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>AI</div>
                <div className="flex-1">
                  <div className="px-4 py-4 rounded-2xl rounded-tl-sm"
                    style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)" }}>
                    <p className="text-sm font-semibold text-white/80 mb-1">Want to go deeper?</p>
                    <p className="text-xs text-white/40 mb-4 leading-relaxed">
                      Create a free account to ask follow-up questions, try other roles, and get unlimited workflows.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <SignInButton mode="redirect">
                        <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                          style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
                          Sign up free — it takes 30 seconds
                        </button>
                      </SignInButton>
                      <button onClick={() => handleRoleSelect(selectedRole!)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 transition-all"
                        style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                        Try another role
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── INPUT BAR — hidden for non-signed-in users after result shown ── */}
          {selectedRole && !hideInput && (
            <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-white/[0.06]"
              style={{ background: "rgba(8,8,8,0.8)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <input ref={inputRef}
                  placeholder={`Describe your ${roles.find(r => r.key === selectedRole)?.label.toLowerCase()} problem...`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleGenerate()}
                  disabled={isTyping}
                  className="flex-1 bg-transparent text-base sm:text-sm text-white/80 placeholder:text-white/25 outline-none disabled:opacity-50" />
                <button onClick={handleGenerate} disabled={!input.trim() || isTyping}
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30 active:scale-90"
                  style={{ background: input.trim() && !isTyping ? "linear-gradient(135deg, #6366f1, #818cf8)" : "rgba(255,255,255,0.08)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-white/20 text-center mt-2">
                Press Enter to generate · Crazly simulates AI workflows
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}