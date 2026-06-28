"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Home, HardHat, BarChart3, ShoppingBag, Scale, LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { VERTICALS, TOTAL_SERVICES } from "@/lib/service-catalog";
import { EASE_OUT_EXPO as ease } from "@/lib/motion";

/**
 * EcosystemPreview — pulls the 5 verticals from the real service catalog.
 * Glass cards with hover lift, mono service counts, lucide line icons (P5:
 * emoji replaced with line icons consistent with the rest of the site),
 * per-vertical colored icon chip + top border band. Count is computed
 * (TOTAL_SERVICES) so copy can never drift.
 */
const VERTICAL_ICONS: Record<string, LucideIcon> = {
  "real-estate": Home,
  construction: HardHat,
  "marketing-agencies": BarChart3,
  "e-commerce": ShoppingBag,
  "professional-services": Scale,
};

export function EcosystemPreview() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Atmospheric imagery layer (Phase 3 §4.4) — graded ship bridge controls */}
      <img
        src="/sections/ecosystems-graded.jpg"
        alt=""
        aria-hidden
        loading="lazy"
        className="section-media pointer-events-none absolute inset-0 h-full w-full"
      />
      <div className="section-scrim absolute inset-0" aria-hidden />
      <div className="container-content">
        <SectionHeading
          eyebrow="Built For Your Industry"
          title="Five specialized vertical ecosystems"
          subtitle={`Purpose-built automation engines for Canadian industries that can't afford downtime. ${TOTAL_SERVICES} engineered services across Real Estate, Construction, Marketing, E-Commerce, and Professional Services.`}
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VERTICALS.map((v, i) => {
            const moatCount = v.services.filter((s) => s.moat).length;
            const Icon = VERTICAL_ICONS[v.id] ?? BarChart3;
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
              >
                <Link
                  href={`/services#${v.id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-card glass-card p-7 transition-all hover:-translate-y-1"
                  style={{ borderTop: `3px solid ${v.borderColor}` }}
                >
                  {/* Cursor-tracking spotlight (Linear/Vercel dark-card effect) */}
                  <SpotlightCard
                    className="absolute inset-0"
                    spotlightColor={v.color + "22"}
                  >
                    <span className="sr-only">highlight</span>
                  </SpotlightCard>
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset"
                      style={{
                        backgroundColor: v.color + "22",
                        color: v.borderColor,
                        borderColor: v.borderColor + "55",
                      }}
                    >
                      <Icon size={22} aria-hidden />
                    </span>
                    <span className="rounded-full bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-400 ring-1 ring-inset ring-white/10">
                      Phase {v.phase}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-white">
                    {v.name}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                    {v.blurb}
                  </p>
                  <div className="mt-5 flex items-center gap-4 border-t border-[var(--color-border-strong)] pt-4 font-mono text-xs text-slate-400">
                    <span><span className="font-bold text-white">{v.services.length}</span> services</span>
                    <span><span className="font-bold text-teal-400">{moatCount}</span> moat</span>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-400 transition-colors group-hover:text-teal-300">
                    Explore the menu
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}

          {/* CTA card — fills the 6th slot */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.6, delay: VERTICALS.length * 0.08, ease }}
            className="flex flex-col justify-center rounded-card bg-gradient-to-br from-teal-700 to-teal-800 p-7 text-white glow-teal"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-teal-100">
              Not sure which fits?
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold">
              We diagnose first. Then we build.
            </h3>
            <p className="mt-3 text-sm text-teal-50">
              A free 15-minute audit identifies your top 3 automatable tasks.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-button bg-white px-5 py-3 text-sm font-semibold text-teal-700 transition-transform hover:scale-[1.02]"
            >
              Book the audit
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
