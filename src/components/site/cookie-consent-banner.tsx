"use client";

import { Check, Cookie, Settings2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface CookiePreferences {
  essential: boolean;
  security: boolean;
  analytics: boolean;
  timestamp: string;
}

const STORAGE_KEY = "mft_cookie_consent";

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomise, setShowCustomise] = useState(false);
  const [securityConsent, setSecurityConsent] = useState(true);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setIsOpen(true);
      } else {
        const parsed: CookiePreferences = JSON.parse(stored);
        setSecurityConsent(parsed.security ?? true);
        setAnalyticsConsent(parsed.analytics ?? true);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  const savePreferences = (prefs: { security: boolean; analytics: boolean }) => {
    const consentRecord: CookiePreferences = {
      essential: true,
      security: prefs.security,
      analytics: prefs.analytics,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentRecord));
      window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: consentRecord }));
    } catch (e) {
      console.error("Failed to persist cookie consent:", e);
    }

    setIsOpen(false);
  };

  const handleAcceptAll = () => {
    setSecurityConsent(true);
    setAnalyticsConsent(true);
    savePreferences({ security: true, analytics: true });
  };

  const handleEssentialOnly = () => {
    setSecurityConsent(false);
    setAnalyticsConsent(false);
    savePreferences({ security: false, analytics: false });
  };

  const handleSaveCustom = () => {
    savePreferences({ security: securityConsent, analytics: analyticsConsent });
  };

  if (!mounted || !isOpen) {
    return null;
  }

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-card/95 backdrop-blur-md border border-border/80 shadow-2xl rounded-2xl p-5 md:p-6 text-foreground">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
                <Cookie className="h-4 w-4 sm:hidden text-brand-orange" />
                Privacy &amp; Cookie Preferences
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              We use strictly necessary cookies to ensure quotation basket functionality and admin
              security. With your consent, we also load anti-spam bot verification (Google
              reCAPTCHA) and performance diagnostics. Read our{" "}
              <Link
                href="/privacy"
                className="text-brand-orange underline underline-offset-2 hover:text-brand-orange/80 font-medium"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/cookies"
                className="text-brand-orange underline underline-offset-2 hover:text-brand-orange/80 font-medium"
              >
                Cookie Policy
              </Link>
              .
            </p>

            {showCustomise && (
              <div className="pt-3 pb-1 border-t border-border/60 space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Strictly Essential</p>
                    <p className="text-[11px] text-muted-foreground">
                      Required for enquiry baskets, session tokens, and layout themes. Always
                      active.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-brand-orange font-medium px-2 py-0.5 rounded bg-brand-orange/10">
                    Required
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Security &amp; Bot Defense
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Google reCAPTCHA v3 verification on contact and quotation submission
                      endpoints.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityConsent}
                      onChange={(e) => setSecurityConsent(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-orange" />
                  </label>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40">
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Performance &amp; Web Vitals
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Aggregated telemetry to measure latency and page delivery speeds.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analyticsConsent}
                      onChange={(e) => setAnalyticsConsent(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-orange" />
                  </label>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomise((prev) => !prev)}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
              >
                <Settings2 className="h-3.5 w-3.5" />
                {showCustomise ? "Hide Details" : "Customise"}
              </button>

              <button
                type="button"
                onClick={handleEssentialOnly}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
              >
                Essential Only
              </button>

              {showCustomise ? (
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="px-4 py-1.5 text-xs font-medium rounded-lg bg-brand-orange text-white hover:bg-brand-orange/90 transition-colors shadow-sm inline-flex items-center gap-1"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Preferences
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-1.5 text-xs font-medium rounded-lg bg-brand-orange text-black hover:bg-brand-orange/90 transition-colors shadow-sm inline-flex items-center gap-1"
                >
                  Accept All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
