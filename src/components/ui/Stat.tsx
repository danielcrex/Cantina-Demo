import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Stat — a KPI tile.
 * ---------------------------------------------------------------------------
 * Label above, big tabular numeral, optional sub-line, optional delta below in
 * a semantic colour. The numeral uses `.num` (tabular figures) so a row of
 * tiles aligns cleanly. Depth from the Card-like white surface + hairline.
 *
 * Pass `to` to make the WHOLE tile a tap target that navigates there (on-theme
 * hover: lift + border). Without `to` it renders as a plain tile.
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
  /** If set, the tile becomes a link to this route. */
  to?: string;
}

const deltaColor: Record<NonNullable<StatProps["deltaTone"]>, string> = {
  up: "text-positive",
  down: "text-danger",
  muted: "text-ink-3",
};

export function Stat({ label, value, sub, delta, deltaTone = "muted", to }: StatProps) {
  // Inner content is shared between the plain and linked variants.
  const inner = (
    <>
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
    </>
  );

  const base = "block rounded-card border border-border bg-bg p-s5 shadow-sm";

  if (to) {
    return (
      <Link
        to={to}
        className={`${base} h-full transition-[box-shadow,border-color] hover:border-ink-3 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={base}>{inner}</div>;
}
