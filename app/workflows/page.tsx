"use client";

import Link from "next/link";
import { useState } from "react";
import { workflows } from "@/lib/workflows";

export default function WorkflowsPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10 max-w-7xl mx-auto w-full">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Crazly
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/workflows" className="text-sm text-white font-medium">
            Workflows
          </Link>
          <span className="text-sm text-white/60">Pricing</span>
        </div>
      </nav>

      {/* PAGE HEADER */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-2">
          What problem are you trying to solve?
        </h1>
        <p className="text-white/50 text-sm mb-10">
          Choose your role and we’ll suggest the best workflow.
        </p>

        {/* ROLE BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setSelectedRole("developer")}
            className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Developer
          </button>

          <button
            onClick={() => setSelectedRole("contentCreator")}
            className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Content Creator
          </button>

          <button
            onClick={() => setSelectedRole("marketing")}
            className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Marketing
          </button>

          <button
            onClick={() => setSelectedRole("student")}
            className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Student
          </button>

          <button
            onClick={() => setSelectedRole("startupFounder")}
            className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            Startup Founder
          </button>
        </div>

        {/* WORKFLOW RESULT */}
        {selectedRole && workflows[selectedRole] && (
          <div className="mt-14 text-left p-8 bg-white/5 border border-white/10 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">
              {workflows[selectedRole].title}
            </h2>

            <h3 className="font-semibold mt-6 mb-2">Recommended Tools</h3>
            <ul className="space-y-1 text-white/80">
              {workflows[selectedRole].tools.map((tool: string) => (
                <li key={tool}>• {tool}</li>
              ))}
            </ul>

            <h3 className="font-semibold mt-6 mb-2">Step-by-Step Workflow</h3>
            <ol className="space-y-1 text-white/80 list-decimal list-inside">
              {workflows[selectedRole].steps.map((step: string) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            {/* PREMIUM LOCK */}
            <div className="mt-10 p-6 rounded-lg bg-white/5 border border-white/10">
              <p className="opacity-60 blur-sm">
                🔒 Copy-paste prompts and automation templates hidden…
              </p>

              <button className="mt-4 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-semibold transition">
                Unlock Pro
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}