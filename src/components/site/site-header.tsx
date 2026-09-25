"use client";

import { ShoppingBag, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useMotionPreference } from "@/components/providers";

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { isReducedMotion, toggleReducedMotion } = useMotionPreference();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [energyPanelOpen, setEnergyPanelOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    if (pathname) {
      setMobileMenuOpen(false);
      setEnergyPanelOpen(false);
    }
  }, [pathname]);

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Catalogue", href: "/catalogue" },
    { label: "Solutions", href: "/solutions" },
    { label: "Contact", href: "/contact" },
  ];

  // Energy rating calculation (Noho style)
  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark");
  const energyRating =
    isDarkMode && isReducedMotion ? "Low" : isDarkMode || isReducedMotion ? "Med" : "High";
  const energyColor =
    energyRating === "Low"
      ? "bg-emerald-500 text-white"
      : energyRating === "Med"
        ? "bg-amber-500 text-white"
        : "bg-brand-500 text-white";

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-xs py-3"
            : "bg-background/60 backdrop-blur-sm border-b border-border/30 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group focus:outline-hidden">
            <div className="relative h-9 w-32 sm:h-10 sm:w-36 transition-transform group-hover:scale-102">
              <Image
                src="/logo.png"
                alt="Mifaretech Logo"
                fill
                sizes="144px"
                priority
                loading="eager"
                className="object-contain dark:hidden"
              />
              <Image
                src="/logo-white.png"
                alt="Mifaretech Logo"
                fill
                sizes="144px"
                priority
                loading="eager"
                className="object-contain hidden dark:block"
              />
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-colors ${
                    isActive
                      ? "text-brand-700 dark:text-brand-300 underline underline-offset-8 decoration-2 decoration-brand-500"
                      : "text-foreground/80 hover:text-brand-700 dark:hover:text-brand-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster: Energy Usage Menu + Enquire Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Energy Rating Button (Visible on mobile and desktop) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setEnergyPanelOpen(!energyPanelOpen)}
                aria-expanded={energyPanelOpen}
                aria-label={`Energy efficiency settings: ${energyRating} usage`}
                className="relative inline-flex items-center justify-center size-8 sm:size-9 rounded-full border border-border bg-secondary/50 hover:bg-secondary text-foreground transition-all cursor-pointer group"
                title={`Energy efficiency: ${energyRating} usage (click to adjust)`}
              >
                <Zap className="size-3.5 sm:size-4 text-accent group-hover:scale-110 transition-transform" />
                <span
                  className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 size-2 rounded-full ring-2 ring-background ${
                    energyRating === "Low"
                      ? "bg-emerald-500"
                      : energyRating === "Med"
                        ? "bg-amber-500"
                        : "bg-accent"
                  }`}
                />
              </button>

              {/* Energy Control Dropdown */}
              <AnimatePresence>
                {energyPanelOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] p-5 rounded-2xl bg-card border border-border shadow-2xl z-50 text-foreground"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-border/70">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Efficiency Rating
                        </p>
                        <p className="text-sm font-bold text-foreground">Battery & Performance</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${energyColor}`}>
                        {energyRating} Usage
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      Enabling dark mode and reducing animation reduces GPU/CPU demand, saving up to
                      35% device battery.
                    </p>

                    <div className="mt-4 space-y-3">
                      {/* Dark Mode Switch */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/60">
                        <div>
                          <p className="text-xs font-semibold">Dark mode</p>
                          <p className="text-[11px] text-muted-foreground">
                            Reduces display power draw
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            isDarkMode ? "bg-brand-700" : "bg-neutral-300 dark:bg-neutral-700"
                          }`}
                        >
                          <span
                            className={`block size-4.5 rounded-full bg-white transition-transform transform ${
                              isDarkMode ? "translate-x-5.5" : "translate-x-1"
                            } top-0.5 absolute`}
                          />
                        </button>
                      </div>

                      {/* Reduce Motion Switch */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/60">
                        <div>
                          <p className="text-xs font-semibold">Reduce animation</p>
                          <p className="text-[11px] text-muted-foreground">
                            Minimizes CPU rendering cycles
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={toggleReducedMotion}
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            isReducedMotion ? "bg-brand-700" : "bg-neutral-300 dark:bg-neutral-700"
                          }`}
                        >
                          <span
                            className={`block size-4.5 rounded-full bg-white transition-transform transform ${
                              isReducedMotion ? "translate-x-5.5" : "translate-x-1"
                            } top-0.5 absolute`}
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enquire CTA Button (WCAG compliant dark blue text on orange) */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-98"
            >
              <ShoppingBag className="size-3.5" />
              <span>Enquire</span>
            </Link>

            {/* Modern Animated Morphing Hamburger Button (Noho-Style) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative flex flex-col items-center justify-center size-9 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-foreground transition-all cursor-pointer focus:outline-hidden"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Toggle Menu</span>
              <div className="relative w-4.5 h-3.5 flex flex-col justify-between items-center">
                <span
                  className={`block h-0.5 w-full rounded-full bg-foreground transition-all duration-300 ease-out origin-center ${
                    mobileMenuOpen ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-full rounded-full bg-foreground transition-all duration-200 ease-out ${
                    mobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                  }`}
                />
                <span
                  className={`block h-0.5 w-full rounded-full bg-foreground transition-all duration-300 ease-out origin-center ${
                    mobileMenuOpen ? "-translate-y-[6px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Noho-style Fullscreen Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-[61px] z-50 bg-background/98 backdrop-blur-xl flex flex-col justify-between p-6 overflow-y-auto md:hidden"
          >
            {/* Mobile Nav Links */}
            <div className="space-y-6 pt-4">
              <p className="editorial-tag text-brand-700 dark:text-brand-300">Navigation</p>
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-extrabold tracking-tight hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Noho-style Mobile Featured Hardware Preview Cards */}
              <div className="pt-6 border-t border-border">
                <p className="editorial-tag text-muted-foreground mb-3">Popular Hardware</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/catalogue/fametech-pos-1000"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-card border border-border flex flex-col items-center text-center group"
                  >
                    <div className="relative size-16 mb-2">
                      <Image
                        src="/logo.png"
                        alt="POS Terminal"
                        fill
                        sizes="64px"
                        className="object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-xs font-bold leading-tight line-clamp-1">
                      POS-1000-HD
                    </span>
                    <span className="text-[10px] text-muted-foreground">Touch Terminal</span>
                  </Link>

                  <Link
                    href="/catalogue/heavy-duty-thermal-receipt-printer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-card border border-border flex flex-col items-center text-center group"
                  >
                    <div className="relative size-16 mb-2">
                      <Image
                        src="/logo.png"
                        alt="Thermal Printer"
                        fill
                        sizes="64px"
                        className="object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-xs font-bold leading-tight line-clamp-1">
                      PRP-300-PRO
                    </span>
                    <span className="text-[10px] text-muted-foreground">Receipt Printer</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Footer CTA */}
            <div className="pt-6 border-t border-border">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-accent text-accent-foreground font-bold text-sm uppercase tracking-wider"
              >
                <span>Request Quotation / Enquire</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
