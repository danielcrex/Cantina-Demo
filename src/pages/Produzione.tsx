import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { InertButton } from "@/components/ui/InertButton";
import { getProductions, wineById } from "@/fixtures";
import { formatNumber, formatDate } from "@/lib/format";
import { PRODUCTION_STATUS_BADGE } from "@/components/inventory/display";

/**
 * Produzione — bottling runs. Read-only, calm. Actions are visual-only.
 * All values from the productions fixture (independent of stock/orders).
 */
export function Produzione() {
  const runs = getProductions();

  return (
    <>
      <PageHeader
        eyebrow="Cantina"
        title="Produzione"
        subtitle="Imbottigliamenti registrati e in programma."
        actions={<InertButton variant="primary">Nuovo imbottigliamento</InertButton>}
      />

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-3">
                <th className="px-s5 py-s3 font-bold">Vino</th>
                <th className="px-s3 py-s3 font-bold">Data</th>
                <th className="px-s3 py-s3 text-right font-bold">Bottiglie prodotte</th>
                <th className="px-s5 py-s3 text-right font-bold">Stato</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((p) => {
                const wine = wineById(p.wineId);
                const badge = PRODUCTION_STATUS_BADGE[p.status];
                return (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-s5 py-s3">
                      <span className="font-semibold text-ink">
                        {wine?.name ?? p.wineId}
                      </span>{" "}
                      <span className="num text-ink-3">{p.vintageYear}</span>
                    </td>
                    <td className="num px-s3 py-s3 text-ink-2">{formatDate(p.date)}</td>
                    <td className="num px-s3 py-s3 text-right font-semibold text-ink">
                      {formatNumber(p.bottlesProduced)}
                    </td>
                    <td className="px-s5 py-s3 text-right">
                      <Badge tone={badge.tone}>{badge.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
