import type { HTMLAttributes } from "react";

/**
 * Card — the base surface of the system.
 * ---------------------------------------------------------------------------
 * White fill, hairline border, small soft shadow ("floating on white").
 * `flat` drops the shadow and uses the faint surface tint instead — for nested
 * or lower-emphasis panels. Depth never comes from grey/coloured fills.
 */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  flat?: boolean;
}

export function Card({ flat = false, className = "", ...props }: CardProps) {
  const surface = flat
    ? "bg-surface border-border" // flat: no shadow, faint surface tint
    : "bg-bg border-border shadow-sm"; // default: white + small shadow

  return (
    <div
      className={`rounded-card border p-s5 ${surface} ${className}`}
      {...props}
    />
  );
}
