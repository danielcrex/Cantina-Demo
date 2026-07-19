import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTypewriter, usePrefersReducedMotion } from "@/lib/useTypewriter";
import { formatDate, formatNumber } from "@/lib/format";
import { getPentumasRunway, type Insight } from "@/fixtures";

/**
 * A small "sparkle" mark for the assistant voice. Inline SVG (not an emoji),
 * tinted with the accent — used on the hero insight only.
 */
function SparkMark() {
  return (
    <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-accent-weak text-accent shadow-sm">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3l1.8 4.9L18.7 9l-4.9 1.8L12 15.7 10.2 10.8 5.3 9l4.9-1.8L12 3z"
          fill="currentColor"
        />
        <circle cx="18.5" cy="17.5" r="1.6" fill="currentColor" />
      </svg>
    </span>
  );
}

/**
 * HeroInsight — THE WOW.
 * ---------------------------------------------------------------------------
 * The app "noticing" something true about the estate's own wines and saying it
 * in plain Italian. The run-out month is computed from the fixtures
 * (getPentumasRunway), so the sentence is TRUE, not asserted.
 *
 * Scripted reveal: the card fades/rises in, then the headline types itself out
 * — both collapse to instant under prefers-reduced-motion. The primary action
 * opens a scripted confirmation that MUTATES NOTHING (it's a prop).
 */
export function HeroInsight({ insight }: { insight: Insight }) {
  const reduced = usePrefersReducedMotion();
  const runway = getPentumasRunway();

  // Build the headline from live numbers so "a marzo" is always the real month.
  const headline =
    `Il Pentumas 2023 — oro al Concours Mondial de Bruxelles — è il tuo vino ` +
    `in più rapida crescita. Di questo passo finisci le scorte a ${runway.runoutMonth}. ` +
    `Vuoi che avvisi i clienti abituali?`;

  // Fade/rise-in on mount.
  const [shown, setShown] = useState(reduced);
  useEffect(() => {
    if (reduced) return setShown(true);
    const id = window.setTimeout(() => setShown(true), 40);
    return () => clearTimeout(id);
  }, [reduced]);

  // Typewriter the headline once the card is in.
  const { text, done } = useTypewriter(headline, { enabled: shown });

  // Scripted confirmation state (does nothing real).
  const [notified, setNotified] = useState(false);

  return (
    <section
      className="rounded-card border border-border bg-bg p-s6 shadow-md transition-[opacity,transform] duration-500"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(8px)",
      }}
      aria-label="Approfondimento intelligente"
    >
      <div className="flex items-start gap-s4">
        <SparkMark />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-s3">
            <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-accent">
              ARBISU · Assistente
            </span>
            <Badge tone="warn">Attenzione scorte</Badge>
          </div>

          {/* The headline — types itself in. A caret blinks while typing. */}
          <p className="mt-s3 max-w-[760px] text-[19px] font-semibold leading-relaxed text-ink">
            {text}
            {!done && (
              <span className="ml-[1px] inline-block h-[1.05em] w-[2px] -translate-y-[1px] animate-pulse bg-accent align-middle" />
            )}
          </p>

          {/* Supporting numbers — this is the analytics behind the sentence. */}
          <p className="num mt-s3 text-[13px] text-ink-2">
            {formatNumber(runway.stockBottles)} bottiglie in giacenza ·
            {" "}~{formatNumber(runway.perMonth)} bottiglie/mese, in crescita ·
            {" "}esaurimento stimato {formatDate(runway.runoutDate)}
          </p>

          {/* Action / scripted confirmation. */}
          <div className="mt-s5">
            {!notified ? (
              <Button variant="primary" onClick={() => setNotified(true)}>
                {insight.actionLabelIt ?? "Avvisa i clienti abituali"}
              </Button>
            ) : (
              <div className="flex flex-col gap-s2">
                <Badge tone="ok">
                  Avviso preparato per i clienti abituali del Pentumas
                </Badge>
                <p className="text-[12px] text-ink-3">
                  Anteprima dimostrativa — nessun messaggio viene inviato.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * QuietInsight — the calmer secondary insights beneath the hero.
 * Flat surface, small tone dot, no scripted animation. An optional ghost action
 * shows a tiny inline acknowledgement (also inert).
 */
export function QuietInsight({ insight }: { insight: Insight }) {
  const [ack, setAck] = useState(false);
  const tone = insight.severity === "attention" ? "warn" : "accent";
  const dot =
    insight.severity === "attention" ? "bg-warning" : "bg-accent";

  return (
    <div className="flex items-start gap-s3 rounded-card border border-border bg-surface p-s4">
      <span className={`mt-[6px] h-[8px] w-[8px] flex-none rounded-full ${dot}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-relaxed text-ink-2">{insight.headlineIt}</p>
        {insight.actionLabelIt && (
          <div className="mt-s2">
            {!ack ? (
              <Button variant="ghost" size="sm" onClick={() => setAck(true)}>
                {insight.actionLabelIt}
              </Button>
            ) : (
              <Badge tone={tone}>Pronto</Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
