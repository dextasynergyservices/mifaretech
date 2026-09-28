"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Reveal, SplitLines } from "@/components/motion/reveal";
import { useEnquiryBasket } from "@/lib/basket-store";
import { submitEnquiry, submitEnquiryNativeAction } from "@/server/actions/enquiries";
import { type BUSINESS_TYPES, type EnquiryInput, enquirySchema } from "@/server/validators/enquiry";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export type EnquiryFormValues = {
  name: string;
  company?: string | null;
  email: string;
  phone: string;
  businessType?: (typeof BUSINESS_TYPES)[number] | null;
  terminalCount?: number | null;
  message: string;
  items: { productId: string; quantity: number }[];
  quizAnswers?: Record<string, string | string[]>;
  source: "contact_form" | "catalogue" | "product_page" | "quiz";
  consent: boolean;
  captchaToken: string;
  website?: string;
};

async function getCaptchaToken(): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey || siteKey.includes("placeholder") || typeof window === "undefined") {
    return "dev-token";
  }
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve("dev-token");
    }, 2000);

    try {
      if (!window.grecaptcha) {
        clearTimeout(timer);
        return resolve("dev-token");
      }
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha?.execute(siteKey, { action: "enquiry" });
          clearTimeout(timer);
          resolve(token || "dev-token");
        } catch {
          clearTimeout(timer);
          resolve("dev-token");
        }
      });
    } catch {
      clearTimeout(timer);
      resolve("dev-token");
    }
  });
}

export function ContactContent() {
  const searchParams = useSearchParams();
  const { items, itemCount, removeItem, updateQuantity, clearBasket } = useEnquiryBasket();
  const [isPending, startTransition] = useTransition();

  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [quizDetails, setQuizDetails] = useState<Record<string, string> | null>(null);

  // Check if reference is in URL (e.g. from progressive enhancement redirect)
  useEffect(() => {
    const refParam = searchParams.get("ref");
    if (refParam) {
      setSubmittedReference(refParam);
      clearBasket();
    }
  }, [searchParams, clearBasket]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    // biome-ignore lint/suspicious/noExplicitAny: zod resolver schema generic variance
    resolver: zodResolver(enquirySchema) as any,
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      businessType: "retail",
      terminalCount: 1,
      message: "",
      consent: true,
      website: "",
      source: "contact_form",
      captchaToken: "dev-token",
      items: [],
    },
  });

  const currentSource = watch("source");

  // Keep form items in sync with global enquiry basket
  useEffect(() => {
    setValue(
      "items",
      items.map((i) => ({ productId: i.id, quantity: i.quantity })),
    );
  }, [items, setValue]);

  // Handle URL query parameters and pre-fill from Quiz or Catalogue
  useEffect(() => {
    const sourceParam = searchParams.get("source");
    const businessParam = searchParams.get("business");
    const tillsParam = searchParams.get("tills");
    const industryParam = searchParams.get("industry");
    const datasheetParam = searchParams.get("datasheet");

    const isQuiz = sourceParam === "quiz";
    let storedQuizData: Record<string, string> | null = null;

    try {
      const stored = localStorage.getItem("mifaretech-quiz-answers");
      if (stored) {
        storedQuizData = JSON.parse(stored);
      }
    } catch {
      // ignore in private browsing
    }

    if (isQuiz || storedQuizData) {
      setValue("source", "quiz");
      const combinedQuiz = {
        business: businessParam || storedQuizData?.business || "",
        tills: tillsParam || storedQuizData?.tills || "",
        priority: storedQuizData?.priority || "",
        recommendation: storedQuizData?.recommendedProduct || "",
      };
      setQuizDetails(combinedQuiz);
      setValue("quizAnswers", combinedQuiz);

      // Auto-map business sector if recognized
      const busLower = (businessParam || storedQuizData?.business || "").toLowerCase();
      if (busLower.includes("retail")) setValue("businessType", "retail");
      else if (busLower.includes("restaurant") || busLower.includes("cafe"))
        setValue("businessType", "restaurant");
      else if (busLower.includes("supermarket")) setValue("businessType", "supermarket");
      else if (busLower.includes("pharmacy")) setValue("businessType", "pharmacy");
      else if (busLower.includes("hotel") || busLower.includes("hospitality"))
        setValue("businessType", "hospitality");

      // Auto-map terminal count estimate
      const tillsStr = tillsParam || storedQuizData?.tills || "";
      if (tillsStr.includes("1–2") || tillsStr.includes("1-2")) setValue("terminalCount", 2);
      else if (tillsStr.includes("3–5") || tillsStr.includes("3-5")) setValue("terminalCount", 4);
      else if (tillsStr.includes("6+")) setValue("terminalCount", 6);

      let quizMsg = `Hardware Advisor Quiz setup: ${combinedQuiz.business || "Business"} requiring ${combinedQuiz.tills || "terminals"}.`;
      if (combinedQuiz.recommendation) {
        quizMsg += ` Recommended setup: ${combinedQuiz.recommendation}.`;
      }
      setValue("message", quizMsg);
    } else if (datasheetParam) {
      setValue("source", "catalogue");
      setValue(
        "message",
        `Please provide the full technical datasheet, pinout blueprints, and driver package for ${datasheetParam}.`,
      );
    } else if (industryParam) {
      setValue("source", "catalogue");
      setValue(
        "message",
        `We are enquiring about the ${industryParam} hardware bundle for our counters.`,
      );
    }
  }, [searchParams, setValue]);

  const onInvalidSubmit = (errors: unknown) => {
    console.warn("Contact form validation failed:", errors);
  };

  const onValidSubmit = async (data: EnquiryFormValues) => {
    setServerError(null);

    startTransition(async () => {
      try {
        // Invisible reCAPTCHA v3 execution
        const token = await getCaptchaToken();
        const payload: EnquiryInput = {
          name: data.name,
          company: data.company || null,
          email: data.email,
          phone: data.phone,
          businessType: data.businessType || null,
          terminalCount: data.terminalCount ? Number(data.terminalCount) : null,
          message: data.message,
          source: data.source,
          consent: data.consent,
          quizAnswers: data.quizAnswers,
          captchaToken: token,
          website: data.website || "",
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        };

        const result = await submitEnquiry(payload);

        if (result.ok) {
          setSubmittedReference(result.reference);
          clearBasket();
          try {
            localStorage.removeItem("mifaretech-quiz-answers");
          } catch {
            // ignore
          }
        } else {
          setServerError(result.error);
        }
      } catch (err) {
        console.error("Submission failed:", err);
        setServerError(
          "An unexpected connection error occurred. Please try again or chat with our team on WhatsApp.",
        );
      }
    });
  };

  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <div className="flex flex-col gap-16 pb-24 pt-8 sm:pt-14 overflow-x-hidden">
      {/* reCAPTCHA v3 script */}
      {recaptchaSiteKey && !recaptchaSiteKey.includes("placeholder") && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="lazyOnload"
        />
      )}

      {/* 1. Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl space-y-3">
          <span className="editorial-badge">Direct Sales &amp; Quotations</span>
          <SplitLines
            lines={[
              <span key="1" className="text-4xl sm:text-6xl font-black tracking-tight">
                Request a formal quote
              </span>,
              <span
                key="2"
                className="text-4xl sm:text-6xl font-black tracking-tight text-brand-700 dark:text-brand-300"
              >
                or counter consultation.
              </span>,
            ]}
          />
          <Reveal delay={0.2}>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Our hardware specialists review every enquiry individually to provide precise quotes,
              volume discounts, and peripheral compatibility advice.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. Main Form & Contact Info Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Column */}
          <div className="lg:col-span-8 p-6 sm:p-10 rounded-3xl bg-card border border-border shadow-xs">
            {submittedReference ? (
              <div className="text-center py-12 space-y-6">
                <div className="inline-flex size-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 items-center justify-center">
                  <CheckCircle2 className="size-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Enquiry Received</h3>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted font-mono text-sm border border-border">
                    <span className="text-muted-foreground">Reference:</span>
                    <strong className="text-foreground text-base tracking-wider">
                      {submittedReference}
                    </strong>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto pt-3 leading-relaxed">
                    A hardware specialist has received your specifications and will reply with
                    formal pricing, port compatibility, and dispatch availability within{" "}
                    <strong>2 business hours</strong>.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/447448670925?text=Hello%20Mifaretech,%20I%20have%20submitted%20enquiry%20${submittedReference}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <MessageCircle className="size-4" />
                    <span>Follow up on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedReference(null);
                      setQuizDetails(null);
                    }}
                    className="px-6 py-3 rounded-full border border-border hover:bg-muted text-xs font-bold transition-colors cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form
                action={submitEnquiryNativeAction}
                onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
                className="space-y-6"
              >
                {/* Hidden fields for graceful degradation without JS */}
                <input type="hidden" name="source" value={currentSource} />
                <input
                  type="hidden"
                  name="items"
                  value={JSON.stringify(
                    items.map((i) => ({ productId: i.id, quantity: i.quantity })),
                  )}
                />
                {quizDetails && (
                  <input type="hidden" name="quizAnswers" value={JSON.stringify(quizDetails)} />
                )}

                {/* Server Error / Rate Limit Banner */}
                {serverError && (
                  <div className="p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-start gap-3">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold">Submission Notice</p>
                      <p>{serverError}</p>
                    </div>
                  </div>
                )}

                {/* Quiz Pre-fill Notification Badge */}
                {quizDetails && (
                  <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="size-4 text-brand-600 dark:text-brand-400 shrink-0" />
                      <div>
                        <p className="font-bold text-foreground">Hardware Advisor Setup Attached</p>
                        <p className="text-muted-foreground text-[11px]">
                          {quizDetails.business} &bull; {quizDetails.tills}
                          {quizDetails.recommendation && ` &bull; ${quizDetails.recommendation}`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuizDetails(null)}
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Clear quiz data"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}

                {/* Hardware Basket Summary (Chips) */}
                <div className="space-y-3 pb-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Selected Hardware Devices ({itemCount})
                    </span>
                    {itemCount > 0 && (
                      <button
                        type="button"
                        onClick={clearBasket}
                        className="text-xs text-muted-foreground hover:text-destructive underline cursor-pointer"
                      >
                        Clear Basket
                      </button>
                    )}
                  </div>

                  {items.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-secondary/30 border border-dashed border-border text-center">
                      <p className="text-xs text-muted-foreground">
                        Your enquiry basket is currently empty. You can submit a general fleet
                        consultation, or{" "}
                        <a
                          href="/catalogue"
                          className="text-brand-700 dark:text-brand-300 underline font-bold"
                        >
                          browse the catalogue
                        </a>{" "}
                        to attach specific hardware models.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50 border border-border text-xs gap-3"
                        >
                          <div className="min-w-0">
                            <p className="font-bold truncate text-foreground">{item.name}</p>
                            {item.modelNumber && (
                              <p className="text-[11px] text-muted-foreground font-mono">
                                {item.modelNumber}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center border border-border rounded-xl bg-card overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2.5 py-1 text-xs hover:bg-muted font-bold cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2.5 py-1 text-xs hover:bg-muted font-bold cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive cursor-pointer p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Contact Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="e.g. David Smith"
                      {...register("name")}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                        errors.name ? "border-destructive ring-1 ring-destructive" : "border-border"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-company"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Company / Organization
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      placeholder="e.g. Apex Retail Ltd"
                      {...register("company")}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                        errors.company
                          ? "border-destructive ring-1 ring-destructive"
                          : "border-border"
                      }`}
                    />
                    {errors.company && (
                      <p className="text-[11px] text-destructive">{errors.company.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Work Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="d.smith@example.com"
                      {...register("email")}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                        errors.email
                          ? "border-destructive ring-1 ring-destructive"
                          : "border-border"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-phone"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Phone / Mobile Number *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+44 7448 670925"
                      {...register("phone")}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                        errors.phone
                          ? "border-destructive ring-1 ring-destructive"
                          : "border-border"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Scope & Business Profile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-business"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Business Sector
                    </label>
                    <select
                      id="contact-business"
                      {...register("businessType")}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="retail">Retail Boutique / General Store</option>
                      <option value="supermarket">Supermarket &amp; FMCG</option>
                      <option value="restaurant">Restaurant, Cafe &amp; Bar</option>
                      <option value="pharmacy">Pharmacy &amp; Health Store</option>
                      <option value="hospitality">Hotel &amp; Lodging</option>
                      <option value="other">Other Commercial Business</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-terminals"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Number of Terminals Needed
                    </label>
                    <input
                      id="contact-terminals"
                      type="number"
                      min="1"
                      max="10000"
                      {...register("terminalCount")}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                        errors.terminalCount
                          ? "border-destructive ring-1 ring-destructive"
                          : "border-border"
                      }`}
                    />
                    {errors.terminalCount && (
                      <p className="text-[11px] text-destructive">{errors.terminalCount.message}</p>
                    )}
                  </div>
                </div>

                {/* Message Details */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Project Details &amp; Specific Requirements *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Tell us about your counter layout, software environment, timeline, or required peripheral connections..."
                    {...register("message")}
                    className={`w-full p-4 rounded-xl border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                      errors.message
                        ? "border-destructive ring-1 ring-destructive"
                        : "border-border"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-destructive">{errors.message.message}</p>
                  )}
                </div>

                {/* Honeypot field (hidden from legitimate users, robots auto-fill it) */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    zIndex: -1,
                    pointerEvents: "none",
                    height: 0,
                    overflow: "hidden",
                  }}
                >
                  <label htmlFor="website-field">Leave this field blank</label>
                  <input
                    id="website-field"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("website")}
                  />
                </div>

                {/* Consent checkbox */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="consent"
                      {...register("consent")}
                      className="size-4 mt-0.5 rounded border-border text-brand-700 cursor-pointer"
                    />
                    <label
                      htmlFor="consent"
                      className="text-xs text-muted-foreground leading-snug cursor-pointer select-none"
                    >
                      I agree to Mifaretech processing my information to provide hardware quotations
                      and technical specifications in accordance with the{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        className="text-brand-700 dark:text-brand-300 underline font-bold"
                        rel="noopener"
                      >
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>
                  {errors.consent && (
                    <p className="text-[11px] text-destructive pl-6">{errors.consent.message}</p>
                  )}
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-4 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  <Send className="size-4" />
                  <span>{isPending ? "Submitting Formal Enquiry..." : "Send Formal Enquiry"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Fast Contact & WhatsApp Box */}
          <div className="lg:col-span-4 space-y-6">
            {/* WhatsApp Direct Chat card */}
            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-4">
              <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
                <MessageCircle className="size-6 shrink-0" />
                <h4 className="text-base font-bold">Fast WhatsApp Response</h4>
              </div>
              <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">
                Need quick advice on model stock or immediate peripheral specs? Chat directly with
                our POS specialist.
              </p>
              <a
                href="https://wa.me/447448670925?text=Hello%20Mifaretech,%20I%20would%20like%20to%20enquire%20about%20your%20POS%20hardware"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Direct Channel Details */}
            <div className="p-6 rounded-3xl bg-card border border-border space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Office &amp; Support
              </h4>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Phone className="size-4 text-brand-700 dark:text-brand-300 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">Direct &amp; WhatsApp</p>
                    <a href="tel:+447448670925" className="text-muted-foreground hover:underline">
                      +44 7448 670925
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="size-4 text-brand-700 dark:text-brand-300 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">Sales &amp; Quotations</p>
                    <a
                      href="mailto:sales@mifaretech.co.uk"
                      className="text-muted-foreground hover:underline"
                    >
                      sales@mifaretech.co.uk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="size-4 text-brand-700 dark:text-brand-300 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">Operating Hours</p>
                    <p className="text-muted-foreground">Mon – Fri: 08:30 – 17:30 GMT</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="size-4 text-brand-700 dark:text-brand-300 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">Distribution Hubs</p>
                    <p className="text-muted-foreground">United Kingdom &amp; West Africa</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                <span>Encrypted transmission &amp; strict privacy guarantee.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
