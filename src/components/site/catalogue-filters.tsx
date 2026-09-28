"use client";

import {
  Coins,
  Cpu,
  LayoutGrid,
  Monitor,
  Printer,
  RotateCcw,
  ScanBarcode,
  Search,
  SlidersHorizontal,
  TabletSmartphone,
  X,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { type ElementType, useEffect, useRef, useTransition } from "react";

interface CategoryOption {
  id: string;
  slug: string;
  name: string;
}

interface CatalogueFiltersProps {
  categories: CategoryOption[];
}

const CATEGORY_ICON_MAP: Record<string, ElementType> = {
  all: LayoutGrid,
  "pos-terminals": Monitor,
  "receipt-printers": Printer,
  "barcode-scanners": ScanBarcode,
  "cash-drawers": Coins,
  kiosks: TabletSmartphone,
  software: Cpu,
};

export function CatalogueFilters({ categories }: CatalogueFiltersProps) {
  const [isPending, startTransition] = useTransition();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withDefault("all").withOptions({
      shallow: false,
      startTransition,
    }),
  );

  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({
      shallow: false,
      throttleMs: 300,
      startTransition,
    }),
  );

  // Global keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const hasActiveFilters = category !== "all" || Boolean(q);
  const currentCategoryName =
    category === "all"
      ? "All Hardware"
      : categories.find((c) => c.slug === category)?.name || category;

  const handleResetFilters = () => {
    startTransition(() => {
      setCategory("all");
      setQ(null);
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Main Navigation & Search Bar Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Horizontal Category Pill Tabs */}
        <div className="relative flex-1 min-w-0">
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-card/80 dark:bg-card/40 backdrop-blur-xl border border-border/80 shadow-xs overflow-x-auto scrollbar-none"
          >
            {/* All Hardware Option */}
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none shrink-0 ${
                category === "all"
                  ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <LayoutGrid
                className={`size-3.5 transition-transform duration-200 ${
                  category === "all" ? "scale-110" : "group-hover:scale-105"
                }`}
              />
              <span>All Hardware</span>
            </button>

            {/* Individual Categories */}
            {categories.map((cat) => {
              const isSelected = category === cat.slug;
              const IconComponent = CATEGORY_ICON_MAP[cat.slug] || SlidersHorizontal;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.slug)}
                  className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none shrink-0 ${
                    isSelected
                      ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <IconComponent
                    className={`size-3.5 transition-transform duration-200 ${
                      isSelected ? "scale-110" : "group-hover:scale-105"
                    }`}
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Input Field */}
        <div className="relative shrink-0 w-full lg:w-80">
          <div className="relative flex items-center rounded-2xl bg-card border border-border/80 shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
            <Search className="size-4 text-muted-foreground ml-3.5 shrink-0 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search models, specs, SKUs..."
              value={q}
              onChange={(e) => setQ(e.target.value || null)}
              className="w-full px-3 py-2.5 text-xs text-foreground bg-transparent placeholder:text-muted-foreground/80 focus:outline-hidden"
            />
            {q ? (
              <button
                type="button"
                onClick={() => setQ(null)}
                className="mr-3 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex mr-3 px-1.5 py-0.5 rounded-md border border-border bg-muted/60 text-[10px] font-mono text-muted-foreground items-center justify-center">
                /
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* 2. Active Filters Indicator & Quick Actions */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground font-medium">Filtered by:</span>

            {category !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/80 border border-border text-foreground font-semibold text-[11px]">
                <span>Category: {currentCategoryName}</span>
                <button
                  type="button"
                  onClick={() => setCategory("all")}
                  className="p-0.5 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Remove category filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            {q && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/80 border border-border text-foreground font-semibold text-[11px]">
                <span>Search: &ldquo;{q}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setQ(null)}
                  className="p-0.5 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Remove search filter"
                >
                  <X className="size-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 dark:text-brand-400 hover:underline cursor-pointer ml-1"
            >
              <RotateCcw className="size-3" />
              <span>Reset all</span>
            </button>
          </div>
        </div>
      )}

      {/* Subtle loading progress indicator during async transitions */}
      {isPending && (
        <div className="h-0.5 w-full bg-secondary overflow-hidden rounded-full">
          <div className="h-full bg-brand-600 animate-pulse w-1/3" />
        </div>
      )}
    </div>
  );
}
