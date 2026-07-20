import type { BadgeTone } from "@/components/ui/Badge";
import type { Invoice } from "@/fixtures";

/**
 * Shared display map for invoice status (Fatture list + detail).
 * Single source of truth for the wording + tone. Colour + dot + word.
 */
export const INVOICE_STATUS_BADGE: Record<
  Invoice["status"],
  { tone: BadgeTone; label: string }
> = {
  pagata: { tone: "ok", label: "Pagata" },
  "da-pagare": { tone: "warn", label: "Da pagare" },
  scaduta: { tone: "err", label: "Scaduta" },
};
