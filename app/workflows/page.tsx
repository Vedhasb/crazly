import Link from "next/link";

const workflows = [
  {
    id: "web-developer",
    title: "Web Developer",
    description: "Ship features faster with AI-assisted code, reviews, and deployment pipelines.",
  },
  {
    id: "content-creator",
    title: "Content Creator",
    description: "Scripts, thumbnails, and publishing workflows—all from one place.",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Campaigns, copy, and analytics in a single streamlined workflow.",
  },
  {
    id: "student",
    title: "Student",
    description: "Notes, summaries, and study plans that adapt to your schedule.",
  },
  {
    id: "startup-founder",
    title: "Startup Founder",
    description: "Pitch decks, hiring checklists, and ops—less chaos, more clarity.",
  },
];

export default function WorkflowsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10 max-w-7xl mx-auto w-full">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          Crazly
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/workflows" className="text-sm text-white font-medium">
            Workflows
          </Link>
          <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
            Pricing
          </a>
          <a
            href="#"
            className="text-sm bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
          >
            Get Started
          </a>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Workflows
          </h1>
          <p className="text-white/50 text-sm">
            Pick a workflow and get started in seconds.
          </p>
        </div>

        <div className="grid gap-4">
          {workflows.map((w) => (
            <div
              key={w.id}
              className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 transition-colors"
            >
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">
                  {w.title}
                </h2>
                <p className="text-sm text-white/50 leading-relaxed max-w-xl">
                  {w.description}
                </p>
              </div>
              <Link
                href={`/workflows/${w.id}`}
                className="shrink-0 text-sm font-semibold px-4 py-2.5 rounded-lg bg-white/10 text-white hover:bg-white/15 border border-white/10 transition-colors inline-flex items-center gap-2"
              >
                Open Workflow
                <span className="text-white/60">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
