"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center text-center px-6">
      
      <h1 className="text-6xl font-bold mb-6">
        Crazly
      </h1>

      <p className="text-white/60 max-w-xl mb-10">
        The AI playbook for people with actual work to do.
        Stop experimenting. Start executing.
      </p>

      <Link
        href="/workflows"
        className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-xl font-semibold transition"
      >
        Get Started →
      </Link>

    </main>
  );
}