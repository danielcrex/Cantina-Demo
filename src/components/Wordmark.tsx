import { useState } from "react";

/**
 * ARBISU wordmark.
 * ---------------------------------------------------------------------------
 * Renders `public/brand/arbisu-black.png` (black reads cleanest on white).
 * If the asset is absent or fails to load, we fall back to a clean text
 * "ARBISU" set in the display font — so the shell always shows a wordmark,
 * with or without the image dropped in.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  // Flips to true if the PNG 404s (asset not yet dropped in).
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <span
        className={`font-display font-extrabold text-ink font-display-tight ${className}`}
        // Letter-spacing tuned to echo the spaced-out logo lettering.
        style={{ letterSpacing: "0.14em" }}
      >
        ARBISU
      </span>
    );
  }

  return (
    <img
      src="/brand/arbisu-black.png"
      alt="ARBISU"
      className={className}
      onError={() => setImgFailed(true)}
    />
  );
}
