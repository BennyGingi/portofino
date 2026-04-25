"use client";

import ScrollReveal from "./ScrollReveal";
import { GraduationCap, Award } from "lucide-react";

export default function Education() {
  return (
    <section className="py-24" id="education">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Education Column */}
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-10">
              <GraduationCap className="text-cyan" size={32} />
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold">EDUCATION</h2>
            </div>

            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6 relative overflow-hidden group hover:border-cyan/50 transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan" />

              <div className="flex justify-between items-start mb-4">
                <h3 className="font-orbitron text-xl font-bold text-[var(--text)] group-hover:text-cyan transition-colors">
                  B.Sc. Computer Science
                </h3>
                <span className="px-2 py-1 bg-[var(--cyan)]/10 text-cyan text-xs font-space-mono border border-[var(--cyan)]/20 rounded-sm uppercase">
                  In Progress
                </span>
              </div>

              <div className="font-space-mono text-[var(--text2)] mb-2">
                Academic College of Ramat-Gan
              </div>

              <div className="text-sm text-[var(--text3)] font-space-mono">
                2022–Present
              </div>
            </div>
          </ScrollReveal>

          {/* Certifications Column */}
          <ScrollReveal delay={0.2}>
            <div className="flex items-center gap-4 mb-10">
              <Award className="text-orange" size={32} />
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold">CERTIFICATIONS</h2>
            </div>

            <div className="space-y-4">
              {/* TryHackMe */}
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6 relative overflow-hidden group hover:border-orange/50 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />

                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-orbitron text-lg font-bold text-[var(--text)] group-hover:text-orange transition-colors">
                    SOC Level 1 Path
                  </h3>
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-space-mono border border-green-500/20 rounded-sm uppercase">
                    Active
                  </span>
                </div>

                <div className="font-space-mono text-[var(--text2)] mb-2">
                  TryHackMe
                </div>

                <div className="text-sm text-[var(--text3)] font-space-mono">
                  71+ rooms completed
                </div>
              </div>

              {/* AZ-900 */}
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6 relative overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--border3)]" />

                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-orbitron text-lg font-bold text-[var(--text)]">
                    AZ-900: Azure Fundamentals
                  </h3>
                  <span className="px-2 py-1 bg-[var(--border)] text-[var(--text2)] text-xs font-space-mono border border-[var(--border2)] rounded-sm uppercase">
                    Planned
                  </span>
                </div>

                <div className="font-space-mono text-[var(--text2)]">
                  Microsoft
                </div>
              </div>

              {/* CKS */}
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6 relative overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--border3)]" />

                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-orbitron text-lg font-bold text-[var(--text)]">
                    CKS: Certified Kubernetes Security
                  </h3>
                  <span className="px-2 py-1 bg-[var(--border)] text-[var(--text2)] text-xs font-space-mono border border-[var(--border2)] rounded-sm uppercase">
                    Planned
                  </span>
                </div>

                <div className="font-space-mono text-[var(--text2)]">
                  CNCF / Linux Foundation
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
