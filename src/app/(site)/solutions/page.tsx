"use client";

import {
  ArrowRight,
  GraduationCap,
  Hotel,
  Pill,
  ShieldCheck,
  ShoppingCart,
  Store,
  Truck,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Reveal, SplitLines } from "@/components/motion/reveal";

export default function SolutionsPage() {
  const industries = [
    {
      icon: Store,
      title: "Retail Boutiques & Chains",
      desc: "Compact, aesthetic touch terminals with high-resolution customer displays, fast receipt printing, and barcode scanning for seamless checkout experiences.",
      recommended: "POS-1000-HD + PRP-300 Printer",
    },
    {
      icon: ShoppingCart,
      title: "Supermarkets & FMCG",
      desc: "High-throughput checkout lanes with omnidirectional 2D hands-free barcode scanners, heavy-duty steel cash drawers, and dual thermal printers.",
      recommended: "SC-900-OMNI + CD-410-HD Drawer",
    },
    {
      icon: UtensilsCrossed,
      title: "Restaurants & Quick Service",
      desc: "Spill-resistant, fanless touch stations built to endure kitchen grease, heat, and high-frequency order dispatch with kitchen ticket buzzers.",
      recommended: "POS-1000-HD + Kitchen Printer",
    },
    {
      icon: Pill,
      title: "Pharmacies & Healthcare Retail",
      desc: "High-precision barcode validation, prescription receipt formatting, batch number tracking support, and quiet counter operation.",
      recommended: "SC-900 2D Scanner + Touch Station",
    },
    {
      icon: Hotel,
      title: "Hospitality & Lodging",
      desc: "Front-desk check-in stations, keycard encoder integration options, folio printers, and integrated cash management drawers.",
      recommended: "POS-1000 Touch Terminal + KS-215 Kiosk",
    },
  ];

  const services = [
    {
      icon: Truck,
      title: "Turnkey Hardware Procurement",
      desc: "We supply brand-new, factory-sealed POS terminals, thermal printers, cash drawers, and scanners with verified serials and full manufacturer warranties.",
    },
    {
      icon: Wrench,
      title: "On-Site Staging & Configuration",
      desc: "Our technical team configures peripheral baud rates, installs standard OPOS/JPOS drivers, and conducts stress-testing prior to counter hand-over.",
    },
    {
      icon: GraduationCap,
      title: "Staff & Supervisor Training",
      desc: "We guide store supervisors and cashiers on proper paper loading, cutter maintenance, and hardware troubleshooting to avoid peak-hour delays.",
    },
    {
      icon: ShieldCheck,
      title: "Rapid Swap SLA & Maintenance",
      desc: "A dedicated hotline and replacement stock guarantee that a malfunctioning printer or terminal is swapped out swiftly, protecting your revenue.",
    },
  ];

  return (
    <div className="flex flex-col gap-24 sm:gap-32 pb-20">
      {/* 1. Header */}
      <section className="pt-12 sm:pt-20 lg:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="editorial-badge">Enterprise Solutions</span>
            <SplitLines
              lines={[
                <span key="1" className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                  Point-of-sale architectures
                </span>,
                <span key="2" className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                  tailored to your industry.
                </span>,
              ]}
            />
            <Reveal delay={0.2}>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
                Whether you run a fast-paced supermarket or a high-end boutique, we supply and
                deploy the exact hardware combination required for flawless operations.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. Industries Served Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="editorial-tag text-brand-700 dark:text-brand-300">
            Vertical Specialization
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
            Engineered for specific floor workflows
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.title}
                className="p-8 rounded-3xl bg-card border border-border hover:border-brand-500/50 transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-brand-50 dark:bg-brand-900/50 flex items-center justify-center text-brand-700 dark:text-brand-300 group-hover:scale-110 transition-transform">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{ind.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {ind.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase">
                    Recommended Setup
                  </p>
                  <p className="text-xs font-bold text-brand-700 dark:text-brand-300 mt-0.5">
                    {ind.recommended}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Enterprise Services */}
      <section className="bg-secondary/30 py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="editorial-tag text-accent">Full Lifecycle Delivery</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
              End-to-End Enterprise Services
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              From the initial counter consultation to multi-year warranty maintenance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.title}
                  className="p-6 rounded-3xl bg-card border border-border space-y-4"
                >
                  <div className="size-10 rounded-2xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center text-accent">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-base font-bold tracking-tight">{srv.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{srv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Consultation CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-lg">
            <h3 className="text-2xl font-bold tracking-tight">Need a custom hardware rollout?</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Our specialists will help formulate the optimal configuration for your counters,
              branches, and fiscal requirements.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-black text-xs uppercase tracking-widest transition-all shadow-md shrink-0"
          >
            <span>Talk to a Specialist</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
