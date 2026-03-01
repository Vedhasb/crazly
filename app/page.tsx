"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

/* ─── INTERSECTION OBSERVER HOOK ─────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── ANIMATED COUNTER ────────────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const iv = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(iv); }
      else setVal(start);
    }, 16);
    return () => clearInterval(iv);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── LOGO ────────────────────────────────────────────────────── */
function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const [videoError, setVideoError] = useState(false);
  const dim = size === "lg" ? "w-14 h-14 rounded-2xl" : "w-8 h-8 rounded-xl";

  if (videoError) {
    return (
      <div className={`${dim} flex items-center justify-center font-bold text-white shrink-0`}
        style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", fontSize: size === "lg" ? "1.5rem" : "0.85rem" }}>
        C
      </div>
    );
  }

  return (
    <video
      src="/videos/logo.mp4"
      autoPlay loop muted playsInline
      onError={() => setVideoError(true)}
      className={`${dim} object-cover shrink-0`}
    />
  );
}

/* ─── FLOATING PARTICLES ──────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    w: (i * 7 % 3) + 1,
    left: (i * 13 + 7) % 100,
    top: (i * 17 + 3) % 100,
    color: i % 3 === 0 ? "#6366f1" : i % 3 === 1 ? "#818cf8" : "#a5b4fc",
    opacity: ((i * 11) % 4) * 0.1 + 0.1,
    dur: ((i * 7) % 8) + 6,
    delay: (i * 3) % 6,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full"
          style={{
            width: `${p.w}px`, height: `${p.w}px`,
            left: `${p.left}%`, top: `${p.top}%`,
            background: p.color, opacity: p.opacity,
            animation: `float ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }} />
      ))}
    </div>
  );
}

/* ─── STEP CARD ───────────────────────────────────────────────── */
function StepCard({ num, title, body, delay }: { num: string; title: string; body: string; delay: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref}
      className="relative flex flex-col gap-5 p-7 rounded-2xl group"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}>
          {num}
        </div>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.4), transparent)" }} />
      </div>
      <div>
        <h3 className="text-base font-bold text-white mb-2 leading-snug">{title}</h3>
        <p className="text-sm text-white/45 leading-relaxed">{body}</p>
      </div>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.06), transparent 70%)" }} />
    </div>
  );
}

/* ─── PAIN ITEM ───────────────────────────────────────────────── */
function PainItem({ text, delay }: { text: string; delay: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="flex items-start gap-4 py-5 border-b group cursor-default"
      style={{
        borderColor: "rgba(255,255,255,0.05)",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateX(-24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}>
      <div className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
        style={{ background: "rgba(251,113,133,0.12)", border: "1px solid rgba(251,113,133,0.25)" }}>
        <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
      </div>
      <p className="text-sm sm:text-base text-white/55 leading-relaxed group-hover:text-white/80 transition-colors duration-300">{text}</p>
    </div>
  );
}

/* ─── STAT CARD ───────────────────────────────────────────────── */
function StatCard({ label, to, suffix, sub, delay }: { label: string; to: number; suffix: string; sub: string; delay: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="flex flex-col items-center text-center p-8 rounded-2xl hover:scale-[1.02] transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}>
      <div className="text-4xl sm:text-5xl font-bold mb-2"
        style={{ background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.5))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        <Counter to={to} suffix={suffix} />
      </div>
      <p className="text-sm font-semibold text-white/70 mb-1">{label}</p>
      <p className="text-xs text-white/30">{sub}</p>
    </div>
  );
}

/* ─── PROOF CARD ──────────────────────────────────────────────── */
function ProofCard({ icon, title, body, delay }: { icon: string; title: string; body: string; delay: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="flex flex-col gap-4 p-6 rounded-2xl transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-sm font-bold text-white/85 mb-1.5">{title}</p>
        <p className="text-sm text-white/35 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

/* ─── HOW IT WORKS HEADER ─────────────────────────────────────── */
function HowItWorksHeader() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="text-center mb-16">
      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "#818cf8", opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(12px)", transition: "all 0.5s ease" }}>
        <span className="w-4 h-px bg-[#818cf8]" />The system<span className="w-4 h-px bg-[#818cf8]" />
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)", transition: "all 0.6s ease 0.1s" }}>
        How Crazly Works
      </h2>
      <p className="text-base text-white/35 max-w-lg mx-auto"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)", transition: "all 0.6s ease 0.2s" }}>
        Three steps. Zero fluff. Real output.
      </p>
    </div>
  );
}

/* ─── HOW IT WORKS TAGLINE ────────────────────────────────────── */
function HowItWorksTagline() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="text-center"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)", transition: "all 0.6s ease" }}>
      <p className="text-base sm:text-lg text-white/40 italic">
        "It's not magic. It's just the system you should have had from day one."
      </p>
    </div>
  );
}

/* ─── FINAL CTA ───────────────────────────────────────────────── */
function FinalCTA() {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="relative max-w-3xl mx-auto text-center"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
      <div className="flex items-center justify-center mb-8">
        <Logo size="lg" />
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
        Stop figuring it out.<br />
        <span className="shimmer-text">Start executing.</span>
      </h2>
      <p className="text-base text-white/40 max-w-md mx-auto mb-10 leading-relaxed">
        Your AI workflow is one click away. Free to start. No credit card. No setup. Just results.
      </p>
      {/* ✅ /workflow — NO S */}
      <Link href="/workflow"
        className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-base font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", boxShadow: "0 0 0 1px rgba(99,102,241,0.5), 0 12px 48px rgba(99,102,241,0.4)" }}>
        Get My AI Workflow — Free
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const howItWorksRef = useRef<HTMLElement>(null);
  const painInView = useInView();
  const proofInView = useInView();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="bg-[#060608] text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        @keyframes float      { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-12px)} }
        @keyframes shimmer    { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes spin-slow  { from{transform:rotate(0deg)}        to{transform:rotate(360deg)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6}  100%{transform:scale(1.8);opacity:0} }
        @keyframes slide-up   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marquee    { from{transform:translateX(0)}        to{transform:translateX(-50%)} }
        .shimmer-text {
          background: linear-gradient(90deg, #6366f1 0%, #a5b4fc 30%, #fff 50%, #a5b4fc 70%, #6366f1 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .marquee-track { animation: marquee 22s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      {/* ═══ NAV ════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrollY > 40 ? "rgba(6,6,8,0.92)" : "transparent",
          backdropFilter: scrollY > 40 ? "blur(20px)" : "none",
          borderBottom: scrollY > 40 ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-3">

          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo size="sm" />
            <span className="font-bold tracking-tight text-white text-base">Crazly</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {/* ✅ ALL /workflow — NO S */}
            <Link href="/workflow" className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all">Workflows</Link>
            <Link href="/pricing"  className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all">Pricing</Link>
            <Link href="/docs"     className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all">Docs</Link>
          </div>

          <div className="flex items-center gap-2">
            {/* ✅ /workflow — NO S */}
            <Link href="/workflow"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}>
              Get started
            </Link>
            <button className="md:hidden p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/[0.06] px-5 py-4 flex flex-col gap-1"
            style={{ background: "rgba(6,6,8,0.97)", backdropFilter: "blur(20px)" }}>
            {/* ✅ ALL /workflow — NO S */}
            {[
              { label: "Workflows", href: "/workflow" },
              { label: "Pricing",   href: "/pricing" },
              { label: "Docs",      href: "/docs" },
            ].map(item => (
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
                {item.label}
              </Link>
            ))}
            {/* ✅ /workflow — NO S */}
            <Link href="/workflow" onClick={() => setMenuOpen(false)}
              className="mt-2 px-4 py-3 rounded-xl text-sm font-semibold text-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
              Get started free
            </Link>
          </div>
        )}
      </nav>

      {/* ═══ HERO ════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #060608 80%)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 65%)", filter: "blur(40px)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ border: "1px solid rgba(99,102,241,0.15)", animation: "spin-slow 30s linear infinite" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#6366f1]"
              style={{ boxShadow: "0 0 12px #6366f1", marginTop: "-4px" }} />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
            style={{ border: "1px solid rgba(129,140,248,0.12)", animation: "spin-slow 20s linear infinite reverse" }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#818cf8]"
              style={{ boxShadow: "0 0 8px #818cf8", marginBottom: "-3px" }} />
          </div>
        </div>

        <Particles />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold mb-10"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc", opacity: mounted ? 1 : 0, animation: mounted ? "slide-up 0.5s ease forwards" : "none" }}>
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#6366f1] opacity-75"
                style={{ animation: "pulse-ring 1.5s ease-out infinite" }} />
              <span className="relative w-2 h-2 rounded-full bg-[#6366f1]" />
            </span>
            AI Workflow Intelligence Platform
          </div>

          <h1 className="font-bold leading-[1.05] tracking-tight mb-6"
            style={{ fontSize: "clamp(34px, 6.5vw, 76px)", opacity: mounted ? 1 : 0, animation: mounted ? "slide-up 0.6s ease 0.1s forwards" : "none" }}>
            <span className="text-white">Everyone Around You</span><br />
            <span className="text-white">Is Using AI.</span><br />
            <span className="shimmer-text">You're Still Figuring It Out.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/45 max-w-2xl mx-auto leading-relaxed mb-8 px-2"
            style={{ opacity: mounted ? 1 : 0, animation: mounted ? "slide-up 0.6s ease 0.2s forwards" : "none" }}>
            Crazly gives you the exact tools, prompts, and workflows used by the top 1% of professionals
            in your field — so you can stop experimenting and start executing.
          </p>

          <div className="flex flex-col items-center gap-2.5 mb-10"
            style={{ opacity: mounted ? 1 : 0, animation: mounted ? "slide-up 0.6s ease 0.3s forwards" : "none" }}>
            {[
              "Know exactly which AI tools to use for your job — no guessing, no wasted hours",
              "Copy-paste workflows built for real professionals, not tech hobbyists",
              "Go from AI-curious to AI-fluent in days, not months",
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 text-sm sm:text-base text-white/65">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {b}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{ opacity: mounted ? 1 : 0, animation: mounted ? "slide-up 0.6s ease 0.4s forwards" : "none" }}>

            {/* ✅ /workflow — NO S */}
            <Link href="/workflow"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", boxShadow: "0 0 0 1px rgba(99,102,241,0.5), 0 8px 40px rgba(99,102,241,0.35)" }}>
              Get My AI Workflow →
            </Link>

            <button onClick={scrollToHowItWorks}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-4 rounded-2xl text-sm font-medium text-white/55 hover:text-white/90 transition-all duration-200"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><polyline points="8 12 12 16 16 12" /><line x1="12" y1="8" x2="12" y2="16" />
              </svg>
              See how it works
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25 pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest text-white">Scroll</span>
          <div className="w-px h-10 overflow-hidden bg-white/10">
            <div className="w-full h-4 bg-white/60 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE STRIP ═══════════════════════════════════════ */}
      <div className="py-5 border-y overflow-hidden"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(99,102,241,0.03)" }}>
        <div className="flex marquee-track whitespace-nowrap gap-12">
          {[0, 1].map(pass => (
            <div key={pass} className="flex items-center gap-12 shrink-0">
              {["Developer", "Content Creator", "Marketing", "Student", "Startup Founder", "Freelancer", "Designer", "Consultant", "Product Manager", "Copywriter"].map((r, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-white/30">
                  <span className="w-1 h-1 rounded-full bg-[#6366f1]" />
                  {r}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ PAIN SECTION ════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(251,113,133,0.05), transparent 70%)", filter: "blur(40px)" }} />
        </div>
        <div className="max-w-3xl mx-auto">
          <div ref={painInView.ref}>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#fb7185", opacity: painInView.inView ? 1 : 0, transform: painInView.inView ? "none" : "translateY(16px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
              <span className="w-4 h-px bg-[#fb7185]" />The real problem
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
              style={{ opacity: painInView.inView ? 1 : 0, transform: painInView.inView ? "none" : "translateY(20px)", transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s" }}>
              You've heard AI can change everything.<br />
              <span style={{ color: "rgba(255,255,255,0.3)" }}>So why does it still feel like this?</span>
            </h2>
          </div>
          <div className="mt-10">
            {[
              "You've opened ChatGPT a dozen times, typed something, got a generic answer, and closed the tab feeling no different than before.",
              "You know there are better tools out there — but researching, testing, and learning them is a full-time job you don't have time for.",
              "You've watched someone else do something impressive with AI and thought \"how did they even know to do that.\"",
              "Every week there's a new tool, a new model, a new \"game-changer\" — and somehow you're more confused than when you started.",
              "The gap between you and the people who actually use AI well is growing, and you can feel it.",
            ].map((text, i) => <PainItem key={i} text={text} delay={i * 80} />)}
          </div>
          <div className="mt-12 p-6 rounded-2xl"
            style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <p className="text-base sm:text-lg font-semibold text-white/80 leading-relaxed">
              The problem isn't you. The problem is that nobody gave you the system.{" "}
              <span style={{ color: "#818cf8" }}>Until now.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ════════════════════════════════════════ */}
      <section ref={howItWorksRef as React.RefObject<HTMLElement>}
        className="relative py-24 sm:py-32 px-5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.07), transparent 70%)", filter: "blur(60px)" }} />
          {[20, 50, 80].map(pos => (
            <div key={pos} className="absolute top-0 bottom-0 w-px"
              style={{ left: `${pos}%`, background: "linear-gradient(to bottom, transparent, rgba(99,102,241,0.06), transparent)" }} />
          ))}
        </div>
        <div className="max-w-5xl mx-auto">
          <HowItWorksHeader />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            <StepCard num="01" delay={0} title="Choose Your Profession"
              body="Tell us what you do. Developer, marketer, student, founder — Crazly instantly matches you with the workflow built specifically for your work, your tools, and your goals. No setup. No configuration. No generic advice." />
            <StepCard num="02" delay={120} title="Get Your AI Workflow"
              body="You receive a complete, structured playbook. Which AI tools to use, in what order, for what tasks — plus the exact prompts that make them work. Built by people who already figured out the hard part so you don't have to." />
            <StepCard num="03" delay={240} title="Execute Faster"
              body="Open your workflow. Follow the steps. Do in 20 minutes what used to take half a day. Every workflow is designed to produce real output immediately — not teach you theory, not send you down a research rabbit hole. Just results." />
          </div>
          <HowItWorksTagline />
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.06), transparent 70%)", filter: "blur(40px)" }} />
        </div>
        <div ref={proofInView.ref} className="max-w-5xl mx-auto">
          <div className="text-center mb-14"
            style={{ opacity: proofInView.inView ? 1 : 0, transform: proofInView.inView ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#818cf8" }}>
              <span className="w-4 h-px bg-[#818cf8]" />Early traction<span className="w-4 h-px bg-[#818cf8]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Built for people who execute.</h2>
            <p className="text-white/35 text-base max-w-md mx-auto">Used by freelancers, creators and developers adopting AI early.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            <StatCard label="Workflows available"   to={5}  suffix=""  sub="Across 5 professional roles" delay={0} />
            <StatCard label="AI tools mapped"       to={30} suffix="+" sub="Curated, not scraped"        delay={120} />
            <StatCard label="New workflows monthly" to={4}  suffix="+" sub="Added every week"            delay={240} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ProofCard icon="👥" title="Used by early adopters" delay={0}
              body="Freelancers, creators and developers who want to be ahead of the curve, not left behind by it." />
            <ProofCard icon="🔄" title="New workflows weekly" delay={100}
              body="New roles, new tools, new execution systems added every week as AI keeps evolving." />
            <ProofCard icon="🎯" title="Built for execution" delay={200}
              body="Every workflow produces real output immediately — not AI theory, not hype. Just results." />
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(99,102,241,0.1), transparent)" }} />
        </div>
        <FinalCTA />
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════════════ */}
      <footer className="border-t px-5 sm:px-10 py-8" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size="sm" />
            <span className="font-bold text-sm text-white/70">Crazly</span>
          </Link>
          <div className="flex items-center gap-6 text-xs text-white/25">
            {/* ✅ ALL /workflow — NO S */}
            <Link href="/workflow" className="hover:text-white/60 transition-colors">Workflows</Link>
            <Link href="/pricing"  className="hover:text-white/60 transition-colors">Pricing</Link>
            <Link href="/docs"     className="hover:text-white/60 transition-colors">Docs</Link>
          </div>
          <p className="text-xs text-white/20">© 2025 Crazly. Stop experimenting. Start executing.</p>
        </div>
      </footer>

    </main>
  );
}