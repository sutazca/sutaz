import { FAQ_ITEMS } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/homepage/FaqAccordion";

/**
 * FAQSection — blueprint Section 6.5.
 * Renders the accordion + FAQPage JSON-LD for Google rich results.
 *
 * JSON-LD is emitted as a script tag (application/ld+json). Next 16 lets us
 * render this directly in a Server Component.
 */
export function FAQSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="scroll-mt-20 py-20 md:py-24">
      <div className="container-content">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered straight"
          subtitle="The five objections we hear most — and how we engineer around each."
        />

        <div className="mx-auto mt-12 max-w-3xl">
          <FaqAccordion />
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </div>
    </section>
  );
}
