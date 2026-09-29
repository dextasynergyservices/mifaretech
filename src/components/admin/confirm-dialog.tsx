"use client";

import { AlertTriangle, Loader2, ShieldAlert } from "lucide-react";
import type * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "warning" | "default";
  icon?: React.ReactNode;
  itemCount?: number;
  isPending?: boolean;
  showConfirmButton?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  icon,
  itemCount,
  isPending = false,
  showConfirmButton = true,
  onConfirm,
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive";
  const isWarning = variant === "warning";

  const defaultIcon = isDestructive ? (
    <div className="size-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-1">
      <AlertTriangle className="size-6" />
    </div>
  ) : isWarning ? (
    <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-1">
      <ShieldAlert className="size-6" />
    </div>
  ) : null;

  return (
    <Dialog open={open} onOpenChange={(val) => !isPending && onOpenChange(val)}>
      <DialogContent className="sm:max-w-md border-border/80 shadow-2xl backdrop-blur-md">
        <DialogHeader className="text-left space-y-3">
          {icon ?? defaultIcon}
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-base font-bold text-foreground tracking-tight">
              {title}
            </DialogTitle>
            {typeof itemCount === "number" && itemCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-destructive/15 text-destructive border border-destructive/20 whitespace-nowrap">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          {showConfirmButton && (
            <button
              type="button"
              disabled={isPending}
              onClick={async () => {
                await onConfirm();
              }}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                isDestructive
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20"
                  : isWarning
                    ? "bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/20"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
              }`}
            >
              {isPending && <Loader2 className="size-3.5 animate-spin" />}
              <span>{confirmLabel}</span>
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
