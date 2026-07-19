import type { ReactNode } from "react";

/**
 * PageHeader — the standard title block for a screen.
 * Hierarchy comes from weight + whitespace (no dividers). Optional eyebrow
 * above, optional actions on the right.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-s6 flex items-start justify-between gap-s5">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-s2 font-display text-[32px] font-extrabold leading-tight text-ink font-display-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-s3 max-w-[560px] text-[15px] leading-relaxed text-ink-2">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-none items-center gap-s3">{actions}</div>}
    </header>
  );
}
