"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * AnimatedArrow — a CTA arrow that nudges on hover and re-enters with a
 * subtle settle. Inspired by agentcn's motion icon patterns. Honors
 * prefers-reduced-motion via globals.css (motion shrinks to 0.01ms).
 */
export function AnimatedArrow({ className }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      className={cn("inline-flex", className)}
      whileHover={{ x: 3 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <ArrowRight size={18} />
    </motion.span>
  );
}
