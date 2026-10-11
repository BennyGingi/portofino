"use client";

import { motion } from "framer-motion";
import { WORK } from "@/lib/v2-content";

export default function Work() {
  return (
    <section id="work" className="relative py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-16 flex items-end justify-between border-b border-white/[0.08] pb-6">
          <h2 className="font-[family-name:var(--font-cormorant)] font-light text-(--text)" style={{ fontSize: "clamp(36px,6vw,80px)" }}>
            Selected Work
          </h2>
          <span className="hidden font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.3em] text-(--text3) sm:block">
            06 projects
          </span>
        </div>

        <ul>
          {WORK.map((item, i) => (
            <motion.li
              key={item.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.05 }}
            >
              {(() => {
                const Tag = item.url ? "a" : "div";
                return (
                  <Tag
                    {...(item.url ? { href: item.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group relative block border-b border-white/[0.08] py-9"
                  >
                    {/* sapphire sweep underline */}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-(--cyan) transition-all duration-500 ease-out group-hover:w-full" />

                    <div className="grid grid-cols-1 items-baseline gap-4 md:grid-cols-12">
                      <span className="font-[family-name:var(--font-space-mono)] text-sm text-(--text3) md:col-span-1">
                        {item.number}
                      </span>

                      <div className="md:col-span-5">
                        <h3 className="font-[family-name:var(--font-cormorant)] font-light leading-none text-(--text) transition-colors" style={{ fontSize: "clamp(30px,3.8vw,52px)" }}>
                          {item.title}
                          {item.live && (
                            <span className="ml-3 align-middle font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em] text-(--cyan) opacity-0 transition-opacity group-hover:opacity-100">
                              {item.live} ↗
                            </span>
                          )}
                        </h3>
                      </div>

                      <p className="font-[family-name:var(--font-outfit)] text-sm font-light leading-relaxed text-(--text2) md:col-span-4">
                        {item.outcome}
                      </p>

                      <div className="flex flex-wrap gap-x-3 gap-y-1 md:col-span-2 md:justify-end">
                        {item.stack.map((s) => (
                          <span key={s} className="font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-wider text-(--text3)">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Tag>
                );
              })()}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
