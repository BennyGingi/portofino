"use client";

import ScrollReveal from "./ScrollReveal";
import { Terminal, Download } from "lucide-react";
import dynamic from "next/dynamic";
import { openTerminal } from "./TerminalOverlay";

const ParticleGlobe = dynamic(() => import("./ParticleGlobe"), { ssr: false });

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        display: "grid",
        gridTemplateColumns: "55fr 45fr",
        alignItems: "center",
        minHeight: "100vh",
        padding: "80px 56px 40px",
        gap: "48px",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {/* ── LEFT: text content ───────────────────────────────────────────── */}
      <ScrollReveal>
        <div className="flex flex-col gap-6">

          <div className="inline-block">
            <span className="font-space-mono text-cyan text-xs tracking-widest uppercase border border-(--cyan)/30 bg-(--cyan)/5 px-3 py-1">
              INITIALIZE SYSTEM //
            </span>
          </div>

          <h1 className="font-orbitron font-bold leading-none" style={{ fontSize: "clamp(40px, 6vw, 80px)" }}>
            <span className="bg-linear-to-br from-(--text) to-(--cyan) text-transparent bg-clip-text block">
              BENNY
            </span>
            <span className="text-(--text) block">
              GINGIHASHVILI
            </span>
          </h1>

          <div className="flex items-center gap-4 font-space-mono text-base" style={{ color: "var(--orange)" }}>
            <span>SOC ANALYST</span>
            <span style={{ color: "var(--text3)" }}></span>
            <span>FULL-STACK DEV</span>
          </div>

          <p className="leading-relaxed text-base max-w-lg" style={{ color: "var(--text2)", fontSize: "15px" }}>
            Tier 1 SOC analyst at an autonomous-driving R&amp;D unit
            (Jun 2025 – Aug 2026). Now building security tooling and full-stack
            apps — bridging offensive security and robust engineering.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="font-orbitron font-bold px-8 py-3 transition-all"
              style={{
                background: "var(--cyan)",
                color: "var(--bg)",
                boxShadow: "0 0 20px rgba(0,229,200,0.35)",
              }}
            >
              VIEW_PROJECTS
            </a>
            <a
              href="#contact"
              className="font-orbitron font-bold px-8 py-3 transition-all hover:bg-(--cyan)/10"
              style={{
                border: "1px solid var(--cyan)",
                color: "var(--cyan)",
              }}
            >
              CONTACT_ME
            </a>
            <a
              href="/benny-cv-2026-08.pdf"
              download
              className="font-orbitron font-bold px-8 py-3 transition-all hover:bg-(--cyan)/10 inline-flex items-center gap-2"
              style={{
                border: "1px solid var(--cyan)",
                color: "var(--cyan)",
              }}
            >
              <Download size={16} /> DOWNLOAD_CV
            </a>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Threat Analysis", "Next.js", "TypeScript", "Python", "CrowdStrike", "SIEM"].map((skill) => (
              <span
                key={skill}
                className="font-space-mono text-xs px-2 py-1"
                style={{
                  color: "var(--text3)",
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                }}
              >
                {skill}
              </span>
            ))}
          </div>

        </div>
      </ScrollReveal>

      {/* ── RIGHT: terminal + globe ──────────────────────────────────────── */}
      <ScrollReveal delay={0.2}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Globe container — explicit height so Three.js gets real pixels */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "340px",
              overflow: "hidden",
              isolation: "isolate",
            }}
          >
            <ParticleGlobe
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>

          {/* Terminal mockup */}
          <div
            onClick={openTerminal}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              overflow: "hidden",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              position: "relative",   // ← ADD
              zIndex: 15,
              top: 50,              // ← ADD 
            }}
            className="group hover:border-(--cyan)/50 transition-colors"
          >
            {/* Terminal header bar */}
            <div
              style={{
                background: "var(--bg3)",
                borderBottom: "1px solid var(--border)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
              </div>
              <div
                style={{
                  flex: 1, textAlign: "center", display: "flex",
                  alignItems: "center", justifyContent: "center", gap: "6px",
                  color: "var(--text3)",
                }}
                className="font-space-mono text-xs"
              >
                <Terminal size={12} />
                <span>profile.json — bash</span>
              </div>
            </div>

            {/* Terminal body */}
            <div style={{ padding: "20px 24px" }} className="font-space-mono text-xs leading-relaxed overflow-x-auto">
              <pre style={{ margin: 0 }}>
                <code>
                  <span style={{ color: "var(--text3)" }}>{"{"}</span>{"\n"}
                  {"  "}<span style={{ color: "var(--cyan)" }}>&quot;name&quot;</span>{": "}
                  <span style={{ color: "var(--orange)" }}>&quot;Benny Gingihashvili&quot;</span>{",\n"}
                  {"  "}<span style={{ color: "var(--cyan)" }}>&quot;role&quot;</span>{": [\n"}
                  {"    "}<span style={{ color: "var(--orange)" }}>&quot;SOC Analyst&quot;</span>{",\n"}
                  {"    "}<span style={{ color: "var(--orange)" }}>&quot;Full-Stack Developer&quot;</span>{"\n"}
                  {"  "}{"],\n"}
                  {"  "}<span style={{ color: "var(--cyan)" }}>&quot;seeking&quot;</span>{": "}
                  <span style={{ color: "var(--orange)" }}>&quot;Security Engineering roles&quot;</span>{",\n"}
                  {"  "}<span style={{ color: "var(--cyan)" }}>&quot;location&quot;</span>{": "}
                  <span style={{ color: "var(--orange)" }}>&quot;Holon, Israel&quot;</span>{",\n"}
                  {"  "}<span style={{ color: "var(--cyan)" }}>&quot;open_to_work&quot;</span>{": "}
                  <span style={{ color: "#22c55e" }}>true</span>{",\n"}
                  {"  "}<span style={{ color: "var(--cyan)" }}>&quot;skills&quot;</span>{": [\n"}
                  {"    "}<span style={{ color: "var(--text)" }}>&quot;React&quot;</span>{", "}
                  <span style={{ color: "var(--text)" }}>&quot;Next.js&quot;</span>{",\n"}
                  {"    "}<span style={{ color: "var(--text)" }}>&quot;TypeScript&quot;</span>{", "}
                  <span style={{ color: "var(--text)" }}>&quot;Python&quot;</span>{",\n"}
                  {"    "}<span style={{ color: "var(--text)" }}>&quot;Security&quot;</span>{", "}
                  <span style={{ color: "var(--text)" }}>&quot;SIEM&quot;</span>{"\n"}
                  {"  "}{"]"}{"\n"}
                  <span style={{ color: "var(--text3)" }}>{"}"}</span>
                  <span
                    style={{
                      display: "inline-block", width: 8, height: 14,
                      background: "var(--cyan)", marginLeft: 4,
                      verticalAlign: "middle",
                      animation: "blink 1s step-end infinite",
                    }}
                    className="group-hover:opacity-80"
                  />
                </code>
              </pre>
            </div>
          </div>

          {/* Launch terminal button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={openTerminal}
              className="group/term inline-flex items-center gap-2 font-space-mono text-xs tracking-wider px-4 py-2 border border-(--border2) rounded-sm cursor-pointer text-(--text2) bg-(--bg2) hover:text-(--cyan) hover:border-(--cyan)/60 hover:bg-(--cyan)/5 transition-colors"
              aria-label="Launch interactive terminal"
            >
              <span className="text-(--cyan) font-bold">&gt;_</span>
              <span>LAUNCH TERMINAL</span>
              <kbd className="ml-1 px-1.5 py-0.5 text-[10px] rounded-sm border border-(--border) bg-(--bg3) text-(--text3)">
                Ctrl+~
              </kbd>
            </button>
          </div>

        </div>
      </ScrollReveal>

      {/* ── mobile styles ────────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 900px) {
          #hero {
            grid-template-columns: 1fr !important;
            padding: 100px 24px 40px !important;
          }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  );
}