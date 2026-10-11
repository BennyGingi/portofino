"use client";

import dynamic from "next/dynamic";
import Nav from "@/components/v2/Nav";
import GuideLines from "@/components/v2/GuideLines";
import SectionIndicator from "@/components/v2/SectionIndicator";
import Hero from "@/components/v2/sections/Hero";
import Statement from "@/components/v2/sections/Statement";
import Work from "@/components/v2/sections/Work";
import Defense from "@/components/v2/sections/Defense";
import Experience from "@/components/v2/sections/Experience";
import Contact from "@/components/v2/sections/Contact";
import FooterV2 from "@/components/v2/sections/FooterV2";
import TerminalOverlay from "@/components/TerminalOverlay";

// Scene is WebGL and must stay off the critical path — text renders first.
const Scene = dynamic(() => import("@/components/v2/Scene"), { ssr: false });

// v2 palette — re-scopes the shared CSS custom properties (also consumed by the
// embedded ThreatFeed) to a near-black + sapphire/bronze look.
const V2_PALETTE: React.CSSProperties = {
  // @ts-expect-error CSS custom properties are not in the React type
  "--bg": "#03060d",
  "--bg2": "#0a1020",
  "--bg3": "#10182e",
  "--bg4": "#1a2544",
  "--border": "rgba(255,255,255,0.08)",
  "--border2": "rgba(255,255,255,0.14)",
  "--border3": "rgba(120,160,255,0.30)",
  "--text": "#eef2fb",
  "--text2": "#aab4cc",
  "--text3": "#6b7694",
  "--cyan": "#60a5fa",
  "--cyan-glow": "rgba(96,165,250,0.35)",
  "--orange": "#c98a4b",
};

export default function V2Page() {
  return (
    <div
      style={V2_PALETTE}
      className="relative min-h-screen bg-(--bg) font-[family-name:var(--font-outfit)] text-(--text) antialiased"
    >
      <Scene />
      <GuideLines />
      <Nav />
      <SectionIndicator />

      <main className="relative z-10">
        <Hero />
        <Statement />
        <Work />
        <Defense />
        <Experience />
        <Contact />
        <FooterV2 />
      </main>

      {/* Existing overlay — Ctrl+` and the `sudo hire benny` easter egg still work. */}
      <TerminalOverlay />
    </div>
  );
}
