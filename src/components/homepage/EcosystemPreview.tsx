"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VERTICALS } from "@/lib/service-catalog";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * EcosystemPreview — now pulls from the real service catalog (5 verticals).
 * Glass cards with hover lift, mono service counts, accent borders.
 */
export function EcosystemPreview() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-content">
        <SectionHeading
          eyebrow="Built For Your Industry"
          title="Five specialized vertical ecosystems"
          subtitle="Purpose-built automation engines for Canadian industries that can't afford downtime. 120+ engineered services across Real Estate, Construction, Marketing, E-Commerce, and Professional Services."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VERTICALS.map((v, i) => {
            const moatCount = v.services.filter((s) => s.moat).length;
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
                  style={{ borderTop: `2px solid ${v.borderColor}` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{v.emoji}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      Phase {v.phase}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-white">
                    {v.name}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                    {v.blurb}
                  </p>
                  <div className="mt-5 flex items-center gap-4 border-t border-white/5 pt-4 font-mono text-xs text-slate-500">
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
            className="flex flex-col justify-center rounded-card bg-teal-600 p-7 text-white glow-teal"
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
