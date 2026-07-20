import { useLocation } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { NAV_GROUPS } from "@/app/nav";

/**
 * ComingSoon — the "In arrivo" stub for every nav item not yet built.
 * ---------------------------------------------------------------------------
 * Keeps the whole shell navigable. It derives its title and the section it
 * belongs to from the current route, so a single component serves every stub.
 */

// Look up the nav label + parent section for the current path.
function useNavMeta(pathname: string): { label: string; section: string | null } {
  for (const group of NAV_GROUPS) {
    const item = group.items.find((i) => i.to === pathname);
    if (item) return { label: item.label, section: group.label };
  }
  // Fallback: derive a title from the path segment.
  const seg = pathname.replace("/", "");
  return { label: seg.charAt(0).toUpperCase() + seg.slice(1), section: null };
}

export function ComingSoon() {
  const { pathname } = useLocation();
  const { label, section } = useNavMeta(pathname);

  return (
    <>
      <PageHeader eyebrow={section ?? "Cantina"} title={label} />

      <Card
        flat
        className="flex flex-col items-center gap-s3 py-s8 text-center"
      >
        {/* Neutral badge — no accent (this is a low-emphasis, inert screen). */}
        <span className="inline-flex items-center gap-s2 rounded-pill bg-surface-2 px-s3 py-s1 text-[12px] font-semibold text-ink-2">
          <span className="h-[7px] w-[7px] rounded-full bg-ink-3" />
          In arrivo
        </span>
        <h2 className="font-display text-[20px] font-bold text-ink font-display-tight">
          {label} sarà disponibile a breve
        </h2>
        <p className="max-w-[420px] text-[14px] leading-relaxed text-ink-2">
          Questa sezione fa parte di Cantina ma non è ancora inclusa in
          questa anteprima. La struttura è già predisposta.
        </p>
      </Card>
    </>
  );
}
