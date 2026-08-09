"use client";

import ScrollReveal from "./ScrollReveal";
import { User, MapPin, Code, Shield } from "lucide-react";

export default function About() {
  return (
    <section className="py-24" id="about">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-12 flex items-center gap-4">
            <span className="text-cyan">01.</span> 
            ABOUT_ME
            <span className="h-px bg-[var(--border)] flex-1 ml-4" />
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-6 text-[var(--text2)] leading-relaxed text-lg">
              <p>
                I am a passionate <span className="text-[var(--text)] font-semibold">SOC Analyst</span> and <span className="text-[var(--text)] font-semibold">Full-Stack Developer</span> based in Holon, Israel. In summer 2025 I held a student SOC position at an autonomous-driving R&amp;D unit; today I build security tooling and full-stack apps independently. With a strong foundation in both offensive security and modern web development, I build secure, performant, and beautifully designed applications.
              </p>
              <p>
                My journey bridges the gap between identifying vulnerabilities and engineering robust solutions. Whether I'm analyzing threats in a high-stakes enterprise environment or developing a full-stack platform from scratch, my approach is always systematic, analytical, and security-first.
              </p>

              {/* 2x2 Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-[var(--border)]">
                <div>
                  <div className="font-space-mono text-cyan text-sm mb-1 uppercase">Training</div>
                  <div className="text-[var(--text)]">TryHackMe SOC Level 1</div>
                  <div className="text-sm">71+ rooms completed</div>
                </div>
                <div>
                  <div className="font-space-mono text-cyan text-sm mb-1 uppercase">Location</div>
                  <div className="text-[var(--text)]">Holon, Israel</div>
                  <div className="text-sm">Open to TLV area</div>
                </div>
                <div>
                  <div className="font-space-mono text-cyan text-sm mb-1 uppercase">Target Role</div>
                  <div className="text-[var(--text)]">DEVSECOPS|SECURITY ENGINEER</div>
                </div>
                <div>
                  <div className="font-space-mono text-cyan text-sm mb-1 uppercase">Languages</div>
                  <div className="text-[var(--text)] text-sm leading-relaxed">Hebrew (native), Georgian (native), Russian (fluent), English (professional)</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: ID Card */}
          <ScrollReveal delay={0.2} className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-[var(--bg2)] border border-[var(--border)] rounded-xl relative overflow-hidden group hover:border-cyan/50 transition-colors duration-500">
              {/* Gradient Top Border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan to-orange" />
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-24 h-24 rounded-lg bg-[var(--bg3)] border border-[var(--border2)] flex items-center justify-center font-orbitron text-3xl font-bold text-[var(--text2)] group-hover:text-cyan transition-colors shadow-inner">
                    BG
                  </div>
                  <Shield className="text-cyan opacity-50" size={32} />
                </div>

                <h3 className="font-orbitron text-2xl font-bold text-[var(--text)] mb-2">Benny Gingihashvili</h3>
                <div className="font-space-mono text-orange text-sm mb-6 uppercase tracking-wider">
                  ID: DEV-SEC-001
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-[var(--text2)]">
                    <User size={16} className="text-cyan" />
                    <span>SOC Analyst · Student (2025)</span>
                  </div>
                  <div className="flex items-center gap-3 text-[var(--text2)]">
                    <MapPin size={16} className="text-cyan" />
                    <span>Holon, Israel Region</span>
                  </div>
                </div>

                {/* Badge Pills */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[var(--cyan)]/10 text-cyan border border-[var(--cyan)]/20 rounded-full text-xs font-space-mono uppercase flex items-center gap-1">
                    <Shield size={12} /> SOC Analyst
                  </span>
                  <span className="px-3 py-1 bg-[var(--orange)]/10 text-orange border border-[var(--orange)]/20 rounded-full text-xs font-space-mono uppercase flex items-center gap-1">
                    <Code size={12} /> Developer
                  </span>
                </div>
                
                {/* Barcode Mockup – deterministic bars to avoid hydration mismatches */}
                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-center opacity-30">
                  <div className="h-8 w-full flex gap-1">
                    {[...Array(40)].map((_, i) => (
                      <div key={i} className="bg-white h-full" style={{ width: `${(i % 5) + 2}px` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
