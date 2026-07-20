import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Stat } from "@/components/ui/Stat";
import { InertButton } from "@/components/ui/InertButton";
import {
  getVintageRows,
  getTotalStock,
  vintageStockFlag,
  type Vintage,
  type VintageStockFlag,
} from "@/fixtures";
import { formatNumber } from "@/lib/format";
import { VINTAGE_STATUS_BADGE } from "@/components/catalogo/display";
import { VINTAGE_FLAG_BADGE } from "@/components/inventory/display";

/**
 * Giacenze — movement-style stock view across every wine×vintage.
 * ---------------------------------------------------------------------------
 * Read-only. The header total (bottiglie + casse of in-commercio vintages)
 * matches the dashboard "Giacenze totali" KPI (both from getTotalStock). Flags
 * are per vintage but use the same threshold logic as Catalogo, so Pentumas
 * 2023 reads Critico and Turricula 2020 Basso. Filter/sort/search are local.
 */

const FLAGS: VintageStockFlag[] = [
  "disponibile",
  "basso",
  "critico",
  "affinamento",
  "esaurito",
];
type SortKey = "giacenza-desc" | "giacenza-asc" | "vino-asc";

const selectClass =
  "min-h-[44px] rounded-input border border-border-2 bg-bg px-s3 pr-s5 text-[14px] text-ink " +
  "focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-weak";

export function Giacenze() {
  const total = getTotalStock();

  const [query, setQuery] = useState("");
  const [flag, setFlag] = useState<VintageStockFlag | "tutti">("tutti");
  const [status, setStatus] = useState<Vintage["status"] | "tutti">("tutti");
  const [sort, setSort] = useState<SortKey>("giacenza-desc");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = getVintageRows().filter(({ wine, vintage }) => {
      if (q && !wine.name.toLowerCase().includes(q)) return false;
      if (status !== "tutti" && vintage.status !== status) return false;
      if (flag !== "tutti" && vintageStockFlag(vintage) !== flag) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "giacenza-asc":
          return a.vintage.stockBottles - b.vintage.stockBottles;
        case "vino-asc":
          return (
            a.wine.name.localeCompare(b.wine.name) || b.vintage.year - a.vintage.year
          );
        case "giacenza-desc":
        default:
          return b.vintage.stockBottles - a.vintage.stockBottles;
      }
    });
    return list;
  }, [query, flag, status, sort]);

  return (
    <>
      <PageHeader
        eyebrow="Cantina"
        title="Giacenze"
        subtitle="Disponibilità di ogni vino e annata, con i movimenti di magazzino."
        // Visual-only: a stock adjustment would happen here in the real app.
        actions={<InertButton variant="secondary">Rettifica giacenza</InertButton>}
      />

      {/* Header totals — match the dashboard giacenze KPI. */}
      <div className="mb-s6 grid grid-cols-2 gap-s4 sm:max-w-[520px]">
        <Stat
          label="Bottiglie disponibili"
          value={formatNumber(total.bottles)}
          sub="annate in commercio"
        />
        <Stat
          label="Casse disponibili"
          value={formatNumber(total.cases)}
          sub="annate in commercio"
        />
      </div>

      {/* Controls */}
      <div className="mb-s4 flex flex-wrap items-center gap-s3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca vino…"
          aria-label="Cerca giacenze"
          className="min-h-[44px] flex-1 min-w-[200px] rounded-input border border-border-2 bg-bg px-s4 text-[15px] text-ink focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-weak"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Vintage["status"] | "tutti")}
          aria-label="Filtra per stato"
          className={selectClass}
        >
          <option value="tutti">Tutti gli stati</option>
          <option value="in-commercio">In commercio</option>
          <option value="in-affinamento">In affinamento</option>
          <option value="esaurito">Esaurito</option>
        </select>
        <select
          value={flag}
          onChange={(e) => setFlag(e.target.value as VintageStockFlag | "tutti")}
          aria-label="Filtra per disponibilità"
          className={selectClass}
        >
          <option value="tutti">Tutte le disponibilità</option>
          {FLAGS.map((f) => (
            <option key={f} value={f}>
              {VINTAGE_FLAG_BADGE[f].label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Ordina"
          className={selectClass}
        >
          <option value="giacenza-desc">Giacenza (alta)</option>
          <option value="giacenza-asc">Giacenza (bassa)</option>
          <option value="vino-asc">Vino (A–Z)</option>
        </select>
      </div>

      <p className="mb-s3 text-[13px] text-ink-3">
        <span className="num">{rows.length}</span> annate
      </p>

      {/* Table */}
      <Card className="p-0">
        {rows.length === 0 ? (
          <div className="px-s5 py-s7 text-center">
            <p className="text-[15px] font-semibold text-ink">Nessuna giacenza trovata</p>
            <p className="mt-s2 text-[14px] text-ink-2">
              Prova a modificare i filtri o la ricerca.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-3">
                  <th className="px-s5 py-s3 font-bold">Vino</th>
                  <th className="px-s3 py-s3 font-bold">Stato</th>
                  <th className="px-s3 py-s3 text-right font-bold">Bottiglie</th>
                  <th className="px-s3 py-s3 text-right font-bold">Casse</th>
                  <th className="px-s5 py-s3 text-right font-bold">Disponibilità</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ wine, vintage }) => {
                  const statusBadge = VINTAGE_STATUS_BADGE[vintage.status];
                  const flagBadge = VINTAGE_FLAG_BADGE[vintageStockFlag(vintage)];
                  return (
                    <tr key={vintage.id} className="border-t border-border">
                      <td className="px-s5 py-s3">
                        <span className="font-semibold text-ink">{wine.name}</span>{" "}
                        <span className="num text-ink-3">{vintage.year}</span>
                      </td>
                      <td className="px-s3 py-s3">
                        <Badge tone={statusBadge.tone}>{statusBadge.label}</Badge>
                      </td>
                      <td className="num px-s3 py-s3 text-right font-semibold text-ink">
                        {formatNumber(vintage.stockBottles)}
                      </td>
                      <td className="num px-s3 py-s3 text-right text-ink-2">
                        {formatNumber(vintage.stockCases)}
                      </td>
                      <td className="px-s5 py-s3 text-right">
                        <Badge tone={flagBadge.tone}>{flagBadge.label}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
