import type { Metadata } from "next";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms governing use of ${SITE.domain}.`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

/**
 * Terms of Service — baseline terms for a Canadian B2B services marketing site.
 * [BASELINE — drafted to match a pre-contractual marketing/agency context. Review
 *   with legal counsel before relying on it; adjust to match your engagement terms.]
 */
const LAST_UPDATED = "June 28, 2026";

export default function TermsPage() {
  return (
    <section className="pt-32 pb-24 md:pt-40">
      <div className="container-content">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-teal-500" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-teal-400">
              Legal
            </span>
          </div>
          <h1 className="text-display mt-5 text-white text-[clamp(2rem,4vw,3rem)]">
            Terms of Service
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-slate-400">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="prose-narrow mt-10 space-y-8 text-slate-300">
            <section>
              <h2 className="font-display text-xl font-bold text-white">1. Acceptance of terms</h2>
              <p className="mt-3 leading-relaxed">
                By accessing {SITE.domain}, you agree to these terms. If you do not agree, please do
                not use the site.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white">2. Use of the site</h2>
              <p className="mt-3 leading-relaxed">
                This site provides information about {SITE.name}&rsquo;s services and lets you request
                a diagnostic call or estimate. You agree not to misuse the site — for example, by
                attempting to disrupt it, submit fraudulent information, or access data you are not
                authorized to access.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white">3. No guarantee of outcomes</h2>
              <p className="mt-3 leading-relaxed">
                ROI estimates and service descriptions on this site are illustrative. Actual results
                depend on your specific operations, data, and engagement scope. Nothing on this site
                is a binding quote, proposal, or guarantee of results until set out in a signed
                agreement.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white">4. Intellectual property</h2>
              <p className="mt-3 leading-relaxed">
                Site content — copy, design, and branding — is owned by {SITE.name}. You may not
                reproduce it without permission. Third-party trademarks mentioned (e.g. QuickBooks,
                Slack) are property of their respective owners and are referenced for identification
                only.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white">5. Limitation of liability</h2>
              <p className="mt-3 leading-relaxed">
                The site is provided &ldquo;as is.&rdquo; To the maximum extent permitted by law,
                {SITE.name} is not liable for any indirect or consequential damages arising from your
                use of the site.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white">6. Governing law</h2>
              <p className="mt-3 leading-relaxed">
                These terms are governed by the laws of Canada and the province in which{" "}
                {SITE.name} operates, without regard to conflict-of-law principles.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white">7. Contact</h2>
              <p className="mt-3 leading-relaxed">
                Questions about these terms? Email{" "}
                <a href={`mailto:hello@${SITE.domain}`} className="text-teal-300 underline hover:text-teal-200">
                  hello@{SITE.domain}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
