"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

type MotionPreferenceContextType = {
  isReducedMotion: boolean;
  toggleReducedMotion: () => void;
};

const MotionPreferenceContext = React.createContext<MotionPreferenceContextType>({
  isReducedMotion: false,
  toggleReducedMotion: () => {},
});

export function useMotionPreference() {
  return React.useContext(MotionPreferenceContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [isReducedMotion, setIsReducedMotion] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Check saved preference or media query
    const saved = localStorage.getItem("mifaretech-reduced-motion");
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const shouldReduce = saved === "true" || (saved === null && mediaQuery.matches);
    setIsReducedMotion(shouldReduce);

    if (shouldReduce) {
      document.documentElement.setAttribute("data-motion", "reduced");
    } else {
      document.documentElement.removeAttribute("data-motion");
    }

    const handler = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("mifaretech-reduced-motion") === null) {
        setIsReducedMotion(e.matches);
        if (e.matches) {
          document.documentElement.setAttribute("data-motion", "reduced");
        } else {
          document.documentElement.removeAttribute("data-motion");
        }
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const toggleReducedMotion = React.useCallback(() => {
    setIsReducedMotion((prev) => {
      const next = !prev;
      localStorage.setItem("mifaretech-reduced-motion", String(next));
      if (next) {
        document.documentElement.setAttribute("data-motion", "reduced");
      } else {
        document.documentElement.removeAttribute("data-motion");
      }
      return next;
    });
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionPreferenceContext.Provider value={{ isReducedMotion, toggleReducedMotion }}>
        {children}
      </MotionPreferenceContext.Provider>
    </NextThemesProvider>
  );
}
