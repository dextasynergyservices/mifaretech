import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Mifaretech POS Solutions",
  description:
    "How Mifaretech handles and protects business data, quotation requests, and commercial confidentiality.",
};

export default function PrivacyPage() {
  return (
    <div className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full mb-6">
          Legal & Compliance
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-sans mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm font-mono text-muted-foreground mb-12">
          Effective Date: January 1, 2026 • Last updated: March 2026
        </p>

        <div className="prose dark:prose-invert max-w-none space-y-8 text-foreground/80 leading-relaxed font-sans text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Scope & Application</h2>
            <p>
              Mifaretech POS Solutions (&quot;Mifaretech&quot;, &quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;) is committed to respecting your privacy and protecting the commercial
              and personal data submitted through our hardware consultation platform. This policy
              governs how we collect, store, and process information from corporate clients,
              independent merchants, and system integrators.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Data We Collect</h2>
            <p>
              Because we operate strictly as a B2B hardware consultancy and deployment platform, we
              do not store consumer payment card information or consumer transactional records. We
              collect only information provided during consultation and quotation workflows:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Commercial contact information (Name, Business Email, Direct Telephone, Job Title).
              </li>
              <li>
                Company details (Trading Name, Registered Address, VAT/Tax ID, Operating Sector).
              </li>
              <li>
                Technical requirements (Fleet sizing, integration architecture, peripheral
                specifications).
              </li>
              <li>
                Communication history and quotation references generated via our enquiry engine.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              3. How We Use Business Information
            </h2>
            <p>We process data solely for legitimate business purposes:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Preparing accurate technical specifications and wholesale hardware quotes.</li>
              <li>
                Arranging hardware sandbox demonstrations, trial units, and engineer briefings.
              </li>
              <li>Facilitating warranty registrations and firmware maintenance dispatches.</li>
              <li>Complying with statutory audit, tax, and anti-fraud regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              4. Non-Disclosure & Third Parties
            </h2>
            <p>
              We do not sell, rent, or monetize your commercial data. Project briefs and terminal
              configurations are shared only with certified manufacturer logistics partners (such as
              Sunmi, Castles, Verifone, or Pax) strictly as required to fulfill device staging and
              direct manufacturer warranties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              5. Data Retention & Your Rights
            </h2>
            <p>
              In accordance with UK GDPR and global enterprise privacy standards, you maintain the
              right to inspect, rectify, or request the deletion of your corporate contact records
              at any time. Inactive quotation requests without contractual execution are archived
              after 24 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              6. Contact Our Compliance Office
            </h2>
            <p>
              For data protection inquiries or to exercise your subject access rights, contact our
              Data Governance Team directly at{" "}
              <a
                href="mailto:privacy@mifaretech.com"
                className="text-brand-orange hover:underline font-mono"
              >
                privacy@mifaretech.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
