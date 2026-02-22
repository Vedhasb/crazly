import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

type RequestBody = {
  role: string;
  problem: string;
  expectedSolution: string;
};

type OpenAIResponse = {
  recommendedTools: string[];
  stepByStepWorkflow: string[];
};

function parseJsonResponse(text: string): OpenAIResponse {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON object in response");
  const parsed = JSON.parse(jsonMatch[0]) as unknown;
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid JSON");
  const recommendedTools = Array.isArray((parsed as { recommendedTools?: unknown }).recommendedTools)
    ? (parsed as { recommendedTools: string[] }).recommendedTools
    : [];
  const stepByStepWorkflow = Array.isArray((parsed as { stepByStepWorkflow?: unknown }).stepByStepWorkflow)
    ? (parsed as { stepByStepWorkflow: string[] }).stepByStepWorkflow
    : [];
  return { recommendedTools, stepByStepWorkflow };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { role, problem, expectedSolution } = body;
  if (
    typeof role !== "string" ||
    typeof problem !== "string" ||
    typeof expectedSolution !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing or invalid fields: role, problem, expectedSolution (all strings)" },
      { status: 400 }
    );
  }

  const systemPrompt = `You are an expert workflow advisor. Given a user's role, their problem, and expected solution, respond with exactly one JSON object (no markdown, no extra text) with two keys:
- "recommendedTools": array of strings (specific tool/app names that would help solve this problem)
- "stepByStepWorkflow": array of strings (ordered steps to achieve the expected solution)

Be concise and practical.`;

  const userPrompt = `Role: ${role}\nProblem: ${problem}\nExpected solution: ${expectedSolution}`;

  try {
    const res = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: "OpenAI API error", details: err },
        { status: res.status }
      );
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Empty response from OpenAI" },
        { status: 502 }
      );
    }

    const result = parseJsonResponse(content);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to call OpenAI", details: message },
      { status: 500 }
    );
  }
}
