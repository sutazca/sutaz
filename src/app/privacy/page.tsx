import type { Metadata } from "next";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses, and protects your information.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

/**
 * Privacy Policy — grounded in the verified sutaz.ca architecture:
 *  - Lead form (POST /api/leads) stores name/email/company/message in a
 *    self-hosted PostgreSQL database (role sutaz_app, column-level grants).
 *  - ROI calculator (POST /api/roi-calculate) persists an anonymous estimate row.
 *  - Booking uses Calendly (third-party); transition to self-hosted Cal.com is planned.
 *  - No third-party analytics, advertising, or tracking SDKs are loaded.
 *  [BASELINE — drafted to match the actual implementation. Review with legal counsel
 *   before relying on it for compliance; adjust if data practices change.]
 */
const LAST_UPDATED = "June 28, 2026";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-slate-400">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="prose-narrow mt-10 space-y-8 text-slate-300">
            <section>
              <h2 className="font-display text-xl font-bold text-white">1. Who we are</h2>
              <p className="mt-3 leading-relaxed">
                {SITE.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a Canadian workflow-automation
                agency. This policy explains what information we collect on {SITE.domain} and how we
                use it.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white">2. Information we collect</h2>
              <p className="mt-3 leading-relaxed">
                When you submit the contact or audit-request form, we collect the details you choose
                to provide — typically your name, email address, company, and message. When you use
                the ROI calculator, we store an anonymous copy of the estimate inputs and result so
                we can reference it if you follow up. We do not use this form to collect more than is
                necessary to respond to your inquiry.
              </p>
              <p className="mt-3 leading-relaxed">
                We do not load third-party analytics, advertising, or cross-site tracking scripts on
                this site. Our hosting infrastructure logs standard request metadata (IP address,
                timestamps) for security and abuse prevention; these logs are not associated with
                your marketing profile.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white">3. How we use information</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>To respond to your inquiry and schedule a diagnostic call.</li>
                <li>To prepare an audit or proposal based on the details you share.</li>
                <li>To operate, secure, and troubleshoot the site and our infrastructure.</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                We do not sell or rent your information, and we do not use it to send unsolicited
                marketing email.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white">4. Booking &amp; third parties</h2>
              <p className="mt-3 leading-relaxed">
                Scheduling is handled by Calendly, a third party with its own privacy practices. When
                you book a call, the details you enter are processed by Calendly under its terms. We
                encourage you to review Calendly&rsquo;s privacy policy. (We plan to replace this with
                a self-hosted scheduling tool to minimize third-party data sharing.)
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white">5. How we store data</h2>
              <p className="mt-3 leading-relaxed">
                Form submissions are stored in a self-hosted database on infrastructure we control.
                Access is restricted to the application using a least-privilege database role, and the
                site connects over an encrypted connection.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white">6. Your rights</h2>
              <p className="mt-3 leading-relaxed">
                You may request access to, correction of, or deletion of the personal information you
                have given us by emailing{" "}
                <a href={`mailto:hello@${SITE.domain}`} className="text-teal-300 underline hover:text-teal-200">
                  hello@{SITE.domain}
                </a>
                . We will respond within a reasonable timeframe.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-white">7. Changes to this policy</h2>
              <p className="mt-3 leading-relaxed">
                We may update this policy as our practices evolve. Material changes will be reflected
                by updating the &ldquo;Last updated&rdquo; date above.
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
