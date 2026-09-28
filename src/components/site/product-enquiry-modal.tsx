"use client";

import {
  Building2,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  Package,
  Phone,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { submitProductEnquiryAction } from "@/server/actions/enquiries";

export interface EnquiryProductDetails {
  id: string;
  name: string;
  modelNumber?: string | null;
  categoryName?: string | null;
  imageUrl?: string | null;
  shortDescription?: string | null;
}

interface ProductEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: EnquiryProductDetails | null;
}

export function ProductEnquiryModal({ isOpen, onClose, product }: ProductEnquiryModalProps) {
  const [isPending, startTransition] = useTransition();
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [consentGiven, setConsentGiven] = useState(true);

  // When modal opens with a new product, prefill the message if empty
  const defaultMessage = product
    ? `Hello, I would like to request commercial pricing and technical specifications for the ${product.name}${product.modelNumber ? ` (Model: ${product.modelNumber})` : ""}. Please send availability and quotation details.`
    : "I would like to request a commercial quotation for this hardware model.";

  const activeMessage = message || defaultMessage;

  const handleClose = () => {
    onClose();
    // Reset state after animation completes
    setTimeout(() => {
      setSubmittedRef(null);
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setQuantity("1");
      setMessage("");
    }, 200);
  };

  const handleCopyRef = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      setCopied(true);
      toast.success("Enquiry reference copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid business email");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter a contact phone number for quote delivery");
      return;
    }

    startTransition(async () => {
      const res = await submitProductEnquiryAction({
        productId: product.id,
        productName: product.name,
        modelNumber: product.modelNumber,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim() || null,
        quantity: parseInt(quantity, 10) || 1,
        message: activeMessage.trim(),
        consentGiven,
      });

      if (res.success && res.reference) {
        setSubmittedRef(res.reference);
        toast.success(`Enquiry submitted successfully! Ref: ${res.reference}`);
      } else {
        toast.error(res.error || "Failed to submit enquiry. Please try again.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-xl w-[94vw] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl my-auto">
        {submittedRef ? (
          /* ========================================================= */
          /* SUCCESS CONFIRMATION VIEW (Scrollable if height constrained) */
          /* ========================================================= */
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col items-center text-center space-y-5">
            <div className="size-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="size-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Quotation Request Received
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-foreground">{name}</strong>. Your enquiry for{" "}
                <strong className="text-foreground">{product?.name}</strong> has been logged with
                our commercial hardware specialists.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="w-full max-w-sm p-4 rounded-2xl bg-secondary/50 border border-border/80 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Enquiry Reference
                </span>
                <span className="font-mono text-base font-black text-brand-700 dark:text-brand-400">
                  {submittedRef}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyRef}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs"
                title="Copy reference number"
              >
                <Copy className="size-3.5" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/10 text-left space-y-1.5 w-full max-w-sm text-xs text-muted-foreground">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <ShieldCheck className="size-4 text-brand-600 dark:text-brand-400" />
                <span>Expected Response Time</span>
              </div>
              <p>
                Our UK hardware team responds within <strong>1 business hour</strong> with
                commercial pricing, availability, and technical datasheets.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-full max-w-sm py-3 rounded-full bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 transition-all cursor-pointer shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          /* ========================================================= */
          /* ENQUIRY FORM VIEW (Fixed Header, Scrollable Fields, Fixed Footer) */
          /* ========================================================= */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* 1. Fixed Header & Product Summary */}
            <div className="shrink-0 p-5 sm:p-6 bg-secondary/30 border-b border-border/80 space-y-3">
              <DialogHeader className="text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent-700 dark:text-accent-400">
                      Direct Hardware Quotation
                    </span>
                  </div>
                </div>
                <DialogTitle className="text-lg sm:text-xl font-black tracking-tight text-foreground">
                  Enquire About Hardware
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Receive fleet pricing, bulk tier discounts, and technical deployment support.
                </DialogDescription>
              </DialogHeader>

              {/* Selected Hardware Pill */}
              {product && (
                <div className="p-2.5 sm:p-3 rounded-2xl bg-card border border-border/80 flex items-center gap-3 shadow-2xs">
                  <div className="relative size-11 rounded-xl bg-secondary/50 border border-border/50 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <Image
                      src={product.imageUrl || "/logo.png"}
                      alt={product.name}
                      fill
                      sizes="44px"
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground truncate block">
                        {product.name}
                      </span>
                      {product.modelNumber && (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-secondary text-muted-foreground shrink-0">
                          {product.modelNumber}
                        </span>
                      )}
                    </div>
                    {product.categoryName && (
                      <span className="text-[10px] text-muted-foreground block truncate">
                        Category: {product.categoryName}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="enquiry-name"
                      className="text-xs font-bold text-foreground flex items-center gap-1.5"
                    >
                      <User className="size-3 text-muted-foreground" />
                      <span>Your Name *</span>
                    </label>
                    <input
                      id="enquiry-name"
                      type="text"
                      required
                      placeholder="e.g. Alison Davies"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                  </div>

                  {/* Business Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="enquiry-email"
                      className="text-xs font-bold text-foreground flex items-center gap-1.5"
                    >
                      <Mail className="size-3 text-muted-foreground" />
                      <span>Business Email *</span>
                    </label>
                    <input
                      id="enquiry-email"
                      type="email"
                      required
                      placeholder="name@company.co.uk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Telephone Number */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="enquiry-phone"
                      className="text-xs font-bold text-foreground flex items-center gap-1.5"
                    >
                      <Phone className="size-3 text-muted-foreground" />
                      <span>Phone Number *</span>
                    </label>
                    <input
                      id="enquiry-phone"
                      type="tel"
                      required
                      placeholder="+44 7448 670925"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="enquiry-company"
                      className="text-xs font-bold text-foreground flex items-center gap-1.5"
                    >
                      <Building2 className="size-3 text-muted-foreground" />
                      <span>Company Name</span>
                    </label>
                    <input
                      id="enquiry-company"
                      type="text"
                      placeholder="e.g. Retail Group Ltd"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                  </div>
                </div>

                {/* Quantity Required */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="enquiry-quantity"
                    className="text-xs font-bold text-foreground flex items-center gap-1.5"
                  >
                    <Package className="size-3 text-muted-foreground" />
                    <span>Estimated Fleet Units / Quantity</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["1", "2-5", "6-20", "20+"].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() =>
                          setQuantity(
                            tier.replace("+", "").replace("2-5", "3").replace("6-20", "10"),
                          )
                        }
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          quantity ===
                            tier.replace("+", "").replace("2-5", "3").replace("6-20", "10") ||
                          (tier === "1" && quantity === "1")
                            ? "border-brand-600 bg-brand-500/10 text-brand-700 dark:text-brand-300"
                            : "border-border bg-background hover:bg-secondary text-muted-foreground"
                        }`}
                      >
                        {tier} {tier === "1" ? "unit" : "units"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message / Requirement Details */}
                <div className="space-y-1.5">
                  <label htmlFor="enquiry-message" className="text-xs font-bold text-foreground">
                    Specific Requirements / Deployment Notes
                  </label>
                  <textarea
                    id="enquiry-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={defaultMessage}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition-all resize-none"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    id="enquiry-consent"
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 rounded border-border text-brand-600 focus:ring-brand-500"
                  />
                  <label
                    htmlFor="enquiry-consent"
                    className="text-[11px] text-muted-foreground leading-tight"
                  >
                    I agree to Mifaretech contacting me regarding this commercial hardware enquiry
                    in accordance with the privacy policy.
                  </label>
                </div>
              </div>

              {/* 3. Sticky Action Buttons Footer */}
              <div className="shrink-0 p-4 sm:p-5 bg-card/95 backdrop-blur-md border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                  className="px-4 py-2.5 rounded-full border border-border hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      <span>Request Quotation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
