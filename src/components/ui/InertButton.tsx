import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

/**
 * InertButton — a real-looking action that does nothing (a demo prop).
 * ---------------------------------------------------------------------------
 * Used for every "edit / adjust / new" affordance in the catalogo. On click it
 * shows a small, auto-dismissing note ("Non disponibile in questa demo") so the
 * control feels alive without navigating or mutating anything. Comment: this
 * secures/changes nothing.
 */
export function InertButton({
  children,
  variant = "secondary",
  size = "md",
  note = "Non disponibile in questa demo",
  className = "",
  notePlacement = "below",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "sm";
  note?: string;
  className?: string;
  notePlacement?: "below" | "above";
}) {
  const [showNote, setShowNote] = useState(false);
  const timer = useRef<number | null>(null);

  // Auto-hide the note ~2.4s after the last click; clean up on unmount.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleClick() {
    setShowNote(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShowNote(false), 2400);
  }

  const pos = notePlacement === "above" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]";

  return (
    <span className={`relative inline-flex ${className}`}>
      <Button variant={variant} size={size} onClick={handleClick}>
        {children}
      </Button>
      {showNote && (
        <span
          role="status"
          className={`absolute ${pos} right-0 z-20 whitespace-nowrap rounded-btn border border-border bg-bg px-s3 py-s2 text-[12px] font-medium text-ink-2 shadow-md`}
        >
          {note}
        </span>
      )}
    </span>
  );
}
