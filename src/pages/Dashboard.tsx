import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { Stat } from "@/components/ui/Stat";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HeroInsight, QuietInsight } from "@/components/dashboard/AiInsight";
import { EstateHero } from "@/components/dashboard/EstateHero";
import { useAuth } from "@/auth/AuthContext";
import {
  DEMO_TODAY,
  INSIGHTS,
  getTotalStock,
  getMonthRevenue,
  getOpenOrdersCount,
  getArSnapshot,
  getCaptureRate,
  getLowStock,
  getRecentOrders,
  getTopWines,
  getTopCustomers,
  customerById,
} from "@/fixtures";
import { formatEuro, formatEuroCompact, formatNumber, formatDate } from "@/lib/format";
import {
  ORDER_STATUS_TONE,
  PAYMENT_TONE,
  PAYMENT_LABEL,
  cap,
} from "@/components/orders/display";

/**
 * Dashboard — the pitch's hero screen.
 * ---------------------------------------------------------------------------
 * Everything here reads from the fixtures via selectors; nothing computes or
 * mutates real state. Layout: KPI row -> AI-insight hero (+ two quieter ones)
 * -> focused panels (alert scorte, ordini recenti, top vini, top clienti,
 * snapshot AR, estate image).
 */

// -- small label / tone maps -------------------------------------------------
// Order status / payment / channel maps live in components/orders/display.ts
// (shared source of truth). Imported above.

// Full Italian date for the header subtitle, capitalised.
function longDateIt(d: Date): string {
  const s = new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
  return cap(s);
}

export function Dashboard() {
  const { user } = useAuth();

  // Derived view models (read-only).
  const stock = getTotalStock();
  const monthRevenue = getMonthRevenue();
  const openOrders = getOpenOrdersCount();
  const ar = getArSnapshot();
  const capture = getCaptureRate();
  const lowStock = getLowStock();
  const recentOrders = getRecentOrders(6);
  const topWines = getTopWines(4);
  const topCustomers = getTopCustomers(5);

  // Split insights: the hero (first) and the quieter remainder.
  const [heroInsight, ...quietInsights] = INSIGHTS;

  // Max bottles among top wines, for the proportional bars.
  const maxWineBottles = Math.max(...topWines.map((t) => t.bottles), 1);

  return (
    <>
      <PageHeader
        eyebrow="ARBISU Cantina"
        title={`Buongiorno, ${user.estate}`}
        subtitle={longDateIt(DEMO_TODAY)}
        actions={<Button variant="primary">Nuovo ordine</Button>}
      />

      {/* ---- KPI ROW ------------------------------------------------------ */}
      <div className="grid grid-cols-2 gap-s4 sm:grid-cols-3 xl:grid-cols-5">
        <Stat
          label="Giacenze totali"
          value={
            <>
              {formatNumber(stock.bottles)}{" "}
              <span className="text-[16px] font-semibold text-ink-3">bott.</span>
            </>
          }
          sub={`${formatNumber(stock.cases)} casse`}
        />
        <Stat
          label="Ricavi di gennaio"
          value={formatEuroCompact(monthRevenue)}
          delta="+18% sul mese"
          deltaTone="up"
        />
        <Stat
          label="Ordini aperti"
          value={formatNumber(openOrders)}
          sub="in lavorazione"
        />
        <Stat
          label="Scaduto"
          value={formatEuroCompact(ar.scadutoEur)}
          sub={`${formatEuroCompact(ar.totalEur)} da incassare`}
          delta={`${ar.scadutaCount} fattura scaduta`}
          deltaTone="down"
        />
        <Stat
          label="Capture convenzionale"
          value={`${capture.pct}%`}
          delta={`+${capture.deltaPct} pt`}
          deltaTone="up"
        />
      </div>

      {/* ---- AI INSIGHTS -------------------------------------------------- */}
      <div className="mt-s6 space-y-s4">
        <HeroInsight insight={heroInsight} />
        <div className="grid gap-s3 lg:grid-cols-2">
          {quietInsights.map((ins) => (
            <QuietInsight key={ins.id} insight={ins} />
          ))}
        </div>
      </div>

      {/* ---- PANELS: row 1 ----------------------------------------------- */}
      <div className="mt-s6 grid gap-s5 lg:grid-cols-3">
        {/* Alert scorte basse */}
        <Panel
          title="Scorte basse"
          caption="Annate in commercio sotto soglia"
          action={
            <Link to="/inventario">
              <Button variant="ghost" size="sm">
                Giacenze
              </Button>
            </Link>
          }
        >
          <ul className="space-y-s3">
            {lowStock.map(({ wine, vintage }) => {
              // Deeper into the threshold -> danger, otherwise warning.
              const ratio = vintage.stockBottles / vintage.lowStockThreshold;
              const tone: BadgeTone = ratio < 0.7 ? "err" : "warn";
              return (
                <li
                  key={vintage.id}
                  className="flex items-center justify-between gap-s3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-ink">
                      {wine.name} <span className="num text-ink-3">{vintage.year}</span>
                    </p>
                    <p className="num text-[13px] text-ink-3">
                      {formatNumber(vintage.stockBottles)} bottiglie ·{" "}
                      {formatNumber(vintage.stockCases)} casse
                    </p>
                  </div>
                  <Badge tone={tone}>
                    {tone === "err" ? "Critico" : "Basso"}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Panel>

        {/* Ordini recenti — spans two columns */}
        <Panel
          title="Ordini recenti"
          className="lg:col-span-2"
          action={
            <Link to="/ordini">
              <Button variant="ghost" size="sm">
                Tutti gli ordini
              </Button>
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-3">
                  <th className="pb-s2 pr-s3 font-bold">Ordine</th>
                  <th className="pb-s2 pr-s3 font-bold">Cliente</th>
                  <th className="pb-s2 pr-s3 font-bold">Data</th>
                  <th className="pb-s2 pr-s3 text-right font-bold">Totale</th>
                  <th className="pb-s2 pr-s3 font-bold">Stato</th>
                  <th className="pb-s2 font-bold">Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="num py-s3 pr-s3 font-semibold text-ink">
                      {o.number}
                    </td>
                    <td className="py-s3 pr-s3 text-ink-2">
                      {customerById(o.customerId)?.name ?? "—"}
                    </td>
                    <td className="num py-s3 pr-s3 text-ink-3">{formatDate(o.date)}</td>
                    <td className="num py-s3 pr-s3 text-right font-semibold text-ink">
                      {formatEuro(o.totalEur)}
                    </td>
                    <td className="py-s3 pr-s3">
                      <Badge tone={ORDER_STATUS_TONE[o.status]}>{cap(o.status)}</Badge>
                    </td>
                    <td className="py-s3">
                      <Badge tone={PAYMENT_TONE[o.paymentStatus]}>
                        {PAYMENT_LABEL[o.paymentStatus]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {/* ---- PANELS: row 2 ----------------------------------------------- */}
      <div className="mt-s5 grid gap-s5 lg:grid-cols-3">
        {/* Top vini */}
        <Panel title="Vini più venduti" caption="Bottiglie negli ultimi mesi">
          <ul className="space-y-s4">
            {topWines.map((t) => (
              <li key={t.wine.id}>
                <div className="flex items-baseline justify-between gap-s3">
                  <span className="truncate text-[14px] font-semibold text-ink">
                    {t.wine.name}
                  </span>
                  <span className="num flex-none text-[13px] text-ink-2">
                    {formatNumber(t.bottles)} bott.
                  </span>
                </div>
                {/* Proportional bar — accent, low emphasis. */}
                <div className="mt-s2 h-[6px] w-full overflow-hidden rounded-pill bg-surface-2">
                  <div
                    className="h-full rounded-pill bg-accent"
                    style={{ width: `${(t.bottles / maxWineBottles) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Top clienti */}
        <Panel title="Migliori clienti" caption="Per fatturato">
          <ul className="divide-y divide-border">
            {topCustomers.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-s3 py-s3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-ink">{c.name}</p>
                  <p className="text-[13px] text-ink-3">
                    {cap(c.channel)} · {c.city}
                  </p>
                </div>
                <span className="num flex-none text-[14px] font-semibold text-ink">
                  {formatEuroCompact(c.revenueEur)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Snapshot AR */}
        <Panel
          title="Crediti"
          caption="Situazione incassi"
          action={
            <Link to="/fatture">
              <Button variant="ghost" size="sm">
                Fatture
              </Button>
            </Link>
          }
        >
          <div className="space-y-s4">
            <div>
              <p className="text-[13px] text-ink-2">Scaduto</p>
              <p className="num mt-[2px] text-[26px] font-bold leading-none text-danger">
                {formatEuroCompact(ar.scadutoEur)}
              </p>
              <p className="mt-s2">
                <Badge tone="err">{ar.scadutaCount} fattura scaduta</Badge>
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-s3">
              <span className="text-[13px] text-ink-2">Da pagare (a scadere)</span>
              <span className="num text-[14px] font-semibold text-ink">
                {formatEuro(ar.daPagareEur)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-ink-2">Totale da incassare</span>
              <span className="num text-[14px] font-semibold text-ink">
                {formatEuro(ar.totalEur)}
              </span>
            </div>
          </div>
        </Panel>
      </div>

      {/* ---- ESTATE HERO IMAGE ------------------------------------------- */}
      <div className="mt-s5">
        <EstateHero />
      </div>
    </>
  );
}
