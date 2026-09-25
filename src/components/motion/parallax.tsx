"use client";

import { motion, useScroll, useTransform } from "motion/react";
import type React from "react";
import { useRef } from "react";
import { useMotionPreference } from "@/components/providers";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: React.ReactNode;
  offset?: number; // pixel offset to move
  className?: string;
}

export function Parallax({ children, offset = 50, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isReducedMotion } = useMotionPreference();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  if (isReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
