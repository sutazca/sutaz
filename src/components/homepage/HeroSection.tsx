"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { HeroROICalculator } from "@/components/homepage/ROICalculator";
import { WorkflowDiagram } from "@/components/homepage/WorkflowDiagram";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SITE, HERO } from "@/lib/content";

/**
 * HeroSection — Engineering-Luxury.
 * SSR-safe entrance animation: content renders VISIBLE in SSR HTML (no
 * opacity:0 baked in), then animates only after client mount. This prevents
 * the "invisible hero" failure if JS is slow/blocked — the worst case is no
 * animation, not missing content.
 *
 * Layout: left editorial copy (headline + subhead + CTA + trust strip + stats);
 * right column = supporting WorkflowDiagram + live ROI "terminal".
 */
const ease = [0.16, 1, 0.3, 1] as const;

// Stat figures are all blueprint-sourced (see src/lib/content.ts citations):
// 120s lead response, 99.8% parse precision, 30-day rollout.
interface HeroStat {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}
const HERO_STATS: HeroStat[] = [
  { value: 120, suffix: "s", label: "Lead response" },
  { value: 99.8, suffix: "%", label: "Parse precision", decimals: 1 },
  { value: 30, suffix: "-day", label: "Rollout" },
];

const INTEGRATIONS = [
  "QuickBooks",
  "Slack",
  "Zapier",
  "Make",
  "ClickUp",
  "Realtor.ca",
  "Google Sheets",
] as const;

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const reveal = (delay = 0) => ({
    initial: mounted ? { opacity: 0, y: 24 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease },
  });

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
      {/* Vibrant aura behind hero — gives glass + glow something to refract (P2) */}
      <div className="hero-aura" aria-hidden />
      {/* Top fade so the navbar transition is clean */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-700 to-transparent" aria-hidden />

      <div className="container-content relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Left — editorial copy */}
        <div>
          <motion.div {...reveal(0)} className="flex items-center gap-3">
            <span className="h-px w-8 bg-teal-500" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-teal-400">
              Canadian B2B Automation
            </span>
          </motion.div>

          <motion.h1
            {...reveal(0.08)}
            className="text-display mt-6 max-w-[15ch] text-white text-[clamp(2.75rem,6vw,5rem)]"
          >
            We engineer{" "}
            <span className="text-gradient-teal">enterprise-grade workflows</span>{" "}
            that permanently eliminate your team&apos;s admin bottlenecks.
          </motion.h1>

          <motion.p
            {...reveal(0.16)}
            className="mt-7 max-w-xl text-lg leading-relaxed text-slate-400"
          >
            {HERO.subheadline}
          </motion.p>

          <motion.div {...reveal(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-button bg-teal-700 px-7 py-4 text-base font-semibold text-white transition-all hover:bg-teal-600 glow-always"
            >
              {SITE.ctaPrimary}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Free 15-minute diagnostic — no obligation
            </span>
          </motion.div>

          {/* Stat counters — blueprint-sourced figures (P2) */}
          <motion.div
            {...reveal(0.3)}
            className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-[var(--color-border-strong)] pt-6"
          >
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="flex items-baseline font-mono text-2xl font-bold text-white tabular-nums">
                  <AnimatedCounter
                    value={stat.value}
                    duration={1.4}
                    format={(n) =>
                      n.toLocaleString("en-CA", {
                        minimumFractionDigits: stat.decimals ?? 0,
                        maximumFractionDigits: stat.decimals ?? 0,
                      })
                    }
                  />
                  <span className="text-teal-400">{stat.suffix}</span>
                </div>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Trust strip — bordered, evenly-spaced wordmarks (P2) */}
          <motion.div {...reveal(0.36)} className="mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Integrates with your existing stack
            </p>
            <div className="glass-card mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-button px-4 py-3">
              {INTEGRATIONS.map((t) => (
                <span
                  key={t}
                  className="text-sm font-semibold tracking-tight text-slate-300 transition-colors hover:text-teal-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — workflow diagram + ROI calculator "terminal" */}
        <motion.div
          initial={mounted ? { opacity: 0, scale: 0.97, y: 20 } : false}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="flex flex-col gap-5"
        >
          <WorkflowDiagram />
          <HeroROICalculator />
        </motion.div>
      </div>
    </section>
  );
}
