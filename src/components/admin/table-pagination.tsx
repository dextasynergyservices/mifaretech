"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: TablePaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="border-t border-border px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-muted/20">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span>
          Showing <strong className="text-foreground font-semibold">{startItem}</strong> to{" "}
          <strong className="text-foreground font-semibold">{endItem}</strong> of{" "}
          <strong className="text-foreground font-semibold">{totalItems}</strong> entries
        </span>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-border/80 pl-3">
            <span className="text-[11px]">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="px-2 py-1 rounded-lg border border-border bg-card text-foreground font-medium text-xs focus:ring-1 focus:ring-brand-500/20 focus:outline-hidden cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Previous page"
        >
          <ChevronLeft className="size-3.5" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) =>
            p === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground font-mono">
                &hellip;
              </span>
            ) : (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-7 h-7 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === p
                    ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
                    : "border border-border bg-card hover:bg-secondary text-foreground"
                }`}
              >
                {p}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Next page"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
