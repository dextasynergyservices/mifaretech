"use client";

import { AlertCircle, CheckCircle2, Copy, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function TwoFactorSecurityPage() {
  const { data: session } = authClient.useSession();

  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [setupData, setSetupData] = useState<{
    totpURI: string;
    backupCodes: string[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const isEnabled = session?.user?.twoFactorEnabled ?? false;

  const handleStartEnrolment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await authClient.twoFactor.enable({
        password,
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Failed to initiate 2FA setup. Check password.");
        setIsLoading(false);
        return;
      }

      if (res.data && "totpURI" in res.data) {
        setSetupData({
          totpURI: res.data.totpURI,
          backupCodes: res.data.backupCodes,
        });
        toast.info("Scan the QR code or copy the secret into your authenticator app.");
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setErrorMessage(errObj.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEnrolment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await authClient.twoFactor.verifyTotp({
        code: totpCode.trim(),
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Invalid 6-digit code. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Two-Factor Authentication is now enabled for your account!");
      setSetupData(null);
      setPassword("");
      setTotpCode("");
      window.location.reload();
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setErrorMessage(errObj.message || "Failed to verify 2FA code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await authClient.twoFactor.disable({
        password,
      });

      if (res.error) {
        setErrorMessage(res.error.message || "Failed to disable 2FA. Incorrect password.");
        setIsLoading(false);
        return;
      }

      toast.success("Two-Factor Authentication has been disabled.");
      setPassword("");
      window.location.reload();
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setErrorMessage(errObj.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Page Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <ShieldCheck className="size-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Two-Factor Authentication (2FA)
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Enforce multi-factor verification on login using standard Time-based One-Time Password
          (TOTP) apps like Google Authenticator, 1Password, or Microsoft Authenticator.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-2.5 text-xs">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Status Card */}
      <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {isEnabled ? (
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <ShieldCheck className="size-6" />
            </div>
          ) : (
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <ShieldAlert className="size-6" />
            </div>
          )}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">
              Status: {isEnabled ? "Active & Enforced" : "Not Enrolled"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isEnabled
                ? "Your account requires an authenticator code during every login."
                : "Your account is currently protected by passphrase only."}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase shrink-0 ${
            isEnabled
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
          }`}
        >
          {isEnabled ? "Protected" : "Vulnerable"}
        </span>
      </div>

      {/* Enrolment Workflow */}
      {!isEnabled && !setupData && (
        <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-5">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-foreground">Begin 2FA Setup</h2>
            <p className="text-xs text-muted-foreground">
              Please re-enter your administrator passphrase to generate your authenticator pairing
              key.
            </p>
          </div>

          <form onSubmit={handleStartEnrolment} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label htmlFor="confirm-passphrase" className="text-xs font-bold text-foreground">
                Current Passphrase
              </label>
              <div className="relative flex items-center rounded-xl border border-border bg-background shadow-xs focus-within:border-brand-500">
                <Lock className="size-4 text-muted-foreground ml-3 shrink-0 pointer-events-none" />
                <input
                  id="confirm-passphrase"
                  type="password"
                  required
                  placeholder="Enter current passphrase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-foreground bg-transparent focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate 2FA Pairing Key"}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Show QR/Secret & Verify */}
      {!isEnabled && setupData && (
        <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-foreground">Step 2: Connect Authenticator App</h2>
            <p className="text-xs text-muted-foreground">
              Open your authenticator app (Google Authenticator, Authy, or 1Password) and scan the
              pairing URI or enter the manual key below.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Manual Setup URI
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={setupData.totpURI}
                className="w-full font-mono text-xs p-2 rounded-lg bg-card border border-border text-foreground select-all"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(setupData.totpURI)}
                className="p-2 rounded-lg border border-border bg-card hover:bg-secondary text-foreground text-xs font-semibold cursor-pointer shrink-0"
              >
                {isCopied ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Backup Codes Section */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground block">
              Emergency Backup Codes (Save these now)
            </span>
            <p className="text-[11px] text-muted-foreground">
              If you lose access to your authenticator device, each of these one-time codes can be
              used to sign in. Store them in a secure password manager.
            </p>
            <div className="p-4 rounded-xl bg-muted/50 border border-border grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs font-bold text-foreground">
              {setupData.backupCodes.map((code) => (
                <span
                  key={code}
                  className="bg-card p-1.5 rounded-md text-center border border-border/60"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>

          {/* Verification Input */}
          <form onSubmit={handleVerifyEnrolment} className="space-y-4 max-w-sm pt-2">
            <div className="space-y-1.5">
              <label htmlFor="totp-verify-code" className="text-xs font-bold text-foreground">
                Enter 6-Digit Authenticator Code
              </label>
              <input
                id="totp-verify-code"
                type="text"
                required
                maxLength={6}
                placeholder="000000"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center tracking-widest font-mono text-sm px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || totpCode.length !== 6}
              className="w-full px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Confirm & Activate 2FA"}
            </button>
          </form>
        </div>
      )}

      {/* Disable 2FA Section (if currently enabled) */}
      {isEnabled && (
        <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-5">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-destructive">
              Disable Two-Factor Authentication
            </h2>
            <p className="text-xs text-muted-foreground">
              Disabling 2FA reduces your account security. You will be required to provide your
              passphrase to proceed.
            </p>
          </div>

          <form onSubmit={handleDisable2FA} className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label htmlFor="disable-passphrase" className="text-xs font-bold text-foreground">
                Current Passphrase
              </label>
              <input
                id="disable-passphrase"
                type="password"
                required
                placeholder="Enter passphrase to confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs text-foreground rounded-xl border border-border bg-background focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs uppercase tracking-wider hover:bg-destructive/90 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? "Disabling..." : "Disable 2FA"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
