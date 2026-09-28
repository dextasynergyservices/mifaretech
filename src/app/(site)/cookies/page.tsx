import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Mifaretech POS Solutions",
  description:
    "Information on how Mifaretech uses essential cookies and local browser storage for enquiry baskets and accessibility.",
};

export default function CookiesPage() {
  return (
    <div className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full mb-6">
          Legal &amp; Compliance
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-sans mb-4">
          Cookie Policy
        </h1>
        <p className="text-sm font-mono text-muted-foreground mb-12">
          Effective Date: January 1, 2026 • Last updated: March 2026
        </p>

        <div className="prose dark:prose-invert max-w-none space-y-8 text-foreground/80 leading-relaxed font-sans text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Overview</h2>
            <p>
              Mifaretech System Solutions uses essential cookies and client browser storage (such as{" "}
              <code>localStorage</code>) strictly to deliver essential functionality, maintain your
              enquiry basket between page visits, and respect your accessibility preferences (such
              as dark mode or reduced motion). We do not deploy invasive third-party cross-site
              tracking cookies or sell behavioral profile records.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              2. Essential Technologies Used
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="font-bold text-foreground">Enquiry Basket (localStorage)</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Stores your selected hardware models and requested quantities locally on your
                  device so you can continue exploring the catalogue without losing your quotation
                  list.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="font-bold text-foreground">Theme &amp; Accessibility Preferences</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Remembers your light/dark mode selection and motion-reduction preference to ensure
                  a comfortable visual experience on every visit.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="font-bold text-foreground">Security &amp; Session Tokens</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Cryptographically secure, HTTP-only session cookies used strictly to protect
                  authenticated staff accounts accessing the administration console.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              3. Managing Your Browser Storage
            </h2>
            <p>
              You can clear cookies and local browser storage at any time through your browser
              settings. Please note that clearing local storage will reset your enquiry basket and
              restore default visual display preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Contact Our Privacy Team</h2>
            <p>
              If you have any questions regarding our storage practices or privacy compliance,
              please contact:
            </p>
            <div className="mt-2 text-xs font-mono text-muted-foreground space-y-1">
              <p>Mifaretech System Solutions — Data Governance</p>
              <p>Email: privacy@mifaretech.co.uk</p>
              <p>Telephone: +44 7448 670925</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
