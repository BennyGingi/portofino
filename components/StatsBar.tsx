"use client";

import { useEffect, useState, useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import { useInView } from "framer-motion";

interface StatItemProps {
  end: number;
  label: string;
  suffix?: string;
}

function StatCounter({ end, label, suffix = "" }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / end));
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center text-center p-6 border-b md:border-b-0 md:border-r border-[var(--border)] last:border-none">
      <div className="font-orbitron text-4xl md:text-5xl font-bold text-cyan mb-2 text-shadow-cyan">
        {count}{suffix}
      </div>
      <div className="font-space-mono text-xs md:text-sm text-[var(--text2)] uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}

export default function StatsBar() {
  return (
    <div className="w-full bg-[var(--bg2)] border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center text-center p-6 border-b md:border-b-0 md:border-r border-[var(--border)]">
              <div className="font-orbitron text-4xl md:text-5xl font-bold text-cyan mb-2 text-shadow-cyan">1.5+</div>
              <div className="font-space-mono text-xs md:text-sm text-[var(--text2)] uppercase tracking-widest">Years at Mobileye</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-6 border-b md:border-b-0 md:border-r border-[var(--border)]">
              <div className="font-orbitron text-4xl md:text-5xl font-bold text-cyan mb-2 text-shadow-cyan">71+</div>
              <div className="font-space-mono text-xs md:text-sm text-[var(--text2)] uppercase tracking-widest">TryHackMe Rooms</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-6 border-b md:border-b-0 md:border-r border-[var(--border)]">
              <div className="font-orbitron text-4xl md:text-5xl font-bold text-cyan mb-2 text-shadow-cyan">8+</div>
              <div className="font-space-mono text-xs md:text-sm text-[var(--text2)] uppercase tracking-widest">Deployed Projects</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-6">
              <div className="font-orbitron text-4xl md:text-5xl font-bold text-cyan mb-2 text-shadow-cyan">
                100%
              </div>
              <div className="font-space-mono text-xs md:text-sm text-[var(--text2)] uppercase tracking-widest">
                Commitment
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
