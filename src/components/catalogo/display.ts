import type { BadgeTone } from "@/components/ui/Badge";
import type { Wine, Vintage, WineStockStatus } from "@/fixtures";

/**
 * Shared display maps for the catalogo (list + detail).
 * Pure lookup tables — no logic, no state.
 */

// Wine type -> Italian label.
export const WINE_TYPE_LABEL: Record<Wine["type"], string> = {
  white: "Bianco",
  orange: "Orange",
  red: "Rosso",
};

// Wine type -> a small decorative swatch colour (product marker, NOT the accent).
export const WINE_TYPE_DOT: Record<Wine["type"], string> = {
  white: "#E4D9A8",
  orange: "#CF8A3C",
  red: "#8E3B39",
};

// Wine-level stock status -> Badge tone + Italian word (colour + dot + word).
export const STOCK_STATUS_BADGE: Record<
  WineStockStatus,
  { tone: BadgeTone; label: string }
> = {
  esaurito: { tone: "neutral", label: "Esaurito" },
  critico: { tone: "err", label: "Critico" },
  basso: { tone: "warn", label: "Basso" },
  disponibile: { tone: "ok", label: "Disponibile" },
};

// Vintage lifecycle status -> Badge tone + label.
export const VINTAGE_STATUS_BADGE: Record<
  Vintage["status"],
  { tone: BadgeTone; label: string }
> = {
  "in-commercio": { tone: "ok", label: "In commercio" },
  "in-affinamento": { tone: "accent", label: "In affinamento" },
  esaurito: { tone: "neutral", label: "Esaurito" },
};
