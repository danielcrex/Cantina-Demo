import { useState, type ReactNode } from "react";

/**
 * Collapsible — a lightweight accordion section.
 * ---------------------------------------------------------------------------
 * Header button (title + optional caption + optional right-side node) toggles
 * the body. Chevron rotates. Used for inline vintage rows and the inert
 * "Storico & tracciabilità" block. `deemphasized` dims the header for
 * low-priority sections.
 */
export function Collapsible({
  title,
  caption,
  right,
  defaultOpen = false,
  deemphasized = false,
  children,
}: {
  title: ReactNode;
  caption?: ReactNode;
  right?: ReactNode;
  defaultOpen?: boolean;
  deemphasized?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-[52px] w-full items-center gap-s4 rounded-btn px-s2 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
      >
        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`flex-none transition-transform ${open ? "rotate-90" : ""} ${
            deemphasized ? "text-ink-3" : "text-ink-2"
          }`}
          aria-hidden="true"
        >
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="min-w-0 flex-1">
          <span
            className={`block text-[15px] font-semibold ${
              deemphasized ? "text-ink-2" : "text-ink"
            }`}
          >
            {title}
          </span>
          {caption && <span className="block text-[13px] text-ink-3">{caption}</span>}
        </span>

        {right && <span className="flex-none">{right}</span>}
      </button>

      {open && <div className="px-s2 pb-s3 pt-s2">{children}</div>}
    </div>
  );
}
