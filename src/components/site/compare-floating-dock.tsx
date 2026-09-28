"use client";

import { ArrowRight, Scale, X } from "lucide-react";
import Image from "next/image";
import { useCompareStore } from "@/lib/compare-store";
import { CompareModal } from "./compare-modal";

const EMPTY_SLOTS = ["slot-empty-1", "slot-empty-2", "slot-empty-3", "slot-empty-4"];

export function CompareFloatingDock() {
  const {
    items,
    itemCount,
    isHydrated,
    maxItems,
    removeFromCompare,
    clearCompare,
    openCompareModal,
  } = useCompareStore();

  if (!isHydrated || itemCount === 0) {
    return <CompareModal />;
  }

  return (
    <>
      <aside
        aria-label="Product comparison dock"
        className="fixed bottom-6 inset-x-0 z-40 pointer-events-none flex justify-center px-4 animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="pointer-events-auto max-w-2xl w-full bg-card/95 dark:bg-card/90 backdrop-blur-xl border border-border/90 shadow-2xl rounded-2xl sm:rounded-full p-2 sm:p-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 ring-1 ring-black/5">
          {/* Left: Indicator & Thumbnails */}
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center gap-2 pl-2 shrink-0">
              <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <Scale className="size-4" />
              </div>
              <div className="leading-tight hidden sm:block">
                <span className="text-xs font-black text-foreground block">Compare</span>
                <span className="text-[10px] text-muted-foreground block font-mono">
                  {itemCount} of {maxItems} models
                </span>
              </div>
            </div>

            {/* Thumbnail Pills */}
            <div className="flex items-center gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative group size-10 rounded-xl bg-secondary/60 border border-border/80 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs"
                  title={`${item.name} (${item.modelNumber || "HW"})`}
                >
                  <Image
                    src={item.cover?.secureUrl || "/logo.png"}
                    alt={item.name}
                    width={32}
                    height={32}
                    className="object-contain p-1"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCompare(item.id);
                    }}
                    className="absolute inset-0 bg-destructive/90 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    title="Remove from comparison"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}

              {/* Placeholder empty slots */}
              {EMPTY_SLOTS.slice(0, Math.max(0, maxItems - itemCount)).map((slotKey) => (
                <div
                  key={slotKey}
                  className="size-10 rounded-xl border border-dashed border-border/60 flex items-center justify-center shrink-0 text-muted-foreground/40 text-[10px] select-none"
                >
                  +
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button
              type="button"
              onClick={clearCompare}
              className="px-3 py-2 rounded-xl sm:rounded-full hover:bg-secondary text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Clear all"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={openCompareModal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl sm:rounded-full bg-brand-900 text-white dark:bg-brand-500 font-bold text-xs uppercase tracking-wider hover:bg-brand-800 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <span>Compare Now ({itemCount})</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <CompareModal />
    </>
  );
}
