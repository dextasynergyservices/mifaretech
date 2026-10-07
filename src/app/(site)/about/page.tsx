import {
  ArrowRight,
  Award,
  Building,
  CheckCircle2,
  ExternalLink,
  Globe,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, SplitLines } from "@/components/motion/reveal";
import { getContentBlocks, getPageSeo, getPartners, getSettings } from "@/server/queries";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("about");
  return {
    title: seo?.title || "About Us | Mifaretech",
    description:
      seo?.description ||
      "Accredited distributor bridge connecting direct Fametech hardware engineering with enterprise retail operators.",
  };
}

export default async function AboutPage() {
  const [content, partnersList, contactSettings] = await Promise.all([
    getContentBlocks("about"),
    getPartners(),
    getSettings("contact"),
  ]);

  const storyBlock = content.byKey.story;
  const valuesFromDb = (
    content.byKey.values?.data as { values?: { title: string; desc: string }[] }
  )?.values;
  const values =
    valuesFromDb && valuesFromDb.length > 0
      ? valuesFromDb
      : [
          {
            title: "Innovation",
            desc: "We explore practical applications of emerging and established technologies to address real business needs.",
          },
          {
            title: "Reliability",
            desc: "We focus on suitable products, careful implementation, and responsive technical support.",
          },
          {
            title: "Integrity",
            desc: "We build lasting relationships through honest communication, clear expectations, and responsible service delivery.",
          },
          {
            title: "Customer Focus",
            desc: "We listen to our customers, understand their requirements, and recommend solutions appropriate to their operational needs.",
          },
          {
            title: "Security & Responsibility",
            desc: "We support customers in selecting and implementing technologies that protect premises, assets, people, and business operations.",
          },
          {
            title: "Continuous Improvement",
            desc: "We continuously improve our services, technical knowledge, and solutions as customer requirements and technologies evolve.",
          },
        ];

  const phones = (contactSettings?.phones as string[]) || ["+44 7448 670925"];
  const emails = (contactSettings?.emails as string[]) || ["sales@mifaretech.co.uk"];

  return (
    <div className="flex flex-col gap-24 sm:gap-32 pb-20 overflow-x-hidden">
      {/* 1. Header & Headline */}
      <section className="pt-12 sm:pt-20 lg:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="editorial-badge">About Mifaretech</span>
            <SplitLines
              lines={[
                <span key="1" className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                  Smart Technology.
                </span>,
                <span
                  key="2"
                  className="text-4xl sm:text-6xl font-extrabold tracking-tight text-brand-700 dark:text-brand-300"
                >
                  Secure Operations.
                </span>,
              ]}
            />
            <Reveal delay={0.2}>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
                Mifaretech System Solutions is a smart technology solutions company focused on the
                supply, implementation, and integration of technology systems that help businesses
                and institutions operate more efficiently, securely, and intelligently.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. Story & Accreditation Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="editorial-tag text-brand-700 dark:text-brand-300">
              Our Heritage &amp; Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {storyBlock?.title || "Smart Technology. Practical Solutions. Long-term Partnership."}
            </h2>
            <div
              className="space-y-4 text-sm text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  storyBlock?.bodyHtml ||
                  `<p><strong>Mifaretech System Solutions</strong>, widely known as <strong>Mifaretech</strong>, is a UK-based technology company specialising in RFID, MIFARE access control, commercial Point-of-Sale hardware, and enterprise software integrations. Since 2019, we have been delivering reliable, scalable systems to organisations across the United Kingdom and internationally.</p><p>With a growing team of experienced engineers and consultants, we combine deep domain expertise in MIFARE and RFID contactless technology with high-quality POS hardware and enterprise software. We act as reseller, system integrator, installer, and programmer — giving our clients a true end-to-end technology partner.</p><p>Whether you need secure door access, electronic hotel locks, a complete POS counter environment, or seamless integration connecting room locks with OPERA PMS and Micros POS, Mifaretech delivers practical, future-proof solutions backed by ongoing support.</p>`,
              }}
            />

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center gap-3">
                <ShieldCheck className="size-6 text-brand-700 dark:text-brand-300" />
                <div>
                  <p className="text-xs font-bold">100% Genuine Units</p>
                  <p className="text-[11px] text-muted-foreground">Certified Serial Tracking</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center gap-3">
                <Award className="size-6 text-accent" />
                <div>
                  <p className="text-xs font-bold">Accredited Partner</p>
                  <p className="text-[11px] text-muted-foreground">Direct Manufacturer Warranty</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-4/3 rounded-3xl bg-secondary/30 border border-border p-8 flex items-center justify-center overflow-hidden">
              <div className="relative size-60 sm:size-72">
                <Image
                  src="/logo.png"
                  alt="Mifaretech System Solutions"
                  fill
                  sizes="(max-width: 640px) 240px, 288px"
                  className="object-contain"
                  priority
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Partners & Accreditations */}
      <section className="border-y border-border py-16 sm:py-24 bg-secondary/15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
              <span className="editorial-badge">Accreditations &amp; Standards</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
                Direct Manufacturer Backing.
                <br />
                <span className="text-brand-700 dark:text-brand-400">
                  Certified Distribution Authority.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                We maintain direct authorized distribution relationships and technology
                certifications with original hardware manufacturers and RFID developers. Every unit
                is backed by genuine factory warranties, serial traceability, and direct technical
                escalation.
              </p>
            </div>
          </Reveal>

          {/* Partner & Accreditation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(partnersList.length > 0
              ? partnersList
              : [
                  {
                    id: "p1",
                    name: "Fametech (TYSSO)",
                    accreditationNote: "Authorised Global Hardware Manufacturer",
                    websiteUrl: "https://www.fametech.com.tw",
                    logoUrl: null,
                  },
                  {
                    id: "p2",
                    name: "MIFARE / NXP",
                    accreditationNote: "Genuine Contactless RFID & Smart Media Partner",
                    websiteUrl: "https://www.mifare.net",
                    logoUrl: null,
                  },
                  {
                    id: "p3",
                    name: "Oracle Hospitality",
                    accreditationNote: "OPERA PMS & Micros POS Integration Ecosystem",
                    websiteUrl: "https://www.oracle.com/hospitality",
                    logoUrl: null,
                  },
                  {
                    id: "p4",
                    name: "Intel IoT Solutions",
                    accreditationNote: "Embedded Processing & Motherboard Partner",
                    websiteUrl: null,
                    logoUrl: null,
                  },
                  {
                    id: "p5",
                    name: "Microsoft Windows IoT",
                    accreditationNote: "Certified OS & Runtime Architecture",
                    websiteUrl: null,
                    logoUrl: null,
                  },
                ]
            ).map((partner, idx) => {
              const logoUrl =
                "logoUrl" in partner ? (partner as { logoUrl?: string | null }).logoUrl : null;
              const websiteUrl =
                "websiteUrl" in partner
                  ? (partner as { websiteUrl?: string | null }).websiteUrl
                  : null;

              return (
                <Reveal key={partner.id} delay={idx * 0.08}>
                  <div className="h-full p-6 sm:p-7 rounded-3xl bg-card border border-border hover:border-brand-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                    <div className="space-y-5">
                      {/* Top Header: Logo / Badge Box + Verified Tag */}
                      <div className="flex items-start justify-between gap-4">
                        {logoUrl ? (
                          <div className="relative h-12 w-32 shrink-0 bg-secondary/30 rounded-xl p-2 border border-border/60">
                            <Image
                              src={logoUrl}
                              alt={partner.name}
                              fill
                              sizes="128px"
                              className="object-contain p-1"
                            />
                          </div>
                        ) : (
                          <div className="size-12 rounded-2xl bg-brand-50 dark:bg-brand-950/80 border border-brand-200/80 dark:border-brand-800/80 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-brand-500/60 transition-all">
                            <Award className="size-6 text-brand-600 dark:text-brand-400" />
                          </div>
                        )}

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 shrink-0">
                          <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                          Certified
                        </span>
                      </div>

                      {/* Partner Name & Accreditation Note */}
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-black tracking-tight text-foreground group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                          {partner.name}
                        </h3>
                        <p className="text-xs font-bold text-accent-700 dark:text-accent-400">
                          {partner.accreditationNote}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Features & Action */}
                    <div className="pt-5 mt-6 border-t border-border/70 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                        <span>Factory Serial Traceability</span>
                      </div>

                      {websiteUrl && (
                        <a
                          href={websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-foreground/80 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                          title={`Visit ${partner.name}`}
                        >
                          Official Site
                          <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Accreditations Trust Guarantees Bar */}
          <Reveal delay={0.25}>
            <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="space-y-2 md:pr-6 pt-4 md:pt-0">
                  <div className="flex items-center gap-2 text-foreground font-black text-sm uppercase tracking-wide">
                    <CheckCircle2 className="size-4 text-brand-600 dark:text-brand-400 shrink-0" />
                    <span>Direct Factory Supply Chain</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Zero unverified third-party brokers. Every hardware shipment and RFID card batch
                    is procured directly from original certified manufacturing lines.
                  </p>
                </div>

                <div className="space-y-2 md:px-6 pt-4 md:pt-0">
                  <div className="flex items-center gap-2 text-foreground font-black text-sm uppercase tracking-wide">
                    <CheckCircle2 className="size-4 text-brand-600 dark:text-brand-400 shrink-0" />
                    <span>OEM Spares &amp; RMA Engineering</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Access to original factory spare components, firmware updates, printer head
                    replacements, and direct manufacturer technical escalation paths.
                  </p>
                </div>

                <div className="space-y-2 md:pl-6 pt-4 md:pt-0">
                  <div className="flex items-center gap-2 text-foreground font-black text-sm uppercase tracking-wide">
                    <CheckCircle2 className="size-4 text-brand-600 dark:text-brand-400 shrink-0" />
                    <span>Tested Ecosystem Compliance</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Verified interoperability with Oracle Hospitality (OPERA PMS, Micros POS),
                    standard Windows IoT runtimes, and industry-standard RFID door locking
                    mechanisms.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Leadership & Technical Bench */}
      <section className="bg-secondary/30 py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="editorial-tag text-brand-700 dark:text-brand-300">
              Leadership &amp; Technical Bench
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
              Experienced POS professionals
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Every hardware rollout is overseen by engineers who understand retail logistics and
              counter workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6 group">
              <div className="flex items-center gap-4">
                <div className="relative size-20 rounded-2xl bg-brand-50 dark:bg-brand-900/60 border border-border overflow-hidden shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Director"
                    fill
                    sizes="80px"
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Operations &amp; Distribution Lead</h3>
                  <p className="editorial-tag text-accent-700 dark:text-accent-400">
                    Technical Procurement
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                &ldquo;We don&apos;t just sell boxes. We ensure each terminal and printer is
                properly suited for the customer&apos;s environment, with the right memory, thermal
                capacity, and peripheral ports for seamless daily operation.&rdquo;
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6 group">
              <div className="flex items-center gap-4">
                <div className="relative size-20 rounded-2xl bg-accent-50 dark:bg-accent-900/40 border border-border overflow-hidden shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Hardware Specialist"
                    fill
                    sizes="80px"
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Client Success &amp; Support</h3>
                  <p className="editorial-tag text-brand-700 dark:text-brand-300">
                    Hardware Integration
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                &ldquo;Our named enquiry support means clients always have a direct point of
                contact. When a checkout lane needs a new cutter or scanner cable, our dispatch is
                swift and precise.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Values Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="editorial-tag text-brand-700 dark:text-brand-300">
            Operating Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
            Our non-negotiable commitments
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((val, idx) => (
            <div key={val.title} className="p-6 rounded-3xl bg-card border border-border space-y-3">
              <span
                aria-hidden="true"
                role="presentation"
                className="text-3xl font-black text-brand-700/80 dark:text-brand-400/80 select-none"
              >
                0{idx + 1}
              </span>
              <h3 className="text-base font-bold tracking-tight">{val.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Locations & Contact Link */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <Building className="size-6 text-brand-700 dark:text-brand-300" />
            <h3 className="text-base font-bold">UK Operations</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mifaretech System Solutions
              <br />
              Registration &amp; Procurement Hub
              <br />
              {emails[0]}
              <br />
              {phones[0]}
            </p>
          </div>

          <div className="space-y-2">
            <Globe className="size-6 text-accent" />
            <h3 className="text-base font-bold">West Africa Distribution</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Direct retail channel hubs
              <br />
              Authorized technical partner network
              <br />
              Express parts fulfillment
            </p>
          </div>

          <div className="flex flex-col justify-center items-start md:items-end">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-black text-xs uppercase tracking-wider transition-all"
            >
              <span>Get in Touch</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
