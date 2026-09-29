"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface TableActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  variant?: "default" | "destructive";
  disabled?: boolean;
  separatorBefore?: boolean;
}

interface TableActionMenuProps {
  items: TableActionItem[];
  ariaLabel?: string;
}

export function TableActionMenu({ items, ariaLabel = "Row actions" }: TableActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const right = window.innerWidth - rect.right;
    const top = rect.bottom + 4;
    setMenuPosition({ top, right });
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`size-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
          isOpen
            ? "border-brand-500 bg-secondary text-foreground"
            : "border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground"
        }`}
        aria-label={ariaLabel}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="size-4" />
      </button>

      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`,
              zIndex: 9999,
            }}
            className="w-48 rounded-xl border border-border bg-popover/95 backdrop-blur-md shadow-xl py-1 text-xs text-popover-foreground animate-in fade-in-0 zoom-in-95 duration-100"
          >
            {items.map((item, idx) => (
              <div key={idx}>
                {item.separatorBefore && <div className="my-1 border-t border-border/60" />}
                {item.href ? (
                  <Link
                    href={item.href}
                    target={item.target}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted ${
                      item.variant === "destructive"
                        ? "text-destructive hover:bg-destructive/10"
                        : "text-foreground"
                    }`}
                  >
                    {item.icon && <span className="size-3.5 shrink-0 opacity-80">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      setIsOpen(false);
                      item.onClick?.();
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition-colors text-left cursor-pointer disabled:opacity-40 disabled:pointer-events-none hover:bg-muted ${
                      item.variant === "destructive"
                        ? "text-destructive hover:bg-destructive/10"
                        : "text-foreground"
                    }`}
                  >
                    {item.icon && <span className="size-3.5 shrink-0 opacity-80">{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                )}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
