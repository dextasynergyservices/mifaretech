"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Headphones,
  HelpCircle,
  ShieldCheck,
  ShoppingBag,
  Star,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal, SplitLines } from "@/components/motion/reveal";
import { useEnquiryBasket } from "@/lib/basket-store";
import { PRODUCTS } from "@/lib/catalogue-data";

export default function HomePage() {
  const { addItem } = useEnquiryBasket();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    business: "Retail Store",
    tills: "1–2 Counters",
    priority: "High Reliability & Speed",
  });
  const [quizCompleted, setQuizCompleted] = useState(false);

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleEnquire = (product: (typeof PRODUCTS)[0]) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const faqs = [
    {
      q: "Does Mifaretech hardware include a manufacturer warranty?",
      a: "Yes. As an accredited distributor of Fametech and certified POS brands, our terminals come with standard manufacturer warranties covering parts and bench repair, backed by our swift replacement service.",
    },
    {
      q: "Can we order multiple items for a multi-branch rollout?",
      a: "Absolutely. We supply single-store operators as well as supermarket chains and nationwide franchises. Click 'Enquire' on any hardware to build an enquiry basket with the quantities you need.",
    },
    {
      q: "Are your POS terminals compatible with third-party software?",
      a: "Yes. Our terminals run standard Windows 10/11 IoT Enterprise, Linux, or Android, with open OPOS/JPOS driver support for receipt printers, cash drawers, and customer-facing displays.",
    },
    {
      q: "How fast is delivery and dispatch?",
      a: "In-stock hardware is dispatched promptly from our logistics hubs with express tracked delivery across the UK and established West African trade channels.",
    },
  ];

  return (
    <div className="flex flex-col gap-24 sm:gap-32 pb-20">
      {/* 1. HERO SECTION (Patterned after Noho) */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            {/* Left Half: Staggered Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="size-3.5 text-accent" />
                <span>Accredited Fametech Distributor</span>
              </div>

              {/* Noho-style line-by-line staggered reveal */}
              <div className="space-y-1">
                <SplitLines
                  lines={[
                    <span
                      key="1"
                      className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
                    >
                      We engineer hardware
                    </span>,
                    <span
                      key="2"
                      className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
                    >
                      for busy counters,
                    </span>,
                    <span
                      key="3"
                      className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-700 dark:text-brand-400"
                    >
                      Mifaretech <span className="text-accent font-black">...</span>lean forward
                      smartly!
                    </span>,
                  ]}
                  lineClassName="pb-1"
                />
              </div>

              <Reveal delay={0.2}>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                  Accredited distributor of high-performance POS touch terminals, thermal receipt
                  printers, omnidirectional barcode scanners, and enterprise retail infrastructure.
                  Built for non-stop reliability.
                </p>
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

              {/* Quick highlights */}
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

            {/* Right Half: Noho-Style Scattered Small Product Image Tiles (Staggered Dynamic Cascade, Non-Linear Arrangement) */}
            <div className="lg:col-span-5 w-full">
              <Reveal delay={0.2} yOffset={20}>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 items-start">
                  {/* Column 1: Starts at top level with headline */}
                  <div className="flex flex-col gap-2.5 sm:gap-3.5 pt-0">
                    {/* Top Tile Desktop: Mobile Handheld Terminal */}
                    <Link
                      href="/catalogue"
                      className="hidden lg:flex group relative aspect-square w-full rounded-2xl bg-[#E8F3EB] dark:bg-[#16291e] p-3 flex-col items-center justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rotate-[-1.5deg] hover:rotate-0"
                      title="Mobile Handheld POS Terminal"
                    >
                      <div className="w-full flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Mobile</span>
                        <span className="text-emerald-600 dark:text-emerald-400">M-POS</span>
                      </div>
                      <div className="relative size-16 sm:size-20 lg:size-24 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt="Mobile Handheld Terminal"
                          fill
                          sizes="120px"
                          priority
                          loading="eager"
                          className="object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-foreground line-clamp-1 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                        Mobile POS
                      </span>
                    </Link>

                    {/* Tile 1: Touch POS Terminal */}
                    <Link
                      href="/catalogue/fametech-pos-1000"
                      className="group relative aspect-square w-full rounded-2xl bg-[#F5EFE6] dark:bg-[#18233c] p-3 flex flex-col items-center justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rotate-[1deg] hover:rotate-0"
                      title="Enterprise Touch POS Terminal"
                    >
                      <div className="w-full flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>POS</span>
                        <span className="text-emerald-600 dark:text-emerald-400">1000</span>
                      </div>
                      <div className="relative size-16 sm:size-20 lg:size-24 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt="Touch POS Terminal"
                          fill
                          sizes="120px"
                          priority
                          loading="eager"
                          className="object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-foreground line-clamp-1 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                        Terminal
                      </span>
                    </Link>

                    {/* Tile 2: Handheld Barcode Scanner */}
                    <Link
                      href="/catalogue"
                      className="group relative aspect-square w-full rounded-2xl bg-[#EAF1E7] dark:bg-[#18281e] p-3 flex flex-col items-center justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rotate-[-1deg] hover:rotate-0"
                      title="Handheld Barcode Scanner"
                    >
                      <div className="w-full flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Scan</span>
                        <span className="text-brand-700 dark:text-brand-300">2D</span>
                      </div>
                      <div className="relative size-16 sm:size-20 lg:size-24 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt="Barcode Scanner"
                          fill
                          sizes="120px"
                          priority
                          loading="eager"
                          className="object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-foreground line-clamp-1 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                        Scanner
                      </span>
                    </Link>
                  </div>

                  {/* Column 2: Stepped down substantially to create an organic valley & break straight line */}
                  <div className="flex flex-col gap-2.5 sm:gap-3.5 pt-8 sm:pt-12 lg:pt-14">
                    {/* Top Tile Desktop: Omnidirectional Countertop Scanner */}
                    <Link
                      href="/catalogue"
                      className="hidden lg:flex group relative aspect-square w-full rounded-2xl bg-[#FDECE6] dark:bg-[#2e1b18] p-3 flex-col items-center justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rotate-[1.5deg] hover:rotate-0"
                      title="Omnidirectional Counter Scanner"
                    >
                      <div className="w-full flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Omni</span>
                        <span className="text-accent">CS-900</span>
                      </div>
                      <div className="relative size-16 sm:size-20 lg:size-24 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt="Omnidirectional Countertop Scanner"
                          fill
                          sizes="120px"
                          priority
                          loading="eager"
                          className="object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-foreground line-clamp-1 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                        Omni Scanner
                      </span>
                    </Link>

                    {/* Tile 3: Thermal Receipt Printer */}
                    <Link
                      href="/catalogue/heavy-duty-thermal-receipt-printer"
                      className="group relative aspect-square w-full rounded-2xl bg-[#FAECE4] dark:bg-[#2c1d1a] p-3 flex flex-col items-center justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rotate-[-1deg] hover:rotate-0"
                      title="High-Speed Thermal Receipt Printer"
                    >
                      <div className="w-full flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Print</span>
                        <span className="text-accent">300</span>
                      </div>
                      <div className="relative size-16 sm:size-20 lg:size-24 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt="Thermal Receipt Printer"
                          fill
                          sizes="120px"
                          priority
                          loading="eager"
                          className="object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-foreground line-clamp-1 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                        Printer
                      </span>
                    </Link>

                    {/* Tile 4: Heavy-Duty Cash Drawer */}
                    <Link
                      href="/catalogue"
                      className="group relative aspect-square w-full rounded-2xl bg-[#E8EDF8] dark:bg-[#1a233a] p-3 flex flex-col items-center justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rotate-[1deg] hover:rotate-0"
                      title="Heavy-Duty Cash Drawer"
                    >
                      <div className="w-full flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Safe</span>
                        <span className="text-brand-700 dark:text-brand-300">RJ11</span>
                      </div>
                      <div className="relative size-16 sm:size-20 lg:size-24 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt="Cash Drawer"
                          fill
                          sizes="120px"
                          priority
                          loading="eager"
                          className="object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-foreground line-clamp-1 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                        Drawer
                      </span>
                    </Link>
                  </div>

                  {/* Column 3: Stepped midway to complete the dynamic wave contour */}
                  <div className="flex flex-col gap-2.5 sm:gap-3.5 pt-4 sm:pt-6 lg:pt-7">
                    {/* Top Tile Desktop: Interactive Self-Ordering Kiosk */}
                    <Link
                      href="/catalogue"
                      className="hidden lg:flex group relative aspect-square w-full rounded-2xl bg-[#EAEBF8] dark:bg-[#191e38] p-3 flex-col items-center justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rotate-[-1deg] hover:rotate-0"
                      title="Self-Ordering Interactive Kiosk"
                    >
                      <div className="w-full flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Kiosk</span>
                        <span className="text-brand-700 dark:text-brand-300">21.5&quot;</span>
                      </div>
                      <div className="relative size-16 sm:size-20 lg:size-24 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt="Self-Ordering Kiosk"
                          fill
                          sizes="120px"
                          priority
                          loading="eager"
                          className="object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-foreground line-clamp-1 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                        Smart Kiosk
                      </span>
                    </Link>

                    {/* Tile 5: Customer Pole Display */}
                    <Link
                      href="/catalogue"
                      className="group relative aspect-square w-full rounded-2xl bg-[#FEF6E9] dark:bg-[#282218] p-3 flex flex-col items-center justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rotate-[1.5deg] hover:rotate-0"
                      title="VFD Customer Pole Display"
                    >
                      <div className="w-full flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Pole</span>
                        <span className="text-brand-700 dark:text-brand-300">VFD</span>
                      </div>
                      <div className="relative size-16 sm:size-20 lg:size-24 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt="Customer Display"
                          fill
                          sizes="120px"
                          priority
                          loading="eager"
                          className="object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-foreground line-clamp-1 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                        Display
                      </span>
                    </Link>

                    {/* Tile 6: Kiosk Self-Service Engine */}
                    <Link
                      href="/catalogue"
                      className="group relative aspect-square w-full rounded-2xl bg-[#EAF4F6] dark:bg-[#16272e] p-3 flex flex-col items-center justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rotate-[-1.5deg] hover:rotate-0"
                      title="Self-Service Kiosk Engine"
                    >
                      <div className="w-full flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span>Kiosk</span>
                        <span className="text-emerald-600 dark:text-emerald-400">OEM</span>
                      </div>
                      <div className="relative size-16 sm:size-20 lg:size-24 flex items-center justify-center">
                        <Image
                          src="/logo.png"
                          alt="Kiosk Engine"
                          fill
                          sizes="120px"
                          priority
                          loading="eager"
                          className="object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-foreground line-clamp-1 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                        Kiosk
                      </span>
                    </Link>
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
                Direct Certified Brands & Standards
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-8 sm:gap-12 opacity-80">
              <span className="text-sm sm:text-base font-black tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                FAMETECH
              </span>
              <span className="text-sm sm:text-base font-black tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                CITIZEN
              </span>
              <span className="text-sm sm:text-base font-black tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                EPSON-ESC/POS
              </span>
              <span className="text-sm sm:text-base font-black tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                HONEYWELL
              </span>
              <span className="text-sm sm:text-base font-black tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
                DATALOGIC
              </span>
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

      {/* 4. FEATURED HARDWARE CATALOGUE CARDS */}
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
            <span>View Full Catalogue ({PRODUCTS.length} hardware types)</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.slice(0, 3).map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between p-6 rounded-3xl bg-card border border-border hover:border-brand-500/50 transition-all duration-300 shadow-xs hover:shadow-lg group"
            >
              <div>
                <div className="relative aspect-4/3 w-full bg-secondary/30 rounded-2xl p-6 mb-6 flex items-center justify-center overflow-hidden">
                  <div className="relative size-40 group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="160px"
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="editorial-badge">{product.categoryName}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {product.modelNumber}
                  </p>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {product.shortDescription}
                  </p>
                </div>

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
              </div>

              {/* Actions: Learn More & Enquire */}
              <div className="pt-6 mt-6 border-t border-border flex items-center justify-between gap-3">
                <Link
                  href={`/catalogue/${product.slug}`}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Learn more
                </Link>

                <button
                  type="button"
                  onClick={() => handleEnquire(product)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <ShoppingBag className="size-3.5" />
                  <span>{addedId === product.id ? "Added!" : "Enquire"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. NUMBERED WHY MIFARETECH (01 / 02 / 03 - Noho Pattern) */}
      <section className="bg-secondary/40 py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="editorial-tag text-brand-700 dark:text-brand-300">Why Mifaretech</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-1">
              Built on trust, verified in service
            </h2>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              We eliminate counterfeit risks, slow response times, and orphaned hardware by
              providing end-to-end support for retail automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-card border border-border relative overflow-hidden flex flex-col justify-between">
              <span className="text-5xl font-black text-brand-500/20 dark:text-brand-400/20 select-none">
                01
              </span>
              <div className="space-y-3 mt-6">
                <div className="size-10 rounded-2xl bg-brand-50 dark:bg-brand-900/50 flex items-center justify-center text-brand-700 dark:text-brand-300">
                  <ShieldCheck className="size-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Accredited Supply</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Direct partnership with Fametech and accredited hardware manufacturers. Zero
                  second-hand or grey-market inventory. All units ship with verified serial numbers
                  and factory warranties.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border relative overflow-hidden flex flex-col justify-between">
              <span className="text-5xl font-black text-accent/20 select-none">02</span>
              <div className="space-y-3 mt-6">
                <div className="size-10 rounded-2xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center text-accent">
                  <Wrench className="size-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Installation & Training</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Beyond shipping boxes, we configure drivers, connect peripherals, calibrate touch
                  panels, and guide your floor supervisors through day-one checkout operations.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-card border border-border relative overflow-hidden flex flex-col justify-between">
              <span className="text-5xl font-black text-brand-500/20 dark:text-brand-400/20 select-none">
                03
              </span>
              <div className="space-y-3 mt-6">
                <div className="size-10 rounded-2xl bg-brand-50 dark:bg-brand-900/50 flex items-center justify-center text-brand-700 dark:text-brand-300">
                  <Headphones className="size-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Support & Warranty</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A named account representative, dedicated technical hotline, and replacement parts
                  repository ensure your billing lanes suffer zero prolonged downtime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE DISCOVERY QUIZ (Find the right POS) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="editorial-tag text-accent">Hardware Recommendation Quiz</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Find the right POS for your business
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Answer 3 quick questions to identify the ideal setup for your counters.
            </p>
          </div>

          {!quizCompleted ? (
            <div className="space-y-6">
              {quizStep === 0 && (
                <div className="space-y-4">
                  <p className="text-sm font-bold text-center">
                    Step 1 of 3: What is your primary business type?
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["Retail Store", "Supermarket", "Restaurant / Cafe", "Pharmacy"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setQuizAnswers({ ...quizAnswers, business: opt });
                          setQuizStep(1);
                        }}
                        className={`p-4 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          quizAnswers.business === opt
                            ? "border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300"
                            : "border-border bg-background hover:bg-muted"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 1 && (
                <div className="space-y-4">
                  <p className="text-sm font-bold text-center">
                    Step 2 of 3: How many checkout counters or tills do you operate?
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["1 Counter", "2–4 Counters", "5–10 Counters", "10+ Enterprise"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setQuizAnswers({ ...quizAnswers, tills: opt });
                          setQuizStep(2);
                        }}
                        className={`p-4 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          quizAnswers.tills === opt
                            ? "border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300"
                            : "border-border bg-background hover:bg-muted"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div className="space-y-4">
                  <p className="text-sm font-bold text-center">
                    Step 3 of 3: What is your biggest hardware priority?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      "High Reliability & Speed",
                      "Self-Service & Compact",
                      "Budget Efficiency",
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setQuizAnswers({ ...quizAnswers, priority: opt });
                          setQuizCompleted(true);
                        }}
                        className="p-4 rounded-2xl border border-border bg-background hover:border-brand-600 text-xs font-bold text-center transition-all cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6 p-6 rounded-2xl bg-secondary/50 border border-border">
              <div className="inline-flex size-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 items-center justify-center">
                <CheckCircle2 className="size-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">
                  Recommended Configuration: All-In-One Enterprise Station
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Based on your business ({quizAnswers.business}), {quizAnswers.tills}, and priority
                  on {quizAnswers.priority}, we recommend the{" "}
                  <strong>POS-1000-HD Touch Terminal</strong> paired with the{" "}
                  <strong>PRP-300 Thermal Printer</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-black text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  Enquire with this Configuration
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setQuizStep(0);
                    setQuizCompleted(false);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                >
                  Retake quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. PEOPLE STORIES / TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="editorial-tag text-brand-700 dark:text-brand-300">Client Stories</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            Counters that never pause
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "Our supermarket checkout queues move twice as fast since adopting the POS-1000 terminals and omni-scanners. Truly industrial hardware.",
              author: "Adewale O.",
              role: "Head of Operations",
              company: "Pinnacle Groceries & Supermarkets",
            },
            {
              quote:
                "The thermal printers withstand endless daily printing without jamming. Mifaretech’s warranty and support give us complete peace of mind.",
              author: "Sarah M.",
              role: "Retail Director",
              company: "Apex Pharmacy Network",
            },
            {
              quote:
                "Fast dispatch, genuine Fametech units with clean cable management. Having a named contact who knows POS technology is invaluable.",
              author: "James T.",
              role: "General Manager",
              company: "Urban Table Hospitality",
            },
          ].map((item) => (
            <div
              key={item.author}
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
                <p className="text-xs font-bold text-foreground">{item.author}</p>
                <p className="text-[11px] text-muted-foreground">
                  {item.role}, {item.company}
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

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="size-4 text-brand-700 dark:text-brand-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-foreground" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
