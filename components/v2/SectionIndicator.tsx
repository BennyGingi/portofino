"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/v2-content";

// Right-edge vertical section indicator — short dashes, active one longer and
// brighter, clickable. Hidden on small screens.
export default function SectionIndicator() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = ids.indexOf(e.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
    >
      {SECTIONS.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={s.label}
          aria-current={active === i ? "true" : undefined}
          className="group flex items-center gap-3"
        >
          <span
            className={`font-[family-name:var(--font-outfit)] text-[10px] tracking-[0.2em] transition-opacity ${
              active === i ? "text-(--text2) opacity-100" : "opacity-0 group-hover:opacity-60"
            }`}
          >
            {s.label}
          </span>
          <span
            className={`block h-px transition-all duration-300 ${
              active === i ? "w-8 bg-(--cyan)" : "w-4 bg-white/25 group-hover:bg-white/50"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
