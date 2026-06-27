"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Building2, HardHat, Megaphone } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Vertical {
  icon: React.ReactNode;
  title: string;
  blurb: string;
  href: string;
  cta: string;
}

const VERTICALS: readonly Vertical[] = [
  {
    icon: <Building2 size={28} aria-hidden />,
    title: "Real Estate Networks",
    blurb: "Lead-to-Booking in 120 seconds — Realtor.ca intercept, agent auto-assign, SMS calendar links.",
    href: "/ecosystems#real-estate",
    cta: "Explore",
  },
  {
    icon: <HardHat size={28} aria-hidden />,
    title: "Construction & Contracting",
    blurb: "Intelligent Document Processing — PDF estimates parsed and mapped to QuickBooks cost codes.",
    href: "/ecosystems#construction",
    cta: "Explore",
  },
  {
    icon: <Megaphone size={28} aria-hidden />,
    title: "Digital & Creative Agencies",
    blurb: "Client Onboarding Pipeline — Slack channels, Drive folders, and task templates spawned on contract.",
    href: "/ecosystems#agencies",
    cta: "Explore",
  },
] as const;

/**
 * EcosystemPreview — blueprint Section 6.4. Three cards teasing the
 * verticals, each linking to /ecosystems#<anchor>.
 */
export function EcosystemPreview() {
  return (
    <section className="bg-background-soft py-20 md:py-24">
      <div className="container-content">
        <SectionHeading
          eyebrow="Built For Your Industry"
          title="Specialized vertical ecosystems"
          subtitle="Purpose-built automation engines for Canadian industries that can't afford downtime."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {VERTICALS.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card interactive className="h-full">
                <CardBody className="flex h-full flex-col">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-default bg-teal-50 text-teal-600">
                    {v.icon}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-navy-500">
                    {v.title}
                  </h3>
                  <p className="mt-3 flex-1 text-muted">{v.blurb}</p>
                  <Link
                    href={v.href}
                    className="mt-6 inline-flex items-center gap-1.5 font-semibold text-teal-600 hover:text-teal-700"
                  >
                    {v.cta}
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
