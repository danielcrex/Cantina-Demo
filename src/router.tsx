import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/app/AppShell";
import { Dashboard } from "@/pages/Dashboard";
import { Catalogo } from "@/pages/Catalogo";
import { WineDetail } from "@/pages/WineDetail";
import { Assistant } from "@/pages/Assistant";
import { ComingSoon } from "@/pages/ComingSoon";
import { Login } from "@/pages/Login";

/**
 * Router (createBrowserRouter).
 * ---------------------------------------------------------------------------
 * - "/"            redirects to /dashboard (auto-login: no wall).
 * - "/login"       is the standalone auth PROP (rendered outside the shell).
 * - everything else lives inside <AppShell/>. Only /dashboard has real content
 *   in this step; every other nav route renders the "In arrivo" stub.
 *
 * `public/_redirects` (/* -> /index.html 200) makes these client routes resolve
 * as deep links on Cloudflare Pages' static SPA host.
 */
export const router = createBrowserRouter([
  // Login prop — full-screen, no sidebar.
  { path: "/login", element: <Login /> },

  // In-app shell.
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },

      // Vendite — Assistant is the combined AI page; /capture redirects to it.
      { path: "assistant", element: <Assistant /> },
      { path: "capture", element: <Navigate to="/assistant" replace /> },
      { path: "ordini", element: <ComingSoon /> },
      { path: "clienti", element: <ComingSoon /> },

      // Cantina
      { path: "catalogo", element: <Catalogo /> },
      { path: "catalogo/:wineId", element: <WineDetail /> },
      { path: "inventario", element: <ComingSoon /> },
      { path: "produzione", element: <ComingSoon /> },

      // Admin
      { path: "fatture", element: <ComingSoon /> },
      { path: "compliance", element: <ComingSoon /> },

      // Struttura
      { path: "sedi", element: <ComingSoon /> },
      { path: "governance", element: <ComingSoon /> },
    ],
  },

  // Unknown paths fall back to the dashboard (never a dead end in the demo).
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);
