import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Mifaretech POS Solutions",
  description:
    "How Mifaretech handles and protects business data, quotation requests, and commercial confidentiality under UK GDPR and Data Protection regulations.",
};

const PROCESSORS = [
  {
    name: "Neon Inc.",
    purpose: "Cloud database hosting, encrypted storage, and automated point-in-time recovery.",
    location: "EU (Frankfurt, Germany) / US",
    link: "https://neon.tech/privacy-policy",
  },
  {
    name: "Vercel Inc.",
    purpose:
      "Edge application hosting, content delivery network (CDN), and Web Application Firewall (WAF).",
    location: "Global Edge Network / EU / US",
    link: "https://vercel.com/legal/privacy-policy",
  },
  {
    name: "Resend Inc.",
    purpose: "Transactional email delivery for enquiry receipt confirmations and admin alerts.",
    location: "US (Standard Contractual Clauses)",
    link: "https://resend.com/privacy",
  },
  {
    name: "Cloudinary Ltd.",
    purpose:
      "Product imagery and PDF datasheet storage, CDN delivery, and automatic EXIF/GPS metadata stripping.",
    location: "US / Global CDN",
    link: "https://cloudinary.com/privacy",
  },
  {
    name: "Google LLC (Google reCAPTCHA)",
    purpose:
      "Anti-spam verification and automated bot protection on contact and quotation submission endpoints.",
    location: "Global / US",
    link: "https://policies.google.com/privacy",
  },
];

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
          Effective Date: January 1, 2026 • Last updated: March 2026 • Compliant with UK GDPR & DPA
          2018
        </p>

        <div className="prose dark:prose-invert max-w-none space-y-10 text-foreground/80 leading-relaxed font-sans text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Scope & Application</h2>
            <p>
              Mifaretech POS Solutions (&quot;Mifaretech&quot;, &quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;) is committed to respecting your privacy and safeguarding the
              commercial and personal data submitted through our hardware consultation platform.
              This policy governs how we collect, store, and process information from corporate
              clients, independent retail merchants, system integrators, and website visitors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Data We Collect</h2>
            <p>
              Because we operate strictly as a B2B hardware advisory and supply platform, we do not
              process or store consumer payment cardholder records. We collect only information
              voluntarily submitted during enquiry, hardware sizing, or quotation workflows:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Commercial Contact Details:</strong> Full name, corporate email address,
                direct business telephone number, and job title.
              </li>
              <li>
                <strong>Company Profile:</strong> Registered legal name, trading name, operational
                sector, and delivery postcode.
              </li>
              <li>
                <strong>Technical Fleet Requirements:</strong> Target terminal model selections,
                peripheral specifications, estimated fleet sizes, and integration requirements.
              </li>
              <li>
                <strong>System Metadata:</strong> Anonymised / salt-hashed IP addresses and
                user-agent strings recorded strictly for DDoS prevention, rate limiting, and
                security audit logs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              3. Purpose & Legal Basis for Processing
            </h2>
            <p>
              We process commercial data under the following legal bases recognized by the UK GDPR:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Legitimate Interests & Pre-contractual Measures:</strong> Evaluating
                hardware requirements, preparing tailored wholesale quotations, and coordinating
                sandbox trial hardware.
              </li>
              <li>
                <strong>Legal & Regulatory Obligations:</strong> Maintaining statutory accounting,
                VAT, tax records, and anti-fraud audit logs.
              </li>
              <li>
                <strong>Consent:</strong> Explicit opt-in provided when submitting contact enquiries
                or configuring optional analytics / security cookies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              4. Named Data Processors & Sub-Processors
            </h2>
            <p>
              To deliver a secure, high-availability platform, we engage reputable third-party
              infrastructure providers. Each processor is bound by data processing agreements
              requiring strict security safeguards:
            </p>
            <div className="grid grid-cols-1 gap-4 mt-4 not-prose">
              {PROCESSORS.map((p) => (
                <div key={p.name} className="p-4 rounded-xl border border-border bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                    <h3 className="font-semibold text-foreground text-sm">{p.name}</h3>
                    <span className="text-xs font-mono text-muted-foreground">{p.location}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal mb-2">{p.purpose}</p>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-brand-orange hover:underline inline-flex items-center gap-1"
                  >
                    View Privacy Commitment &rarr;
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              5. Automated Data Retention & Erasure
            </h2>
            <p>
              In compliance with data minimisation principles, we maintain automated background
              retention schedules:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Commercial Enquiries:</strong> Archived and personal contact identifiers
                anonymised after 24 months of commercial inactivity.
              </li>
              <li>
                <strong>Spam & Flagged Enquiries:</strong> Permanently deleted after 30 days.
              </li>
              <li>
                <strong>Administrative Audit Trail:</strong> Immutable security logs pruned
                automatically after 12 months.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              6. Your Statutory Rights (UK GDPR)
            </h2>
            <p>
              As a data subject, you have the right to request access to the personal data we hold
              about you, request rectification of inaccurate records, request erasure (&quot;right
              to be forgotten&quot;), or object to processing. To exercise any of these rights,
              contact our Data Governance Officer at{" "}
              <a
                href="mailto:privacy@mifaretech.co.uk"
                className="text-brand-orange hover:underline font-mono"
              >
                privacy@mifaretech.co.uk
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
