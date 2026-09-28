"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { resendEnquiryNotificationAction } from "@/server/actions/enquiries";

interface ResendNotificationButtonProps {
  enquiryId: string;
  currentStatus: string;
}

export function ResendNotificationButton({
  enquiryId,
  currentStatus,
}: ResendNotificationButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  const handleResend = () => {
    startTransition(async () => {
      try {
        const result = await resendEnquiryNotificationAction(enquiryId);
        if (result.success) {
          setStatus("sent");
          toast.success("Notification email resent successfully to sales inbox.");
        } else {
          toast.error(`Resend failed: ${result.error}`);
        }
      } catch (_err) {
        toast.error("Failed to connect to email server.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs ${
        status === "failed"
          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          : "bg-secondary text-secondary-foreground hover:bg-muted border border-border"
      }`}
    >
      {isPending ? (
        <>
          <Loader2 className="size-3.5 animate-spin" />
          <span>Sending...</span>
        </>
      ) : (
        <>
          <RefreshCw className="size-3.5" />
          <span>{status === "failed" ? "Resend notification" : "Send notification again"}</span>
        </>
      )}
    </button>
  );
}
