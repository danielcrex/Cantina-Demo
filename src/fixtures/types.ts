/**
 * Fixture types — exactly per build brief §6.
 * ---------------------------------------------------------------------------
 * These describe the hardcoded demo data. Values only need to LOOK coherent at
 * a glance; nothing is reconciled and there is no cents discipline. There is no
 * backend — every screen reads these arrays directly.
 */

/** Sales / distribution channel — shared by Customer and Order. */
export type Channel =
  | "ristorante"
  | "enoteca"
  | "agriturismo"
  | "distributore"
  | "privato";

export interface Award {
  title: string;
  org: string;
  year: number;
  medal?: "gold" | "silver" | "score";
  score?: number;
}

export interface Wine {
  id: string;
  name: string;
  appellation: string;
  type: "white" | "orange" | "red";
  grapes: string[];
  abv: number;
  vineyard?: string;
  vinification: string;
  tastingNotes: string;
  servingTemp?: string;
  servingSuggestions?: string;
  awards: Award[];
  formats: string[];
}

export interface Vintage {
  id: string;
  wineId: string;
  year: number;
  abv: number;
  status: "in-commercio" | "in-affinamento" | "esaurito";
  stockBottles: number;
  stockCases: number;
  lowStockThreshold: number;
}

export interface Customer {
  id: string;
  name: string;
  channel: Channel;
  city: string;
  country: string;
  vatId?: string;
  ordersCount: number;
  lastOrderDate: string; // ISO YYYY-MM-DD
  revenueEur: number;
  outstandingEur: number;
}

export interface OrderLine {
  wineId: string;
  vintageYear: number;
  qtyBottles: number;
  unitPriceEur: number;
}

export interface Order {
  id: string;
  number: string;
  customerId: string;
  channel: Channel;
  date: string; // ISO YYYY-MM-DD
  lines: OrderLine[];
  status: "bozza" | "confermato" | "preparato" | "spedito" | "fatturato" | "pagato";
  paymentStatus: "pagato" | "in-attesa" | "scaduto";
  discountEur: number;
  totalEur: number;
  invoiceId?: string;
}

export interface Invoice {
  id: string;
  number: string;
  orderId: string;
  customerId: string;
  issueDate: string; // ISO YYYY-MM-DD
  dueDate: string; // ISO YYYY-MM-DD
  grossEur: number;
  discountEur: number;
  netEur: number;
  vatEur: number;
  totalEur: number;
  status: "pagata" | "da-pagare" | "scaduta";
  residualEur: number;
}

export interface Insight {
  id: string;
  kind: "fast-mover" | "stock-runway" | "ar" | "seasonal";
  wineId?: string;
  severity: "info" | "attention";
  headlineIt: string;
  actionLabelIt?: string;
}
