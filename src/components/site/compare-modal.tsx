"use client";

import {
  Check,
  ExternalLink,
  MessageSquareQuote,
  Minus,
  Scale,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useCompareStore } from "@/lib/compare-store";
import { type EnquiryProductDetails, ProductEnquiryModal } from "./product-enquiry-modal";

export function CompareModal() {
  const { items, isModalOpen, closeCompareModal, removeFromCompare, clearCompare } =
    useCompareStore();

  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [selectedEnquiryProduct, setSelectedEnquiryProduct] =
    useState<EnquiryProductDetails | null>(null);

  // Extract all unique spec labels across all compared items
  const allSpecLabels = useMemo(() => {
    const labelSet = new Set<string>();
    for (const item of items) {
      if (item.specs) {
        for (const spec of item.specs) {
          if (spec.label) {
            labelSet.add(spec.label.trim());
          }
        }
      }
    }
    return Array.from(labelSet);
  }, [items]);

  // Helper to check if a specific spec differs across the compared products
  const isSpecDifferent = (label: string) => {
    if (items.length < 2) return false;
    const values = items.map((item) => {
      const match = item.specs?.find(
        (s) => s.label.toLowerCase().trim() === label.toLowerCase().trim(),
      );
      return match ? match.value.trim() : "—";
    });
    return new Set(values).size > 1;
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeCompareModal()}>
        <DialogContent className="max-w-[95vw] xl:max-w-6xl max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          {/* Header Bar */}
          <div className="p-6 bg-secondary/30 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Scale className="size-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                  Fleet Specification Analysis
                </span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Hardware Comparison Matrix
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Comparing {items.length} hardware {items.length === 1 ? "model" : "models"}{" "}
                side-by-side.
              </DialogDescription>
            </div>

            <div className="flex items-center gap-3">
              {/* Highlight Differences Toggle */}
              {items.length >= 2 && (
                <button
                  type="button"
                  onClick={() => setHighlightDiffs(!highlightDiffs)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    highlightDiffs
                      ? "border-accent bg-accent/15 text-accent-700 dark:text-accent-400"
                      : "border-border bg-background hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <Sparkles className="size-3.5" />
                  <span>Highlight Differences</span>
                </button>
              )}

              {/* Clear All */}
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCompare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-destructive/10 hover:text-destructive text-xs font-semibold text-muted-foreground transition-all cursor-pointer"
                  title="Clear all comparison items"
                >
                  <Trash2 className="size-3.5" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Matrix Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="size-16 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                  <Scale className="size-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">No Models in Comparison</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Click the &ldquo;Compare&rdquo; button on any hardware model in the catalogue to
                    evaluate specifications side-by-side.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCompareModal}
                  className="px-6 py-2.5 rounded-full bg-brand-900 text-white dark:bg-brand-500 font-bold text-xs uppercase tracking-wider"
                >
                  Browse Catalogue
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  {/* Products Header Row */}
                  <thead>
                    <tr className="border-b border-border/80">
                      <th className="w-48 sm:w-56 p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider align-bottom">
                        Hardware Specifications
                      </th>
                      {items.map((item) => (
                        <th key={item.id} className="p-4 align-top w-64 max-w-[280px]">
                          <div className="space-y-3 p-4 rounded-2xl bg-secondary/30 border border-border/70 relative group">
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeFromCompare(item.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-card/80 hover:bg-destructive hover:text-white text-muted-foreground transition-colors cursor-pointer shadow-2xs"
                              title="Remove from comparison"
                              aria-label={`Remove ${item.name}`}
                            >
                              <X className="size-3.5" />
                            </button>

                            {/* Product Cover */}
                            <div className="relative aspect-4/3 w-full bg-background rounded-xl p-3 flex items-center justify-center overflow-hidden border border-border/40">
                              <Image
                                src={item.cover?.secureUrl || "/logo.png"}
                                alt={item.name}
                                fill
                                sizes="200px"
                                className="object-contain"
                              />
                            </div>

                            {/* Info */}
                            <div className="space-y-1">
                              {item.category && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
                                  {item.category.name}
                                </span>
                              )}
                              <h4 className="font-bold text-sm text-foreground line-clamp-2">
                                {item.name}
                              </h4>
                              {item.modelNumber && (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-background border border-border">
                                  {item.modelNumber}
                                </span>
                              )}
                            </div>

                            {/* Enquire CTA Button */}
                            <div className="pt-2 flex flex-col gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedEnquiryProduct({
                                    id: item.id,
                                    name: item.name,
                                    modelNumber: item.modelNumber,
                                    categoryName: item.category?.name,
                                    imageUrl: item.cover?.secureUrl,
                                    shortDescription: item.shortDescription,
                                  })
                                }
                                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-accent hover:bg-accent-600 text-accent-foreground font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer active:scale-95"
                              >
                                <MessageSquareQuote className="size-3.5" />
                                <span>Enquire</span>
                              </button>

                              <Link
                                href={`/catalogue/${item.slug}`}
                                onClick={closeCompareModal}
                                className="inline-flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:underline transition-colors"
                              >
                                <span>Full Spec Details</span>
                                <ExternalLink className="size-3" />
                              </Link>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Specification Rows */}
                  <tbody className="divide-y divide-border/60 text-xs">
                    {/* Model Overview Section */}
                    <tr className="bg-muted/40 font-bold">
                      <td
                        colSpan={items.length + 1}
                        className="p-3 text-[11px] uppercase tracking-wider text-foreground"
                      >
                        Overview &amp; Deployment Scope
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3.5 font-bold text-muted-foreground">Category</td>
                      {items.map((item) => (
                        <td key={item.id} className="p-3.5 text-foreground font-medium">
                          {item.category?.name || "General Hardware"}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-3.5 font-bold text-muted-foreground">Model Number</td>
                      {items.map((item) => (
                        <td key={item.id} className="p-3.5 font-mono font-bold text-foreground">
                          {item.modelNumber || "—"}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="p-3.5 font-bold text-muted-foreground align-top">Summary</td>
                      {items.map((item) => (
                        <td
                          key={item.id}
                          className="p-3.5 text-muted-foreground leading-relaxed align-top"
                        >
                          {item.shortDescription || "Commercial enterprise hardware."}
                        </td>
                      ))}
                    </tr>

                    {/* Highlights Section */}
                    <tr className="bg-muted/40 font-bold">
                      <td
                        colSpan={items.length + 1}
                        className="p-3 text-[11px] uppercase tracking-wider text-foreground"
                      >
                        Key Capabilities &amp; Highlights
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-muted-foreground align-top">
                        Engineered Features
                      </td>
                      {items.map((item) => (
                        <td key={item.id} className="p-3.5 align-top">
                          {item.highlights && item.highlights.length > 0 ? (
                            <ul className="space-y-1.5">
                              {item.highlights.map((h) => (
                                <li key={h} className="flex items-start gap-1.5 text-foreground/90">
                                  <Check className="size-3 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Technical Specifications Section */}
                    <tr className="bg-muted/40 font-bold">
                      <td
                        colSpan={items.length + 1}
                        className="p-3 text-[11px] uppercase tracking-wider text-foreground"
                      >
                        Detailed Technical Specifications
                      </td>
                    </tr>

                    {allSpecLabels.length === 0 ? (
                      <tr>
                        <td
                          colSpan={items.length + 1}
                          className="p-4 text-center text-muted-foreground italic"
                        >
                          Technical specification datasheets available upon direct enquiry.
                        </td>
                      </tr>
                    ) : (
                      allSpecLabels.map((label) => {
                        const isDiff = isSpecDifferent(label);
                        const rowHighlighted = highlightDiffs && isDiff;

                        return (
                          <tr
                            key={label}
                            className={`transition-colors ${
                              rowHighlighted
                                ? "bg-accent/10 border-l-2 border-l-accent"
                                : "hover:bg-secondary/30"
                            }`}
                          >
                            <td className="p-3.5 font-bold text-foreground">
                              <div className="flex items-center gap-1.5">
                                <span>{label}</span>
                                {rowHighlighted && (
                                  <span
                                    className="size-1.5 rounded-full bg-accent shrink-0"
                                    title="Values differ between models"
                                  />
                                )}
                              </div>
                            </td>
                            {items.map((item) => {
                              const match = item.specs?.find(
                                (s) => s.label.toLowerCase().trim() === label.toLowerCase().trim(),
                              );
                              return (
                                <td key={item.id} className="p-3.5 font-medium text-foreground">
                                  {match ? (
                                    match.value
                                  ) : (
                                    <Minus className="size-3 text-muted-foreground" />
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Linked Enquiry Modal from comparison matrix */}
      {selectedEnquiryProduct && (
        <ProductEnquiryModal
          isOpen={!!selectedEnquiryProduct}
          onClose={() => setSelectedEnquiryProduct(null)}
          product={selectedEnquiryProduct}
        />
      )}
    </>
  );
}
