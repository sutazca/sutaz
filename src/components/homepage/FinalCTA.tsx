"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SITE, CONTACT_COPY } from "@/lib/content";
import { EASE_OUT_EXPO as ease } from "@/lib/motion";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { useMounted } from "@/hooks/useMounted";

/**
 * FinalCTA — homepage closing conversion band (before the footer).
 * The page previously ended on a quiet FAQ accordion; this adds the missing
 * conversion close. Body copy is verbatim (Blueprint Doc Section 3, Page 3).
 * Teal-gradient panel + primary CTA. SSR-safe entrance animation.
 */

export function FinalCTA() {
  const mounted = useMounted();

  return (
    <section className="section-pad relative overflow-hidden">
      {/* Atmospheric imagery layer (Phase 3 §4.4) — graded industrial control room */}
      <ParallaxLayer speed={-0.08} className="absolute inset-0">
        <img
          src="/sections/final-cta-graded.webp"
          alt=""
          aria-hidden
          loading="lazy"
          className="section-media pointer-events-none absolute inset-0 h-full w-full scale-110"
        />
      </ParallaxLayer>
      <div className="section-scrim absolute inset-0" aria-hidden />
      <div className="container-content">
        <motion.div
          initial={mounted ? { opacity: 0, y: 24 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease }}
          className="relative overflow-hidden rounded-card border border-teal-400/30 bg-gradient-to-br from-teal-700 via-teal-800 to-navy-600 p-10 text-center md:p-16"
        >
          {/* Aura inside the panel for depth */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, rgb(255 255 255 / 0.18), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal-100">
              {CONTACT_COPY.meta}
            </p>
            <h2 className="text-display mt-5 text-white text-[clamp(2rem,4vw,3.25rem)]">
              {CONTACT_COPY.body}
            </h2>
            <div className="mt-9">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-teal-700 transition-all hover:scale-[1.03] hover:bg-teal-50"
              >
                {SITE.ctaPrimary}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
