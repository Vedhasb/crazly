export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="border-b border-zinc-800 px-6 py-4">
        <span className="text-lg font-semibold text-white">Crazly</span>
      </nav>

      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          AI isn&apos;t replacing professionals. It&apos;s replacing slow workflows.
        </h1>
        <p className="mt-6 text-zinc-400">
          Work faster with workflows that adapt to you—not the other way around.
        </p>
        <a
          href="#"
          className="mt-8 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
        >
          Get started
        </a>
      </main>
    </div>
  );
}
