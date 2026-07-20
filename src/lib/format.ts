/**
 * Centralised it-IT formatting for the whole app.
 * ---------------------------------------------------------------------------
 * Every screen formats EUR, numbers and dates through these helpers so the
 * demo reads consistently Italian: `1.234,56 €`, `1.234`, `gg/mm/aaaa`.
 * Pure functions, no state, no I/O — safe to call anywhere.
 */

// Reusable Intl formatters (built once).
const eur = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// EUR with no decimals — for big KPI figures where cents are noise.
const eur0 = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const int = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });

/** `1234.56` -> `1.234,56 €` */
export function formatEuro(value: number): string {
  return eur.format(value);
}

/** `1234.56` -> `1.235 €` (rounded, no cents) — for headline KPI amounts. */
export function formatEuroCompact(value: number): string {
  return eur0.format(value);
}

/** `7108` -> `7.108` (thousands separator, it-IT). */
export function formatNumber(value: number): string {
  return int.format(value);
}

/**
 * `"2026-01-20"` (or a Date) -> `20/01/2026`.
 * Accepts an ISO `YYYY-MM-DD` string or a Date; parses as a plain calendar
 * date (no timezone drift) so the day never shifts.
 */
export function formatDate(input: string | Date): string {
  const d = typeof input === "string" ? parseISODate(input) : input;
  const gg = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const aaaa = d.getFullYear();
  return `${gg}/${mm}/${aaaa}`;
}

/** Italian month name, lowercase (e.g. `"marzo"`). */
export function monthNameIt(input: string | Date): string {
  const d = typeof input === "string" ? parseISODate(input) : input;
  return new Intl.DateTimeFormat("it-IT", { month: "long" }).format(d);
}

/** Parse `YYYY-MM-DD` into a local Date at midnight (avoids UTC off-by-one). */
export function parseISODate(iso: string): Date {
  const [y, m, day] = iso.split("-").map(Number);
  return new Date(y, m - 1, day);
}
