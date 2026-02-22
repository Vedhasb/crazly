import Link from "next/link"

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10 max-w-7xl mx-auto w-full">
        <span className="text-2xl font-bold tracking-tight text-white">Crazly</span>
        <div className="flex items-center gap-8">
          <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Product</a>
          <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
          <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Blog</a>
          <Link href="/workflows">
            <a href="/workflows" className="text-sm bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors">
              Start for Free
            </a>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 max-w-4xl mx-auto">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-8">
          Now in Public Beta
        </span>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-white mb-6">
          AI isn't replacing professionals.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            It's replacing slow workflows.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">
          Crazly gives your team an AI-powered command center to automate repetitive tasks, cut turnaround time in half, and focus on the work that actually moves the needle.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <a
            href="#"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-indigo-600/30"
          >
            Start for free →
          </a>
          <Link href="/workflows">
          <a className="text-sm bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors">
            Get Started
            </a>
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-10 text-sm text-white/30">
          Trusted by <span className="text-white/60 font-semibold">2,400+</span> teams worldwide · No credit card required
        </p>
      </section>

      {/* Feature strip */}
      <section className="border-t border-white/10 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { title: "10× Faster", desc: "Automate repetitive workflows in minutes, not months." },
            { title: "Zero Bloat", desc: "One clean interface. No cluttered dashboards, ever." },
            { title: "AI-Native", desc: "Built from the ground up for the AI-first era of work." },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/[0.07] transition-colors"
            >
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-white/30 text-sm">
        © {new Date().getFullYear()} Crazly, Inc. All rights reserved.
      </footer>
    </main>
  );
}