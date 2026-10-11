"use client";

import { motion } from "framer-motion";
import { META } from "@/lib/v2-content";

export default function Contact() {
  return (
    <section id="contact" className="relative flex min-h-screen flex-col justify-center py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-6 font-[family-name:var(--font-space-mono)] text-[11px] uppercase tracking-[0.4em] text-(--cyan)"
        >
          Contact
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-[family-name:var(--font-cormorant)] font-light leading-[0.9] text-(--text)"
          style={{ fontSize: "clamp(72px,13vw,220px)" }}
        >
          Let&apos;s talk.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between"
        >
          <div className="space-y-4 font-[family-name:var(--font-outfit)] text-base font-light">
            <a href={`mailto:${META.email}`} className="block text-(--text2) transition-colors hover:text-(--text)">
              {META.email}
            </a>
            <a href={META.linkedin} target="_blank" rel="noopener noreferrer" className="block text-(--text2) transition-colors hover:text-(--text)">
              {META.linkedinLabel}
            </a>
            <a href={META.github} target="_blank" rel="noopener noreferrer" className="block text-(--text2) transition-colors hover:text-(--text)">
              {META.githubLabel}
            </a>
          </div>

          <a
            href={`mailto:${META.email}`}
            className="inline-flex w-fit items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-medium tracking-[0.15em] text-black transition-transform hover:scale-[1.03]"
          >
            Start a conversation <span className="text-lg leading-none">○</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
