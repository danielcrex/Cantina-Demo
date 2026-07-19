import { useState } from "react";

/**
 * EstateHero — a tasteful estate image block for the dashboard.
 * ---------------------------------------------------------------------------
 * Tries to load a real photo from `public/estate/` so Daniele can drop one in
 * later (e.g. `public/estate/monte-fenosu.jpg`). If it's absent, we fall back
 * to a clean, muted vineyard-toned gradient — NO remote image is ever fetched.
 * A small caption overlays the estate name.
 */
export function EstateHero() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="relative h-full min-h-[220px] overflow-hidden rounded-card border border-border shadow-sm">
      {/* Neutral placeholder — a soft vineyard-toned gradient. Always present,
          so the block looks intentional even with no photo. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #EEF2EA 0%, #E6EDE2 38%, #DCE6E9 100%)",
        }}
        aria-hidden="true"
      />

      {/* Real photo on top of the placeholder, if the asset exists. */}
      {!imgFailed && (
        <img
          src="/estate/monte-fenosu.jpg"
          alt="Tenuta Monte Fenosu"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImgFailed(true)}
        />
      )}

      {/* Legibility scrim + caption. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: "linear-gradient(to top, rgba(14,17,22,.55), transparent)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 p-s5">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/85">
          La tenuta
        </p>
        <p className="mt-[2px] font-display text-[18px] font-bold tracking-tight text-white">
          Monte Fenosu — Muros (SS)
        </p>
      </div>
    </div>
  );
}
