"use client";

import type { Transition, Variants } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import { Children, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * TextFlip — rotating word carousel.
 * Adapted from shadcn-labs/agentcn (same stack: motion v12, React 19).
 * AnimatePresence mode="wait" swaps one child with y:-8→0→8 + opacity on an
 * interval. Honors prefers-reduced-motion via the global globals.css rule
 * (animation-duration: 0.01ms) — the interval still advances the word but the
 * transition is instant for reduced-motion users.
 */
const defaultVariants: Variants = {
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  initial: { opacity: 0, y: -8 },
};

type MotionElement = typeof motion.span;

export interface TextFlipProps {
  className?: string;
  children: React.ReactNode[];
  interval?: number;
  transition?: Transition;
  variants?: Variants;
}

export function TextFlip({
  className,
  children,
  interval = 2.2,
  transition = { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  variants = defaultVariants,
}: TextFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Children.toArray(children);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval * 1000);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  return (
    <span className={cn("relative inline-flex", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="inline-block"
        >
          {items[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
