"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { HeroROICalculator } from "@/components/homepage/ROICalculator";
import { SITE, HERO } from "@/lib/content";

/**
 * HeroSection — Engineering-Luxury.
 * SSR-safe entrance animation: content renders VISIBLE in SSR HTML (no
 * opacity:0 baked in), then animates only after client mount. This prevents
 * the "invisible hero" failure if JS is slow/blocked — the worst case is no
 * animation, not missing content.
 */
const ease = [0.16, 1, 0.3, 1] as const;

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
      {/* Vibrant aura behind hero — gives glass + glow something to refract (P0-3) */}
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
              className="group inline-flex items-center justify-center gap-2 rounded-button bg-teal-600 px-7 py-4 text-base font-semibold text-white transition-all hover:bg-teal-500 glow-always"
            >
              {SITE.ctaPrimary}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Free 15-minute diagnostic — no obligation
            </span>
          </motion.div>

          {/* Trust strip — real tool marks, AA contrast (P0-2, P2-1) */}
          <motion.div {...reveal(0.32)} className="mt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Integrates with your existing stack
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold tracking-tight text-slate-400">
              {["QuickBooks", "Slack", "Zapier", "Make", "ClickUp", "Realtor.ca", "Google Sheets"].map((t) => (
                <span key={t} className="transition-colors hover:text-teal-300">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right — ROI calculator "terminal" */}
        <motion.div
          initial={mounted ? { opacity: 0, scale: 0.97, y: 20 } : false}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
        >
          <HeroROICalculator />
        </motion.div>
      </div>
    </section>
  );
}
