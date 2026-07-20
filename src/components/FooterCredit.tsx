import { useState } from "react";

/**
 * FooterCredit — "Cantina è offerto da [ARBISU]".
 * ---------------------------------------------------------------------------
 * The ONLY place ARBISU appears in the app chrome. Shows the black ARBISU logo
 * on white, linking to the ARBISU site.
 *
 * The link is a CREDIT LINK ONLY: it makes no request on load (the logo is a
 * bundled local asset), and it opens in a new tab — it won't be tapped during
 * the offline tablet demo. If the logo asset is missing we fall back to a clean
 * "ARBISU" text wordmark.
 */
export function FooterCredit({ className = "" }: { className?: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <a
      href="https://www.arbisu.com/home"
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-center gap-s1 rounded-btn py-s1 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
    >
      <span className="text-[11px] text-ink-3">Cantina è offerto da</span>
      {imgFailed ? (
        <span
          className="font-display text-[13px] font-extrabold text-ink"
          style={{ letterSpacing: "0.14em" }}
        >
          ARBISU
        </span>
      ) : (
        <img
          src="/brand/arbisu-black.png"
          alt="ARBISU"
          className="h-[15px] w-auto"
          onError={() => setImgFailed(true)}
        />
      )}
    </a>
  );
}
