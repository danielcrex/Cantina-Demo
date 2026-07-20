import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

/**
 * Account / logout menu — sits at the bottom of the sidebar.
 * ---------------------------------------------------------------------------
 * Shows the (hardcoded) signed-in owner. Clicking opens a small popover with:
 *   - "Vai al login"  -> navigates to the /login prop (proves auth exists)
 *   - "Esci"          -> cosmetic sign-out, then lands on /login
 * None of this secures anything (see AuthContext).
 */
export function AccountMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {/* Popover — anchored above the trigger. */}
      {open && (
        <div
          role="menu"
          className="absolute bottom-[calc(100%+8px)] left-0 right-0 rounded-card border border-border bg-bg p-s2 shadow-lg"
        >
          <button
            role="menuitem"
            className="block w-full rounded-btn px-s3 py-s3 text-left text-sm font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
            onClick={() => {
              setOpen(false);
              navigate("/login");
            }}
          >
            Vai al login
          </button>
          <button
            role="menuitem"
            className="block w-full rounded-btn px-s3 py-s3 text-left text-sm font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
            onClick={() => {
              setOpen(false);
              signOut(); // cosmetic
              navigate("/login");
            }}
          >
            Esci
          </button>
        </div>
      )}

      {/* Trigger — avatar + name + role. >= 44px tall for tablet taps. */}
      <button
        className="flex w-full items-center gap-s3 rounded-btn border border-border bg-bg px-s3 py-s2 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {/* Estate initials avatar. */}
        <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-accent-weak text-[13px] font-bold text-accent">
          {user.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink">
            {user.estate}
          </span>
          <span className="block truncate text-[12px] text-ink-3">
            {user.role} · {user.name}
          </span>
        </span>
        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`flex-none text-ink-3 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
