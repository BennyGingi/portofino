"use client";

import { useEffect, useState } from "react";
import { X, TerminalSquare } from "lucide-react";
import { openTerminal } from "./TerminalOverlay";

// Persisted in localStorage — once dismissed, never shown again.
const KEY = "terminal_hint_dismissed";

export default function TerminalHint() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // assume dismissed until checked (no flash)

  useEffect(() => {
    let already = false;
    try { already = localStorage.getItem(KEY) === "1"; } catch { /* private mode */ }
    if (already) return;
    setDismissed(false);
    const t = setTimeout(() => setVisible(true), 20000); // ~20s on page
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    try { localStorage.setItem(KEY, "1"); } catch { /* private mode */ }
  };

  if (dismissed) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 max-w-xs transition-all duration-500 motion-reduce:transition-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="relative bg-(--bg2) border border-(--cyan)/40 rounded-lg p-4 pr-9 shadow-[0_0_25px_rgba(0,229,200,0.12)] font-space-mono">
        <button
          onClick={dismiss}
          aria-label="Dismiss hint"
          className="absolute top-2 right-2 text-(--text3) hover:text-(--cyan) transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
        <div className="flex items-center gap-2 mb-1 text-(--cyan) text-xs font-bold">
          <TerminalSquare size={14} /> PSST — there&apos;s a terminal
        </div>
        <p className="text-(--text2) text-xs leading-relaxed">
          Hit{" "}
          <kbd className="px-1 border border-(--border) rounded-sm bg-(--bg3) text-(--text)">Ctrl+~</kbd>{" "}
          to open it, then run{" "}
          <button
            onClick={() => { dismiss(); openTerminal(); }}
            className="text-(--cyan) hover:underline cursor-pointer"
          >
            sudo hire benny
          </button>.
        </p>
      </div>
    </div>
  );
}
