import type { Customer } from "./types";

/**
 * Eight customers across channels — local ristoranti + enoteche, the estate's
 * own agriturismo account, and one export distributore (with a VAT id +
 * country). Revenue / outstanding / lastOrder look realistic; the one customer
 * with a meaningful `outstandingEur` (c-gallura) matches the single overdue
 * invoice in invoices.ts.
 */
export const CUSTOMERS: Customer[] = [
  {
    id: "c-gallura",
    name: "Ristorante Gallura",
    channel: "ristorante",
    city: "Olbia",
    country: "Italia",
    ordersCount: 9,
    lastOrderDate: "2026-01-12",
    revenueEur: 14820,
    outstandingEur: 2480, // == residuo della fattura scaduta
  },
  {
    id: "c-sunuraghe",
    name: "Enoteca Su Nuraghe",
    channel: "enoteca",
    city: "Sassari",
    country: "Italia",
    ordersCount: 12,
    lastOrderDate: "2026-01-15",
    revenueEur: 21360,
    outstandingEur: 0,
  },
  {
    id: "c-vermentino",
    name: "Ristorante Il Vermentino",
    channel: "ristorante",
    city: "Alghero",
    country: "Italia",
    ordersCount: 7,
    lastOrderDate: "2025-12-20",
    revenueEur: 9640,
    outstandingEur: 0,
  },
  {
    id: "c-barbagia",
    name: "Enoteca Barbagia",
    channel: "enoteca",
    city: "Nuoro",
    country: "Italia",
    ordersCount: 6,
    lastOrderDate: "2026-01-08",
    revenueEur: 8210,
    outstandingEur: 1170, // in attesa, non ancora scaduta
  },
  {
    id: "c-agriturismo",
    name: "Agriturismo Monte Fenosu",
    channel: "agriturismo",
    city: "Muros",
    country: "Italia",
    ordersCount: 5,
    lastOrderDate: "2026-01-18",
    revenueEur: 6050,
    outstandingEur: 0,
  },
  {
    id: "c-weinhaus",
    name: "Weinhaus Adler GmbH",
    channel: "distributore",
    city: "Monaco di Baviera",
    country: "Germania",
    vatId: "DE 811569869",
    ordersCount: 4,
    lastOrderDate: "2026-01-05",
    revenueEur: 38700,
    outstandingEur: 0,
  },
  {
    id: "c-marina",
    name: "Ristorante Marina",
    channel: "ristorante",
    city: "Cagliari",
    country: "Italia",
    ordersCount: 8,
    lastOrderDate: "2025-12-28",
    revenueEur: 11230,
    outstandingEur: 0,
  },
  {
    id: "c-portocervo",
    name: "Enoteca Porto Cervo",
    channel: "enoteca",
    city: "Porto Cervo",
    country: "Italia",
    ordersCount: 6,
    lastOrderDate: "2026-01-14",
    revenueEur: 15980,
    outstandingEur: 0,
  },
];
