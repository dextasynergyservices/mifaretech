"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEnquiryBasket } from "@/lib/basket-store";

export function MobileEnquiryBar() {
  const { itemCount, isLoaded } = useEnquiryBasket();
  const pathname = usePathname();

  // Don't show on contact page where the form and basket are already visible
  if (!isLoaded || itemCount === 0 || pathname === "/contact") {
    return null;
  }

  return (
    <div className="sm:hidden fixed bottom-4 inset-x-4 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Link
        href="/contact"
        className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-full bg-accent text-accent-foreground font-black text-xs uppercase tracking-wider shadow-xl active:scale-98 transition-transform border border-amber-300/40"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative size-6 rounded-full bg-black/15 flex items-center justify-center font-black text-xs">
            <ShoppingBag className="size-3.5" />
          </div>
          <span>View enquiry ({itemCount})</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold">
          <span>Complete</span>
          <ArrowRight className="size-3.5" />
        </div>
      </Link>
    </div>
  );
}
