"use client";

import { motion } from "framer-motion";
import { HERO, META } from "@/lib/v2-content";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 font-[family-name:var(--font-space-mono)] text-[11px] uppercase tracking-[0.4em] text-(--cyan)"
          >
            SOC · Full-stack · Detection engineering
          </motion.p>

          <h1 className="font-[family-name:var(--font-cormorant)] font-light leading-[0.92] text-(--text)">
            {[HERO.line1, HERO.line2].map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.25 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="block"
                style={{ fontSize: "clamp(64px,11vw,180px)" }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-10 max-w-xl font-[family-name:var(--font-outfit)] text-lg font-light leading-relaxed text-(--text2)"
          >
            {HERO.subline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.95 }}
            className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 font-[family-name:var(--font-space-mono)] text-xs tracking-wider text-(--text3)"
          >
            <span>{META.location}</span>
            <span className="text-(--cyan)">·</span>
            <span>{META.availability}</span>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-[0.3em] text-(--text3)"
      >
        scroll
      </motion.div>
    </section>
  );
}
