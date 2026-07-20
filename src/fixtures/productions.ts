import type { Production } from "./types";

/**
 * Bottling / production runs.
 * ---------------------------------------------------------------------------
 * A small, independent dataset (does not touch orders/invoices/stock, so no
 * cross-screen numbers change). `bottlesProduced` sits above the vintage's
 * current stock for completed runs — the rest has been sold — so it reads
 * coherently against Giacenze. Vintages still "in-affinamento" have an
 * "in-programma" bottling.
 *
 * DELIBERATE GAP: there is NO Pentumas 2024 run. The Pentumas 2023 runs out in
 * marzo (see getPentumasRunway) and nothing is queued to replace it — that
 * absence powers the production-gap insight on the dashboard.
 */
export const PRODUCTIONS: Production[] = [
  {
    id: "prod-tudurighe-2024",
    wineId: "w-tudurighe",
    vintageYear: 2024,
    date: "2024-05-10",
    bottlesProduced: 4000,
    status: "completato",
  },
  {
    id: "prod-tudurighe-2023",
    wineId: "w-tudurighe",
    vintageYear: 2023,
    date: "2023-05-12",
    bottlesProduced: 3800,
    status: "completato",
  },
  {
    id: "prod-pentumas-2023",
    wineId: "w-pentumas",
    vintageYear: 2023,
    date: "2023-11-20",
    bottlesProduced: 1400,
    status: "completato",
  },
  {
    id: "prod-pentumas-2022",
    wineId: "w-pentumas",
    vintageYear: 2022,
    date: "2022-11-18",
    bottlesProduced: 1200,
    status: "completato",
  },
  // (No Pentumas 2024 run — the intentional gap.)
  {
    id: "prod-ardosu-2021",
    wineId: "w-ardosu",
    vintageYear: 2021,
    date: "2022-09-15",
    bottlesProduced: 3000,
    status: "completato",
  },
  {
    id: "prod-ardosu-2022",
    wineId: "w-ardosu",
    vintageYear: 2022,
    date: "2026-03-15",
    bottlesProduced: 2000,
    status: "in-programma",
  },
  {
    id: "prod-cagnulari-2022",
    wineId: "w-cagnulari",
    vintageYear: 2022,
    date: "2023-06-10",
    bottlesProduced: 1600,
    status: "completato",
  },
  {
    id: "prod-cagnulari-2023",
    wineId: "w-cagnulari",
    vintageYear: 2023,
    date: "2026-02-20",
    bottlesProduced: 1500,
    status: "in-programma",
  },
  {
    id: "prod-turricula-2021",
    wineId: "w-turricula",
    vintageYear: 2021,
    date: "2022-10-05",
    bottlesProduced: 1500,
    status: "completato",
  },
  {
    id: "prod-turricula-2020",
    wineId: "w-turricula",
    vintageYear: 2020,
    date: "2021-10-08",
    bottlesProduced: 1400,
    status: "completato",
  },
];
