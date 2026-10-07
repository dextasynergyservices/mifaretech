"use client";

import { ArrowRight, ArrowUp, CheckCircle2, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useState } from "react";

interface SiteFooterProps {
  contactSettings?: Record<string, unknown> | null;
  whatsappSettings?: Record<string, unknown> | null;
}

export function SiteFooter({ contactSettings, whatsappSettings }: SiteFooterProps = {}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const phones = (contactSettings?.phones as string[]) || ["+44 7448 670925"];
  const emails = (contactSettings?.emails as string[]) || [
    "sales@mifaretech.co.uk",
    "support@mifaretech.co.uk",
  ];
  const hours = (contactSettings?.hours as string) || "Mon – Fri: 08:30 – 17:30 GMT";
  const address = (contactSettings?.address as string) || "UK Nationwide & West Africa Hubs";

  const waRawNumber =
    (whatsappSettings?.number as string)?.replace(/[^0-9]/g, "") || "447448670925";
  const waDisplayNumber = (whatsappSettings?.number as string) || "+44 7448 670925";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-card border-t border-border mt-auto pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter / Quick Consultation Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-14 border-b border-border">
          <div className="lg:col-span-5 space-y-2">
            <span className="editorial-tag text-brand-700 dark:text-brand-300">
              Hardware Bulletin & Solutions
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Stay ahead in point-of-sale efficiency
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Receive updates on new Fametech releases, POS hardware updates, and retail
              optimization guides.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            {subscribed ? (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300">
                <CheckCircle2 className="size-5 shrink-0" />
                <p className="text-sm font-medium">
                  Thank you for subscribing. We will keep you updated with genuine hardware
                  insights.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-full border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-brand-700 hover:bg-brand-800 dark:bg-brand-500 dark:hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="size-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Subtle Editorial Tagline Watermark */}
        <div
          className="py-8 sm:py-12 text-center select-none overflow-hidden border-b border-border/30"
          aria-hidden="true"
          role="presentation"
        >
          <p
            role="presentation"
            aria-hidden="true"
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-foreground/8 dark:text-foreground/8 transition-colors select-none"
          >
            Mifaretech <span className="text-accent/30 font-black">...</span>
            lean forward smartly!
          </p>
        </div>

        {/* Multi-column Information Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 py-12 border-b border-border text-sm">
          {/* Brand & Tagline Column */}
          <div className="col-span-2 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-36">
                <Image
                  src="/logo.png"
                  alt="Mifaretech"
                  fill
                  sizes="144px"
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/logo-white.png"
                  alt="Mifaretech"
                  fill
                  sizes="144px"
                  className="object-contain hidden dark:block"
                />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed pr-4">
              Accredited distributor of Fametech POS terminals, receipt printers, barcode scanners,
              and enterprise automation hardware.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${waRawNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-300 hover:underline"
              >
                <MessageCircle className="size-4 text-emerald-500" />
                <span>WhatsApp: {waDisplayNumber}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 lg:col-span-2 space-y-3">
            <p className="editorial-tag text-foreground">Navigation</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="hover:text-foreground transition-colors">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-foreground transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact & Enquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Hardware Categories */}
          <div className="col-span-1 lg:col-span-3 space-y-3">
            <p className="editorial-tag text-foreground">Hardware Types</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="/catalogue?category=pos-terminals"
                  className="hover:text-foreground transition-colors"
                >
                  POS Touch Terminals
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?category=receipt-printers"
                  className="hover:text-foreground transition-colors"
                >
                  Thermal Receipt Printers
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?category=barcode-scanners"
                  className="hover:text-foreground transition-colors"
                >
                  2D Barcode Scanners
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?category=cash-drawers"
                  className="hover:text-foreground transition-colors"
                >
                  Steel Cash Drawers
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?category=kiosks"
                  className="hover:text-foreground transition-colors"
                >
                  Self-Ordering Kiosks
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact & Operating Hours */}
          <div className="col-span-2 lg:col-span-3 space-y-3">
            <p className="editorial-tag text-foreground">Contact & Enquiries</p>
            <div className="space-y-2 text-muted-foreground text-xs leading-relaxed">
              <p>
                <strong className="text-foreground">Phone / WhatsApp:</strong>{" "}
                <a
                  href={`tel:${phones[0]?.replace(/\s+/g, "") || "+447448670925"}`}
                  className="hover:underline text-foreground"
                >
                  {phones[0] || "+44 7448 670925"}
                </a>
              </p>
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                <a
                  href={`mailto:${emails[0] || "sales@mifaretech.co.uk"}`}
                  className="hover:underline text-foreground"
                >
                  {emails[0] || "sales@mifaretech.co.uk"}
                </a>
              </p>
              {emails[1] && (
                <p>
                  <strong className="text-foreground">Support:</strong>{" "}
                  <a href={`mailto:${emails[1]}`} className="hover:underline text-foreground">
                    {emails[1]}
                  </a>
                </p>
              )}
              <p>
                <strong className="text-foreground">Hours:</strong> {hours}
              </p>
              <p>
                <strong className="text-foreground">Dispatch:</strong> {address}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Legal Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-muted-foreground">
          <p>© 2026 Mifaretech System Solutions. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 font-bold text-foreground hover:text-brand-700 dark:hover:text-brand-300 cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
