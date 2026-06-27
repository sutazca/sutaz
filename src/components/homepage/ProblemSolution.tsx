"use client";

import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { PAIN_CURE_PAIRS } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * ProblemSolution — blueprint Section 6.3.
 * Pairs displayed as left/right cards (pain tint red, cure tint green).
 * Primary pair is verbatim; rest derived (see src/lib/content.ts).
 */
export function ProblemSolution() {
  return (
    <section className="py-20 md:py-24">
      <div className="container-content">
        <SectionHeading
          eyebrow="The Pain & The Cure"
          title="Manual work is a profit leak. Automation is the plug."
          subtitle="Every pair below maps a real bottleneck we replace with an engineered system."
        />

        <div className="mt-12 space-y-6">
          {PAIN_CURE_PAIRS.map((pair, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="grid gap-4 md:grid-cols-2"
            >
              {/* Pain */}
              <div className="flex gap-4 rounded-card border border-red-100 bg-pain-bg p-6">
                <AlertTriangle
                  className="shrink-0 text-pain-text"
                  size={24}
                  aria-hidden
                />
                <p className="text-pain-text">{pair.pain}</p>
              </div>
              {/* Cure */}
              <div className="flex gap-4 rounded-card border border-emerald-100 bg-cure-bg p-6">
                <CheckCircle2
                  className="shrink-0 text-cure-text"
                  size={24}
                  aria-hidden
                />
                <p className="text-cure-text">{pair.cure}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
