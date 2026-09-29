"use client";

import { CheckSquare, Trash2, X } from "lucide-react";
import type * as React from "react";

export interface BatchActionBarProps {
  selectedCount: number;
  totalCount?: number;
  itemLabel?: string;
  deleteLabel?: string;
  isDeleting?: boolean;
  onClear: () => void;
  onDeleteSelected: () => void;
  extraActions?: React.ReactNode;
}

export function BatchActionBar({
  selectedCount,
  itemLabel = "items",
  deleteLabel,
  isDeleting = false,
  onClear,
  onDeleteSelected,
  extraActions,
}: BatchActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      data-slot="batch-action-bar"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[calc(100%-2rem)] animate-in fade-in-0 slide-in-from-bottom-5 duration-200"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-card/95 border border-border shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            <CheckSquare className="size-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-foreground">
              {selectedCount} {selectedCount === 1 ? itemLabel.replace(/s$/, "") : itemLabel}{" "}
              selected
            </p>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Choose an action to apply across selection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {extraActions}

          <button
            type="button"
            disabled={isDeleting}
            onClick={onDeleteSelected}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold hover:bg-destructive/90 transition-all shadow-sm shadow-destructive/20 disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
            <span>{deleteLabel || `Delete (${selectedCount})`}</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            title="Clear selection"
            aria-label="Clear selection"
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
