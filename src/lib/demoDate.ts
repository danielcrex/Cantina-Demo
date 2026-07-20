/**
 * DEMO_TODAY — the single "today" anchor for the whole demo.
 * ===========================================================================
 * Everything date-related (the dashboard header date, the Pentumas stock
 * runway, the "ricavi di <mese>" KPI, overdue/AR checks, the revenue graph)
 * reads "today" from HERE, so the timeline is always internally consistent.
 *
 * WHY IT IS PINNED (and not `new Date()`):
 * The fixtures are a STATIC snapshot dated around January 2026 (orders,
 * invoices, the one overdue invoice, etc.). If "today" were the live date, the
 * month-based KPI and the revenue graph would desync from that snapshot (an
 * empty current month, a graph that stops months before "today"). So we pin a
 * fixed date that sits just after the newest fixture activity — the demo reads
 * as "live" and every derived figure lines up.
 *
 * TO PIN A DIFFERENT PITCH DAY: change the one line below to that date, e.g.
 *   export const DEMO_TODAY = new Date(2026, 2, 15); // 15 marzo 2026
 * (Month is 0-based: 0 = gennaio.) Keep it on/after the latest fixture order so
 * the runway and KPIs stay coherent.
 *
 * TO USE THE LIVE CLOCK: set `export const DEMO_TODAY = startOfDay(new Date())`.
 * Only do this if the fixtures are re-anchored to recent dates — otherwise the
 * month KPI and graph will read as stale. The runway is already robust to this
 * (its velocity is measured from the most recent order data, then projected
 * forward from DEMO_TODAY), but the month-based views are not.
 * ===========================================================================
 */

/** Normalise a Date to local midnight (drops the time component). */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Pinned pitch-day anchor: 20 gennaio 2026 (month is 0-based).
export const DEMO_TODAY: Date = new Date(2026, 0, 20);
