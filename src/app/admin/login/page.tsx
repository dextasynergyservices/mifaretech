"use client";

import { AlertCircle, ArrowRight, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // 2FA states
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [isBackupCode, setIsBackupCode] = useState(false);

  // Status & errors
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      });

      if (response.error) {
        if (response.error.status === 429) {
          setErrorMessage(
            "Rate limit exceeded: Too many sign-in attempts. Please wait 60 seconds before trying again.",
          );
        } else {
          setErrorMessage(response.error.message || "Invalid staff email or passphrase.");
        }
        setIsLoading(false);
        return;
      }

      // Check if 2FA verification is required
      if (
        (response.data as { twoFactorRedirect?: boolean })?.twoFactorRedirect ||
        (response.data as { user?: { twoFactorEnabled?: boolean } })?.user?.twoFactorEnabled
      ) {
        setIs2FAStep(true);
        setIsLoading(false);
        toast.info("Two-Factor Authentication required. Enter your authenticator code.");
        return;
      }

      toast.success("Authentication successful. Entering console...");
      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const errObj = err as { message?: string; status?: number };
      if (errObj.status === 429) {
        setErrorMessage("Rate limit exceeded: Maximum 5 attempts per minute.");
      } else {
        setErrorMessage(errObj.message || "An unexpected error occurred during sign in.");
      }
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (isBackupCode) {
        const res = await authClient.twoFactor.verifyBackupCode({
          code: totpCode.trim(),
        });
        if (res.error) {
          setErrorMessage(res.error.message || "Invalid backup code.");
          setIsLoading(false);
          return;
        }
      } else {
        const res = await authClient.twoFactor.verifyTotp({
          code: totpCode.trim(),
        });
        if (res.error) {
          setErrorMessage(res.error.message || "Invalid 6-digit TOTP verification code.");
          setIsLoading(false);
          return;
        }
      }

      toast.success("2FA verified. Redirecting...");
      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setErrorMessage(errObj.message || "Verification failed. Check code and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-background">
      {/* Ambient background styling */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-600/10 dark:bg-brand-500/10 blur-[130px] rounded-full" />
        <div className="absolute -bottom-40 right-10 w-[400px] h-[400px] bg-accent/5 dark:bg-accent/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-3xl border border-border/80 bg-card/85 dark:bg-card/60 backdrop-blur-xl shadow-2xl p-8 sm:p-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group transition-transform active:scale-95"
            >
              <div className="relative size-10 rounded-2xl overflow-hidden shadow-xs">
                <Image
                  src="/logo.png"
                  alt="Mifaretech"
                  fill
                  sizes="40px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-black tracking-tight text-foreground">
                Mifare<span className="text-brand-600 dark:text-brand-400">tech</span>
              </span>
            </Link>

            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                {is2FAStep ? "Two-Factor Verification" : "Sign In to Admin"}
              </h1>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                {is2FAStep
                  ? "Enter the 6-digit code from your authenticator app to complete verification."
                  : "Access the Mifaretech fleet management and hardware operations console."}
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-2.5 text-xs animate-in fade-in duration-200">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Form Step 1: Credentials */}
          {!is2FAStep ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-email"
                  className="text-xs font-bold text-foreground flex items-center justify-between"
                >
                  <span>Staff Email</span>
                </label>
                <div className="relative flex items-center rounded-2xl border border-border/80 bg-background shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <Mail className="size-4 text-muted-foreground ml-3.5 shrink-0 pointer-events-none" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="staff@mifaretech.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-3 text-xs text-foreground bg-transparent placeholder:text-muted-foreground/60 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="admin-password" className="text-xs font-bold text-foreground">
                    Passphrase
                  </label>
                  <Link
                    href="/admin/forgot-password"
                    className="text-xs font-semibold text-brand-700 dark:text-brand-400 hover:underline"
                  >
                    Forgot passphrase?
                  </Link>
                </div>
                <div className="relative flex items-center rounded-2xl border border-border/80 bg-background shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <KeyRound className="size-4 text-muted-foreground ml-3.5 shrink-0 pointer-events-none" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter passphrase"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-3 text-xs text-foreground bg-transparent placeholder:text-muted-foreground/60 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="mr-3 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-4 rounded border-border text-brand-600 focus:ring-brand-500/20 cursor-pointer"
                  />
                  <span>Remember this terminal</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white hover:bg-brand-800 dark:hover:bg-brand-400 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Form Step 2: 2FA Verification */
            <form onSubmit={handle2FASubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-totp"
                  className="text-xs font-bold text-foreground flex items-center justify-between"
                >
                  <span>
                    {isBackupCode ? "Emergency Backup Code" : "6-Digit Authenticator Code"}
                  </span>
                </label>
                <div className="relative flex items-center rounded-2xl border border-border/80 bg-background shadow-xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <ShieldCheck className="size-4 text-muted-foreground ml-3.5 shrink-0 pointer-events-none" />
                  <input
                    id="admin-totp"
                    type="text"
                    required
                    maxLength={isBackupCode ? 24 : 6}
                    placeholder={isBackupCode ? "xxxx-xxxx-xxxx" : "000 000"}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\s+/g, ""))}
                    className="w-full px-3 py-3 text-sm font-mono tracking-widest text-center text-foreground bg-transparent placeholder:text-muted-foreground/40 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsBackupCode(!isBackupCode);
                    setTotpCode("");
                  }}
                  className="text-xs font-semibold text-brand-700 dark:text-brand-400 hover:underline cursor-pointer"
                >
                  {isBackupCode ? "Use Authenticator App" : "Lost phone? Use Backup Code"}
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white hover:bg-brand-800 dark:hover:bg-brand-400 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Verifying 2FA...</span>
                  ) : (
                    <>
                      <span>Complete Sign In</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIs2FAStep(false);
                    setTotpCode("");
                    setErrorMessage(null);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  &larr; Back to login credentials
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Back to public site */}
        <div className="text-center pt-6">
          <Link
            href="/"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
          >
            <span>&larr; Return to public site</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="size-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
