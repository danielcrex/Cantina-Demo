import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { Badge } from "@/components/ui/Badge";
import {
  getInvoices,
  getArSnapshot,
  getArAgeing,
  customerById,
  type Invoice,
} from "@/fixtures";
import { formatEuro, formatEuroCompact, formatDate } from "@/lib/format";
import { INVOICE_STATUS_BADGE } from "@/components/invoices/display";

/**
 * Fatture — AR-ageing tiles + the invoice list.
 * ---------------------------------------------------------------------------
 * The scaduto tile totals the fixtures' overdue invoice(s) via getArSnapshot,
 * so it equals the dashboard's 2.480 € exactly (one source of truth). Filter /
 * sort / search run over the fixture array via local state; overdue rows carry
 * a tasteful danger emphasis. Rows tap through to the detail.
 */

const STATUSES: Invoice["status"][] = ["pagata", "da-pagare", "scaduta"];
type SortKey = "scadenza-asc" | "scadenza-desc" | "totale-desc" | "totale-asc";

const selectClass =
  "min-h-[44px] rounded-input border border-border-2 bg-bg px-s3 pr-s5 text-[14px] text-ink " +
  "focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-weak";

export function Fatture() {
  const navigate = useNavigate();

  // AR snapshot + ageing (read-only, shared with the dashboard).
  const ar = getArSnapshot();
  const ageing = getArAgeing();

  // Control state (local only).
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Invoice["status"] | "tutti">("tutti");
  const [sort, setSort] = useState<SortKey>("scadenza-asc");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = getInvoices().filter((inv) => {
      if (status !== "tutti" && inv.status !== status) return false;
      if (q) {
        const cust = customerById(inv.customerId)?.name.toLowerCase() ?? "";
        if (!inv.number.toLowerCase().includes(q) && !cust.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "scadenza-desc":
          return b.dueDate.localeCompare(a.dueDate);
        case "totale-desc":
          return b.totalEur - a.totalEur;
        case "totale-asc":
          return a.totalEur - b.totalEur;
        case "scadenza-asc":
        default:
          return a.dueDate.localeCompare(b.dueDate);
      }
    });
    return list;
  }, [query, status, sort]);

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Fatture"
        subtitle="Fatturato emesso e situazione degli incassi."
      />

      {/* AR-ageing tiles */}
      <div className="grid grid-cols-1 gap-s4 sm:grid-cols-3">
        <Stat label="Totale da incassare" value={formatEuroCompact(ar.totalEur)} />
        <Stat
          label="Non scaduto"
          value={formatEuroCompact(ar.daPagareEur)}
          sub="entro la scadenza"
        />
        <Stat
          label="Scaduto"
          value={formatEuroCompact(ar.scadutoEur)}
          delta={`${ar.scadutaCount} fattura scaduta`}
          deltaTone="down"
        />
      </div>

      {/* Compact ageing split of the scaduto (0–30 / 31–60 / 60+). */}
      <Card flat className="mt-s4">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-3">
          Scaduto per fascia
        </p>
        {/* 1-up on phone, 3-up from ~520px up (so lg+ is unchanged). */}
        <div className="mt-s3 grid grid-cols-1 gap-s4 min-[520px]:grid-cols-3">
          {[
            ["0–30 giorni", ageing.b0_30],
            ["31–60 giorni", ageing.b31_60],
            ["60+ giorni", ageing.b60plus],
          ].map(([label, amount]) => (
            <div key={label as string}>
              <p className="text-[13px] text-ink-2">{label}</p>
              <p className="num mt-[2px] text-[18px] font-bold text-ink">
                {formatEuro(amount as number)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Controls */}
      <div className="mb-s4 mt-s6 flex flex-wrap items-center gap-s3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca numero o cliente…"
          aria-label="Cerca fatture"
          className="min-h-[44px] flex-1 min-w-[220px] rounded-input border border-border-2 bg-bg px-s4 text-[15px] text-ink focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-weak"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Invoice["status"] | "tutti")}
          aria-label="Filtra per stato"
          className={selectClass}
        >
          <option value="tutti">Tutti gli stati</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {INVOICE_STATUS_BADGE[s].label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Ordina"
          className={selectClass}
        >
          <option value="scadenza-asc">Scadenza (prima)</option>
          <option value="scadenza-desc">Scadenza (dopo)</option>
          <option value="totale-desc">Totale (alto)</option>
          <option value="totale-asc">Totale (basso)</option>
        </select>
      </div>

      <p className="mb-s3 text-[13px] text-ink-3">
        <span className="num">{rows.length}</span>{" "}
        {rows.length === 1 ? "fattura" : "fatture"}
      </p>

      {/* List */}
      <Card className="p-0">
        {rows.length === 0 ? (
          <div className="px-s5 py-s7 text-center">
            <p className="text-[15px] font-semibold text-ink">Nessuna fattura trovata</p>
            <p className="mt-s2 text-[14px] text-ink-2">
              Prova a modificare i filtri o la ricerca.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((inv) => {
              const customer = customerById(inv.customerId);
              const badge = INVOICE_STATUS_BADGE[inv.status];
              const overdue = inv.status === "scaduta";
              return (
                <li key={inv.id}>
                  <button
                    onClick={() => navigate(`/fatture/${inv.id}`)}
                    className={[
                      "flex w-full items-center gap-s4 px-s5 py-s4 text-left transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
                      // Tasteful overdue emphasis: a faint danger wash + left marker.
                      overdue ? "bg-danger-weak/40 hover:bg-danger-weak/70" : "hover:bg-surface",
                    ].join(" ")}
                  >
                    {/* Left danger marker only for overdue rows. */}
                    <span
                      className={`h-9 w-[3px] flex-none rounded-full ${overdue ? "bg-danger" : "bg-transparent"}`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-s3">
                        <span className="num whitespace-nowrap text-[15px] font-bold text-ink">
                          {inv.number}
                        </span>
                        <span className="truncate text-[14px] text-ink-2">
                          {customer?.name ?? "—"}
                        </span>
                      </div>
                      <p className="mt-[2px] text-[13px] text-ink-3">
                        Emessa <span className="num">{formatDate(inv.issueDate)}</span> · Scadenza{" "}
                        <span className={`num ${overdue ? "font-semibold text-danger" : ""}`}>
                          {formatDate(inv.dueDate)}
                        </span>
                      </p>
                    </div>

                    <div className="hidden w-[130px] flex-none text-right sm:block">
                      <span className="num text-[15px] font-semibold text-ink">
                        {formatEuro(inv.totalEur)}
                      </span>
                    </div>

                    {/* Badge sizes to content on phone; fixed column at sm+. */}
                    <div className="flex-none text-right sm:w-[120px]">
                      <Badge tone={badge.tone}>{badge.label}</Badge>
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
