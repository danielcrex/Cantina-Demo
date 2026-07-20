import { useTypewriter } from "@/lib/useTypewriter";

/**
 * TypewriterText — reveals a scripted answer with a gentle typewriter.
 * ---------------------------------------------------------------------------
 * `animate` is set only on the newest assistant answer; older turns render in
 * full immediately. Honours prefers-reduced-motion (via useTypewriter, which
 * returns the whole string at once when reduced).
 */
export function TypewriterText({
  text,
  animate,
}: {
  text: string;
  animate: boolean;
}) {
  const { text: shown, done } = useTypewriter(text, {
    enabled: animate,
    startDelay: 120,
    speedMs: 14,
  });
  return (
    <span>
      {shown}
      {!done && (
        <span className="ml-[1px] inline-block h-[1.05em] w-[2px] -translate-y-[1px] animate-pulse bg-accent align-middle" />
      )}
    </span>
  );
}
