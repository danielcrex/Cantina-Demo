import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePrefersReducedMotion } from "@/lib/useTypewriter";
import { formatEuro, formatNumber } from "@/lib/format";
import { confidenceTone, type CaptureScript } from "@/lib/assistantScript";

/**
 * CaptureReveal — the flashy beat, rendered inside an assistant turn.
 * ---------------------------------------------------------------------------
 * SCRIPTED REVEAL, NOT REAL EXTRACTION: the lines below are hardcoded on the
 * CaptureScript and reference real fixture wines/vintages/customers. We stage
 * their appearance (each line fades in, with its confidence score) to feel like
 * the assistant is "reading" the order, then show a tidy preview and a primary
 * "Conferma ordine". Confirming mutates NOTHING — no fixture write, no
 * navigation — it just swaps to a scripted success state.
 */
export function CaptureReveal({ script }: { script: CaptureScript }) {
  const reduced = usePrefersReducedMotion();

  // Stage the lines in one at a time (all at once under reduced motion).
  const [shownLines, setShownLines] = useState(reduced ? script.lines.length : 0);
  useEffect(() => {
    if (reduced) {
      setShownLines(script.lines.length);
      return;
    }
    setShownLines(0);
    const timers: number[] = [];
    script.lines.forEach((_, i) => {
      timers.push(window.setTimeout(() => setShownLines(i + 1), 350 + i * 420));
    });
    return () => timers.forEach(clearTimeout);
  }, [reduced, script.id, script.lines.length]);

  const allShown = shownLines >= script.lines.length;

  // Scripted confirmation (does nothing real).
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="w-full">
      <p className="text-[15px] text-ink">
        Ho letto l&apos;ordine. Ecco le righe che ho riconosciuto:
      </p>

      {/* Extracted lines with per-line confidence. */}
      <ul className="mt-s3 space-y-s2">
        {script.lines.slice(0, shownLines).map((l) => (
          <li
            key={`${l.wineId}-${l.vintageYear}`}
            className="flex items-center justify-between gap-s3 rounded-btn border border-border bg-surface px-s3 py-s2 transition-opacity duration-300"
          >
            <span className="min-w-0">
              <span className="text-[14px] font-semibold text-ink">
                {l.wineName} <span className="num text-ink-3">{l.vintageYear}</span>
              </span>
              <span className="num ml-s2 text-[13px] text-ink-2">
                {formatNumber(l.qtyBottles)} bott.
                {l.note ? ` (${l.note})` : ""}
              </span>
            </span>
            <Badge tone={confidenceTone(l.confidence)}>{l.confidence}%</Badge>
          </li>
        ))}
      </ul>

      {/* Preview + confirm appear once all lines are in. */}
      {allShown && (
        <div className="mt-s4">
          {/* Recognised customer + estimated total. */}
          <div className="flex flex-wrap items-center justify-between gap-s3 rounded-card border border-border bg-bg px-s4 py-s3">
            <div className="min-w-0">
              <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-3">
                Cliente riconosciuto
              </p>
              <p className="mt-[2px] text-[14px] font-semibold text-ink">
                {script.customerName}{" "}
                <span className="font-normal text-ink-3">· {script.customerCity}</span>
              </p>
            </div>
            <Badge tone={confidenceTone(script.customerConfidence)}>
              {script.customerConfidence}%
            </Badge>
          </div>

          <div className="mt-s3 flex items-center justify-between px-s1">
            <span className="text-[13px] text-ink-2">
              {script.lines.length} righe · totale stimato
            </span>
            <span className="num text-[15px] font-bold text-ink">
              {formatEuro(script.totalEur)}
            </span>
          </div>

          {/* Confirm / success */}
          <div className="mt-s4">
            {!confirmed ? (
              <Button variant="primary" onClick={() => setConfirmed(true)}>
                Conferma ordine
              </Button>
            ) : (
              <div className="flex flex-col gap-s2">
                <Badge tone="ok">Ordine bozza creato — BZ-2026-007</Badge>
                <p className="text-[12px] text-ink-3">
                  Anteprima dimostrativa — nessun ordine viene salvato.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
