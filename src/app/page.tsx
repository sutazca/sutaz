import { HeroSection } from "@/components/homepage/HeroSection";
import { ProblemSolution } from "@/components/homepage/ProblemSolution";
import { EcosystemPreview } from "@/components/homepage/EcosystemPreview";
import { FAQSection } from "@/components/homepage/FAQSection";
import { SITE } from "@/lib/content";

/**
 * Homepage — blueprint Section 6. The conversion engine.
 * Sections: Hero (50/50 + ROI calc) → ProblemSolution → EcosystemPreview → FAQ.
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
      <ProblemSolution />
      <EcosystemPreview />
      <FAQSection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
    </>
  );
}
