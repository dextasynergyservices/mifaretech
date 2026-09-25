"use client";

import Lenis from "lenis";
import type React from "react";
import { useEffect } from "react";
import { useMotionPreference } from "@/components/providers";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const { isReducedMotion } = useMotionPreference();

  useEffect(() => {
    // Only run Lenis on fine-pointer (desktop) and when motion is NOT reduced
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer || isReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [isReducedMotion]);

  return <>{children}</>;
}
