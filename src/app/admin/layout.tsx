import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    template: "%s | Mifaretech Admin",
    default: "Mifaretech Administration Console",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-brand-500/20">
      {children}
      <Toaster richColors position="top-right" />
    </div>
  );
}
