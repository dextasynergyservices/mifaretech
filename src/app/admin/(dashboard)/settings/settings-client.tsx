"use client";

import { Building2, Globe, Loader2, MessageCircle, Phone, Share2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { type MediaUploadItem, SingleMediaUpload } from "@/components/admin/media-upload";
import { saveSiteSettingAction } from "@/server/actions/settings";

interface SettingsClientProps {
  initialSettings: Record<string, Record<string, unknown>>;
  ogMedia?: MediaUploadItem | null;
}

export function SettingsClient({ initialSettings, ogMedia }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"company" | "contact" | "whatsapp" | "social" | "seo">(
    "company",
  );
  const [isPending, startTransition] = useTransition();

  // 1. Company
  const company = (initialSettings.company || {}) as Record<string, string>;
  const [legalName, setLegalName] = useState(
    company.legalName || "Mifaretech System Solutions Ltd",
  );
  const [tagline, setTagline] = useState(company.tagline || "Mifaretech ...lean forward smartly!");
  const [foundedYear, setFoundedYear] = useState(company.foundedYear || "2018");
  const [companyNumber, setCompanyNumber] = useState(company.companyNumber || "");
  const [vatNumber, setVatNumber] = useState(company.vatNumber || "");

  // 2. Contact
  const contact = (initialSettings.contact || {}) as {
    emails?: string[];
    phones?: string[];
    address?: string;
    mapUrl?: string;
    hours?: string;
  };
  const [email1, setEmail1] = useState(contact.emails?.[0] || "sales@mifaretech.co.uk");
  const [email2, setEmail2] = useState(contact.emails?.[1] || "support@mifaretech.co.uk");
  const [phone1, setPhone1] = useState(contact.phones?.[0] || "+44 7448 670925");
  const [phone2, setPhone2] = useState(contact.phones?.[1] || "");
  const [address, setAddress] = useState(
    contact.address || "128 City Road, London, EC1V 2NX, United Kingdom",
  );
  const [mapUrl, _setMapUrl] = useState(contact.mapUrl || "");
  const [hours, setHours] = useState(
    contact.hours || "Monday – Friday: 08:30 – 18:00 | Saturday: 09:00 – 14:00",
  );

  // 3. WhatsApp
  const whatsapp = (initialSettings.whatsapp || {}) as Record<string, string>;
  const [whatsappNumber, setWhatsappNumber] = useState(whatsapp.number || "+447448670925");
  const [whatsappGreeting, setWhatsappGreeting] = useState(
    whatsapp.defaultMessage ||
      "Hello Mifaretech, I would like to enquire about your POS hardware fleet.",
  );

  // 4. Social
  const social = (initialSettings.social || {}) as Record<string, string>;
  const [linkedin, setLinkedin] = useState(social.linkedin || "");
  const [x, setX] = useState(social.x || "");
  const [facebook, setFacebook] = useState(social.facebook || "");
  const [instagram, setInstagram] = useState(social.instagram || "");
  const [youtube, setYoutube] = useState(social.youtube || "");

  // 5. SEO
  const seo = (initialSettings.seo || {}) as Record<string, string>;
  const [siteName, setSiteName] = useState(seo.siteName || "Mifaretech");
  const [defaultTitle, setDefaultTitle] = useState(
    seo.defaultTitle || "Mifaretech | Accredited EPOS & Hardware Solutions",
  );
  const [defaultDescription, setDefaultDescription] = useState(
    seo.defaultDescription ||
      "Mifaretech distributes enterprise point-of-sale terminals, receipt printers, barcode scanners, and self-service kiosks across the UK.",
  );
  const [ogMediaItem, setOgMediaItem] = useState<MediaUploadItem | null>(ogMedia || null);
  const [ogMediaId, setOgMediaId] = useState<string | null>((seo.ogMediaId as string) || null);

  const handleSaveSection = (key: string, value: Record<string, unknown>) => {
    startTransition(async () => {
      try {
        const res = await saveSiteSettingAction({ key, value });
        if (res.success) {
          toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} settings saved`);
        } else {
          toast.error("Failed to save settings");
        }
      } catch {
        toast.error("Failed to save settings");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-card border border-border">
        <button
          type="button"
          onClick={() => setActiveTab("company")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "company"
              ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="size-3.5" />
          <span>Company Info</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "contact"
              ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Phone className="size-3.5" />
          <span>Contact &amp; Operations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("whatsapp")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "whatsapp"
              ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageCircle className="size-3.5" />
          <span>WhatsApp Hotline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "social"
              ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Share2 className="size-3.5" />
          <span>Social Media</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "seo"
              ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="size-3.5" />
          <span>Global SEO</span>
        </button>
      </div>

      {/* 1. COMPANY INFO */}
      {activeTab === "company" && (
        <div className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Company &amp; Legal Identity</h3>
            <p className="text-xs text-muted-foreground">
              Official company registration name, marketing tagline, and statutory disclosures.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection("company", {
                legalName,
                tagline,
                foundedYear,
                companyNumber,
                vatNumber,
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Registered Legal Name
              </label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Official Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Founded Year</label>
                <input
                  type="text"
                  value={foundedYear}
                  onChange={(e) => setFoundedYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Companies House #
                </label>
                <input
                  type="text"
                  value={companyNumber}
                  onChange={(e) => setCompanyNumber(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">VAT Reg #</label>
                <input
                  type="text"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-colors shadow-xs"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>Save Company Info</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. CONTACT DETAILS */}
      {activeTab === "contact" && (
        <div className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Contact &amp; Operations</h3>
            <p className="text-xs text-muted-foreground">
              Official customer communication channels, office location, and trading hours.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection("contact", {
                emails: [email1, email2].filter(Boolean),
                phones: [phone1, phone2].filter(Boolean),
                address,
                mapUrl,
                hours,
              });
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Primary Sales Inbox
                </label>
                <input
                  type="email"
                  required
                  value={email1}
                  onChange={(e) => setEmail1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Secondary / Support Inbox
                </label>
                <input
                  type="email"
                  value={email2}
                  onChange={(e) => setEmail2(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Primary Phone
                </label>
                <input
                  type="text"
                  required
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Secondary Phone
                </label>
                <input
                  type="text"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Office &amp; Showroom Address
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Business &amp; Support Hours
              </label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-colors shadow-xs"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>Save Contact Details</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. WHATSAPP */}
      {activeTab === "whatsapp" && (
        <div className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">WhatsApp Direct Messaging</h3>
            <p className="text-xs text-muted-foreground">
              Instant sales assistance click-to-chat links shown on product pages and contact forms.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection("whatsapp", {
                number: whatsappNumber.replace(/[^0-9+]/g, ""),
                defaultMessage: whatsappGreeting,
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                WhatsApp Phone Number (with Country Code)
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+447448670925"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground font-mono focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Default Client Greeting Message
              </label>
              <textarea
                rows={3}
                value={whatsappGreeting}
                onChange={(e) => setWhatsappGreeting(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-colors shadow-xs"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>Save WhatsApp Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. SOCIAL */}
      {activeTab === "social" && (
        <div className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Social Profiles</h3>
            <p className="text-xs text-muted-foreground">
              Official company social media profiles rendered in the site footer.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection("social", {
                linkedin,
                x,
                facebook,
                instagram,
                youtube,
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/mifaretech"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                X (Twitter) URL
              </label>
              <input
                type="url"
                value={x}
                onChange={(e) => setX(e.target.value)}
                placeholder="https://x.com/mifaretech"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Facebook URL</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/mifaretech"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Instagram URL</label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/mifaretech"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">YouTube URL</label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@mifaretech"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden font-mono"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-colors shadow-xs"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>Save Social Profiles</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. DEFAULT SEO */}
      {activeTab === "seo" && (
        <div className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Global Site SEO &amp; Sharing</h3>
            <p className="text-xs text-muted-foreground">
              Fallback meta title, description, and social share image applied across the website.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveSection("seo", {
                siteName,
                defaultTitle,
                defaultDescription,
                ogMediaId,
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Website Display Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Default Meta Title
              </label>
              <input
                type="text"
                value={defaultTitle}
                onChange={(e) => setDefaultTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Default Meta Description
              </label>
              <textarea
                rows={3}
                value={defaultDescription}
                onChange={(e) => setDefaultDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden leading-relaxed"
              />
            </div>

            <SingleMediaUpload
              folder="seo/global"
              kind="image"
              label="Default OpenGraph Banner"
              initialItem={ogMediaItem}
              onChange={(item) => {
                setOgMediaItem(item);
                setOgMediaId(item?.id || null);
              }}
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-colors shadow-xs"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>Save Global SEO</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
