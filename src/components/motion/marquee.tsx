"use client";

import type React from "react";
import { useMotionPreference } from "@/components/providers";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number; // duration in seconds
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  direction = "left",
  speed = 30,
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const { isReducedMotion } = useMotionPreference();

  return (
    <div className={cn("group relative flex overflow-hidden select-none", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-around gap-8 sm:gap-12 min-w-full",
          !isReducedMotion && "animate-marquee",
          !isReducedMotion && direction === "right" && "direction-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-around gap-8 sm:gap-12 min-w-full",
          !isReducedMotion && "animate-marquee",
          !isReducedMotion && direction === "right" && "direction-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
