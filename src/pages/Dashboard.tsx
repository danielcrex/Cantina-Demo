import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/auth/AuthContext";

/**
 * Dashboard — MINIMAL PLACEHOLDER for Step 0.
 * ---------------------------------------------------------------------------
 * Intentionally sparse: this step delivers the shell only. The real dashboard
 * (KPI row, AI-insight hero, focused panels, estate hero image) is built in a
 * later step. This just proves the shell renders a screen correctly in
 * Daniele's Touch.
 */
export function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        eyebrow="ARBISU Cantina"
        title={`Buongiorno, ${user.estate}`}
        subtitle="Questa è la panoramica della tua cantina. I dati e gli approfondimenti arrivano nel prossimo passaggio."
        actions={<Button variant="primary">Nuovo ordine</Button>}
      />

      <Card className="flex flex-col items-start gap-s3">
        <span className="inline-flex items-center gap-s2 rounded-pill bg-accent-weak px-s3 py-s1 text-[12px] font-semibold text-accent">
          <span className="h-[7px] w-[7px] rounded-full bg-accent" />
          Shell pronta
        </span>
        <h2 className="font-display text-[22px] font-bold text-ink font-display-tight">
          La struttura dell&apos;app è pronta
        </h2>
        <p className="max-w-[640px] text-[15px] leading-relaxed text-ink-2">
          Navigazione, tema e login dimostrativo sono attivi. Le sezioni non
          ancora sviluppate mostrano un segnaposto “In arrivo”. Il cruscotto con
          gli indicatori e l&apos;assistente intelligente verranno costruiti nei
          passaggi successivi.
        </p>
      </Card>
    </>
  );
}
