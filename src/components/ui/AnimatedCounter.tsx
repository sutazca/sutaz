"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  /** Formatter applied to the animated value each frame. */
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}

/**
 * AnimatedCounter — counts from 0 to `value` once when scrolled into view.
 * Honors prefers-reduced-motion (via motion's animate respecting the global
 * override in globals.css; we also short-circuit to the final value).
 */
export function AnimatedCounter({
  value,
  format = (n) => Math.round(n).toLocaleString("en-CA"),
  duration = 1.2,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className} aria-label={format(value)}>
      {format(display)}
    </span>
  );
}
