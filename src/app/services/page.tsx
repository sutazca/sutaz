import type { Metadata } from "next";
import { ServiceMenu } from "@/components/services/ServiceMenu";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Service Menu",
  description:
    "120+ engineered automation services across 5 Canadian verticals: Real Estate, Construction, Marketing Agencies, E-Commerce, and Professional Services. Filter by category, complexity, and Engineering Moat.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <section className="pt-32 pb-24 md:pt-40">
      <div className="container-content">
        <SectionHeading
          eyebrow="What We Build"
          title="The Service Menu"
          subtitle="120+ engineered services across five verticals. Services flagged as Engineering Moat require real backend engineering — custom AI agents, API builds, database architecture. No-code Zapier agencies cannot build these. That is your competitive separation."
          align="left"
        />
        <div className="mt-12">
          <ServiceMenu />
        </div>
      </div>
    </section>
  );
}
