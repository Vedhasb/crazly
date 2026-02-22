export type WorkflowRole =
  | "developer"
  | "contentCreator"
  | "marketing"
  | "student"
  | "startupFounder";

export const workflows: Record<
  WorkflowRole,
  { title: string; tools: string[]; steps: string[] }
> = {
  developer: {
    title: "Frontend UI Improvement",
    tools: [
      "v0.dev",
      "Tailwind CSS",
      "Framer Motion",
      "Cursor IDE"
    ],
    steps: [
      "Describe UI idea in v0.dev",
      "Generate React component",
      "Refine styling using Tailwind",
      "Add animations using Framer Motion",
      "Optimize using Cursor suggestions"
    ]
  },

  contentCreator: {
    title: "Content Creation Workflow",
    tools: ["Canva", "Descript", "CapCut", "ChatGPT"],
    steps: [
      "Draft script with AI",
      "Create visuals in Canva",
      "Edit audio/video in Descript & CapCut",
      "Publish and repurpose"
    ]
  },

  marketing: {
    title: "Campaign & Copy Workflow",
    tools: ["Jasper", "Mailchimp", "Google Analytics", "Notion"],
    steps: [
      "Define audience and goals",
      "Generate copy with Jasper",
      "Set up campaign in Mailchimp",
      "Track and iterate with analytics"
    ]
  },

  student: {
    title: "Assignment & Research Workflow",
    tools: [
      "ChatGPT",
      "Perplexity",
      "Notion AI"
    ],
    steps: [
      "Ask ChatGPT for structured outline",
      "Use Perplexity for research sources",
      "Summarize using Notion AI",
      "Convert into final assignment format"
    ]
  },

  startupFounder: {
    title: "Startup Ops & Pitch Workflow",
    tools: ["Notion", "Pitch", "Loom", "Linear"],
    steps: [
      "Outline pitch structure",
      "Build deck in Pitch",
      "Record demo with Loom",
      "Track tasks in Linear"
    ]
  }
};