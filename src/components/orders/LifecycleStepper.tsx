import type { Order } from "@/fixtures";
import { ORDER_LIFECYCLE, cap } from "@/components/orders/display";

/**
 * LifecycleStepper — horizontal order lifecycle.
 * ---------------------------------------------------------------------------
 * bozza -> confermato -> preparato -> spedito -> fatturato -> pagato.
 * Prior steps are "done" (accent + check), the current step is highlighted
 * (accent ring), later steps are muted. Tasteful, on-theme; no colour beyond
 * the single accent.
 */
export function LifecycleStepper({ status }: { status: Order["status"] }) {
  const currentIndex = ORDER_LIFECYCLE.indexOf(status);

  return (
    <ol className="flex items-start">
      {ORDER_LIFECYCLE.map((step, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        const isLast = i === ORDER_LIFECYCLE.length - 1;

        return (
          <li key={step} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {/* Left connector (hidden on the first step). */}
              <span
                className={`h-[2px] flex-1 ${i === 0 ? "opacity-0" : done || current ? "bg-accent" : "bg-border-2"}`}
                aria-hidden="true"
              />
              {/* Node */}
              <span
                className={[
                  "grid h-8 w-8 flex-none place-items-center rounded-full text-[12px] font-bold",
                  done
                    ? "bg-accent text-accent-ink"
                    : current
                      ? "bg-bg text-accent ring-2 ring-accent"
                      : "bg-surface-2 text-ink-3",
                ].join(" ")}
              >
                {done ? (
                  // check mark
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 12.5l4 4 10-10"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : current ? (
                  <span className="h-[9px] w-[9px] rounded-full bg-accent" />
                ) : (
                  <span className="num">{i + 1}</span>
                )}
              </span>
              {/* Right connector (hidden on the last step). */}
              <span
                className={`h-[2px] flex-1 ${isLast ? "opacity-0" : done ? "bg-accent" : "bg-border-2"}`}
                aria-hidden="true"
              />
            </div>
            {/* Label */}
            <span
              className={`mt-s2 text-center text-[12px] ${
                current ? "font-bold text-ink" : done ? "font-medium text-ink-2" : "text-ink-3"
              }`}
            >
              {cap(step)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
