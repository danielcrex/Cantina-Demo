import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  getCustomers,
  customerArStatus,
  customerOutstanding,
  type Channel,
} from "@/fixtures";
import { formatEuroCompact, formatNumber, formatDate } from "@/lib/format";
import { channelLabel, CHANNELS } from "@/components/orders/display";

/**
 * Clienti — the customer list.
 * ---------------------------------------------------------------------------
 * Calm full-width rows with an AR indicator derived from each customer's
 * invoices (so "scaduto" matches Fatture). Filter / sort / search over the
 * fixture array via local state; rows tap through to the detail.
 */

type SortKey = "fatturato-desc" | "fatturato-asc" | "ultimo-desc" | "ultimo-asc";

const selectClass =
  "min-h-[44px] rounded-input border border-border-2 bg-bg px-s3 pr-s5 text-[14px] text-ink " +
  "focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-weak";

export function Clienti() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState<Channel | "tutti">("tutti");
  const [sort, setSort] = useState<SortKey>("fatturato-desc");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = getCustomers().filter((c) => {
      if (channel !== "tutti" && c.channel !== channel) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "fatturato-asc":
          return a.revenueEur - b.revenueEur;
        case "ultimo-desc":
          return b.lastOrderDate.localeCompare(a.lastOrderDate);
        case "ultimo-asc":
          return a.lastOrderDate.localeCompare(b.lastOrderDate);
        case "fatturato-desc":
        default:
          return b.revenueEur - a.revenueEur;
      }
    });
    return list;
  }, [query, channel, sort]);

  return (
    <>
      <PageHeader
        eyebrow="Vendite"
        title="Clienti"
        subtitle="Ristoranti, enoteche, agriturismo e distributori, con la situazione incassi."
      />

      {/* Controls */}
      <div className="mb-s4 flex flex-wrap items-center gap-s3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca cliente…"
          aria-label="Cerca clienti"
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
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Ordina"
          className={selectClass}
        >
          <option value="fatturato-desc">Fatturato (alto)</option>
          <option value="fatturato-asc">Fatturato (basso)</option>
          <option value="ultimo-desc">Ultimo ordine (recente)</option>
          <option value="ultimo-asc">Ultimo ordine (meno recente)</option>
        </select>
      </div>

      <p className="mb-s3 text-[13px] text-ink-3">
        <span className="num">{rows.length}</span>{" "}
        {rows.length === 1 ? "cliente" : "clienti"}
      </p>

      {/* List */}
      <Card className="p-0">
        {rows.length === 0 ? (
          <div className="px-s5 py-s7 text-center">
            <p className="text-[15px] font-semibold text-ink">Nessun cliente trovato</p>
            <p className="mt-s2 text-[14px] text-ink-2">
              Prova a modificare i filtri o la ricerca.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((c) => {
              const ar = customerArStatus(c.id);
              const outstanding = customerOutstanding(c.id);
              return (
                <li key={c.id}>
                  <button
                    onClick={() => navigate(`/clienti/${c.id}`)}
                    className="flex w-full items-center gap-s4 px-s5 py-s4 text-left transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                  >
                    {/* Nome + canale · città */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-bold text-ink">{c.name}</p>
                      <p className="mt-[2px] text-[13px] text-ink-3">
                        {channelLabel(c.channel)} · {c.city}
                      </p>
                    </div>

                    {/* n. ordini + ultimo ordine */}
                    <div className="hidden w-[150px] flex-none text-right md:block">
                      <p className="num text-[14px] text-ink-2">
                        {formatNumber(c.ordersCount)} ordini
                      </p>
                      <p className="num text-[13px] text-ink-3">
                        {formatDate(c.lastOrderDate)}
                      </p>
                    </div>

                    {/* Fatturato */}
                    <div className="hidden w-[120px] flex-none text-right sm:block">
                      <p className="num text-[15px] font-semibold text-ink">
                        {formatEuroCompact(c.revenueEur)}
                      </p>
                    </div>

                    {/* AR indicator (only when there is outstanding). Sizes to
                        content on phone; fixed column at sm+. */}
                    <div className="flex-none text-right sm:w-[120px]">
                      {ar === "scaduto" ? (
                        <Badge tone="err">Scaduto</Badge>
                      ) : ar === "in-attesa" && outstanding > 0 ? (
                        <Badge tone="warn">Da incassare</Badge>
                      ) : (
                        <span className="text-[13px] text-ink-3">In regola</span>
                      )}
                    </div>

                    {/* Chevron hidden on phone to save width. */}
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
