"use client";

import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { PAIN_CURE_PAIRS } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EASE_OUT_EXPO as ease } from "@/lib/motion";

/**
 * ProblemSolution — pain/cure pairs restyled to the luxury-dark language (P4).
 * Previously flat saturated red/green halves that broke the visual system.
 * Now: each pair is a single glass card with STRUCTURAL color coding — a red
 * left-rule + AlertTriangle for the pain, a teal left-rule + CheckCircle2 for
 * the cure, joined by an inline "→" arrow. Verbatim PAIN_CURE_PAIRS preserved.
 */
export function ProblemSolution() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Atmospheric imagery layer (Phase 3 §4.4) — graded robotic hand → nodes */}
      <img
        src="/sections/problem-solution-graded.jpg"
        alt=""
        aria-hidden
        loading="lazy"
        className="section-media pointer-events-none absolute inset-0 h-full w-full"
      />
      <div className="section-scrim absolute inset-0" aria-hidden />
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
              className="glass-card grid gap-0 overflow-hidden rounded-card md:grid-cols-[1fr_auto_1fr]"
            >
              {/* Pain — structural red left-rule */}
              <div className="flex gap-4 border-l-2 border-red-400/70 p-6">
                <AlertTriangle className="mt-0.5 shrink-0 text-red-400" size={20} aria-hidden />
                <p className="text-slate-300">
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-red-400/80">
                    Without
                  </span>
                  {pair.pain}
                </p>
              </div>

              {/* Arrow divider */}
              <div className="flex items-center justify-center border-t border-[var(--color-border-strong)] bg-white/[0.02] px-4 md:border-l md:border-t-0">
                <ArrowRight className="rotate-90 text-teal-400 md:rotate-0" size={18} aria-hidden />
              </div>

              {/* Cure — structural teal left-rule */}
              <div className="flex gap-4 border-l-2 border-teal-400/70 p-6 md:border-l-2">
                <CheckCircle2 className="mt-0.5 shrink-0 text-teal-400" size={20} aria-hidden />
                <p className="text-slate-200">
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-teal-400">
                    With Sutaz
                  </span>
                  {pair.cure}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
