"use client";

import Link from "next/link";
import { useState } from "react";
import { workflows } from "@/lib/workflows";

type Role =
  | "developer"
  | "contentCreator"
  | "marketing"
  | "student"
  | "startupFounder";

export default function WorkflowsPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showResult, setShowResult] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between px-8 py-5 border-b border-white/10">
        <Link href="/" className="text-2xl font-bold">
          Crazly
        </Link>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-14 text-center">

        <h1 className="text-4xl font-bold mb-10">
          Choose your role
        </h1>

        {/* ROLE BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button onClick={()=>{setSelectedRole("developer");setShowResult(false)}} className="btn">Developer</button>
          <button onClick={()=>{setSelectedRole("contentCreator");setShowResult(false)}} className="btn">Content Creator</button>
          <button onClick={()=>{setSelectedRole("marketing");setShowResult(false)}} className="btn">Marketing</button>
          <button onClick={()=>{setSelectedRole("student");setShowResult(false)}} className="btn">Student</button>
          <button onClick={()=>{setSelectedRole("startupFounder");setShowResult(false)}} className="btn">Startup Founder</button>
        </div>

        {/* CHAT BOX */}
        {selectedRole && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <textarea
              placeholder="State your problem and expected solution..."
              className="w-full bg-transparent outline-none h-24 text-white placeholder:text-white/40"
            />

            <button
              onClick={()=>setShowResult(true)}
              className="mt-4 bg-indigo-600 px-6 py-3 rounded-lg"
            >
              Generate Workflow
            </button>
          </div>
        )}

        {/* WORKFLOW RESULT */}
        {showResult && selectedRole && (
          <div className="mt-12 text-left p-8 bg-white/5 border border-white/10 rounded-xl">

            <h2 className="text-2xl font-bold mb-4">
              {workflows[selectedRole].title}
            </h2>

            <h3 className="font-semibold mt-6 mb-2">Tools</h3>
            <ul>
              {workflows[selectedRole].tools.map((tool:string)=>(
                <li key={tool}>• {tool}</li>
              ))}
            </ul>

            <h3 className="font-semibold mt-6 mb-2">Steps</h3>
            <ol className="list-decimal list-inside">
              {workflows[selectedRole].steps.map((step:string)=>(
                <li key={step}>{step}</li>
              ))}
            </ol>

            {/* PREMIUM */}
            <div className="mt-10 border border-white/10 p-6 rounded-lg">
              <p className="blur-sm opacity-70">
                🔒 Copy-paste prompts hidden…
              </p>
              <button className="mt-4 bg-indigo-600 px-6 py-3 rounded-lg">
                Unlock Pro
              </button>
            </div>

          </div>
        )}

      </section>
    </main>
  );
}