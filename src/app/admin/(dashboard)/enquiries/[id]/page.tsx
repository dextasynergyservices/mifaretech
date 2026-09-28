import { eq } from "drizzle-orm";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { requireRole } from "@/lib/session";
import { ResendNotificationButton } from "./resend-notification-button";

export const instant = false;

interface EnquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EnquiryDetailPage({ params }: EnquiryDetailPageProps) {
  await requireRole(["admin", "editor"]);
  const { id } = await params;

  const [enquiry] = await db.select().from(schema.enquiries).where(eq(schema.enquiries.id, id));

  if (!enquiry) {
    notFound();
  }

  const items = await db
    .select()
    .from(schema.enquiryItems)
    .where(eq(schema.enquiryItems.enquiryId, id));

  const whatsappDirect = enquiry.phone
    ? `https://wa.me/${enquiry.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
        enquiry.name,
      )},%20Mifaretech%20sales%20team%20regarding%20enquiry%20${enquiry.reference}`
    : null;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Bar with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/enquiries"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Enquiries</span>
        </Link>

        <div className="flex items-center gap-2">
          {whatsappDirect && (
            <a
              href={whatsappDirect}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              <MessageCircle className="size-3.5" />
              <span>WhatsApp Client</span>
            </a>
          )}
          <a
            href={`mailto:${enquiry.email}?subject=Mifaretech Quotation [${enquiry.reference}]`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted font-bold text-xs border border-border transition-colors"
          >
            <Mail className="size-3.5" />
            <span>Email Client</span>
          </a>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-black px-2.5 py-1 rounded-md bg-muted text-foreground border border-border">
                {enquiry.reference}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  enquiry.status === "new"
                    ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                    : enquiry.status === "quoted"
                      ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {enquiry.status}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                Source: {enquiry.source}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground pt-1">
              {enquiry.name}
            </h1>
            {enquiry.company && (
              <p className="text-sm font-bold text-muted-foreground">{enquiry.company}</p>
            )}
          </div>

          <div className="text-right text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 justify-end">
              <Calendar className="size-3.5" />
              <span>{new Date(enquiry.createdAt).toLocaleDateString("en-GB")}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <Clock className="size-3.5" />
              <span>{new Date(enquiry.createdAt).toLocaleTimeString("en-GB")}</span>
            </div>
          </div>
        </div>

        {/* Email Delivery Status Banner / Retry Section */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            {enquiry.notifyEmailStatus === "sent" ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle2 className="size-4" />
                Staff notification email delivered
              </span>
            ) : enquiry.notifyEmailStatus === "failed" ? (
              <div className="flex items-center gap-1.5 text-destructive font-bold">
                <AlertCircle className="size-4" />
                <span>
                  Notification email failed: {enquiry.notifyEmailError || "Delivery rejected"}
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-4" />
                Notification status: pending
              </span>
            )}
          </div>

          {/* Retry Note & Button (§ Phase 6 step 7) */}
          <ResendNotificationButton
            enquiryId={enquiry.id}
            currentStatus={enquiry.notifyEmailStatus}
          />
        </div>
      </div>

      {/* Grid: Details & Basket */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Contact details and message */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message / Requirements */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Client Project Description
            </h3>
            <div className="p-4 rounded-2xl bg-muted/40 border border-border text-sm leading-relaxed whitespace-pre-wrap font-sans text-foreground">
              {enquiry.message}
            </div>
          </div>

          {/* Requested Items (Enquiry Basket) */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Requested Hardware Basket ({items.length})
              </h3>
            </div>

            {items.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No individual hardware items selected (general consultation inquiry).
              </p>
            ) : (
              <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between gap-4 bg-background"
                  >
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.productName}</p>
                      {item.modelNumber && (
                        <p className="text-xs font-mono text-muted-foreground">
                          Model: {item.modelNumber}
                        </p>
                      )}
                      {item.note && (
                        <p className="text-[11px] text-muted-foreground mt-1">{item.note}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-3 py-1 rounded-lg bg-secondary font-mono text-xs font-bold text-foreground">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiz answers if attached */}
          {enquiry.quizAnswers && Object.keys(enquiry.quizAnswers).length > 0 && (
            <div className="p-6 rounded-3xl bg-brand-500/5 border border-brand-500/20 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-brand-600 dark:text-brand-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                  POS Advisor Quiz Recommendation
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(enquiry.quizAnswers).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-card border border-border">
                    <span className="text-muted-foreground capitalize font-medium">{key}:</span>
                    <p className="font-bold text-foreground mt-0.5">
                      {Array.isArray(val) ? val.join(", ") : String(val)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Profile & Metadata */}
        <div className="space-y-6">
          {/* Contact Details Card */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Contact Profile
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-muted-foreground">Full Name</p>
                <p className="font-bold text-foreground text-sm">{enquiry.name}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Email</p>
                <a
                  href={`mailto:${enquiry.email}`}
                  className="font-bold text-brand-700 dark:text-brand-300 hover:underline break-all"
                >
                  {enquiry.email}
                </a>
              </div>

              <div>
                <p className="text-muted-foreground">Telephone</p>
                <a
                  href={`tel:${enquiry.phone}`}
                  className="font-bold text-foreground hover:underline font-mono"
                >
                  {enquiry.phone}
                </a>
              </div>

              {enquiry.company && (
                <div>
                  <p className="text-muted-foreground">Organization</p>
                  <p className="font-bold text-foreground">{enquiry.company}</p>
                </div>
              )}

              <div>
                <p className="text-muted-foreground">Business Sector</p>
                <p className="font-bold text-foreground capitalize">
                  {enquiry.businessType || "General Commercial"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Terminals Needed</p>
                <p className="font-bold text-foreground">
                  {enquiry.terminalCount ? `${enquiry.terminalCount} units` : "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Compliance & Audit Card */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Compliance &amp; Verification
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">GDPR Consent:</span>
                <span className="text-emerald-600 font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" />
                  Agreed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Privacy Policy:</span>
                <span className="font-mono">{enquiry.privacyPolicyVersion || "2026-09"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Captcha Score:</span>
                <span className="font-mono font-bold">
                  {enquiry.captchaScore !== null
                    ? Number(enquiry.captchaScore).toFixed(2)
                    : "N/A (Dev)"}
                </span>
              </div>
              <div className="pt-2 border-t border-border">
                <span className="text-muted-foreground block text-[11px]">IP Hash:</span>
                <span className="font-mono text-[10px] text-muted-foreground break-all">
                  {enquiry.ipHash || "unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
