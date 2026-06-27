"use client";

import { motion } from "motion/react";
import { HeroROICalculator } from "@/components/homepage/ROICalculator";
import { Button } from "@/components/ui/Button";
import { HERO, SITE } from "@/lib/content";

/**
 * HeroSection — blueprint Section 6.2. 50/50 split-grid:
 * left = verbatim headline/subheadline + CTA; right = ROI calculator.
 *
 * Client component because it uses motion for entrance animations.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background-soft">
      {/* subtle navy→white gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-50/60 to-transparent"
        aria-hidden
      />
      <div className="container-content relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24 lg:gap-16">
        {/* Left column — copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-navy-500 md:text-6xl">
            {HERO.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {HERO.subheadline}
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button href="/contact" size="lg">
              {SITE.ctaPrimary}
            </Button>
            <span className="text-sm font-medium text-teal-600">Free</span>
          </div>
        </motion.div>

        {/* Right column — ROI calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <HeroROICalculator />
        </motion.div>
      </div>
    </section>
  );
}
