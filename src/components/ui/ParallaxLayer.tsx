"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * ParallaxLayer — Z-space layer separation for scroll storytelling.
 *
 * Wrap sibling blocks in layers with contrasting speeds (e.g. media at -0.12,
 * copy at +0.06) and they drift apart as the section crosses the viewport —
 * the same depth cue as the hero's glass panes, in cheap compositor-only CSS
 * (translateY via motion/react useScroll+useTransform; no scroll listeners,
 * no re-renders, no layout properties animated).
 *
 * Reduced motion: renders children in a plain div — zero movement, zero CLS.
 */
export function ParallaxLayer({
  children,
  speed = -0.08,
  className,
}: {
  children: React.ReactNode;
  /** Drift factor, clamped to ±0.2. Negative = moves up as you scroll down. */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const clamped = Math.max(-0.2, Math.min(0.2, speed));
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [clamped * 200, -clamped * 200],
  );

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
