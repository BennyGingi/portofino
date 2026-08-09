"use client";

import ScrollReveal from "./ScrollReveal";
import { ExternalLink, Lock } from "lucide-react";
import { Analytics } from "@/lib/analytics";

type Project = {
  id: string;
  number: string;
  title: string;
  icon: string;
  type: string;
  status: string;
  statusColor: string;
  desc: string;
  stack: string[];
  url?: string;
  featured?: boolean;
};

const PROJECTS: Project[] = [
  {
    id: "foodcritic",
    number: "01",
    title: "FoodCritic",
    icon: "🍽️",
    type: "Social Media Platform",
    status: "Live",
    statusColor: "text-green-400 border-green-400/30 bg-green-400/10",
    desc: "Full-stack food social network for restaurant discovery and reviews. Unique 7-plate rating system, real-time social feed, restaurant creation flow with confetti animation, referral & token reward system, interactive Leaflet.js map, 45 e2e tests passing.",
    stack: ["Next.js 14", "TypeScript", "Supabase", "Mantine UI", "Tailwind", "Leaflet.js", "PostgreSQL"],
    url: "https://foodcritic-bennygolan.vercel.app",
    featured: true
  },
  {
    id: "soc-portal",
    number: "02",
    title: "SOC Portal",
    icon: "🔐",
    type: "Internal Security Tool · Mobileye",
    status: "Enterprise Internal",
    statusColor: "text-cyan border-[var(--cyan)]/30 bg-[var(--cyan)]/10",
    desc: "Enterprise SOC dashboard deployed at Mobileye. ML phishing triage, SSO-gated admin panel, PAB reporter detection, Puppeteer screenshots. Self-hosted over SSL with an automated CI/CD pipeline.",
    stack: ["Next.js", "Node.js", "PM2", "IIS", "AD Auth", "Puppeteer", "GitLab CI"]
  },
  {
    id: "void-runner",
    number: "03",
    title: "VOID RUNNER",
    icon: "🚀",
    type: "Browser Game",
    status: "Live Game",
    statusColor: "text-green-400 border-green-400/30 bg-green-400/10",
    desc: "Cyberpunk space shooter — 12 weapons, shop system, wave-based enemies, global leaderboard. Pure canvas rendering.",
    stack: ["Next.js", "Canvas API", "TypeScript"],
    url: "#"
  },
  {
    id: "ghosteye",
    number: "04",
    title: "GHOSTEYE Suite",
    icon: "👁️",
    type: "OSINT & Recon Toolkit",
    status: "Security Tool",
    statusColor: "text-[var(--orange)] border-purple-400/30 bg-purple-400/10",
    desc: "Python security tool suite — GHOSTEYE (passive recon), NIGHTWATCH (SOC command center + phishing analyzer), FYMITA, SilenceX. CustomTkinter GUIs with cyberpunk aesthetics.",
    stack: ["Python", "CustomTkinter", "OSINT APIs"]
  },
  {
    id: "antigravity",
    number: "05",
    title: "ANTIGRAVITY.SYS",
    icon: "💳",
    type: "Android Bank Analyzer",
    status: "Mobile App",
    statusColor: "text-orange border-orange/30 bg-[var(--orange)]/10",
    desc: "Android app for Israeli bank transaction analysis powered by Gemini AI. Salt Edge API for bank connectivity. Built with Capacitor over Next.js.",
    stack: ["Next.js", "Capacitor", "Gemini AI", "Salt Edge API"]
  },
  {
    id: "rati-tours",
    number: "06",
    title: "Rati Tours (Visit Georgia)",
    icon: "🇬🇪",
    type: "Tourism Platform",
    status: "Live",
    statusColor: "text-green-400 border-green-400/30 bg-green-400/10",
    desc: "Multilingual tourism website — English, Hebrew (RTL), Russian. WhatsApp booking integration, dynamic pricing calculator.",
    stack: ["Next.js", "i18n", "RTL", "WhatsApp API", "Vercel"],
    url: "#"
  }
];

function ProjectCard({ project, className = "" }: { project: Project; className?: string }) {
  const CardWrapper = project.url && project.url !== "#" ? "a" : "div";
  const linkProps = project.url && project.url !== "#" ? { href: project.url, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <CardWrapper
      {...linkProps}
      onMouseEnter={() => Analytics.trackProjectHover(project.id)}
      className={`group block h-full bg-(--bg2) border border-(--border) p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-cyan/50 hover:shadow-[0_10px_30px_-15px_rgba(0,229,200,0.3)] ${className}`}
    >
      {/* Corner Bracket Decorations for featured */}
      {project.featured && (
        <>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="font-space-mono text-4xl text-(--text3) font-bold opacity-50">
            {project.number}
          </span>
          <span className="text-3xl">{project.icon}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 border rounded-sm text-[10px] font-space-mono uppercase tracking-wider ${project.statusColor}`}>
            {project.status}
          </span>
          {project.url && project.url !== "#" ? (
            <ExternalLink size={18} className="text-(--text3) group-hover:text-cyan transition-colors" />
          ) : (
            <Lock size={18} className="text-(--text3)" />
          )}
        </div>
      </div>

      <h3 className="font-orbitron text-xl font-bold text-(--text) mb-1 group-hover:text-cyan transition-colors">
        {project.title}
      </h3>
      <div className="font-space-mono text-xs text-orange mb-4 uppercase tracking-wider">
        {project.type}
      </div>

      <p className="text-(--text2) text-sm leading-relaxed mb-6">
        {project.desc}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {project.stack.map((tech) => (
          <span key={tech} className="font-space-mono text-[10px] text-(--text3) bg-(--bg3) px-2 py-1 rounded-sm border border-(--border) group-hover:border-(--border2) transition-colors">
            {tech}
          </span>
        ))}
      </div>
    </CardWrapper>
  );
}

export default function Projects() {
  return (
    <section className="py-24" id="projects">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-16 flex items-center gap-4">
            <span className="text-cyan">03.</span>{" "}
            PROJECTS
            <span className="h-px bg-(--border) flex-1 ml-4" />
          </h2>
        </ScrollReveal>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:flex flex-col gap-6">
          {/* Top Row: 3 cols (col 1-2 featured, col 3 standard) */}
          <div className="grid grid-cols-3 gap-6">
            <ScrollReveal delay={0.1} className="col-span-2">
              <ProjectCard project={PROJECTS[0]} />
            </ScrollReveal>
            <ScrollReveal delay={0.2} className="col-span-1">
              <ProjectCard project={PROJECTS[1]} />
            </ScrollReveal>
          </div>

          {/* Bottom Row: 4 cols */}
          <div className="grid grid-cols-4 gap-6">
            {PROJECTS.slice(2).map((project, index) => (
              <ScrollReveal key={project.id} delay={0.1 * index}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Grid Layout (fallback) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">
          {PROJECTS.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 0.1}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
