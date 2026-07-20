import type { BadgeTone } from "@/components/ui/Badge";
import type { Order, Channel } from "@/fixtures";

/**
 * Shared display maps for orders (dashboard, ordini list + detail).
 * ---------------------------------------------------------------------------
 * Single source of truth for the status / payment / channel wording and tones
 * so every screen renders them identically. Pure lookup tables + tiny helpers.
 */

// Order lifecycle status -> badge tone.
export const ORDER_STATUS_TONE: Record<Order["status"], BadgeTone> = {
  bozza: "neutral",
  confermato: "neutral",
  preparato: "accent",
  spedito: "accent",
  fatturato: "accent",
  pagato: "ok",
};

// Payment status -> badge tone.
export const PAYMENT_TONE: Record<Order["paymentStatus"], BadgeTone> = {
  pagato: "ok",
  "in-attesa": "warn",
  scaduto: "err",
};

// Payment status -> Italian label.
export const PAYMENT_LABEL: Record<Order["paymentStatus"], string> = {
  pagato: "Pagato",
  "in-attesa": "In attesa",
  scaduto: "Scaduto",
};

// Capitalise the first letter (channel / status words are already Italian).
export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Channel -> label (the fixture words are already Italian; just capitalised).
export function channelLabel(channel: Channel): string {
  return cap(channel);
}

// All channels, for filter controls.
export const CHANNELS: Channel[] = [
  "ristorante",
  "enoteca",
  "agriturismo",
  "distributore",
  "privato",
];

// The canonical lifecycle order for the stepper.
export const ORDER_LIFECYCLE: Order["status"][] = [
  "bozza",
  "confermato",
  "preparato",
  "spedito",
  "fatturato",
  "pagato",
];
