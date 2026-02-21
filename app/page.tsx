export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-zinc-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#" className="text-xl font-semibold tracking-tight text-white">
            Crazly
          </a>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#problem" className="text-sm text-zinc-400 transition hover:text-white">
              Problem
            </a>
            <a href="#how-it-works" className="text-sm text-zinc-400 transition hover:text-white">
              How it works
            </a>
            <a href="#pricing" className="text-sm text-zinc-400 transition hover:text-white">
              Pricing
            </a>
            <a
              href="#cta"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Get started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative border-b border-zinc-800/50 px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
            Build faster. Ship smarter.
          </h1>
          <p className="mt-6 text-lg text-zinc-400 md:text-xl">
            The modern platform that turns chaos into clarity. One workflow for your whole team.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#cta"
              className="w-full rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
            >
              Start free trial
            </a>
            <a
              href="#how-it-works"
              className="w-full rounded-full border border-zinc-600 px-6 py-3 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800/50 sm:w-auto"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="border-b border-zinc-800/50 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Too many tools. Too little time.
          </h2>
          <p className="mt-6 text-zinc-400 md:text-lg">
            Teams waste hours switching between apps, chasing updates, and reconciling data. Context gets lost. Deadlines slip. Crazly unifies your workflow so you can focus on what matters.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-zinc-800/50 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-white md:text-3xl">
            How it works
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/50 text-lg font-semibold text-white">
                1
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">Connect</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Link your tools and data in one place. No more copy-paste or manual sync.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/50 text-lg font-semibold text-white">
                2
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">Automate</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Set rules and triggers. Workflows run in the background so you don&apos;t have to.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/50 text-lg font-semibold text-white">
                3
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">Ship</h3>
              <p className="mt-2 text-sm text-zinc-400">
                See everything in one view. Make decisions faster and deliver on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow preview cards */}
      <section className="border-b border-zinc-800/50 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-white md:text-3xl">
            One workflow, endless possibilities
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-zinc-400">
            Preview how Crazly fits into your day.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { title: "Tasks", desc: "Prioritize and track work across projects." },
              { title: "Docs", desc: "Capture ideas and decisions in one place." },
              { title: "Sync", desc: "Keep tools and people aligned in real time." },
              { title: "Reports", desc: "Dashboards that update without the busywork." },
              { title: "Integrations", desc: "Connect Slack, Notion, GitHub, and more." },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700"
              >
                <h3 className="font-medium text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b border-zinc-800/50 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Simple pricing
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-zinc-400">
            Start free. Scale when you&apos;re ready.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
              <h3 className="font-medium text-white">Starter</h3>
              <p className="mt-2 text-3xl font-semibold text-white">$0</p>
              <p className="mt-1 text-sm text-zinc-400">Forever free</p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                <li>Up to 3 members</li>
                <li>Basic workflows</li>
                <li>Community support</li>
              </ul>
              <a
                href="#cta"
                className="mt-6 block w-full rounded-lg border border-zinc-600 py-2.5 text-center text-sm font-medium text-white transition hover:border-zinc-500"
              >
                Get started
              </a>
            </div>
            <div className="rounded-xl border border-zinc-600 bg-zinc-800/50 p-6 ring-1 ring-zinc-500/50">
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white">
                Popular
              </span>
              <h3 className="mt-4 font-medium text-white">Pro</h3>
              <p className="mt-2 text-3xl font-semibold text-white">$19</p>
              <p className="mt-1 text-sm text-zinc-400">Per member / month</p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                <li>Unlimited members</li>
                <li>Advanced automation</li>
                <li>Priority support</li>
              </ul>
              <a
                href="#cta"
                className="mt-6 block w-full rounded-lg bg-white py-2.5 text-center text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Start free trial
              </a>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
              <h3 className="font-medium text-white">Enterprise</h3>
              <p className="mt-2 text-3xl font-semibold text-white">Custom</p>
              <p className="mt-1 text-sm text-zinc-400">Contact us</p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                <li>SSO &amp; security</li>
                <li>Dedicated success</li>
                <li>SLA guarantee</li>
              </ul>
              <a
                href="#cta"
                className="mt-6 block w-full rounded-lg border border-zinc-600 py-2.5 text-center text-sm font-medium text-white transition hover:border-zinc-500"
              >
                Contact sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center md:p-14">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Ready to simplify your workflow?
          </h2>
          <p className="mt-4 text-zinc-400">
            Join teams who ship faster with Crazly. No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="w-full rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
            >
              Start free trial
            </a>
            <a
              href="#"
              className="w-full rounded-full border border-zinc-600 px-6 py-3 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-500 sm:w-auto"
            >
              Book a demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-sm text-zinc-500">© {new Date().getFullYear()} Crazly. All rights reserved.</span>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="transition hover:text-zinc-300">Privacy</a>
            <a href="#" className="transition hover:text-zinc-300">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
