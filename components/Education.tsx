"use client";

import ScrollReveal from "./ScrollReveal";
import { Award, Trophy, Flag, Target, Plane } from "lucide-react";

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

        {/* ── Lead item — TryHackMe SOC Level 1, TOP 3% GLOBALLY ──────────────── */}
        <ScrollReveal>
          <div className="bg-[var(--bg2)] border border-[var(--cyan)]/40 rounded-lg p-8 relative overflow-hidden group hover:border-cyan/70 transition-colors mb-6 shadow-[0_0_30px_rgba(0,229,200,0.10)]">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan" />

            <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
              <div>
                <h3 className="font-orbitron text-2xl font-bold text-[var(--text)] group-hover:text-cyan transition-colors">
                  SOC Level 1 Path
                </h3>
                <div className="font-space-mono text-[var(--text2)] mt-1">TryHackMe</div>
              </div>
              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-space-mono border border-green-500/20 rounded-sm uppercase shrink-0">
                Active
              </span>
            </div>

            {/* TOP 3% — the strongest credential, made prominent */}
            <div className="flex flex-wrap items-stretch gap-3 mb-4">
              <div className="flex items-center gap-3 px-5 py-3 rounded-md bg-gradient-to-r from-orange/15 to-cyan/10 border border-orange/40">
                <Trophy className="text-orange shrink-0" size={26} />
                <div>
                  <div className="font-orbitron text-2xl font-bold text-orange leading-none">TOP 3%</div>
                  <div className="font-space-mono text-[10px] uppercase tracking-widest text-[var(--text2)] mt-1">
                    Globally ranked
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-md bg-[var(--bg3)] border border-[var(--border)]">
                <div>
                  <div className="font-orbitron text-2xl font-bold text-cyan leading-none">115+</div>
                  <div className="font-space-mono text-[10px] uppercase tracking-widest text-[var(--text2)] mt-1">
                    Rooms completed
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-[var(--text3)] font-space-mono">
              SIEM · threat intel · DFIR · phishing analysis
            </div>
          </div>
        </ScrollReveal>

        {/* ── Wiz Kubernetes Security CTF — completed ─────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-6 relative overflow-hidden group hover:border-green-500/50 transition-colors mb-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />

            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <h3 className="font-orbitron text-xl font-bold text-[var(--text)] group-hover:text-green-400 transition-colors">
                Kubernetes Security CTF
              </h3>
              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-space-mono border border-green-500/20 rounded-sm uppercase shrink-0">
                Completed
              </span>
            </div>

            <div className="font-space-mono text-[var(--text2)] mb-3">Wiz</div>

            <div className="inline-flex items-center gap-2 font-space-mono text-sm text-green-400">
              <Flag size={16} /> 7 / 7 flags captured
            </div>
          </div>
        </ScrollReveal>

        {/* ── Target (not yet earned) — visually distinct from completed items ── */}
        <ScrollReveal delay={0.2}>
          <div className="border border-dashed border-[var(--border2)] rounded-lg p-6 relative overflow-hidden opacity-70 hover:opacity-100 transition-opacity bg-transparent">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
              <div className="flex items-center gap-3">
                <Target className="text-[var(--text3)] shrink-0" size={20} />
                <h3 className="font-orbitron text-lg font-bold text-[var(--text2)]">
                  CKS: Certified Kubernetes Security
                </h3>
              </div>
              <span className="px-2 py-1 bg-transparent text-[var(--text3)] text-xs font-space-mono border border-dashed border-[var(--border2)] rounded-sm uppercase shrink-0">
                Target
              </span>
            </div>
            <div className="font-space-mono text-[var(--text3)] text-sm ml-8">
              CNCF / Linux Foundation — next credential in progress
            </div>
          </div>
        </ScrollReveal>

        {/* ── Background context — military service, not a certification ───────── */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 pt-6 border-t border-[var(--border)]">
            <div className="font-space-mono text-xs uppercase tracking-widest text-[var(--text3)] mb-3">
              // Background
            </div>
            <div className="flex items-center gap-3 text-[var(--text2)]">
              <Plane className="text-cyan shrink-0" size={18} />
              <span className="font-space-mono text-sm">
                IDF — Israel Air Force, Air Defense Division · Military service
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
