"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { TextFlip } from "@/components/ui/text-flip";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import { SITE, HERO } from "@/lib/content";
import { EASE_OUT_EXPO as ease } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * HeroSection — Engineering-Luxury v2 (DESIGN-ELEVATION §4.1, §4.2).
 *
 * The hero is now a single dominant element: a full-bleed atmospheric visual
 * (the rotating wireframe orb) behind 3 editorial elements (eyebrow →
 * headline → CTA). "One dominant element per viewport" — the reference video's
 * discipline applied to an engineering brand.
 *
 * Why <video> + poster: the orb's signature motion is the §4.5 "one signature
 * hero motion moment." The video is verified web-optimal (H.264 / yuv420p /
 * 720p / 3s seamless loop / no audio). Under prefers-reduced-motion we render
 * ONLY the static poster PNG — native <video autoPlay> does not honor the CSS
 * reduced-motion query (verified web.dev 2026-06-29), so the JS hook gates it.
 *
 * SSR safety: content renders VISIBLE in SSR HTML (no opacity:0 baked in) and
 * animates only after mount. The poster shows before any JS — worst case is a
 * static hero, never an invisible one.
 *
 * Stats / WorkflowDiagram / ROI calculator relocated:
 *  - 120s / 99.8% / 30-day stats → StatsBand (already canonical there).
 *  - WorkflowDiagram + HeroROICalculator → new HeroProof section below the fold.
 */

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const reveal = (delay = 0) => ({
    initial: mounted ? { opacity: 0, y: 24 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease },
  });

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Layer 0 — the signature atmospheric visual (full-bleed).
          Reduced-motion: static poster only. Otherwise the looping orb video. */}
      {prefersReducedMotion ? (
        <img
          src="/hero/orb-poster.png"
          alt=""
          aria-hidden
          className="hero-video absolute inset-0 h-full w-full"
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero/orb-poster.png"
          aria-hidden
          className="hero-video absolute inset-0 h-full w-full"
        >
          {/* Source order per web.dev: WebM (VP9) first — Firefox decodes VP9
              natively (no OS-codec dependency); H.264 High profile can't decode
              in headless/Linux Firefox (NS_ERROR_PARSED_DATA_CACHED). MP4 stays
              as the Safari fallback (Safari has no WebM support). Verified root
              cause + fix 2026-06-29 via Mozilla docs + Bugzilla #1130450. */}
          <source src="/hero/orb.webm" type="video/webm" />
          <source src="/hero/orb.mp4" type="video/mp4" />
        </video>
      )}

      {/* Layer 1 — WCAG scrim. Darkens the orb so white copy holds ≥4.5:1.
          Radial vignette keeps the orb's glow visible at center while edges
          fall to near-black. Contrast verified by axe in the E2E gate. */}
      <div className="hero-scrim absolute inset-0" aria-hidden />

      {/* Layer 2 — bottom fade into the page so the hero meets the body cleanly */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#0a0e1a]"
        aria-hidden
      />

      {/* Content — 3 elements only (§4.1: one dominant idea per viewport) */}
      <div className="container-content relative z-10 py-40">
        <motion.div {...reveal(0)} className="flex items-center gap-3">
          <span className="h-px w-8 bg-teal-500" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-teal-400">
            Canadian B2B Automation
          </span>
        </motion.div>

        <motion.h1
          {...reveal(0.08)}
          className="text-display-hero mt-6 max-w-[14ch] text-white"
        >
          We engineer{" "}
          <span className="text-gradient-teal">
            <TextFlip interval={2.4}>
              workflows
              <span className="text-gradient-teal">ecosystems</span>
              <span className="text-gradient-teal">pipelines</span>
              <span className="text-gradient-teal">agents</span>
            </TextFlip>
          </span>{" "}
          that permanently eliminate your team&apos;s admin bottlenecks.
        </motion.h1>

        <motion.p
          {...reveal(0.16)}
          className="mt-7 max-w-xl text-lg leading-relaxed text-slate-200"
        >
          {HERO.subheadline}
        </motion.p>

        <motion.div
          {...reveal(0.24)}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link
            href="/contact"
            className="group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-button bg-teal-700 px-7 py-4 text-base font-semibold text-white transition-all hover:bg-teal-600 glow-always"
          >
            {SITE.ctaPrimary}
            <AnimatedArrow className="transition-transform group-hover:translate-x-1" />
          </Link>
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Free 15-minute diagnostic — no obligation
          </span>
        </motion.div>
      </div>
    </section>
  );
}
