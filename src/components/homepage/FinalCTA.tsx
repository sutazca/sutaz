"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SITE, CONTACT_COPY } from "@/lib/content";

/**
 * FinalCTA — homepage closing conversion band (before the footer).
 * The page previously ended on a quiet FAQ accordion; this adds the missing
 * conversion close. Body copy is verbatim (Blueprint Doc Section 3, Page 3).
 * Teal-gradient panel + primary CTA. SSR-safe entrance animation.
 */
const ease = [0.16, 1, 0.3, 1] as const;

export function FinalCTA() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative py-24 md:py-32">
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
                className="group inline-flex items-center justify-center gap-2 rounded-button bg-white px-8 py-4 text-base font-semibold text-teal-700 transition-all hover:scale-[1.03] hover:bg-teal-50"
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
