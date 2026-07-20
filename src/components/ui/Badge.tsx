import type { ReactNode } from "react";

/**
 * Badge — status as colour + dot + word (never colour alone), per the a11y rule.
 * ---------------------------------------------------------------------------
 * Pill shape, semantic tint background with a matching dot. `neutral` is the
 * undifferentiated default.
 */

export type BadgeTone = "neutral" | "ok" | "warn" | "err" | "accent";

const tones: Record<BadgeTone, { wrap: string; dot: string }> = {
  neutral: { wrap: "bg-surface-2 text-ink-2", dot: "bg-ink-3" },
  ok: { wrap: "bg-positive-weak text-positive", dot: "bg-positive" },
  warn: { wrap: "bg-warning-weak text-warning", dot: "bg-warning" },
  err: { wrap: "bg-danger-weak text-danger", dot: "bg-danger" },
  accent: { wrap: "bg-accent-weak text-accent", dot: "bg-accent" },
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: BadgeTone;
  children: ReactNode;
}) {
  const t = tones[tone];
  return (
    <span
      className={`inline-flex items-center gap-s2 rounded-pill px-s3 py-[4px] text-[12px] font-semibold ${t.wrap}`}
    >
      <span className={`h-[7px] w-[7px] flex-none rounded-full ${t.dot}`} />
      {children}
    </span>
  );
}
