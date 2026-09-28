"use client";

import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await authClient.requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: "/admin/reset-password",
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Failed to process reset request.");
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
      toast.success("Password reset instructions sent.");
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
                Reset Staff Passphrase
              </h1>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Enter your authorized Mifaretech email address and we will send you a secure reset
                link.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-2.5 text-xs">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSubmitted ? (
            <div className="space-y-6 text-center">
              <div className="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-6" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-foreground">Reset Instructions Dispatched</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If <strong className="text-foreground">{email}</strong> matches an active staff
                  account, a secure reset link has been dispatched to your inbox.
                </p>
              </div>
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                <span>Return to Login</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="staff-email" className="text-xs font-bold text-foreground">
                  Staff Email Address
                </label>
                <div className="relative flex items-center rounded-2xl border border-border/80 bg-background shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <Mail className="size-4 text-muted-foreground ml-3.5 shrink-0 pointer-events-none" />
                  <input
                    id="staff-email"
                    type="email"
                    required
                    placeholder="staff@mifaretech.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-3 text-xs text-foreground bg-transparent placeholder:text-muted-foreground/60 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white hover:bg-brand-800 dark:hover:bg-brand-400 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Dispatching Link...</span>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>

                <Link
                  href="/admin/login"
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
