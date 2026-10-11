"use client";

import { motion } from "framer-motion";
import { ROLES, CREDENTIALS, TOOL_GROUPS } from "@/lib/v2-content";

export default function Experience() {
  return (
    <section id="experience" className="relative py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-16 border-b border-white/[0.08] pb-6">
          <h2 className="font-[family-name:var(--font-cormorant)] font-light text-(--text)" style={{ fontSize: "clamp(36px,6vw,80px)" }}>
            Experience &amp; Credentials
          </h2>
        </div>

        {/* roles — minimal two-column timeline */}
        <div className="space-y-16">
          {ROLES.map((r, i) => (
            <motion.div
              key={r.company}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-12"
            >
              <div className="md:col-span-3">
                <span className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.2em] text-(--cyan)">
                  {r.period}
                </span>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-[family-name:var(--font-cormorant)] font-light leading-none text-(--text)" style={{ fontSize: "clamp(26px,3vw,40px)" }}>
                  {r.company}
                </h3>
                <p className="mt-1 font-[family-name:var(--font-outfit)] text-sm tracking-wide text-(--text2)">{r.role}</p>
                <p className="mt-4 max-w-2xl font-[family-name:var(--font-outfit)] text-sm font-light leading-relaxed text-(--text2)">
                  {r.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1">
                  {r.tools.map((t) => (
                    <span key={t} className="font-[family-name:var(--font-space-mono)] text-[10px] uppercase tracking-wider text-(--text3)">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* credentials */}
        <div className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <h3 className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.3em] text-(--text3)">
              Credentials
            </h3>
          </div>
          <ul className="md:col-span-9 space-y-3">
            {CREDENTIALS.map((c) => (
              <li key={c} className="flex items-baseline gap-3 font-[family-name:var(--font-outfit)] text-base font-light text-(--text2)">
                <span className="text-(--cyan)">—</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* grouped tools — no bars, no percentages */}
        <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <h3 className="font-[family-name:var(--font-space-mono)] text-xs uppercase tracking-[0.3em] text-(--text3)">
              Toolkit
            </h3>
          </div>
          <div className="md:col-span-9 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {TOOL_GROUPS.map((g) => (
              <div key={g.label}>
                <div className="mb-3 font-[family-name:var(--font-outfit)] text-sm tracking-wide text-(--text)">{g.label}</div>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {g.tools.map((t) => (
                    <span key={t} className="font-[family-name:var(--font-space-mono)] text-[11px] text-(--text3)">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
