# Cantina — Monte Fenosu (demo)

A **static, backend-free** pitch mockup of an AI-first inventory / order app for the
Sardinian winery **Azienda Vitivinicola Monte Fenosu**. The product is **Cantina**;
ARBISU appears only as a footer credit ("Cantina è offerto da ARBISU"). Built to run
**fully offline** on a landscape tablet — no backend, no database, no API, no auth
server, no runtime network calls. All data is hardcoded TypeScript fixtures.

Design system: **Daniele's Touch** (pure white, hairline borders, soft shadows, one
Cobalt accent, Figtree). Italian-language UI.

> **Status — complete demo.** Screens: Dashboard, Catalogo (+ wine detail), Assistant
> (chat + order capture), Ordini (+ detail), Fatture (+ detail), Clienti (+ detail),
> Giacenze, Produzione. AI moments: the proactive Pentumas stock-runway hero, the
> production-gap insight (runway + no 2024 bottling run), and the scripted order-capture.
> Compliance / Sedi / Governance are intentional "In arrivo" panels. Auto-login into
> `/dashboard`; `/login` is a reachable prop.

## Stack

- **Vite + React + TypeScript + Tailwind**
- **React Router** (`createBrowserRouter`)
- **Figtree** self-hosted (`public/fonts/`) so it renders with no connectivity
- Design tokens bound in `tailwind.config.ts` and mirrored as CSS variables in `src/index.css`

## Local development

```bash
npm install
npm run dev      # http://localhost:5173  — opens straight into /dashboard
```

Useful routes:

- `/dashboard` — the app auto-logs-in here (no login wall)
- `/login` — the credible auth **prop** (also reachable from the account menu);
  submitting anything, or "Entra nella demo", drops into `/dashboard`. It secures nothing.

## Build & deploy — Cloudflare Pages

| Setting              | Value            |
| -------------------- | ---------------- |
| **Build command**    | `npm run build`  |
| **Output directory** | `dist`           |

```bash
npm run build    # type-checks, then emits the static site to dist/
npm run preview  # serve the production build locally
```

`public/_redirects` contains `/* /index.html 200` so client-side deep links (e.g.
`/login`, `/catalogo`) resolve on Cloudflare Pages' static SPA host. Do **not** add any
server or edge functions — this is a pure static deploy.

## Pinning the demo date for a pitch day

The whole demo reads "today" from a single anchor: **`src/lib/demoDate.ts`** →
`DEMO_TODAY`. Every date-driven figure (the header date, the "ricavi di <mese>" KPI,
the Pentumas runway/"a marzo", overdue/AR checks, the revenue graph) is derived from it,
so the timeline is always internally consistent.

It is **pinned to a fixed date** (20 gennaio 2026) on purpose: the fixtures are a static
snapshot around that month, so a live clock would leave the current-month KPI empty and
the graph ending before "today". **To pin another pitch day**, change the one line in
`src/lib/demoDate.ts` (keep it on/after the newest fixture order so the runway and KPIs
stay coherent). The runway itself is robust — its velocity is measured from the most
recent order data and projected forward from `DEMO_TODAY`, so the run-out is always in
the future.

## Brand & estate assets

- `public/brand/arbisu-black.png` — ARBISU logo used only in the footer credit. If absent,
  the credit falls back to a clean text "ARBISU" in the display font.
- `public/estate/monte-fenosu.jpg` — estate hero photo on the Dashboard. If absent, the
  panel falls back to a neutral vineyard-toned gradient. No image is fetched remotely.

## Project layout

```
public/
  _redirects            Cloudflare Pages SPA rewrite
  fonts/                self-hosted Figtree (woff2)
  brand/                ARBISU credit logo
  estate/               estate hero photo
src/
  index.css             @font-face + design tokens (CSS vars) + base styles
  main.tsx              entry (AuthProvider + RouterProvider)
  router.tsx            createBrowserRouter route table
  auth/AuthContext.tsx  cosmetic auto-login (secures nothing — commented)
  app/                  AppShell, Sidebar, AccountMenu, nav model
  components/           Wordmark, PageHeader, ui/ (Button, Card)
  pages/                Dashboard (placeholder), Login (prop), ComingSoon (stub)
```
