/**
 * Assistant script — the scripted content behind the /assistant page.
 * ---------------------------------------------------------------------------
 * IMPORTANT: nothing here is real NLP, parsing, or an LLM call. The quick-prompt
 * answers are SCRIPTED LOOKUPS that read the same fixtures/selectors the
 * dashboard and catalogo use, so every number matches exactly. The capture
 * "extraction" is a SCRIPTED REVEAL keyed to hardcoded sample orders — it does
 * not read the pasted text.
 */
import {
  WINES,
  WINE_PRICE,
  getWineStock,
  getLowStock,
  getTopCustomers,
  getArSnapshot,
  getPentumasRunway,
  wineById,
} from "@/fixtures";
import { formatEuro, formatEuroCompact, formatNumber } from "@/lib/format";

// ---- Quick prompts ---------------------------------------------------------

export interface QuickPrompt {
  id: string;
  /** The user-facing question (also the text shown as the user's turn). */
  question: string;
  /** Builds the scripted answer at click time from live selectors. */
  answer: () => string;
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: "q-vermentino",
    question: "Quanto Vermentino mi resta?",
    answer: () => {
      // Vermentino etichette = wines whose grapes include Vermentino.
      const verm = WINES.filter((w) => w.grapes.includes("Vermentino"));
      let bottles = 0;
      let cases = 0;
      const parts: string[] = [];
      for (const w of verm) {
        const s = getWineStock(w.id);
        bottles += s.bottles;
        cases += s.cases;
        // Parenthesised so the sentence never ends up with "bott.." when joined.
        parts.push(`${w.name} (${formatNumber(s.bottles)} bott.)`);
      }
      return (
        `Ti restano ${formatNumber(bottles)} bottiglie di Vermentino ` +
        `(${formatNumber(cases)} casse), su due etichette: ${parts.join(" e ")}. ` +
        `Il Pentumas è in esaurimento: tienilo d'occhio.`
      );
    },
  },
  {
    id: "q-esaurimento",
    question: "Quali vini sono in esaurimento?",
    answer: () => {
      const low = getLowStock(); // Pentumas (Critico) + Turricula (Basso)
      const runway = getPentumasRunway();
      const rows = low.map((l) => {
        const ratio = l.vintage.stockBottles / l.vintage.lowStockThreshold;
        const flag = ratio < 0.7 ? "Critico" : "Basso";
        return `${l.wine.name} ${l.vintage.year} — ${formatNumber(
          l.vintage.stockBottles,
        )} bottiglie, ${flag}`;
      });
      return (
        `Due vini sono sotto soglia: ${rows.join("; ")}. ` +
        `Al ritmo attuale il Pentumas finisce le scorte a ${runway.runoutMonth}.`
      );
    },
  },
  {
    id: "q-clienti",
    question: "Chi sono i miei migliori clienti?",
    answer: () => {
      const top = getTopCustomers(3);
      const rows = top.map(
        (c) => `${c.name} (${c.city}) ${formatEuroCompact(c.revenueEur)}`,
      );
      return `I tuoi primi tre clienti per fatturato: ${rows.join(", ")}.`;
    },
  },
  {
    id: "q-scaduto",
    question: "Quanto ho di scaduto?",
    answer: () => {
      const ar = getArSnapshot();
      return (
        `Hai ${formatEuroCompact(ar.scadutoEur)} di scaduto: ` +
        `${ar.scadutaCount} fattura, la FT 2025/047 di Ristorante Gallura ` +
        `(scaduta il 02/01/2026). In totale da incassare ${formatEuroCompact(ar.totalEur)}.`
      );
    },
  },
];

/** Opening assistant greeting. */
export const GREETING =
  "Sono l'assistente di Cantina. Posso rispondere sulle tue giacenze, " +
  "vendite e clienti, oppure leggere un ordine che incolli qui. Da dove vuoi partire?";

/**
 * Loose keyword routing for free-typed input.
 * ---------------------------------------------------------------------------
 * NOT parsing — just a demo convenience that maps a typed sentence to one of
 * the scripted answers above by keyword. Returns null if nothing matches (the
 * page then shows a gentle fallback pointing at the chips).
 */
export function routeFreeText(input: string): QuickPrompt | null {
  const t = input.toLowerCase();
  if (t.includes("vermentino")) return QUICK_PROMPTS[0];
  if (t.includes("esaur") || t.includes("scorte") || t.includes("scorta"))
    return QUICK_PROMPTS[1];
  if (t.includes("client")) return QUICK_PROMPTS[2];
  if (t.includes("scadut") || t.includes("incass")) return QUICK_PROMPTS[3];
  return null;
}

export const FREE_TEXT_FALLBACK =
  "In questa anteprima rispondo alle domande di esempio qui sotto. " +
  "Prova una delle scorciatoie, oppure incolla un ordine e lo leggo per te.";

// ---- Capture (scripted order reading) --------------------------------------

export interface CaptureLine {
  wineId: string;
  wineName: string;
  vintageYear: number;
  qtyBottles: number;
  /** Optional human note, e.g. "2 casse". */
  note?: string;
  /** Scripted confidence score (0–100). */
  confidence: number;
}

export interface CaptureScript {
  id: string;
  /** Short label for the sample chip. */
  label: string;
  /** The WhatsApp-style raw order text shown as the user's turn. */
  rawText: string;
  customerId: string;
  customerName: string;
  customerCity: string;
  customerConfidence: number;
  lines: CaptureLine[];
  /** Estimated total from list prices — computed, so it stays coherent. */
  totalEur: number;
}

// Compute a line's contribution and attach the wine name from fixtures.
function line(
  wineId: string,
  vintageYear: number,
  qtyBottles: number,
  confidence: number,
  note?: string,
): CaptureLine {
  return {
    wineId,
    wineName: wineById(wineId)?.name ?? wineId,
    vintageYear,
    qtyBottles,
    note,
    confidence,
  };
}

// Sum list-price value of a set of lines.
function totalOf(lines: CaptureLine[]): number {
  return lines.reduce((sum, l) => sum + l.qtyBottles * (WINE_PRICE[l.wineId] ?? 0), 0);
}

/**
 * Two hardcoded sample orders. The "extraction" always returns THESE lines,
 * regardless of what text is pasted — it is a scripted reveal, not parsing.
 * Wines, vintages and customers all reference real fixtures so the preview is
 * consistent with the rest of the app.
 */
const SAMPLE_A_LINES: CaptureLine[] = [
  line("w-ardosu", 2021, 24, 97),
  line("w-pentumas", 2023, 12, 95),
  line("w-tudurighe", 2024, 24, 92, "2 casse"),
];
const SAMPLE_B_LINES: CaptureLine[] = [
  line("w-tudurighe", 2024, 36, 98, "3 casse"),
  line("w-turricula", 2021, 18, 94),
  line("w-pentumas", 2023, 6, 90),
];

export const CAPTURE_SCRIPTS: CaptureScript[] = [
  {
    id: "cap-gallura",
    label: "Ordine WhatsApp — Ristorante Gallura",
    rawText:
      "Buongiorno! Per il ristorante mi servono 24 bottiglie di Cannonau Ardosu, " +
      "12 di Pentumas e 2 casse di Tudurighe. Grazie mille, a presto.",
    customerId: "c-gallura",
    customerName: "Ristorante Gallura",
    customerCity: "Olbia",
    customerConfidence: 96,
    lines: SAMPLE_A_LINES,
    totalEur: totalOf(SAMPLE_A_LINES),
  },
  {
    id: "cap-portocervo",
    label: "Email — Enoteca Porto Cervo",
    rawText:
      "Ordine per l'enoteca: 3 casse di Tudurighe, 18 Turricula e 6 Pentumas. " +
      "Consegna la prossima settimana. Grazie.",
    customerId: "c-portocervo",
    customerName: "Enoteca Porto Cervo",
    customerCity: "Porto Cervo",
    customerConfidence: 93,
    lines: SAMPLE_B_LINES,
    totalEur: totalOf(SAMPLE_B_LINES),
  },
];

/** Confidence -> Badge tone (calm: high is good, lower is a soft flag). */
export function confidenceTone(pct: number): "ok" | "accent" | "warn" {
  if (pct >= 95) return "ok";
  if (pct >= 90) return "accent";
  return "warn";
}

/** Format the formatEuro re-export so the page doesn't import it twice. */
export { formatEuro };
