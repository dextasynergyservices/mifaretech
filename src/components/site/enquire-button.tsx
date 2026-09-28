"use client";

import { MessageSquareQuote } from "lucide-react";
import { useState } from "react";
import { ProductEnquiryModal } from "@/components/site/product-enquiry-modal";

interface EnquireButtonProps {
  product: {
    id: string;
    name: string;
    modelNumber?: string | null;
    category?: { name: string } | null;
    cover?: { secureUrl: string } | null;
    shortDescription?: string | null;
  };
  quantity?: number;
  className?: string;
  variant?: "primary" | "secondary" | "pill";
  label?: string;
}

export function EnquireButton({
  product,
  className = "",
  variant = "primary",
  label = "Enquire",
}: EnquireButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const baseStyles =
    "inline-flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer active:scale-95 text-xs uppercase tracking-wider";

  const variants = {
    primary:
      "px-5 py-2.5 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground shadow-sm",
    secondary: "px-4 py-2 rounded-full border border-border bg-card hover:bg-muted text-foreground",
    pill: "px-3.5 py-1.5 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground text-[11px]",
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        aria-label={`Enquire about ${product.name}`}
      >
        <MessageSquareQuote className="size-3.5" />
        <span>{label}</span>
      </button>

      <ProductEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          modelNumber: product.modelNumber,
          categoryName: product.category?.name,
          imageUrl: product.cover?.secureUrl,
          shortDescription: product.shortDescription,
        }}
      />
    </>
  );
}
