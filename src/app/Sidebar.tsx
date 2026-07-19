import { NavLink } from "react-router-dom";
import { Wordmark } from "@/components/Wordmark";
import { AccountMenu } from "@/app/AccountMenu";
import { NAV_GROUPS, type NavItem } from "@/app/nav";

/**
 * Sidebar — fixed left rail on tablet.
 * ---------------------------------------------------------------------------
 * Structure top to bottom:
 *   - ARBISU wordmark + "Cantina" product line
 *   - grouped navigation (section labels are NON-interactive headers)
 *   - account / logout menu
 *   - subtle "ARBISU" footer credit
 */

// A single nav link. Active state uses accent-weak fill + accent text (the one
// place the accent appears in the nav). De-emphasized items sit dimmer.
function NavRow({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
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

export function Sidebar() {
  return (
    <aside className="flex h-full w-[264px] flex-none flex-col border-r border-border bg-bg">
      {/* Brand block */}
      <div className="px-s5 pb-s5 pt-s6">
        <Wordmark className="h-7 w-auto" />
        <p className="mt-s3 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-3">
          Cantina
        </p>
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
                <NavRow key={item.to} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Account menu + footer credit */}
      <div className="border-t border-border px-s3 pb-s4 pt-s4">
        <AccountMenu />
        <p className="mt-s4 px-s3 text-center text-[11px] tracking-[0.14em] text-ink-3">
          ARBISU
        </p>
      </div>
    </aside>
  );
}
