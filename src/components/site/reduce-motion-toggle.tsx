"use client";

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useMotionPreference } from "@/components/providers";
import { cn } from "@/lib/utils";

interface ReduceMotionToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ReduceMotionToggle({ className, showLabel = false }: ReduceMotionToggleProps) {
  const { isReducedMotion, toggleReducedMotion } = useMotionPreference();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleReducedMotion}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 hover:bg-secondary text-foreground transition-colors text-xs font-semibold tracking-wider uppercase",
        isReducedMotion && "border-accent text-accent",
        className,
      )}
      aria-label={
        isReducedMotion
          ? "Enable animations (motion is currently reduced)"
          : "Reduce animations for accessibility"
      }
      title={isReducedMotion ? "Reduced motion active" : "Full animations active"}
    >
      {isReducedMotion ? (
        <EyeOff className="size-3.5 text-accent" />
      ) : (
        <Eye className="size-3.5 text-muted-foreground" />
      )}
      {showLabel && <span>{isReducedMotion ? "Motion: Off" : "Motion: On"}</span>}
    </button>
  );
}
