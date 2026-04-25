"use client";

import ScrollReveal from "./ScrollReveal";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const SEC_SKILLS = [
  { name: "Threat Analysis & Triage", level: 88 },
  { name: "Phishing Investigation", level: 90 },
  { name: "CrowdStrike Falcon", level: 85 },
  { name: "SIEM (Hunters / QRadar)", level: 75 },
  { name: "Palo Alto / Panorama", level: 72 }
];

const DEV_SKILLS = [
  { name: "Next.js / React", level: 90 },
  { name: "TypeScript", level: 82 },
  { name: "Python", level: 75 },
  { name: "PostgreSQL / Supabase", level: 70 },
  { name: "DevOps (PM2, IIS, CI/CD)", level: 65 }
];

const TECH_TAGS = [
  "Next.js", "React", "TypeScript", "Python", "Node.js", "PostgreSQL", 
  "Supabase", "Mantine UI", "Tailwind CSS", "CrowdStrike", "Hunters SIEM", 
  "Palo Alto", "Cisco IronPort", "Microsoft Defender", "QRadar", 
  "MITRE ATT&CK", "PM2", "IIS", "GitLab CI", "Vercel", "Puppeteer", 
  "Leaflet.js", "CustomTkinter", "Capacitor"
];

function SkillBar({ name, level, color }: { name: string; level: number; color: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const colorClass = color === "cyan" ? "bg-cyan shadow-[0_0_10px_rgba(0,229,200,0.5)]" : "bg-orange shadow-[0_0_10px_rgba(255,107,43,0.5)]";
  const textClass = color === "cyan" ? "text-cyan" : "text-orange";

  return (
    <div className="mb-6" ref={ref}>
      <div className="flex justify-between items-end mb-2">
        <span className="font-space-mono text-sm text-[var(--text2)]">{name}</span>
        <span className={`font-space-mono text-xs ${textClass}`}>{level}%</span>
      </div>
      <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section className="py-24 bg-[var(--bg2)]/50" id="skills">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-16 flex items-center gap-4">
            <span className="text-cyan">04.</span> 
            SKILLS & ARSENAL
            <span className="h-px bg-[var(--border)] flex-1 ml-4" />
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
          {/* Security */}
          <ScrollReveal delay={0.1}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded bg-[var(--cyan)]/10 border border-[var(--cyan)]/20 flex items-center justify-center text-cyan font-space-mono text-xs">
                SEC
              </div>
              <h3 className="font-orbitron text-xl font-bold text-[var(--text)]">Security Engineering</h3>
            </div>
            
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6">
              {SEC_SKILLS.map((skill) => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} color="cyan" />
              ))}
            </div>
          </ScrollReveal>

          {/* Development */}
          <ScrollReveal delay={0.2}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded bg-[var(--orange)]/10 border border-[var(--orange)]/20 flex items-center justify-center text-orange font-space-mono text-xs">
                DEV
              </div>
              <h3 className="font-orbitron text-xl font-bold text-[var(--text)]">Full-Stack Development</h3>
            </div>

            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6">
              {DEV_SKILLS.map((skill) => (
                <SkillBar key={skill.name} name={skill.name} level={skill.level} color="orange" />
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Tech Cloud */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mb-8">
            <span className="font-space-mono text-sm text-[var(--text3)] uppercase tracking-widest">
              Complete Tech Arsenal
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_TAGS.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-[var(--bg2)] border border-[var(--border)] rounded-md text-[var(--text2)] font-space-mono text-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan hover:text-cyan hover:shadow-[0_5px_15px_rgba(0,229,200,0.2)] cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
