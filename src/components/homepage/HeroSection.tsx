"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "motion/react";
import { TextFlip } from "@/components/ui/text-flip";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import { SITE, HERO } from "@/lib/content";
import { EASE_OUT_EXPO as ease } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * HeroSection — Engineering-Luxury v2 (DESIGN-ELEVATION §4.1, §4.2).
 *
 * The hero is a single dominant element: a full-bleed atmospheric visual
 * (the wireframe orb) behind 3 editorial elements (eyebrow → headline → CTA).
 * "One dominant element per viewport."
 *
 * Layer 0 architecture (3D elevation):
 *  - The static poster PNG renders UNCONDITIONALLY as the base layer — it is
 *    the LCP / no-JS / no-WebGL / reduced-motion guarantee. Hero text and
 *    poster paint before a single three.js byte loads.
 *  - A live React-Three-Fiber scene (HeroOrb: rotating wireframe orb + glass
 *    panes that fan apart in Z as you scroll) mounts client-only via
 *    next/dynamic {ssr:false}, one idle tick after hydration so three.js
 *    parse/compile never lands in the initial main-thread window (protects
 *    the longtask budget in e2e/performance.spec.ts).
 *  - prefers-reduced-motion: the scene never mounts; poster only. The JS hook
 *    gates it (CSS reduced-motion doesn't stop a WebGL frame loop).
 *  - The legacy orb video assets stay in public/hero/ for rollback; the
 *    <video> element itself was replaced by the R3F scene.
 *
 * SSR safety: content renders VISIBLE in SSR HTML (no opacity:0 baked in) and
 * animates only after mount. The poster shows before any JS — worst case is a
 * static hero, never an invisible one.
 */

const HeroOrb = dynamic(() => import("./HeroOrb"), { ssr: false });

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [showOrb, setShowOrb] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Mount the WebGL orb only when it can actually run smoothly:
  //  1. Hardware-acceleration gate — on software-rendered WebGL (SwiftShader/
  //     llvmpipe: GPU-less VMs, some headless/remote setups) every frame is
  //     CPU-drawn, turning the frame loop into continuous main-thread long
  //     tasks. Those environments keep the poster. Measured on a GPU-less
  //     box: HEAD = 1 long task/75ms; naive always-on orb = 30 tasks/360ms.
  //     `?forceOrb=1` overrides the gate so e2e can exercise the mount path.
  //  2. Idle-phase split — import("three") evaluates the heavy module in its
  //     own idle task, then HeroOrb's chunk (R3F + scene) mounts on the next
  //     idle tick, so hydration never eats one giant task.
  useEffect(() => {
    let cancelled = false;
    const idle = (cb: () => void) =>
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(cb)
        : window.setTimeout(cb, 200);

    const hardwareAccelerated = (): boolean => {
      try {
        const probe = document.createElement("canvas");
        const gl =
          probe.getContext("webgl2") ?? probe.getContext("webgl") ?? null;
        if (!gl) return false;
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = ext
          ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL))
          : "";
        return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
      } catch {
        return false;
      }
    };

    idle(() => {
      if (cancelled) return;
      const forced = new URLSearchParams(window.location.search).has(
        "forceOrb",
      );
      if (!forced && !hardwareAccelerated()) return; // poster stays
      import("three").then(() => {
        if (!cancelled) idle(() => !cancelled && setShowOrb(true));
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const reveal = (delay = 0) => ({
    initial: mounted ? { opacity: 0, y: 24 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease },
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Layer 0a — static poster, ALWAYS rendered. LCP / no-JS / no-WebGL /
          reduced-motion guarantee: the hero never depends on three.js. */}
      <img
        src="/hero/orb-poster.png"
        alt=""
        aria-hidden
        className="hero-video absolute inset-0 h-full w-full"
      />

      {/* Layer 0b — live R3F orb scene (scroll-driven Z-space glass panes),
          client-only, idle-deferred, skipped entirely under reduced motion. */}
      {showOrb && !prefersReducedMotion ? (
        <HeroOrb progress={scrollYProgress} />
      ) : null}

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
