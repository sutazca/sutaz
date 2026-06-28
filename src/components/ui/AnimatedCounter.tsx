"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface AnimatedCounterProps {
  value: number;
  /** Formatter applied to the animated value each frame. */
  format?: (n: number) => string;
  duration?: number;
  className?: string;
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
