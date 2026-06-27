"use client";

import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { PAIN_CURE_PAIRS } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ease = [0.16, 1, 0.3, 1] as const;

export function ProblemSolution() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-content">
        <SectionHeading
          eyebrow="The Pain & The Cure"
          title="Manual work is a profit leak. Automation is the plug."
          subtitle="Every pair below maps a real bottleneck we replace with an engineered system."
        />

        <div className="mx-auto mt-16 max-w-4xl space-y-5">
          {PAIN_CURE_PAIRS.map((pair, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className="grid gap-px overflow-hidden rounded-card bg-white/10 md:grid-cols-2"
            >
              <div className="flex gap-4 bg-red-950/40 p-6">
                <AlertTriangle className="shrink-0 text-red-400" size={22} aria-hidden />
                <p className="text-red-200">{pair.pain}</p>
              </div>
              <div className="flex gap-4 bg-emerald-950/40 p-6">
                <CheckCircle2 className="shrink-0 text-emerald-400" size={22} aria-hidden />
                <p className="text-emerald-200">{pair.cure}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
