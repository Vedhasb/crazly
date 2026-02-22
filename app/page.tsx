"use client";

import Link from "next/link";
import { useState } from "react";

const ROLES = [
  "Developer",
  "Content Creator",
  "Marketing",
  "Student",
  "Startup Founder",
] as const;

type Role = (typeof ROLES)[number];

export default function Page() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: "user", text: input.trim() }]);
    setInput("");
    // Placeholder: no backend yet
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "I'm your AI assistant for this role. Connect a backend to get real responses.",
        },
      ]);
    }, 400);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-white/10 max-w-6xl mx-auto w-full">
        <span className="text-xl font-semibold tracking-tight text-white">
          Crazly
        </span>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Product
          </a>
          <a
            href="#"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Pricing
          </a>
          <Link
            href="/workflows"
            className="text-sm bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Role selection */}
        <section className="mb-12">
          <p className="text-sm text-white/40 mb-6 text-center">
            Choose your role to get started
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`
                  relative rounded-xl border px-5 py-4 sm:py-5 text-left font-medium text-sm sm:text-base
                  transition-all duration-200
                  ${
                    selectedRole === role
                      ? "border-white/30 bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white/90"
                  }
                `}
              >
                {role}
              </button>
            ))}
          </div>
        </section>

        {/* Chatbot (only when role selected) */}
        {selectedRole && (
          <section className="transition-opacity duration-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-xl">
              {/* Chat header */}
              <div className="border-b border-white/10 px-4 py-3 flex items-center gap-2">
                <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                  Chat as
                </span>
                <span className="text-sm font-semibold text-white">
                  {selectedRole}
                </span>
              </div>

              {/* Message area */}
              <div className="min-h-[280px] max-h-[400px] overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center min-h-[240px] text-center">
                    <p className="text-white/40 text-sm mb-1">
                      Start a conversation
                    </p>
                    <p className="text-white/25 text-xs">
                      Ask anything—responses are placeholder until backend is connected.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[85%] rounded-xl px-4 py-2.5 text-sm
                          ${
                            msg.role === "user"
                              ? "bg-white/10 text-white rounded-br-md"
                              : "bg-white/5 text-white/90 border border-white/10 rounded-bl-md"
                          }
                        `}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input + Send */}
              <div className="border-t border-white/10 p-3 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  className="rounded-lg bg-white text-black font-medium px-5 py-3 text-sm hover:bg-white/90 transition-colors shrink-0"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Locked premium section */}
            <div className="mt-8 relative rounded-2xl border border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <p className="text-white/60 text-sm font-medium mb-2">
                  Copy-Paste Prompts (Pro)
                </p>
                <p className="text-white/35 text-xs text-center max-w-xs mb-6">
                  Ready-made prompts for your role. Unlock to save time and get better results.
                </p>
                <button
                  type="button"
                  className="rounded-lg bg-white text-black font-semibold px-6 py-3 text-sm hover:bg-white/90 transition-colors"
                >
                  Unlock Copy-Paste Prompts (Pro)
                </button>
              </div>
              {/* Blurred content underneath */}
              <div className="p-6 select-none pointer-events-none">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-lg bg-white/5 border border-white/10"
                    />
                  ))}
                </div>
                <div className="h-24 rounded-lg bg-white/5 border border-white/10" />
                <div className="mt-3 h-4 w-3/4 rounded bg-white/5" />
                <div className="mt-2 h-4 w-1/2 rounded bg-white/5" />
              </div>
            </div>
          </section>
        )}

        {/* Empty state when no role selected */}
        {!selectedRole && (
          <p className="text-center text-white/30 text-sm py-8">
            Select a role above to open the chat.
          </p>
        )}
      </div>

      <footer className="border-t border-white/10 py-6 px-4 text-center text-white/25 text-xs mt-16">
        © {new Date().getFullYear()} Crazly. No backend connected yet.
      </footer>
    </main>
  );
}
