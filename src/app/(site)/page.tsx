import { ArrowRight, CheckCircle2, Headphones, ShieldCheck, Star, Wrench } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { CompareToggleButton } from "@/components/site/compare-toggle-button";
import { EnquireButton } from "@/components/site/enquire-button";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { PosAdvisorQuiz } from "@/components/site/pos-advisor-quiz";
import {
  getContentBlocks,
  getFaqs,
  getFeaturedProducts,
  getPageSeo,
  getPartners,
  getTestimonials,
} from "@/server/queries";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("home");
  return {
    title: seo?.title || "Mifaretech | ...lean forward smartly!",
    description:
      seo?.description ||
      "Accredited distributor of high-performance POS touch terminals, thermal receipt printers, and barcode scanners.",
  };
}

export default async function HomePage() {
  const [content, featuredProducts, partnersList, testimonialsList, faqsList] = await Promise.all([
    getContentBlocks("home"),
    getFeaturedProducts(6),
    getPartners(),
    getTestimonials(),
    getFaqs(),
  ]);

  const heroBlock = content.byKey.hero;
  const whyBlock = content.byKey["why-mifaretech"];
  const whyPillars = (
    whyBlock?.data as { pillars?: Array<{ number: string; title: string; desc: string }> }
  )?.pillars || [
    {
      number: "01",
      title: "Direct Factory Provenance",
      desc: "Zero grey-market risk. All hardware originates directly from Fametech assembly lines with sealed warranties.",
    },
    {
      number: "02",
      title: "Counter Uptime Engineering",
      desc: "Commercial fanless aluminum housings protect internal components from dust, grease, and continuous vibration.",
    },
    {
      number: "03",
      title: "Dedicated Hardware Specialists",
      desc: "Direct access to specialists who understand interface drivers, OPOS configurations, and multi-terminal deployments.",
    },
  ];

  const DEFAULT_HERO_TILES = [
    {
      id: "tile-1",
      title: "Mobile POS",
      tag: "Mobile",
      subtag: "M-POS",
      href: "/catalogue/compact-mobile-pos-terminal",
      mediaUrl: "/logo.png",
      rotateClass: "rotate-[-1.5deg] hover:rotate-0",
    },
    {
      id: "tile-2",
      title: "Touch Terminal",
      tag: "POS",
      subtag: "1000",
      href: "/catalogue/fametech-pos-1000",
      mediaUrl: "/logo.png",
      rotateClass: "rotate-[1deg] hover:rotate-0",
    },
    {
      id: "tile-3",
      title: "Omni Scanner",
      tag: "Omni",
      subtag: "CS-900",
      href: "/catalogue/omnidirectional-countertop-scanner",
      mediaUrl: "/logo.png",
      rotateClass: "rotate-[1.5deg] hover:rotate-0",
    },
    {
      id: "tile-4",
      title: "Receipt Printer",
      tag: "Print",
      subtag: "300",
      href: "/catalogue/heavy-duty-thermal-receipt-printer",
      mediaUrl: "/logo.png",
      rotateClass: "rotate-[-1deg] hover:rotate-0",
    },
    {
      id: "tile-5",
      title: "Receipt Printer",
      tag: "Print",
      subtag: "300",
      href: "/catalogue/heavy-duty-thermal-receipt-printer",
      mediaUrl: "/logo.png",
      rotateClass: "rotate-[-1deg] hover:rotate-0",
    },
    {
      id: "tile-6",
      title: "Cash Drawer",
      tag: "Safe",
      subtag: "RJ11",
      href: "/catalogue/heavy-duty-steel-cash-drawer",
      mediaUrl: "/logo.png",
      rotateClass: "rotate-[1deg] hover:rotate-0",
    },
    {
      id: "tile-7",
      title: "Interactive Kiosk",
      tag: "Kiosk",
      subtag: '21.5"',
      href: "/catalogue/interactive-self-service-kiosk",
      mediaUrl: "/logo.png",
      rotateClass: "rotate-[-1.5deg] hover:rotate-0",
    },
    {
      id: "tile-8",
      title: "Customer Display",
      tag: "Pole",
      subtag: "VFD",
      href: "/catalogue?category=pos-terminals",
      mediaUrl: "/logo.png",
      rotateClass: "rotate-[1.5deg] hover:rotate-0",
    },
  ];

  const configuredTiles = (
    heroBlock?.data as {
      heroTiles?: Array<{
        mediaId?: string | null;
        mediaUrl?: string | null;
        title?: string;
        tag?: string;
        subtag?: string;
        href?: string;
      }>;
    }
  )?.heroTiles;

  const heroTiles = DEFAULT_HERO_TILES.map((defaultTile, idx) => {
    const custom = configuredTiles?.[idx];
    return {
      ...defaultTile,
      title: custom?.title || defaultTile.title,
      tag: custom?.tag || defaultTile.tag,
      subtag: custom?.subtag || defaultTile.subtag,
      href: custom?.href || defaultTile.href,
      mediaUrl: custom?.mediaUrl || defaultTile.mediaUrl,
    };
  });

  return (
    <div className="flex flex-col gap-24 sm:gap-32 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="size-3.5 text-accent" />
                <span>
                  {(heroBlock?.data as { badge?: string })?.badge ||
                    "Accredited Fametech Distributor"}
                </span>
              </div>

              <Reveal delay={0.1}>
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-foreground">
                    {heroBlock?.title || "We engineer hardware for busy counters"}
                  </h1>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-brand-700 dark:text-brand-400">
                    Mifaretech <span className="text-accent font-black">...</span>lean forward
                    smartly!
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div
                  className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl"
                  dangerouslySetInnerHTML={{
                    __html:
                      heroBlock?.bodyHtml ||
                      "<p>Accredited distributor of high-performance POS touch terminals, thermal receipt printers, omnidirectional barcode scanners, and enterprise retail infrastructure. Built for non-stop reliability.</p>",
                  }}
                />
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-black text-xs uppercase tracking-widest shadow-md transition-all active:scale-98"
                  >
                    <span>Request a Quote</span>
                    <ArrowRight className="size-4" />
                  </Link>

                  <Link
                    href="/catalogue"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-border bg-card hover:bg-secondary/60 text-foreground font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    <span>Browse Catalogue</span>
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span>Zero Grey-Market Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span>Manufacturer Backed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span>Full I/O Peripherals</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Column: Noho-Style Scattered Hardware Tiles (Up to 6 Images) */}
            <div className="lg:col-span-5 w-full">
              <Reveal delay={0.2} yOffset={20}>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 items-start">
                  {/* Column 1 (3 tiles) */}
                  <div className="flex flex-col gap-2.5 sm:gap-3.5 pt-0">
                    {heroTiles.slice(0, 3).map((tile) => (
                      <Link
                        key={tile.id}
                        href={tile.href || "/catalogue"}
                        className={`group relative aspect-square w-full rounded-2xl overflow-hidden border border-border/80 bg-secondary/20 shadow-xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${tile.rotateClass}`}
                        title={tile.title}
                      >
                        <Image
                          src={tile.mediaUrl || "/logo.png"}
                          alt={tile.title}
                          fill
                          sizes="(max-width: 768px) 33vw, 20vw"
                          priority
                          loading="eager"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/35 transition-opacity group-hover:opacity-90" />
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                          <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider border border-white/20">
                            {tile.tag}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-accent text-[9px] font-black text-accent-foreground uppercase tracking-wider shadow-xs">
                            {tile.subtag}
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
                          <span className="text-[11px] sm:text-xs font-bold text-white drop-shadow-sm line-clamp-1 group-hover:text-accent-300 transition-colors">
                            {tile.title}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Column 2: Stepped down (2 tiles) */}
                  <div className="flex flex-col gap-2.5 sm:gap-3.5 pt-6 sm:pt-10 lg:pt-12">
                    {heroTiles.slice(3, 5).map((tile) => (
                      <Link
                        key={tile.id}
                        href={tile.href || "/catalogue"}
                        className={`group relative aspect-square w-full rounded-2xl overflow-hidden border border-border/80 bg-secondary/20 shadow-xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${tile.rotateClass}`}
                        title={tile.title}
                      >
                        <Image
                          src={tile.mediaUrl || "/logo.png"}
                          alt={tile.title}
                          fill
                          sizes="(max-width: 768px) 33vw, 20vw"
                          priority
                          loading="eager"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/35 transition-opacity group-hover:opacity-90" />
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                          <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider border border-white/20">
                            {tile.tag}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-accent text-[9px] font-black text-accent-foreground uppercase tracking-wider shadow-xs">
                            {tile.subtag}
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
                          <span className="text-[11px] sm:text-xs font-bold text-white drop-shadow-sm line-clamp-1 group-hover:text-accent-300 transition-colors">
                            {tile.title}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Column 3: Stepped midway (3 tiles) */}
                  <div className="flex flex-col gap-2.5 sm:gap-3.5 pt-3 sm:pt-5 lg:pt-6">
                    {heroTiles.slice(5, 8).map((tile) => (
                      <Link
                        key={tile.id}
                        href={tile.href || "/catalogue"}
                        className={`group relative aspect-square w-full rounded-2xl overflow-hidden border border-border/80 bg-secondary/20 shadow-xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${tile.rotateClass}`}
                        title={tile.title}
                      >
                        <Image
                          src={tile.mediaUrl || "/logo.png"}
                          alt={tile.title}
                          fill
                          sizes="(max-width: 768px) 33vw, 20vw"
                          priority
                          loading="eager"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/35 transition-opacity group-hover:opacity-90" />
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                          <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider border border-white/20">
                            {tile.tag}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-accent text-[9px] font-black text-accent-foreground uppercase tracking-wider shadow-xs">
                            {tile.subtag}
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
                          <span className="text-[11px] sm:text-xs font-bold text-white drop-shadow-sm line-clamp-1 group-hover:text-accent-300 transition-colors">
                            {tile.title}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARTNERS & ACCREDITATION STRIP */}
      <section className="border-y border-border py-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="shrink-0 text-center md:text-left">
              <p className="editorial-tag text-brand-700 dark:text-brand-300">
                Authorized Distribution
              </p>
              <p className="text-sm font-extrabold tracking-tight">
                Direct Certified Brands &amp; Standards
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-8 sm:gap-12 opacity-85">
              {partnersList.length > 0 ? (
                partnersList.map((partner) => (
                  <span
                    key={partner.id}
                    className="text-sm sm:text-base font-black tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {partner.name}
                  </span>
                ))
              ) : (
                <>
                  <span className="text-sm sm:text-base font-black tracking-widest uppercase text-muted-foreground">
                    FAMETECH (TYSSO)
                  </span>
                  <span className="text-sm sm:text-base font-black tracking-widest uppercase text-muted-foreground">
                    INTEL IOT
                  </span>
                  <span className="text-sm sm:text-base font-black tracking-widest uppercase text-muted-foreground">
                    MICROSOFT IOT
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. NOHO-STYLE SCROLL STATEMENT WITH INLINE IMAGES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-snug sm:leading-tight">
            <span>POS terminals </span>
            <span className="inline-flex align-middle mx-1 sm:mx-2 size-8 sm:size-14 rounded-xl border border-border bg-card p-1 overflow-hidden shadow-xs">
              <Image
                src="/logo.png"
                alt="Terminal"
                width={56}
                height={56}
                className="object-contain"
              />
            </span>
            <span> thermal printers </span>
            <span className="inline-flex align-middle mx-1 sm:mx-2 size-8 sm:size-14 rounded-xl border border-border bg-card p-1 overflow-hidden shadow-xs">
              <Image
                src="/logo.png"
                alt="Printer"
                width={56}
                height={56}
                className="object-contain"
              />
            </span>
            <span> and scanners </span>
            <span className="inline-flex align-middle mx-1 sm:mx-2 size-8 sm:size-14 rounded-xl border border-border bg-card p-1 overflow-hidden shadow-xs">
              <Image
                src="/logo.png"
                alt="Scanner"
                width={56}
                height={56}
                className="object-contain"
              />
            </span>
            <span> built to withstand the demands of modern commerce.</span>
          </div>
        </Reveal>
      </section>

      {/* 4. FEATURED PRODUCTS CATALOGUE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="editorial-tag text-brand-700 dark:text-brand-300">
              Catalogue Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Engineered for your counters
            </h2>
          </div>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 hover:underline"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.slice(0, 3).map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between p-6 rounded-3xl bg-card border border-border hover:border-brand-500/50 transition-all duration-300 shadow-xs hover:shadow-lg group"
            >
              <div>
                <div className="relative aspect-4/3 w-full bg-secondary/30 rounded-2xl p-6 mb-6 flex items-center justify-center overflow-hidden">
                  <div className="relative size-40 group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={product.cover?.secureUrl || "/logo.png"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-contain"
                    />
                  </div>
                  {/* Top overlay badge bar */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                    {product.category ? (
                      <span className="editorial-badge pointer-events-auto text-[10px] truncate max-w-[140px]">
                        {product.category.name}
                      </span>
                    ) : (
                      <div />
                    )}
                    <div className="pointer-events-auto shrink-0">
                      <CompareToggleButton product={product} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {product.modelNumber && (
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {product.modelNumber}
                    </p>
                  )}
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground line-clamp-2 min-h-[3.25rem] leading-snug group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {product.shortDescription || "Commercial hardware for enterprise deployments."}
                  </p>
                </div>

                {product.highlights && product.highlights.length > 0 && (
                  <ul className="mt-4 space-y-1.5 border-t border-border/70 pt-4">
                    {product.highlights.slice(0, 2).map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2 text-xs text-foreground/80"
                      >
                        <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Actions: View Details & Enquire */}
              <div className="pt-4 mt-5 border-t border-border/70 flex items-center gap-2.5 w-full">
                <Link
                  href={`/catalogue/${product.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full border border-border/80 bg-secondary/50 hover:bg-secondary text-foreground text-xs font-bold transition-all whitespace-nowrap text-center group/link shadow-2xs"
                >
                  <span>View Details</span>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover/link:translate-x-0.5 transition-transform" />
                </Link>

                <div className="flex-1">
                  <EnquireButton
                    product={product}
                    className="w-full py-2.5 px-3 text-center justify-center whitespace-nowrap shadow-2xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Centered View More / Full Catalogue Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-card border-2 border-brand-700/40 dark:border-brand-400/40 hover:border-brand-700 dark:hover:border-brand-400 hover:bg-secondary/70 text-foreground font-bold text-xs uppercase tracking-widest transition-all shadow-sm active:scale-98"
          >
            <span>Explore Full Catalogue</span>
            <ArrowRight className="size-4 text-accent" />
          </Link>
        </div>
      </section>

      {/* 5. NUMBERED WHY MIFARETECH (01 / 02 / 03) */}
      <section className="bg-secondary/40 py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="editorial-tag text-brand-700 dark:text-brand-300">Why Mifaretech</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-1">
              {whyBlock?.title || "Built on trust, verified in service"}
            </h2>
            <div
              className="text-sm text-muted-foreground mt-3 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  whyBlock?.bodyHtml ||
                  "<p>We eliminate counterfeit risks, slow response times, and orphaned hardware by providing end-to-end support for retail automation.</p>",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyPillars.map((pillar, i) => (
              <div
                key={pillar.number}
                className="p-8 rounded-3xl bg-card border border-border relative overflow-hidden flex flex-col justify-between"
              >
                <span
                  aria-hidden="true"
                  role="presentation"
                  className={`text-5xl font-black select-none ${
                    i === 1
                      ? "text-accent-700/80 dark:text-accent-400/80"
                      : "text-brand-700/80 dark:text-brand-400/80"
                  }`}
                >
                  {pillar.number}
                </span>
                <div className="space-y-3 mt-6">
                  <div
                    className={`size-10 rounded-2xl flex items-center justify-center ${
                      i === 1
                        ? "bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400"
                        : "bg-brand-50 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300"
                    }`}
                  >
                    {i === 0 && <ShieldCheck className="size-5" />}
                    {i === 1 && <Wrench className="size-5" />}
                    {i === 2 && <Headphones className="size-5" />}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DISCOVERY QUIZ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <PosAdvisorQuiz />
      </section>

      {/* 7. CLIENT STORIES / TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="editorial-tag text-brand-700 dark:text-brand-300">Client Stories</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            Counters that never pause
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsList.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-8 rounded-3xl bg-card border border-border flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="size-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 italic leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-bold text-foreground">{item.authorName}</p>
                <p className="text-[11px] text-muted-foreground">
                  {item.authorRole ? `${item.authorRole}, ` : ""}
                  {item.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="editorial-tag text-brand-700 dark:text-brand-300">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Hardware Procurement &amp; Support
          </h2>
        </div>

        <FaqAccordion
          items={faqsList.map((f) => ({
            id: f.id,
            question: f.question,
            answerHtml: f.answerHtml,
          }))}
        />
      </section>

      {/* 9. FINAL CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-14 rounded-3xl bg-brand-950 text-white border border-brand-800 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-accent text-xs font-black uppercase tracking-widest">
              Direct Quotations &amp; Consultations
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Ready to modernize your checkout counters?
            </h2>
            <p className="text-sm text-brand-200 leading-relaxed">
              Contact our sales specialists for tailored advice, bulk fleet pricing, and certified
              installation support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-black text-xs uppercase tracking-widest transition-all shadow-lg text-center"
            >
              Get a Fast Quote
            </Link>
            <Link
              href="/catalogue"
              className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all text-center"
            >
              View Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
