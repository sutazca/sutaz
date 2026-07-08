import type { Metadata } from "next";
import { PhaseTimeline } from "@/components/lab/PhaseTimeline";
import { SandboxDiagram } from "@/components/lab/SandboxDiagram";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "The Engineering Lab",
  description:
    "A deterministic 30-day phased rollout: operational shadowing, isolated sandboxes, background shadow runs, then SOP handoff. Zero risk to your live data.",
  alternates: { canonical: "/lab" },
};

/**
 * Engineering Lab page — blueprint Section 8.
 * Addresses the #1 objection: fear of live data corruption.
 * Phase timeline (verbatim) + sandbox isolation diagram + safety guarantees.
 */
export default function LabPage() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-content">
          <SectionHeading
            as="h1"
            eyebrow="The Engineering Lab"
            title="How We Build. Zero Risk. Guaranteed."
            subtitle="Every workflow is engineered in isolated sandboxes and shadow-tested before it ever touches your production data."
          />
        </div>
      </section>

      {/* Phase timeline */}
      <section className="section-pad">
        <div className="container-content">
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-white">
            The 30-Day Phased Rollout
          </h2>
          <PhaseTimeline />
        </div>
      </section>

      {/* Sandbox isolation */}
      <section className="section-pad">
        <div className="container-content">
          <SectionHeading
            eyebrow="Sandbox Staging Protocol"
            title="Your live data never leaves your control"
            subtitle="All logic is built and tested against mock data. Live channels face zero downtime or exposure until Phase 3 shadow runs prove safety."
            align="left"
          />
          <div className="mt-12">
            <SandboxDiagram />
          </div>
        </div>
      </section>

      {/* Safety guarantees + CTA */}
      <section className="section-pad">
        <div className="container-content">
          <div className="mx-auto max-w-2xl rounded-card glass-card p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-white">
              Production handoff only after it&apos;s proven.
            </h2>
            <p className="mt-3 text-slate-400">
              Clean video standard operating procedures for your managers, and
              30 days of active pipeline monitoring after go-live.
            </p>
            <div className="mt-6">
              <Button href="/contact" size="lg">
                Schedule System Audit
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
