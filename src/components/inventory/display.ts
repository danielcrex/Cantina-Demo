import type { BadgeTone } from "@/components/ui/Badge";
import type { VintageStockFlag, Production } from "@/fixtures";

/**
 * Shared display maps for Giacenze + Produzione. Colour + dot + word, keeping
 * the stock flags consistent with Catalogo.
 */

export const VINTAGE_FLAG_BADGE: Record<
  VintageStockFlag,
  { tone: BadgeTone; label: string }
> = {
  esaurito: { tone: "neutral", label: "Esaurito" },
  affinamento: { tone: "accent", label: "In affinamento" },
  critico: { tone: "err", label: "Critico" },
  basso: { tone: "warn", label: "Basso" },
  disponibile: { tone: "ok", label: "Disponibile" },
};

export const PRODUCTION_STATUS_BADGE: Record<
  Production["status"],
  { tone: BadgeTone; label: string }
> = {
  completato: { tone: "ok", label: "Completato" },
  "in-programma": { tone: "accent", label: "In programma" },
};
