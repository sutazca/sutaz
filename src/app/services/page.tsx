import type { Metadata } from "next";
import { ServiceMenu } from "@/components/services/ServiceMenu";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TOTAL_SERVICES, TOTAL_MOAT } from "@/lib/service-catalog";

export const metadata: Metadata = {
  title: "Service Menu",
  description: `${TOTAL_SERVICES} engineered automation services across 5 Canadian verticals: Real Estate, Construction, Marketing Agencies, E-Commerce, and Professional Services. Filter by category, complexity, and Engineering Moat.`,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <section className="pt-32 pb-24 md:pt-40">
      <div className="container-content">
        <SectionHeading
          as="h1"
          eyebrow="What We Build"
          title="The Service Menu"
          subtitle={`${TOTAL_SERVICES} engineered services across five verticals — ${TOTAL_MOAT} of them flagged Engineering Moat. Moat services require real backend engineering: custom AI agents, API builds, database architecture. No-code Zapier agencies cannot build these. That is your competitive separation.`}
          align="left"
        />
        <div className="mt-12">
          <ServiceMenu />
        </div>
      </div>
    </section>
  );
}
