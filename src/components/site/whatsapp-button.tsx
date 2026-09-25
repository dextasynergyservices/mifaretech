"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  className?: string;
  defaultMessage?: string;
  floating?: boolean; // if true, floats on bottom-left on mobile
}

export function WhatsAppButton({
  className,
  defaultMessage = "Hello Mifaretech, I would like to enquire about your retail POS and barcode hardware solutions.",
  floating = true,
}: WhatsAppButtonProps) {
  const rawNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, "") || "447448670925";

  const href = `https://wa.me/${rawNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-bold transition-all shadow-md active:scale-95",
        floating
          ? "fixed bottom-6 left-6 z-40 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white hover:shadow-lg sm:hidden"
          : "px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-wider",
        className,
      )}
      aria-label="Chat with Mifaretech on WhatsApp"
    >
      <MessageCircle className="size-5 shrink-0 fill-current" />
      <span className="text-xs font-bold tracking-wide">WhatsApp</span>
    </Link>
  );
}
