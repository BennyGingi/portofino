"use client";

import { useEffect, useState } from "react";

// Tracks the user's `prefers-reduced-motion` setting. SSR-safe: defaults to
// false on the server and first client render, then updates after mount and on
// change. Used to gate JS-driven animation (Three.js globe, live feed, cursor,
// scroll reveals) that CSS media queries alone can't stop.
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
