import { ArrowRight, Award, Building, Globe, ShieldCheck } from "lucide-react";
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
  const values = [
    {
      title: "Authentic Hardware Only",
      desc: "We exclusively distribute verified manufacturer hardware from Fametech and recognized leaders. No refurbished parts disguised as new, no grey-market imports.",
    },
    {
      title: "Counter-Ready Reliability",
      desc: "A broken terminal halts transactions. We test every unit for thermal stability, touch sensitivity, and drop resistance before it reaches your checkout counter.",
    },
    {
      title: "Responsive Accountability",
      desc: "Our clients work with a named hardware specialist. When you need replacement parts or deployment assistance, you speak with experts who know your system.",
    },
    {
      title: "Sustainable Longevity",
      desc: "Industrial-grade components, fanless enclosures, and standard interface ports ensure our terminals remain in active service for years, reducing electronic waste.",
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
                  Empowering commerce
                </span>,
                <span key="2" className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                  with industrial trust.
                </span>,
              ]}
            />
            <Reveal delay={0.2}>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
                Mifaretech System Solutions is an accredited distributor of high-performance POS
                hardware, printers, scanners, and retail automation infrastructure. We bridge global
                engineering with localized enterprise support.
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
              {storyBlock?.title || "From hardware distribution to full counter automation"}
            </h2>
            <div
              className="space-y-4 text-sm text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  storyBlock?.bodyHtml ||
                  `<p>Modern retail and hospitality businesses cannot afford checkout downtime. A slow printer or an unresponsive touch panel frustrates customers and causes lost revenue.</p><p>Mifaretech was established to provide retailers, franchise networks, and enterprise operators with direct, authorized access to certified Fametech POS terminals and automated peripherals, complete with on-the-ground technical training and rapid warranty turnaround.</p><p>Operating with logistics reach across the UK and key African trade corridors, we supply hardware built to withstand intense transaction volumes, power fluctuations, and dust-heavy environments.</p>`,
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
      {partnersList.length > 0 && (
        <section className="border-y border-border py-12 bg-secondary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="editorial-tag text-brand-700 dark:text-brand-300">
                Accreditations
              </span>
              <h3 className="text-2xl font-bold tracking-tight">Direct Manufacturer Backing</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {partnersList.map((partner) => (
                <div
                  key={partner.id}
                  className="p-6 rounded-2xl bg-card border border-border flex flex-col items-center text-center space-y-2"
                >
                  <span className="text-base font-black uppercase tracking-wider text-foreground">
                    {partner.name}
                  </span>
                  <p className="text-xs text-accent-700 dark:text-accent-400 font-bold">
                    {partner.accreditationNote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
