/**
 * Cantina wordmark — the product name in the display font.
 * ---------------------------------------------------------------------------
 * The app is "Cantina" (ARBISU appears only in the footer credit). No Cantina
 * logo asset exists, so this is a clean text wordmark, on-theme.
 */
export function CantinaWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display font-extrabold text-ink font-display-tight ${className}`}
      style={{ letterSpacing: "-0.02em" }}
    >
      Cantina
    </span>
  );
}
