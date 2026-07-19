import type { Order, OrderLine, Channel } from "./types";
import { WINE_PRICE } from "./wines";

/**
 * ~20 orders across channels over recent months (ago 2025 – gen 2026), mixed
 * statuses. Totals are computed from the lines so they always reconcile with
 * the quantities on screen (total = Σ qty·prezzo − sconto).
 *
 * Velocity note: the Pentumas 2023 lines dated on/after 22/10/2025 sum to
 * ~252 bottiglie over 3 months (≈ 84/mese). That recent run-rate is what powers
 * the hero "finisci le scorte a marzo" insight — see selectors.getPentumasRunway.
 */

// A terse line spec; unit price defaults to the wine's list price.
type LineSpec = [wineId: string, vintageYear: number, qtyBottles: number, price?: number];

interface OrderSpec {
  id: string;
  number: string;
  customerId: string;
  channel: Channel;
  date: string;
  lines: LineSpec[];
  status: Order["status"];
  paymentStatus: Order["paymentStatus"];
  discountEur?: number;
  invoiceId?: string;
}

// Build an Order from a compact spec, computing line prices and the total.
function buildOrder(spec: OrderSpec): Order {
  const lines: OrderLine[] = spec.lines.map(([wineId, vintageYear, qtyBottles, price]) => ({
    wineId,
    vintageYear,
    qtyBottles,
    unitPriceEur: price ?? WINE_PRICE[wineId],
  }));
  const gross = lines.reduce((sum, l) => sum + l.qtyBottles * l.unitPriceEur, 0);
  const discountEur = spec.discountEur ?? 0;
  return {
    id: spec.id,
    number: spec.number,
    customerId: spec.customerId,
    channel: spec.channel,
    date: spec.date,
    lines,
    status: spec.status,
    paymentStatus: spec.paymentStatus,
    discountEur,
    totalEur: gross - discountEur,
    invoiceId: spec.invoiceId,
  };
}

const ORDER_SPECS: OrderSpec[] = [
  // ---- Gennaio 2026 (mese corrente) — mix di aperti e chiusi -------------
  {
    id: "o-2026-006",
    number: "2026-006",
    customerId: "c-agriturismo",
    channel: "agriturismo",
    date: "2026-01-18",
    lines: [["w-tudurighe", 2024, 24], ["w-pentumas", 2023, 12]],
    status: "confermato",
    paymentStatus: "in-attesa",
  },
  {
    id: "o-2026-005",
    number: "2026-005",
    customerId: "c-sunuraghe",
    channel: "enoteca",
    date: "2026-01-15",
    lines: [["w-tudurighe", 2024, 60], ["w-ardosu", 2021, 36]],
    status: "preparato",
    paymentStatus: "in-attesa",
  },
  {
    id: "o-2026-004",
    number: "2026-004",
    customerId: "c-portocervo",
    channel: "enoteca",
    date: "2026-01-14",
    lines: [["w-pentumas", 2023, 24], ["w-turricula", 2021, 18]],
    status: "spedito",
    paymentStatus: "in-attesa",
  },
  {
    id: "o-2026-003",
    number: "2026-003",
    customerId: "c-gallura",
    channel: "ristorante",
    date: "2026-01-12",
    lines: [["w-ardosu", 2021, 24], ["w-cagnulari", 2022, 12]],
    status: "confermato",
    paymentStatus: "in-attesa",
  },
  {
    id: "o-2026-002",
    number: "2026-002",
    customerId: "c-barbagia",
    channel: "enoteca",
    date: "2026-01-10",
    lines: [["w-pentumas", 2023, 36], ["w-cagnulari", 2022, 24]],
    status: "fatturato",
    paymentStatus: "in-attesa",
    invoiceId: "inv-2026-002",
  },
  {
    id: "o-2026-001",
    number: "2026-001",
    customerId: "c-weinhaus",
    channel: "distributore",
    date: "2026-01-05",
    lines: [["w-tudurighe", 2024, 240], ["w-pentumas", 2023, 36], ["w-ardosu", 2021, 120]],
    status: "pagato",
    paymentStatus: "pagato",
    discountEur: 480,
    invoiceId: "inv-2026-001",
  },
  {
    id: "o-2026-000",
    number: "2026-000",
    customerId: "c-marina",
    channel: "ristorante",
    date: "2026-01-03",
    lines: [["w-turricula", 2021, 18], ["w-tudurighe", 2024, 24]],
    status: "bozza",
    paymentStatus: "in-attesa",
  },

  // ---- Dicembre 2025 -----------------------------------------------------
  {
    id: "o-2025-051",
    number: "2025-051",
    customerId: "c-marina",
    channel: "ristorante",
    date: "2025-12-28",
    lines: [["w-ardosu", 2021, 36], ["w-cagnulari", 2022, 18]],
    status: "pagato",
    paymentStatus: "pagato",
    invoiceId: "inv-2025-051",
  },
  {
    id: "o-2025-050",
    number: "2025-050",
    customerId: "c-vermentino",
    channel: "ristorante",
    date: "2025-12-20",
    lines: [["w-tudurighe", 2024, 48], ["w-pentumas", 2023, 12]],
    status: "pagato",
    paymentStatus: "pagato",
  },
  {
    id: "o-2025-049",
    number: "2025-049",
    customerId: "c-sunuraghe",
    channel: "enoteca",
    date: "2025-12-15",
    lines: [["w-pentumas", 2023, 60], ["w-turricula", 2021, 24]],
    status: "fatturato",
    paymentStatus: "in-attesa",
    invoiceId: "inv-2025-049",
  },
  {
    id: "o-2025-048",
    number: "2025-048",
    customerId: "c-portocervo",
    channel: "enoteca",
    date: "2025-12-09",
    lines: [["w-ardosu", 2021, 48], ["w-tudurighe", 2024, 36]],
    status: "pagato",
    paymentStatus: "pagato",
  },
  {
    id: "o-2025-047",
    number: "2025-047",
    customerId: "c-gallura",
    channel: "ristorante",
    date: "2025-12-02",
    lines: [["w-tudurighe", 2024, 36], ["w-ardosu", 2021, 24]],
    status: "fatturato", // fatturato ma non saldato -> la fattura è scaduta
    paymentStatus: "scaduto",
    invoiceId: "inv-2025-047",
  },

  // ---- Novembre 2025 -----------------------------------------------------
  {
    id: "o-2025-046",
    number: "2025-046",
    customerId: "c-barbagia",
    channel: "enoteca",
    date: "2025-11-24",
    lines: [["w-pentumas", 2023, 48], ["w-cagnulari", 2022, 24]],
    status: "pagato",
    paymentStatus: "pagato",
  },
  {
    id: "o-2025-045",
    number: "2025-045",
    customerId: "c-weinhaus",
    channel: "distributore",
    date: "2025-11-18",
    lines: [["w-tudurighe", 2024, 180], ["w-turricula", 2021, 60]],
    status: "pagato",
    paymentStatus: "pagato",
    discountEur: 300,
    invoiceId: "inv-2025-045",
  },
  {
    id: "o-2025-044",
    number: "2025-044",
    customerId: "c-marina",
    channel: "ristorante",
    date: "2025-11-08",
    lines: [["w-pentumas", 2023, 72], ["w-ardosu", 2021, 24]],
    status: "pagato",
    paymentStatus: "pagato",
  },
  {
    id: "o-2025-043",
    number: "2025-043",
    customerId: "c-agriturismo",
    channel: "agriturismo",
    date: "2025-11-03",
    lines: [["w-tudurighe", 2024, 24], ["w-cagnulari", 2022, 12]],
    status: "pagato",
    paymentStatus: "pagato",
  },

  // ---- Settembre–Ottobre 2025 -------------------------------------------
  {
    id: "o-2025-039",
    number: "2025-039",
    customerId: "c-sunuraghe",
    channel: "enoteca",
    date: "2025-10-15",
    lines: [["w-pentumas", 2023, 24], ["w-tudurighe", 2024, 48]],
    status: "pagato",
    paymentStatus: "pagato",
  },
  {
    id: "o-2025-035",
    number: "2025-035",
    customerId: "c-vermentino",
    channel: "ristorante",
    date: "2025-09-27",
    lines: [["w-ardosu", 2021, 36], ["w-turricula", 2021, 18]],
    status: "pagato",
    paymentStatus: "pagato",
  },
  {
    id: "o-2025-031",
    number: "2025-031",
    customerId: "c-portocervo",
    channel: "enoteca",
    date: "2025-09-12",
    lines: [["w-tudurighe", 2024, 60], ["w-pentumas", 2023, 18]],
    status: "pagato",
    paymentStatus: "pagato",
  },
  {
    id: "o-2025-028",
    number: "2025-028",
    customerId: "c-weinhaus",
    channel: "distributore",
    date: "2025-08-29",
    lines: [["w-tudurighe", 2024, 300], ["w-ardosu", 2021, 120], ["w-turricula", 2021, 60]],
    status: "pagato",
    paymentStatus: "pagato",
    discountEur: 600,
  },
];

export const ORDERS: Order[] = ORDER_SPECS.map(buildOrder);
