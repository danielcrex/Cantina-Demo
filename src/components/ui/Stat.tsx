import type { ReactNode } from "react";

/**
 * Stat — a KPI tile.
 * ---------------------------------------------------------------------------
 * Label above, big tabular numeral, optional sub-line, optional delta below in
 * a semantic colour. The numeral uses `.num` (tabular figures) so a row of
 * tiles aligns cleanly. Depth from the Card-like white surface + hairline.
 */

export interface StatProps {
  label: string;
  /** The primary figure — pre-formatted (e.g. "7.108" or "10.104 €"). */
  value: ReactNode;
  /** Optional smaller line under the value (e.g. "591 casse"). */
  sub?: ReactNode;
  /** Optional delta text (e.g. "+18% sul mese").  */
  delta?: string;
  /** Semantic tone of the delta. 'up' green, 'down' red, 'muted' grey. */
  deltaTone?: "up" | "down" | "muted";
}

const deltaColor: Record<NonNullable<StatProps["deltaTone"]>, string> = {
  up: "text-positive",
  down: "text-danger",
  muted: "text-ink-3",
};

export function Stat({ label, value, sub, delta, deltaTone = "muted" }: StatProps) {
  return (
    <div className="rounded-card border border-border bg-bg p-s5 shadow-sm">
      <div className="text-[13px] font-medium text-ink-2">{label}</div>
      <div className="num mt-s2 text-[30px] font-bold leading-tight tracking-tight text-ink">
        {value}
      </div>
      {sub && <div className="num mt-[2px] text-[13px] text-ink-3">{sub}</div>}
      {delta && (
        <div className={`mt-s2 text-[12px] font-semibold ${deltaColor[deltaTone]}`}>
          {delta}
        </div>
      )}
    </div>
  );
}
