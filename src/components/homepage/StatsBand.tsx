"use client";

import { motion } from "motion/react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { EASE_OUT_EXPO as ease } from "@/lib/motion";

/**
 * StatsBand — homepage social-proof strip between hero and ProblemSolution.
 * Four animated counters on a divider-glow band. Every figure is blueprint-
 * sourced (see src/lib/content.ts):
 *  - 99.8% structural precision (Master Blueprint Section 1, IDP)
 *  - 120s lead-to-booking response (Master Blueprint Section 3)
 *  - 30-day deterministic rollout (Master Blueprint Section 3)
 *  - 4 isolated build phases (Lab phases — LAB_PHASES length)
 */

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}
const STATS: StatItem[] = [
  { value: 99.8, suffix: "%", label: "Document precision", decimals: 1 },
  { value: 120, suffix: "s", label: "Avg. lead response" },
  { value: 30, suffix: "-day", label: "Deterministic rollout" },
  { value: 4, suffix: "", label: "Isolated build phases" },
];

export function StatsBand() {
  return (
    <section className="relative overflow-hidden py-10">
      {/* Atmospheric imagery layer (Phase 3 §4.4) — graded robotic-arm band.
          Parallax-drifted against the static counters = Z-space separation;
          scale-110 overscans so the drift never reveals section edges. */}
      <ParallaxLayer speed={-0.08} className="absolute inset-0">
        <img
          src="/sections/stats-graded.webp"
          alt=""
          aria-hidden
          loading="lazy"
          className="section-media pointer-events-none absolute inset-0 h-full w-full scale-110"
        />
      </ParallaxLayer>
      <div className="section-scrim absolute inset-0" aria-hidden />
      <div className="container-content">
        <div className="divider-glow" aria-hidden />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, ease }}
          className="grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-baseline justify-center font-display text-4xl font-bold text-white md:text-5xl">
                <AnimatedCounter
                  value={stat.value}
                  duration={1.6}
                  format={(n) =>
                    n.toLocaleString("en-CA", {
                      minimumFractionDigits: stat.decimals ?? 0,
                      maximumFractionDigits: stat.decimals ?? 0,
                    })
                  }
                />
                <span className="text-gradient-teal">{stat.suffix}</span>
              </div>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
        <div className="divider-glow" aria-hidden />
      </div>
    </section>
  );
}
