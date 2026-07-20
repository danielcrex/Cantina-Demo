import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { InertButton } from "@/components/ui/InertButton";
import {
  WINES,
  getWineStock,
  getWineStockStatus,
  vintagesOfWine,
} from "@/fixtures";
import { formatNumber } from "@/lib/format";
import { WINE_TYPE_LABEL, WINE_TYPE_DOT, STOCK_STATUS_BADGE } from "@/components/catalogo/display";

/**
 * Catalogo — the wine list.
 * ---------------------------------------------------------------------------
 * Full-width rows, ONE per line (not a card grid), matching the real app's
 * bones. Each row shows identity + inline available stock + a semantic
 * stock flag, and taps through to the flattened detail. Header actions are
 * visual-only (InertButton). Everything reads from fixtures.
 */
export function Catalogo() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        eyebrow="Cantina"
        title="Catalogo"
        subtitle="I vini di Monte Fenosu, con la disponibilità aggiornata per annata."
        actions={
          <>
            <InertButton variant="secondary">Giacenze</InertButton>
            <InertButton variant="primary">Nuovo vino</InertButton>
          </>
        }
      />

      {/* One card holding the full-width rows; hairline dividers between them. */}
      <Card className="p-0">
        <ul className="divide-y divide-border">
          {WINES.map((wine) => {
            const stock = getWineStock(wine.id);
            const status = getWineStockStatus(wine.id);
            const badge = STOCK_STATUS_BADGE[status];
            const vintageCount = vintagesOfWine(wine.id).length;

            return (
              <li key={wine.id}>
                {/* The whole row is one large tap target -> detail. */}
                <button
                  onClick={() => navigate(`/catalogo/${wine.id}`)}
                  className="flex w-full items-center gap-s5 px-s5 py-s4 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                >
                  {/* Identity */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-s3">
                      <span className="font-display text-[18px] font-bold tracking-tight text-ink">
                        {wine.name}
                      </span>
                      {/* Type marker: decorative swatch + word. */}
                      <span className="inline-flex items-center gap-s2 text-[13px] text-ink-3">
                        <span
                          className="h-[9px] w-[9px] flex-none rounded-full ring-1 ring-border-2"
                          style={{ backgroundColor: WINE_TYPE_DOT[wine.type] }}
                          aria-hidden="true"
                        />
                        {WINE_TYPE_LABEL[wine.type]}
                      </span>
                    </div>
                    <p className="mt-[3px] truncate text-[14px] text-ink-2">
                      {wine.appellation}
                    </p>
                    <p className="mt-[2px] truncate text-[13px] text-ink-3">
                      {wine.grapes.join(", ")} · {wine.abv}% vol ·{" "}
                      {vintageCount} annate
                    </p>
                  </div>

                  {/* Inline available stock */}
                  <div className="hidden w-[190px] flex-none text-right sm:block">
                    <p className="num text-[16px] font-bold text-ink">
                      {formatNumber(stock.bottles)}{" "}
                      <span className="text-[13px] font-semibold text-ink-3">bott.</span>
                    </p>
                    <p className="num text-[13px] text-ink-3">
                      {formatNumber(stock.cases)} casse disponibili
                    </p>
                  </div>

                  {/* Stock flag (colour + dot + word) */}
                  <div className="w-[120px] flex-none text-right">
                    <Badge tone={badge.tone}>{badge.label}</Badge>
                  </div>

                  {/* Chevron affordance */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="flex-none text-ink-3"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
