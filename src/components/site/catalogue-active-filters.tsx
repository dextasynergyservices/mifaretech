"use client";

import { RotateCcw, X } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useTransition } from "react";

interface CategoryOption {
  id: string;
  slug: string;
  name: string;
}

interface CatalogueActiveFiltersProps {
  categories: CategoryOption[];
  totalResults: number;
}

export function CatalogueActiveFilters({ categories, totalResults }: CatalogueActiveFiltersProps) {
  const [, startTransition] = useTransition();

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

  const hasActiveFilters = category !== "all" || Boolean(q);
  const currentCategory = categories.find((c) => c.slug === category);

  const handleClearAll = () => {
    startTransition(() => {
      setCategory("all");
      setQ(null);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="relative flex size-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
        </span>
        <span className="font-semibold text-foreground">
          {totalResults} {totalResults === 1 ? "hardware model" : "hardware models"}
        </span>
        <span>available for fleet deployment</span>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Applied:</span>

          {category !== "all" && currentCategory && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary border border-border text-foreground font-semibold text-[11px]">
              <span>{currentCategory.name}</span>
              <button
                type="button"
                onClick={() => setCategory("all")}
                className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Remove category filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {q && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary border border-border text-foreground font-semibold text-[11px]">
              <span>Keyword: &ldquo;{q}&rdquo;</span>
              <button
                type="button"
                onClick={() => setQ(null)}
                className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Remove search filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 dark:text-brand-400 hover:underline cursor-pointer ml-1"
          >
            <RotateCcw className="size-3" />
            <span>Clear all</span>
          </button>
        </div>
      )}
    </div>
  );
}
