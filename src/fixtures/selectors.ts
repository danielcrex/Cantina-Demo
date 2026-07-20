/**
 * Selectors — read-only derivations over the fixtures.
 * ---------------------------------------------------------------------------
 * The dashboard (and later screens) call these instead of recomputing inline.
 * Nothing here mutates; it only reads the hardcoded arrays and returns view
 * models. "Now" is a fixed demo date so the story stays coherent offline.
 */
import type { Wine, Vintage, Order, Customer, Invoice } from "./types";
import { WINES, VINTAGES } from "./wines";
import { CUSTOMERS } from "./customers";
import { ORDERS } from "./orders";
import { INVOICES } from "./invoices";
import { monthNameIt, parseISODate } from "@/lib/format";

/**
 * Fixed "today" for the whole demo (20/01/2026). Everything time-relative keys
 * off this so the app reads identically on any machine, on any real date.
 */
export const DEMO_TODAY = new Date(2026, 0, 20);

// ---- lookup helpers --------------------------------------------------------

export function wineById(id: string): Wine | undefined {
  return WINES.find((w) => w.id === id);
}

export function customerById(id: string): Customer | undefined {
  return CUSTOMERS.find((c) => c.id === id);
}

export function orderById(id: string): Order | undefined {
  return ORDERS.find((o) => o.id === id);
}

export function invoiceById(id: string): Invoice | undefined {
  return INVOICES.find((inv) => inv.id === id);
}

/** All customers (raw list, for the Clienti screen). */
export function getCustomers(): Customer[] {
  return CUSTOMERS;
}

/** That customer's orders, most recent first. */
export function ordersForCustomer(customerId: string): Order[] {
  return ORDERS.filter((o) => o.customerId === customerId).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

/** That customer's invoices, most recent first. */
export function invoicesForCustomer(customerId: string): Invoice[] {
  return INVOICES.filter((inv) => inv.customerId === customerId).sort((a, b) =>
    b.issueDate.localeCompare(a.issueDate),
  );
}

/**
 * Outstanding for a customer, DERIVED from their invoices (residual of every
 * unpaid invoice). We compute from invoices — not the customer's stored
 * `outstandingEur` — so the figure always matches the Fatture screen.
 */
export function customerOutstanding(customerId: string): number {
  return invoicesForCustomer(customerId)
    .filter((inv) => inv.status !== "pagata")
    .reduce((sum, inv) => sum + inv.residualEur, 0);
}

/** AR status for the list flag: overdue > pending > clear. */
export function customerArStatus(customerId: string): "scaduto" | "in-attesa" | "none" {
  const invs = invoicesForCustomer(customerId);
  if (invs.some((i) => i.status === "scaduta")) return "scaduto";
  if (invs.some((i) => i.status === "da-pagare")) return "in-attesa";
  return "none";
}

/** The specific vintage row referenced by an order line. */
export function vintageOf(wineId: string, year: number): Vintage | undefined {
  return VINTAGES.find((v) => v.wineId === wineId && v.year === year);
}

// ---- giacenze (stock) ------------------------------------------------------

/** Total sellable stock: sums bottles + cases across in-commercio vintages. */
export function getTotalStock(): { bottles: number; cases: number } {
  return VINTAGES.filter((v) => v.status === "in-commercio").reduce(
    (acc, v) => ({
      bottles: acc.bottles + v.stockBottles,
      cases: acc.cases + v.stockCases,
    }),
    { bottles: 0, cases: 0 },
  );
}

/** All vintages of a wine, newest year first. */
export function vintagesOfWine(wineId: string): Vintage[] {
  return VINTAGES.filter((v) => v.wineId === wineId).sort((a, b) => b.year - a.year);
}

/** Available (sellable) stock for a wine: sums bottles + cases over its
 *  in-commercio vintages only. */
export function getWineStock(wineId: string): { bottles: number; cases: number } {
  return vintagesOfWine(wineId)
    .filter((v) => v.status === "in-commercio")
    .reduce(
      (acc, v) => ({
        bottles: acc.bottles + v.stockBottles,
        cases: acc.cases + v.stockCases,
      }),
      { bottles: 0, cases: 0 },
    );
}

/**
 * Wine-level stock status, using the SAME threshold logic as getLowStock so the
 * catalogo flags stay consistent with the dashboard:
 *   - no sellable stock            -> 'esaurito'
 *   - worst in-commercio ratio <0.7 -> 'critico'   (Pentumas 168/300 = 0.56)
 *   - worst in-commercio ratio <=1  -> 'basso'      (Turricula 210/250 = 0.84)
 *   - otherwise                    -> 'disponibile'
 */
export type WineStockStatus = "esaurito" | "critico" | "basso" | "disponibile";

export function getWineStockStatus(wineId: string): WineStockStatus {
  const inCommercio = vintagesOfWine(wineId).filter((v) => v.status === "in-commercio");
  if (inCommercio.length === 0 || inCommercio.every((v) => v.stockBottles === 0)) {
    return "esaurito";
  }
  const worstRatio = Math.min(
    ...inCommercio.map((v) => v.stockBottles / v.lowStockThreshold),
  );
  if (worstRatio < 0.7) return "critico";
  if (worstRatio <= 1) return "basso";
  return "disponibile";
}

/** In-commercio vintages at/under their low-stock threshold, worst first. */
export function getLowStock(): Array<{ wine: Wine; vintage: Vintage }> {
  return VINTAGES.filter(
    (v) => v.status === "in-commercio" && v.stockBottles <= v.lowStockThreshold,
  )
    .map((v) => ({ wine: wineById(v.wineId)!, vintage: v }))
    .sort(
      (a, b) =>
        a.vintage.stockBottles / a.vintage.lowStockThreshold -
        b.vintage.stockBottles / b.vintage.lowStockThreshold,
    );
}

// ---- ordini ----------------------------------------------------------------

/** Most recent orders first. */
export function getRecentOrders(limit = 5): Order[] {
  return [...ORDERS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

/** "Ordini aperti" = not yet paid (still in the working / awaiting-payment set). */
export function getOpenOrdersCount(): number {
  return ORDERS.filter((o) => o.paymentStatus !== "pagato").length;
}

/** Revenue booked in the current demo month (gennaio 2026). */
export function getMonthRevenue(): number {
  const prefix = "2026-01";
  return ORDERS.filter((o) => o.date.startsWith(prefix)).reduce(
    (sum, o) => sum + o.totalEur,
    0,
  );
}

// ---- top vini / clienti ----------------------------------------------------

/** Bottles + revenue sold per wine across all orders, best sellers first. */
export function getTopWines(limit = 4): Array<{ wine: Wine; bottles: number; revenueEur: number }> {
  const agg = new Map<string, { bottles: number; revenueEur: number }>();
  for (const o of ORDERS) {
    for (const l of o.lines) {
      const cur = agg.get(l.wineId) ?? { bottles: 0, revenueEur: 0 };
      cur.bottles += l.qtyBottles;
      cur.revenueEur += l.qtyBottles * l.unitPriceEur;
      agg.set(l.wineId, cur);
    }
  }
  return [...agg.entries()]
    .map(([wineId, v]) => ({ wine: wineById(wineId)!, ...v }))
    .sort((a, b) => b.bottles - a.bottles)
    .slice(0, limit);
}

/** Customers ranked by lifetime revenue. */
export function getTopCustomers(limit = 5): Customer[] {
  return [...CUSTOMERS].sort((a, b) => b.revenueEur - a.revenueEur).slice(0, limit);
}

// ---- crediti (AR) ----------------------------------------------------------

/** Accounts-receivable snapshot from the invoices. */
export function getArSnapshot(): {
  scadutoEur: number;
  daPagareEur: number;
  totalEur: number;
  scadutaCount: number;
} {
  let scadutoEur = 0;
  let daPagareEur = 0;
  let scadutaCount = 0;
  for (const inv of INVOICES) {
    if (inv.status === "scaduta") {
      scadutoEur += inv.residualEur;
      scadutaCount += 1;
    } else if (inv.status === "da-pagare") {
      daPagareEur += inv.residualEur;
    }
  }
  return {
    scadutoEur,
    daPagareEur,
    totalEur: scadutoEur + daPagareEur,
    scadutaCount,
  };
}

/** All invoices (raw list, for the Fatture screen). */
export function getInvoices(): Invoice[] {
  return INVOICES;
}

/** The overdue invoices (there is exactly one in the demo). */
export function getScadutaInvoices(): Invoice[] {
  return INVOICES.filter((inv) => inv.status === "scaduta");
}

/** Whole days a due date is past the demo "today" (0 if not yet due). */
export function daysOverdue(dueDate: string): number {
  const due = parseISODate(dueDate);
  const ms = DEMO_TODAY.getTime() - due.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

/**
 * AR ageing of the SCADUTO residuals, bucketed by days overdue.
 * (Only overdue amounts age; da-pagare invoices are "non scaduto".)
 */
export function getArAgeing(): { b0_30: number; b31_60: number; b60plus: number } {
  const buckets = { b0_30: 0, b31_60: 0, b60plus: 0 };
  for (const inv of INVOICES) {
    if (inv.status !== "scaduta") continue;
    const d = daysOverdue(inv.dueDate);
    if (d <= 30) buckets.b0_30 += inv.residualEur;
    else if (d <= 60) buckets.b31_60 += inv.residualEur;
    else buckets.b60plus += inv.residualEur;
  }
  return buckets;
}

// ---- capture rate ----------------------------------------------------------

/**
 * Share of "canale convenzionale" (ristoranti/enoteche/agriturismo) sales that
 * are captured digitally. A demo figure — quietly credible, not computed.
 */
export function getCaptureRate(): { pct: number; deltaPct: number } {
  return { pct: 78, deltaPct: 5 };
}

// ---- the hero: Pentumas stock runway --------------------------------------

/**
 * Compute the Pentumas 2023 run-out from REAL fixture data so the hero insight
 * is true, not asserted:
 *   perMonth  = Pentumas 2023 bottles sold in the last 90 days / 3
 *   monthsLeft = current stock / perMonth
 *   runoutDate = DEMO_TODAY + monthsLeft
 * With 168 in giacenza and ~84/mese, that lands in MARZO.
 */
export function getPentumasRunway(): {
  stockBottles: number;
  perMonth: number;
  monthsLeft: number;
  runoutDate: Date;
  runoutMonth: string;
} {
  const vintage = vintageOf("w-pentumas", 2023)!;

  // 90-day window ending at the demo "today".
  const windowStart = new Date(DEMO_TODAY);
  windowStart.setDate(windowStart.getDate() - 90);

  let bottles90d = 0;
  for (const o of ORDERS) {
    const d = new Date(o.date);
    if (d >= windowStart && d <= DEMO_TODAY) {
      for (const l of o.lines) {
        if (l.wineId === "w-pentumas" && l.vintageYear === 2023) {
          bottles90d += l.qtyBottles;
        }
      }
    }
  }

  const perMonth = Math.round(bottles90d / 3);
  const monthsLeft = vintage.stockBottles / perMonth;

  const runoutDate = new Date(DEMO_TODAY);
  runoutDate.setDate(runoutDate.getDate() + Math.round(monthsLeft * 30));

  return {
    stockBottles: vintage.stockBottles,
    perMonth,
    monthsLeft,
    runoutDate,
    runoutMonth: monthNameIt(runoutDate),
  };
}
