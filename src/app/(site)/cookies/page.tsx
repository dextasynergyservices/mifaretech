import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Mifaretech POS Solutions",
  description:
    "Information on how Mifaretech uses essential storage, security verification, and performance measurement on our platform.",
};

const COOKIE_CATEGORIES = [
  {
    category: "Strictly Essential (Required)",
    description:
      "These technologies are necessary for the website to function properly and cannot be deactivated in our systems. They do not store any personally identifiable information.",
    items: [
      {
        name: "mft_enquiry_basket",
        type: "localStorage",
        duration: "Persistent",
        purpose: "Maintains selected POS hardware and enquiry items as you browse the catalogue.",
      },
      {
        name: "theme",
        type: "Cookie / localStorage",
        duration: "Persistent",
        purpose: "Remembers light, dark, or system appearance preferences.",
      },
      {
        name: "better-auth.session_token",
        type: "HTTP-only Cookie",
        duration: "Session / 7 Days",
        purpose: "Protects authenticated staff access to the admin dashboard.",
      },
      {
        name: "mft_cookie_consent",
        type: "localStorage",
        duration: "12 Months",
        purpose: "Records your consent choices for security and analytics cookies.",
      },
    ],
  },
  {
    category: "Security & Fraud Prevention",
    description:
      "Used to distinguish between human visitors and automated bots, protecting our contact and quotation endpoints against abuse and DDoS attacks.",
    items: [
      {
        name: "_GRECAPTCHA / rc::*",
        type: "Third-party Cookie",
        duration: "6 Months",
        purpose: "Google reCAPTCHA v3 risk assessment token to prevent automated spam.",
      },
    ],
  },
  {
    category: "Performance & Diagnostics",
    description:
      "Helps us measure core web vitals and real-user response times to optimize platform responsiveness across device tiers.",
    items: [
      {
        name: "_va / _vitals",
        type: "Telemetry API",
        duration: "Session",
        purpose: "Anonymised performance metrics aggregated via Vercel Speed Insights.",
      },
    ],
  },
];

export default function CookiesPage() {
  return (
    <div className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full mb-6">
          Legal & Compliance
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-sans mb-4">
          Cookie Policy
        </h1>
        <p className="text-sm font-mono text-muted-foreground mb-12">
          Effective Date: January 1, 2026 • Last updated: March 2026
        </p>

        <div className="prose dark:prose-invert max-w-none space-y-10 text-foreground/80 leading-relaxed font-sans text-sm md:text-base">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Overview</h2>
            <p>
              Mifaretech POS Solutions utilizes first-party browser storage (such as{" "}
              <code>localStorage</code>) and minimal third-party cookies strictly to provide core
              quotation features, maintain security integrity, and measure platform latency. We do
              not utilize invasive behavioral ad-tracking or cross-domain user profiling.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              2. Technologies & Classification
            </h2>
            <div className="space-y-6 not-prose mt-4">
              {COOKIE_CATEGORIES.map((cat) => (
                <div key={cat.category} className="p-5 rounded-2xl bg-card border border-border">
                  <h3 className="font-bold text-foreground text-base mb-1">{cat.category}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{cat.description}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border/60 text-muted-foreground">
                          <th className="pb-2 font-semibold">Identifier</th>
                          <th className="pb-2 font-semibold">Storage Type</th>
                          <th className="pb-2 font-semibold">Lifespan</th>
                          <th className="pb-2 font-semibold">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                        {cat.items.map((item) => (
                          <tr key={item.name}>
                            <td className="py-2 font-semibold text-foreground">{item.name}</td>
                            <td className="py-2 text-muted-foreground">{item.type}</td>
                            <td className="py-2 text-muted-foreground">{item.duration}</td>
                            <td className="py-2 font-sans text-xs text-foreground/80">
                              {item.purpose}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Managing Your Preferences</h2>
            <p>
              When you first visit our platform, an interactive cookie consent banner allows you to
              choose whether to enable optional security verification (reCAPTCHA) and performance
              telemetry. You can clear your stored choices at any time by clearing your
              browser&apos;s local storage or cookies for <code>mifaretech.co.uk</code>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Enquiries & Governance</h2>
            <p>
              For further questions regarding our cookie implementation or data protection
              practices, please reach out to our privacy team:
            </p>
            <div className="mt-2 text-xs font-mono text-muted-foreground space-y-1">
              <p>Mifaretech POS Solutions — Compliance Office</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:privacy@mifaretech.co.uk"
                  className="text-brand-orange hover:underline"
                >
                  privacy@mifaretech.co.uk
                </a>
              </p>
              <p>Telephone: +44 7448 670925</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
