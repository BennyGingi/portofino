"use client";

import { motion } from "framer-motion";
import ThreatFeed from "@/components/ThreatFeed";

// Embeds the existing ThreatFeed component unchanged. The v2 page root already
// re-scopes --bg/--cyan/--orange/--text… to the sapphire palette, so the feed
// picks them up automatically; the glass panel below gives it an expensive frame.
export default function Defense() {
  return (
    <section id="defense" className="relative py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="mb-5 font-[family-name:var(--font-space-mono)] text-[11px] uppercase tracking-[0.4em] text-(--cyan)">
            Live Defense Demo
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] font-light text-(--text)" style={{ fontSize: "clamp(36px,6vw,80px)" }}>
            Live Threat Feed
          </h2>
          <p className="mt-3 font-[family-name:var(--font-outfit)] text-lg font-light text-(--text2)">
            Real alerts. Simulated data.
          </p>
        </motion.div>

        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[rgba(10,16,32,0.55)] backdrop-blur-sm">
          <ThreatFeed />
        </div>
      </div>
    </section>
  );
}
