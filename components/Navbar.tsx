"use client";

import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const NAV_LINKS = ["About", "Experience", "Projects", "Skills", "Contact"];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    NAV_LINKS.forEach((link) => {
      const el = document.getElementById(link.toLowerCase());
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full h-[60px] bg-[var(--bg)]/90 backdrop-blur-md z-40 border-b border-[var(--cyan)]/20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="font-orbitron font-bold text-xl text-cyan flex items-center gap-1">
          BG.DEV<span className="w-2 h-2 rounded-full bg-orange block animate-pulse" />
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className={`font-space-mono text-[10px] uppercase tracking-wider relative group ${
                  activeSection === link.toLowerCase() ? "text-cyan" : "text-[var(--text2)]"
                } hover:text-cyan transition-colors`}
              >
                {link}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-cyan transform origin-left transition-transform duration-300 ${
                    activeSection === link.toLowerCase() ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

      {/* Right CTA – theme toggle + availability */}
      <div className="flex items-center gap-4 md:hidden">
        {/* Mobile toggle (visible on small screens) */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-[var(--text2)] hover:text-cyan transition-colors"
          aria-label="Toggle Theme"
        >
          {mounted && theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        {/* Availability dot for mobile */}
        <span className="w-2 h-2 rounded-full bg-green-500 block animate-pulse box-shadow-cyan" />
        <span className="font-space-mono text-[10px] text-[var(--text2)] uppercase tracking-widest">
          Available for opportunities
        </span>
      </div>
      {/* Desktop CTA */}
      <div className="hidden md:flex items-center gap-4">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-[var(--text2)] hover:text-cyan transition-colors"
          aria-label="Toggle Theme"
        >
          {mounted && theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        {/* Availability dot */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 block animate-pulse box-shadow-cyan" />
          <span className="font-space-mono text-[10px] text-[var(--text2)] uppercase tracking-widest">
            Available for opportunities
          </span>
        </div>
      </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-cyan"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-[60px] left-0 w-full bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--cyan)]/20 md:hidden flex flex-col py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
              className="font-space-mono text-sm uppercase tracking-wider text-center py-4 text-[var(--text2)] hover:text-cyan border-b border-[var(--border)] last:border-none"
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
