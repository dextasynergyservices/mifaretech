"use client";

import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage("Invalid or missing reset token. Please request a new reset link.");
      return;
    }

    if (newPassword.length < 12) {
      setErrorMessage("Password must be at least 12 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authClient.resetPassword({
        newPassword,
        token,
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Failed to reset password. Token may have expired.");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      toast.success("Password updated successfully.");
      setTimeout(() => {
        router.push("/admin/login");
      }, 2500);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setErrorMessage(errObj.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-background">
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-border/80 bg-card/85 dark:bg-card/60 backdrop-blur-xl shadow-2xl p-8 sm:p-10 space-y-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative size-10 rounded-2xl overflow-hidden shadow-xs">
              <Image
                src="/logo.png"
                alt="Mifaretech"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Set New Passphrase
              </h1>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Create a strong passphrase with at least 12 characters to secure your staff account.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-2.5 text-xs">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="space-y-6 text-center">
              <div className="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-6" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-foreground">Passphrase Updated!</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your new passphrase has been activated. Redirecting you to the login screen...
                </p>
              </div>
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                <span>Go to Login Now</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="new-password" className="text-xs font-bold text-foreground">
                  New Passphrase (min 12 chars)
                </label>
                <div className="relative flex items-center rounded-2xl border border-border/80 bg-background shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <KeyRound className="size-4 text-muted-foreground ml-3.5 shrink-0 pointer-events-none" />
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={12}
                    placeholder="Enter new passphrase"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-3 text-xs text-foreground bg-transparent placeholder:text-muted-foreground/60 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="mr-3 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirm-password" className="text-xs font-bold text-foreground">
                  Confirm Passphrase
                </label>
                <div className="relative flex items-center rounded-2xl border border-border/80 bg-background shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <Lock className="size-4 text-muted-foreground ml-3.5 shrink-0 pointer-events-none" />
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={12}
                    placeholder="Repeat new passphrase"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-3 text-xs text-foreground bg-transparent placeholder:text-muted-foreground/60 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white hover:bg-brand-800 dark:hover:bg-brand-400 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 pt-2"
              >
                {isLoading ? (
                  <span>Updating Passphrase...</span>
                ) : (
                  <>
                    <span>Confirm & Activate</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="size-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
