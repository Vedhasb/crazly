export type Role = "developer" | "contentCreator" | "marketing" | "student" | "startupFounder";

export type Workflow = {
  title: string;
  tools: string[];
  steps: string[];
};

export const workflows: Record<Role, Workflow> = {
  developer: {
    title: "AI-Powered Development Workflow",
    tools: ["GitHub Copilot", "ChatGPT", "Cursor", "Warp Terminal", "Codeium"],
    steps: [
      "Use Cursor or Copilot to scaffold boilerplate code and project structure.",
      "Describe the feature in plain English and let AI generate the first draft.",
      "Run AI-assisted code review to catch bugs and suggest optimizations.",
      "Use AI to auto-generate unit tests and edge case coverage.",
      "Ask AI to write inline documentation and README sections.",
      "Deploy with AI-generated CI/CD pipeline configurations.",
    ],
  },
  contentCreator: {
    title: "AI Content Creation Workflow",
    tools: ["ChatGPT", "Jasper", "Descript", "Canva AI", "ElevenLabs"],
    steps: [
      "Use AI to brainstorm 10 content ideas based on your niche and trending topics.",
      "Generate a full content outline with hooks, body points, and CTA.",
      "Write a first draft using AI, then edit for your personal voice.",
      "Use Descript to auto-transcribe, edit audio/video by editing text.",
      "Generate on-brand thumbnails and visuals using Canva AI.",
      "Schedule and repurpose content across platforms using AI suggestions.",
    ],
  },
  marketing: {
    title: "AI Marketing Automation Workflow",
    tools: ["HubSpot AI", "Jasper", "Surfer SEO", "AdCreative.ai", "Zapier"],
    steps: [
      "Use AI to define your ICP (Ideal Customer Profile) and segment your audience.",
      "Generate SEO-optimized blog posts and landing page copy with Surfer SEO.",
      "Create multiple ad variations instantly using AdCreative.ai.",
      "Set up automated email sequences with AI-personalized subject lines and body.",
      "Use AI analytics to identify top-performing campaigns and double down.",
      "Automate lead scoring and CRM updates using Zapier + HubSpot AI.",
    ],
  },
  student: {
    title: "AI-Assisted Learning Workflow",
    tools: ["ChatGPT", "Notion AI", "Anki", "Wolfram Alpha", "Grammarly"],
    steps: [
      "Paste lecture notes into Notion AI to get a clean summary and key takeaways.",
      "Ask ChatGPT to explain complex concepts using simple analogies.",
      "Generate practice questions and flashcards from your notes using AI.",
      "Use Wolfram Alpha for step-by-step solutions to math and science problems.",
      "Draft essays with AI assistance, then refine and fact-check manually.",
      "Use Grammarly AI to polish final submissions for grammar and clarity.",
    ],
  },
  startupFounder: {
    title: "AI Startup Building Workflow",
    tools: ["ChatGPT", "Notion AI", "Mixpanel", "Copy.ai", "Fireflies.ai"],
    steps: [
      "Use AI to validate your idea by generating a SWOT analysis and competitor overview.",
      "Draft your pitch deck outline and investor narrative with ChatGPT.",
      "Generate a lean product roadmap and prioritize features using AI scoring.",
      "Use Copy.ai to write landing page copy, cold emails, and social ads.",
      "Record all meetings with Fireflies.ai for auto-transcription and action items.",
      "Analyze user behavior with Mixpanel and ask AI to interpret drop-off patterns.",
    ],
  },
};