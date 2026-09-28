"use client";

import { Check, Scale } from "lucide-react";
import { toast } from "sonner";
import { type ComparableProduct, useCompareStore } from "@/lib/compare-store";

interface CompareToggleButtonProps {
  product: ComparableProduct;
  className?: string;
  variant?: "pill" | "icon" | "button";
}

export function CompareToggleButton({
  product,
  className = "",
  variant = "pill",
}: CompareToggleButtonProps) {
  const { isInCompare, toggleCompare, maxItems } = useCompareStore();
  const active = isInCompare(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!active) {
      const added = toggleCompare(product);
      if (!added) {
        toast.error(`You can compare up to ${maxItems} hardware models simultaneously.`);
      } else {
        toast.success(`Added ${product.name} to comparison.`);
      }
    } else {
      toggleCompare(product);
      toast.info(`Removed ${product.name} from comparison.`);
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`p-2 rounded-xl border transition-all cursor-pointer ${
          active
            ? "border-brand-600 bg-brand-500/15 text-brand-600 dark:text-brand-400"
            : "border-border/80 bg-background/80 hover:bg-secondary text-muted-foreground hover:text-foreground"
        } ${className}`}
        title={active ? "Remove from comparison" : "Add to hardware comparison"}
        aria-label={`Compare ${product.name}`}
      >
        <Scale className="size-4" />
      </button>
    );
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer ${
          active
            ? "border-brand-600 bg-brand-500/10 text-brand-700 dark:text-brand-300 shadow-xs"
            : "border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground"
        } ${className}`}
        aria-label={`Compare ${product.name}`}
      >
        {active ? (
          <>
            <Check className="size-3.5 text-brand-600 stroke-[3]" />
            <span>In Comparison</span>
          </>
        ) : (
          <>
            <Scale className="size-3.5" />
            <span>Compare Model</span>
          </>
        )}
      </button>
    );
  }

  // Default "pill" variant
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap backdrop-blur-md shadow-2xs ${
        active
          ? "border-brand-600 bg-brand-600 text-white"
          : "border-border/80 bg-card/90 hover:bg-secondary text-muted-foreground hover:text-foreground"
      } ${className}`}
      aria-label={`Compare ${product.name}`}
    >
      {active ? (
        <>
          <Check className="size-2.5 stroke-[3]" />
          <span>Comparing</span>
        </>
      ) : (
        <>
          <Scale className="size-2.5" />
          <span>Compare</span>
        </>
      )}
    </button>
  );
}
