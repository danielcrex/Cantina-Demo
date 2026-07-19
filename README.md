# ARBISU Cantina — Monte Fenosu (demo)

A **static, backend-free** pitch mockup of an AI-first inventory / order app for the
Sardinian winery **Azienda Vitivinicola Monte Fenosu**, presented **as ARBISU**
("ARBISU Cantina"). Built to run **fully offline** on a landscape tablet — no backend,
no database, no API, no auth server, no runtime network calls. All data is (or will be)
hardcoded TypeScript fixtures.

Design system: **Daniele's Touch** (pure white, hairline borders, soft shadows, one
Cobalt accent, Figtree). Italian-language UI.

> **Status — Step 0 (scaffold + theme + shell).** Routing, theme, self-hosted fonts,
> the app shell, the auto-login trick and the `/login` prop are in place. `/dashboard`
> is a minimal placeholder; every other nav item routes to an "In arrivo" stub. The
> Dashboard, Catalogo, Assistant and other screens come in later steps.

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

## Brand & estate assets (optional drop-ins)

- `public/brand/arbisu-black.png` — sidebar / login wordmark. If absent, the shell falls
  back to a clean text "ARBISU" in the display font.
- `public/estate/` — estate hero imagery for the Dashboard (used in a later step).

## Project layout

```
public/
  _redirects            Cloudflare Pages SPA rewrite
  fonts/                self-hosted Figtree (woff2)
  brand/                ARBISU wordmark drop-in
src/
  index.css             @font-face + design tokens (CSS vars) + base styles
  main.tsx              entry (AuthProvider + RouterProvider)
  router.tsx            createBrowserRouter route table
  auth/AuthContext.tsx  cosmetic auto-login (secures nothing — commented)
  app/                  AppShell, Sidebar, AccountMenu, nav model
  components/           Wordmark, PageHeader, ui/ (Button, Card)
  pages/                Dashboard (placeholder), Login (prop), ComingSoon (stub)
```
