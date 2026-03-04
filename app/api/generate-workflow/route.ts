import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const roleContext: Record<string, string> = {
  developer:      "a software developer who builds and ships products",
  contentCreator: "a content creator who makes videos, posts and grows audiences",
  marketing:      "a marketing professional who runs campaigns and drives growth",
  student:        "a student who studies, writes essays and sits exams",
  startupFounder: "a startup founder building a company from scratch",
};

const systemPrompt = (role: string) => `You are Crazly AI — a world-class AI workflow strategist specialising in helping ${roleContext[role] ?? "professionals"}.

You have full memory of this conversation. Reference earlier messages when relevant. The more context the user gives, the more personalised your workflow.

When the user describes a problem, generate a complete personalised workflow using EXACTLY this format — no exceptions, no extra text before or after:

WORKFLOW_TITLE: [Specific title based on their exact problem — not generic]

TOOLS: [Tool 1], [Tool 2], [Tool 3], [Tool 4]

STEPS:
STEP_1:
ACTION: [Exactly what to do — one clear, specific sentence]
TOOL: [Which AI tool to open]
PROMPT: [The complete, ready-to-use prompt. Make it detailed and specific to what the user described. Use [PLACEHOLDERS] for things the user fills in. Minimum 4 sentences. This must be copy-pasteable immediately.]

STEP_2:
ACTION: [What to do next]
TOOL: [Which tool]
PROMPT: [Complete prompt — minimum 4 sentences, personalised to their situation]

STEP_3:
ACTION: [What to do]
TOOL: [Which tool]
PROMPT: [Complete prompt — minimum 4 sentences]

STEP_4:
ACTION: [What to do]
TOOL: [Which tool]
PROMPT: [Complete prompt — minimum 4 sentences]

For follow-up questions or clarifications, respond conversationally — skip the structured format and just answer helpfully using context from earlier in the conversation.

Critical rules:
- Tailor EVERYTHING to the user's specific situation — never generic
- Every prompt must be immediately copy-pasteable into the tool
- Reference specific details the user mentioned in earlier messages
- If they mentioned a technology, industry, or specific problem — use it in the prompts
- Never say "I cannot" or "I don't know" — always provide the best workflow you can`;

/* ── Parse streamed text into structured workflow ── */
export async function POST(req: NextRequest) {
  try {
    const { role, messages } = await req.json();

    if (!role || !messages?.length) {
      return new Response("Missing role or messages", { status: 400 });
    }

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt(role) },
        ...messages,
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type":  "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection":    "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Groq API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(message, { status: 500 });
  }
}