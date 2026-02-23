"use client";

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
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(false);

  const roles: { key: Role; label: string }[] = [
    { key: "developer", label: "Developer" },
    { key: "contentCreator", label: "Content Creator" },
    { key: "marketing", label: "Marketing" },
    { key: "student", label: "Student" },
    { key: "startupFounder", label: "Startup Founder" },
  ];

  const generateWorkflow = () => {
    if (!selectedRole) return;
    setShowResult(true);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <h1 className="text-3xl font-bold mb-8">
        Choose your role to get started
      </h1>

      {/* ROLE BUTTONS */}
      <div className="flex flex-wrap gap-4 mb-10">
        {roles.map((role) => (
          <button
            key={role.key}
            onClick={() => {
              setSelectedRole(role.key);
              setShowResult(false);
            }}
            className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20"
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* CHAT BOX */}
      {selectedRole && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-3xl">
          <p className="mb-3 text-sm text-white/60">
            Chat as <b>{selectedRole}</b>
          </p>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your problem and expected solution..."
            className="w-full p-3 rounded-lg bg-black border border-white/10 mb-4"
          />

          <button
            onClick={generateWorkflow}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold"
          >
            Generate Workflow
          </button>
        </div>
      )}

      {/* RESULT SECTION */}
      {showResult && selectedRole && (
        <div className="mt-12 max-w-3xl bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">
            {workflows[selectedRole].title}
          </h2>

          <h3 className="font-semibold mb-2">🧰 Tools</h3>
          <ul className="list-disc ml-6 mb-6">
            {workflows[selectedRole].tools.map((tool, i) => (
              <li key={i}>{tool}</li>
            ))}
          </ul>

          <h3 className="font-semibold mb-2">⚡ Workflow Steps</h3>
          <ol className="list-decimal ml-6">
            {workflows[selectedRole].steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          <div className="mt-8 p-4 border border-yellow-400/30 rounded-lg bg-yellow-400/10">
            🔒 Want copy-paste prompts & automations?
            <button className="ml-4 bg-yellow-400 text-black px-4 py-2 rounded-lg">
              Unlock Premium
            </button>
          </div>
        </div>
      )}
    </main>
  );
}