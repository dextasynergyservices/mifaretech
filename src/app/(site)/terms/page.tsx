import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Mifaretech POS Solutions",
  description:
    "Commercial terms, quotation validity, hardware warranty, and service conditions for Mifaretech clients.",
};

export default function TermsPage() {
  return (
    <div className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full mb-6">
          Commercial Terms
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-sans mb-4">
          Terms of Service
        </h1>
        <p className="text-sm font-mono text-muted-foreground mb-12">
          Effective Date: January 1, 2026 • Last updated: March 2026
        </p>

        <div className="prose dark:prose-invert max-w-none space-y-8 text-foreground/80 leading-relaxed font-sans text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Nature of the Service</h2>
            <p>
              Mifaretech provides wholesale point-of-sale hardware advisory, procurement, terminal
              staging, and enterprise deployment services. This website is an informational
              catalogue and quotation engine; submitting an enquiry does not constitute a binding
              purchase contract until a formal Statement of Work (SOW) or commercial invoice is
              executed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              2. Quotation Validity & Pricing
            </h2>
            <p>
              Because wholesale terminal pricing fluctuates based on manufacturer component
              availability, currency exchange, and order volume, quotes generated through our
              advisory team remain valid for 30 calendar days from issuance unless otherwise noted
              in writing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              3. Hardware Warranties & Staging
            </h2>
            <p>
              All hardware supplied by Mifaretech includes direct manufacturer warranties (minimum
              12 to 36 months, depending on terminal model and tier). Advanced replacement options
              and overnight swap services are governed by bespoke Service Level Agreements (SLAs)
              agreed upon during deployment contracting.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Intellectual Property</h2>
            <p>
              All brand names, trademarks, logos, and technical specifications of third-party
              hardware manufacturers (including Sunmi, Castles, Verifone, and Pax) displayed on this
              platform are the property of their respective owners and are used solely for
              informational compatibility and accredited partnership representation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Governing Law</h2>
            <p>
              These terms and any commercial engagements resulting from the use of this website
              shall be governed by and construed in accordance with the laws of the United Kingdom,
              and the courts of England and Wales shall have exclusive jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Inquiries</h2>
            <p>
              For legal or commercial inquiries regarding our terms, please contact{" "}
              <a
                href="mailto:legal@mifaretech.com"
                className="text-brand-orange hover:underline font-mono"
              >
                legal@mifaretech.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
