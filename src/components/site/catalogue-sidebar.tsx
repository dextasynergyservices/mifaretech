"use client";

import {
  Coins,
  Cpu,
  Filter,
  LayoutGrid,
  Monitor,
  Printer,
  RotateCcw,
  ScanBarcode,
  Search,
  SlidersHorizontal,
  Sparkles,
  TabletSmartphone,
  X,
} from "lucide-react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { type ElementType, useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface CategoryOption {
  id: string;
  slug: string;
  name: string;
  productCount?: number;
}

interface CatalogueSidebarProps {
  categories: CategoryOption[];
  totalProductsCount?: number;
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

const FEATURED_CAPABILITIES = [
  { label: "Touchscreen", query: "touchscreen" },
  { label: "Auto-Cutter", query: "auto-cutter" },
  { label: "2D QR Code", query: "2D" },
  { label: "Ethernet / LAN", query: "ethernet" },
  { label: "RJ11 Interface", query: "RJ11" },
  { label: "Windows IoT", query: "Windows" },
];

export function CatalogueSidebar({ categories, totalProductsCount }: CatalogueSidebarProps) {
  const [isPending, startTransition] = useTransition();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Keyboard shortcut '/' to focus search box
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

  // Floating mobile pill visibility tracking
  const [showFloatingPill, setShowFloatingPill] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingPill(window.scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth auto-scroll to top of catalogue grid when category or search changes (if scrolled down)
  const isInitialMount = useRef(true);
  useEffect(() => {
    // Depend on category and q to trigger re-scroll on change
    void category;
    void q;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const gridElement = document.getElementById("catalogue-grid");
    if (gridElement) {
      const rect = gridElement.getBoundingClientRect();
      if (rect.top < 60) {
        gridElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [category, q]);

  const totalCalculated =
    totalProductsCount ?? categories.reduce((acc, cat) => acc + (cat.productCount ?? 0), 0);

  const activeFiltersCount = (category !== "all" ? 1 : 0) + (q ? 1 : 0);

  const handleResetFilters = () => {
    startTransition(() => {
      setCategory("all");
      setQ(null);
    });
  };

  const handleCategorySelect = (slug: string) => {
    startTransition(() => {
      setCategory(slug);
    });
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const handleTagClick = (tagQuery: string) => {
    startTransition(() => {
      if (q?.toLowerCase() === tagQuery.toLowerCase()) {
        setQ(null);
      } else {
        setQ(tagQuery);
      }
    });
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  // Content for the filter sidebar (shared across desktop and mobile sheet)
  const filterContent = (
    <div className="space-y-6">
      {/* 1. Header & Reset Action */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-brand-700 dark:text-brand-400" />
          <h2 className="text-sm font-bold tracking-tight text-foreground uppercase">
            Filter Catalogue
          </h2>
          {activeFiltersCount > 0 && (
            <span className="size-5 rounded-full bg-brand-700 dark:bg-brand-400 text-white dark:text-brand-950 text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 dark:text-brand-400 hover:underline cursor-pointer"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 2. Search Input Field */}
      <div className="space-y-2">
        <label
          htmlFor="catalogue-search-input"
          className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
        >
          Keyword Search
        </label>
        <div className="relative flex items-center rounded-xl bg-card border border-border/80 shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
          <Search className="size-4 text-muted-foreground ml-3 shrink-0 pointer-events-none" />
          <input
            id="catalogue-search-input"
            ref={searchInputRef}
            type="text"
            placeholder="Model, specs, interface..."
            value={q}
            onChange={(e) => setQ(e.target.value || null)}
            className="w-full px-2.5 py-2 text-xs text-foreground bg-transparent placeholder:text-muted-foreground/70 focus:outline-hidden"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ(null)}
              className="mr-2.5 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="size-3" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex mr-2.5 px-1.5 py-0.5 rounded-md border border-border bg-muted/60 text-[10px] font-mono text-muted-foreground items-center justify-center">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* 3. Hardware Categories Facet */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            Hardware Categories
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            {categories.length} segments
          </span>
        </div>

        <div className="space-y-1">
          {/* All Hardware Option */}
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer select-none text-left ${
              category === "all"
                ? "bg-brand-900 text-white dark:bg-brand-600 dark:text-white shadow-xs font-semibold"
                : "text-foreground/80 hover:text-foreground hover:bg-secondary/70"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <LayoutGrid
                className={`size-4 shrink-0 transition-transform ${
                  category === "all"
                    ? "text-white"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span className="truncate">All Hardware</span>
            </div>
            {totalCalculated > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  category === "all"
                    ? "bg-white/20 text-white font-bold"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {totalCalculated}
              </span>
            )}
          </button>

          {/* Individual Category List */}
          {categories.map((cat) => {
            const isSelected = category === cat.slug;
            const IconComponent = CATEGORY_ICON_MAP[cat.slug] || SlidersHorizontal;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer select-none text-left ${
                  isSelected
                    ? "bg-brand-900 text-white dark:bg-brand-600 dark:text-white shadow-xs font-semibold"
                    : "text-foreground/80 hover:text-foreground hover:bg-secondary/70"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IconComponent
                    className={`size-4 shrink-0 transition-transform ${
                      isSelected
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>
                {cat.productCount !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                      isSelected
                        ? "bg-white/20 text-white font-bold"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {cat.productCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Common Technical Capability Tags */}
      <div className="space-y-2.5 pt-2 border-t border-border">
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-brand-600 dark:text-brand-400" />
          <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            Popular Capabilities
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FEATURED_CAPABILITIES.map((cap) => {
            const isSelected = q?.toLowerCase() === cap.query.toLowerCase();
            return (
              <button
                key={cap.label}
                type="button"
                onClick={() => handleTagClick(cap.query)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brand-700 text-white dark:bg-brand-400 dark:text-brand-950 font-bold shadow-xs"
                    : "bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/60"
                }`}
              >
                {cap.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Enterprise Sourcing & Consultation Callout Card */}
      <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 space-y-2.5">
        <p className="text-xs font-bold text-foreground">Custom Fleet Sourcing?</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Need custom OEM specs, dual-screen setups, or volume deployment pricing?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center text-[11px] font-bold text-brand-700 dark:text-brand-400 hover:underline pt-1"
        >
          Consult Hardware Engineers →
        </Link>
      </div>

      {/* Async Loading Indicator */}
      {isPending && (
        <div className="h-0.5 w-full bg-secondary overflow-hidden rounded-full">
          <div className="h-full bg-brand-600 animate-pulse w-1/3" />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* A. Desktop Left Sidebar (Sticky, Permanent Column) */}
      <aside className="hidden lg:block w-72 xl:w-80 shrink-0">
        <div className="sticky top-[88px] rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          {filterContent}
        </div>
      </aside>

      {/* B. Mobile Drawer Trigger Button & Off-Canvas Sheet */}
      <div className="lg:hidden w-full">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">
              {category === "all"
                ? "All Categories"
                : categories.find((c) => c.slug === category)?.name || category}
            </span>
            {q && <span className="text-xs text-muted-foreground">&middot; &ldquo;{q}&rdquo;</span>}
          </div>

          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs font-bold">
                  <SlidersHorizontal className="size-3.5" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="size-4 rounded-full bg-brand-700 text-white text-[10px] flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              }
            />

            <SheetContent side="left" className="w-[85vw] sm:max-w-md p-6 overflow-y-auto">
              <SheetHeader className="text-left pb-2">
                <SheetTitle className="text-base font-bold">Catalogue Filters</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Refine POS terminals, printers, and scanners.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4">{filterContent}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* C. Floating Mobile Filter Pill on Scroll (Zero scroll-up needed) */}
      {showFloatingPill && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-brand-950/95 dark:bg-brand-500/95 text-white shadow-2xl backdrop-blur-md border border-white/10 font-bold text-xs tracking-wide hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="size-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="size-4 rounded-full bg-accent text-accent-foreground text-[10px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
}
