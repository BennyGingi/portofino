"use client";

import ScrollReveal from "./ScrollReveal";
import SkillRadar from "./SkillRadar";

const TECH_TAGS = [
  "Next.js", "React", "TypeScript", "Python", "Node.js", "PostgreSQL",
  "Supabase", "Mantine UI", "Tailwind CSS", "CrowdStrike", "Hunters SIEM",
  "Palo Alto", "Cisco IronPort", "Microsoft Defender", "QRadar",
  "MITRE ATT&CK", "PM2", "IIS", "GitLab CI", "Vercel", "Puppeteer",
  "Leaflet.js", "CustomTkinter", "Capacitor",
];

export default function Skills() {
  return (
    <section className="py-24 bg-(--bg2)/50" id="skills">
      <div className="max-w-7xl mx-auto px-4">

        <ScrollReveal>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-16 flex items-center gap-4">
            <span className="text-cyan">04.</span>{" "}
            SKILLS & ARSENAL
            <span className="h-px bg-(--border) flex-1 ml-4" />
          </h2>
        </ScrollReveal>

        {/* Two-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '55fr 45fr',
            gap: '48px',
            alignItems: 'start',
          }}
          className="skills-grid"
        >
          {/* LEFT — Radar + drill-down */}
          <ScrollReveal delay={0.1}>
            <SkillRadar />
          </ScrollReveal>

          {/* RIGHT — Tech tag cloud */}
          <ScrollReveal delay={0.2}>
            <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '10px',
                  color: 'var(--text3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginBottom: '20px',
                }}
              >
                Complete Tech Arsenal
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {TECH_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-(--bg2) border border-(--border) text-(--text2) font-space-mono text-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan hover:text-cyan hover:shadow-[0_5px_15px_rgba(0,229,200,0.2)] cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Mobile: stack vertically */}
      <style>{`
        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
