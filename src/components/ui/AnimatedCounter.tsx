"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { animate, useInView } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  /** Formatter applied to the animated value each frame. */
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

const subscribeReducedMotion = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(reducedMotionQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const getReducedMotionSnapshot = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia(reducedMotionQuery).matches;

const getServerSnapshot = (): boolean => false;

/**
 * Detect prefers-reduced-motion via useSyncExternalStore (SSR-safe, no
 * setState-in-effect — the canonical way to subscribe to a media query).
 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerSnapshot,
  );
}

/**
 * AnimatedCounter — counts from 0 to `value` once when scrolled into view.
 * Honors prefers-reduced-motion: renders the final value immediately with no
 * animation (accessibility, AODA/WCAG).
 */
export function AnimatedCounter({
  value,
  format = (n) => Math.round(n).toLocaleString("en-CA"),
  duration = 1.2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const prefersReduced = usePrefersReducedMotion();
  // When reduced motion is on (or not yet in view), show the final value
  // directly — no animated setState-in-effect.
  const [display, setDisplay] = useState(prefersReduced ? value : 0);

  useEffect(() => {
    if (!inView || prefersReduced) return;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration, prefersReduced]);

  return (
    <span ref={ref} className={className} aria-label={format(value)}>
      {format(display)}
    </span>
  );
}
