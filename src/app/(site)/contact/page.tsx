"use client";

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
  Trash2,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Reveal, SplitLines } from "@/components/motion/reveal";
import { useEnquiryBasket } from "@/lib/basket-store";

export default function ContactPage() {
  const { items, itemCount, removeItem, updateQuantity, clearBasket } = useEnquiryBasket();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    businessType: "retail",
    terminalCount: "1",
    message: "",
    consent: true,
    website: "", // honeypot
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // Simulate Server Action / submitEnquiry call
    try {
      if (formData.website) {
        // Honeypot tripped: pretend success
        setSubmittedReference("MFT-00000000");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 900));

      const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
      const ref = `MFT-${randomHex}`;
      setSubmittedReference(ref);
      clearBasket();
    } catch {
      setErrorMessage(
        "Something went wrong while submitting your enquiry. Please message us on WhatsApp or try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-24 pt-8 sm:pt-14">
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
              <div className="py-12 text-center space-y-6">
                <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Enquiry Received
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Thank you, <strong>{formData.name}</strong>. Your enquiry has been routed
                    directly to our sales desk.
                  </p>
                </div>
                <div className="inline-block px-5 py-3 rounded-2xl bg-secondary border border-border">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Your Reference Number
                  </p>
                  <p className="text-2xl font-mono font-black text-brand-700 dark:text-brand-300 mt-0.5">
                    {submittedReference}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  A representative will follow up via email (<strong>{formData.email}</strong>) and
                  phone within 1 business day.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedReference(null);
                      setFormData({
                        name: "",
                        company: "",
                        email: "",
                        phone: "",
                        businessType: "retail",
                        terminalCount: "1",
                        message: "",
                        consent: true,
                        website: "",
                      });
                    }}
                    className="px-6 py-2.5 rounded-full border border-border hover:bg-muted text-xs font-bold cursor-pointer transition-all"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-3 text-xs font-medium">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Selected Basket Items Review */}
                {items.length > 0 && (
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                        Selected Products ({itemCount} units)
                      </span>
                      <button
                        type="button"
                        onClick={clearBasket}
                        className="text-[11px] text-muted-foreground hover:text-destructive underline cursor-pointer"
                      >
                        Clear basket
                      </button>
                    </div>

                    <div className="divide-y divide-border/60">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="py-2.5 flex items-center justify-between gap-4 text-xs"
                        >
                          <div>
                            <p className="font-bold text-foreground">{item.name}</p>
                            <p className="text-[11px] text-muted-foreground">{item.modelNumber}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="1"
                              max="1000"
                              aria-label="Item quantity"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.id, Number.parseInt(e.target.value, 10) || 1)
                              }
                              className="w-16 px-2 py-1 rounded-lg border border-border text-center text-xs bg-background"
                            />
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personal & Company Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. David Adeyemi"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-company"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Company / Trading Name
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      placeholder="e.g. Apex Supermarkets Ltd"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Work Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-phone"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="+44 7123 456789 or +234..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {/* Business Type & Tills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-business-type"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      Business Type
                    </label>
                    <select
                      id="contact-business-type"
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
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
                      value={formData.terminalCount}
                      onChange={(e) => setFormData({ ...formData, terminalCount: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    />
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
                    required
                    rows={4}
                    placeholder="Tell us about your counter layout, software environment, timeline, or required peripheral connections..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-4 rounded-xl border border-border bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Honeypot field (hidden from genuine users) */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  style={{ display: "none", opacity: 0, position: "absolute", zIndex: -1 }}
                />

                {/* Consent checkbox */}
                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="size-4 mt-0.5 rounded border-border text-brand-700"
                  />
                  <label htmlFor="consent" className="text-xs text-muted-foreground leading-snug">
                    I agree to Mifaretech processing my information to provide hardware quotations
                    and technical specifications in accordance with the{" "}
                    <a href="/privacy" className="text-brand-700 dark:text-brand-300 underline">
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  <Send className="size-4" />
                  <span>{isSubmitting ? "Submitting Enquiry..." : "Send Formal Enquiry"}</span>
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
                    <p className="text-muted-foreground">sales@mifaretech.co.uk</p>
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
