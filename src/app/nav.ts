/**
 * Navigation model for the sidebar.
 * ---------------------------------------------------------------------------
 * Groups mirror the build brief exactly. A group with `label: null` renders as
 * an ungrouped block with no header (Dashboard at the top, and the account
 * block at the bottom). Group labels are NON-interactive headers — they are
 * rendered as plain text, never as links.
 *
 * `deemphasized` marks inert/low-priority items (Compliance) so the sidebar can
 * visually recede them.
 */

export interface NavItem {
  label: string; // Italian link label
  to: string; // route path
  deemphasized?: boolean;
}

export interface NavGroup {
  label: string | null; // section header text, or null for no header
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  // Top — standalone, no section header.
  {
    label: null,
    items: [{ label: "Dashboard", to: "/dashboard" }],
  },
  {
    label: "Vendite",
    items: [
      // Assistant is the combined AI page (chat + order capture in one thread).
      { label: "Assistant", to: "/assistant" },
      { label: "Ordini", to: "/ordini" },
      { label: "Clienti", to: "/clienti" },
    ],
  },
  {
    label: "Cantina",
    items: [
      { label: "Catalogo", to: "/catalogo" },
      // Inventario is labelled "Giacenze" in the UI per the brief.
      { label: "Giacenze", to: "/inventario" },
      { label: "Produzione", to: "/produzione" },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Fatture", to: "/fatture" },
      // Compliance is inert and de-emphasized.
      { label: "Compliance", to: "/compliance", deemphasized: true },
    ],
  },
  {
    label: "Struttura",
    items: [
      { label: "Sedi", to: "/sedi" },
      { label: "Governance", to: "/governance" },
    ],
  },
];
