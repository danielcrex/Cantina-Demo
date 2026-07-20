import type { ReactNode } from "react";

/**
 * Panel — a Card with a standard section header.
 * ---------------------------------------------------------------------------
 * Title (+ optional small caption) on the left, optional action on the right
 * (usually a ghost "vedi tutto" link). Body renders beneath. Hierarchy comes
 * from weight + whitespace; the header has no divider rule under it.
 */
export function Panel({
  title,
  caption,
  action,
  children,
  className = "",
  bodyClassName = "",
}: {
  title: string;
  caption?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={`rounded-card border border-border bg-bg p-s5 shadow-sm ${className}`}
    >
      <header className="mb-s4 flex items-start justify-between gap-s3">
        <div className="min-w-0">
          <h2 className="font-display text-[16px] font-bold tracking-tight text-ink">
            {title}
          </h2>
          {caption && <p className="mt-[2px] text-[13px] text-ink-3">{caption}</p>}
        </div>
        {action && <div className="flex-none">{action}</div>}
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
