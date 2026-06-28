import { HeroSection } from "@/components/homepage/HeroSection";
import { StatsBand } from "@/components/homepage/StatsBand";
import { ProblemSolution } from "@/components/homepage/ProblemSolution";
import { HowWeBuild } from "@/components/homepage/HowWeBuild";
import { EcosystemPreview } from "@/components/homepage/EcosystemPreview";
import { FAQSection } from "@/components/homepage/FAQSection";
import { FinalCTA } from "@/components/homepage/FinalCTA";
import { SITE } from "@/lib/content";

/**
 * Homepage — blueprint Section 6. The conversion engine.
 * Section order: Hero (50/50 + workflow diagram + ROI calc) → StatsBand →
 * ProblemSolution → HowWeBuild → EcosystemPreview → FAQ → FinalCTA.
 */
export default function HomePage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: `https://${SITE.domain}`,
    description:
      "Custom cloud automation engines and internal tools for Canadian Real Estate, Construction, and High-Scale Agency operations.",
    areaServed: "CA",
    knowsAbout: [
      "Workflow Automation",
      "Intelligent Document Processing",
      "Lead-to-Booking Systems",
      "Client Onboarding Automation",
    ],
  };

  return (
    <>
      <HeroSection />
      <StatsBand />
      <ProblemSolution />
      <HowWeBuild />
      <EcosystemPreview />
      <FAQSection />
      <FinalCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
    </>
  );
}
