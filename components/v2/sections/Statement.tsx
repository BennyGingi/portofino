"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { STATEMENT, META } from "@/lib/v2-content";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

export default function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.25"] });
  const words = STATEMENT.split(" ");

  return (
    <section id="statement" className="relative flex min-h-screen items-center py-32">
      <div ref={ref} className="mx-auto w-full max-w-5xl px-6">
        <p className="flex flex-wrap font-[family-name:var(--font-cormorant)] font-light leading-[1.15] text-(--text)" style={{ fontSize: "clamp(30px,4.6vw,64px)" }}>
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={`${w}-${i}`} progress={scrollYProgress} range={[start, end]}>
                {w}
              </Word>
            );
          })}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mt-14 flex flex-wrap items-center gap-6"
        >
          <a
            href="#work"
            className="group font-[family-name:var(--font-outfit)] text-sm tracking-[0.15em] text-(--text)"
          >
            View work
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1 text-(--cyan)">→</span>
          </a>
          <a
            href={META.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="group font-[family-name:var(--font-outfit)] text-sm tracking-[0.15em] text-(--text2) transition-colors hover:text-(--text)"
          >
            Download CV
            <span className="ml-2 inline-block transition-transform group-hover:translate-y-0.5 text-(--cyan)">↓</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
