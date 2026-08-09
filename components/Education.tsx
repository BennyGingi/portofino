"use client";

import ScrollReveal from "./ScrollReveal";
import { Award } from "lucide-react";

export default function Education() {
  return (
    <section className="py-24" id="certifications">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-10">
            <Award className="text-orange" size={32} />
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold">CERTIFICATIONS</h2>
          </div>
        </ScrollReveal>

        {/* Lead item — TryHackMe SOC Level 1, full width */}
        <ScrollReveal>
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-8 relative overflow-hidden group hover:border-cyan/50 transition-colors mb-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />

            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <h3 className="font-orbitron text-2xl font-bold text-[var(--text)] group-hover:text-cyan transition-colors">
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
              71+ rooms completed — SIEM, threat intel, DFIR, phishing analysis
            </div>
          </div>
        </ScrollReveal>

        {/* Planned certifications, side by side full width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AZ-900 */}
          <ScrollReveal delay={0.1}>
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6 relative overflow-hidden opacity-70 hover:opacity-100 transition-opacity h-full">
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
          </ScrollReveal>

          {/* CKS */}
          <ScrollReveal delay={0.2}>
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6 relative overflow-hidden opacity-70 hover:opacity-100 transition-opacity h-full">
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
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
