import { NavLink } from "react-router-dom";
import { CantinaWordmark } from "@/components/CantinaWordmark";
import { FooterCredit } from "@/components/FooterCredit";
import { AccountMenu } from "@/app/AccountMenu";
import { NAV_GROUPS, type NavItem } from "@/app/nav";

/**
 * Sidebar — the app navigation.
 * ---------------------------------------------------------------------------
 * `SidebarContent` is the shared inner layout (brand + grouped nav + account
 * menu + footer credit). It is rendered in two shells:
 *   - desktop rail `<Sidebar>` — fixed left column, visible only at lg+ (the
 *     locked tablet layout);
 *   - mobile `<MobileDrawer>` — an overlay drawer below lg.
 * Structure top to bottom:
 *   - Cantina logo (spans the padded column width)
 *   - grouped navigation (section labels are NON-interactive headers)
 *   - account / logout menu
 *   - "Cantina è offerto da ARBISU" footer credit (the only ARBISU in-app)
 */

// A single nav link. Active state uses accent-weak fill + accent text (the one
// place the accent appears in the nav). De-emphasized items sit dimmer.
// `onNavigate` lets the mobile drawer close immediately on tap.
function NavRow({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "flex min-h-[44px] items-center rounded-btn px-s3 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          isActive
            ? "bg-accent-weak font-semibold text-accent"
            : item.deemphasized
              ? "font-medium text-ink-3 hover:bg-surface-2 hover:text-ink-2"
              : "font-medium text-ink-2 hover:bg-surface-2 hover:text-ink",
        ].join(" ")
      }
    >
      {item.label}
    </NavLink>
  );
}

/** Shared inner content for both the desktop rail and the mobile drawer. */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {/* Brand block — the Cantina logo spans the column within its padding. */}
      <div className="px-s5 pb-s5 pt-s6">
        <CantinaWordmark className="h-auto w-full" />
      </div>

      {/* Navigation — scrolls independently if the list ever grows. */}
      <nav className="flex-1 overflow-y-auto px-s3 pb-s4">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label ?? `top-${gi}`} className={gi === 0 ? "" : "mt-s5"}>
            {/* Section header — plain text, NOT a link. */}
            {group.label && (
              <p className="px-s3 pb-s2 pt-s1 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-3">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-[2px]">
              {group.items.map((item) => (
                <NavRow key={item.to} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Account menu + footer credit (the only ARBISU in the app chrome). */}
      <div className="border-t border-border px-s3 pb-s4 pt-s4">
        <AccountMenu />
        <FooterCredit className="mt-s4 w-full" />
      </div>
    </>
  );
}

/**
 * Desktop rail — fixed left column. Hidden below lg (mobile uses the drawer),
 * shown as the flex column at lg+ so the tablet layout is unchanged.
 */
export function Sidebar() {
  return (
    <aside className="hidden h-full w-[264px] flex-none flex-col border-r border-border bg-bg lg:flex">
      <SidebarContent />
    </aside>
  );
}
