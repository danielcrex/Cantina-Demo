import type { Wine, Vintage } from "./types";

/**
 * The five real Monte Fenosu wines, with their real awards.
 * ---------------------------------------------------------------------------
 * Identity fields (appellation, grapes, vinification, tasting notes, serving)
 * are written to feel like the estate's own, in Italian. Wholesale-ish list
 * prices used by order lines live in WINE_PRICE below.
 */
export const WINES: Wine[] = [
  {
    id: "w-tudurighe",
    name: "Tudurighe",
    appellation: "Vermentino di Sardegna DOC",
    type: "white",
    grapes: ["Vermentino"],
    abv: 13.5,
    vineyard: "Altopiano calcareo-argilloso, 410 m",
    vinification:
      "Vinificazione in acciaio, 6 mesi sui lieviti fini e 2 mesi di affinamento in bottiglia.",
    tastingNotes:
      "Giallo paglierino con riflessi verdolini. Mela, pesca bianca, gelsomino e agrumi; sorso minerale con chiusura ammandorlata.",
    servingTemp: "10–12 °C",
    servingSuggestions:
      "Antipasti di mare, crostacei, primi delicati e formaggi freschi.",
    awards: [
      { title: "99,1 / 100", org: "Vinodabere", year: 2024, medal: "score", score: 99.1 },
      { title: "5StarWines", org: "Vinitaly", year: 2024, medal: "gold" },
    ],
    formats: ["0,75 L", "1,5 L Magnum"],
  },
  {
    id: "w-pentumas",
    name: "Pentumas",
    appellation: "Isola dei Nuraghi IGT — Bianco macerato",
    type: "orange",
    grapes: ["Vermentino"],
    abv: 13,
    vineyard: "Altopiano calcareo-argilloso, 410 m",
    vinification:
      "Macerazione sulle bucce per circa 30 giorni, affinamento in acciaio e legno grande.",
    tastingNotes:
      "Ambrato luminoso. Frutta secca, scorza d'arancia, erbe medicinali e miele; tannino delicato e lunga persistenza.",
    servingTemp: "12–14 °C",
    servingSuggestions:
      "Piatti speziati, cucina di terra, formaggi stagionati ed erborinati.",
    awards: [
      { title: "Medaglia d'oro", org: "Concours Mondial de Bruxelles", year: 2023, medal: "gold" },
      {
        title: "95,3 — Standing Ovation",
        org: "Vinodabere",
        year: 2025,
        medal: "score",
        score: 95.3,
      },
    ],
    formats: ["0,75 L"],
  },
  {
    id: "w-ardosu",
    name: "Ardosu",
    appellation: "Cannonau di Sardegna DOC",
    type: "red",
    grapes: ["Cannonau"],
    abv: 15,
    vineyard: "Altopiano calcareo-argilloso, 410 m",
    vinification:
      "Fermentazione in acciaio, affinamento per 12 mesi tra legno grande e bottiglia.",
    tastingNotes:
      "Rubino che vira al granato. Asciutto, austero, con tannini eleganti; frutti rossi e di bosco, chiusura minerale.",
    servingTemp: "16–18 °C",
    servingSuggestions: "Arrosti, selvaggina, carni rosse e formaggi stagionati.",
    awards: [
      { title: "Top Hundred", org: "Il Golosario — Paolo Massobrio", year: 2023 },
    ],
    formats: ["0,75 L", "1,5 L Magnum"],
  },
  {
    id: "w-cagnulari",
    name: "Cagnulari",
    appellation: "Isola dei Nuraghi Cagnulari IGT",
    type: "red",
    grapes: ["Cagnulari"],
    abv: 14.5,
    vineyard: "Altopiano calcareo-argilloso, 410 m",
    vinification:
      "Fermentazione in acciaio con macerazione di 10 giorni, breve passaggio in legno.",
    tastingNotes:
      "Piccoli frutti rossi, ribes, foglia di geranio, macchia balsamica e note speziate.",
    servingTemp: "16–18 °C",
    servingSuggestions: "Salumi sardi, primi ricchi, carni alla brace.",
    awards: [],
    formats: ["0,75 L"],
  },
  {
    id: "w-turricula",
    name: "Turricula",
    appellation: "Isola dei Nuraghi IGT — Rosso",
    type: "red",
    grapes: ["Merlot", "Syrah", "Marselan"],
    abv: 14,
    vineyard: "Altopiano calcareo-argilloso, 410 m",
    vinification:
      "Fermentazione separata per varietà, assemblaggio e affinamento 12 mesi in legno.",
    tastingNotes:
      "Carruba e violetta; pieno, tannico e avvolgente, con lunga chiusura speziata.",
    servingTemp: "16–18 °C",
    servingSuggestions: "Brasati, cacciagione, formaggi a lunga stagionatura.",
    awards: [],
    formats: ["0,75 L", "1,5 L Magnum"],
  },
];

/** Wholesale list price per bottle (EUR), by wine id. Used by order lines. */
export const WINE_PRICE: Record<string, number> = {
  "w-tudurighe": 12,
  "w-pentumas": 22, // premium macerato — the fast-mover
  "w-ardosu": 16,
  "w-cagnulari": 14,
  "w-turricula": 18,
};

/**
 * Vintages — roughly two per wine.
 * ---------------------------------------------------------------------------
 * PENTUMAS 2023 IS THE HERO: current, in-commercio, and deliberately LOW.
 * With 168 bottiglie in giacenza and a recent velocity of ~84 bottiglie/mese
 * (see selectors.getPentumasRunway, computed from the recent orders), it runs
 * out in ~2.0 months. Anchored to DEMO_TODAY (20/01/2026) that lands in
 * MARZO — so the dashboard hero insight is TRUE against the data, not asserted.
 */
export const VINTAGES: Vintage[] = [
  // Tudurighe — healthy stock on the current vintage.
  {
    id: "v-tudurighe-2024",
    wineId: "w-tudurighe",
    year: 2024,
    abv: 13.5,
    status: "in-commercio",
    stockBottles: 3200,
    stockCases: 266,
    lowStockThreshold: 600,
  },
  {
    id: "v-tudurighe-2023",
    wineId: "w-tudurighe",
    year: 2023,
    abv: 13,
    status: "esaurito",
    stockBottles: 0,
    stockCases: 0,
    lowStockThreshold: 600,
  },

  // Pentumas — HERO. 2023 current & low; 2022 sold out.
  {
    id: "v-pentumas-2023",
    wineId: "w-pentumas",
    year: 2023,
    abv: 13,
    status: "in-commercio",
    stockBottles: 168,
    stockCases: 14,
    lowStockThreshold: 300,
  },
  {
    id: "v-pentumas-2022",
    wineId: "w-pentumas",
    year: 2022,
    abv: 12.5,
    status: "esaurito",
    stockBottles: 0,
    stockCases: 0,
    lowStockThreshold: 300,
  },

  // Ardosu — 2021 in commercio, 2022 ancora in affinamento.
  {
    id: "v-ardosu-2021",
    wineId: "w-ardosu",
    year: 2021,
    abv: 15,
    status: "in-commercio",
    stockBottles: 1800,
    stockCases: 150,
    lowStockThreshold: 400,
  },
  {
    id: "v-ardosu-2022",
    wineId: "w-ardosu",
    year: 2022,
    abv: 15,
    status: "in-affinamento",
    stockBottles: 900,
    stockCases: 75,
    lowStockThreshold: 400,
  },

  // Cagnulari — 2022 in commercio, 2023 in affinamento.
  {
    id: "v-cagnulari-2022",
    wineId: "w-cagnulari",
    year: 2022,
    abv: 14.5,
    status: "in-commercio",
    stockBottles: 950,
    stockCases: 79,
    lowStockThreshold: 300,
  },
  {
    id: "v-cagnulari-2023",
    wineId: "w-cagnulari",
    year: 2023,
    abv: 14.5,
    status: "in-affinamento",
    stockBottles: 1100,
    stockCases: 91,
    lowStockThreshold: 300,
  },

  // Turricula — 2021 healthy, 2020 in commercio ma in esaurimento.
  {
    id: "v-turricula-2021",
    wineId: "w-turricula",
    year: 2021,
    abv: 14,
    status: "in-commercio",
    stockBottles: 780,
    stockCases: 65,
    lowStockThreshold: 250,
  },
  {
    id: "v-turricula-2020",
    wineId: "w-turricula",
    year: 2020,
    abv: 14,
    status: "in-commercio",
    stockBottles: 210,
    stockCases: 17,
    lowStockThreshold: 250,
  },
];
