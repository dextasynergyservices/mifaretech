"use client";

import { motion } from "motion/react";
import type React from "react";
import { useMotionPreference } from "@/components/providers";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 24,
  className,
}: RevealProps) {
  const { isReducedMotion } = useMotionPreference();

  if (isReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface SplitLinesProps {
  lines: (string | React.ReactNode)[];
  className?: string;
  lineClassName?: string;
  delayStep?: number;
}

/**
 * Patterned directly after Noho's title-line-parent and title-line masks.
 * Displays line by line masked slide-up reveal on load.
 */
export function SplitLines({
  lines,
  className = "",
  lineClassName = "",
  delayStep = 0.1,
}: SplitLinesProps) {
  const { isReducedMotion } = useMotionPreference();

  return (
    <div className={`flex flex-col ${className}`}>
      {lines.map((line, idx) => {
        const lineKey = typeof line === "string" ? `${line}-${idx}` : `split-line-${idx}`;
        return (
          <div key={lineKey} className="overflow-hidden leading-tight">
            {isReducedMotion ? (
              <div className={lineClassName}>{line}</div>
            ) : (
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.65,
                  delay: idx * delayStep,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={lineClassName}
              >
                {line}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}
