import type { Insight } from "./types";

/**
 * Three dashboard insights — analytics delivered as plain Italian, like a
 * trusted advisor. The Pentumas line is the HERO (severity 'attention'); the
 * other two are quieter (an AR/overdue nudge and a seasonal note).
 *
 * The hero headline is kept in sync with the data: getPentumasRunway() computes
 * the run-out month from the real stock + recent velocity and returns "marzo",
 * so this sentence is true, not asserted. (The dashboard can also render the
 * headline from that helper; the static copy here matches it.)
 */
export const INSIGHTS: Insight[] = [
  {
    id: "ins-pentumas-runway",
    kind: "stock-runway",
    wineId: "w-pentumas",
    severity: "attention",
    headlineIt:
      "Il Pentumas 2023 — oro al Concours Mondial de Bruxelles — è il tuo vino in più rapida crescita. Di questo passo finisci le scorte a marzo. Vuoi che avvisi i clienti abituali?",
    actionLabelIt: "Avvisa i clienti abituali",
  },
  {
    id: "ins-ar-gallura",
    kind: "ar",
    severity: "attention",
    headlineIt:
      "La fattura FT 2025/047 di Ristorante Gallura è scaduta il 02/01. Residuo di 2.480 €: conviene un sollecito.",
    actionLabelIt: "Prepara sollecito",
  },
  {
    id: "ins-seasonal-tudurighe",
    kind: "seasonal",
    severity: "info",
    headlineIt:
      "Il Tudurighe scorre più veloce da primavera: con 3.200 bottiglie in giacenza sei pronto per la stagione dei bianchi.",
  },
];
