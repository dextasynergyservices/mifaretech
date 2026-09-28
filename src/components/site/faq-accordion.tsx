"use client";

import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

export type FaqItem = {
  id?: string;
  question: string;
  answerHtml: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      {items.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={faq.id || faq.question}
            className="rounded-2xl border border-border bg-card overflow-hidden transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base cursor-pointer hover:bg-muted/40 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3">
                <HelpCircle className="size-4 text-brand-700 dark:text-brand-400 shrink-0" />
                <span>{faq.question}</span>
              </span>
              <ChevronDown
                className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-foreground" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div
                className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
