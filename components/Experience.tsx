"use client";

import ScrollReveal from "./ScrollReveal";

const EXPERIENCES = [
  {
    id: 1,
    period: "2025–Present",
    isCurrent: true,
    company: "Mobileye (Intel)",
    role: "SOC Analyst",
    description: "Tier 1/2 threat analyst at Intel's autonomous-driving R&D unit. Monitor and triage security events across the enterprise. Built and deployed an internal SOC Portal — a full-stack Next.js app with ML phishing analysis, two-tier AD auth, admin panel, Puppeteer screenshot capability — live at soc-portal.mobileye.com via IIS + PM2 + GitLab CI.",
    tools: ["CrowdStrike", "Hunters SIEM", "Palo Alto Panorama", "Cisco IronPort ESA", "Microsoft Defender", "MITRE ATT&CK", "QRadar", "Next.js", "Node.js", "PM2", "IIS"]
  },
  {
    id: 2,
    period: "2022–2023",
    isCurrent: false,
    company: "Freelance Development",
    role: "Full-Stack Developer",
    description: "Built production web apps for clients. Tourism platforms, multilingual sites with RTL support, WhatsApp booking integrations.",
    tools: ["Next.js", "React", "Tailwind", "TypeScript", "Vercel"]
  }
];

export default function Experience() {
  return (
    <section className="py-24 bg-[var(--bg2)]/50" id="experience">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-16 flex items-center gap-4">
            <span className="text-cyan">02.</span>
            EXPERIENCE
            <span className="h-px bg-[var(--border)] flex-1 ml-4" />
          </h2>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <div className="relative border-l border-[var(--border)] ml-4 md:ml-0 pl-8 md:pl-12 space-y-16">
            {EXPERIENCES.map((exp, index) => (
              <ScrollReveal key={exp.id} delay={index * 0.2}>
                <div className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[41px] md:-left-[57px] top-1 w-5 h-5 rounded-full border-4 border-[var(--bg)] ${exp.isCurrent ? "bg-cyan box-shadow-cyan" : "bg-[var(--border3)]"
                    }`} />

                  {/* Period & Badge */}
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="font-space-mono text-sm text-[var(--text2)] uppercase tracking-widest">
                      {exp.period}
                    </span>
                    {exp.isCurrent && (
                      <span className="px-2 py-0.5 bg-[var(--cyan)]/10 text-cyan text-xs font-space-mono border border-[var(--cyan)]/20 rounded-sm uppercase">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Company & Role */}
                  <h3 className="font-orbitron text-2xl font-bold text-[var(--text)] mb-1">
                    {exp.company}
                  </h3>
                  <div className="font-space-mono text-orange mb-4">
                    {exp.role}
                  </div>

                  {/* Description */}
                  <p className="text-[var(--text2)] leading-relaxed mb-6">
                    {exp.description}
                  </p>

                  {/* Tools */}
                  <div className="flex flex-wrap gap-2">
                    {exp.tools.map((tool) => (
                      <span key={tool} className="text-xs font-space-mono px-3 py-1 bg-[var(--bg3)] text-[var(--text2)] border border-[var(--border)] rounded-full hover:border-cyan/50 hover:text-cyan transition-colors">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
