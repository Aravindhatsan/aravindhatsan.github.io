// ─────────────────────────────────────────────────────────────
//  Edit this file to personalise your portfolio.
//  Everything on the page is rendered from this object.
//  Fields left empty ("" or []) are hidden automatically.
// ─────────────────────────────────────────────────────────────
window.PORTFOLIO = {
  name: "Aravindh",
  role: "Software Developer",
  location: "",
  tagline:
    "I build clean, reliable software and enjoy turning ideas into things people can actually use.",

  // Short paragraphs shown in the About section.
  about: [
    "I'm a developer who likes working across the stack — from designing small, focused interfaces to wiring up the services behind them.",
    "I care about readable code, fast feedback loops, and shipping work that holds up over time. Outside of work I'm usually learning a new tool or tinkering on a side project.",
  ],

  // Links shown in the header and contact section.
  links: {
    email: "aravindhatsan15@gmail.com",
    github: "https://github.com/aravindhatsan",
    linkedin: "",
    twitter: "",
    resume: "", // e.g. "resume.pdf" — drop the file in the repo root
  },

  skills: [
    { group: "Languages", items: ["JavaScript", "TypeScript", "Python", "HTML", "CSS", "SQL"] },
    { group: "Frameworks", items: ["React", "Node.js", "Express"] },
    { group: "Tools", items: ["Git", "GitHub Actions", "Docker", "Linux"] },
  ],

  // Hand-picked projects. Shown first, before repos pulled from GitHub.
  featured: [
    {
      title: "Personal Portfolio",
      description:
        "This site — a fast, dependency-free portfolio with light/dark themes and live GitHub project listing.",
      tags: ["HTML", "CSS", "JavaScript"],
      repo: "https://github.com/aravindhatsan/aravindhatsan.github.io",
      demo: "https://aravindhatsan.github.io",
    },
  ],

  // Also list your public GitHub repositories (fetched live in the browser).
  githubRepos: {
    enabled: true,
    username: "aravindhatsan",
    max: 6,
    exclude: ["aravindhatsan.github.io", "aravindhatsan"], // featured repos + profile README repo
  },

  experience: [
    // {
    //   role: "Software Engineer",
    //   org: "Company Name",
    //   period: "2023 — Present",
    //   points: ["What you built or improved.", "Measurable impact if you have it."],
    // },
  ],
};
