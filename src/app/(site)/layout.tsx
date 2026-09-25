import type React from "react";
import { Suspense } from "react";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll";
import { BackToTop } from "@/components/site/back-to-top";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Suspense
          fallback={
            <header className="sticky top-0 z-50 h-16 w-full border-b border-border/80 bg-background/80" />
          }
        >
          <SiteHeader />
        </Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        <SiteFooter />
        <WhatsAppButton />
        <BackToTop />
      </div>
    </SmoothScrollProvider>
  );
}
