import type { Metadata } from "next";
import { EcosystemBlock } from "@/components/ecosystems/EcosystemBlock";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  REAL_ESTATE_BLOCK,
  CONSTRUCTION_BLOCK,
  AGENCY_BLOCK,
  SITE,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Industry Ecosystems",
  description:
    "Purpose-built automation engines for Canadian Real Estate, Construction, and High-Scale Agency operations that can't afford downtime.",
  alternates: { canonical: "/ecosystems" },
};

/**
 * Ecosystems page — blueprint Section 7. Three vertical blocks, each with
 * VERBATIM body copy (sourced in src/lib/content.ts) + animated wireframe.
 */
export default function EcosystemsPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: { "@type": "Organization", name: SITE.name },
    serviceType: "Workflow Automation",
    areaServed: "CA",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Vertical Automation Engines",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Real Estate Automation",
            description: REAL_ESTATE_BLOCK.body,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Construction Automation",
            description: CONSTRUCTION_BLOCK.body,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Agency Automation",
            description: AGENCY_BLOCK.body,
          },
        },
      ],
    },
  };

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-content">
          <SectionHeading
            eyebrow="Industry Ecosystems"
            title="Specialized Vertical Ecosystems"
            subtitle="Purpose-built automation engines for Canadian industries that can't afford downtime."
          />
        </div>
      </section>

      <EcosystemBlock
        id="real-estate"
        eyebrow="Real Estate Networks"
        body={REAL_ESTATE_BLOCK.body}
        features={REAL_ESTATE_BLOCK.features}
        workflowSteps={[
          "Realtor.ca",
          "Lead Parse",
          "CRM Push",
          "SMS Calendly",
          "Agent Assign",
        ]}
        ctaLabel="Schedule Real Estate Audit"
      />

      <EcosystemBlock
        id="construction"
        eyebrow="Construction & Contracting"
        body={CONSTRUCTION_BLOCK.body}
        features={CONSTRUCTION_BLOCK.features}
        workflowSteps={[
          "PDF Estimate",
          "IDP Parse",
          "Cost-Code Map",
          "QuickBooks Sync",
          "Overrun Alert",
        ]}
        ctaLabel="Schedule Construction Audit"
        reverse
      />

      <EcosystemBlock
        id="agencies"
        eyebrow="Digital & Creative Agencies"
        body={AGENCY_BLOCK.body}
        features={AGENCY_BLOCK.features}
        workflowSteps={[
          "Contract Signed",
          "Slack Spawn",
          "Drive Mapping",
          "ClickUp Template",
          "Onboard Complete",
        ]}
        ctaLabel="Schedule Agency Audit"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
    </>
  );
}
