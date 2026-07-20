import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { monthlyRevenue } from "@/fixtures";
import { formatEuro, formatEuroCompact } from "@/lib/format";
import { usePrefersReducedMotion } from "@/lib/useTypewriter";

/**
 * RevenueChart — monthly revenue trend, styled native to Daniele's Touch.
 * ---------------------------------------------------------------------------
 * Cobalt area + line on pure white, hairline horizontal grid, tabular it-IT
 * currency in the axis + tooltip, no chart-junk (no legend, no vertical grid,
 * no axis lines). Data comes from the read-only monthlyRevenue() selector.
 * Entry animation is disabled under prefers-reduced-motion.
 */

// Accent (Cobalt) — read from the token value so it stays in sync.
const ACCENT = "#2B54F0";

// Custom tooltip: a small white card, hairline border, soft shadow.
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-btn border border-border bg-bg px-s3 py-s2 shadow-md">
      <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-3">
        {label}
      </div>
      <div className="num mt-[2px] text-[15px] font-bold text-ink">
        {formatEuro(payload[0].value)}
      </div>
    </div>
  );
}

export function RevenueChart() {
  const reduced = usePrefersReducedMotion();
  const data = monthlyRevenue();

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            {/* Soft Cobalt fill that fades to nothing. */}
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity={0.16} />
              <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Hairline horizontal grid only. */}
          <CartesianGrid vertical={false} stroke="#ECEEF2" />

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#858C97", fontSize: 12 }}
            dy={6}
          />
          <YAxis
            width={72}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#858C97", fontSize: 12 }}
            tickFormatter={(v: number) => formatEuroCompact(v)}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "#DEE2E9", strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="total"
            stroke={ACCENT}
            strokeWidth={2.5}
            fill="url(#revFill)"
            // Small accent dots; the active (hover) dot is larger.
            dot={{ r: 3, fill: ACCENT, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: ACCENT, stroke: "#FFFFFF", strokeWidth: 2 }}
            isAnimationActive={!reduced}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
