"use client";

// Thin vertical guide lines across the full page height. 4 on desktop, 2 on
// mobile. Purely decorative.
export default function GuideLines() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[5]">
      <div className="mx-auto h-full max-w-7xl px-6">
        <div className="relative h-full">
          {[12.5, 37.5, 62.5, 87.5].map((left, i) => (
            <span
              key={left}
              className={`absolute top-0 h-full w-px bg-white/[0.06] ${i === 0 || i === 3 ? "" : "hidden md:block"}`}
              style={{ left: `${left}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
