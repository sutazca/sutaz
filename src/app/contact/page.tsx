import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CONTACT_COPY, SITE } from "@/lib/content";
import { CalendlyPanel } from "@/components/contact/CalendlyPanel";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description:
    "Book a free 15-minute diagnostic call. We'll identify at least 3 manual tasks in your business that can be completely automated this week.",
  alternates: { canonical: "/contact" },
  // Noindex the booking page — it's a conversion endpoint, not SEO content.
  robots: { index: false, follow: false },
};

const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

/**
 * Contact & Booking page — blueprint Section 9.
 * Minimal navbar (logo + back arrow only — "remove massive navigation links").
 * 50/50: left = verbatim copy; right = Calendly inline embed.
 * P6: unified to the dark Engineering-Luxury theme (was the only light page).
 */
export default function ContactPage() {
  return (
    <>
      {/* Minimal header — blueprint: "keep this completely clean of distractions" */}
      <header className="border-b border-[var(--color-border-strong)] bg-navy-600">
        <div className="container-content flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight text-white"
          >
            {SITE.name}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden />
            Back
          </Link>
        </div>
      </header>

      <section className="py-16 md:py-24">
        <div className="container-content grid items-start gap-10 md:grid-cols-2 md:gap-16">
          {/* Left — verbatim copy (Blueprint Doc Section 3, Page 3) */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-teal-500" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-teal-400">
                Free Diagnostic
              </span>
            </div>
            <h1 className="text-display mt-5 text-white text-[clamp(2rem,4vw,3rem)]">
              Let&apos;s map out your operations.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              {CONTACT_COPY.body}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-button border border-teal-400/30 bg-teal-500/10 px-4 py-2 text-sm font-semibold text-teal-300">
              {CONTACT_COPY.meta}
            </p>
          </div>

          {/* Right — Calendly embed (kept in a bordered panel for the dark theme) */}
          <div className="glass-card rounded-card p-4 md:p-6">
            <CalendlyPanel url={calendlyUrl} />
          </div>
        </div>
      </section>
    </>
  );
}
