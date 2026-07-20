import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { InertButton } from "@/components/ui/InertButton";
import {
  ORDERS,
  customerById,
  type Order,
  type Channel,
} from "@/fixtures";
import { formatEuro, formatDate } from "@/lib/format";
import {
  ORDER_STATUS_TONE,
  PAYMENT_TONE,
  PAYMENT_LABEL,
  cap,
  channelLabel,
} from "@/components/orders/display";

/**
 * Ordini — the unified order list.
 * ---------------------------------------------------------------------------
 * Filter / sort / search all operate over the fixture array via local React
 * state (real, not faked — but nothing is persisted or mutated). Rows tap
 * through to the detail. Calm, premium; the controls stay restrained.
 */

// Filter option sets, derived once from the data so the selects stay in sync.
const CHANNELS: Channel[] = ["ristorante", "enoteca", "agriturismo", "distributore", "privato"];
const STATUSES: Order["status"][] = [
  "bozza",
  "confermato",
  "preparato",
  "spedito",
  "fatturato",
  "pagato",
];

type SortKey = "data-desc" | "data-asc" | "totale-desc" | "totale-asc";

// Shared classes for the small on-theme select controls.
const selectClass =
  "min-h-[44px] rounded-input border border-border-2 bg-bg px-s3 pr-s5 text-[14px] text-ink " +
  "focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-weak";

export function Ordini() {
  const navigate = useNavigate();

  // Control state (local only).
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState<Channel | "tutti">("tutti");
  const [status, setStatus] = useState<Order["status"] | "tutti">("tutti");
  const [sort, setSort] = useState<SortKey>("data-desc");

  // Apply filter -> search -> sort over the fixtures. Recomputed on any change.
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = ORDERS.filter((o) => {
      if (channel !== "tutti" && o.channel !== channel) return false;
      if (status !== "tutti" && o.status !== status) return false;
      if (q) {
        const cust = customerById(o.customerId)?.name.toLowerCase() ?? "";
        // Search matches the order number or the customer name.
        if (!o.number.toLowerCase().includes(q) && !cust.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "data-asc":
          return a.date.localeCompare(b.date);
        case "totale-desc":
          return b.totalEur - a.totalEur;
        case "totale-asc":
          return a.totalEur - b.totalEur;
        case "data-desc":
        default:
          return b.date.localeCompare(a.date);
      }
    });
    return list;
  }, [query, channel, status, sort]);

  return (
    <>
      <PageHeader
        eyebrow="Vendite"
        title="Ordini"
        subtitle="Tutti gli ordini, con stato di lavorazione e di pagamento."
        // "Nuovo ordine" relocated here from the dashboard; visual-only.
        actions={<InertButton variant="primary">Nuovo ordine</InertButton>}
      />

      {/* Controls: search + filters + sort. Restrained, on-theme. */}
      <div className="mb-s4 flex flex-wrap items-center gap-s3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca numero o cliente…"
          aria-label="Cerca ordini"
          className="min-h-[44px] flex-1 min-w-[220px] rounded-input border border-border-2 bg-bg px-s4 text-[15px] text-ink focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-weak"
        />
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value as Channel | "tutti")}
          aria-label="Filtra per canale"
          className={selectClass}
        >
          <option value="tutti">Tutti i canali</option>
          {CHANNELS.map((c) => (
            <option key={c} value={c}>
              {channelLabel(c)}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Order["status"] | "tutti")}
          aria-label="Filtra per stato"
          className={selectClass}
        >
          <option value="tutti">Tutti gli stati</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {cap(s)}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Ordina"
          className={selectClass}
        >
          <option value="data-desc">Data (recente)</option>
          <option value="data-asc">Data (meno recente)</option>
          <option value="totale-desc">Totale (alto)</option>
          <option value="totale-asc">Totale (basso)</option>
        </select>
      </div>

      {/* Result count — small, quiet. */}
      <p className="mb-s3 text-[13px] text-ink-3">
        <span className="num">{rows.length}</span>{" "}
        {rows.length === 1 ? "ordine" : "ordini"}
      </p>

      {/* The list */}
      <Card className="p-0">
        {rows.length === 0 ? (
          // Empty state (search/filters exclude everything).
          <div className="px-s5 py-s7 text-center">
            <p className="text-[15px] font-semibold text-ink">Nessun ordine trovato</p>
            <p className="mt-s2 text-[14px] text-ink-2">
              Prova a modificare i filtri o la ricerca.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((o) => {
              const customer = customerById(o.customerId);
              return (
                <li key={o.id}>
                  <button
                    onClick={() => navigate(`/ordini/${o.id}`)}
                    // Phone: wraps to two lines (meta, then badges). Tablet
                    // (sm+): single nowrap row — unchanged.
                    className="flex w-full flex-wrap items-center gap-x-s4 gap-y-s2 px-s5 py-s4 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset sm:flex-nowrap"
                  >
                    {/* Numero + cliente + canale + data */}
                    <div className="min-w-0 flex-1 basis-full sm:basis-auto">
                      <div className="flex items-center gap-s3">
                        <span className="num text-[15px] font-bold text-ink">{o.number}</span>
                        <span className="truncate text-[14px] text-ink-2">
                          {customer?.name ?? "—"}
                        </span>
                      </div>
                      <p className="mt-[2px] text-[13px] text-ink-3">
                        {channelLabel(o.channel)} ·{" "}
                        <span className="num">{formatDate(o.date)}</span>
                      </p>
                    </div>

                    {/* Totale */}
                    <div className="hidden w-[130px] flex-none text-right sm:block">
                      <span className="num text-[15px] font-semibold text-ink">
                        {formatEuro(o.totalEur)}
                      </span>
                    </div>

                    {/* Two badges: stato + pagamento */}
                    <div className="flex flex-none items-center gap-s2 sm:w-[230px] sm:justify-end">
                      <Badge tone={ORDER_STATUS_TONE[o.status]}>{cap(o.status)}</Badge>
                      <Badge tone={PAYMENT_TONE[o.paymentStatus]}>
                        {PAYMENT_LABEL[o.paymentStatus]}
                      </Badge>
                    </div>

                    {/* Chevron (hidden on phone to save width). */}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="hidden flex-none text-ink-3 sm:block"
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
        )}
      </Card>
    </>
  );
}
