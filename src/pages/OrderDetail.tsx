import { Link, useParams, Navigate } from "react-router-dom";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import { InertButton } from "@/components/ui/InertButton";
import { LifecycleStepper } from "@/components/orders/LifecycleStepper";
import { ORDERS, customerById, wineById } from "@/fixtures";
import { formatEuro, formatNumber, formatDate } from "@/lib/format";
import {
  ORDER_STATUS_TONE,
  PAYMENT_TONE,
  PAYMENT_LABEL,
  cap,
  channelLabel,
} from "@/components/orders/display";

/**
 * OrderDetail — one order, read-only.
 * ---------------------------------------------------------------------------
 * Header (numero, cliente, canale, data, badges) + lifecycle stepper + lines
 * table with totals. All figures come from fixtures and reconcile:
 *   subtotale = Σ righe, totale = subtotale − sconto = order.totalEur.
 * Actions are visual-only (InertButton). Unknown id -> back to /ordini.
 */

function BackArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = ORDERS.find((o) => o.id === orderId);

  // Unknown id -> back to the list (never a dead end).
  if (!order) return <Navigate to="/ordini" replace />;

  const customer = customerById(order.customerId);

  // Subtotale = sum of line totals; totale reconciles with the fixture.
  const subtotal = order.lines.reduce((sum, l) => sum + l.qtyBottles * l.unitPriceEur, 0);

  // "Vedi fattura" only makes sense once the order is invoiced.
  const isInvoiced = order.status === "fatturato" || order.status === "pagato";

  return (
    <>
      {/* Breadcrumb */}
      <Link
        to="/ordini"
        className="inline-flex items-center gap-s2 text-[14px] font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <BackArrow />
        Ordini
      </Link>

      {/* Header */}
      <header className="mt-s4 flex flex-wrap items-start justify-between gap-s5">
        <div className="min-w-0">
          <h1 className="num font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink">
            Ordine {order.number}
          </h1>
          <p className="mt-s2 text-[16px] text-ink-2">
            {customer?.name ?? "—"}{" "}
            <span className="text-ink-3">
              · {channelLabel(order.channel)} · {customer?.city}
            </span>
          </p>
          <div className="mt-s3 flex flex-wrap items-center gap-s3">
            <Badge tone={ORDER_STATUS_TONE[order.status]}>{cap(order.status)}</Badge>
            <Badge tone={PAYMENT_TONE[order.paymentStatus]}>
              {PAYMENT_LABEL[order.paymentStatus]}
            </Badge>
            <span className="num text-[14px] text-ink-3">{formatDate(order.date)}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-s3">
          {/* Deliberate placeholder: Invoices isn't built yet, so this is inert.
              TODO: route to /fatture/:invoiceId once the invoice detail lands. */}
          {isInvoiced && (
            <InertButton variant="secondary" note="Il dettaglio fattura arriva a breve">
              Vedi fattura
            </InertButton>
          )}
          <InertButton variant="secondary">Aggiorna stato</InertButton>
        </div>
      </header>

      {/* Lifecycle */}
      <Panel title="Stato di lavorazione" className="mt-s6">
        <div className="px-s2 pt-s2">
          <LifecycleStepper status={order.status} />
        </div>
      </Panel>

      {/* Lines + totals */}
      <Panel title="Righe dell'ordine" className="mt-s5">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-3">
                <th className="pb-s3 pr-s3 font-bold">Vino</th>
                <th className="pb-s3 pr-s3 text-right font-bold">Quantità</th>
                <th className="pb-s3 pr-s3 text-right font-bold">Prezzo unitario</th>
                <th className="pb-s3 text-right font-bold">Totale riga</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((l, i) => {
                const wine = wineById(l.wineId);
                return (
                  <tr key={`${l.wineId}-${l.vintageYear}-${i}`} className="border-t border-border">
                    <td className="py-s3 pr-s3">
                      <span className="font-semibold text-ink">{wine?.name ?? l.wineId}</span>{" "}
                      <span className="num text-ink-3">{l.vintageYear}</span>
                    </td>
                    <td className="num py-s3 pr-s3 text-right text-ink-2">
                      {formatNumber(l.qtyBottles)} bott.
                    </td>
                    <td className="num py-s3 pr-s3 text-right text-ink-2">
                      {formatEuro(l.unitPriceEur)}
                    </td>
                    <td className="num py-s3 text-right font-semibold text-ink">
                      {formatEuro(l.qtyBottles * l.unitPriceEur)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals block — right-aligned, tabular. */}
        <div className="mt-s5 flex justify-end">
          <dl className="w-full max-w-[320px] space-y-s2">
            <div className="flex items-center justify-between">
              <dt className="text-[14px] text-ink-2">Subtotale</dt>
              <dd className="num text-[14px] text-ink">{formatEuro(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[14px] text-ink-2">Sconto</dt>
              <dd className="num text-[14px] text-ink-2">
                {order.discountEur > 0 ? `− ${formatEuro(order.discountEur)}` : formatEuro(0)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-s2">
              <dt className="text-[15px] font-bold text-ink">Totale</dt>
              <dd className="num text-[18px] font-bold text-ink">{formatEuro(order.totalEur)}</dd>
            </div>
          </dl>
        </div>
      </Panel>
    </>
  );
}
