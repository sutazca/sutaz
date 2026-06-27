"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { HeroROICalculator } from "@/components/homepage/ROICalculator";
import { SITE, HERO } from "@/lib/content";

/**
 * HeroSection — Engineering-Luxury.
 * Asymmetric editorial layout: oversized Fraunces headline with a teal-gradient
 * accent word, monospace eyebrow, the ROI calculator as a "terminal" panel on
 * the right. Staggered kinetic reveal on load. Verbatim copy from the blueprint.
 */
const ease = [0.16, 1, 0.3, 1] as const;

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  };
}

export function HeroSection() {
  // Split the headline to apply the teal gradient to the operative phrase.
  // Full headline stays in HERO.headline (verbatim); we render it as one piece
  // for SEO/accessibility, layering the gradient on a span for emphasis.
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
      {/* Top fade so the navbar transition is clean */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-700 to-transparent" aria-hidden />

      <div className="container-content grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
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
            className="text-display mt-6 text-white text-[2.5rem] sm:text-5xl lg:text-[3.75rem] xl:text-6xl"
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
              className="group inline-flex items-center justify-center gap-2 rounded-button bg-teal-600 px-7 py-4 text-base font-semibold text-white transition-all hover:bg-teal-500 glow-teal"
            >
              {SITE.ctaPrimary}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Free 15-minute diagnostic — no obligation
            </span>
          </motion.div>

          {/* Trust strip — real tools as text marks */}
          <motion.div {...reveal(0.32)} className="mt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-600">
              Integrates with your existing stack
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
              {["QuickBooks", "Slack", "Zapier", "Make", "ClickUp", "Realtor.ca", "Google Sheets"].map((t) => (
                <span key={t} className="transition-colors hover:text-slate-300">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — ROI calculator "terminal" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          <HeroROICalculator />
        </motion.div>
      </div>
    </section>
  );
}
