import { FAQ_ITEMS } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/homepage/FaqAccordion";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";

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
    <section id="faq" className="section-pad relative scroll-mt-20 overflow-hidden">
      {/* Atmospheric imagery layer (Phase 3 §4.4) — graded robotic components */}
      <ParallaxLayer speed={-0.08} className="absolute inset-0">
        <img
          src="/sections/atmosphere-graded.webp"
          alt=""
          aria-hidden
          loading="lazy"
          className="section-media pointer-events-none absolute inset-0 h-full w-full scale-110"
        />
      </ParallaxLayer>
      <div className="section-scrim absolute inset-0" aria-hidden />
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
