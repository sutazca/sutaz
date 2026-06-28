"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LAB_PHASES } from "@/lib/content";

/**
 * HowWeBuild — homepage section promoting the /lab page.
 * Renders the verbatim LAB_PHASES (Master Blueprint Section 3) as a dark-themed
 * horizontal 4-step timeline with glass nodes. CTA links to the full /lab page.
 */
const ease = [0.16, 1, 0.3, 1] as const;

export function HowWeBuild() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-content">
        <SectionHeading
          eyebrow="How We Build"
          title="A deterministic 30-day rollout. Zero risk."
          subtitle="Live operational channels are never touched until a system has proven itself. Four isolated phases, each with its own deliverable."
        />

        <div className="relative mt-16">
          {/* Connecting rail (desktop) */}
          <div
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[var(--color-border-strong)] to-transparent md:block"
            aria-hidden
          />
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
            {LAB_PHASES.map((p, i) => (
              <motion.li
                key={p.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className="relative"
              >
                <div className="flex flex-col gap-4 md:items-center md:text-center">
                  {/* Phase node */}
                  <span className="glass-card relative z-10 flex h-14 w-14 items-center justify-center rounded-full font-display text-lg font-bold text-teal-300">
                    {p.number}
                  </span>
                  <div className="md:px-1">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-teal-400">
                      {p.window}
                    </p>
                    <h3 className="mt-1.5 font-display text-base font-bold text-white">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {p.description}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="mt-14 flex justify-center"
        >
          <Link
            href="/lab"
            className="group inline-flex items-center justify-center gap-2 rounded-button border border-[var(--color-border-strong)] bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-teal-400/50 hover:bg-white/[0.06]"
          >
            See the full Engineering Lab
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
