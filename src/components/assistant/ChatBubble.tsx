import type { ReactNode } from "react";

/**
 * ChatBubble — one turn in the assistant thread.
 * ---------------------------------------------------------------------------
 * Assistant turns sit left with a small accent "spark" mark and a white,
 * softly-shadowed card (distinct, but no coloured bubble). User turns sit right
 * on a faint surface tint. Calm, on the pure-white base.
 */

// The assistant's little spark mark (inline SVG, not an emoji).
function SparkMark() {
  return (
    <span className="grid h-8 w-8 flex-none place-items-center rounded-[9px] bg-accent-weak text-accent shadow-sm">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3l1.8 4.9L18.7 9l-4.9 1.8L12 15.7 10.2 10.8 5.3 9l4.9-1.8L12 3z"
          fill="currentColor"
        />
        <circle cx="18.5" cy="17.5" r="1.6" fill="currentColor" />
      </svg>
    </span>
  );
}

export function ChatBubble({
  role,
  children,
}: {
  role: "assistant" | "user";
  children: ReactNode;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-card rounded-tr-[4px] border border-border bg-surface-2 px-s4 py-s3 text-[15px] leading-relaxed text-ink">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-s3">
      <SparkMark />
      <div className="max-w-[80%] rounded-card rounded-tl-[4px] border border-border bg-bg px-s4 py-s3 text-[15px] leading-relaxed text-ink shadow-sm">
        {children}
      </div>
    </div>
  );
}
