# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev       # Start dev server (localhost:3000)
pnpm build     # Production build
pnpm start     # Start production server
pnpm lint      # Run ESLint
```

There are no tests in this project.

## Architecture

**Single-page portfolio** — `app/page.tsx` assembles all sections vertically in one `<main>`. Each section is an independent React component in `components/`. The page renders top-to-bottom: `Navbar → Hero → StatsBar → ThreatFeed → About → Experience → Projects → Skills → Education → Contact → Footer`, with `HireBot`, `TerminalOverlay`, and `AnalyticsPanel` as floating overlays.

**Stack**: Next.js 16.2.4 (App Router), React 19, TypeScript, Tailwind CSS v4, `pnpm`.

### Key subsystems

**HireBot (`components/HireBot.tsx`)** — fixed chat widget (bottom-right). POSTs to `/api/chat` with a `{ messages }` array. The route calls Google Gemini (`gemma-3-27b-it` via REST) with a hardcoded system prompt describing Benny. Requires `GEMINI_API_KEY` in `.env.local`. Has programmatic jailbreak detection before the LLM call and a post-prompting sandwich defense.

**TerminalOverlay (`components/TerminalOverlay.tsx`)** — full-screen interactive terminal. Opens via `window.dispatchEvent(new Event("open-terminal"))` (exported as `openTerminal()`), or `Ctrl+\``. Has ~20 commands (`help`, `whoami`, `sudo hire benny`, `matrix`, `curl resume`, etc.). The `curl resume` command opens `/benny-cv.pdf` — place the PDF at `public/benny-cv.pdf`.

**AnalyticsPanel (`components/AnalyticsPanel.tsx`)** — full-screen dashboard. Opens via `window.dispatchEvent(new Event("open-analytics"))`, or `Ctrl+Shift+A`, or the `analytics` terminal command. Reads entirely from `localStorage` — no server tracking.

**Analytics (`lib/analytics.ts`)** — client-side only, `localStorage` key `portfolio_analytics`. Tracks visits, section views (via `IntersectionObserver` in `AnalyticsTracker`), project hovers, chat messages, terminal commands/opens, theme, device, browser, referrer, and `sudo hire benny` count.

**ParticleGlobe (`components/ParticleGlobe.tsx`)** — Three.js WebGL globe, `ssr: false` dynamic import (see `Hero.tsx`). Renders two entirely different designs depending on theme: particle cloud (light) vs orbital rings atom (dark). Rebuilds fully on theme change via `resolvedTheme` effect dependency.

### Theming

Tailwind v4 uses `@import "tailwindcss"` in `globals.css` (no `tailwind.config.js`). The theme token approach uses CSS custom properties — `--bg`, `--bg2`, `--bg3`, `--bg4`, `--border`, `--border2`, `--border3`, `--text`, `--text2`, `--text3`, `--cyan`, `--orange`. Dark values are on `:root`; light values override on `[data-theme="light"]`. `ThemeProvider` from `next-themes` sets `attribute="data-theme"` on `<html>`.

Always use these CSS variables for colors rather than hardcoding. For Tailwind classes referencing theme variables, use the `(--var-name)` shorthand syntax (e.g. `text-(--cyan)`, `bg-(--bg3)`).

### Fonts

Three Google Fonts loaded in `app/layout.tsx` as CSS variables:
- `--font-inter` → body text
- `--font-space-mono` → monospace/terminal UI
- `--font-orbitron` → headings, labels, cyberpunk display text

Use via Tailwind: `font-inter`, `font-space-mono`, `font-orbitron`.

### Event bus pattern

Several components communicate via `window` custom events instead of props/context:
- `open-terminal` / `close-terminal` → TerminalOverlay
- `open-analytics` → AnalyticsPanel

This is intentional to avoid prop-drilling across the flat component tree.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for `/api/chat` |
