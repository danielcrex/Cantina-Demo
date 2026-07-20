import { Link, useParams, Navigate } from "react-router-dom";
import { Panel } from "@/components/ui/Panel";
import { Stat } from "@/components/ui/Stat";
import { Badge } from "@/components/ui/Badge";
import { InertButton } from "@/components/ui/InertButton";
import {
  customerById,
  ordersForCustomer,
  invoicesForCustomer,
  customerOutstanding,
  customerArStatus,
} from "@/fixtures";
import { formatEuro, formatEuroCompact, formatNumber, formatDate } from "@/lib/format";
import {
  ORDER_STATUS_TONE,
  PAYMENT_TONE,
  PAYMENT_LABEL,
  cap,
  channelLabel,
} from "@/components/orders/display";
import { INVOICE_STATUS_BADGE } from "@/components/invoices/display";
import { vatTreatment } from "@/lib/vat";

/**
 * CustomerDetail — one customer, read-only.
 * ---------------------------------------------------------------------------
 * Header + KPI tiles + that customer's recent orders (and invoices) linking
 * back into those screens + a billing block with a LIVE VAT-treatment preview
 * derived from country/VAT id. Actions are visual-only. Unknown id -> /clienti.
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

export function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const customer = customerId ? customerById(customerId) : undefined;

  // Unknown id -> back to the list.
  if (!customer) return <Navigate to="/clienti" replace />;

  const orders = ordersForCustomer(customer.id);
  const invoices = invoicesForCustomer(customer.id);
  const outstanding = customerOutstanding(customer.id);
  const ar = customerArStatus(customer.id);
  const vat = vatTreatment(customer);

  return (
    <>
      {/* Breadcrumb */}
      <Link
        to="/clienti"
        className="inline-flex items-center gap-s2 text-[14px] font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <BackArrow />
        Clienti
      </Link>

      {/* Header */}
      <header className="mt-s4 flex flex-wrap items-start justify-between gap-s5">
        <div className="min-w-0">
          <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink">
            {customer.name}
          </h1>
          <p className="mt-s2 text-[16px] text-ink-2">
            {channelLabel(customer.channel)}{" "}
            <span className="text-ink-3">
              · {customer.city}, {customer.country}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-s3">
          <InertButton variant="secondary">Nuovo ordine</InertButton>
          <InertButton variant="secondary">Contatta</InertButton>
        </div>
      </header>

      {/* KPI tiles — 1-up small phone, 2-up wide phone; lg:grid-cols-4 unchanged. */}
      <div className="mt-s6 grid grid-cols-1 gap-s4 min-[480px]:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ordini" value={formatNumber(customer.ordersCount)} />
        <Stat label="Ultimo ordine" value={formatDate(customer.lastOrderDate)} />
        <Stat label="Fatturato totale" value={formatEuroCompact(customer.revenueEur)} />
        <Stat
          label="Da incassare"
          value={formatEuroCompact(outstanding)}
          delta={
            ar === "scaduto"
              ? "scaduto"
              : ar === "in-attesa"
                ? "in attesa"
                : "in regola"
          }
          deltaTone={ar === "scaduto" ? "down" : "muted"}
        />
      </div>

      {/* Recent orders */}
      <Panel
        title="Ordini recenti"
        caption={`${orders.length} nel periodo`}
        className="mt-s6"
      >
        {orders.length === 0 ? (
          <p className="text-[14px] text-ink-2">Nessun ordine recente per questo cliente.</p>
        ) : (
          <ul className="divide-y divide-border">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  to={`/ordini/${o.id}`}
                  className="flex items-center gap-s4 py-s3 transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                >
                  <span className="num w-[110px] flex-none font-semibold text-ink">
                    {o.number}
                  </span>
                  <span className="num hidden w-[110px] flex-none text-[13px] text-ink-3 sm:block">
                    {formatDate(o.date)}
                  </span>
                  <span className="num flex-1 text-right text-[14px] font-semibold text-ink sm:text-left">
                    {formatEuro(o.totalEur)}
                  </span>
                  <span className="hidden flex-none items-center gap-s2 sm:flex">
                    <Badge tone={ORDER_STATUS_TONE[o.status]}>{cap(o.status)}</Badge>
                    <Badge tone={PAYMENT_TONE[o.paymentStatus]}>
                      {PAYMENT_LABEL[o.paymentStatus]}
                    </Badge>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* Invoices (if any) */}
      {invoices.length > 0 && (
        <Panel title="Fatture" caption={`${invoices.length} emesse`} className="mt-s5">
          <ul className="divide-y divide-border">
            {invoices.map((inv) => {
              const badge = INVOICE_STATUS_BADGE[inv.status];
              return (
                <li key={inv.id}>
                  <Link
                    to={`/fatture/${inv.id}`}
                    className="flex items-center gap-s4 py-s3 transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                  >
                    <span className="num w-[130px] flex-none font-semibold text-ink">
                      {inv.number}
                    </span>
                    <span className="num hidden w-[110px] flex-none text-[13px] text-ink-3 sm:block">
                      {formatDate(inv.dueDate)}
                    </span>
                    <span className="num flex-1 text-right text-[14px] font-semibold text-ink sm:text-left">
                      {formatEuro(inv.totalEur)}
                    </span>
                    <span className="flex-none">
                      <Badge tone={badge.tone}>{badge.label}</Badge>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}

      {/* Billing + live VAT treatment */}
      <div className="mt-s5 grid grid-cols-1 gap-s5 lg:grid-cols-2">
        <Panel title="Dati di fatturazione">
          <dl className="space-y-s4">
            <div>
              <dt className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-3">
                Intestazione
              </dt>
              <dd className="mt-[3px] text-[15px] text-ink">{customer.name}</dd>
            </div>
            <div>
              <dt className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-3">
                Indirizzo
              </dt>
              <dd className="mt-[3px] text-[15px] text-ink">
                {customer.city}, {customer.country}
              </dd>
            </div>
            <div>
              <dt className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-3">
                Partita IVA
              </dt>
              <dd className="num mt-[3px] text-[15px] text-ink">
                {customer.vatId ?? "—"}
              </dd>
            </div>
          </dl>
        </Panel>

        {/* LIVE VAT-treatment preview — derived from country + VAT id. */}
        <Panel title="Trattamento IVA" caption="Calcolato dai dati del cliente">
          <div className="flex items-start gap-s3">
            <Badge tone={vat.applied ? "accent" : "ok"}>
              {vat.applied ? "IVA 22%" : "IVA non applicata"}
            </Badge>
          </div>
          <p className="mt-s3 text-[15px] font-semibold text-ink">{vat.title}</p>
          <p className="mt-s2 text-[14px] leading-relaxed text-ink-2">{vat.detail}</p>
        </Panel>
      </div>
    </>
  );
}
