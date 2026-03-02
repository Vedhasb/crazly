"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Role = "developer" | "contentCreator" | "marketing" | "student" | "startupFounder";

/* ─── TYPES ─────────────────────────────────────────────────────── */
type PromptStep = {
  tool: string;
  toolUrl: string;
  promptText: string;
  instruction: string; // what to do with the output
};

type WorkflowData = {
  title: string;
  summary: string; // one-line description of the workflow structure
  tools: string[];
  steps: string[];   // high-level structural steps (how the work flows)
  prompts: PromptStep[];
  keywords: string[];
};

type RoleWorkflows = {
  painPoints: WorkflowData[];
};

/* ═══════════════════════════════════════════════════════════════════
   WORKFLOW MAP  —  5 roles × 5 pain points
═══════════════════════════════════════════════════════════════════ */
const workflowMap: Record<Role, RoleWorkflows> = {

  /* ──────────────────────────────── DEVELOPER ─────────────────── */
  developer: {
    painPoints: [

      /* 1 — Debugging */
      {
        keywords: ["debug","error","bug","crash","exception","fix","broken","issue","not working","fail","undefined","null"],
        title: "AI-Powered Debugging Workflow",
        summary: "Paste error → Claude diagnoses → Copilot fixes inline → test written to prevent recurrence.",
        tools: ["Claude","GitHub Copilot","Sentry","Pieces for Developers"],
        steps: [
          "STEP 1 — Diagnose: Copy your full error message + relevant code block. Head to Claude and use Prompt 1 below to get a root-cause analysis.",
          "STEP 2 — Fix inline: Take Claude's diagnosis back to your editor. Open GitHub Copilot chat, paste the suggested fix direction, and let Copilot rewrite the function.",
          "STEP 3 — Verify stack trace: If it's a production error, open Sentry, find the full stack trace, and feed it back to Claude with Prompt 2 to cross-check the fix.",
          "STEP 4 — Write regression test: Use Prompt 3 in Claude to generate a unit test that would catch this bug. Add it to your test suite so it never silently reappears.",
          "STEP 5 — Document: Ask Claude 'How do I prevent this class of bug across the codebase?' and paste the answer into your team wiki.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Go to Claude. Start a new chat. Paste this prompt with your actual error and code filled in. Claude will return 3 ranked root-cause hypotheses with a fix for each.",
            promptText: `You are a senior software engineer and debugging expert.

ROLE: Act as my pair-programmer helping me squash a bug fast.

PROBLEM: I have the following error in my [language/framework] project:
--- ERROR ---
[paste full error message + stack trace here]
--- CODE ---
[paste the relevant function or file here]

EXPECTED OUTPUT:
1. Explain in plain English what this error means and exactly why it is happening.
2. List the 3 most likely root causes, ranked by probability.
3. For each root cause, give me the exact code fix I should apply.
4. Tell me any edge cases I might miss if I only fix the most obvious cause.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After getting the Sentry stack trace, return to the same Claude chat. Use this prompt to cross-check whether your planned fix actually addresses the real call chain.",
            promptText: `You are a senior software engineer reviewing a production bug report.

ROLE: Analyse this Sentry stack trace and confirm or challenge my current fix plan.

STACK TRACE:
[paste Sentry stack trace here]

MY CURRENT FIX PLAN:
[describe what you plan to change]

EXPECTED OUTPUT:
1. Walk through the stack trace step by step and identify the exact line where the failure originates.
2. Tell me if my fix plan addresses that root cause, or if I am treating a symptom.
3. If my plan is wrong or incomplete, give me the corrected fix.
4. List any other functions in this trace that could be affected and should be reviewed.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Once the bug is fixed, use this prompt in a new Claude message to generate a regression test. Copy the output and add it directly to your test file.",
            promptText: `You are a senior engineer writing defensive tests.

ROLE: Write a regression test that permanently guards against the bug I just fixed.

THE BUG I FIXED:
[describe the bug — what it was, what caused it, what the fix was]

MY TEST FRAMEWORK: [Jest / Pytest / Vitest / etc.]
MY LANGUAGE: [TypeScript / Python / etc.]

EXPECTED OUTPUT:
1. A complete, runnable test file (or test block) that:
   - Reproduces the exact condition that caused the bug
   - Confirms the bug no longer occurs with the fix
   - Covers 2–3 related edge cases that could cause a similar failure
2. A one-line comment above each test explaining what it guards against.`,
          },
        ],
      },

      /* 2 — Building a feature */
      {
        keywords: ["feature","build","implement","create","develop","add","new functionality","ship","product"],
        title: "Feature Build Acceleration Workflow",
        summary: "Break down with Claude → scaffold UI with v0 → Copilot fills logic → Claude reviews → Notion AI documents.",
        tools: ["Claude","v0 by Vercel","GitHub Copilot","Notion AI"],
        steps: [
          "STEP 1 — Decompose: Open Claude and use Prompt 1 to break your feature into the smallest independently shippable tasks. Copy the task list into Linear or Notion.",
          "STEP 2 — Scaffold UI: Go to v0.dev. Describe the UI component you need. v0 generates the React/HTML in seconds. Copy the scaffold into your project.",
          "STEP 3 — Fill logic: For each task, open GitHub Copilot chat in your editor. Describe what the function should do and let Copilot autocomplete the business logic.",
          "STEP 4 — Security review: Once a task is complete, paste the code into Claude with Prompt 2. Fix any issues flagged before merging.",
          "STEP 5 — Auto-document: Paste your finished code into Notion AI with Prompt 3 to generate the technical spec. Attach it to the task card.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Use this prompt to turn your rough feature idea into a structured build plan. Copy the numbered task list into your project management tool.",
            promptText: `You are a senior software engineer and product architect.

ROLE: Help me plan and break down a new feature into the smallest shippable tasks.

FEATURE DESCRIPTION:
[describe what the feature should do, from the user's perspective]

MY STACK: [e.g. Next.js, Supabase, TypeScript]
TEAM SIZE: [solo / 2–3 devs]
TARGET DEADLINE: [rough timeframe]

EXPECTED OUTPUT:
1. A breakdown of this feature into the smallest independently shippable sub-tasks (no task should take longer than 1 day).
2. For each task: what it does, what files/components it touches, and what 'done' looks like.
3. The recommended build order with reasons (dependencies first).
4. Any technical risks or decisions I need to resolve before starting.
5. Suggested folder/file structure for new code.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After completing each task, paste that code into Claude with this prompt. Fix any issues before moving to the next task.",
            promptText: `You are a senior engineer doing a thorough code review.

ROLE: Review this code for correctness, security issues, and edge cases before it is merged.

CODE TO REVIEW:
[paste your code here]

CONTEXT: This code is part of [describe the feature]. It runs in [describe environment — client/server/edge].

EXPECTED OUTPUT:
1. A verdict: is this code safe to merge as-is, or does it need changes?
2. List every security vulnerability found (injection, auth issues, unvalidated inputs, etc.).
3. List every edge case that is not handled and could cause a bug in production.
4. Any performance issues that would become problems at scale.
5. Specific code suggestions for every issue found — not just descriptions.`,
          },
          {
            tool: "Notion AI",
            toolUrl: "https://www.notion.so",
            instruction: "Open your Notion workspace. Create a new page for this feature. Type /AI in Notion, then paste this prompt with your code to auto-generate the technical spec.",
            promptText: `You are a technical writer creating internal developer documentation.

ROLE: Write a clear technical specification for this code so any developer on the team can understand, maintain, and extend it.

CODE:
[paste your finished feature code here]

EXPECTED OUTPUT:
1. Feature overview (2–3 sentences — what it does and why it exists).
2. How it works — a plain English walkthrough of the logic, step by step.
3. Key functions/components explained: what each does, its inputs, and its outputs.
4. How to set it up locally (env vars, dependencies, configuration).
5. Known limitations or future improvements to consider.`,
          },
        ],
      },

      /* 3 — Optimising code */
      {
        keywords: ["optimis","refactor","clean","performance","slow","improve","rewrite","speed","tech debt","review"],
        title: "Code Optimisation & Refactoring Workflow",
        summary: "Claude finds bottlenecks → CodeRabbit reviews PR → SonarQube scans debt → Claude refactors → migration guide written.",
        tools: ["Claude","CodeRabbit","SonarQube","GitHub Copilot"],
        steps: [
          "STEP 1 — Audit: Paste your target file or function into Claude with Prompt 1. Get a ranked list of performance and quality issues.",
          "STEP 2 — Automated PR review: Install CodeRabbit on your GitHub repo (coderabbit.ai). Open a PR with your changes. CodeRabbit will automatically post AI review comments within minutes.",
          "STEP 3 — Codebase scan: Run SonarQube on your full project to surface technical debt, code smells, and security hotspots across all files — not just the ones you're editing.",
          "STEP 4 — Refactor: Take the top issues back to Claude and use Prompt 2 to get a fully rewritten, clean version of the function.",
          "STEP 5 — Team migration guide: Use Prompt 3 in Claude to write a migration guide your teammates can follow to update their dependent code.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Go to Claude. Paste this prompt with your code. You'll get a prioritised audit — start fixing from the top of the list.",
            promptText: `You are a senior software engineer specialising in performance and code quality.

ROLE: Audit this code and give me a prioritised list of improvements.

CODE:
[paste your function or file here]

LANGUAGE / FRAMEWORK: [e.g. TypeScript / React / Node.js]
SCALE CONTEXT: [e.g. this runs on every API request / this renders on every page load]

EXPECTED OUTPUT:
1. Performance bottlenecks ranked by impact — with an estimate of how much improvement each fix gives.
2. Code quality issues (readability, complexity, naming, duplication) ranked by severity.
3. Security issues if any.
4. For each issue: the exact lines affected, why it is a problem, and the specific fix.
5. An overall score out of 10 for this code and what it would take to reach a 9/10.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "In the same Claude chat, use this prompt to get a fully rewritten clean version of your most problematic function. Copy and replace your original.",
            promptText: `You are a senior software engineer refactoring legacy code.

ROLE: Rewrite this function to be clean, performant, and maintainable without changing its external behaviour.

ORIGINAL FUNCTION:
[paste the function here]

REQUIREMENTS:
- Follow SOLID principles
- Eliminate all code smells identified in the audit
- Optimise the performance bottleneck at [describe bottleneck]
- Add inline comments explaining non-obvious logic
- Language/framework: [your stack]

EXPECTED OUTPUT:
1. The fully rewritten function with clean code.
2. A bullet list of every change you made and the reason for each change.
3. Any breaking changes or behaviour differences I must be aware of.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After refactoring, use this prompt to generate a migration guide. Paste it into your team's Slack or Notion so colleagues know how to update their code.",
            promptText: `You are a senior engineer writing internal documentation for your team.

ROLE: Write a migration guide for teammates whose code depends on the function I just refactored.

ORIGINAL FUNCTION SIGNATURE: [old function name + params]
NEW FUNCTION SIGNATURE: [new function name + params]

CHANGES MADE:
[briefly describe what changed — renamed params, different return shape, removed side effects, etc.]

EXPECTED OUTPUT:
1. A clear before/after comparison showing old vs new usage with code examples.
2. Step-by-step instructions for updating any code that calls the old function.
3. Any gotchas or edge cases teammates must watch for during the migration.
4. A simple checklist they can tick off to confirm their migration is complete.`,
          },
        ],
      },

      /* 4 — Learning new tech */
      {
        keywords: ["learn","understand","study","how does","explain","tutorial","new tech","framework","library","typescript","react","python","rust","go"],
        title: "Learn New Tech at 10x Speed Workflow",
        summary: "Claude teaches with analogies → Perplexity finds docs → Claude quizzes → build a mini project → Claude reviews.",
        tools: ["Claude","Perplexity AI","NotebookLM","GitHub Copilot"],
        steps: [
          "STEP 1 — Conceptual foundation: Open Claude and use Prompt 1 to get a tailored explanation that connects the new tech to what you already know.",
          "STEP 2 — Find best resources: Open Perplexity AI (perplexity.ai) and search '[technology] best official docs and beginner projects 2024'. It surfaces live, up-to-date links.",
          "STEP 3 — Deep-dive docs: Upload the official docs PDF or paste key sections into NotebookLM (notebooklm.google.com). Ask it to summarise and clarify confusing sections.",
          "STEP 4 — Test yourself: Back in Claude, use Prompt 2 to get quizzed. Don't look at your notes — answer from memory. Claude will mark and explain each answer.",
          "STEP 5 — Build and review: Build a tiny project using the new tech. Paste your code into Claude with Prompt 3 for a mentor-style review.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Use this prompt to get a personalised lesson that skips basics you already know and focuses on what actually transfers from your current stack.",
            promptText: `You are a world-class programming tutor who specialises in accelerated learning for experienced developers.

ROLE: Teach me [technology I want to learn] based on what I already know.

MY CURRENT SKILLS: [e.g. I know React, TypeScript, basic Node.js, REST APIs]
TECHNOLOGY TO LEARN: [e.g. Rust / Next.js App Router / GraphQL / Docker]
MY GOAL: [e.g. I want to build a full-stack app / I need this for my job / I'm preparing for interviews]
TIME AVAILABLE: [e.g. 1 week of evenings]

EXPECTED OUTPUT:
1. A learning roadmap broken into 5 stages, from zero to productive, with time estimates.
2. For each key concept: explain it using an analogy to something I already know from my current stack.
3. The 5 things that trip up developers coming from my background — and how to avoid each.
4. The single best first project to build to cement my understanding.
5. What I should NOT bother learning yet (what can wait until I'm more advanced).`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After studying for a session, come back to Claude and use this quiz prompt. Answer each question without looking at notes to identify your real gaps.",
            promptText: `You are a tough but fair technical interviewer.

ROLE: Quiz me on [technology] to expose the gaps in my understanding.

WHAT I'VE STUDIED SO FAR: [briefly describe topics covered]
MY LEVEL: [beginner / intermediate]

EXPECTED OUTPUT:
Give me exactly 10 questions, progressively harder (questions 1–3 easy, 4–7 medium, 8–10 hard).

After I answer each one, tell me:
- Whether I was correct
- What I missed or got wrong
- The complete correct answer with a short explanation

Start with question 1 now and wait for my answer before continuing.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After building your mini project, paste the code here. Claude will give you a mentor-style review that tells you what a senior dev in this technology would think.",
            promptText: `You are a senior [technology] developer mentoring a developer who is new to this stack.

ROLE: Review my beginner project code and give me mentor-level feedback.

MY PROJECT: [describe what you built in 1–2 sentences]
MY CODE:
[paste your full project code or the most important files]

EXPECTED OUTPUT:
1. What I got right — things that show I'm thinking correctly about this technology.
2. What I got wrong or could improve — ranked by importance, with specific fixes.
3. What would make a senior [technology] dev wince — idioms or anti-patterns specific to this tech I should unlearn.
4. The single most important concept I clearly don't fully understand yet, and how to fix that gap.
5. What I should build next to reach the next level.`,
          },
        ],
      },

      /* 5 — Writing tests */
      {
        keywords: ["test","testing","unit test","integration","coverage","jest","pytest","spec","qa","tdd"],
        title: "AI-Assisted Test Writing Workflow",
        summary: "Claude maps edge cases → Copilot writes boilerplate → Prompt 2 generates full suite → Postman AI tests API.",
        tools: ["Claude","GitHub Copilot","Jest / Pytest","Postman AI"],
        steps: [
          "STEP 1 — Map edge cases: Before writing a single test, paste your function into Claude with Prompt 1. Get a complete map of every scenario you need to cover.",
          "STEP 2 — Generate test suite: Use Prompt 2 in Claude to generate the full test file. Copy the output directly into your project.",
          "STEP 3 — Copilot fills gaps: Open the generated test file in your editor. Use Copilot to autocomplete any test boilerplate and repetitive assertion patterns.",
          "STEP 4 — API testing: If your code includes API endpoints, open Postman (postman.com). Use Postman's AI assistant to auto-generate an API test suite from your endpoint documentation.",
          "STEP 5 — Coverage review: Paste your completed test suite back into Claude with Prompt 3 to find any remaining gaps before shipping.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Before writing any tests, paste your function here. Claude will map every scenario — use this list as your testing checklist.",
            promptText: `You are a senior QA engineer and software architect.

ROLE: Analyse this function and map every scenario I need to test before I write a single line of tests.

FUNCTION TO TEST:
[paste your function here]

LANGUAGE / TEST FRAMEWORK: [e.g. TypeScript + Jest / Python + Pytest]

EXPECTED OUTPUT:
1. Happy path scenarios (all the inputs that should work correctly) — list each one.
2. Edge cases — unexpected or boundary inputs that could cause failures.
3. Error states — every way this function can or should throw/return an error.
4. Integration concerns — if this function calls a DB, API, or other service, what mock scenarios do I need?
5. A final checklist I can tick off as I write each test, numbered for easy reference.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "In the same Claude chat, use this prompt to generate the full test file. Paste the output directly into your codebase and run it.",
            promptText: `You are a senior software engineer writing a comprehensive test suite.

ROLE: Write a complete, runnable test file for this function based on the test scenarios we just mapped.

FUNCTION BEING TESTED:
[paste the function again for reference]

TEST FRAMEWORK: [Jest / Pytest / Vitest / etc.]
LANGUAGE: [TypeScript / Python / etc.]

REQUIREMENTS:
- Cover every scenario from the checklist above
- Use descriptive test names that explain what is being tested and what is expected
- Add a short comment above each test group explaining its purpose
- Mock all external dependencies (DB calls, API calls, file system)
- Include setup and teardown where needed

EXPECTED OUTPUT:
The complete, copy-paste-ready test file. Nothing else — just the code.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After writing your tests, paste the full test suite back into Claude with this prompt to find any gaps before you ship.",
            promptText: `You are a senior QA engineer reviewing a test suite before production release.

ROLE: Review this test suite and tell me what is missing or weak.

TEST SUITE:
[paste your complete test file here]

THE FUNCTION BEING TESTED:
[paste the function here]

EXPECTED OUTPUT:
1. A verdict — is this test suite strong enough to catch regressions in production?
2. Scenarios that are missing entirely — with specific test cases I should add.
3. Existing tests that are too weak or that are testing implementation rather than behaviour.
4. Any tests that are duplicates or redundant and can be removed.
5. An estimated code coverage percentage based on the scenarios covered.`,
          },
        ],
      },
    ],
  },

  /* ──────────────────────────────── CONTENT CREATOR ───────────── */
  contentCreator: {
    painPoints: [

      /* 1 — No content ideas */
      {
        keywords: ["idea","topic","what to post","content plan","no idea","inspiration","niche","what should i","stuck"],
        title: "Never Run Out of Content Ideas Workflow",
        summary: "Claude generates 30 ideas → AnswerThePublic validates demand → best 5 expanded into full briefs → Notion calendar built.",
        tools: ["Claude","AnswerThePublic","Exploding Topics","Notion AI"],
        steps: [
          "STEP 1 — Bulk ideation: Open Claude and use Prompt 1 to generate 30 content ideas in one shot. Copy them into a Notion table.",
          "STEP 2 — Validate demand: Go to answerthepublic.com. Search your niche keyword. Download the questions — these are what real people are searching. Cross-reference with your 30 ideas.",
          "STEP 3 — Find trends: Open explodingtopics.com. Set the filter to your niche. Find 2–3 trending topics that nobody in your space is covering yet. Add these to your idea list.",
          "STEP 4 — Pick your top 5 and expand: Select the 5 strongest ideas. Use Prompt 2 in Claude to turn each into a full content brief (hook, structure, talking points, CTA).",
          "STEP 5 — Build the calendar: Open Notion AI. Paste your 5 briefs and use Prompt 3 to get a 30-day publishing calendar with the right content type and timing for each.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Fill in your niche and audience details. Claude will return 30 ideas across 6 different content angles — copy them all into a Notion database.",
            promptText: `You are a world-class content strategist who has grown multiple YouTube channels and social media accounts to 100k+ followers.

ROLE: Generate a bulk content idea list tailored to my niche and audience.

MY NICHE: [e.g. personal finance for millennials / fitness for busy parents / SaaS product tutorials]
MY PLATFORM: [YouTube / Instagram / LinkedIn / TikTok / Blog]
MY AUDIENCE: [describe your target viewer/reader — age, goals, pain points]
MY CONTENT STYLE: [e.g. educational, entertaining, documentary, talking-head]

EXPECTED OUTPUT:
Give me exactly 30 content ideas, organised into 6 groups of 5:
1. Educational (how-to, explainers, tutorials)
2. Entertaining / relatable (stories, reactions, humour)
3. Controversial or opinion-led (hot takes, debates)
4. Trend-based (something timely and culturally relevant)
5. Personal / behind-the-scenes (builds trust and connection)
6. SEO / high-search-volume (topics people actively search for)

For each idea: the title, a 1-sentence description, and the hook in the first 3 seconds.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Take your best idea from the list. Go back to Claude and use this prompt to turn it into a production-ready content brief that you can hand to your editor or follow yourself.",
            promptText: `You are a senior content producer creating a detailed brief for a content creator.

ROLE: Turn this idea into a complete, production-ready content brief.

CONTENT IDEA: [paste the title and 1-sentence description]
PLATFORM: [YouTube / Instagram Reels / TikTok / LinkedIn]
TARGET LENGTH: [e.g. 8-minute video / 60-second short / 1200-word blog]
MY AUDIENCE: [describe your viewer/reader]

EXPECTED OUTPUT:
1. HOOK (first 5 seconds / first sentence): 3 different hook options — curiosity, pain-point, and bold claim styles.
2. OUTLINE: The full structure with timestamps or section headings.
3. KEY TALKING POINTS: 5–7 bullet points with the most important things to cover in each section.
4. STATISTICS OR FACTS: 3 data points I could use to add credibility (describe what to look for, not invented numbers).
5. CALL TO ACTION: The single best CTA for this piece of content.
6. THUMBNAIL / COVER CONCEPT: A visual concept that would make someone stop scrolling.`,
          },
          {
            tool: "Notion AI",
            toolUrl: "https://www.notion.so",
            instruction: "Open Notion. Create a page called 'Content Calendar'. Paste your 5 content briefs and use Notion AI (/AI) with this prompt to build a full publishing schedule.",
            promptText: `You are a content manager building a monthly publishing calendar.

ROLE: Turn these 5 content briefs into a structured 30-day content calendar optimised for consistency and growth.

MY BRIEFS:
[paste your 5 content briefs here]

MY POSTING FREQUENCY GOAL: [e.g. 3x per week]
MY PLATFORM(S): [list all platforms]

EXPECTED OUTPUT:
A 30-day calendar in table format with columns:
- Date
- Platform
- Content title
- Content type (long-form / short / story / post)
- Brief summary (1 sentence)
- Status (To Do)

Space the content strategically — don't post everything in week 1. Mix content types. Note the best days to post on each platform based on typical algorithm patterns.`,
          },
        ],
      },

      /* 2 — Editing takes too long */
      {
        keywords: ["edit","editing","cut","caption","subtitle","video edit","takes too long","post-production","descript"],
        title: "Edit Videos 5x Faster with AI Workflow",
        summary: "Descript removes filler words → Opus Clip creates shorts → Captions.ai adds subtitles → Claude writes descriptions.",
        tools: ["Descript","Opus Clip","Captions.ai","Claude"],
        steps: [
          "STEP 1 — Upload and transcribe: Go to descript.com. Upload your raw footage. Descript auto-transcribes the audio. You now edit the video by editing the text transcript — delete a word, the clip is cut.",
          "STEP 2 — Remove filler words: In Descript, click 'Remove filler words'. It removes every 'um', 'uh', and long pause in one click across the entire video.",
          "STEP 3 — Create shorts automatically: Upload your long video to opus.pro. The AI finds the 5–8 most viral moments, crops them to vertical, and adds captions. Download all clips.",
          "STEP 4 — Styled captions: Import your video into captions.ai for animated, styled subtitles that sync automatically. No manual timing needed.",
          "STEP 5 — Write all metadata: Use Prompt 1 in Claude to write the title, description, tags, and thumbnail copy for every platform in one go.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After your video is edited, open Claude. Use this prompt to generate all the metadata you need for every platform — do it in one shot before you upload anything.",
            promptText: `You are a YouTube SEO expert and social media content strategist.

ROLE: Write all the metadata and copy I need to publish this video across multiple platforms.

MY VIDEO TOPIC: [describe what the video is about in 2–3 sentences]
MY CHANNEL NICHE: [e.g. personal finance / coding tutorials / fitness]
MY PRIMARY PLATFORM: [YouTube / TikTok / Instagram]
TARGET AUDIENCE: [who watches this]

EXPECTED OUTPUT:
1. YOUTUBE TITLE: 3 options — one SEO-optimised, one curiosity-driven, one benefit-led.
2. YOUTUBE DESCRIPTION: A full description (150–200 words) with the keyword in the first 25 words, timestamps placeholder, and a CTA at the end.
3. YOUTUBE TAGS: 15 relevant tags.
4. SHORT-FORM CAPTION (TikTok/Reels): A punchy 3-sentence caption with a hook, value, and CTA. Include 5 relevant hashtags.
5. LINKEDIN POST: A 100-word post sharing the key insight from this video, written for a professional audience.
6. THUMBNAIL HEADLINE: 5 options — bold, clear text that would stop a scroll.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "If you have a video transcript, paste it here. Claude will extract the best short-form clips to look for in Opus Clip, saving you review time.",
            promptText: `You are a viral short-form content producer who specialises in repurposing long videos.

ROLE: Analyse this video transcript and identify the best moments to cut into short-form clips.

TRANSCRIPT:
[paste the full transcript from Descript here — you can copy it from the Descript editor]

MY PLATFORM FOR SHORTS: [TikTok / YouTube Shorts / Instagram Reels]

EXPECTED OUTPUT:
1. The top 5 clip recommendations, each with:
   - Start and end timestamp (approximate based on the transcript)
   - Why this moment is shareable (emotion, value, humour, controversy, surprise)
   - A suggested caption for this clip
2. The single BEST clip that has the highest viral potential — and exactly why.
3. Any moments I should avoid turning into shorts (context-dependent, confusing without the full video).`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Use this prompt to write a script for your next video based on the topic that performed best. This keeps your production pipeline moving without staring at a blank page.",
            promptText: `You are a professional video scriptwriter for [platform] creators.

ROLE: Write a complete video script for my next piece of content.

TOPIC: [describe the topic]
FORMAT: [talking head / voiceover / tutorial / vlog]
TARGET LENGTH: [e.g. 7–10 minutes]
MY TONE: [e.g. casual and funny / educational and authoritative / personal and vulnerable]
MY AUDIENCE: [describe them]

EXPECTED OUTPUT:
1. HOOK SCRIPT (first 30 seconds): Written word-for-word. Must create curiosity or identify a pain point immediately.
2. INTRO (30–60 seconds): Sets up the promise of the video.
3. MAIN CONTENT: Each section written as bullet talking points (not word-for-word — you'll sound natural this way).
4. OUTRO (30 seconds): Recap, CTA, and sign-off — written word-for-word.
5. B-ROLL NOTES: Suggestions for what to show on screen during each section.`,
          },
        ],
      },

      /* 3 — Growing audience */
      {
        keywords: ["grow","audience","followers","subscribers","views","reach","viral","engagement","algorithm","growth"],
        title: "Grow Your Audience Systematically Workflow",
        summary: "SparkToro finds your audience → VidIQ finds keywords → Claude analyses top posts → Metricool schedules at peak times.",
        tools: ["SparkToro","VidIQ","Claude","Metricool"],
        steps: [
          "STEP 1 — Audience intelligence: Go to sparktoro.com. Enter what your audience 'talks about' or 'searches for'. It tells you exactly which websites, podcasts, YouTube channels, and social accounts they follow. Show up there.",
          "STEP 2 — Keyword research: Install VidIQ (vidiq.com) on Chrome. Search your niche on YouTube. VidIQ overlays each video with its search volume, competition score, and why it ranks. Find the low-competition, high-volume keywords.",
          "STEP 3 — Reverse-engineer winners: Find the top 3 performing posts/videos in your niche. Paste them into Claude with Prompt 1 to decode exactly why they worked.",
          "STEP 4 — Apply the formula: Use Prompt 2 in Claude to create your own version of the winning content — same structure, your own original take.",
          "STEP 5 — Schedule at peak time: Set up Metricool (metricool.com). It analyses your audience's timezone and activity to find your optimal posting windows. Schedule everything in advance.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Find the top 3 best-performing posts in your niche (most views, most shares). Paste their titles, descriptions, or transcripts into Claude with this prompt to decode the formula.",
            promptText: `You are a viral content analyst who has studied thousands of top-performing posts across YouTube, TikTok, and Instagram.

ROLE: Reverse-engineer these top-performing pieces of content and extract the reusable formula.

TOP-PERFORMING CONTENT I'VE FOUND:
Post 1: [title, platform, view/like count, brief description or paste the script/caption]
Post 2: [title, platform, view/like count, brief description or paste the script/caption]
Post 3: [title, platform, view/like count, brief description or paste the script/caption]

MY NICHE: [your niche]
MY PLATFORM: [YouTube / TikTok / Instagram / LinkedIn]

EXPECTED OUTPUT:
1. The common structural pattern across all 3 pieces (what they all do in the hook, middle, and end).
2. The emotional triggers used — curiosity, fear, aspiration, belonging, controversy?
3. The specific hook format — what makes the first 3–5 seconds/words impossible to skip.
4. The content format — why THIS format works for this niche and audience.
5. A reusable content template I can apply to my own original ideas.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After extracting the winning formula in Prompt 1, use this prompt to immediately apply it to your next piece of content.",
            promptText: `You are a top-tier content creator helping me produce my next viral piece.

ROLE: Apply the winning content formula to my original idea.

THE WINNING FORMULA (from previous analysis): [paste the template from Prompt 1]
MY ORIGINAL IDEA / TOPIC: [describe your content idea]
MY UNIQUE ANGLE OR PERSPECTIVE: [what do you know, believe, or have experienced that others don't?]
PLATFORM: [YouTube / TikTok / Instagram / LinkedIn]

EXPECTED OUTPUT:
1. A full content outline applying the winning formula to my idea.
2. 3 hook options written for my specific topic.
3. The key differences between my version and the original — what makes mine original and not a copy.
4. A title or headline that combines the proven formula with my unique angle.
5. Predicted reasons why this could underperform — and how to guard against each.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Use this monthly growth audit prompt to review what's working and get a data-driven plan for next month. Run this on the 1st of every month.",
            promptText: `You are a growth strategist specialising in content creator businesses.

ROLE: Audit my last month of content performance and build a growth plan for next month.

LAST MONTH'S STATS:
- Total new followers/subscribers: [number]
- Best performing piece: [title + views/reach]
- Worst performing piece: [title + views/reach]
- Average views per post: [number]
- Posting frequency: [how many times per week]
- Platforms active on: [list]

MY CURRENT FOLLOWER COUNT: [number]
MY 90-DAY GOAL: [e.g. reach 5,000 subscribers]

EXPECTED OUTPUT:
1. Diagnosis — what the data is telling me about what's working and what isn't.
2. The single biggest growth lever I should pull next month.
3. A specific content strategy for next month: how many posts, what types, what topics.
4. One thing I should STOP doing because the data suggests it's not working.
5. The realistic follower growth I should expect next month if I execute this plan.`,
          },
        ],
      },

      /* 4 — Writing scripts */
      {
        keywords: ["script","write","writing","narration","voiceover","outline","copy","draft"],
        title: "Write Viral Scripts in Minutes Workflow",
        summary: "Claude writes 10 hooks → best hook chosen → full script drafted in PSA structure → Hemingway simplifies → Claude polishes.",
        tools: ["Claude","Hemingway Editor","Notion AI","VEED.io"],
        steps: [
          "STEP 1 — Hook first: Open Claude with Prompt 1 to generate 10 different hooks for your topic. Pick the one that makes you most curious to keep reading. Your script starts here.",
          "STEP 2 — Full script draft: Use Prompt 2 in Claude to write the complete script using the Problem-Solution-Action framework. Don't edit yet — just get everything on paper.",
          "STEP 3 — Simplify: Copy the script into hemingwayapp.com. Aim for Grade 6–7 reading level. Rewrite every red-highlighted sentence. Simpler = more watchable.",
          "STEP 4 — Natural speech check: Read the script aloud and record yourself. Anywhere you stumble, the writing is unnatural. Paste those sections into Claude with Prompt 3 to rewrite them conversationally.",
          "STEP 5 — Final check: Upload the final script into VEED.io (veed.io) and use its AI teleprompter to do a practice read while recording. Adjust pacing before your real shoot.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Use this prompt to generate 10 hooks before you write a single word of your script. Your hook determines 80% of your view count.",
            promptText: `You are a viral content strategist who specialises in hooks that stop the scroll.

ROLE: Write 10 different hooks for my video topic. Each hook must use a completely different psychological trigger.

MY TOPIC: [describe what your video is about]
PLATFORM: [YouTube / TikTok / Instagram Reels]
TARGET AUDIENCE: [who is watching]

WRITE ONE HOOK FOR EACH OF THESE 10 STYLES:
1. Curiosity gap ("You won't believe...")
2. Bold/controversial claim
3. Pain-point identification ("If you're struggling with...")
4. Surprising statistic or fact
5. Story opener ("3 years ago I...")
6. Direct question to the viewer
7. Counterintuitive statement (the opposite of what most people believe)
8. The promise of a specific outcome ("By the end of this video you'll...")
9. Trend or urgency ("Everyone is doing X wrong...")
10. Challenge or call-out ("Most [your audience] will never do this...")

For each hook: write the exact words for the first 5–10 seconds. Make me feel something immediately.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Take your chosen hook and go back to Claude. Use this prompt to write the full script. Paste the output into Notion or Google Docs for editing.",
            promptText: `You are a professional scriptwriter for [platform] video content.

ROLE: Write a complete video script using my chosen hook and the Problem-Solution-Action framework.

MY CHOSEN HOOK: [paste the hook you selected]
MY TOPIC: [describe the video]
TARGET LENGTH: [e.g. 8 minutes / 60 seconds]
MY TONE: [casual / authoritative / storytelling / educational]
KEY POINTS I MUST COVER: [list the 3–5 main things you want the viewer to learn or feel]

SCRIPT STRUCTURE TO USE:
- HOOK (0–5 seconds): [my chosen hook]
- PROBLEM (5–60 seconds): Agitate the viewer's pain — make them feel understood
- BRIDGE (briefly): Introduce myself and the promise of this video
- SOLUTION (bulk of video): The actual content, broken into clear steps or sections
- ACTION (final 30 seconds): Tell them exactly what to do next — specific CTA

EXPECTED OUTPUT:
The full script, written conversationally as if being spoken — not read. Use short sentences. Natural pauses. Write [PAUSE] where I should breathe. Write [B-ROLL: description] where I should show something on screen.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After your Hemingway edit and read-aloud test, paste any sections that sounded unnatural into Claude with this prompt to make them sound like real speech.",
            promptText: `You are a dialogue coach and scriptwriter who specialises in making written content sound natural when spoken aloud.

ROLE: Rewrite these script sections so they sound like natural, confident speech — not written text being read.

SECTIONS THAT SOUND UNNATURAL:
[paste the lines or paragraphs that you stumbled over when reading aloud]

MY SPEAKING STYLE: [e.g. casual and conversational / professional but warm / high-energy and punchy]
PLATFORM: [YouTube / TikTok / podcast]

EXPECTED OUTPUT:
For each section:
1. The rewritten version optimised for spoken delivery.
2. Any words or phrases replaced because they read well but sound awkward when spoken.
3. Suggested pacing notes — where to slow down, speed up, or pause for effect.

Rules to follow:
- Sentences max 15 words
- No passive voice
- No formal connectors like "therefore", "furthermore", "in conclusion"
- Write contractions (don't, can't, it's) — they sound natural`,
          },
        ],
      },

      /* 5 — Repurposing */
      {
        keywords: ["repurpose","reuse","multi-platform","linkedin","twitter","instagram","tiktok","shorts","clip","distribute"],
        title: "Repurpose One Piece of Content Everywhere Workflow",
        summary: "Long-form recorded → Opus Clip cuts shorts → Claude converts to text formats → Canva AI designs visuals → Repurpose.io automates.",
        tools: ["Opus Clip","Claude","Repurpose.io","Canva AI"],
        steps: [
          "STEP 1 — Create the pillar: Record or write one long-form piece of content (10–30 min video, podcast episode, or 1500-word article). This is your content engine for the next 2 weeks.",
          "STEP 2 — Cut shorts: Upload the long video to opus.pro. It automatically finds the best 60-second moments, crops to vertical, adds captions. Download all clips.",
          "STEP 3 — Convert to text formats: Copy the transcript and use Prompt 1 in Claude to instantly generate a LinkedIn post, Twitter/X thread, and Instagram caption.",
          "STEP 4 — Create visuals: Go to canva.com and use Canva's AI features to generate quote graphics and cover images from your key insights. Use your brand colours and fonts.",
          "STEP 5 — Automate distribution: Set up repurpose.io. Connect your YouTube/podcast to it. Every time you upload a long video, it automatically posts clips to TikTok, Instagram, LinkedIn, and YouTube Shorts.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Copy the transcript from your video (use Descript or YouTube's auto-transcript). Paste it into Claude with this prompt to generate all your text-based content at once.",
            promptText: `You are a multi-platform content strategist who specialises in repurposing long-form content.

ROLE: Turn this video/podcast transcript into platform-native posts for every major text-based platform.

TRANSCRIPT:
[paste the full transcript here]

MY BRAND VOICE: [e.g. casual and direct / professional and thoughtful / energetic and motivational]
MY NICHE: [your content niche]

EXPECTED OUTPUT — create all of the following:

1. LINKEDIN POST (150–200 words):
   - Hook in the first line (no "I'm excited to share" openers)
   - Main insight from the content
   - Personal perspective or opinion
   - CTA at the end
   - 3 relevant hashtags

2. TWITTER/X THREAD (8–10 tweets):
   - Tweet 1: The hook — bold claim or surprising insight
   - Tweets 2–8: One key point per tweet, max 280 characters
   - Tweet 9: Summary and CTA
   - Label each tweet: [Tweet 1], [Tweet 2], etc.

3. INSTAGRAM CAPTION (100–150 words):
   - Hook in line 1
   - Value-packed body
   - CTA before the hashtag break
   - "---" separator then 10 relevant hashtags

4. NEWSLETTER INTRO (100 words): A teaser that makes subscribers want to watch/listen to the full piece.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Use this prompt to extract the most quotable moments from your content. These become standalone posts, carousel slides, and graphics.",
            promptText: `You are a content editor specialising in extracting high-impact quotes and insights.

ROLE: Extract the most shareable, quotable moments from this content and format them as standalone social posts.

TRANSCRIPT OR ARTICLE:
[paste your content here]

PLATFORM I'M CREATING FOR: [Instagram carousels / Twitter/X / LinkedIn / all]

EXPECTED OUTPUT:
1. The top 7 most quotable lines or insights from this content — extracted verbatim or slightly cleaned up.
2. For each quote:
   - The quote itself, formatted cleanly
   - A 1–2 sentence context caption to pair with it as a standalone post
   - Which platform this quote works best on and why
   - A suggested visual concept (e.g. bold text on dark background, photo of me, simple graphic)
3. The single quote with the highest standalone viral potential — and exactly why.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Use this prompt once a month to audit your repurposing system and find what to double down on.",
            promptText: `You are a content strategist reviewing a creator's multi-platform distribution system.

ROLE: Audit my content repurposing results and tell me where to focus next month.

MY ORIGINAL CONTENT VOLUME LAST MONTH: [e.g. 4 long-form videos]
REPURPOSED CONTENT CREATED: [e.g. 12 short clips, 8 LinkedIn posts, 4 Twitter threads]
BEST PERFORMING REPURPOSED PIECE: [describe it + stats]
WORST PERFORMING REPURPOSED PIECE: [describe it + stats]
PLATFORMS I'M ACTIVE ON: [list them]

EXPECTED OUTPUT:
1. Which platform is giving me the best ROI per piece of content repurposed?
2. What type of repurposed content (clips / text posts / graphics) is performing best?
3. What should I do more of next month based purely on the data?
4. What should I cut or reduce?
5. One repurposing format I haven't tried yet that would likely work for my niche.`,
          },
        ],
      },
    ],
  },

  /* ──────────────────────────────── MARKETING ─────────────────── */
  marketing: {
    painPoints: [
      {
        keywords: ["ad","copy","ads","facebook ad","google ad","headline","creative","paid","ppc","meta","campaign"],
        title: "Write High-Converting Ad Copy Workflow",
        summary: "Meta Ads Library for research → Claude writes 5 ad variations → AdCreative.ai generates visuals → A/B test → Claude iterates.",
        tools: ["Claude","AdCreative.ai","Meta Ads Library","Foreplay.co"],
        steps: [
          "STEP 1 — Research what's already working: Go to facebook.com/ads/library. Search your competitor's brand name. Filter to active ads. The ads that have been running longest are making money — study their structure.",
          "STEP 2 — Build a swipe file: Go to foreplay.co. Save the best ads you find. Tag them by angle (pain, benefit, social proof, fear, etc.).",
          "STEP 3 — Write variations: Open Claude with Prompt 1. Generate 5 ad variations, each using a different persuasion angle. Copy them all — you'll test which wins.",
          "STEP 4 — Generate visuals: Go to adcreative.ai. Input your copy and brand assets. The AI generates ad images and scores each one for predicted performance. Use the highest-scoring creative.",
          "STEP 5 — Iterate from data: After 3–5 days of running ads, paste your performance data into Claude with Prompt 3 to get the next iteration brief.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Fill in your product, audience, and the competitor ad hooks you found in Meta Ads Library. Claude will write 5 ad copy variations ready to upload.",
            promptText: `You are a direct-response copywriter and paid social specialist with a track record of writing ads that generate 3–5x ROAS.

ROLE: Write 5 Facebook/Instagram ad variations for my product. Each must use a completely different persuasion angle.

PRODUCT / SERVICE: [describe what you're selling]
TARGET AUDIENCE: [detailed description — demographics, interests, pain points, desires]
PRICE POINT: [e.g. $97 one-time / $29/month]
THE CORE TRANSFORMATION: [what does the customer's life look like after buying?]
COMPETITOR HOOKS I'VE SEEN WORKING: [describe 1–2 ads you found in Meta Ads Library]

WRITE ONE AD FOR EACH ANGLE:
1. PAIN-POINT AD: Lead with the specific frustration the audience feels
2. BENEFIT-LED AD: Lead with the outcome/transformation they'll get
3. SOCIAL PROOF AD: Lead with a result, review, or number (use placeholder [RESULT] if needed)
4. CURIOSITY/PATTERN-INTERRUPT AD: Start with something unexpected that stops the scroll
5. FEAR-OF-MISSING-OUT AD: Create urgency around a limited outcome or window

For each ad:
- Primary text (125 words max)
- Headline (40 characters max)
- Description (25 characters max)
- Suggested visual concept`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After writing your ads, use this prompt to stress-test each one before spending money on them.",
            promptText: `You are a conversion rate optimisation expert and direct-response critic.

ROLE: Ruthlessly critique these 5 ad variations before I spend money testing them.

MY 5 AD VARIATIONS:
[paste all 5 ads here]

MY TARGET AUDIENCE: [describe them]
MY PRODUCT: [describe it]

EXPECTED OUTPUT — for each ad:
1. Likelihood of success (High / Medium / Low) and why.
2. The weakest line — the line most likely to cause a scroll-past.
3. The strongest line — what is working that I should preserve.
4. One specific rewrite of the weakest line.
5. Which audience segment this ad will resonate with most.

Then overall:
6. Which of the 5 I should run first and why.
7. Which I should cut entirely before testing.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After your ads have been running 3–5 days, export your performance data from Meta Ads Manager. Paste it into Claude with this prompt to get your next iteration.",
            promptText: `You are a performance marketing analyst specialising in paid social optimisation.

ROLE: Analyse my ad performance data and tell me exactly what to do next.

AD PERFORMANCE DATA:
[paste your data — include: ad name, impressions, CTR, CPC, CPM, ROAS or CPA, spend for each ad]

CAMPAIGN OBJECTIVE: [traffic / conversions / leads]
MY TARGET CPA/ROAS: [what does a good result look like for you?]

EXPECTED OUTPUT:
1. Which ads to keep running and scale (increase budget by how much?).
2. Which ads to pause immediately and why.
3. The single biggest insight from this data — what is it telling me about my audience?
4. What to test next: write a new ad variation based on what the data suggests is resonating.
5. Any targeting or bidding adjustments I should make.`,
          },
        ],
      },
      {
        keywords: ["email","newsletter","campaign","sequence","drip","open rate","subject line","klaviyo","mailchimp","email marketing"],
        title: "Build Email Campaigns That Convert Workflow",
        summary: "Claude maps the sequence → writes each email with AIDA → Klaviyo segments → subject lines A/B tested → performance analysed.",
        tools: ["Claude","Klaviyo","Beehiiv","Smartlead"],
        steps: [
          "STEP 1 — Map the sequence: Open Claude with Prompt 1 to design the full email sequence architecture before writing a single word.",
          "STEP 2 — Write each email: Use Prompt 2 for each individual email. The prompt forces Claude to use the AIDA framework and write in your brand voice.",
          "STEP 3 — Subject line variants: For every email, generate 10 subject line options and pick the best 2 to A/B test in Klaviyo.",
          "STEP 4 — Segment and send: In Klaviyo (klaviyo.com), set up the automation flow. Use Klaviyo's built-in AI segmentation to send each email to the right audience segment based on behaviour.",
          "STEP 5 — Analyse and iterate: After 7 days, export your sequence stats. Use Prompt 3 in Claude to diagnose performance and get rewrite suggestions for underperforming emails.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Use this prompt BEFORE writing any emails. Get the full sequence architecture mapped out so every email has a clear purpose and logical flow.",
            promptText: `You are an email marketing strategist who has built welcome sequences with 40%+ open rates and 8%+ conversion rates.

ROLE: Design a complete email sequence architecture for my product.

MY PRODUCT / SERVICE: [describe what you sell]
NEW SUBSCRIBER SOURCE: [e.g. lead magnet download / free trial signup / webinar registration]
THE SUBSCRIBER'S PROBLEM: [what pain brought them here?]
MY GOAL FOR THIS SEQUENCE: [e.g. convert to paid plan / book a sales call / buy a $97 course]
SEQUENCE LENGTH: [e.g. 7 emails over 14 days]

EXPECTED OUTPUT:
A complete sequence map in table format:
| Email # | Send timing | Subject line theme | Goal of this email | AIDA stage |

Then for each email:
- The emotional job of this email (what should the reader feel after reading it?)
- The one action it should drive
- The key objection it should overcome
- One sentence describing the offer or CTA (if applicable)

End with: the 2 emails most likely to have high unsubscribes if written poorly — and how to avoid that.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Take one email from your sequence map. Use this prompt to write the full email. Repeat for each email in the sequence.",
            promptText: `You are a direct-response email copywriter with a specialty in SaaS and info-product sequences.

ROLE: Write a complete email for my sequence.

EMAIL NUMBER IN SEQUENCE: [e.g. Email 3 of 7]
EMAIL GOAL: [e.g. overcome the objection that it takes too long to set up]
AIDA STAGE: [Attention / Interest / Desire / Action]
SUBSCRIBER'S LIKELY MINDSET AT THIS POINT: [e.g. interested but hesitant / haven't used the product yet]

MY PRODUCT: [describe it]
MY BRAND VOICE: [casual / professional / direct / warm]

WRITE:
1. SUBJECT LINE: 5 options (mix curiosity, benefit, question, and personalisation styles)
2. PREVIEW TEXT: 3 options to pair with each subject line style
3. EMAIL BODY (250–350 words):
   - Opening line: must not start with "I" or a compliment to the reader
   - Body: builds desire using a story, proof, or insight
   - Transition to offer: natural, not jarring
   - CTA: one clear link/button, described as text
4. P.S. LINE: A second CTA or a curiosity-building statement`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After your sequence has run for 7–14 days, export your stats from Klaviyo. Paste them here to get a diagnosis and specific rewrites for underperforming emails.",
            promptText: `You are an email marketing performance analyst.

ROLE: Analyse my email sequence performance and give me specific fixes.

SEQUENCE PERFORMANCE DATA:
[paste each email's: subject line / open rate / click rate / unsubscribe rate]

INDUSTRY BENCHMARK: [e.g. SaaS: 22% open, 3% CTR / eCommerce: 18% open, 2.5% CTR — or just say your industry]
MY CONVERSION GOAL: [what action am I trying to drive at the end of the sequence?]

EXPECTED OUTPUT:
1. Which emails are performing above benchmark — what are they doing right?
2. Which emails are underperforming — diagnosis for each (subject line, content, timing, or CTA issue?).
3. For the worst-performing email: rewrite the subject line (5 new options) and the opening 3 sentences.
4. If any email has a high unsubscribe rate: what is likely causing it and how do I fix it?
5. One structural change to the sequence (e.g. move email 4 to day 2, split email 6 into two) that would improve overall conversion.`,
          },
        ],
      },
      {
        keywords: ["social media","post","instagram","linkedin","content calendar","social","organic","posting"],
        title: "Social Media Content at Scale Workflow",
        summary: "Claude builds 30-day calendar → batch-writes all posts → Canva AI creates visuals → Buffer schedules → weekly performance review.",
        tools: ["Claude","Buffer","Canva AI","Metricool"],
        steps: [
          "STEP 1 — Strategy first: Use Prompt 1 in Claude to build a 30-day content calendar with clear post types, topics, and goals for each day — before writing a single post.",
          "STEP 2 — Batch write: Set aside 2 hours. Use Prompt 2 in Claude to write all posts for the week in one session. Batch creation is 3x faster than writing one at a time.",
          "STEP 3 — Create visuals: Open canva.com. Use Magic Design (Canva's AI) to generate on-brand templates for each post type. Create a week of visuals in under an hour.",
          "STEP 4 — Schedule everything: Log into buffer.com or metricool.com. Upload posts and visuals. Set optimal posting times (both tools suggest best times based on your audience data).",
          "STEP 5 — Weekly review: Every Monday, check last week's performance. Use Prompt 3 in Claude to analyse what worked and what to adjust.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Use this prompt to build your full 30-day content strategy before writing a single post. This is your editorial plan.",
            promptText: `You are a social media strategist who builds content systems for B2B and B2C brands.

ROLE: Build a 30-day social media content calendar for my brand.

MY BRAND: [describe your business]
PLATFORM(S): [Instagram / LinkedIn / TikTok / Twitter/X — specify all]
TARGET AUDIENCE: [who follows you — job title, interests, pain points]
BRAND VOICE: [e.g. educational and direct / warm and personal / bold and opinionated]
CONTENT GOAL: [brand awareness / lead generation / sales / community building]
POSTING FREQUENCY: [e.g. 5x per week on LinkedIn, 3x on Instagram]

EXPECTED OUTPUT:
A 30-day content calendar table with:
| Day | Date | Platform | Post Type | Topic | Goal | Hook (1 sentence) |

Post types to mix:
- Educational (how-to, tips, frameworks)
- Social proof (results, testimonials, case studies)
- Personal / behind-the-scenes (builds trust)
- Engagement (polls, questions, controversies)
- Promotional (offer, product, CTA) — max 20% of posts

End with: 3 content pillars that all 30 posts should connect back to.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Take 5 posts from your calendar. Use this prompt to batch-write all 5 in one Claude session. Repeat weekly.",
            promptText: `You are a social media copywriter who writes scroll-stopping posts for [platform].

ROLE: Write 5 complete social media posts from my content calendar.

MY BRAND VOICE: [e.g. direct, educational, occasionally humorous — never corporate]
PLATFORM: [LinkedIn / Instagram / Twitter/X]
MY AUDIENCE: [describe them]

MY 5 POSTS TO WRITE:
1. [topic + post type from your calendar]
2. [topic + post type from your calendar]
3. [topic + post type from your calendar]
4. [topic + post type from your calendar]
5. [topic + post type from your calendar]

FOR EACH POST WRITE:
- The complete post text (platform-appropriate length)
- First line: must be a hook that stops the scroll without clickbait
- A clear CTA or engagement trigger at the end
- 3–5 relevant hashtags (LinkedIn) OR 5–8 hashtags (Instagram) OR no hashtags (Twitter/X)

Label each clearly: [POST 1], [POST 2], etc.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Every Monday morning, export last week's post stats from Buffer or native platform analytics. Paste them into Claude with this prompt.",
            promptText: `You are a social media analyst reviewing weekly content performance.

ROLE: Analyse last week's social media performance and tell me what to adjust this week.

LAST WEEK'S POST PERFORMANCE:
[paste each post: topic / post type / impressions / likes / comments / shares / link clicks]

PLATFORM(S): [list]
LAST WEEK'S GOAL: [brand awareness / lead gen / engagement]

EXPECTED OUTPUT:
1. Best performing post — what made it work (hook, format, topic, timing)?
2. Worst performing post — what likely caused it to underperform?
3. One content type I should post MORE of this week based on the data.
4. One content type I should post LESS of.
5. A suggested adjustment to my posting strategy for this week (timing, format, or topic shift).
6. The single most important learning from this week's data in one sentence.`,
          },
        ],
      },
      {
        keywords: ["competitor","research","market research","analysis","competitor analysis","spy","benchmark","landscape"],
        title: "Competitor Research & Positioning Workflow",
        summary: "Claude maps the landscape → Semrush finds keyword gaps → Claude builds positioning → battle card created → Crayon monitors changes.",
        tools: ["Claude","Semrush","Similarweb","Perplexity AI","Crayon"],
        steps: [
          "STEP 1 — Map the landscape: Open Claude with Prompt 1. Feed it your top 5 competitors and get a structured competitive analysis covering messaging, positioning, and gaps.",
          "STEP 2 — Find keyword opportunities: Go to semrush.com. Use the 'Keyword Gap' tool. Enter your domain and your top 3 competitors. Export keywords they rank for that you don't — these are your traffic opportunities.",
          "STEP 3 — Traffic source intelligence: Go to similarweb.com. Enter each competitor's domain. See exactly where their traffic comes from (SEO, paid, social, direct). Copy the channels driving the most growth.",
          "STEP 4 — Define your positioning: Use Prompt 2 in Claude to identify the white space in the market — what no competitor is credibly owning that you could.",
          "STEP 5 — Monitor changes: Set up crayon.co (or use a free Google Alerts alternative). Get notified whenever a competitor changes their pricing, messaging, or launches a new feature.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Gather your competitors' website homepages, taglines, and key messages before using this prompt. The more detail you give, the sharper the analysis.",
            promptText: `You are a brand strategist and competitive intelligence analyst.

ROLE: Analyse my competitive landscape and identify strategic opportunities.

MY PRODUCT / SERVICE: [describe yours]
MY TARGET CUSTOMER: [who do you sell to]

MY TOP 5 COMPETITORS:
1. [Competitor name] — [their tagline or key message] — [their apparent target customer] — [their pricing if known]
2. [repeat]
3. [repeat]
4. [repeat]
5. [repeat]

EXPECTED OUTPUT:
1. Competitive positioning map — how each competitor is positioned on the axes of [price vs value] and [feature depth vs ease of use].
2. The messaging angle each competitor owns (e.g. Competitor A owns "fastest", Competitor B owns "most affordable").
3. The 3 biggest gaps in the market — positioning territories no competitor is credibly occupying.
4. The customer segment that is most underserved by the current competitive landscape.
5. The 3 strongest competitors to watch and why they're the biggest threat.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After the competitive analysis, use this prompt to turn the gaps into a concrete positioning strategy for your brand.",
            promptText: `You are a brand positioning strategist helping a company stand out in a crowded market.

ROLE: Define my brand's unique market position based on the competitive landscape analysis.

COMPETITIVE GAPS IDENTIFIED: [paste the gaps from Prompt 1]
MY PRODUCT'S ACTUAL STRENGTHS: [what do you genuinely do better than competitors?]
MY TARGET CUSTOMER'S DEEPEST DESIRE: [what do they ultimately want — not just what they say they want]
MY BRAND'S NON-NEGOTIABLE VALUES: [e.g. simplicity, speed, transparency]

EXPECTED OUTPUT:
1. My recommended positioning statement: "[Brand] is the [category] for [audience] who [specific situation], unlike [competitors] who [their approach], we [your differentiator]."
2. The single word or phrase my brand should own in the customer's mind.
3. The messaging hierarchy: primary message → supporting messages → proof points.
4. What I should STOP saying (messages that are crowded or unbelievable given the competition).
5. 3 headline options for my homepage that embody this positioning.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Use this prompt to create a competitor battle card for your sales team. Update it quarterly.",
            promptText: `You are a sales enablement strategist creating competitive intelligence for a sales team.

ROLE: Write a sales battle card for when we compete against this specific competitor.

OUR PRODUCT: [describe it]
COMPETITOR: [name and describe their product]
OUR KEY ADVANTAGES OVER THEM: [list what we do better]
THEIR KEY ADVANTAGES OVER US: [be honest — list where they beat us]
TYPICAL CUSTOMER OBJECTION: "[Competitor] does the same thing for less" — or describe the real objection you hear

EXPECTED OUTPUT:
1. ONE PARAGRAPH OVERVIEW of the competitor: what they are, who they target, their pitch.
2. HEAD-TO-HEAD COMPARISON TABLE: 10 dimensions, scored honestly (Win / Lose / Tie per dimension).
3. OUR BEST RESPONSES to the top 3 objections comparing us to this competitor.
4. THE LANDMINES: questions our reps should ask to surface problems the competitor has.
5. WHEN WE WIN and WHEN WE LOSE: clear criteria for which deals we should and shouldn't pursue.`,
          },
        ],
      },
      {
        keywords: ["analytics","data","report","roi","metrics","performance","dashboard","kpi","results","attribution"],
        title: "Turn Campaign Data into Insights Workflow",
        summary: "Data exported → Claude extracts insights → Looker Studio visualises → Claude writes executive narrative → budget reallocation planned.",
        tools: ["Claude","Google Analytics 4","Looker Studio","ChatGPT with Code Interpreter"],
        steps: [
          "STEP 1 — Export raw data: Pull your campaign data from each platform (Meta Ads Manager, Google Ads, GA4) as CSV files.",
          "STEP 2 — AI analysis: Upload the CSV to ChatGPT with Code Interpreter (chat.openai.com — requires Plus). It can read spreadsheets, run calculations, and visualise data. Use Prompt 1.",
          "STEP 3 — Build live dashboard: Go to lookerstudio.google.com. Connect your data sources (GA4, Google Ads, etc.). Build a dashboard that updates automatically — no more monthly manual reports.",
          "STEP 4 — Write the narrative: Copy your key metrics and paste into Claude with Prompt 2 to generate a CMO-ready executive summary in minutes.",
          "STEP 5 — Budget allocation: Use Prompt 3 in Claude to get a data-driven budget reallocation recommendation for next month.",
        ],
        prompts: [
          {
            tool: "ChatGPT (Code Interpreter)",
            toolUrl: "https://chat.openai.com",
            instruction: "Go to chat.openai.com (requires ChatGPT Plus). Start a new chat. Upload your CSV data file. Then type this prompt. ChatGPT will analyse the data and generate visualisations.",
            promptText: `You are a data analyst specialising in marketing performance analysis.

ROLE: Analyse this marketing campaign data and extract the key insights I need to act on.

[Upload your CSV file first, then type:]

CAMPAIGN CONTEXT:
- Campaign objective: [traffic / conversions / brand awareness / leads]
- Time period: [e.g. January 2024]
- Total budget spent: [$X]
- Target CPA or ROAS: [your goal]

EXPECTED OUTPUT:
1. Run a full analysis of the data. Show me the key summary statistics.
2. Visualise: spend vs performance (ROAS or CPA) per channel/campaign in a bar chart.
3. Identify the top 3 performing campaigns/ad sets and what they have in common.
4. Identify the bottom 3 performing campaigns/ad sets and what is causing poor performance.
5. Calculate: if I had reallocated the budget from the bottom 3 to the top 3, what would my total ROAS/CPA have been?
6. List the top 3 actions I should take based on this data.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Copy your key monthly metrics and paste into Claude with this prompt. Use the output as your monthly marketing report — ready to send to leadership in minutes.",
            promptText: `You are a CMO writing a monthly marketing performance report for the executive team.

ROLE: Turn these raw metrics into a compelling, insight-driven executive summary.

THIS MONTH'S METRICS:
[paste all your key metrics: channels, spend, impressions, clicks, conversions, revenue, ROAS, CPA, etc.]

LAST MONTH'S METRICS (for comparison):
[paste last month's same metrics, or write "not available"]

BUSINESS CONTEXT: [any major factors this month — product launch, seasonality, budget changes, etc.]

EXPECTED OUTPUT:
Write a 400-word executive summary structured as:
1. HEADLINE: The single most important thing that happened this month (positive or negative).
2. PERFORMANCE OVERVIEW: How we performed vs last month and vs target — in plain English, not just numbers.
3. WHAT WORKED: Top 2–3 wins and why they matter for the business.
4. WHAT DIDN'T WORK: Top 1–2 underperformers and the honest diagnosis.
5. NEXT MONTH'S PLAN: 3 specific actions we're taking based on this month's data.

Write in a confident, direct tone. No marketing fluff. Executives want clarity and action.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Use this prompt at the end of each month to get a data-driven budget recommendation. Replace the guesswork with clear logic.",
            promptText: `You are a performance marketing strategist advising on budget allocation.

ROLE: Recommend how I should allocate my marketing budget next month based on this month's results.

THIS MONTH'S CHANNEL PERFORMANCE:
[for each channel, provide: channel name / budget spent / revenue or leads generated / ROAS or CPA]

TOTAL BUDGET FOR NEXT MONTH: [$X]
BUSINESS PRIORITY NEXT MONTH: [e.g. maximise revenue / grow email list / launch new product]
CONSTRAINTS: [any channels I must keep regardless of performance? Any I want to test?]

EXPECTED OUTPUT:
1. Recommended budget allocation per channel for next month (specific dollar amounts).
2. The reasoning behind each allocation decision.
3. Which channel(s) I should scale and by how much.
4. Which channel(s) I should cut or reduce and why.
5. If there's a new channel I should test, which one and with what budget?
6. The expected outcome (revenue / leads / ROAS) if I follow this allocation.`,
          },
        ],
      },
    ],
  },

  /* ──────────────────────────────── STUDENT ───────────────────── */
  student: {
    painPoints: [
      {
        keywords: ["understand","confused","explain","concept","topic","hard","difficult","don't get","what is","how does","learn"],
        title: "Master Any Concept Faster Workflow",
        summary: "Claude explains with analogies → Feynman method tests understanding → NotebookLM organises notes → Claude generates practice questions.",
        tools: ["Claude","Perplexity AI","NotebookLM","Khan Academy"],
        steps: [
          "STEP 1 — Get a personalised explanation: Open Claude with Prompt 1. Get an explanation tailored to your current knowledge level, using analogies from things you already understand.",
          "STEP 2 — Deepen with current resources: Go to perplexity.ai. Search '[concept] explained simply'. It surfaces up-to-date articles, videos, and diagrams with citations.",
          "STEP 3 — Organise your notes: Upload your lecture slides and notes to notebooklm.google.com. Ask it 'Summarise the key points from these notes in plain English' and 'What are the most confusing parts?'",
          "STEP 4 — Test with Feynman method: In Claude, use Prompt 2. You explain the concept back in your own words. Claude tells you exactly what's wrong or missing in your understanding.",
          "STEP 5 — Practice questions: Use Prompt 3 in Claude to generate exam-style questions. Answer without notes, then compare your answers to Claude's model answers.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Fill in the concept you're struggling with and what you already know. Claude will build a personalised explanation that connects to your existing knowledge.",
            promptText: `You are a world-class tutor who specialises in making complex concepts click for students.

ROLE: Explain this concept to me in a way that is impossible not to understand.

CONCEPT I'M STRUGGLING WITH: [e.g. photosynthesis / supply and demand / recursion / the French Revolution]
MY CURRENT LEVEL: [e.g. A-level student / first-year university / complete beginner]
WHAT I ALREADY UNDERSTAND ABOUT THIS: [describe what you know — even if it's just a vague idea]
SUBJECT: [Biology / Economics / Computer Science / History / etc.]

EXPECTED OUTPUT:
1. The core idea in ONE sentence — the simplest possible version of the truth.
2. A real-world analogy that maps directly onto something I experience in daily life.
3. The concept explained step-by-step, building from the simplest layer to the complete picture.
4. The #1 misconception students have about this topic — and the correct understanding.
5. A visual mental model I can hold in my head during an exam.
6. Three things this concept connects to that I've probably already studied.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After reading and watching resources, come back to Claude. Type your explanation of the concept in your OWN words. Claude will diagnose your understanding — this is the Feynman Method.",
            promptText: `You are a strict but encouraging tutor using the Feynman Technique to test a student's understanding.

ROLE: I'm going to explain [concept] back to you in my own words. Identify exactly where my understanding is correct, incomplete, or wrong.

THE CONCEPT: [concept name]
MY EXPLANATION:
[write your understanding of the concept in your own words — as if explaining it to a younger student]

EXPECTED OUTPUT:
1. What I got RIGHT — be specific about which parts show genuine understanding.
2. What I got WRONG — identify specific misconceptions and correct them clearly.
3. What I LEFT OUT — the important parts of the concept I didn't mention.
4. A score out of 10 for my understanding, with justification.
5. The ONE thing I most need to re-study before an exam.
6. A revised, corrected version of my explanation — showing me what a perfect answer looks like.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Use this prompt to generate practice questions. Close your notes, answer from memory, then paste your answers back to Claude for marking.",
            promptText: `You are an experienced examiner writing practice questions for students.

ROLE: Generate exam-style practice questions on this topic, then mark my answers.

TOPIC: [concept or subject area]
MY EXAM BOARD / COURSE: [e.g. AQA A-Level Biology / AP US History / University of Edinburgh Year 1 Economics]
QUESTION TYPES IN MY ACTUAL EXAM: [e.g. multiple choice + 6-mark essays / problem-solving / short answer]

STEP 1: Generate exactly 8 questions:
- 2 easy (knowledge recall)
- 3 medium (application of the concept)
- 2 hard (analysis or evaluation)
- 1 exam-style extended answer question

STEP 2: Wait for me to answer all 8.

STEP 3: After I send my answers, mark each one:
- Mark awarded / total marks available
- What I got right
- What I missed
- The model answer
- What an examiner would say`,
          },
        ],
      },
      {
        keywords: ["essay","write","writing","assignment","paper","thesis","argument","draft","paragraph","dissertation"],
        title: "Write Top-Grade Essays Efficiently Workflow",
        summary: "Claude builds outline → Perplexity finds sources → Claude drafts sections → Grammarly edits → Claude reviews whole draft.",
        tools: ["Claude","Perplexity AI","Grammarly","Hemingway Editor"],
        steps: [
          "STEP 1 — Build the structure: Open Claude with Prompt 1. Turn your essay question into a full outline with a thesis statement and 3 argument sections before writing a word.",
          "STEP 2 — Find sources: Go to perplexity.ai. Search for academic evidence for each argument. Perplexity cites its sources — use these for your bibliography. Also check consensus.app for peer-reviewed papers.",
          "STEP 3 — Draft by section: Use Prompt 2 in Claude for each body paragraph. Write one section at a time — this is faster and higher quality than attempting the whole essay at once.",
          "STEP 4 — Edit for language: Paste your full draft into grammarly.com for grammar. Then paste into hemingwayapp.com to check readability — aim for Grade 8–10 for university, Grade 6–7 for school.",
          "STEP 5 — Final review: Use Prompt 3 in Claude to review your complete draft for argument strength, structure, and academic style.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Paste your essay question and fill in the subject details. Claude will give you a full outline to work from — this is the most important step, don't skip it.",
            promptText: `You are an academic writing coach and subject matter expert.

ROLE: Turn this essay question into a strong, well-structured outline I can write from.

ESSAY QUESTION: [paste your exact essay question or assignment brief]
SUBJECT / MODULE: [e.g. Modern European History / Organisational Behaviour / Biochemistry]
LEVEL: [GCSE / A-Level / Undergraduate Year 1-2 / Undergraduate Year 3 / Masters]
WORD COUNT: [e.g. 1500 words]
MARKING CRITERIA (if known): [paste or describe what gets high marks]

EXPECTED OUTPUT:
1. THESIS STATEMENT: A clear, arguable one-sentence claim that answers the question directly.
2. INTRODUCTION STRUCTURE: What to include, in what order (2–3 sentences each element).
3. ARGUMENT 1 (with suggested word count):
   - Main claim
   - Evidence needed (type of source, what it should show)
   - Counter-argument to address
4. ARGUMENT 2 (same structure)
5. ARGUMENT 3 (same structure)
6. CONCLUSION STRUCTURE: How to wrap up without repeating yourself.
7. What the examiner is specifically looking for in a top-grade answer for this question.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Take one body paragraph from your outline. Use this prompt to write it. Include your evidence and sources so Claude can incorporate them properly.",
            promptText: `You are an academic writing tutor helping a student write a high-quality essay paragraph.

ROLE: Write one body paragraph for my essay at an appropriate academic level.

MY ESSAY QUESTION: [paste the question]
THIS PARAGRAPH'S MAIN ARGUMENT: [paste from your outline]
EVIDENCE TO INCLUDE: [paste the sources or facts you found — author, year, key quote or finding]
ACADEMIC LEVEL: [GCSE / A-Level / Undergraduate]
SUBJECT STYLE: [Sciences: formal, passive voice / Humanities: analytical, first person allowed / Social Sciences: mixed]

WRITE:
1. TOPIC SENTENCE: States the paragraph's main argument clearly.
2. EXPLANATION: Develops the argument (2–3 sentences).
3. EVIDENCE: Introduces and explains the evidence with proper in-text citation format [Author, Year].
4. ANALYSIS: What does this evidence prove? How does it support the thesis? (This is where marks are made or lost.)
5. LINK: A final sentence connecting this argument to the next or back to the thesis.

Word count for this paragraph: [e.g. 200 words]`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After completing your full draft, paste it into Claude with this prompt. Fix the issues identified before final submission.",
            promptText: `You are a strict academic tutor reviewing an essay draft before submission.

ROLE: Review this essay draft and give me specific, actionable feedback to improve my grade.

MY ESSAY QUESTION: [paste the question]
MY DRAFT:
[paste your complete essay here]

MARKING CRITERIA: [paste if known, or describe what gets top marks in your course]
MY TARGET GRADE: [e.g. A / First / 70%+]

EXPECTED OUTPUT:
1. OVERALL VERDICT: What grade would this currently receive and why?
2. ARGUMENT STRENGTH: Is the thesis clear and arguable? Are the 3 arguments well-supported? Where is the reasoning weak?
3. USE OF EVIDENCE: Is evidence properly cited, relevant, and well-analysed? Where is it missing?
4. STRUCTURE AND FLOW: Does the essay read logically? Where does it lose direction?
5. LANGUAGE AND STYLE: Is the academic tone consistent? Any colloquial or unclear language?
6. THE 3 MOST IMPORTANT FIXES to make before submitting — with specific rewrites where needed.`,
          },
        ],
      },
      {
        keywords: ["exam","revision","revise","study","memorise","flashcard","test prep","gcse","a-level","finals","mock"],
        title: "Exam Revision on Steroids Workflow",
        summary: "NotebookLM creates study guide → Claude generates Anki flashcards → spaced repetition in Anki → Claude mock exam → answers marked.",
        tools: ["Claude","Anki","NotebookLM","Quizlet AI"],
        steps: [
          "STEP 1 — Build your study guide: Upload all lecture notes, past papers, and textbook chapters to notebooklm.google.com. Ask it: 'What are the 20 most important topics from these materials I must know for my exam?'",
          "STEP 2 — Make flashcards: Use Prompt 1 in Claude to convert your notes into Anki flashcard pairs. Import the output into ankiweb.net — the free spaced repetition app.",
          "STEP 3 — Daily Anki sessions: Review your Anki deck for 20–30 minutes daily. The algorithm surfaces cards right before you're about to forget them — this is the most efficient way to memorise.",
          "STEP 4 — Take a mock exam: Use Prompt 2 in Claude to generate a timed mock exam. Set a timer and answer without notes.",
          "STEP 5 — Get marked: Paste your answers into Claude with Prompt 3 for detailed marking with model answers and gap analysis.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Paste your lecture notes or textbook chapter into Claude. Claude will generate flashcard pairs you can import into Anki. The format is: question on one side, answer on the other.",
            promptText: `You are an expert educator creating spaced repetition flashcards for exam revision.

ROLE: Convert these study notes into a set of high-quality Anki flashcard pairs.

MY NOTES:
[paste your notes, lecture slides text, or key passages from a textbook]

SUBJECT: [e.g. A-Level Biology — Cellular Respiration]
EXAM STYLE: [multiple choice / short answer / essay / problem-solving]

RULES FOR GOOD FLASHCARDS:
- Each card tests ONE specific piece of knowledge only
- Questions should be precise and unambiguous
- Answers should be short enough to memorise but complete enough to be useful
- Mix recall types: definition, application, cause-effect, comparison

EXPECTED OUTPUT:
Exactly 25 flashcard pairs in this format:
Q: [question]
A: [answer]

(Separated by a blank line between each card)

Focus on: key terms and definitions, cause-and-effect relationships, processes and sequences, exceptions and edge cases that often appear in exams.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Use this prompt to take a proper mock exam. Set a real timer before you start. Answer every question before checking any answers.",
            promptText: `You are an experienced examiner writing a realistic practice exam.

ROLE: Create a complete mock exam paper for my upcoming exam.

SUBJECT: [e.g. A-Level Chemistry Paper 2 / Intro to Microeconomics]
TOPICS TO COVER: [list the topics or chapters you need to revise]
REAL EXAM DURATION: [e.g. 1 hour 30 minutes]
REAL EXAM FORMAT: [e.g. 20 MCQs + 3 short answer + 1 essay / 5 problem sets]

INSTRUCTIONS:
1. Create a mock exam that exactly mirrors the real exam format.
2. Make the difficulty realistic — not easier than the real thing.
3. Include questions that test application and analysis, not just recall.
4. At the end of the exam, include a mark scheme with: marks available per question and what earns each mark.

IMPORTANT: Show me the questions first. Wait for me to reply with my answers before showing the mark scheme.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After completing the mock exam, paste all your answers into Claude with this prompt. Review the feedback carefully — the gaps Claude identifies are your revision priorities.",
            promptText: `You are a strict examiner marking a student's practice exam answers.

ROLE: Mark my mock exam answers and give me detailed feedback to improve.

THE EXAM QUESTIONS: [paste the questions]
MY ANSWERS: [paste your answers to each question]
MARK SCHEME: [paste the mark scheme from the previous Claude response, or describe what earns marks]

EXPECTED OUTPUT — for each question:
1. Marks awarded / total marks available
2. What I got right (specific — quote my answer back)
3. What I missed or got wrong
4. The model answer (what a top-grade response looks like)
5. Examiner comment (what an examiner would write in the margin)

At the end:
- Total score and percentage
- My 3 weakest areas based on this paper — I'll prioritise these in my remaining revision time
- My 2 strongest areas — I can spend less time here
- Predicted grade based on this performance`,
          },
        ],
      },
      {
        keywords: ["research","citation","reference","source","bibliography","literature review","find papers","academic","cite"],
        title: "Research & Citations Done Fast Workflow",
        summary: "Consensus.app finds papers → Elicit synthesises → Zotero saves references → Claude writes literature review → formatting automated.",
        tools: ["Consensus.app","Elicit","Zotero","Claude","Perplexity AI"],
        steps: [
          "STEP 1 — Find academic sources: Go to consensus.app. Type your research question as a full sentence. It searches peer-reviewed papers and shows you what the evidence says, with citations.",
          "STEP 2 — Synthesise the literature: Go to elicit.org. Ask your research question. Elicit pulls dozens of relevant papers, extracts key findings, and compares results across studies.",
          "STEP 3 — Save and organise: Download Zotero (zotero.org — free). As you find papers, click the Zotero browser extension to save them with full citation data automatically.",
          "STEP 4 — Write the lit review: Use Prompt 1 in Claude. Paste in the key findings from your sources and Claude writes the synthesised literature review section.",
          "STEP 5 — Format citations: In Zotero, select all your sources, right-click, and export in your required format (Harvard, APA, MLA, Vancouver). Copy into your document.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After collecting your sources from Consensus and Elicit, paste the key findings into Claude with this prompt. Claude will write your literature review section.",
            promptText: `You are an academic research assistant helping a student write a literature review.

ROLE: Write a synthesised literature review section based on these academic sources.

MY RESEARCH QUESTION / TOPIC: [your research question]
ASSIGNMENT CONTEXT: [e.g. 2000-word dissertation introduction / 500-word review section of a lab report]
ACADEMIC LEVEL: [Undergraduate / Masters / A-Level Extended Project]

MY SOURCES AND KEY FINDINGS:
Source 1: [Author, Year, Journal] — Key finding: [brief summary]
Source 2: [Author, Year, Journal] — Key finding: [brief summary]
Source 3: [Author, Year, Journal] — Key finding: [brief summary]
[add more as needed]

EXPECTED OUTPUT:
Write a [specify word count] literature review section that:
1. Groups sources by theme, not by author (synthesises, doesn't just summarise one by one)
2. Shows where sources agree and where they contradict
3. Identifies gaps in the current research (if applicable)
4. Uses academic hedging language ("suggests", "indicates", "proposes")
5. Includes in-text citations in [Harvard / APA / MLA] format: (Author, Year)
6. Ends with a sentence explaining how these sources support my own research approach`,
          },
          {
            tool: "Perplexity AI",
            toolUrl: "https://www.perplexity.ai",
            instruction: "Go to perplexity.ai. Type this as your search query. Perplexity will search the web for academic sources in real time and provide citations you can verify.",
            promptText: `Find peer-reviewed academic sources and key research findings on this topic:

RESEARCH TOPIC: [your topic]
SPECIFIC ANGLE: [the specific aspect of the topic you're researching]
TIME RANGE: [e.g. sources from 2015–2024 only]
REQUIRED PERSPECTIVE: [e.g. I need sources that support / challenge / explore [specific view]]

Please provide:
1. A summary of what current academic research says about this topic
2. The key researchers or landmark studies in this area
3. Any major academic debates or contrasting views
4. Direct citations for each source you reference so I can verify them`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Use this prompt to check your citations and reference list for formatting errors before submitting. Paste your bibliography and Claude will flag any issues.",
            promptText: `You are an academic librarian and citation expert.

ROLE: Review my reference list for formatting errors and completeness.

CITATION STYLE REQUIRED: [Harvard / APA 7th / MLA / Vancouver / Chicago]
MY REFERENCE LIST:
[paste your full bibliography / reference list here]

EXPECTED OUTPUT:
1. Flag every citation that has a formatting error — specify exactly what is wrong and provide the corrected version.
2. Identify any citations that appear to be incomplete (missing year, journal volume, page numbers, etc.).
3. Check that all citations are in alphabetical order (or numbered correctly for Vancouver).
4. Note any inconsistencies in formatting style between different citations.
5. Provide the corrected, complete reference list at the end, ready to copy and paste.`,
          },
        ],
      },
      {
        keywords: ["math","maths","physics","chemistry","science","equation","solve","calculation","formula","problem","stem"],
        title: "Solve Complex STEM Problems Workflow",
        summary: "Claude solves step-by-step → Wolfram Alpha verifies → Claude generates practice problems → Desmos visualises → formula sheet created.",
        tools: ["Claude","Wolfram Alpha","Desmos","Photomath","Khan Academy AI"],
        steps: [
          "STEP 1 — Step-by-step solution: Type or photograph the problem. Paste it into Claude with Prompt 1. Ask for a full solution with every step explained — not just the answer.",
          "STEP 2 — Verify: Go to wolframalpha.com. Enter the problem. WolframAlpha is a verified computational engine — use it to double-check Claude's answer, especially for complex calculations.",
          "STEP 3 — Visualise: Go to desmos.com. Enter the equation or function. Desmos renders it visually — seeing the graph often unlocks the conceptual understanding that numbers alone don't give.",
          "STEP 4 — Practice the method: Use Prompt 2 in Claude to generate 3 similar problems at the same difficulty. Solve them yourself before checking the solutions.",
          "STEP 5 — Build a formula sheet: Use Prompt 3 in Claude to generate a comprehensive formula sheet for the topic — useful for revision and exams.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Paste or type your problem exactly as it appears. Claude will solve it step by step — read each step carefully to understand the method, not just the answer.",
            promptText: `You are a patient and thorough STEM tutor who never skips steps.

ROLE: Solve this problem step-by-step, explaining your reasoning at every stage so I understand the method.

MY PROBLEM:
[paste the full problem here, including all given values and what is being asked]

SUBJECT: [e.g. A-Level Maths — Integration / AP Physics — Kinematics / GCSE Chemistry — Moles]

EXPECTED OUTPUT:
1. IDENTIFY: What type of problem is this and what method should I use?
2. SET UP: Write out the relevant formula(s) and identify which variables I know and which I'm solving for.
3. STEP-BY-STEP SOLUTION: Show every calculation. Don't skip steps. If you rearrange an equation, show the rearrangement.
4. FINAL ANSWER: State clearly with correct units.
5. CHECK: Verify the answer makes sense (dimensional analysis, order of magnitude check, substitute back in).
6. COMMON MISTAKE: What do students usually get wrong on this type of problem?`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After understanding the solution, use this prompt to practice the method. Solve each practice problem yourself before asking Claude for the answers.",
            promptText: `You are a STEM tutor creating targeted practice problems.

ROLE: Create 3 practice problems that test the same method as the one I just solved.

THE METHOD I JUST PRACTISED: [describe the problem type — e.g. integration by substitution / Newton's second law / equilibrium constant calculation]
MY CURRENT LEVEL: [GCSE / A-Level / University Year 1]
DIFFICULTY: [same level as the original / slightly harder / mix of easier and harder]

EXPECTED OUTPUT:
Give me the 3 problems ONLY first. Do not include solutions yet.

Wait for me to attempt them and send back my answers.

Then mark my answers:
- For each problem: correct / incorrect + where I went wrong
- Full worked solution
- The specific step I made an error on (if any)`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Use this prompt to create a formula sheet for your exam topic. Print it or save it as a revision reference.",
            promptText: `You are an expert tutor creating a comprehensive formula sheet for exam revision.

ROLE: Create a complete formula sheet for this topic that I can use to revise and refer to in my exam.

TOPIC: [e.g. A-Level Maths — Mechanics / AP Chemistry — Thermodynamics / GCSE Physics — Waves]
EXAM BOARD: [AQA / Edexcel / OCR / AP / IB / other]

EXPECTED OUTPUT:
A clean, well-organised formula sheet with:

1. All key formulas, organised by sub-topic
2. For each formula:
   - The formula written clearly (use standard notation)
   - What each variable represents and its units
   - When to use this formula (the situation it applies to)
   - Any conditions or limitations (e.g. "only valid for ideal gases")
3. Any constants I need to know or will be given in the exam
4. A quick-reference summary: the 5 formulas most likely to appear in a challenging exam question`,
          },
        ],
      },
    ],
  },

  /* ──────────────────────────────── STARTUP FOUNDER ───────────── */
  startupFounder: {
    painPoints: [
      {
        keywords: ["validate","idea","market fit","pmf","research","customer discovery","should i build","viable","demand","concept"],
        title: "Validate Your Startup Idea in 48 Hours Workflow",
        summary: "Claude stress-tests the idea → Reddit surfaces real pain → Typeform collects data → Claude analyses → customer calls planned.",
        tools: ["Claude","Typeform","Reddit","SparkToro","Lenny's Newsletter"],
        steps: [
          "STEP 1 — Stress-test the idea: Before anything else, open Claude with Prompt 1. Get the brutal honest case against your idea so you know what you're defending against.",
          "STEP 2 — Find real pain: Go to reddit.com. Search for communities where your target customer hangs out. Search '[problem] frustrated' or '[problem] advice'. Read 20+ posts. Note exact words they use.",
          "STEP 3 — Survey for data: Go to typeform.com. Build a 5-question survey in 20 minutes. Post it in the Reddit communities you found. Aim for 50+ responses in 48 hours.",
          "STEP 4 — Analyse responses: Paste your survey results into Claude with Prompt 2. Get a pattern analysis that tells you whether there's real demand.",
          "STEP 5 — Customer calls: Use Prompt 3 in Claude to write your customer discovery interview script. Book 5 calls through your Reddit community or LinkedIn. These are the most valuable hours you'll spend.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Describe your startup idea as clearly as possible. Use this prompt to get the strongest possible case AGAINST your idea — this is how you identify the real risks before you build.",
            promptText: `You are a venture capital partner who has seen 10,000 startup pitches and invested in 50 companies.

ROLE: Play devil's advocate and give me the most brutally honest critique of this startup idea. Do not soften anything.

MY STARTUP IDEA:
[describe your idea: the problem, the solution, the target customer, your rough business model]

CURRENT STAGE: [idea / MVP / early revenue / pre-seed]

EXPECTED OUTPUT:
1. The 5 strongest reasons this idea will fail — ranked by likelihood and severity.
2. For each risk: is it existential (kills the company) or manageable (can be overcome)?
3. The assumptions in my plan that I have NOT tested yet and MUST test before building.
4. Who is already solving this problem and how — be specific about existing alternatives.
5. The one question an investor would ask that I currently cannot answer well.
6. Despite the critique: if this idea HAS a path to success, what does that path look like and what would need to be true?`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After running your Typeform survey and getting 50+ responses, export the results as a CSV or copy the text responses. Paste them into Claude with this prompt.",
            promptText: `You are a market research analyst specialising in early-stage startup validation.

ROLE: Analyse these survey responses and tell me whether there is real validated demand for my startup idea.

MY STARTUP IDEA: [brief description]
SURVEY QUESTION I ASKED: [paste your 5 survey questions]
SURVEY RESPONSES:
[paste all responses, or summarise each question's answers]

NUMBER OF RESPONDENTS: [e.g. 73 people]

EXPECTED OUTPUT:
1. DEMAND SIGNAL: On a scale of 1–10, how strong is the demand signal? Justify your score.
2. PATTERN ANALYSIS: What are the 3 most common pain points mentioned?
3. WILLINGNESS TO PAY: Any signals that respondents would pay for a solution? What price range is implied?
4. UNEXPECTED INSIGHTS: What surprised you in the data that I might have missed?
5. THE RISKIEST FINDING: What in this data should concern me most?
6. VERDICT: Should I continue building, pivot the concept, or abandon this idea? Give me a clear recommendation with reasoning.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Before making customer discovery calls, use this prompt to build your interview script. Good interviews are non-leading — this prompt ensures you ask the right questions.",
            promptText: `You are a customer development expert trained in the Mom Test methodology (never ask leading questions).

ROLE: Write a customer discovery interview script that will tell me whether my problem hypothesis is real, without biasing the respondent.

MY PROBLEM HYPOTHESIS: [describe the problem you think exists and who has it]
MY TARGET INTERVIEWEE: [describe who you want to interview]
CALL LENGTH: [20 minutes / 30 minutes]

MOM TEST RULES (must follow):
- Never mention your solution during the interview
- Ask about the past (what they've actually done) not the future (what they would do)
- Ask about their life, not your idea
- Never ask "would you pay for X" — instead ask about current spending

EXPECTED OUTPUT:
1. OPENING (2 minutes): How to set context and make them comfortable talking honestly.
2. CORE QUESTIONS (10–15 minutes): 8 open-ended questions about their actual experience with this problem. Each question should be non-leading.
3. CURRENT SOLUTIONS QUESTIONS (5 minutes): What are they doing today to solve this? What do they hate about current solutions?
4. WRAP-UP (2 minutes): How to close and ask for referrals to other interviewees.
5. RED FLAGS: Signs during the call that indicate the problem isn't real or isn't painful enough.`,
          },
        ],
      },
      {
        keywords: ["landing page","website","copy","homepage","value proposition","above the fold","messaging","positioning","convert"],
        title: "Write Landing Page Copy That Converts Workflow",
        summary: "Claude writes value prop → full page copy drafted → v0 scaffolds UI → Hotjar installed → copy tested and iterated.",
        tools: ["Claude","v0 by Vercel","Unbounce","Hotjar","Copy.ai"],
        steps: [
          "STEP 1 — Nail the value proposition: Before writing a word of copy, open Claude with Prompt 1 to write your positioning and one-liner. This is the foundation everything else builds on.",
          "STEP 2 — Write the full page: Use Prompt 2 in Claude to write complete landing page copy — headline, subheadline, benefit sections, social proof placeholders, FAQ, and CTA.",
          "STEP 3 — Scaffold the UI: Go to v0.dev. Describe your landing page structure. v0 generates the React components in minutes. Paste Claude's copy directly into the components.",
          "STEP 4 — Install Hotjar: Sign up at hotjar.com (free tier available). Add the tracking code to your page. From day 1, you'll see visitor recordings and where they drop off.",
          "STEP 5 — Iterate from data: After 200 visits, use Prompt 3 in Claude to analyse your Hotjar findings and get specific copy changes to test.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Fill in your startup details before writing any copy. This prompt builds your positioning foundation — every headline and CTA flows from this.",
            promptText: `You are a world-class startup positioning consultant and copywriter.

ROLE: Define my startup's positioning and write the core copy elements I need before building my landing page.

MY STARTUP: [describe what it does]
MY TARGET CUSTOMER: [describe in detail — who they are, what they do, what they currently struggle with]
THE SPECIFIC PROBLEM I SOLVE: [be precise]
MY SOLUTION: [how it works in plain terms]
KEY DIFFERENTIATOR: [what makes this genuinely different from alternatives]
PRICE / BUSINESS MODEL: [e.g. $49/month SaaS / free + premium / one-time purchase]

EXPECTED OUTPUT:
1. POSITIONING STATEMENT: "[Startup name] helps [target customer] [achieve specific outcome] without [pain/friction], unlike [alternatives] which [limitation]."
2. ONE-LINER (10 words max): The simplest possible description. No jargon.
3. TAGLINE (5 words max): Memorable, benefit-focused.
4. PRIMARY VALUE PROPOSITION: 2–3 sentences that answer "why should I care, why you, why now."
5. THE 3 CORE BENEFITS: What the customer gets (outcomes, not features).
6. THE OBJECTIONS TO PRE-EMPT: The 3 most likely reasons a visitor won't convert — and the counter-argument for each.`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Take the positioning work from Prompt 1 and use this prompt to write the full landing page copy. This gives you everything you need to hand to a designer or paste into v0.",
            promptText: `You are a conversion-focused landing page copywriter who specialises in early-stage SaaS and startup products.

ROLE: Write complete, conversion-optimised landing page copy for my startup.

MY POSITIONING (from previous work):
[paste the positioning statement, one-liner, tagline, benefits, and objections from Prompt 1]

MY TARGET CUSTOMER: [describe them]
PAGE GOAL: [e.g. get email signups for waitlist / drive free trial starts / book a demo call]

WRITE THE COMPLETE PAGE COPY:

1. HERO SECTION:
   - Headline (primary): bold, specific, outcome-focused
   - Headline (alternative): 2 more options
   - Subheadline: expands the headline in 1–2 sentences
   - CTA button text: 3 options

2. SOCIAL PROOF BAR: Placeholder text for logos / numbers / quote (e.g. "Trusted by 500+ founders")

3. PROBLEM SECTION: 3 pain points, each as a short heading + 1-sentence description

4. SOLUTION / FEATURES SECTION: 3 benefits (not features) — heading + 2-sentence description each

5. HOW IT WORKS: 3-step process — each step with a title and 1-sentence description

6. TESTIMONIALS: 3 placeholder testimonials showing the format and tone

7. FAQ: 5 questions with answers that address the top objections

8. FINAL CTA SECTION: Closing headline + CTA button + reassurance line (e.g. "No credit card required")`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After 200+ visits tracked in Hotjar, review your recordings and heatmaps. Note your observations and paste them into Claude with this prompt to get specific copy experiments to run.",
            promptText: `You are a CRO (conversion rate optimisation) specialist analysing landing page behaviour data.

ROLE: Analyse my visitor behaviour data and give me specific copy tests to run to improve conversions.

MY CURRENT CONVERSION RATE: [e.g. 3.2% of visitors sign up]
MY PAGE GOAL: [e.g. email signup / free trial / demo booking]
TRAFFIC VOLUME: [visits per week]

HOTJAR OBSERVATIONS:
[describe what you see in recordings and heatmaps, e.g.:]
- Most visitors drop off after scrolling past the hero section
- The FAQ section gets very little scroll
- Visitors hover over the pricing section but don't click CTA
- Mobile visitors scroll faster and convert less

EXPECTED OUTPUT:
1. Diagnosis — what the behaviour data tells me about why visitors aren't converting.
2. The #1 highest-impact copy change to test first (with the specific rewrite).
3. 3 A/B tests to run, prioritised by expected impact:
   - What to test
   - The control (current copy)
   - The variant (new copy to test)
   - Why this test should improve conversions
4. What I should NOT change yet (what is working based on the data).`,
          },
        ],
      },
      {
        keywords: ["customer","first customer","sales","acquire","outreach","b2b","lead","prospect","revenue","paying","close"],
        title: "Land Your First 10 Customers Workflow",
        summary: "Claude defines ICP → Apollo finds leads → Claude writes outreach sequence → Lemlist personalises at scale → Claude handles replies.",
        tools: ["Claude","Apollo.io","LinkedIn Sales Navigator","Lemlist","Smartlead"],
        steps: [
          "STEP 1 — Define your ICP: Open Claude with Prompt 1 to get a precise Ideal Customer Profile. The more specific, the higher your reply rate. 'Everyone' is not an ICP.",
          "STEP 2 — Find leads: Go to apollo.io (free tier available). Use your ICP definition to filter by company size, industry, job title, and location. Build a list of 100 prospects. Export to CSV.",
          "STEP 3 — Write the sequence: Use Prompt 2 in Claude to write a 3-email cold outreach sequence. The goal is a reply, not a pitch — keep it short and human.",
          "STEP 4 — Send at scale: Import your lead list into lemlist.com or smartlead.ai. Set up personalisation tokens (first name, company, custom line). Send the sequence with 2-day gaps between emails.",
          "STEP 5 — Handle replies: Every time someone replies, use Prompt 3 in Claude to craft the perfect response that moves toward a call.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Fill in your product and what it does. This prompt gives you an ultra-specific ICP that you'll use to build your Apollo lead list.",
            promptText: `You are a B2B sales strategist who specialises in helping early-stage startups land their first customers.

ROLE: Define the most precise Ideal Customer Profile (ICP) for my product so I target only the people most likely to pay right now.

MY PRODUCT: [describe what it does and the problem it solves]
PRICE POINT: [e.g. $200/month / $2,000 one-time]
EARLY INDICATIONS OF WHO MIGHT BUY (if any): [e.g. had 3 conversations with X type of person who seemed interested]

EXPECTED OUTPUT:
1. PRIMARY ICP (the single highest-probability customer right now):
   - Company type and size
   - Industry / vertical
   - Job title of the buyer
   - Job title of the user (if different from buyer)
   - The specific pain they experience that your product solves
   - What they're using today to solve this (your real competition)
   - What they read, follow, and attend (where to find them)

2. SECONDARY ICP (next best customer after the primary):
   [same structure]

3. ANTI-ICP (who to avoid wasting time on):
   - Company profiles that look right but are actually unlikely to buy
   - Signs in a conversation that tell you to disqualify early

4. Search filters for Apollo.io: exact filter settings to find 100 leads matching the Primary ICP`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Take your ICP definition and use this prompt to write your outreach sequence. This goes directly into Lemlist or Smartlead. Keep emails short — under 100 words each.",
            promptText: `You are a cold email specialist with a track record of 15%+ reply rates for early-stage B2B startups.

ROLE: Write a 3-email cold outreach sequence to book discovery calls with my Ideal Customer Profile.

MY ICP: [paste the ICP from Prompt 1]
MY PRODUCT: [describe it in one sentence]
THE PROBLEM IT SOLVES: [specific pain point]
SOCIAL PROOF (if any): [e.g. "3 companies like yours are already using us" or "just leave blank if none"]
CALL TO ACTION: [30-minute discovery call / 15-minute demo / async video]

RULES (the sequence must follow these):
- Email 1: Under 80 words. No pitch. Open with a specific observation about them or their industry.
- Email 2 (3 days later): 60 words. Follow up by adding one piece of value (a relevant insight, article, or data point).
- Email 3 (5 days later): 40 words. The "break-up" email. Creates urgency. Easy to respond to.
- Zero buzzwords. Write like a human, not a marketer.
- No attachments. No calendly links in email 1.

For each email:
- Subject line (3 options)
- Email body
- [PERSONALISATION] token where a custom first line should go`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "When a prospect replies to your cold email — whether positive, hesitant, or asking questions — paste their reply into Claude with this prompt to get the perfect response.",
            promptText: `You are an expert B2B sales consultant helping a founder respond to a cold email reply.

ROLE: Write the perfect response to this cold email reply that moves the conversation toward a booked call.

MY PRODUCT: [describe it briefly]
MY ICP (who this prospect is): [paste from Prompt 1]
THE COLD EMAIL I SENT: [paste the email they're responding to]
THEIR REPLY:
[paste their exact reply here]

ANALYSE THE REPLY:
- Is this positive / interested / curious?
- Is this an objection or concern?
- Is this a polite no?
- Is this asking a specific question?

EXPECTED OUTPUT:
1. A reply of under 100 words that:
   - Acknowledges what they said specifically (no generic openers)
   - Moves directly toward the goal (booking a call)
   - Removes any friction (answers their concern or question in one line)
   - Ends with a specific, easy-to-say-yes-to ask
2. If they said no: a graceful response that plants a seed for the future without being pushy.
3. If they asked a technical question: answer it in 2 sentences then redirect to a call.`,
          },
        ],
      },
      {
        keywords: ["pitch","deck","investor","fundraise","raise","vc","slides","presentation","funding","seed","series"],
        title: "Build a Fundable Pitch Deck Workflow",
        summary: "Claude outlines the deck → writes each slide narrative → Tome designs it → Claude stress-tests with investor questions → DocSend tracks views.",
        tools: ["Claude","Tome","Beautiful.ai","DocSend","Crunchbase"],
        steps: [
          "STEP 1 — Outline first: Open Claude with Prompt 1 to build your 12-slide deck outline in the YC format — the most battle-tested investor pitch structure in the world.",
          "STEP 2 — Write slide narratives: Use Prompt 2 in Claude for each slide. Write the narrative for every slide before touching design — copy drives design, not the other way around.",
          "STEP 3 — Design the deck: Go to tome.app or beautiful.ai. Both have AI design tools — paste your copy and they'll generate a polished presentation. Customise colours and fonts to your brand.",
          "STEP 4 — Stress-test: Use Prompt 3 in Claude to get the 10 hardest investor questions your deck will face. Prepare a crisp answer for each before your first meeting.",
          "STEP 5 — Track engagement: Upload to docsend.com. Share the DocSend link (never a PDF attachment). DocSend tells you which slides investors spend time on, which they skip, and whether they forwarded it.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Describe your startup as completely as you can. Claude will give you a full 12-slide deck outline following the YC/Sequoia format — the structure that resonates most with investors.",
            promptText: `You are a partner at a top-tier venture capital firm who has seen 5,000 pitch decks and funded 80 companies.

ROLE: Create a complete 12-slide pitch deck outline for my startup in the YC/Sequoia format.

MY STARTUP:
- Name: [startup name]
- One-line description: [what it does]
- Problem being solved: [describe clearly]
- Solution: [how it works]
- Target market: [who buys it and how big is the market]
- Business model: [how we make money]
- Traction (if any): [users, revenue, growth, partnerships]
- Team: [founder backgrounds in 1 sentence each]
- Ask: [how much are you raising and at what valuation if known]

EXPECTED OUTPUT:
A 12-slide outline in this format for each slide:
- Slide name
- The job of this slide (what question does it answer for the investor?)
- What content to include (bullet points of exactly what goes on this slide)
- What NOT to include (the most common mistake founders make on this slide)
- The one thing that makes this slide memorable vs forgettable

Slides to cover: Problem, Solution, Why Now, Market Size, Product, Business Model, Traction, Team, Competition, Financials/Ask, Vision`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Take each slide from your outline and use this prompt to write the narrative. Run this prompt once per slide — copy the output into Tome or Beautiful.ai.",
            promptText: `You are a pitch deck copywriter who has helped startups raise over $200M in seed and Series A rounds.

ROLE: Write the complete narrative and copy for one slide of my pitch deck.

MY STARTUP: [brief description]
THE SLIDE: [e.g. Problem Slide / Traction Slide / Team Slide]
THE JOB OF THIS SLIDE: [paste from the outline — what question must this slide answer?]
KEY INFORMATION TO INCLUDE: [paste the content bullets from your outline]
INVESTOR AUDIENCE: [e.g. pre-seed angels / seed VCs / Series A institutional]

EXPECTED OUTPUT:
1. SLIDE HEADLINE: A bold, specific statement (not a question, not a vague label). Max 10 words.
2. SLIDE BODY COPY: The 3–4 bullet points or data points that go on the slide itself (concise — slides are for the eye, the founder talks to the details).
3. SPEAKER NOTES: What the founder should SAY while this slide is on screen (60–90 seconds of narrative — visceral, specific, story-driven).
4. THE EMOTIONAL REACTION this slide should create in the investor — and whether your content achieves that.
5. ONE THING that would make this slide 10x more compelling (a specific number, quote, visual, or story).`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "After building your deck, paste a full summary of your deck content into Claude with this prompt. Prepare your answers before your first investor meeting.",
            promptText: `You are a partner at a top-tier VC firm who asks the hardest questions to founders.

ROLE: Ask me the 10 hardest questions an investor will ask about my pitch — then help me prepare strong answers.

MY PITCH DECK SUMMARY:
[paste a summary of each slide — problem, solution, market, traction, team, model, ask]

STAGE I'M RAISING: [pre-seed / seed / Series A]
INVESTOR TYPE: [angels / seed VCs / institutional]

EXPECTED OUTPUT:
1. List the 10 hardest, most probing questions an investor will ask — questions that expose weaknesses, challenge assumptions, or test the founder's self-awareness.
2. For each question:
   - Why this question is asked (what the investor is really probing for)
   - What a WEAK answer sounds like (so I know what to avoid)
   - The framework for a STRONG answer
   - A draft answer for my specific startup

Focus especially on: market size assumptions, competition, why now, defensibility, team credibility gaps, and the financial ask.`,
          },
        ],
      },
      {
        keywords: ["hire","hiring","team","delegate","job description","recruit","co-founder","freelancer","outsource","sop","process"],
        title: "Hire & Delegate Like a Pro Workflow",
        summary: "Claude writes job description → Loom records SOPs → Claude converts to written docs → Contra finds talent → 30-60-90 onboarding planned.",
        tools: ["Claude","Notion","Loom","Contra","Linear"],
        steps: [
          "STEP 1 — Write the job description: Open Claude with Prompt 1. Write a role description focused on what the person will OWN, not just do — the best candidates care about responsibility, not task lists.",
          "STEP 2 — Document before you hire: Record Loom videos (loom.com) walking through every task you want to delegate. Talk through it as if showing someone on their first day. Don't write — just record.",
          "STEP 3 — Convert to SOPs: Upload your Loom transcripts into Claude with Prompt 2. Claude converts your rambling walkthrough into a clean, step-by-step SOP document. Paste into Notion.",
          "STEP 4 — Find talent: Post on contra.com for vetted freelancers. For full-time hires, post on LinkedIn and relevant Slack communities. Always assign a paid test project before hiring.",
          "STEP 5 — Onboard effectively: Use Prompt 3 in Claude to write a 30-60-90 day onboarding plan. Share it with your new hire on day 1 so they know exactly what success looks like.",
        ],
        prompts: [
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Open Claude. Describe the role you need to fill. This prompt writes a job description that attracts high-ownership operators — not people looking for a list of tasks to complete.",
            promptText: `You are a talent acquisition expert who specialises in early-stage startup hiring.

ROLE: Write a compelling job description that attracts high-ownership operators, not task-completers.

ROLE TITLE: [e.g. Head of Growth / Operations Lead / Full-Stack Engineer]
COMPANY STAGE: [pre-seed / seed / Series A / bootstrapped]
COMPANY DESCRIPTION: [1–2 sentences about what you build and who you serve]
WHAT THIS PERSON WILL OWN: [describe the outcomes they'll be responsible for, not just the tasks]
MUST-HAVE SKILLS: [list the non-negotiables]
NICE-TO-HAVE SKILLS: [list bonuses]
COMPENSATION: [salary range + equity if applicable]
REMOTE / OFFICE: [specify]

EXPECTED OUTPUT:
1. JOB TITLE: The exact title to post (optimised for search + honest about level)
2. ONE-PARAGRAPH COMPANY HOOK: Why a talented person should care about joining right now
3. WHAT YOU'LL OWN (3–5 bullet points): Outcomes and responsibilities, written as if this person will run this domain
4. WHAT SUCCESS LOOKS LIKE IN 90 DAYS: Specific, measurable outcomes
5. WHAT WE'RE LOOKING FOR: Skills and experience — written to attract self-starters, not order-takers
6. THE INTERVIEW PROCESS: What to expect (shows respect for candidates' time)
7. ONE THING that makes this role genuinely exciting that most job descriptions never mention`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Record a Loom video walking through a task you want to delegate. Get the auto-transcript from Loom. Paste it into Claude with this prompt to get a clean SOP document.",
            promptText: `You are a business operations specialist who turns verbal walkthroughs into clear process documentation.

ROLE: Convert this informal spoken walkthrough into a clean, professional SOP (Standard Operating Procedure) document.

RAW TRANSCRIPT:
[paste the Loom auto-transcript here]

CONTEXT: This SOP is for [describe who will use it — e.g. a new VA / a freelance designer / an in-house marketer]
TASK BEING DOCUMENTED: [name the task]

EXPECTED OUTPUT:
A professional SOP document with:

1. TASK TITLE: Clear, descriptive name
2. PURPOSE: Why this task exists and what outcome it produces (2 sentences)
3. FREQUENCY: How often this task should be done
4. TOOLS REQUIRED: Every tool, login, or resource needed (with links)
5. STEP-BY-STEP INSTRUCTIONS: Numbered, clear, unambiguous steps. Each step should be something a new person can do without asking a question.
6. DECISION POINTS: Any moments where they need to make a judgment call — and what criteria to use
7. COMMON MISTAKES: The top 3 errors people make on this task and how to avoid them
8. WHAT DONE LOOKS LIKE: How to know when the task is complete and correct`,
          },
          {
            tool: "Claude",
            toolUrl: "https://claude.ai",
            instruction: "Use this prompt to write your new hire's onboarding plan. Share it with them on their first day — it sets clear expectations and dramatically reduces ramp-up time.",
            promptText: `You are a startup operations lead creating a structured onboarding plan for a new hire.

ROLE: Write a detailed 30-60-90 day onboarding plan for this new team member.

ROLE: [job title]
COMPANY STAGE: [pre-seed / seed / Series A / bootstrapped]
COMPANY FOCUS RIGHT NOW: [what is the #1 priority for the business in the next 90 days?]
KEY DELIVERABLES FOR THIS ROLE: [what should this person be producing by day 90?]
TEAM SIZE: [how many people total]
TOOLS THEY'LL USE: [list the main tools]

EXPECTED OUTPUT:
A structured onboarding plan:

DAYS 1–30 (LEARN):
- Week 1 goals (context, culture, tools setup)
- Week 2–4 goals (understand the domain, shadow existing processes)
- First quick win to aim for
- Who to meet in the first 30 days and why

DAYS 31–60 (CONTRIBUTE):
- Key deliverables for this period
- The first project they take full ownership of
- How they'll be evaluated at the 60-day mark

DAYS 61–90 (OWN):
- Full ownership of their domain
- Performance metrics / OKRs for the role
- What a successful 90-day review looks like

At the end: The single question they should be able to answer "yes" to by day 90 to confirm they're the right hire.`,
          },
        ],
      },
    ],
  },
};

/* ─── KEYWORD MATCHING ───────────────────────────────────────────── */
function matchPainPoint(role: Role, input: string): WorkflowData {
  const lower = input.toLowerCase();
  const painPoints = workflowMap[role].painPoints;

  let bestIndex = 0;
  let bestScore = 0;

  painPoints.forEach((pp, i) => {
    const score = pp.keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  });

  return painPoints[bestIndex];
}

/* ─── ROLES ──────────────────────────────────────────────────────── */
const roles: { key: Role; label: string; icon: string; description: string }[] = [
  { key: "developer",      label: "Developer", icon: "⌥", description: "Build & ship faster" },
  { key: "contentCreator", label: "Creator",   icon: "◈", description: "Grow your audience" },
  { key: "marketing",      label: "Marketing", icon: "◎", description: "Scale campaigns" },
  { key: "student",        label: "Student",   icon: "◇", description: "Learn smarter" },
  { key: "startupFounder", label: "Founder",   icon: "⬡", description: "Execute your vision" },
];

/* ─── LOGO ───────────────────────────────────────────────────────── */
function Logo() {
  const [videoError, setVideoError] = useState(false);
  if (videoError) {
    return (
      <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0"
        style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>C</div>
    );
  }
  return (
    <video src="/videos/logo.mp4" autoPlay loop muted playsInline
      onError={() => setVideoError(true)}
      className="w-8 h-8 rounded-xl object-cover shrink-0" />
  );
}

/* ─── TYPING DOTS ────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#a0a0ff] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }} />
      ))}
    </span>
  );
}

/* ─── TOOL BADGE ─────────────────────────────────────────────────── */
function ToolBadge({ tool }: { tool: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70 hover:border-[#6366f1]/50 hover:text-white/90 transition-all duration-200 cursor-default">
      <span className="w-1 h-1 rounded-full bg-[#6366f1]" />
      {tool}
    </span>
  );
}

/* ─── EMAIL MODAL ────────────────────────────────────────────────── */
function EmailModal({ onClose, source }: { onClose: () => void; source: "workflow" | "upgrade" }) {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = () => {
    if (!email.includes("@")) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}>
      <div className="relative w-full max-w-md rounded-2xl p-6 sm:p-8"
        style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">✕</button>
        {!submitted ? (
          <>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
              style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
              <span className="text-lg">✉️</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {source === "upgrade" ? "Get early access to Pro" : "Save your workflow"}
            </h3>
            <p className="text-sm text-white/40 mb-6 leading-relaxed">
              {source === "upgrade"
                ? "Enter your email and we'll notify you when Pro launches with exact prompts, scripts & templates."
                : "Drop your email and we'll send this workflow + premium prompts to your inbox."}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                className="flex-1 px-4 py-3 rounded-xl text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-[#6366f1]/50 placeholder:text-white/25" />
              <button onClick={handleSubmit} disabled={loading || !email.includes("@")}
                className="px-5 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
                {loading ? "..." : "Notify me"}
              </button>
            </div>
            <p className="text-[10px] text-white/20 mt-3 text-center">No spam. Unsubscribe anytime.</p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-bold text-white mb-2">You're on the list!</h3>
            <p className="text-sm text-white/40 mb-6">We'll reach out as soon as Pro is ready.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
              Back to Crazly
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ↓↓↓ PART 2 STARTS BELOW THIS LINE — paste the WorkflowsPage export after this ↓↓↓

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE  — paste this directly after Part 1
═══════════════════════════════════════════════════════════════ */
export default function WorkflowsPage() {
  const { isSignedIn, user } = useUser();

  const [selectedRole, setSelectedRole]       = useState<Role | null>(null);
  const [input, setInput]                     = useState("");
  const [submittedInput, setSubmittedInput]   = useState("");
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowData | null>(null);
  const [showResult, setShowResult]           = useState(false);
  const [isTyping, setIsTyping]               = useState(false);
  const [visibleSteps, setVisibleSteps]       = useState(0);
  const [animateIn, setAnimateIn]             = useState(false);
  const [drawerOpen, setDrawerOpen]           = useState(false);
  const [promptCount, setPromptCount]         = useState(0);
  const [showEmail, setShowEmail]             = useState(false);
  const [emailSource, setEmailSource]         = useState<"workflow" | "upgrade">("workflow");
  const [emailShown, setEmailShown]           = useState(false);
  const [copiedIndex, setCopiedIndex]         = useState<number | null>(null);

  const inputRef  = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setAnimateIn(true); }, []);

  /* Stream steps */
  useEffect(() => {
    if (showResult && currentWorkflow) {
      const total = currentWorkflow.steps.length;
      setVisibleSteps(0);
      let count = 0;
      const iv = setInterval(() => {
        count++;
        setVisibleSteps(count);
        if (count >= total) {
          clearInterval(iv);
          if (!isSignedIn && !emailShown) {
            setTimeout(() => {
              setEmailShown(true);
              setEmailSource("workflow");
              setShowEmail(true);
            }, 900);
          }
        }
      }, 300);
      return () => clearInterval(iv);
    }
  }, [showResult, currentWorkflow, isSignedIn, emailShown]);

  useEffect(() => {
    if (showResult) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
    }
  }, [showResult, visibleSteps]);

  const fireWorkflow = (text: string) => {
    if (!selectedRole) return;
    const matched = matchPainPoint(selectedRole, text);
    setCurrentWorkflow(matched);
    setSubmittedInput(text);
    setInput("");
    setShowResult(false);
    setIsTyping(true);
    setPromptCount(c => c + 1);
    setTimeout(() => { setIsTyping(false); setShowResult(true); }, 1800);
  };

  const handleGenerate = () => {
    if (!input.trim() || !selectedRole || isTyping) return;
    if (promptCount >= 1 && !isSignedIn) {
      window.location.href = "/sign-in";
      return;
    }
    fireWorkflow(input);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setShowResult(false);
    setIsTyping(false);
    setInput("");
    setSubmittedInput("");
    setCurrentWorkflow(null);
    setPromptCount(0);
    setDrawerOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const hideInput = showResult;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {showEmail && !isSignedIn && (
        <EmailModal onClose={() => setShowEmail(false)} source={emailSource} />
      )}

      {/* ── BG ───────────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06]"
        style={{ opacity: animateIn ? 1 : 0, transform: animateIn ? "none" : "translateY(-8px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-sm font-semibold tracking-tight text-white/90">Crazly</span>
          </Link>
          <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/20 font-medium">
            Workflow AI
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {selectedRole ? (
            <button
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/60"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}
              onClick={() => setDrawerOpen(true)}>
              <span style={{ fontFamily: "monospace" }}>{roles.find(r => r.key === selectedRole)?.icon}</span>
              {roles.find(r => r.key === selectedRole)?.label}
              <svg className="w-3 h-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          ) : (
            <button
              className="lg:hidden px-3 py-1.5 rounded-xl text-xs font-medium text-white/50"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={() => setDrawerOpen(true)}>
              Pick role ↓
            </button>
          )}

          <Link href="/pricing"
            className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
            Pricing
          </Link>

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <button className="text-xs px-3 py-1.5 rounded-xl font-medium text-white/60 hover:text-white/90 transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                Sign in
              </button>
            </SignInButton>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/40">AI Online</span>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-30 bg-black/60"
            style={{ backdropFilter: "blur(4px)" }}
            onClick={() => setDrawerOpen(false)} />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 rounded-t-2xl pb-8 pt-5 px-5"
            style={{ background: "rgba(12,12,12,0.98)", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none" }}>
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">Select your role</p>
            <div className="flex flex-col gap-2">
              {roles.map(role => {
                const active = selectedRole === role.key;
                return (
                  <button key={role.key} onClick={() => handleRoleSelect(role.key)}
                    className="flex items-center gap-4 w-full text-left px-4 py-3.5 rounded-2xl transition-all"
                    style={{
                      background: active ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
                      border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.06)"
                    }}>
                    <span className="text-lg" style={{ fontFamily: "monospace", color: active ? "#a5b4fc" : "rgba(255,255,255,0.3)" }}>
                      {role.icon}
                    </span>
                    <div>
                      <p className={`text-sm font-semibold ${active ? "text-white" : "text-white/70"}`}>{role.label}</p>
                      <p className="text-xs text-white/30">{role.description}</p>
                    </div>
                    {active && <div className="ml-auto w-2 h-2 rounded-full bg-[#6366f1]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── LAYOUT ───────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col lg:flex-row flex-1 max-w-7xl mx-auto w-full">

        {/* ── SIDEBAR ──────────────────────────────────────────── */}
        <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col p-6 border-r border-white/[0.06]"
          style={{
            opacity: animateIn ? 1 : 0,
            transform: animateIn ? "none" : "translateX(-12px)",
            transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s"
          }}>
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-4">Select your role</p>
          <div className="flex flex-col gap-2">
            {roles.map(role => {
              const active = selectedRole === role.key;
              return (
                <button key={role.key} onClick={() => handleRoleSelect(role.key)}
                  className="group relative flex items-center gap-3 w-full text-left px-3.5 py-3 rounded-xl transition-all duration-200"
                  style={{
                    background: active ? "rgba(99,102,241,0.12)" : "transparent",
                    border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid transparent"
                  }}>
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#6366f1]" />
                  )}
                  <span className="text-base text-white/40 group-hover:text-white/60 transition-colors"
                    style={{ fontFamily: "monospace" }}>{role.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium leading-tight ${active ? "text-white" : "text-white/60 group-hover:text-white/80"} transition-colors`}>
                      {role.label}
                    </p>
                    <p className="text-[11px] text-white/30 truncate">{role.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-xl"
            style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <p className="text-xs font-semibold text-white/70 mb-1">Go Pro</p>
            <p className="text-[11px] text-white/35 mb-3 leading-relaxed">
              Unlock exact prompts, direct tool links & full workflow scripts.
            </p>
            <Link href="/pricing"
              className="block text-center py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
              See plans →
            </Link>
          </div>
        </aside>

        {/* ── CHAT MAIN ────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">

            {/* Empty state */}
            {!selectedRole && (
              <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center px-4"
                style={{ opacity: animateIn ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(129,140,248,0.1))",
                    border: "1px solid rgba(99,102,241,0.2)"
                  }}>
                  <span className="text-xl sm:text-2xl">⚡</span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white/80 mb-2">Ready to execute.</h2>
                <p className="text-sm text-white/35 max-w-xs leading-relaxed hidden lg:block">
                  Pick your role on the left, describe your problem, and get a step-by-step AI workflow with exact prompts.
                </p>
                <p className="text-sm text-white/35 max-w-xs leading-relaxed lg:hidden">
                  Tap "Pick role" above to get started.
                </p>
                <button
                  className="lg:hidden mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
                  onClick={() => setDrawerOpen(true)}>
                  Pick your role →
                </button>
              </div>
            )}

            {/* AI greeting + hint chips */}
            {selectedRole && !showResult && !isTyping && (
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>AI</div>
                <div className="flex-1">
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl rounded-tl-sm text-sm text-white/75 leading-relaxed"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {isSignedIn && user?.firstName ? (
                      <>
                        Hey <span className="text-[#818cf8] font-medium">{user.firstName}</span>! You're a{" "}
                        <span className="text-[#818cf8] font-medium">{roles.find(r => r.key === selectedRole)?.label}</span>
                        {" "}— tell me exactly what you're stuck on. I'll generate your step-by-step workflow, the right AI tools, and the exact prompts to use in each one.
                      </>
                    ) : (
                      <>
                        Hey! You're a{" "}
                        <span className="text-[#818cf8] font-medium">{roles.find(r => r.key === selectedRole)?.label}</span>
                        {" "}— describe your problem below. I'll build your complete AI workflow: every tool, every step, and the exact prompt to type into each one.
                      </>
                    )}
                  </div>

                  {/* Hint chips — one per pain point */}
                  <div className="flex flex-wrap gap-2 mt-2.5 ml-1">
                    {workflowMap[selectedRole].painPoints.map((pp, i) => (
                      <button key={i}
                        onClick={() => {
                          setInput(pp.keywords[0]);
                          setTimeout(() => inputRef.current?.focus(), 50);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-full text-white/40 hover:text-white/70 transition-all cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {pp.title.replace(" Workflow", "").split(" ").slice(0, 4).join(" ")}…
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/20 mt-1.5 ml-1">Crazly AI · now</p>
                </div>
              </div>
            )}

            {/* User bubble */}
            {(isTyping || showResult) && submittedInput && (
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl ml-auto flex-row-reverse">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold bg-white/10 text-white/60">
                  You
                </div>
                <div className="flex-1 flex flex-col items-end">
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl rounded-tr-sm text-sm text-white/85 leading-relaxed max-w-[85%] sm:max-w-sm"
                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
                    {submittedInput}
                  </div>
                  <p className="text-[10px] text-white/20 mt-1.5 mr-1">You · now</p>
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>AI</div>
                <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl rounded-tl-sm"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <TypingDots />
                </div>
              </div>
            )}

            {/* ── WORKFLOW RESULT ───────────────────────────────── */}
            {showResult && currentWorkflow && (
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>AI</div>

                <div className="flex-1 min-w-0 space-y-2.5">

                  {/* Title + summary */}
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl rounded-tl-sm"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[10px] uppercase tracking-widest text-[#6366f1] font-semibold mb-1">
                      Workflow generated
                    </p>
                    <p className="text-sm font-bold text-white/90 mb-1">{currentWorkflow.title}</p>
                    <p className="text-[11px] text-white/40 leading-relaxed">{currentWorkflow.summary}</p>
                  </div>

                  {/* Tools */}
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-2.5">
                      Tools in this workflow
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentWorkflow.tools.map((tool, i) => <ToolBadge key={i} tool={tool} />)}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">
                      How the workflow runs
                    </p>
                    <div className="space-y-3">
                      {currentWorkflow.steps.map((step, i) => (
                        <div key={i}
                          className="flex items-start gap-2.5 sm:gap-3 transition-all duration-300"
                          style={{
                            opacity: i < visibleSteps ? 1 : 0,
                            transform: i < visibleSteps ? "none" : "translateY(6px)"
                          }}>
                          <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                            style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}>
                            {i + 1}
                          </div>
                          <p className="text-xs sm:text-sm text-white/65 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── PROMPTS SECTION ─────────────────────────── */}
                  <div className="relative rounded-2xl overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>

                    <div className="px-3.5 sm:px-4 pt-3 sm:pt-3.5 pb-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">
                          Exact prompts — copy & use
                        </p>
                        {!isSignedIn && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)" }}>
                            Pro
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/30 mb-3">
                        For each step — open the tool, paste the prompt, follow the instruction.
                      </p>
                    </div>

                    {/* Prompt cards */}
                    <div className={`px-3.5 sm:px-4 pb-3.5 space-y-3 ${!isSignedIn ? "blur-sm select-none pointer-events-none" : ""}`}>
                      {currentWorkflow.prompts.map((p, i) => (
                        <div key={i} className="rounded-xl overflow-hidden"
                          style={{ border: "1px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.05)" }}>

                          {/* Prompt header */}
                          <div className="flex items-center justify-between px-3 py-2"
                            style={{ background: "rgba(99,102,241,0.1)", borderBottom: "1px solid rgba(99,102,241,0.15)" }}>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                                style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", color: "white" }}>
                                {i + 1}
                              </div>
                              <a href={p.toolUrl} target="_blank" rel="noopener noreferrer"
                                className="text-xs font-semibold text-[#818cf8] hover:text-white transition-colors flex items-center gap-1">
                                {p.tool}
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                  <polyline points="15 3 21 3 21 9"/>
                                  <line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                              </a>
                            </div>
                            <button
                              onClick={() => handleCopy(p.promptText, i)}
                              className="flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-lg transition-all"
                              style={{
                                background: copiedIndex === i ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.06)",
                                color: copiedIndex === i ? "#34d399" : "rgba(255,255,255,0.5)",
                                border: copiedIndex === i ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(255,255,255,0.1)"
                              }}>
                              {copiedIndex === i ? (
                                <>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                  Copied
                                </>
                              ) : (
                                <>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                  </svg>
                                  Copy prompt
                                </>
                              )}
                            </button>
                          </div>

                          {/* Instruction */}
                          <div className="px-3 py-2 flex items-start gap-2"
                            style={{ borderBottom: "1px solid rgba(99,102,241,0.1)", background: "rgba(255,255,255,0.02)" }}>
                            <svg className="shrink-0 mt-0.5" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <p className="text-[11px] text-white/50 leading-relaxed">{p.instruction}</p>
                          </div>

                          {/* Prompt text */}
                          <div className="px-3 py-2.5">
                            <pre className="text-[11px] text-white/60 leading-relaxed whitespace-pre-wrap font-mono">
                              {p.promptText}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Lock overlay — non-signed-in */}
                    {!isSignedIn && (
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(8,8,8,0.65)", backdropFilter: "blur(3px)" }}>
                        <div className="text-center px-6">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                              <rect x="3" y="11" width="18" height="11" rx="2"/>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                          </div>
                          <p className="text-sm font-bold text-white mb-1">Prompts are Pro-only</p>
                          <p className="text-xs text-white/40 mb-4 max-w-[200px] mx-auto leading-relaxed">
                            Unlock detailed prompts with tool links for every workflow
                          </p>
                          <div className="flex flex-col gap-2 items-center">
                            <Link href="/pricing"
                              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }}>
                              Unlock with Pro →
                            </Link>
                            <SignInButton mode="modal">
                              <button className="text-xs text-white/30 hover:text-white/60 transition-colors">
                                Already have Pro? Sign in
                              </button>
                            </SignInButton>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-white/20 ml-1">Crazly AI · now</p>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── BOTTOM BAR ───────────────────────────────────── */}
          {selectedRole && (
            <>
              {/* After result → Pro upsell bar */}
              {hideInput ? (
                <div className="px-4 sm:px-6 py-4 border-t border-white/[0.06]"
                  style={{ background: "rgba(8,8,8,0.95)", backdropFilter: "blur(16px)" }}>
                  <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-4 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(129,140,248,0.06))",
                      border: "1px solid rgba(99,102,241,0.3)"
                    }}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white leading-tight">
                          Unlock prompts + unlimited workflows
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                          Pro plan · $9/mo or ₹749/mo · Cancel anytime
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <Link href="/pricing"
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold text-white text-center transition-all hover:opacity-90 active:scale-95"
                        style={{
                          background: "linear-gradient(135deg, #6366f1, #818cf8)",
                          boxShadow: "0 4px 20px rgba(99,102,241,0.35)"
                        }}>
                        Get Pro →
                      </Link>
                    </div>
                  </div>
                </div>

              ) : (
                /* Input bar */
                <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-white/[0.06]"
                  style={{ background: "rgba(8,8,8,0.8)", backdropFilter: "blur(12px)" }}>
                  <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    <input
                      ref={inputRef}
                      placeholder={`Describe your ${roles.find(r => r.key === selectedRole)?.label.toLowerCase()} problem...`}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleGenerate()}
                      disabled={isTyping}
                      className="flex-1 bg-transparent text-base sm:text-sm text-white/80 placeholder:text-white/25 outline-none disabled:opacity-50"
                    />
                    <button
                      onClick={handleGenerate}
                      disabled={!input.trim() || isTyping}
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30 active:scale-90"
                      style={{
                        background: input.trim() && !isTyping
                          ? "linear-gradient(135deg, #6366f1, #818cf8)"
                          : "rgba(255,255,255,0.08)"
                      }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </div>
                  <p className="text-[10px] text-white/20 text-center mt-2">
                    Press Enter · Crazly matches your problem to the best workflow
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}