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

/* ─── PAIN POINTS + WORKFLOWS ──────────────────────────────────── */

type WorkflowData = {
  title: string;
  tools: string[];
  steps: string[];
  prompts: string[];
  keywords: string[];
};

type RoleWorkflows = {
  painPoints: WorkflowData[];
};

const workflowMap: Record<Role, RoleWorkflows> = {
  developer: {
    painPoints: [
      {
        keywords: ["debug", "error", "bug", "crash", "exception", "fix", "broken", "issue", "not working", "fail"],
        title: "AI-Powered Debugging Workflow",
        tools: ["ChatGPT / Claude", "GitHub Copilot", "Sentry", "Stack Overflow AI", "Pieces for Developers"],
        steps: [
          "Paste your error message into Claude/ChatGPT and ask: 'Explain this error and list the 3 most likely root causes.'",
          "Use GitHub Copilot inline to suggest a fix directly in your editor.",
          "If it's a runtime error, check Sentry for the full stack trace and share it with the AI for deeper analysis.",
          "Ask the AI to write a unit test that reproduces the bug so you can confirm the fix works.",
          "Once resolved, prompt: 'How can I prevent this class of bug in future code?' and add the answer to your team's docs.",
        ],
        prompts: [
          "Here is my error: [paste error]. Explain what caused it and give me the top 3 fixes.",
          "Rewrite this function to handle this edge case: [describe edge case].",
          "Write a unit test that would catch this bug: [describe bug].",
        ],
      },
      {
        keywords: ["feature", "build", "implement", "create", "develop", "add", "new functionality", "ship"],
        title: "Feature Build Acceleration Workflow",
        tools: ["GitHub Copilot", "v0 by Vercel", "Claude", "Linear", "Notion AI"],
        steps: [
          "Describe the feature to Claude: 'Break this feature into the smallest possible tasks I can ship independently.'",
          "Use v0 to generate the UI scaffold in seconds — then customise rather than build from scratch.",
          "For each task, use Copilot to autocomplete boilerplate and write standard CRUD operations.",
          "After each sub-task, ask Claude to review your code for edge cases and security issues.",
          "Document the feature using Notion AI — paste your code and ask it to write the technical spec automatically.",
        ],
        prompts: [
          "Break this feature into the smallest shippable tasks: [describe feature].",
          "Generate the React component for: [describe UI].",
          "Review this code for security issues and edge cases: [paste code].",
        ],
      },
      {
        keywords: ["optimis", "refactor", "clean", "performance", "slow", "code review", "improve", "rewrite", "speed"],
        title: "Code Optimisation & Refactoring Workflow",
        tools: ["Claude", "GitHub Copilot", "SonarQube", "CodeRabbit", "ESLint / Prettier"],
        steps: [
          "Paste your code into Claude and prompt: 'Find performance bottlenecks and suggest optimisations with explanations.'",
          "Run CodeRabbit on your PR to get automated AI code review comments before your human reviewer sees it.",
          "Use SonarQube to detect code smells and technical debt automatically across the entire codebase.",
          "Ask Claude to refactor a specific function: 'Rewrite this to be more readable and follow SOLID principles.'",
          "After refactoring, ask: 'Write a migration guide so my team understands what changed and why.'",
        ],
        prompts: [
          "Find performance bottlenecks in this code and rank them by impact: [paste code].",
          "Refactor this function to follow SOLID principles and improve readability: [paste code].",
          "What are the top 5 code smells in this file and how do I fix them: [paste code].",
        ],
      },
      {
        keywords: ["learn", "understand", "study", "how does", "explain", "tutorial", "new tech", "framework", "library"],
        title: "Learn New Tech at 10x Speed Workflow",
        tools: ["Claude", "Perplexity AI", "YouTube + Summarize.tech", "Anki AI", "Dev.to"],
        steps: [
          "Ask Claude: 'Teach me [technology] as if I already know [my current stack]. Use analogies I'd understand.'",
          "Use Perplexity AI to find the most up-to-date tutorials and documentation — it searches in real time.",
          "Paste long YouTube tutorial transcripts into Claude and ask: 'Extract the 10 most important concepts.'",
          "After learning, ask Claude to quiz you: 'Ask me 10 questions about [technology] to test my understanding.'",
          "Build a tiny project using the new tech and ask Claude to review it and suggest what to learn next.",
        ],
        prompts: [
          "Teach me [technology] assuming I already know [existing stack]. Use analogies and practical examples.",
          "Quiz me on [technology] with 10 progressively harder questions.",
          "What are the top 10 concepts I must understand to be productive with [technology]?",
        ],
      },
      {
        keywords: ["test", "testing", "unit test", "integration", "coverage", "jest", "pytest", "spec", "qa"],
        title: "AI-Assisted Test Writing Workflow",
        tools: ["GitHub Copilot", "Claude", "Jest / Pytest", "Postman AI", "Testim"],
        steps: [
          "Paste a function into Claude and ask: 'Write comprehensive unit tests covering happy paths, edge cases, and error states.'",
          "Use Copilot to autocomplete test boilerplate and repetitive assertion patterns.",
          "Ask Claude: 'What inputs would break this function?' — use the answers as your edge case test list.",
          "For API testing, use Postman AI to auto-generate test suites from your API documentation.",
          "After writing tests, ask Claude: 'Review my test suite and identify any gaps in coverage or logic.'",
        ],
        prompts: [
          "Write unit tests for this function covering happy paths, edge cases, and error states: [paste code].",
          "What inputs could break this function? List 10 edge cases I should test: [paste code].",
          "Review my test suite and identify gaps: [paste tests].",
        ],
      },
    ],
  },

  contentCreator: {
    painPoints: [
      {
        keywords: ["idea", "topic", "what to post", "content plan", "no idea", "inspiration", "niche", "what should i"],
        title: "Never Run Out of Content Ideas Workflow",
        tools: ["Claude", "AnswerThePublic", "TubeBuddy", "Exploding Topics", "Notion AI"],
        steps: [
          "Ask Claude: 'Give me 30 content ideas for [your niche] targeting [your audience]. Mix educational, entertaining, and controversial angles.'",
          "Use AnswerThePublic to find exactly what your audience is searching and asking — turn each question into a video/post.",
          "Check Exploding Topics weekly for trending topics in your niche before they go mainstream.",
          "Run a 'content sprint' with Claude: pick your best 5 ideas and ask it to expand each into a full content brief.",
          "Build a Notion content calendar with AI — paste your 30 ideas and ask Claude to schedule them strategically across the month.",
        ],
        prompts: [
          "Give me 30 content ideas for [niche] targeting [audience]. Mix educational, entertaining, and controversial.",
          "Turn this question into a full content brief with hook, outline, and CTA: [question].",
          "What trending topics in [niche] should I cover this month? Explain why each is relevant now.",
        ],
      },
      {
        keywords: ["edit", "editing", "cut", "caption", "subtitle", "video edit", "takes too long", "post-production"],
        title: "Edit Videos 5x Faster with AI Workflow",
        tools: ["Descript", "CapCut AI", "Adobe Premiere with AI", "Opus Clip", "Captions.ai"],
        steps: [
          "Record your raw footage, then upload to Descript — it transcribes automatically and lets you edit video by editing text.",
          "Use Descript's AI to remove filler words ('um', 'uh', pauses) in one click across the entire video.",
          "Upload your long video to Opus Clip — it uses AI to find the 5 most viral moments and cuts them into short clips.",
          "Use Captions.ai to add animated, styled captions automatically — no manual syncing required.",
          "Ask Claude to write 5 thumbnail headline variations and 3 video description options optimised for SEO.",
        ],
        prompts: [
          "Write 5 click-worthy YouTube thumbnail headlines for this video about: [topic].",
          "Write a YouTube description optimised for SEO for a video about [topic]. Include timestamps placeholder.",
          "Rewrite this script to be 30% shorter without losing the key points: [paste script].",
        ],
      },
      {
        keywords: ["grow", "audience", "followers", "subscribers", "views", "reach", "viral", "engagement", "algorithm"],
        title: "Grow Your Audience Systematically Workflow",
        tools: ["VidIQ", "Claude", "Metricool", "Taplio", "SparkToro"],
        steps: [
          "Use SparkToro to find out exactly where your target audience hangs out online — then show up there consistently.",
          "Install VidIQ to see exactly which keywords and topics are driving growth in your niche right now.",
          "Ask Claude: 'Analyse this top-performing post in my niche and tell me why it works: [paste post].'",
          "Use Metricool to schedule content at the optimal time for your audience's timezone and activity patterns.",
          "Build a 'collab list' — ask Claude to find 20 creators in your niche with similar audience size for potential collaborations.",
        ],
        prompts: [
          "Analyse this viral post and explain why it worked, then give me a template I can replicate: [paste post].",
          "Write a collaboration pitch DM to a creator in my niche for a [content type] collab.",
          "Give me a 30-day growth plan for [platform] in the [niche] niche, starting from [follower count].",
        ],
      },
      {
        keywords: ["script", "write", "writing", "narration", "voiceover", "outline", "copy"],
        title: "Write Viral Scripts in Minutes Workflow",
        tools: ["Claude", "ChatGPT", "Notion AI", "Hemingway Editor", "VEED.io"],
        steps: [
          "Start with a hook — ask Claude: 'Write 10 different hooks for a video about [topic]. Make each one use a different hook style.'",
          "Ask Claude to write a full script using the PSA framework: Problem, Solution, Action — optimised for [your platform].",
          "Paste the script into Hemingway Editor to ensure it reads at a Grade 6 level — simpler scripts perform better.",
          "Ask Claude to rewrite any complex sections: 'Simplify this paragraph so a 14-year-old can understand it.'",
          "Record a rough read-through, transcribe it, and ask Claude: 'What parts sound unnatural? Rewrite them to sound more conversational.'",
        ],
        prompts: [
          "Write 10 different hooks for a video about [topic] — use a different hook style for each.",
          "Write a full 60-second script about [topic] for [platform] using the Problem-Solution-Action framework.",
          "Rewrite this script section to sound more natural and conversational: [paste section].",
        ],
      },
      {
        keywords: ["repurpose", "reuse", "multi-platform", "linkedin", "twitter", "instagram", "tiktok", "shorts", "clip"],
        title: "Repurpose One Piece of Content Everywhere Workflow",
        tools: ["Opus Clip", "Claude", "Repurpose.io", "Taplio", "Canva AI"],
        steps: [
          "Record or write one long-form piece of content (video, podcast, or blog post) — this is your content pillar.",
          "Upload to Opus Clip to auto-generate 10 short clips for TikTok, Reels, and YouTube Shorts.",
          "Paste the transcript into Claude: 'Turn this into a LinkedIn post, a Twitter/X thread, and an Instagram caption.'",
          "Use Canva AI to generate platform-specific graphics from your key quotes and statistics.",
          "Use Repurpose.io to automate distribution — one upload goes to all platforms simultaneously.",
        ],
        prompts: [
          "Turn this transcript into: 1) a LinkedIn post, 2) a Twitter/X thread, 3) an Instagram caption: [paste transcript].",
          "Extract the 5 most quotable moments from this content and format them as standalone social posts: [paste content].",
          "Write a blog post based on this video transcript, optimised for SEO around the keyword [keyword]: [paste transcript].",
        ],
      },
    ],
  },

  marketing: {
    painPoints: [
      {
        keywords: ["ad", "copy", "ads", "facebook ad", "google ad", "headline", "creative", "paid", "ppc"],
        title: "Write High-Converting Ad Copy Workflow",
        tools: ["Claude", "AdCreative.ai", "Foreplay.co", "Jasper", "Meta Ads Library"],
        steps: [
          "Research competitors — use Meta Ads Library to find which ads in your niche are running longest (= they're working).",
          "Use Foreplay.co to save and organise winning ads as inspiration. Build a swipe file of the best hooks.",
          "Ask Claude: 'Write 5 Facebook ad variations for [product] targeting [audience]. Use a different angle for each.'",
          "Use AdCreative.ai to generate ad visuals with AI — it scores each creative for predicted performance.",
          "A/B test the top 2 copy variations. After 3 days, ask Claude to analyse results and suggest the next iteration.",
        ],
        prompts: [
          "Write 5 Facebook ad variations for [product] targeting [audience]. Use a different persuasion angle for each.",
          "Rewrite this ad headline to be more curiosity-driven and urgent: [paste headline].",
          "Give me 10 ad hooks for [product] — use fear, curiosity, social proof, controversy, and benefit-led angles.",
        ],
      },
      {
        keywords: ["email", "newsletter", "campaign", "sequence", "drip", "open rate", "subject line", "klaviyo", "mailchimp"],
        title: "Build Email Campaigns That Convert Workflow",
        tools: ["Claude", "Klaviyo", "Beehiiv", "Mailmodo", "Smartlead"],
        steps: [
          "Ask Claude to map your email sequence: 'Design a 7-email welcome sequence for [product type] that moves subscribers from awareness to purchase.'",
          "Write subject lines using the AI: 'Give me 20 subject line options for this email. Mix curiosity, benefit, urgency, and personalization styles.'",
          "Draft each email body with Claude using the AIDA framework: Attention, Interest, Desire, Action.",
          "Use Klaviyo's AI features to segment your list automatically based on behaviour and purchase history.",
          "After sending, paste your performance data into Claude: 'My open rate is X% and CTR is Y%. What should I change?'",
        ],
        prompts: [
          "Design a 7-email welcome sequence for [product] that takes subscribers from awareness to first purchase.",
          "Write 20 subject line variations for an email about [topic] — mix curiosity, benefit, urgency, and personalisation.",
          "Write a re-engagement email for subscribers who haven't opened in 60 days. Make it compelling and human.",
        ],
      },
      {
        keywords: ["social media", "post", "instagram", "linkedin", "content calendar", "social", "organic"],
        title: "Social Media Content at Scale Workflow",
        tools: ["Claude", "Buffer", "Metricool", "Canva AI", "Taplio"],
        steps: [
          "Ask Claude: 'Create a 30-day social media content calendar for [brand] on [platform]. Include post type, topic, and goal for each day.'",
          "Batch-write all posts in one session — give Claude your brand voice guide and ask it to write all 30 posts at once.",
          "Use Canva AI to generate on-brand visuals for each post type — templates massively speed up production.",
          "Schedule everything in Buffer or Metricool — set optimal posting times per platform automatically.",
          "Each week, review which posts performed best and ask Claude: 'Why did this post outperform? Give me 5 variations to test.'",
        ],
        prompts: [
          "Create a 30-day content calendar for [brand] on [platform]. Include post type, topic, angle, and goal.",
          "Write 10 LinkedIn posts for [brand] in [brand voice] about the topic of [topic].",
          "Analyse this high-performing post and give me 5 variations to test: [paste post + stats].",
        ],
      },
      {
        keywords: ["competitor", "research", "market research", "analysis", "competitor analysis", "spy", "benchmark"],
        title: "Competitor Research & Positioning Workflow",
        tools: ["Perplexity AI", "Similarweb", "Semrush", "Claude", "Crayon"],
        steps: [
          "List your top 5 competitors, then ask Claude: 'Analyse these brands and identify their key messaging, target audience, and positioning gaps.'",
          "Use Semrush to find every keyword your competitors rank for but you don't — these are your traffic opportunities.",
          "Use Similarweb to benchmark their traffic sources — discover which channels are driving the most visitors.",
          "Ask Claude: 'Based on this competitive landscape, what positioning should [my brand] own that nobody else is claiming?'",
          "Set up Crayon to monitor competitor website changes, pricing updates, and new campaigns automatically.",
        ],
        prompts: [
          "Analyse these 5 competitors and identify their messaging, weaknesses, and positioning gaps: [list competitors].",
          "Based on this competitive landscape, what unique positioning could my brand own? [describe market].",
          "Write a competitive battle card for our sales team comparing us to [competitor] across 10 dimensions.",
        ],
      },
      {
        keywords: ["analytics", "data", "report", "roi", "metrics", "performance", "dashboard", "kpi", "results"],
        title: "Turn Campaign Data into Insights Workflow",
        tools: ["Claude", "Google Analytics 4", "Looker Studio", "Triple Whale", "ChatGPT with Code Interpreter"],
        steps: [
          "Export your campaign data as a CSV, then upload to Claude or ChatGPT: 'Analyse this data and tell me the top 3 insights I should act on.'",
          "Use Looker Studio to build a live marketing dashboard that updates automatically from all your ad platforms.",
          "Ask Claude to write the narrative for your monthly report: 'Turn these metrics into a CMO-ready executive summary.'",
          "Use Triple Whale (for ecommerce) to get AI-powered attribution across all channels in one view.",
          "Ask Claude: 'Based on these results, where should I reallocate budget to maximise ROAS next month?'",
        ],
        prompts: [
          "Analyse this campaign data and give me the top 3 actionable insights: [paste data or CSV].",
          "Write a CMO-ready executive summary for this month's marketing performance: [paste metrics].",
          "Based on these results, how should I reallocate my $[budget] marketing budget next month to maximise ROI?",
        ],
      },
    ],
  },

  student: {
    painPoints: [
      {
        keywords: ["understand", "confused", "explain", "concept", "topic", "hard", "difficult", "don't get", "what is", "how does"],
        title: "Master Any Concept Faster Workflow",
        tools: ["Claude", "Perplexity AI", "NotebookLM", "Feynman Technique", "Khan Academy"],
        steps: [
          "Ask Claude: 'Explain [concept] to me like I'm 16 years old. Use an everyday analogy I can relate to.'",
          "After the explanation, ask: 'Now give me the technical version. What do I need to know for an exam?'",
          "Use the Feynman method via AI: 'I'm going to explain [concept] back to you. Tell me where my understanding breaks down.' Then explain it yourself.",
          "Use NotebookLM — upload your lecture notes and ask it to explain confusing sections in plain English.",
          "Ask Claude to quiz you: 'Give me 10 exam-style questions on [concept] with answers so I can self-test.'",
        ],
        prompts: [
          "Explain [concept] like I'm 16. Use an analogy from everyday life.",
          "I'm going to explain [concept] back to you. Identify any gaps or mistakes in my understanding: [your explanation].",
          "Give me 10 exam-style questions on [concept] with model answers.",
        ],
      },
      {
        keywords: ["essay", "write", "writing", "assignment", "paper", "thesis", "argument", "draft", "paragraph"],
        title: "Write Top-Grade Essays Efficiently Workflow",
        tools: ["Claude", "Notion AI", "Grammarly", "Hemingway Editor", "Perplexity AI"],
        steps: [
          "Start with structure — ask Claude: 'Give me a strong essay outline for the question: [question]. Include a thesis statement and 3 arguments.'",
          "Research each argument using Perplexity AI — it provides sources you can actually cite.",
          "Draft one section at a time. Ask Claude: 'Write a 150-word paragraph arguing [point] with evidence. Academic tone.'",
          "Use Grammarly for grammar and Hemingway Editor to simplify overly complex sentences.",
          "Ask Claude to review your full draft: 'Improve the flow, check argument consistency, and suggest a stronger conclusion.'",
        ],
        prompts: [
          "Give me a strong essay outline for: [essay question]. Include thesis and 3 main arguments with sub-points.",
          "Write a 150-word academic paragraph arguing [point] with evidence. Use formal tone.",
          "Review this essay draft for flow, argument strength, and suggest a better conclusion: [paste draft].",
        ],
      },
      {
        keywords: ["exam", "revision", "revise", "study", "memorise", "flashcard", "test prep", "gcse", "a-level", "finals"],
        title: "Exam Revision on Steroids Workflow",
        tools: ["Claude", "Anki", "NotebookLM", "Quizlet AI", "Pomodoro Timer"],
        steps: [
          "Upload all your notes to NotebookLM — ask it to generate a study guide with the most important points from each topic.",
          "Ask Claude: 'Turn these notes into 20 Anki flashcard pairs in Q&A format': [paste notes]. Import into Anki.",
          "Use spaced repetition in Anki — it shows you cards right before you're about to forget them.",
          "Ask Claude to create a mock exam: 'Write a 45-minute practice exam on [subject/topic] with a mark scheme.'",
          "After taking the mock, paste your answers: 'Mark my answers and explain where I lost marks and why.'",
        ],
        prompts: [
          "Turn these notes into 20 Anki flashcard Q&A pairs: [paste notes].",
          "Write a 45-minute mock exam on [topic] with a full mark scheme.",
          "Mark these exam answers and explain where marks were lost: [paste questions + my answers].",
        ],
      },
      {
        keywords: ["research", "citation", "reference", "source", "bibliography", "literature review", "find papers", "academic"],
        title: "Research & Citations Done Fast Workflow",
        tools: ["Perplexity AI", "Consensus.app", "Elicit", "Zotero", "Claude"],
        steps: [
          "Use Consensus.app to find peer-reviewed research — it searches academic papers and summarises findings for you.",
          "Use Elicit to ask research questions and get AI-synthesised answers from academic sources with citations.",
          "Ask Claude: 'Summarise the academic debate around [topic] and list the main schools of thought.'",
          "Use Zotero to save, organise, and auto-format all your references in any citation style (APA, MLA, Harvard).",
          "Ask Claude to write your literature review section: 'Write a 300-word lit review on [topic] based on these sources: [paste summaries].'",
        ],
        prompts: [
          "Summarise the academic debate around [topic] and outline the main schools of thought.",
          "Write a 300-word literature review on [topic] synthesising these sources: [paste source summaries].",
          "Generate a properly formatted APA/Harvard reference list from these sources: [paste source details].",
        ],
      },
      {
        keywords: ["math", "maths", "physics", "chemistry", "science", "equation", "solve", "calculation", "formula", "problem"],
        title: "Solve Complex STEM Problems Workflow",
        tools: ["Claude", "Wolfram Alpha", "Photomath", "Khan Academy AI", "Desmos"],
        steps: [
          "Take a photo of the problem or type it out, then ask Claude: 'Solve this step-by-step, explaining the reasoning at each step.'",
          "Use Wolfram Alpha to verify the answer and see alternative solution methods.",
          "Ask Claude: 'Now solve a similar problem so I can practice the same method: [describe type of problem].'",
          "Use Desmos to visualise graphs, equations, and functions — understanding visually often unlocks conceptual understanding.",
          "Ask Claude to create a formula sheet: 'Give me all the formulas I need to know for [topic] in a clear format.'",
        ],
        prompts: [
          "Solve this problem step-by-step, explaining your reasoning at every step: [paste problem].",
          "Create a similar practice problem to this one so I can test myself, then give me the solution: [paste original].",
          "Give me all the key formulas for [topic] in a revision-friendly format with a brief explanation of when to use each.",
        ],
      },
    ],
  },

  startupFounder: {
    painPoints: [
      {
        keywords: ["validate", "idea", "market fit", "pmf", "research", "customer discovery", "should i build", "viable", "demand"],
        title: "Validate Your Startup Idea in 48 Hours Workflow",
        tools: ["Claude", "Typeform", "Reddit", "Sparktoro", "Lenny's Newsletter"],
        steps: [
          "Ask Claude: 'Play devil's advocate. Give me the 10 strongest reasons my startup idea will fail: [describe idea].'",
          "Use Reddit and online communities to find 20 people experiencing the problem — read their exact words.",
          "Build a 5-question Typeform survey in 20 minutes and share it in relevant communities to collect 50+ responses.",
          "Ask Claude to analyse your survey results: 'What patterns do you see in these responses? What's the core pain?'",
          "Run 5 customer discovery calls. Ask Claude to generate your interview script first: 'Write 10 open-ended questions to validate [problem].'",
        ],
        prompts: [
          "Give me the 10 strongest reasons this startup idea will fail. Be brutally honest: [describe idea].",
          "Write a 10-question customer discovery interview script to validate [problem] with [target customer].",
          "Analyse these survey responses and identify the core pain point and willingness to pay signals: [paste responses].",
        ],
      },
      {
        keywords: ["landing page", "website", "copy", "homepage", "value proposition", "above the fold", "messaging", "positioning"],
        title: "Write Landing Page Copy That Converts Workflow",
        tools: ["Claude", "v0 by Vercel", "Unbounce", "Hotjar", "Copy.ai"],
        steps: [
          "Define your positioning: ask Claude 'Write a one-liner for [startup] that clearly explains what we do, who it's for, and the outcome in 10 words.'",
          "Ask Claude to write full landing page copy: headline, sub-headline, 3 benefit sections, social proof placeholder, and CTA.",
          "Use v0 to scaffold the landing page UI in minutes — paste the copy in directly.",
          "Install Hotjar on day 1 to record visitor sessions and identify where people drop off.",
          "After 100 visitors, ask Claude: 'Based on these heatmap observations, what copy or layout changes should I test?'",
        ],
        prompts: [
          "Write a 10-word value proposition for [startup] that explains what we do, who it's for, and the outcome.",
          "Write full landing page copy for [startup]: headline, sub-headline, 3 benefit sections, and a strong CTA.",
          "Rewrite this landing page headline to be more specific and outcome-focused: [paste current headline].",
        ],
      },
      {
        keywords: ["customer", "first customer", "sales", "acquire", "outreach", "b2b", "lead", "prospect", "revenue", "paying"],
        title: "Land Your First 10 Customers Workflow",
        tools: ["Claude", "Apollo.io", "LinkedIn Sales Navigator", "Smartlead", "Lemlist"],
        steps: [
          "Define your ICP (Ideal Customer Profile) with Claude: 'Describe in detail the exact person or company most likely to pay for [product] today.'",
          "Use Apollo.io to find 100 leads matching your ICP — filter by company size, industry, and job title.",
          "Ask Claude to write your outreach sequence: 'Write a 3-email cold outreach sequence for [ICP] about [problem you solve]. Make it feel human.'",
          "Use Lemlist or Smartlead to personalise and send at scale — track opens, clicks, and replies.",
          "After first replies, ask Claude: 'Write a follow-up to this cold email reply that moves toward a call: [paste reply].'",
        ],
        prompts: [
          "Describe my ideal first customer in detail — the exact person most likely to pay for [product] today.",
          "Write a 3-email cold outreach sequence for [ICP] about [problem]. Make it feel personal, not salesy.",
          "Write a follow-up to this positive cold email reply that books a discovery call: [paste reply].",
        ],
      },
      {
        keywords: ["pitch", "deck", "investor", "fundraise", "raise", "vc", "slides", "presentation", "funding"],
        title: "Build a Fundable Pitch Deck Workflow",
        tools: ["Claude", "Tome", "Beautiful.ai", "DocSend", "Crunchbase"],
        steps: [
          "Ask Claude to outline your pitch deck: 'Create a 12-slide pitch deck outline for [startup] following the YC format.'",
          "For each slide, ask Claude to write the narrative: 'Write the content for the Problem slide. Make it visceral and data-backed.'",
          "Use Tome or Beautiful.ai to design the slides with AI — paste Claude's copy and let it format beautifully.",
          "Ask Claude to stress-test your deck: 'What are the 10 hardest questions an investor will ask about this pitch?'",
          "Use DocSend to share the deck — it tells you exactly which slides investors spend time on and which they skip.",
        ],
        prompts: [
          "Create a 12-slide pitch deck outline for [startup] following the YC format.",
          "Write the investor narrative for the Problem slide. Make it visceral, specific, and backed by data: [describe problem].",
          "Give me the 10 hardest questions an investor will ask about this pitch and help me prepare answers: [describe startup].",
        ],
      },
      {
        keywords: ["hire", "hiring", "team", "delegate", "job description", "recruit", "co-founder", "freelancer", "outsource"],
        title: "Hire & Delegate Like a Pro Workflow",
        tools: ["Claude", "Notion", "Loom", "Contra", "Linear"],
        steps: [
          "Ask Claude: 'Write a job description for a [role] at an early-stage startup. Focus on what they'll own, not just responsibilities.'",
          "Use Loom to record SOPs (Standard Operating Procedures) for every task you want to delegate — don't write, just talk.",
          "Ask Claude to turn your Loom transcript into a written SOP: 'Format this into a clear step-by-step process doc.'",
          "Use Contra to find and hire vetted freelancers for specific tasks — great for pre-product-market-fit stages.",
          "After hiring, use Linear to manage projects and ask Claude to write the onboarding plan: 'Write a 30-60-90 day onboarding plan for a [role] joining a startup.'",
        ],
        prompts: [
          "Write a compelling job description for a [role] at an early-stage startup. Focus on ownership, not just tasks.",
          "Turn this rough process description into a clear, step-by-step SOP a new hire can follow: [paste description].",
          "Write a 30-60-90 day onboarding plan for a [role] joining a [stage] startup in the [industry] space.",
        ],
      },
    ],
  },
};

/* ─── KEYWORD MATCHING ─────────────────────────────────────────── */
function matchPainPoint(role: Role, input: string): WorkflowData {
  const lower = input.toLowerCase();
  const painPoints = workflowMap[role].painPoints;

  // Find best match by counting keyword hits
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

/* ─── ROLES ────────────────────────────────────────────────────── */
const roles: { key: Role; label: string; icon: string; description: string }[] = [
  { key: "developer",      label: "Developer", icon: "⌥", description: "Build & ship faster" },
  { key: "contentCreator", label: "Creator",   icon: "◈", description: "Grow your audience" },
  { key: "marketing",      label: "Marketing", icon: "◎", description: "Scale campaigns" },
  { key: "student",        label: "Student",   icon: "◇", description: "Learn smarter" },
  { key: "startupFounder", label: "Founder",   icon: "⬡", description: "Execute your vision" },
];

/* ─── LOGO ─────────────────────────────────────────────────────── */
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

/* ─── TYPING DOTS ──────────────────────────────────────────────── */
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

/* ─── TOOL BADGE ───────────────────────────────────────────────── */
function ToolBadge({ tool }: { tool: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70 hover:border-[#6366f1]/50 hover:text-white/90 transition-all duration-200 cursor-default">
      <span className="w-1 h-1 rounded-full bg-[#6366f1]" />
      {tool}
    </span>
  );
}

/* ─── EMAIL MODAL ──────────────────────────────────────────────── */
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

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
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
  const [showPrompts, setShowPrompts]         = useState(false);

  const inputRef  = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setAnimateIn(true); }, []);

  // Stream steps
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
      }, 280);
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
    setShowPrompts(false);
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
    setShowPrompts(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const hideInput = showResult;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {showEmail && !isSignedIn && (
        <EmailModal onClose={() => setShowEmail(false)} source={emailSource} />
      )}

      {/* BG */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)" }} />
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.015) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06]"
        style={{ opacity: animateIn ? 1 : 0, transform: animateIn ? "none" : "translateY(-8px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-sm font-semibold tracking-tight text-white/90">Crazly</span>
          </Link>
          <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/20 font-medium">Workflow AI</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {selectedRole ? (
            <button className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/60"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}
              onClick={() => setDrawerOpen(true)}>
              <span style={{ fontFamily: "monospace" }}>{roles.find(r => r.key === selectedRole)?.icon}</span>
              {roles.find(r => r.key === selectedRole)?.label}
              <svg className="w-3 h-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
          ) : (
            <button className="lg:hidden px-3 py-1.5 rounded-xl text-xs font-medium text-white/50"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              onClick={() => setDrawerOpen(true)}>Pick role ↓</button>
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

      {/* ── MOBILE DRAWER ──────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-30 bg-black/60" style={{ backdropFilter: "blur(4px)" }}
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
                    style={{ background: active ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)", border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-lg" style={{ fontFamily: "monospace", color: active ? "#a5b4fc" : "rgba(255,255,255,0.3)" }}>{role.icon}</span>
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

      {/* ── LAYOUT ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col lg:flex-row flex-1 max-w-7xl mx-auto w-full">

        {/* Sidebar */}
        <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col p-6 border-r border-white/[0.06]"
          style={{ opacity: animateIn ? 1 : 0, transform: animateIn ? "none" : "translateX(-12px)", transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s" }}>
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-4">Select your role</p>
          <div className="flex flex-col gap-2">
            {roles.map(role => {
              const active = selectedRole === role.key;
              return (
                <button key={role.key} onClick={() => handleRoleSelect(role.key)}
                  className="group relative flex items-center gap-3 w-full text-left px-3.5 py-3 rounded-xl transition-all duration-200"
                  style={{ background: active ? "rgba(99,102,241,0.12)" : "transparent", border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid transparent" }}>
                  {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#6366f1]" />}
                  <span className="text-base text-white/40 group-hover:text-white/60 transition-colors" style={{ fontFamily: "monospace" }}>{role.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium leading-tight ${active ? "text-white" : "text-white/60 group-hover:text-white/80"} transition-colors`}>{role.label}</p>
                    <p className="text-[11px] text-white/30 truncate">{role.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-8 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <p className="text-xs font-semibold text-white/70 mb-1">Go Pro</p>
            <p className="text-[11px] text-white/35 mb-3 leading-relaxed">Unlock exact prompts, scripts & templates for every workflow.</p>
            <Link href="/pricing" className="block text-center py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>See plans →</Link>
          </div>
        </aside>

        {/* Chat */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">

            {/* Empty state */}
            {!selectedRole && (
              <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center px-4"
                style={{ opacity: animateIn ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(129,140,248,0.1))", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <span className="text-xl sm:text-2xl">⚡</span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white/80 mb-2">Ready to execute.</h2>
                <p className="text-sm text-white/35 max-w-xs leading-relaxed hidden lg:block">Pick your role on the left, then describe the problem you're solving.</p>
                <p className="text-sm text-white/35 max-w-xs leading-relaxed lg:hidden">Tap "Pick role" above to get started.</p>
                <button className="lg:hidden mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
                  onClick={() => setDrawerOpen(true)}>Pick your role →</button>
              </div>
            )}

            {/* AI greeting */}
            {selectedRole && !showResult && !isTyping && (
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>AI</div>
                <div className="flex-1">
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl rounded-tl-sm text-sm text-white/75 leading-relaxed"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {isSignedIn && user?.firstName ? (
                      <>Hey <span className="text-[#818cf8] font-medium">{user.firstName}</span>! You're a <span className="text-[#818cf8] font-medium">{roles.find(r => r.key === selectedRole)?.label}</span> — tell me exactly what you're stuck on and I'll build your workflow.</>
                    ) : (
                      <>Hey! You're a <span className="text-[#818cf8] font-medium">{roles.find(r => r.key === selectedRole)?.label}</span> — tell me what you're stuck on. I'll generate your exact AI workflow, tools, and prompts.</>
                    )}
                  </div>
                  {/* Hint chips */}
                  <div className="flex flex-wrap gap-2 mt-2.5 ml-1">
                    {workflowMap[selectedRole].painPoints.map((pp, i) => (
                      <button key={i}
                        onClick={() => {
                          setInput(pp.keywords[0]);
                          setTimeout(() => inputRef.current?.focus(), 50);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-full text-white/40 hover:text-white/70 transition-all"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {pp.title.split(" ").slice(0, 3).join(" ")}…
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
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold bg-white/10 text-white/60">You</div>
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

            {/* Workflow result */}
            {showResult && currentWorkflow && (
              <div className="flex items-start gap-2.5 sm:gap-3 max-w-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>AI</div>
                <div className="flex-1 min-w-0">

                  {/* Title */}
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl rounded-tl-sm mb-2.5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[10px] uppercase tracking-widest text-[#6366f1] font-semibold mb-1">Workflow generated</p>
                    <p className="text-sm font-semibold text-white/90">{currentWorkflow.title}</p>
                  </div>

                  {/* Tools */}
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl mb-2.5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-2.5">Recommended Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {currentWorkflow.tools.map((tool, i) => <ToolBadge key={i} tool={tool} />)}
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl mb-2.5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">Execution Steps</p>
                    <div className="space-y-3">
                      {currentWorkflow.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2.5 sm:gap-3 transition-all duration-300"
                          style={{ opacity: i < visibleSteps ? 1 : 0, transform: i < visibleSteps ? "none" : "translateY(6px)" }}>
                          <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                            style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}>{i + 1}</div>
                          <p className="text-xs sm:text-sm text-white/65 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prompts — blurred/locked for non-Pro */}
                  <div className="px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-2xl mb-2.5 relative overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3">Exact Prompts to Use</p>
                    <div className={`space-y-2.5 ${!isSignedIn ? "select-none" : ""}`}>
                      {currentWorkflow.prompts.map((prompt, i) => (
                        <div key={i} className="relative">
                          <div className={`px-3 py-2.5 rounded-xl text-xs text-white/60 leading-relaxed ${!isSignedIn ? "blur-sm" : ""}`}
                            style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                            <span className="text-[#818cf8] font-medium mr-1.5">Prompt {i + 1}:</span>{prompt}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Lock overlay for non-signed-in */}
                    {!isSignedIn && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
                        style={{ background: "rgba(8,8,8,0.7)", backdropFilter: "blur(2px)" }}>
                        <div className="text-center px-4">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2"
                            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                          </div>
                          <p className="text-xs font-semibold text-white mb-2">Prompts are Pro-only</p>
                          <Link href="/pricing" className="text-[11px] px-3 py-1.5 rounded-lg font-semibold"
                            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
                            Unlock with Pro →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-white/20 mt-2 ml-1">Crazly AI · now</p>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── BOTTOM BAR ─────────────────────────────────────────── */}
          {selectedRole && (
            <>
              {hideInput ? (
                <div className="px-4 sm:px-6 py-4 border-t border-white/[0.06]"
                  style={{ background: "rgba(8,8,8,0.95)", backdropFilter: "blur(16px)" }}>
                  <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-4 rounded-2xl"
                    style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(129,140,248,0.06))", border: "1px solid rgba(99,102,241,0.3)" }}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white leading-tight">Unlock unlimited workflows + exact prompts</p>
                        <p className="text-xs text-white/40 mt-0.5">Pro plan · $9/mo or ₹749/mo · Cancel anytime</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <Link href="/pricing"
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold text-white text-center transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", boxShadow: "0 4px 20px rgba(99,102,241,0.35)" }}>
                        Get Pro →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-white/[0.06]"
                  style={{ background: "rgba(8,8,8,0.8)", backdropFilter: "blur(12px)" }}>
                  <div className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    <input ref={inputRef}
                      placeholder={`Describe your ${roles.find(r => r.key === selectedRole)?.label.toLowerCase()} problem...`}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleGenerate()}
                      disabled={isTyping}
                      className="flex-1 bg-transparent text-base sm:text-sm text-white/80 placeholder:text-white/25 outline-none disabled:opacity-50" />
                    <button onClick={handleGenerate} disabled={!input.trim() || isTyping}
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30 active:scale-90"
                      style={{ background: input.trim() && !isTyping ? "linear-gradient(135deg, #6366f1, #818cf8)" : "rgba(255,255,255,0.08)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[10px] text-white/20 text-center mt-2">
                    Press Enter to generate · Crazly matches your problem to the best workflow
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