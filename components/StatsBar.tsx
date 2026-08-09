"use client";

import ScrollReveal from "./ScrollReveal";

export default function StatsBar() {
  return (
    <div className="w-full bg-(--bg2) border-y border-(--border)">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center text-center p-6 border-b md:border-b-0 md:border-r border-(--border)">
              <div className="font-orbitron text-4xl md:text-5xl font-bold text-cyan mb-2 text-shadow-cyan">45</div>
              <div className="font-space-mono text-xs md:text-sm text-(--text2) uppercase tracking-widest">Passing E2E Tests</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-6 border-b md:border-b-0 md:border-r border-(--border)">
              <div className="font-orbitron text-4xl md:text-5xl font-bold text-cyan mb-2 text-shadow-cyan">71+</div>
              <div className="font-space-mono text-xs md:text-sm text-(--text2) uppercase tracking-widest">TryHackMe Rooms</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-6 border-b md:border-b-0 md:border-r border-(--border)">
              <div className="font-orbitron text-4xl md:text-5xl font-bold text-cyan mb-2 text-shadow-cyan">8+</div>
              <div className="font-space-mono text-xs md:text-sm text-(--text2) uppercase tracking-widest">Deployed Projects</div>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-6">
              <div className="font-orbitron text-4xl md:text-5xl font-bold text-cyan mb-2 text-shadow-cyan">
                100%
              </div>
              <div className="font-space-mono text-xs md:text-sm text-(--text2) uppercase tracking-widest">
                Commitment
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
