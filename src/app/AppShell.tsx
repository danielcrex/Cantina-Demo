import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/app/Sidebar";
import { MobileTopBar, MobileDrawer } from "@/app/MobileNav";

/**
 * AppShell — the persistent layout for every in-app screen.
 * ---------------------------------------------------------------------------
 * Tablet/desktop (lg+, the LOCKED layout): fixed left <Sidebar> + a scrolling
 * content column — unchanged from the tablet source of truth.
 * Phone (<lg): the sidebar is hidden; a sticky <MobileTopBar> shows the logo +
 * hamburger, which opens the <MobileDrawer> overlay with the same nav.
 * The child route renders into <Outlet/>.
 */
export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg">
      {/* Desktop rail (lg+ only). */}
      <Sidebar />

      {/* Content column — scrolls on its own; sidebar stays put. */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile top bar (below lg only). */}
        <MobileTopBar onOpen={() => setDrawerOpen(true)} />
        {/* Tighter gutters on phone; the tablet padding is restored at lg+. */}
        <div className="mx-auto max-w-content px-s4 py-s5 lg:px-s7 lg:py-s6">
          <Outlet />
        </div>
      </main>

      {/* Mobile drawer overlay (below lg only). */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
