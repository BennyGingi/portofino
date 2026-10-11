// All copy for the /v2 demo lives here. Source of truth pulled from
// components/Projects.tsx and components/Experience.tsx (PM2 / IIS removed per spec).

export const META = {
  location: "Holon, Israel",
  availability: "Open to SOC & security engineering roles",
  email: "gingi2603@gmail.com",
  linkedin: "https://www.linkedin.com/in/benny-gingihasvili/",
  linkedinLabel: "linkedin.com/in/benny-gingihasvili/",
  github: "https://github.com/BennyGingi",
  githubLabel: "github.com/BennyGingi",
  cv: "/benny-cv-2026-08.pdf",
};

export const HERO = {
  line1: "Signal in",
  line2: "the Noise",
  subline:
    "SOC analyst and full-stack engineer. I find the signal in the alert noise, and build the tools that find it faster.",
};

export const STATEMENT =
  "Fourteen months triaging alerts in an enterprise SOC at Mobileye, building the internal tooling the team used daily.";

// Selected Work — editorial rows, order per spec. Copy/links from Projects.tsx.
export type WorkItem = {
  number: string;
  title: string;
  outcome: string;
  stack: string[];
  url?: string;
  live?: string; // visible label for the live link
};

export const WORK: WorkItem[] = [
  {
    number: "01",
    title: "SOC Portal",
    outcome:
      "Enterprise SOC dashboard serving a full analyst team across 1000+ endpoints — ML-assisted phishing triage, SSO-gated admin, automated screenshot capture.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "SSO", "Puppeteer", "CI/CD"],
  },
  {
    number: "02",
    title: "FoodCritic",
    outcome:
      "Full-stack food social network — 7-plate rating system, real-time feed, interactive map, referral rewards, 45 e2e tests passing.",
    stack: ["Next.js 14", "TypeScript", "Supabase", "Mantine UI", "Leaflet.js", "PostgreSQL"],
    url: "https://foodcritic.bennygingi.tech",
    live: "Live",
  },
  {
    number: "03",
    title: "VOID RUNNER",
    outcome:
      "Cyberpunk canvas space shooter — 12 weapons, shop system, wave-based enemies, global leaderboard. Pure canvas rendering.",
    stack: ["Next.js", "Canvas API", "TypeScript"],
    url: "https://void-runner.bennygingi.tech",
    live: "Live",
  },
  {
    number: "04",
    title: "Visit Georgia",
    outcome:
      "Multilingual tourism platform — English, Hebrew (RTL), Russian. WhatsApp booking integration and a dynamic pricing calculator.",
    stack: ["Next.js", "i18n", "RTL", "WhatsApp API", "Vercel"],
    url: "https://ratitoursgeorgia.vercel.app",
    live: "Live",
  },
  {
    number: "05",
    title: "GHOSTEYE Suite",
    outcome:
      "Python security tool suite — passive recon, a SOC command center with phishing analyzer, and tooling with cyberpunk CustomTkinter GUIs.",
    stack: ["Python", "CustomTkinter", "OSINT APIs"],
  },
  {
    number: "06",
    title: "ANTIGRAVITY.SYS",
    outcome:
      "Android bank transaction analyzer powered by Gemini AI, Salt Edge for connectivity. Built with Capacitor over Next.js.",
    stack: ["Next.js", "Capacitor", "Gemini AI", "Salt Edge API"],
  },
];

// Experience — PM2 and IIS removed per spec.
export type Role = {
  period: string;
  company: string;
  role: string;
  description: string;
  tools: string[];
};

export const ROLES: Role[] = [
  {
    period: "Jun 2025 – Aug 2026",
    company: "Mobileye (Intel)",
    role: "SOC Analyst · Tier 1",
    description:
      "Tier 1 SOC analyst on a tight-knit team. Monitored and triaged security events across the enterprise. Built and shipped an internal security dashboard from scratch — a full-stack Next.js app with ML phishing analysis, an SSO-gated admin panel, and Puppeteer screenshot capture — deployed enterprise-wide via an automated CI/CD pipeline.",
    tools: ["CrowdStrike", "Hunters SIEM", "Palo Alto Panorama", "Cisco IronPort ESA", "Microsoft Defender", "MITRE ATT&CK", "QRadar", "Next.js", "Node.js"],
  },
  {
    period: "2022 – 2023",
    company: "Freelance",
    role: "Full-Stack Developer",
    description:
      "Built production web apps for clients. Tourism platforms, multilingual sites with RTL support, WhatsApp booking integrations.",
    tools: ["Next.js", "React", "Tailwind", "TypeScript", "Vercel"],
  },
];

export const CREDENTIALS = [
  "TryHackMe SOC Level 1 — 115+ rooms, top 3% globally",
  "Wiz Kubernetes Security CTF — 7/7 flags",
  "CKS — Certified Kubernetes Security (in progress)",
  "IDF Israel Air Force — Air Defense",
];

export const TOOL_GROUPS: { label: string; tools: string[] }[] = [
  { label: "Security Ops", tools: ["CrowdStrike", "Hunters SIEM", "Palo Alto Panorama", "Cisco IronPort ESA", "Microsoft Defender", "QRadar"] },
  { label: "Detection & Scripting", tools: ["MITRE ATT&CK", "Python", "KQL", "Bash", "PowerShell"] },
  { label: "Full-stack", tools: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind"] },
  { label: "Infra", tools: ["Docker", "Kubernetes", "CI/CD", "Vercel", "Linux"] },
];

export const NAV_LINKS = [
  { label: "WORK", href: "#work" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "DEFENSE", href: "#defense" },
  { label: "CONTACT", href: "#contact" },
];

export const SECTIONS = [
  { id: "top", label: "Hero" },
  { id: "statement", label: "Statement" },
  { id: "work", label: "Work" },
  { id: "defense", label: "Defense" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];
