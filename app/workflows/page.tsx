"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

type Role = "developer" | "contentCreator" | "marketing" | "student" | "startupFounder";
type Message = { role: "user" | "assistant"; content: string; };
type ParsedStep = { action: string; tool: string; toolUrl: string; prompt: string; };
type ParsedWorkflow = { title: string; tools: string[]; steps: ParsedStep[]; };

const FREE_LIMIT = 3; // <-- SINGLE SOURCE OF TRUTH, outside component

const TOOL_URLS: Record<string, string> = {
  "claude": "https://claude.ai",
  "chatgpt": "https://chat.openai.com",
  "gemini": "https://gemini.google.com",
  "perplexity": "https://perplexity.ai",
  "perplexity ai": "https://perplexity.ai",
  "notebooklm": "https://notebooklm.google.com",
  "v0": "https://v0.dev",
  "v0 by vercel": "https://v0.dev",
  "github copilot": "https://github.com/features/copilot",
  "notion ai": "https://notion.so",
  "notion": "https://notion.so",
  "grammarly": "https://grammarly.com",
  "hemingway": "https://hemingwayapp.com",
  "hemingway editor": "https://hemingwayapp.com",
  "midjourney": "https://midjourney.com",
  "canva": "https://canva.com",
  "canva ai": "https://canva.com",
  "figma": "https://figma.com",
  "linear": "https://linear.app",
  "supabase": "https://supabase.com",
  "vercel": "https://vercel.com",
  "typeform": "https://typeform.com",
  "loom": "https://loom.com",
  "descript": "https://descript.com",
  "opus clip": "https://opus.pro",
  "opus": "https://opus.pro",
  "buffer": "https://buffer.com",
  "metricool": "https://metricool.com",
  "apollo": "https://apollo.io",
  "apollo.io": "https://apollo.io",
  "lemlist": "https://lemlist.com",
  "anki": "https://ankiweb.net",
  "quizlet": "https://quizlet.com",
  "consensus": "https://consensus.app",
  "elicit": "https://elicit.org",
  "zotero": "https://zotero.org",
  "wolfram alpha": "https://wolframalpha.com",
  "desmos": "https://desmos.com",
  "semrush": "https://semrush.com",
  "vidiq": "https://vidiq.com",
  "sparktoro": "https://sparktoro.com",
  "hotjar": "https://hotjar.com",
  "looker studio": "https://lookerstudio.google.com",
  "klaviyo": "https://klaviyo.com",
  "postman": "https://postman.com",
  "sentry": "https://sentry.io",
  "sonarqube": "https://sonarqube.org",
  "beautiful.ai": "https://beautiful.ai",
  "tome": "https://tome.app",
  "docsend": "https://docsend.com",
  "contra": "https://contra.com",
  "adcreative.ai": "https://adcreative.ai",
  "make": "https://make.com",
  "zapier": "https://zapier.com",
  "n8n": "https://n8n.io",
};

function getToolUrl(toolName: string): string {
  const key = toolName.toLowerCase().trim();
  return TOOL_URLS[key] ?? `https://www.google.com/search?q=${encodeURIComponent(toolName + " AI tool")}`;
}

function parseWorkflow(text: string): ParsedWorkflow | null {
  if (!text.includes("WORKFLOW_TITLE:")) return null;
  const titleMatch = text.match(/WORKFLOW_TITLE:\s*(.+)/);
  const toolsMatch = text.match(/TOOLS:\s*(.+)/);
  const title = titleMatch?.[1]?.trim() ?? "Your Workflow";
  const toolsRaw = toolsMatch?.[1]?.trim() ?? "";
  const tools = toolsRaw.split(",").map(t => t.trim()).filter(Boolean);
  const steps: ParsedStep[] = [];
  const stepRegex = /STEP_\d+:\s*\nACTION:\s*(.+?)\nTOOL:\s*(.+?)\nPROMPT:\s*([\s\S]+?)(?=\nSTEP_\d+:|$)/g;
  let match;
  while ((match = stepRegex.exec(text)) !== null) {
    const toolName = match[2].trim();
    steps.push({ action: match[1].trim(), tool: toolName, toolUrl: getToolUrl(toolName), prompt: match[3].trim() });
  }
  return { title, tools, steps };
}

const roles: { key: Role; label: string; icon: string; description: string }[] = [
  { key: "developer",      label: "Developer", icon: "⌥", description: "Build & ship faster"  },
  { key: "contentCreator", label: "Creator",   icon: "◈", description: "Grow your audience"   },
  { key: "marketing",      label: "Marketing", icon: "◎", description: "Scale campaigns"       },
  { key: "student",        label: "Student",   icon: "◇", description: "Learn smarter"         },
  { key: "startupFounder", label: "Founder",   icon: "⬡", description: "Execute your vision"  },
];

function Logo() {
  const [err, setErr] = useState(false);
  if (err) return <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>C</div>;
  return <video src="/videos/logo.mp4" autoPlay loop muted playsInline onError={() => setErr(true)} className="w-8 h-8 rounded-xl object-cover shrink-0" />;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#a0a0ff] animate-bounce" style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }} />)}
    </span>
  );
}

function ToolBadge({ tool }: { tool: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70">
      <span className="w-1 h-1 rounded-full bg-[#6366f1]" />{tool}
    </span>
  );
}

export default function WorkflowsPage() {
  const { isSignedIn, user } = useUser();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Use a REF for the counter so it's never stale inside async functions
  const usageCountRef = useRef(0);
  const [usageDisplay, setUsageDisplay] = useState(0); // only for UI rendering

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setAnimateIn(true); }, []);
  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 80);
  }, [messages, streamingText]);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setMessages([]);
    setStreamingText("");
    setInput("");
    usageCountRef.current = 0;
    setUsageDisplay(0);
    setShowPaywall(false);
    setDrawerOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedRole || isStreaming) return;

    // Check limit using the REF — never stale
    if (usageCountRef.current >= FREE_LIMIT) {
      setShowPaywall(true);
      return;
    }

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);
    setStreamingText("");

    // Increment the ref immediately — synchronous, no stale closure issues
    usageCountRef.current = usageCountRef.current + 1;
    setUsageDisplay(usageCountRef.current); // sync UI

    console.log(`[Crazly] Message sent. Count: ${usageCountRef.current} / ${FREE_LIMIT}`);

    try {
      const res = await fetch("/api/generate-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try { const { text } = JSON.parse(data); full += text; setStreamingText(full); } catch {}
        }
      }

      setMessages(prev => [...prev, { role: "assistant", content: full }]);
      setStreamingText("");

      // Show paywall AFTER the 3rd response finishes — using ref value (never stale)
      console.log(`[Crazly] Response done. Count now: ${usageCountRef.current}`);
      if (usageCountRef.current >= FREE_LIMIT) {
        setTimeout(() => setShowPaywall(true), 1800);
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong — please try again." }]);
      setStreamingText("");
    } finally {
      setIsStreaming(false);
    }
  };

  const renderAssistantMessage = (content: string, isLive = false, msgIndex = 0) => {
    const parsed = parseWorkflow(content);
    const remaining = Math.max(FREE_LIMIT - usageDisplay, 0);

    if (parsed && parsed.steps.length > 0) {
      return (
        <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>AI</div>
          <div className="flex-1 min-w-0 space-y-2.5">
            {/* Title */}
            <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-[10px] uppercase tracking-widest text-[#6366f1] font-semibold mb-1">Workflow generated</p>
              <p className="text-sm font-bold text-white/90">{parsed.title}</p>
              {isLive && <p className="text-xs text-[#6366f1]/60 mt-1 animate-pulse">Building your workflow…</p>}
            </div>
            {/* Tools */}
            {parsed.tools.length > 0 && (
              <div className="px-4 py-3.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-2.5">Tools in this workflow</p>
                <div className="flex flex-wrap gap-2">{parsed.tools.map((t, i) => <ToolBadge key={i} tool={t} />)}</div>
              </div>
            )}
            {/* Steps */}
            {parsed.steps.length > 0 && (
              <div className="px-4 py-3.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">How the workflow runs</p>
                <div className="space-y-3">
                  {parsed.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}>{i + 1}</div>
                      <div>
                        <p className="text-xs font-semibold text-white/75 mb-0.5">{step.action}</p>
                        <a href={step.toolUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#6366f1] hover:text-[#818cf8] transition-colors flex items-center gap-1">
                          Open {step.tool} ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Prompt cards */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="px-4 pt-3.5 pb-1">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-0.5">Exact prompts — click tool to open, then paste</p>
                <p className="text-[11px] text-white/30 mb-3">Click the tool name to open it, copy the prompt, paste it in.</p>
              </div>
              <div className="px-4 pb-4 space-y-3">
                {parsed.steps.map((step, i) => {
                  const copyKey = `${msgIndex}-${i}`;
                  return (
                    <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.05)" }}>
                      <div className="flex items-center justify-between px-3 py-2" style={{ background: "rgba(99,102,241,0.1)", borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)", color: "white" }}>{i + 1}</div>
                          <a href={step.toolUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-[#818cf8] hover:text-white transition-colors px-2 py-0.5 rounded-md"
                            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                            {step.tool}
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                          <span className="text-[10px] text-white/30">← click to open</span>
                        </div>
                        <button onClick={() => handleCopy(step.prompt, copyKey)}
                          className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-lg transition-all"
                          style={{
                            background: copiedIndex === copyKey ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.06)",
                            color: copiedIndex === copyKey ? "#34d399" : "rgba(255,255,255,0.5)",
                            border: copiedIndex === copyKey ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(255,255,255,0.1)",
                          }}>
                          {copiedIndex === copyKey
                            ? <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>Copied!</>
                            : <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy prompt</>
                          }
                        </button>
                      </div>
                      <div className="px-3 py-2 flex items-start gap-2" style={{ borderBottom: "1px solid rgba(99,102,241,0.1)", background: "rgba(255,255,255,0.02)" }}>
                        <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        <p className="text-[11px] text-white/50 leading-relaxed">{step.action}</p>
                      </div>
                      <div className="px-3 py-2.5">
                        <pre className="text-[11px] text-white/65 leading-relaxed whitespace-pre-wrap font-mono">{step.prompt}</pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-[10px] text-white/20 ml-1">
              Crazly AI · {remaining} free message{remaining === 1 ? "" : "s"} remaining
            </p>
          </div>
        </div>
      );
    }

    // Plain conversational reply
    return (
      <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>AI</div>
        <div className="flex-1">
          <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm text-sm text-white/75 leading-relaxed" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {content}{isLive && <span className="inline-block w-1 h-3.5 bg-[#6366f1] ml-0.5 animate-pulse rounded-sm" />}
          </div>
          <p className="text-[10px] text-white/20 mt-1.5 ml-1">Crazly AI · just now</p>
        </div>
      </div>
    );
  };

  const PaywallBanner = () => (
    <div className="mx-4 sm:mx-8 my-4 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(129,140,248,0.08))", border: "1px solid rgba(99,102,241,0.4)" }}>
      <div className="p-6 text-center">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <p className="text-base font-bold text-white mb-1">You've used your 3 free workflows 🎉</p>
        <p className="text-sm text-white/50 mb-5 max-w-sm mx-auto leading-relaxed">
          Hope they were useful! Upgrade to Pro for unlimited workflows, full conversation memory, and priority AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/pricing" className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)", boxShadow: "0 4px 24px rgba(99,102,241,0.45)" }}>
            Upgrade to Pro →
          </Link>
          {!isSignedIn && (
            <SignInButton mode="modal">
              <button className="px-6 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
                Already Pro? Sign in
              </button>
            </SignInButton>
          )}
        </div>
        <p className="text-[11px] text-white/25 mt-4">Plans from ₹299/mo · Cancel anytime</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col" style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle,#6366f1,transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle,#818cf8,transparent 70%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.015) 1px,transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      {/* HEADER */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06]"
        style={{ opacity: animateIn ? 1 : 0, transform: animateIn ? "none" : "translateY(-8px)", transition: "opacity 0.5s ease,transform 0.5s ease" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5"><Logo /><span className="text-sm font-semibold tracking-tight text-white/90">Crazly</span></Link>
          <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/20 font-medium">Workflow AI</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {selectedRole
            ? <button className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/60" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }} onClick={() => setDrawerOpen(true)}>
              <span style={{ fontFamily: "monospace" }}>{roles.find(r => r.key === selectedRole)?.icon}</span>
              {roles.find(r => r.key === selectedRole)?.label}
              <svg className="w-3 h-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            : <button className="lg:hidden px-3 py-1.5 rounded-xl text-xs font-medium text-white/50" style={{ border: "1px solid rgba(255,255,255,0.1)" }} onClick={() => setDrawerOpen(true)}>Pick role ↓</button>
          }
          <Link href="/pricing" className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>Pricing</Link>
          {isSignedIn ? <UserButton afterSignOutUrl="/" /> : <SignInButton mode="modal"><button className="text-xs px-3 py-1.5 rounded-xl font-medium text-white/60 hover:text-white/90 transition-all" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Sign in</button></SignInButton>}
          <div className="hidden sm:flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-xs text-white/40">AI Online</span></div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {drawerOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-30 bg-black/60" style={{ backdropFilter: "blur(4px)" }} onClick={() => setDrawerOpen(false)} />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 rounded-t-2xl pb-8 pt-5 px-5" style={{ background: "rgba(12,12,12,0.98)", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none" }}>
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">Select your role</p>
            <div className="flex flex-col gap-2">
              {roles.map(role => {
                const active = selectedRole === role.key;
                return (
                  <button key={role.key} onClick={() => handleRoleSelect(role.key)} className="flex items-center gap-4 w-full text-left px-4 py-3.5 rounded-2xl transition-all" style={{ background: active ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)", border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-lg" style={{ fontFamily: "monospace", color: active ? "#a5b4fc" : "rgba(255,255,255,0.3)" }}>{role.icon}</span>
                    <div><p className={`text-sm font-semibold ${active ? "text-white" : "text-white/70"}`}>{role.label}</p><p className="text-xs text-white/30">{role.description}</p></div>
                    {active && <div className="ml-auto w-2 h-2 rounded-full bg-[#6366f1]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* LAYOUT */}
      <div className="relative z-10 flex flex-col lg:flex-row flex-1 max-w-7xl mx-auto w-full">

        {/* SIDEBAR */}
        <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col p-6 border-r border-white/[0.06]"
          style={{ opacity: animateIn ? 1 : 0, transform: animateIn ? "none" : "translateX(-12px)", transition: "opacity 0.5s ease 0.1s,transform 0.5s ease 0.1s" }}>
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-4">Select your role</p>
          <div className="flex flex-col gap-2">
            {roles.map(role => {
              const active = selectedRole === role.key;
              return (
                <button key={role.key} onClick={() => handleRoleSelect(role.key)} className="group relative flex items-center gap-3 w-full text-left px-3.5 py-3 rounded-xl transition-all duration-200" style={{ background: active ? "rgba(99,102,241,0.12)" : "transparent", border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid transparent" }}>
                  {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#6366f1]" />}
                  <span className="text-base text-white/40 group-hover:text-white/60 transition-colors" style={{ fontFamily: "monospace" }}>{role.icon}</span>
                  <div className="min-w-0"><p className={`text-sm font-medium leading-tight ${active ? "text-white" : "text-white/60 group-hover:text-white/80"} transition-colors`}>{role.label}</p><p className="text-[11px] text-white/30 truncate">{role.description}</p></div>
                </button>
              );
            })}
          </div>

          {/* Usage counter */}
          {selectedRole && (
            <div className="mt-6 p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-white/40 font-medium">Free messages</p>
                <p className="text-[11px] font-bold" style={{ color: usageDisplay >= FREE_LIMIT ? "#f87171" : "#818cf8" }}>{usageDisplay}/{FREE_LIMIT}</p>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((usageDisplay / FREE_LIMIT) * 100, 100)}%`, background: usageDisplay >= FREE_LIMIT ? "linear-gradient(90deg,#f87171,#ef4444)" : "linear-gradient(90deg,#6366f1,#818cf8)" }} />
              </div>
              {usageDisplay >= FREE_LIMIT
                ? <Link href="/pricing" className="block text-center mt-2.5 py-1.5 rounded-lg text-[11px] font-semibold hover:opacity-90" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)", color: "white" }}>Upgrade to Pro →</Link>
                : <p className="text-[10px] text-white/25 mt-1.5">{FREE_LIMIT - usageDisplay} remaining · then upgrade</p>
              }
            </div>
          )}

          <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <p className="text-xs font-semibold text-white/70 mb-1">Go Pro</p>
            <p className="text-[11px] text-white/35 mb-3 leading-relaxed">Unlimited workflows, full memory, priority AI.</p>
            <Link href="/pricing" className="block text-center py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-all" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>See plans →</Link>
          </div>
        </aside>

        {/* CHAT */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">

            {/* Empty state */}
            {!selectedRole && (
              <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center px-4" style={{ opacity: animateIn ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(129,140,248,0.1))", border: "1px solid rgba(99,102,241,0.2)" }}><span className="text-2xl">⚡</span></div>
                <h2 className="text-xl font-semibold text-white/80 mb-2">Ready to execute.</h2>
                <p className="text-sm text-white/35 max-w-xs leading-relaxed hidden lg:block">Pick your role, describe your problem, get a real AI-generated workflow with exact prompts and tool links.</p>
                <p className="text-sm text-white/35 max-w-xs leading-relaxed lg:hidden">Tap "Pick role" above to get started.</p>
                <button className="lg:hidden mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }} onClick={() => setDrawerOpen(true)}>Pick your role →</button>
              </div>
            )}

            {/* Greeting */}
            {selectedRole && messages.length === 0 && !isStreaming && (
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>AI</div>
                <div className="flex-1">
                  <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm text-sm text-white/75 leading-relaxed" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {isSignedIn && user?.firstName
                      ? <>Hey <span className="text-[#818cf8] font-medium">{user.firstName}</span>! You selected <span className="text-[#818cf8] font-medium">{roles.find(r => r.key === selectedRole)?.label}</span>. Describe your exact problem — I'll build a personalised workflow with tool links and ready-to-paste prompts.</>
                      : <>Hey! You selected <span className="text-[#818cf8] font-medium">{roles.find(r => r.key === selectedRole)?.label}</span>. Describe your problem and I'll generate a step-by-step workflow with tool links and ready-to-paste prompts. <span className="text-white/40">You have 3 free messages.</span></>
                    }
                  </div>
                  <p className="text-[10px] text-white/20 mt-1.5 ml-1">Crazly AI · now</p>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.role === "user"
                  ? <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl ml-auto flex-row-reverse">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold bg-white/10 text-white/60">You</div>
                    <div className="flex-1 flex flex-col items-end">
                      <div className="px-4 py-3.5 rounded-2xl rounded-tr-sm text-sm text-white/85 leading-relaxed max-w-sm" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>{msg.content}</div>
                      <p className="text-[10px] text-white/20 mt-1.5 mr-1">You · just now</p>
                    </div>
                  </div>
                  : renderAssistantMessage(msg.content, false, idx)
                }
              </div>
            ))}

            {/* Live streaming */}
            {isStreaming && (
              streamingText
                ? renderAssistantMessage(streamingText, true, messages.length)
                : <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>AI</div>
                  <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}><TypingDots /></div>
                </div>
            )}

            {/* Paywall */}
            {showPaywall && <PaywallBanner />}
            <div ref={bottomRef} />
          </div>

          {/* INPUT BAR */}
          {selectedRole && !showPaywall && (
            <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-white/[0.06]" style={{ background: "rgba(8,8,8,0.9)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl transition-all" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <input ref={inputRef}
                  placeholder={messages.length > 0 ? "Ask a follow-up or describe another problem…" : `Describe your ${roles.find(r => r.key === selectedRole)?.label.toLowerCase()} problem in detail…`}
                  value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} disabled={isStreaming}
                  className="flex-1 bg-transparent text-base sm:text-sm text-white/80 placeholder:text-white/25 outline-none disabled:opacity-50" />
                <button onClick={handleSend} disabled={!input.trim() || isStreaming}
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30 active:scale-90"
                  style={{ background: input.trim() && !isStreaming ? "linear-gradient(135deg,#6366f1,#818cf8)" : "rgba(255,255,255,0.08)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                </button>
              </div>
              <p className="text-[10px] text-white/20 text-center mt-2">
                {usageDisplay < FREE_LIMIT
                  ? `${FREE_LIMIT - usageDisplay} free message${FREE_LIMIT - usageDisplay === 1 ? "" : "s"} remaining · Real AI · Remembers your conversation`
                  : "Upgrade to continue"}
              </p>
            </div>
          )}

          {/* Paywall input replacement */}
          {selectedRole && showPaywall && (
            <div className="px-4 sm:px-8 py-4 border-t border-white/[0.06] flex items-center justify-center gap-3" style={{ background: "rgba(8,8,8,0.9)" }}>
              <Link href="/pricing" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>Upgrade to Pro →</Link>
              <button onClick={() => { setShowPaywall(false); usageCountRef.current = 0; setUsageDisplay(0); setMessages([]); }} className="text-xs text-white/30 hover:text-white/60 transition-colors">
                Start over (resets count)
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}