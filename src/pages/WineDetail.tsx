import { Link, useParams, Navigate } from "react-router-dom";
import { Panel } from "@/components/ui/Panel";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Collapsible } from "@/components/ui/Collapsible";
import { InertButton } from "@/components/ui/InertButton";
import {
  wineById,
  vintagesOfWine,
  getWineStock,
  getWineStockStatus,
  type Award,
  type Vintage,
} from "@/fixtures";
import { formatNumber } from "@/lib/format";
import {
  WINE_TYPE_LABEL,
  WINE_TYPE_DOT,
  STOCK_STATUS_BADGE,
  VINTAGE_STATUS_BADGE,
} from "@/components/catalogo/display";
import type { ReactNode } from "react";

/**
 * WineDetail — ONE flattened screen (no tabs).
 * ---------------------------------------------------------------------------
 * Identity + prominent awards + inline expandable vintages + a collapsed,
 * inert "Storico & tracciabilità" block. Every edit/adjust affordance is
 * visual-only (InertButton). All values come from fixtures; nothing mutates.
 */

// A back-arrow used in the top breadcrumb.
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

// One labelled field in the technical sheet (label above, value below).
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-3">
        {label}
      </dt>
      <dd className="mt-[4px] text-[15px] leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

/**
 * AwardMedal — a single trophy, rendered as the highlight it deserves.
 * Gold/silver get a metallic disc; 'score' shows the number; award with no
 * medal falls back to a neutral star disc.
 */
function AwardMedal({ award }: { award: Award }) {
  // Disc styling by medal kind.
  let disc: ReactNode;
  if (award.medal === "score" && award.score != null) {
    disc = (
      <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-accent-weak text-accent">
        <span className="num text-[15px] font-bold leading-none">
          {formatNumber(Math.round(award.score))}
        </span>
      </span>
    );
  } else {
    // gold / silver / plain — a metallic disc with a small medal glyph.
    const bg =
      award.medal === "silver"
        ? "linear-gradient(150deg,#E9ECEF,#B9C0C9)"
        : award.medal === "gold"
          ? "linear-gradient(150deg,#F0D585,#C99A2E)"
          : "linear-gradient(150deg,#F3F5F8,#DEE2E9)"; // no medal -> neutral
    const glyphColor = award.medal === "gold" ? "#7A5A12" : award.medal === "silver" ? "#5A626C" : "#858C97";
    disc = (
      <span
        className="grid h-12 w-12 flex-none place-items-center rounded-full shadow-sm"
        style={{ background: bg }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {/* medal: circle + ribbon */}
          <circle cx="12" cy="10" r="5.2" stroke={glyphColor} strokeWidth="1.6" />
          <path
            d="M9 14.5L7.5 21l4.5-2.6L16.5 21 15 14.5"
            stroke={glyphColor}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <div className="flex items-center gap-s3 rounded-card border border-border bg-bg p-s4 shadow-sm">
      {disc}
      <div className="min-w-0">
        <p className="text-[15px] font-bold tracking-tight text-ink">{award.title}</p>
        <p className="text-[13px] text-ink-2">{award.org}</p>
        <p className="num text-[12px] text-ink-3">{award.year}</p>
      </div>
    </div>
  );
}

// One inline vintage row: summary header + expandable detail with inert actions.
function VintageRow({ vintage }: { vintage: Vintage }) {
  const status = VINTAGE_STATUS_BADGE[vintage.status];
  const summary = (
    <span className="flex flex-wrap items-center gap-x-s4 gap-y-s1">
      <span className="num font-bold text-ink">{vintage.year}</span>
      <span className="num text-[13px] text-ink-3">{vintage.abv}% vol</span>
      <span className="num text-[13px] text-ink-3">
        {formatNumber(vintage.stockBottles)} bott. · {formatNumber(vintage.stockCases)} casse
      </span>
    </span>
  );

  return (
    <Collapsible title={summary} right={<Badge tone={status.tone}>{status.label}</Badge>}>
      {/* Expanded vintage "view" — read-only figures + visual-only actions. */}
      <div className="rounded-card border border-border bg-surface p-s4">
        <dl className="grid grid-cols-2 gap-s4 sm:grid-cols-4">
          <Field label="Annata">
            <span className="num">{vintage.year}</span>
          </Field>
          <Field label="Gradazione">
            <span className="num">{vintage.abv}% vol</span>
          </Field>
          <Field label="Giacenza">
            <span className="num">
              {formatNumber(vintage.stockBottles)} bott. ·{" "}
              {formatNumber(vintage.stockCases)} casse
            </span>
          </Field>
          <Field label="Soglia minima">
            <span className="num">{formatNumber(vintage.lowStockThreshold)} bott.</span>
          </Field>
        </dl>
        <div className="mt-s4 flex flex-wrap gap-s3">
          <InertButton variant="secondary" size="sm">
            Modifica annata
          </InertButton>
          <InertButton variant="ghost" size="sm">
            Rettifica giacenza
          </InertButton>
        </div>
      </div>
    </Collapsible>
  );
}

export function WineDetail() {
  const { wineId } = useParams<{ wineId: string }>();
  const wine = wineId ? wineById(wineId) : undefined;

  // Unknown id -> back to the list (never a dead end).
  if (!wine) return <Navigate to="/catalogo" replace />;

  const vintages = vintagesOfWine(wine.id);
  const stock = getWineStock(wine.id);
  const statusBadge = STOCK_STATUS_BADGE[getWineStockStatus(wine.id)];

  return (
    <>
      {/* Breadcrumb back to the catalogo */}
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-s2 text-[14px] font-medium text-ink-2 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <BackArrow />
        Catalogo
      </Link>

      {/* Header: identity + stock summary + visual-only edit */}
      <header className="mt-s4 flex flex-wrap items-start justify-between gap-s5">
        <div className="min-w-0">
          <div className="flex items-center gap-s3">
            <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink">
              {wine.name}
            </h1>
            <span className="inline-flex items-center gap-s2 text-[14px] text-ink-3">
              <span
                className="h-[10px] w-[10px] flex-none rounded-full ring-1 ring-border-2"
                style={{ backgroundColor: WINE_TYPE_DOT[wine.type] }}
                aria-hidden="true"
              />
              {WINE_TYPE_LABEL[wine.type]}
            </span>
          </div>
          <p className="mt-s2 text-[16px] text-ink-2">{wine.appellation}</p>
          <div className="mt-s3 flex items-center gap-s3">
            <Badge tone={statusBadge.tone}>{statusBadge.label}</Badge>
            <span className="num text-[14px] text-ink-3">
              {formatNumber(stock.bottles)} bott. · {formatNumber(stock.cases)} casse disponibili
            </span>
          </div>
        </div>
        <InertButton variant="secondary">Modifica scheda</InertButton>
      </header>

      {/* AWARDS — prominent highlight (only when the wine has them). */}
      {wine.awards.length > 0 && (
        <Panel title="Riconoscimenti" caption="I premi di questo vino" className="mt-s6">
          <div className="grid gap-s4 sm:grid-cols-2">
            {wine.awards.map((a, i) => (
              <AwardMedal key={`${a.org}-${a.year}-${i}`} award={a} />
            ))}
          </div>
        </Panel>
      )}

      {/* SCHEDA TECNICA — identity fields */}
      <Panel title="Scheda tecnica" className="mt-s5">
        <dl className="grid grid-cols-1 gap-s5 sm:grid-cols-2">
          <Field label="Denominazione">{wine.appellation}</Field>
          <Field label="Uvaggio">{wine.grapes.join(", ")}</Field>
          {wine.vineyard && <Field label="Vigneto">{wine.vineyard}</Field>}
          <Field label="Gradazione">
            <span className="num">{wine.abv}% vol</span>
          </Field>
          {wine.servingTemp && (
            <Field label="Temperatura di servizio">
              <span className="num">{wine.servingTemp}</span>
            </Field>
          )}
          <Field label="Formati">{wine.formats.join(" · ")}</Field>

          {/* Longer prose spans the full width. */}
          <div className="sm:col-span-2">
            <Field label="Vinificazione">{wine.vinification}</Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Note di degustazione">{wine.tastingNotes}</Field>
          </div>
          {wine.servingSuggestions && (
            <div className="sm:col-span-2">
              <Field label="Abbinamenti">{wine.servingSuggestions}</Field>
            </div>
          )}
        </dl>
      </Panel>

      {/* ANNATE — inline expandable vintages */}
      <Panel
        title="Annate"
        caption="Anno · gradazione · stato · giacenza disponibile"
        className="mt-s5"
      >
        <div className="divide-y divide-border">
          {vintages.map((v) => (
            <VintageRow key={v.id} vintage={v} />
          ))}
        </div>
      </Panel>

      {/* STORICO & TRACCIABILITÀ — inert, collapsed, de-emphasized. */}
      <Card flat className="mt-s5">
        <Collapsible
          deemphasized
          title="Storico & tracciabilità"
          caption="Lotti, movimenti e clienti — registro completo"
        >
          <div className="space-y-s3 pt-s2">
            <p className="text-[13px] text-ink-3">
              Sezione dimostrativa: qui comparirebbero lotti di produzione,
              movimenti di magazzino e lo storico dei clienti per ogni annata.
            </p>
            {/* Muted placeholder rows — purely visual, do nothing. */}
            <ul className="divide-y divide-border rounded-card border border-border bg-bg">
              {[
                ["Lotto L-2023-04", "Imbottigliamento · 12/2023", "1.800 bottiglie"],
                ["Movimento #4821", "Carico magazzino · 01/2024", "+ 1.800 bott."],
                ["Movimento #5106", "Vendita distributore · 11/2025", "− 240 bott."],
              ].map(([a, b, c]) => (
                <li key={a} className="flex items-center justify-between gap-s3 px-s4 py-s3">
                  <span className="text-[14px] font-medium text-ink-2">{a}</span>
                  <span className="text-[13px] text-ink-3">{b}</span>
                  <span className="num text-[13px] text-ink-3">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </Collapsible>
      </Card>
    </>
  );
}
