"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Share2,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useEnquiryBasket } from "@/lib/basket-store";
import type { ProductItem } from "@/lib/catalogue-data";

interface ProductViewProps {
  product: ProductItem;
  related: ProductItem[];
}

export function ProductView({ product, related }: ProductViewProps) {
  const { addItem } = useEnquiryBasket();
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeImage, setActiveImage] = useState(product.image);

  const handleEnquire = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-24 pt-8 sm:pt-14">
      {/* 1. Breadcrumbs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Catalogue</span>
        </Link>
      </section>

      {/* 2. Main Product Hero & Specifications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Visual Media Display */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-4/3 rounded-3xl bg-card border border-border flex items-center justify-center p-8 overflow-hidden group">
              <Image
                src={activeImage}
                alt={product.name}
                width={500}
                height={400}
                priority
                loading="eager"
                className="object-contain max-h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="editorial-tag text-brand-700 dark:text-brand-300">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex items-center gap-3">
              {product.gallery.map((img) => (
                <button
                  type="button"
                  key={img}
                  onClick={() => setActiveImage(img)}
                  className={`size-20 rounded-2xl bg-card border-2 p-2 flex items-center justify-center overflow-hidden cursor-pointer transition-colors ${
                    activeImage === img
                      ? "border-brand-600"
                      : "border-border hover:border-brand-500/50"
                  }`}
                >
                  <Image
                    src={img}
                    alt="Thumbnail"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Commercial Details & Qualification */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                SKU: {product.id} • OEM Partner Hardware
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                {product.name}
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Hardware Key Highlights */}
            <div className="space-y-3 border-y border-border py-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-foreground font-bold">
                Engineered Capabilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-2 text-xs font-medium">
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Qualification & Consultation CTA */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleEnquire}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 cursor-pointer active:scale-98"
                >
                  {added ? (
                    <>
                      <Check className="size-4" />
                      <span>Added to Enquiry Basket</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="size-4" />
                      <span>Request Quote / Consultation</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  title="Share specification link"
                  className="inline-flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-bold text-sm border border-border hover:bg-muted transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="size-4 text-emerald-500" />
                  ) : (
                    <Share2 className="size-4" />
                  )}
                  <span className="sm:hidden">Share Spec</span>
                </button>
              </div>

              {/* B2B Assurance Note */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <ShieldCheck className="size-4 text-brand-600 shrink-0" />
                <span>Wholesale hardware quote generated in &lt; 2 hours with SLA guarantee.</span>
              </div>
            </div>

            {/* Datasheet Download */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-brand-600" />
                <div>
                  <p className="text-xs font-bold">Technical Datasheet (PDF)</p>
                  <p className="text-[11px] text-muted-foreground">
                    Detailed architectural blueprints &amp; pinouts
                  </p>
                </div>
              </div>
              <a
                href={product.datasheetUrl || "#"}
                download
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 hover:underline"
              >
                <Download className="size-3.5" />
                <span>PDF</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Comprehensive Technical Specifications Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-2xl font-extrabold tracking-tight">Technical Specifications</h2>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              Field-verified architectural metrics and hardware tolerances
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card overflow-hidden">
            <div className="divide-y divide-border">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="grid grid-cols-1 sm:grid-cols-3 p-4 sm:px-6 gap-2 text-sm"
                >
                  <span className="font-bold text-muted-foreground font-mono text-xs uppercase tracking-wider">
                    {spec.label}
                  </span>
                  <span className="sm:col-span-2 font-medium text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Related Hardware Devices */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Compatible Ecosystem Units</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  className="p-6 rounded-3xl bg-card border border-border flex items-center justify-between gap-6 group hover:border-brand-500/50 transition-all"
                >
                  <div className="space-y-2">
                    <span className="editorial-tag text-brand-700 dark:text-brand-300">
                      {rel.category}
                    </span>
                    <h3 className="text-lg font-bold group-hover:text-brand-600 transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {rel.shortDescription}
                    </p>
                    <Link
                      href={`/catalogue/${rel.slug}`}
                      className="inline-block text-xs font-bold text-brand-700 dark:text-brand-300 hover:underline pt-2"
                    >
                      View specifications &rarr;
                    </Link>
                  </div>
                  <div className="size-24 shrink-0 bg-muted/40 rounded-2xl flex items-center justify-center p-2">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      width={80}
                      height={80}
                      className="object-contain max-h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
