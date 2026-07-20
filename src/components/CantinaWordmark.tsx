import { useState } from "react";

/**
 * Cantina wordmark — the product brand mark (sidebar top + login header).
 * ---------------------------------------------------------------------------
 * Renders the Cantina logo (bundled local asset, background keyed to
 * transparency so it sits cleanly on the pure-white base). If the asset is
 * missing it falls back to a clean text "Cantina" in the display font — same
 * image-with-text-fallback pattern as the ARBISU footer credit.
 *
 * `className` sizes the mark: pass a height (e.g. `h-10 w-auto`) for the image;
 * the text fallback picks a matching size so either variant reads well.
 */
export function CantinaWordmark({ className = "h-10 w-auto" }: { className?: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <span
        className="font-display text-[24px] font-extrabold text-ink font-display-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        Cantina
      </span>
    );
  }

  // Path is lowercase and referenced byte-for-byte to resolve on Cloudflare's
  // case-sensitive Linux filesystem (the committed source was uppercase .PNG).
  return (
    <img
      src="/brand/cantina-logo.png"
      alt="Cantina"
      className={className}
      onError={() => setImgFailed(true)}
    />
  );
}
