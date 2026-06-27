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
 */
export default function ContactPage() {
  return (
    <>
      {/* Minimal header — blueprint: "keep this completely clean of distractions" */}
      <header className="border-b border-navy-100 bg-white">
        <div className="container-content flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight text-navy-500"
          >
            {SITE.name}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-500"
          >
            <ArrowLeft size={16} aria-hidden />
            Back
          </Link>
        </div>
      </header>

      <section className="py-12 md:py-16">
        <div className="container-content grid items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Left — verbatim copy (Blueprint Doc Section 3, Page 3) */}
          <div>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-navy-500 md:text-4xl">
              Let&apos;s map out your operations.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {CONTACT_COPY.body}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-default bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
              {CONTACT_COPY.meta}
            </p>
          </div>

          {/* Right — Calendly embed */}
          <div>
            <CalendlyPanel url={calendlyUrl} />
          </div>
        </div>
      </section>
    </>
  );
}
