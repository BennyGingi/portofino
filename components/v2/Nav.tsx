"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/v2-content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled ? "bg-[rgba(3,6,13,0.55)] backdrop-blur-md border-b border-white/[0.06]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* wordmark */}
        <a
          href="#top"
          className="font-[family-name:var(--font-outfit)] text-xs font-medium tracking-[0.35em] text-(--text)"
        >
          B E N N Y · G
        </a>

        {/* center nav — desktop */}
        <div className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((l, i) => (
            <span key={l.href} className="flex items-center gap-5">
              <a
                href={l.href}
                className="font-[family-name:var(--font-outfit)] text-[11px] font-light tracking-[0.28em] text-(--text2) transition-colors hover:text-(--text)"
              >
                {l.label}
              </a>
              {i < NAV_LINKS.length - 1 && <span className="text-(--text3)">·</span>}
            </span>
          ))}
        </div>

        {/* contact pill — desktop */}
        <a
          href="#contact"
          className="hidden items-center gap-2 rounded-full bg-white px-5 py-2 text-[11px] font-medium tracking-[0.2em] text-black transition-transform hover:scale-[1.03] md:inline-flex"
        >
          CONTACT <span className="text-base leading-none">○</span>
        </a>

        {/* mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex flex-col gap-1.5 md:hidden"
        >
          <span className={`h-px w-6 bg-(--text) transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-(--text) transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-(--text) transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="border-t border-white/[0.06] bg-[rgba(3,6,13,0.9)] backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-[family-name:var(--font-outfit)] text-sm tracking-[0.28em] text-(--text2)"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-medium tracking-[0.2em] text-black"
            >
              CONTACT <span>○</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
