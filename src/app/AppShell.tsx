import { Outlet } from "react-router-dom";
import { Sidebar } from "@/app/Sidebar";

/**
 * AppShell — the persistent layout for every in-app screen.
 * ---------------------------------------------------------------------------
 * Fixed left sidebar + a scrolling content column. Tablet-first (landscape
 * ~1024–1280px): the sidebar is always visible at this width. The child route
 * renders into <Outlet/>.
 *
 * (A mobile hamburger/drawer is out of scope for this step — the demo runs on a
 *  landscape tablet.)
 */
export function AppShell() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg">
      <Sidebar />
      {/* Content column — scrolls on its own; sidebar stays put. */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-content px-s7 py-s6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
