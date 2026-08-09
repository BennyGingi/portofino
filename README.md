# Portfolio — Benny Gingihashvili

Single-page portfolio for a SOC analyst / full-stack developer. Cyberpunk
terminal aesthetic, dark/light theming, and a set of interactive subsystems
(AI chat, live terminal, simulated threat feed, local analytics).

Live: https://bennygingi.tech

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@import "tailwindcss"`, no config file; CSS custom-property theme tokens)
- **Three.js** for the hero globe, **framer-motion** for scroll reveals
- **pnpm** package manager
- **Google Gemini** (`gemma-3-27b-it` via REST) behind the chat API
- Deployed on **Vercel**

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Create `.env.local`:

```
GEMINI_API_KEY=your_key_here   # required for the chat API (/api/chat)
```

## Scripts

```bash
pnpm dev        # dev server
pnpm build      # production build (runs the CV content guard first, see below)
pnpm start      # serve the production build
pnpm lint       # ESLint
```

There is no test suite.

## Architecture

`app/page.tsx` assembles every section vertically in one `<main>`; each section
is an independent component in `components/`. `HireBot`, `TerminalOverlay`, and
`AnalyticsPanel` are floating overlays. Several components communicate through
`window` custom events (`open-terminal`, `open-analytics`) instead of props, to
avoid drilling across the flat tree.

### Notable subsystems

- **HireBot** (`components/HireBot.tsx`) — fixed chat widget. POSTs to
  `/api/chat`, which calls Gemini with a hardcoded persona describing Benny.
  Includes programmatic jailbreak detection and a post-prompt sandwich defense.
- **TerminalOverlay** (`components/TerminalOverlay.tsx`) — full-screen
  interactive terminal (~20 commands: `help`, `whoami`, `sudo hire benny`,
  `matrix`, `curl resume`, …). Opens via the Hero button, the `open-terminal`
  event, or `Ctrl+~`.
- **AnalyticsPanel** (`components/AnalyticsPanel.tsx`) — full-screen dashboard
  reading entirely from `localStorage` (no server tracking). Opens via
  `Ctrl+Shift+A` or the `analytics` terminal command.
- **ThreatFeed** (`components/ThreatFeed.tsx`) — simulated live SOC alert feed.
  Real UI, mock data. Honors `prefers-reduced-motion`.
- **ParticleGlobe** (`components/ParticleGlobe.tsx`) — Three.js WebGL globe,
  `ssr: false`. Renders two distinct designs by theme.

### Theming

Tailwind v4 with CSS custom properties (`--bg`, `--cyan`, `--orange`, …). Dark
values on `:root`, light overrides on `[data-theme="light"]`; `next-themes`
sets the attribute. Use the variables, not hardcoded colors.

### SEO

`app/layout.tsx` sets Open Graph / Twitter metadata and a `Person` JSON-LD
block. `app/opengraph-image.tsx` generates the 1200×630 share card via
`next/og`. `app/robots.ts` and `app/sitemap.ts` round out crawlability.

### CV guard

`scripts/check-cv.mjs` runs on `prebuild`: it extracts the text of
`public/benny-cv-2026-08.pdf` and fails the build if the PDF leaks sensitive
strings (phone numbers, internal tool/infra names, MITRE technique IDs). If the
PDF is absent it warns and passes.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for `/api/chat` |
