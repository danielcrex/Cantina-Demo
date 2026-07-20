import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { CantinaWordmark } from "@/components/CantinaWordmark";
import { SidebarContent } from "@/app/Sidebar";

/**
 * Mobile navigation — below lg only. The tablet/desktop layout (lg+) uses the
 * fixed <Sidebar> and never renders these.
 *
 * MobileTopBar: a sticky bar with the Cantina logo + a hamburger that opens the
 * drawer. MobileDrawer: a left overlay drawer holding the SAME SidebarContent
 * (grouped nav, account menu, footer credit). It closes on backdrop tap, on
 * Escape, on any navigation (route change), and on resize up to lg. Motion
 * collapses under prefers-reduced-motion (global rule zeroes the durations).
 */

// ---- Top bar (lg:hidden) ---------------------------------------------------
export function MobileTopBar({ onOpen }: { onOpen: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-bg/90 px-s4 py-s2 backdrop-blur lg:hidden">
      <CantinaWordmark className="h-8 w-auto" />
      <button
        type="button"
        onClick={onOpen}
        aria-label="Apri il menu"
        aria-haspopup="dialog"
        className="grid h-11 w-11 place-items-center rounded-btn text-ink transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {/* Hamburger icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </header>
  );
}

// ---- Drawer (lg:hidden) ----------------------------------------------------
export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation();
  const closeRef = useRef<HTMLButtonElement>(null);
  // Keep the drawer mounted through its slide-out, then unmount.
  const [render, setRender] = useState(open);
  const [visible, setVisible] = useState(false);

  // Drive the enter/exit transition.
  useEffect(() => {
    if (open) {
      setRender(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = window.setTimeout(() => setRender(false), 240);
    return () => clearTimeout(t);
  }, [open]);

  // Close on any navigation (covers link taps + account-menu navigations).
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on Escape; focus the close button when opened.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Close if the viewport grows to lg (drawer is desktop-irrelevant there).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && onClose();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [onClose]);

  if (!render) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel — slides in from the left. */}
      <aside
        className={`absolute left-0 top-0 flex h-full w-[280px] max-w-[85%] flex-col border-r border-border bg-bg shadow-lg transition-transform duration-200 ${visible ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button, top-right of the panel. */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Chiudi il menu"
          className="absolute right-s3 top-s3 z-10 grid h-10 w-10 place-items-center rounded-btn text-ink-2 transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
