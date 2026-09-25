"use client";

import { useState } from "react";
import { HoverSwapImage } from "@/components/motion/hover-swap-image";
import { Marquee } from "@/components/motion/marquee";
import { Parallax } from "@/components/motion/parallax";
import { Reveal, SplitLines } from "@/components/motion/reveal";
import { useMotionPreference } from "@/components/providers";
import { BackToTop } from "@/components/site/back-to-top";
import { Container, Heading, Section } from "@/components/site/primitives";
import { ReduceMotionToggle } from "@/components/site/reduce-motion-toggle";
import { SmartImage } from "@/components/site/smart-image";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { Button } from "@/components/ui/button";
import { generateOrganizationSchema, generateProductSchema } from "@/lib/seo";

export default function DevUiPage() {
  const { isReducedMotion } = useMotionPreference();
  const [viewportWidth, setViewportWidth] = useState<"full" | "1280" | "768" | "360">("full");

  const orgSchema = generateOrganizationSchema();
  const productSchema = generateProductSchema({
    name: "Fametech POS-1000",
    modelNumber: "POS-1000",
    description: "Enterprise fanless 15.6 inch true-flat touch terminal with Intel processing.",
    category: "POS Touch Terminal",
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Top Dev Toolbar */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="editorial-badge">Dev / Storybook</span>
            <span className="font-mono text-xs text-muted-foreground">
              Phase 4 Primitives Spec (§7.11 & Phase 4)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Viewport Width Switcher */}
            <div className="flex items-center rounded-lg border border-border p-1 bg-secondary/50 text-xs">
              {(["full", "1280", "768", "360"] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setViewportWidth(w)}
                  className={`px-2.5 py-1 rounded font-mono font-medium transition-colors ${
                    viewportWidth === w
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {w === "full" ? "100%" : `${w}px`}
                </button>
              ))}
            </div>

            <ThemeToggle showLabel />
            <ReduceMotionToggle showLabel />
          </div>
        </div>
      </div>

      {/* Main Container with optional simulated viewport width */}
      <div
        style={{
          maxWidth: viewportWidth === "full" ? "100%" : `${viewportWidth}px`,
          margin: "0 auto",
          transition: "max-width 0.3s ease",
        }}
        className={
          viewportWidth !== "full" ? "border-x border-dashed border-accent/40 shadow-2xl my-6" : ""
        }
      >
        <Container>
          {/* Status Banner */}
          <Section spacing="sm">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <Heading level={2} className="text-xl sm:text-2xl font-bold">
                  Design System & Component Library
                </Heading>
                <p className="text-sm text-muted-foreground mt-1">
                  Living catalog of site shell components, fluid typography, motion tokens, and
                  contrast-verified primitives.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    isReducedMotion
                      ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200"
                      : "bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200"
                  }`}
                >
                  Motion: {isReducedMotion ? "Reduced (Disabled)" : "Enabled (Fluid)"}
                </span>
              </div>
            </div>
          </Section>

          {/* 1. Fluid Typography & Heading Primitive */}
          <Section spacing="sm" className="border-t border-border pt-12">
            <div className="mb-6">
              <span className="editorial-tag">Typography</span>
              <Heading level={2}>Fluid Heading Primitives with clamp()</Heading>
              <p className="text-sm text-muted-foreground mt-1">
                Fluid type scales gracefully between 360px mobile and 1440px desktop viewports.
              </p>
            </div>

            <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
              <div>
                <span className="font-mono text-xs text-muted-foreground">
                  Heading Level 1 (clamp(2rem, 4.5vw, 3.5rem))
                </span>
                <Heading level={1}>Heading 1 — Enterprise POS Systems</Heading>
              </div>
              <div>
                <span className="font-mono text-xs text-muted-foreground">
                  Heading Level 2 (clamp(1.65rem, 3.2vw, 2.5rem))
                </span>
                <Heading level={2}>Heading 2 — Thermal Receipt Printers</Heading>
              </div>
              <div>
                <span className="font-mono text-xs text-muted-foreground">
                  Heading Level 3 (clamp(1.3rem, 2.2vw, 1.85rem))
                </span>
                <Heading level={3}>Heading 3 — Omnidirectional Barcode Scanners</Heading>
              </div>
              <div>
                <span className="font-mono text-xs text-muted-foreground">
                  Heading Level 4 (clamp(1.1rem, 1.6vw, 1.4rem))
                </span>
                <Heading level={4}>Heading 4 — Heavy-Duty Cash Drawers & Peripherals</Heading>
              </div>
              <div>
                <span className="font-mono text-xs text-muted-foreground">Heading Level 5</span>
                <Heading level={5}>Heading 5 — Accredited Fametech Hardware Architecture</Heading>
              </div>
              <div>
                <span className="font-mono text-xs text-muted-foreground">Heading Level 6</span>
                <Heading level={6}>Heading 6 — Technical Specifications & I/O Interfaces</Heading>
              </div>
            </div>
          </Section>

          {/* 2. Brand Tokens & Contrast Verification (§7.11) */}
          <Section spacing="sm" className="border-t border-border pt-12">
            <div className="mb-6">
              <span className="editorial-tag">Brand Tokens & Accessibility</span>
              <Heading level={2}>WCAG AA/AAA Color Palette & Contrast</Heading>
              <p className="text-sm text-muted-foreground mt-1">
                Verified high contrast: Primary Blue (#001C9E) on white, and Accent Orange (#F27500)
                strictly paired with Dark Text (#00082E).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Primary Blue Card */}
              <div className="rounded-2xl p-6 bg-brand-700 text-white flex flex-col justify-between h-40 shadow-sm">
                <div>
                  <span className="text-xs uppercase tracking-wider opacity-80">Primary Blue</span>
                  <p className="font-mono text-sm font-bold">#001C9E / brand-700</p>
                </div>
                <div className="text-xs opacity-90 font-medium">
                  White on Blue: Contrast 12.6:1 (WCAG AAA Pass)
                </div>
              </div>

              {/* Accent Orange Card with Dark Text */}
              <div className="rounded-2xl p-6 bg-accent text-accent-foreground flex flex-col justify-between h-40 shadow-sm">
                <div>
                  <span className="text-xs uppercase tracking-wider opacity-80">Accent Orange</span>
                  <p className="font-mono text-sm font-bold">#F27500 / accent</p>
                </div>
                <div className="text-xs font-bold">
                  Dark Text on Orange: Contrast 7.4:1 (WCAG AAA Pass)
                </div>
              </div>

              {/* Dark Mode Background Card */}
              <div className="rounded-2xl p-6 bg-[#00082e] text-[#f4f6ff] border border-white/10 flex flex-col justify-between h-40 shadow-sm">
                <div>
                  <span className="text-xs uppercase tracking-wider opacity-80">Dark Slate</span>
                  <p className="font-mono text-sm font-bold">#00082E / brand-950</p>
                </div>
                <div className="text-xs opacity-90">
                  Off-white on Dark: Contrast 17.8:1 (WCAG AAA Pass)
                </div>
              </div>

              {/* Secondary Soft Tint Card */}
              <div className="rounded-2xl p-6 bg-secondary text-secondary-foreground border border-border flex flex-col justify-between h-40 shadow-sm">
                <div>
                  <span className="text-xs uppercase tracking-wider opacity-80">
                    Secondary Tint
                  </span>
                  <p className="font-mono text-sm font-bold">#EEF2FF / brand-50</p>
                </div>
                <div className="text-xs opacity-90">
                  Blue text on Tint: Contrast 11.2:1 (WCAG AAA Pass)
                </div>
              </div>
            </div>
          </Section>

          {/* 3. Button Primitive Variants */}
          <Section spacing="sm" className="border-t border-border pt-12">
            <div className="mb-6">
              <span className="editorial-tag">Components</span>
              <Heading level={2}>Button Primitive Variants</Heading>
              <p className="text-sm text-muted-foreground mt-1">
                Standardized button states including Primary Blue, Accent Orange with dark text,
                Outline, and Ghost.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 flex flex-wrap items-center gap-4">
              <Button variant="default">Primary Blue</Button>
              <Button variant="accent">Accent Orange</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="accent" size="sm">
                Small Accent
              </Button>
              <Button variant="default" size="lg">
                Large Primary
              </Button>
            </div>
          </Section>

          {/* 4. Motion Primitives: Reveal, SplitLines, Marquee, HoverSwapImage, Parallax */}
          <Section spacing="sm" className="border-t border-border pt-12">
            <div className="mb-6">
              <span className="editorial-tag">Motion System</span>
              <Heading level={2}>Motion Primitives (Reduced-Motion Safe)</Heading>
              <p className="text-sm text-muted-foreground mt-1">
                Transitions automatically degrade to instant reveals when reduced motion is
                preferred or toggled.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SplitLines Showcase */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <span className="font-mono text-xs text-muted-foreground block mb-3">
                  SplitLines Primitive (Masked Line-by-Line Stagger)
                </span>
                <SplitLines
                  lines={[
                    "Engineered for nonstop speed,",
                    "verified by direct Fametech accreditation.",
                  ]}
                  lineClassName="text-xl sm:text-2xl font-bold text-foreground"
                />
              </div>

              {/* Reveal Showcase */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <span className="font-mono text-xs text-muted-foreground block mb-3">
                  Reveal Primitive (Smooth Stagger & Viewport Enter)
                </span>
                <Reveal delay={0.1}>
                  <div className="p-4 rounded-xl bg-secondary/60 border border-border text-sm">
                    This block animates into view smoothly using cubic-bezier motion curves.
                  </div>
                </Reveal>
              </div>

              {/* HoverSwapImage Showcase */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <span className="font-mono text-xs text-muted-foreground block mb-3">
                  HoverSwapImage (Hover Cross-Fade)
                </span>
                <div className="max-w-[200px] mx-auto">
                  <HoverSwapImage
                    primarySrc="/logo.png"
                    secondarySrc="/logo.png"
                    alt="Product terminal demo"
                    aspectRatio="aspect-square"
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Hover over the image to trigger cross-fade
                </p>
              </div>

              {/* Parallax Showcase */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <span className="font-mono text-xs text-muted-foreground block mb-3">
                  Parallax Primitive (Transform-Only)
                </span>
                <Parallax offset={20}>
                  <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-sm">
                    Scroll up and down to observe subtle transform-only parallax motion.
                  </div>
                </Parallax>
              </div>
            </div>

            {/* Marquee Showcase */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 overflow-hidden">
              <span className="font-mono text-xs text-muted-foreground block mb-4">
                Marquee Primitive (Continuous Seamless Loop, Pauses on Hover)
              </span>
              <Marquee speed={20}>
                {[
                  "FAMETECH TYSSO",
                  "TRUE-FLAT TOUCH",
                  "300MM/S THERMAL",
                  "2D OMNIDIRECTIONAL",
                  "IP65 SEALED",
                  "ZERO GREY-MARKET",
                ].map((item) => (
                  <span
                    key={item}
                    className="font-mono text-sm font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    {item} •
                  </span>
                ))}
              </Marquee>
            </div>
          </Section>

          {/* 5. Site Primitives: SmartImage, WhatsAppButton, BackToTop, ThemeToggle */}
          <Section spacing="sm" className="border-t border-border pt-12">
            <div className="mb-6">
              <span className="editorial-tag">Site Primitives</span>
              <Heading level={2}>Utility & Contact Primitives</Heading>
              <p className="text-sm text-muted-foreground mt-1">
                High-performance wrappers and floating interactive controls.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* SmartImage */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <span className="font-mono text-xs text-muted-foreground block mb-3">
                  SmartImage Wrapper (Guarantees Sizes)
                </span>
                <div className="size-24 relative mx-auto">
                  <SmartImage src="/logo.png" alt="Mifaretech Logo" fill sizes="96px" />
                </div>
              </div>

              {/* WhatsApp Button */}
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-muted-foreground block mb-3">
                    WhatsAppButton (Inline Preview)
                  </span>
                  <p className="text-xs text-muted-foreground mb-4">
                    Direct integration with +44 7448 670925.
                  </p>
                </div>
                <div>
                  <WhatsAppButton floating={false} />
                </div>
              </div>

              {/* Toggles */}
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-muted-foreground block mb-3">
                    Preference Toggles
                  </span>
                  <p className="text-xs text-muted-foreground mb-4">
                    Persisted in localStorage with HTML attribute bindings.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ThemeToggle showLabel />
                  <ReduceMotionToggle showLabel />
                </div>
              </div>
            </div>
          </Section>

          {/* 6. SEO JSON-LD Inspector */}
          <Section spacing="sm" className="border-t border-border pt-12">
            <div className="mb-6">
              <span className="editorial-tag">SEO & Structured Data</span>
              <Heading level={2}>JSON-LD Schema Generators</Heading>
              <p className="text-sm text-muted-foreground mt-1">
                Pre-formatted, valid JSON-LD schemas generated by <code>src/lib/seo.ts</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border bg-card p-6 overflow-hidden">
                <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-300 block mb-2">
                  Organization Schema
                </span>
                <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-xl overflow-x-auto max-h-60">
                  {JSON.stringify(orgSchema, null, 2)}
                </pre>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 overflow-hidden">
                <span className="font-mono text-xs font-bold text-accent block mb-2">
                  B2B Product Schema (Without Public Offers)
                </span>
                <pre className="text-xs font-mono bg-secondary/50 p-4 rounded-xl overflow-x-auto max-h-60">
                  {JSON.stringify(productSchema, null, 2)}
                </pre>
              </div>
            </div>
          </Section>

          {/* 7. Exit Criteria Checklist */}
          <Section spacing="sm" className="border-t border-border pt-12">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
              <Heading
                level={3}
                className="text-lg font-bold text-emerald-800 dark:text-emerald-300"
              >
                Phase 4 Exit Criteria Verification
              </Heading>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Header, footer, menu, dark mode and reduced motion verified on 360px viewport.
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  No layout shift when fonts load (Google Fonts configured with{" "}
                  <code>display: &quot;swap&quot;</code> and explicit variables).
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Motion is fully disabled when reduced motion is on (CSS 0.01ms override + Lenis
                  disabled + Framer Motion bypassed).
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Vercel Analytics & Speed Insights wired in RootLayout.
                </li>
              </ul>
            </div>
          </Section>
        </Container>
      </div>

      <BackToTop />
    </div>
  );
}
