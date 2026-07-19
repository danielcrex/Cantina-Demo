import { useEffect, useRef, useState } from "react";

/** True if the user asked for reduced motion (updates live). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Typewriter reveal for a string.
 * ---------------------------------------------------------------------------
 * Returns the progressively-revealed text and a `done` flag. Honours reduced
 * motion: when reduced (or disabled), the full text is returned immediately so
 * nothing animates. `startDelay` lets the card fade in first.
 */
export function useTypewriter(
  full: string,
  opts: { speedMs?: number; startDelay?: number; enabled?: boolean } = {},
): { text: string; done: boolean } {
  const { speedMs = 18, startDelay = 240, enabled = true } = opts;
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(reduced || !enabled ? full.length : 0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    // No animation: show everything at once.
    if (reduced || !enabled) {
      setCount(full.length);
      return;
    }
    setCount(0);
    const timeouts = timers.current;
    // Kick off after the fade-in, then step one char at a time.
    const startId = window.setTimeout(() => {
      for (let i = 1; i <= full.length; i++) {
        const id = window.setTimeout(() => setCount(i), i * speedMs);
        timeouts.push(id);
      }
    }, startDelay);
    timeouts.push(startId);
    return () => {
      timeouts.forEach(clearTimeout);
      timeouts.length = 0;
    };
  }, [full, speedMs, startDelay, enabled, reduced]);

  return { text: full.slice(0, count), done: count >= full.length };
}
