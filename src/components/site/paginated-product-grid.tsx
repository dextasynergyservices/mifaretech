"use client";

import { ArrowRight, CheckCircle2, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CompareToggleButton } from "./compare-toggle-button";
import { EnquireButton } from "./enquire-button";

export interface CatalogueProductItem {
  id: string;
  name: string;
  slug: string;
  modelNumber: string | null;
  shortDescription: string | null;
  highlights: string[];
  specs?: Array<{ groupName?: string | null; label: string; value: string }>;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  cover: {
    secureUrl: string;
  } | null;
}

interface PaginatedProductGridProps {
  products: CatalogueProductItem[];
  pageSize?: number;
}

export function PaginatedProductGrid({ products, pageSize = 6 }: PaginatedProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset pagination whenever product count changes (e.g. category or search filter changed)
  useEffect(() => {
    if (products.length >= 0) {
      setVisibleCount(pageSize);
    }
  }, [products.length, pageSize]);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + pageSize);
      setIsLoadingMore(false);
    }, 250);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-24 rounded-3xl bg-secondary/30 border border-border space-y-3">
        <SlidersHorizontal className="size-8 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-bold">No hardware models match your filters</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Try adjusting your category selection or clearing the search query to see our complete
          inventory.
        </p>
        <div className="pt-2">
          <Link
            href="/catalogue"
            className="px-5 py-2 rounded-full border border-border bg-card text-xs font-bold hover:bg-muted transition-colors inline-block"
          >
            Reset Filters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {Math.min(visibleCount, products.length)} of {products.length} models
        </span>
        <span>Prices provided upon formal enquiry</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8">
        {visibleProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-card border border-border hover:border-brand-500/50 transition-all duration-300 shadow-xs hover:shadow-lg group"
          >
            <div>
              <div className="relative aspect-4/3 w-full bg-secondary/30 rounded-2xl p-6 mb-5 flex items-center justify-center overflow-hidden">
                <div className="relative size-44 group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={product.cover?.secureUrl || "/logo.png"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                  />
                </div>

                {/* Top overlay badge bar: Category on left, Compare button on right */}
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

            {/* Actions: View Details & Enquire (balanced 50/50 with whitespace-nowrap) */}
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

      {/* Load More Pagination Button */}
      {hasMore ? (
        <div className="flex flex-col items-center justify-center pt-8 gap-3">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-900 text-white dark:bg-brand-500 dark:text-white hover:bg-brand-800 dark:hover:bg-brand-400 font-bold text-xs uppercase tracking-widest transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isLoadingMore ? <span>Loading Hardware...</span> : <span>Load More</span>}
          </button>
          <span className="text-[11px] text-muted-foreground">
            Displaying {visibleCount} of {products.length} models
          </span>
        </div>
      ) : products.length > pageSize ? (
        <div className="text-center pt-8 border-t border-border/40">
          <p className="text-xs text-muted-foreground font-medium">
            All {products.length} hardware models loaded
          </p>
        </div>
      ) : null}
    </div>
  );
}
