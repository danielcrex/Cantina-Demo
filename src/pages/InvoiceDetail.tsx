import { Link, useParams, Navigate } from "react-router-dom";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import { InertButton } from "@/components/ui/InertButton";
import { invoiceById, customerById } from "@/fixtures";
import { formatEuro, formatDate } from "@/lib/format";
import { INVOICE_STATUS_BADGE } from "@/components/invoices/display";

/**
 * InvoiceDetail — one invoice, read-only.
 * ---------------------------------------------------------------------------
 * Header + a gross->net breakdown (imponibile -> sconto -> netto -> IVA ->
 * totale) + stato pagamento + residuo, all from the invoice fixture. "Salda
 * residuo" is visual-only (shown only when residuo > 0). "Vedi ordine" links
 * back to the originating order. Unknown id -> back to /fatture.
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

// One line in the breakdown; `strong` marks the final Totale row.
function BreakdownRow({
  label,
  value,
  strong = false,
  muted = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${strong ? "border-t border-border pt-s3" : ""}`}
    >
      <dt className={strong ? "text-[15px] font-bold text-ink" : "text-[14px] text-ink-2"}>
        {label}
      </dt>
      <dd
        className={`num ${
          strong
            ? "text-[18px] font-bold text-ink"
            : muted
              ? "text-[14px] text-ink-2"
              : "text-[14px] text-ink"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export function InvoiceDetail() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const invoice = invoiceId ? invoiceById(invoiceId) : undefined;

  // Unknown id -> back to the list.
  if (!invoice) return <Navigate to="/fatture" replace />;

  const customer = customerById(invoice.customerId);
  const badge = INVOICE_STATUS_BADGE[invoice.status];
  const overdue = invoice.status === "scaduta";
  const hasResidual = invoice.residualEur > 0;

  return (
    <>
      {/* Breadcrumb */}
      <Link
        to="/fatture"
        className="inline-flex items-center gap-s2 text-[14px] font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <BackArrow />
        Fatture
      </Link>

      {/* Header */}
      <header className="mt-s4 flex flex-wrap items-start justify-between gap-s5">
        <div className="min-w-0">
          <h1 className="num font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink">
            {invoice.number}
          </h1>
          <p className="mt-s2 text-[16px] text-ink-2">
            {customer?.name ?? "—"}{" "}
            <span className="text-ink-3">· {customer?.city}</span>
          </p>
          <div className="mt-s3 flex flex-wrap items-center gap-s3">
            <Badge tone={badge.tone}>{badge.label}</Badge>
            <span className="num text-[14px] text-ink-3">
              Emessa {formatDate(invoice.issueDate)} · Scadenza{" "}
              <span className={overdue ? "font-semibold text-danger" : ""}>
                {formatDate(invoice.dueDate)}
              </span>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-s3">
          {/* Round-trip to the originating order. */}
          <Link to={`/ordini/${invoice.orderId}`}>
            <span className="inline-flex min-h-[44px] items-center rounded-btn border border-border-2 bg-bg px-[18px] text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-surface hover:border-ink-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
              Vedi ordine
            </span>
          </Link>
          {/* Visual-only settle action, only when there is a residual. */}
          {hasResidual && (
            <InertButton variant="primary" note="Pagamento registrato (anteprima)">
              Salda residuo
            </InertButton>
          )}
        </div>
      </header>

      {/* Gross -> net breakdown */}
      <Panel title="Dettaglio importi" className="mt-s6">
        <div className="flex justify-end">
          <dl className="w-full max-w-[360px] space-y-s2">
            <BreakdownRow label="Imponibile" value={formatEuro(invoice.grossEur)} />
            <BreakdownRow
              label="Sconto"
              muted
              value={
                invoice.discountEur > 0
                  ? `− ${formatEuro(invoice.discountEur)}`
                  : formatEuro(0)
              }
            />
            <BreakdownRow label="Netto" value={formatEuro(invoice.netEur)} />
            <BreakdownRow label="IVA (22%)" value={formatEuro(invoice.vatEur)} />
            <BreakdownRow label="Totale" value={formatEuro(invoice.totalEur)} strong />
          </dl>
        </div>
      </Panel>

      {/* Payment status + residual */}
      <Panel title="Pagamento" className="mt-s5">
        <div className="flex flex-wrap items-center justify-between gap-s4">
          <div>
            <p className="text-[13px] text-ink-2">Stato pagamento</p>
            <p className="mt-s2">
              <Badge tone={badge.tone}>{badge.label}</Badge>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[13px] text-ink-2">Residuo da incassare</p>
            <p
              className={`num mt-[2px] text-[26px] font-bold leading-none ${
                overdue ? "text-danger" : hasResidual ? "text-ink" : "text-positive"
              }`}
            >
              {formatEuro(invoice.residualEur)}
            </p>
          </div>
        </div>
      </Panel>
    </>
  );
}
