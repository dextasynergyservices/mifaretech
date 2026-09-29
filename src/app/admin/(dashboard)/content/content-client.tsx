"use client";

import {
  Award,
  Edit,
  Globe,
  HelpCircle,
  Layers,
  Loader2,
  MessageSquareQuote,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { type MediaUploadItem, SingleMediaUpload } from "@/components/admin/media-upload";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteFaqAction,
  deletePartnerAction,
  deleteTestimonialAction,
  saveContentBlockAction,
  saveFaqAction,
  savePageSeoAction,
  savePartnerAction,
  saveTestimonialAction,
} from "@/server/actions/content";

export interface ContentBlockItem {
  id: string;
  page: "global" | "home" | "about" | "catalogue" | "solutions" | "contact";
  blockKey: string;
  title: string | null;
  bodyHtml: string | null;
  data: Record<string, unknown> | null;
  mediaId: string | null;
  mediaUrl: string | null;
  isPublished: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answerHtml: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string | null;
  company: string | null;
  avatarMediaId: string | null;
  avatarUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
}

export interface PartnerItem {
  id: string;
  name: string;
  websiteUrl: string | null;
  logoMediaId: string | null;
  logoUrl: string | null;
  accreditationNote: string | null;
  sortOrder: number;
  isPublished: boolean;
}

export interface PageSeoItem {
  page: "global" | "home" | "about" | "catalogue" | "solutions" | "contact";
  title: string | null;
  description: string | null;
  ogMediaId: string | null;
  ogUrl: string | null;
}

interface ContentClientProps {
  initialBlocks: ContentBlockItem[];
  initialFaqs: FaqItem[];
  initialTestimonials: TestimonialItem[];
  initialPartners: PartnerItem[];
  initialPageSeo: PageSeoItem[];
}

export interface HeroTileSlot {
  id: string;
  mediaId: string | null;
  mediaUrl: string | null;
  title: string;
  tag: string;
  subtag: string;
  href: string;
}

const DEFAULT_HERO_SLOTS: HeroTileSlot[] = [
  {
    id: "slot-1",
    mediaId: null,
    mediaUrl: null,
    title: "Mobile POS",
    tag: "Mobile",
    subtag: "M-POS",
    href: "/catalogue/compact-mobile-pos-terminal",
  },
  {
    id: "slot-2",
    mediaId: null,
    mediaUrl: null,
    title: "Terminal",
    tag: "POS",
    subtag: "1000",
    href: "/catalogue/fametech-pos-1000",
  },
  {
    id: "slot-3",
    mediaId: null,
    mediaUrl: null,
    title: "Omni Scanner",
    tag: "Omni",
    subtag: "CS-900",
    href: "/catalogue/omnidirectional-countertop-scanner",
  },
  {
    id: "slot-4",
    mediaId: null,
    mediaUrl: null,
    title: "Printer",
    tag: "Print",
    subtag: "300",
    href: "/catalogue/heavy-duty-thermal-receipt-printer",
  },
  {
    id: "slot-5",
    mediaId: null,
    mediaUrl: null,
    title: "Printer",
    tag: "Print",
    subtag: "300",
    href: "/catalogue/heavy-duty-thermal-receipt-printer",
  },
  {
    id: "slot-6",
    mediaId: null,
    mediaUrl: null,
    title: "Drawer",
    tag: "Safe",
    subtag: "RJ11",
    href: "/catalogue/heavy-duty-steel-cash-drawer",
  },
  {
    id: "slot-7",
    mediaId: null,
    mediaUrl: null,
    title: "Interactive Kiosk",
    tag: "Kiosk",
    subtag: '21.5"',
    href: "/catalogue/interactive-self-service-kiosk",
  },
  {
    id: "slot-8",
    mediaId: null,
    mediaUrl: null,
    title: "Customer Display",
    tag: "Pole",
    subtag: "VFD",
    href: "/catalogue?category=pos-terminals",
  },
];

export function ContentClient({
  initialBlocks,
  initialFaqs,
  initialTestimonials,
  initialPartners,
  initialPageSeo,
}: ContentClientProps) {
  const [activeTab, setActiveTab] = useState<
    "blocks" | "faqs" | "testimonials" | "partners" | "seo"
  >("blocks");
  const [isPending, startTransition] = useTransition();

  // 1. Content Blocks State
  const initialHero = initialBlocks.find((b) => b.page === "home" && b.blockKey === "hero");
  const [blocks, setBlocks] = useState<ContentBlockItem[]>(initialBlocks);
  const [selectedPage, setSelectedPage] = useState<
    "home" | "about" | "catalogue" | "solutions" | "contact" | "global"
  >("home");
  const [selectedBlockKey, setSelectedBlockKey] = useState("hero");
  const [blockTitle, setBlockTitle] = useState(() => initialHero?.title || "");
  const [blockBodyHtml, setBlockBodyHtml] = useState(() => initialHero?.bodyHtml || "");
  const [blockMediaItem, setBlockMediaItem] = useState<MediaUploadItem | null>(() =>
    initialHero?.mediaUrl
      ? {
          id: initialHero.mediaId || "",
          url: initialHero.mediaUrl,
          filename: "home-hero-media",
        }
      : null,
  );
  const [blockMediaId, setBlockMediaId] = useState<string | null>(
    () => initialHero?.mediaId || null,
  );
  const [blockIsPublished, setBlockIsPublished] = useState(() =>
    initialHero ? initialHero.isPublished : true,
  );

  const [heroBadge, setHeroBadge] = useState<string>(
    () => (initialHero?.data as { badge?: string })?.badge || "Accredited Fametech Distributor",
  );

  const [heroTiles, setHeroTiles] = useState<HeroTileSlot[]>(() => {
    const rawTiles = (
      initialHero?.data as {
        heroTiles?: Array<{
          mediaId?: string | null;
          mediaUrl?: string | null;
          title?: string;
          tag?: string;
          subtag?: string;
          href?: string;
        }>;
      }
    )?.heroTiles;

    return DEFAULT_HERO_SLOTS.map((def, idx) => {
      const raw = rawTiles?.[idx];
      return {
        id: `slot-${idx + 1}`,
        mediaId: raw?.mediaId ?? def.mediaId,
        mediaUrl: raw?.mediaUrl ?? def.mediaUrl,
        title: raw?.title ?? def.title,
        tag: raw?.tag ?? def.tag,
        subtag: raw?.subtag ?? def.subtag,
        href: raw?.href ?? def.href,
      };
    });
  });

  const handleSelectBlock = (page: typeof selectedPage, key: string) => {
    setSelectedPage(page);
    setSelectedBlockKey(key);
    const found = blocks.find((b) => b.page === page && b.blockKey === key);
    if (found) {
      setBlockTitle(found.title || "");
      setBlockBodyHtml(found.bodyHtml || "");
      setBlockMediaId(found.mediaId || null);
      setBlockMediaItem(
        found.mediaUrl
          ? {
              id: found.mediaId || "",
              url: found.mediaUrl,
              filename: `${page}-${key}-media`,
            }
          : null,
      );
      setBlockIsPublished(found.isPublished);

      if (page === "home" && key === "hero") {
        const heroData = found.data as {
          badge?: string;
          heroTiles?: Array<{
            mediaId?: string | null;
            mediaUrl?: string | null;
            title?: string;
            tag?: string;
            subtag?: string;
            href?: string;
          }>;
        } | null;

        setHeroBadge(heroData?.badge || "Accredited Fametech Distributor");
        const rawTiles = heroData?.heroTiles;
        setHeroTiles(
          DEFAULT_HERO_SLOTS.map((def, idx) => {
            const raw = rawTiles?.[idx];
            return {
              id: `slot-${idx + 1}`,
              mediaId: raw?.mediaId ?? def.mediaId,
              mediaUrl: raw?.mediaUrl ?? def.mediaUrl,
              title: raw?.title ?? def.title,
              tag: raw?.tag ?? def.tag,
              subtag: raw?.subtag ?? def.subtag,
              href: raw?.href ?? def.href,
            };
          }),
        );
      }
    } else {
      setBlockTitle("");
      setBlockBodyHtml("");
      setBlockMediaId(null);
      setBlockMediaItem(null);
      setBlockIsPublished(true);
      if (page === "home" && key === "hero") {
        setHeroBadge("Accredited Fametech Distributor");
        setHeroTiles(DEFAULT_HERO_SLOTS);
      }
    }
  };

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const found = blocks.find(
          (b) => b.page === selectedPage && b.blockKey === selectedBlockKey,
        );
        const customData =
          selectedPage === "home" && selectedBlockKey === "hero"
            ? {
                badge: heroBadge.trim() || "Accredited Fametech Distributor",
                heroTiles: heroTiles.map((t) => ({
                  mediaId: t.mediaId || null,
                  mediaUrl: t.mediaUrl || null,
                  title: t.title,
                  tag: t.tag,
                  subtag: t.subtag,
                  href: t.href,
                })),
              }
            : found?.data || null;

        const res = await saveContentBlockAction({
          page: selectedPage,
          blockKey: selectedBlockKey,
          title: blockTitle.trim() || null,
          bodyHtml: blockBodyHtml || null,
          data: customData,
          mediaId: blockMediaId,
          isPublished: blockIsPublished,
        });
        if (res.success && res.block) {
          const savedBlock = res.block;
          toast.success(`Block "${selectedPage}/${selectedBlockKey}" updated`);
          setBlocks((prev) => {
            const filtered = prev.filter(
              (b) => !(b.page === selectedPage && b.blockKey === selectedBlockKey),
            );
            return [
              ...filtered,
              {
                id: savedBlock.id,
                page: savedBlock.page,
                blockKey: savedBlock.blockKey,
                title: savedBlock.title,
                bodyHtml: savedBlock.bodyHtml,
                data: savedBlock.data as Record<string, unknown> | null,
                mediaId: savedBlock.mediaId,
                mediaUrl: blockMediaItem?.url || null,
                isPublished: savedBlock.isPublished,
              },
            ];
          });
        } else {
          toast.error(res.error || "Failed to save content block");
        }
      } catch {
        toast.error("Failed to save content block");
      }
    });
  };

  // 2. FAQs State
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswerHtml, setFaqAnswerHtml] = useState("");
  const [faqIsPublished, setFaqIsPublished] = useState(true);

  const openCreateFaq = () => {
    setEditingFaq(null);
    setFaqQuestion("");
    setFaqAnswerHtml("");
    setFaqIsPublished(true);
    setIsFaqModalOpen(true);
  };

  const openEditFaq = (f: FaqItem) => {
    setEditingFaq(f);
    setFaqQuestion(f.question);
    setFaqAnswerHtml(f.answerHtml);
    setFaqIsPublished(f.isPublished);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswerHtml.trim()) {
      toast.error("Question and answer are required");
      return;
    }

    startTransition(async () => {
      try {
        const res = await saveFaqAction({
          id: editingFaq?.id,
          question: faqQuestion.trim(),
          answerHtml: faqAnswerHtml,
          sortOrder: editingFaq?.sortOrder || faqs.length,
          isPublished: faqIsPublished,
        });
        if (res.success) {
          toast.success(editingFaq ? "FAQ updated" : "FAQ created");
          setIsFaqModalOpen(false);
          // Refresh list locally
          if (editingFaq) {
            setFaqs((prev) =>
              prev.map((f) =>
                f.id === editingFaq.id
                  ? {
                      ...f,
                      question: faqQuestion,
                      answerHtml: faqAnswerHtml,
                      isPublished: faqIsPublished,
                    }
                  : f,
              ),
            );
          } else {
            setFaqs((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                question: faqQuestion,
                answerHtml: faqAnswerHtml,
                sortOrder: prev.length,
                isPublished: faqIsPublished,
              },
            ]);
          }
        }
      } catch {
        toast.error("Failed to save FAQ");
      }
    });
  };

  const handleDeleteFaq = (id: string) => {
    startTransition(async () => {
      try {
        const res = await deleteFaqAction(id);
        if (res.success) {
          setFaqs((prev) => prev.filter((f) => f.id !== id));
          toast.success("FAQ deleted");
        }
      } catch {
        toast.error("Failed to delete FAQ");
      }
    });
  };

  // 3. Testimonials State
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [tQuote, setTQuote] = useState("");
  const [tAuthor, setTAuthor] = useState("");
  const [tRole, setTRole] = useState("");
  const [tCompany, setTCompany] = useState("");
  const [tAvatarItem, setTAvatarItem] = useState<MediaUploadItem | null>(null);
  const [tAvatarId, setTAvatarId] = useState<string | null>(null);
  const [tIsPublished, setTIsPublished] = useState(true);

  const openCreateTestimonial = () => {
    setEditingTestimonial(null);
    setTQuote("");
    setTAuthor("");
    setTRole("");
    setTCompany("");
    setTAvatarItem(null);
    setTAvatarId(null);
    setTIsPublished(true);
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonial = (t: TestimonialItem) => {
    setEditingTestimonial(t);
    setTQuote(t.quote);
    setTAuthor(t.authorName);
    setTRole(t.authorRole || "");
    setTCompany(t.company || "");
    setTAvatarItem(
      t.avatarUrl
        ? { id: t.avatarMediaId || "", url: t.avatarUrl, filename: `${t.authorName} Avatar` }
        : null,
    );
    setTAvatarId(t.avatarMediaId);
    setTIsPublished(t.isPublished);
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tQuote.trim() || !tAuthor.trim()) {
      toast.error("Quote and Author Name are required");
      return;
    }

    startTransition(async () => {
      try {
        const res = await saveTestimonialAction({
          id: editingTestimonial?.id,
          quote: tQuote.trim(),
          authorName: tAuthor.trim(),
          authorRole: tRole.trim() || null,
          company: tCompany.trim() || null,
          avatarMediaId: tAvatarId,
          sortOrder: editingTestimonial?.sortOrder || testimonials.length,
          isPublished: tIsPublished,
        });
        if (res.success) {
          toast.success(editingTestimonial ? "Testimonial updated" : "Testimonial created");
          setIsTestimonialModalOpen(false);
          if (editingTestimonial) {
            setTestimonials((prev) =>
              prev.map((item) =>
                item.id === editingTestimonial.id
                  ? {
                      ...item,
                      quote: tQuote,
                      authorName: tAuthor,
                      authorRole: tRole,
                      company: tCompany,
                      avatarMediaId: tAvatarId,
                      avatarUrl: tAvatarItem?.url || null,
                      isPublished: tIsPublished,
                    }
                  : item,
              ),
            );
          } else {
            setTestimonials((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                quote: tQuote,
                authorName: tAuthor,
                authorRole: tRole,
                company: tCompany,
                avatarMediaId: tAvatarId,
                avatarUrl: tAvatarItem?.url || null,
                sortOrder: prev.length,
                isPublished: tIsPublished,
              },
            ]);
          }
        }
      } catch {
        toast.error("Failed to save testimonial");
      }
    });
  };

  const handleDeleteTestimonial = (id: string) => {
    startTransition(async () => {
      try {
        const res = await deleteTestimonialAction(id);
        if (res.success) {
          setTestimonials((prev) => prev.filter((t) => t.id !== id));
          toast.success("Testimonial deleted");
        }
      } catch {
        toast.error("Failed to delete testimonial");
      }
    });
  };

  // 4. Partners State
  const [partners, setPartners] = useState<PartnerItem[]>(initialPartners);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null);
  const [pName, setPName] = useState("");
  const [pUrl, setPUrl] = useState("");
  const [pNote, setPNote] = useState("");
  const [pLogoItem, setPLogoItem] = useState<MediaUploadItem | null>(null);
  const [pLogoId, setPLogoId] = useState<string | null>(null);
  const [pIsPublished, setPIsPublished] = useState(true);

  const openCreatePartner = () => {
    setEditingPartner(null);
    setPName("");
    setPUrl("");
    setPNote("");
    setPLogoItem(null);
    setPLogoId(null);
    setPIsPublished(true);
    setIsPartnerModalOpen(true);
  };

  const openEditPartner = (p: PartnerItem) => {
    setEditingPartner(p);
    setPName(p.name);
    setPUrl(p.websiteUrl || "");
    setPNote(p.accreditationNote || "");
    setPLogoItem(
      p.logoUrl ? { id: p.logoMediaId || "", url: p.logoUrl, filename: `${p.name} Logo` } : null,
    );
    setPLogoId(p.logoMediaId);
    setPIsPublished(p.isPublished);
    setIsPartnerModalOpen(true);
  };

  const handleSavePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) {
      toast.error("Partner Name is required");
      return;
    }

    startTransition(async () => {
      try {
        const res = await savePartnerAction({
          id: editingPartner?.id,
          name: pName.trim(),
          websiteUrl: pUrl.trim() || null,
          accreditationNote: pNote.trim() || null,
          logoMediaId: pLogoId,
          sortOrder: editingPartner?.sortOrder || partners.length,
          isPublished: pIsPublished,
        });
        if (res.success) {
          toast.success(editingPartner ? "Partner updated" : "Partner created");
          setIsPartnerModalOpen(false);
          if (editingPartner) {
            setPartners((prev) =>
              prev.map((item) =>
                item.id === editingPartner.id
                  ? {
                      ...item,
                      name: pName,
                      websiteUrl: pUrl,
                      accreditationNote: pNote,
                      logoMediaId: pLogoId,
                      logoUrl: pLogoItem?.url || null,
                      isPublished: pIsPublished,
                    }
                  : item,
              ),
            );
          } else {
            setPartners((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                name: pName,
                websiteUrl: pUrl,
                accreditationNote: pNote,
                logoMediaId: pLogoId,
                logoUrl: pLogoItem?.url || null,
                sortOrder: prev.length,
                isPublished: pIsPublished,
              },
            ]);
          }
        }
      } catch {
        toast.error("Failed to save partner logo");
      }
    });
  };

  const handleDeletePartner = (id: string) => {
    startTransition(async () => {
      try {
        const res = await deletePartnerAction(id);
        if (res.success) {
          setPartners((prev) => prev.filter((p) => p.id !== id));
          toast.success("Partner deleted");
        }
      } catch {
        toast.error("Failed to delete partner");
      }
    });
  };

  // 5. Page SEO State
  const [seoPages, setSeoPages] = useState<PageSeoItem[]>(initialPageSeo);
  const [selectedSeoPage, setSelectedSeoPage] = useState<
    "home" | "about" | "catalogue" | "solutions" | "contact" | "global"
  >("home");

  const currentSeo = seoPages.find((p) => p.page === selectedSeoPage);
  const [seoTitle, setSeoTitle] = useState(currentSeo?.title || "");
  const [seoDesc, setSeoDesc] = useState(currentSeo?.description || "");
  const [seoOgItem, setSeoOgItem] = useState<MediaUploadItem | null>(
    currentSeo?.ogUrl
      ? { id: currentSeo.ogMediaId || "", url: currentSeo.ogUrl, filename: "OG Share Image" }
      : null,
  );
  const [seoOgId, setSeoOgId] = useState<string | null>(currentSeo?.ogMediaId || null);

  const handleSelectSeoPage = (page: typeof selectedSeoPage) => {
    setSelectedSeoPage(page);
    const item = seoPages.find((p) => p.page === page);
    setSeoTitle(item?.title || "");
    setSeoDesc(item?.description || "");
    setSeoOgId(item?.ogMediaId || null);
    setSeoOgItem(
      item?.ogUrl
        ? { id: item.ogMediaId || "", url: item.ogUrl, filename: `${page}-og-share` }
        : null,
    );
  };

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await savePageSeoAction({
          page: selectedSeoPage,
          title: seoTitle.trim() || null,
          description: seoDesc.trim() || null,
          ogMediaId: seoOgId,
        });
        if (res.success) {
          toast.success(`SEO metadata saved for /${selectedSeoPage}`);
          setSeoPages((prev) => {
            const filtered = prev.filter((p) => p.page !== selectedSeoPage);
            return [
              ...filtered,
              {
                page: selectedSeoPage,
                title: seoTitle,
                description: seoDesc,
                ogMediaId: seoOgId,
                ogUrl: seoOgItem?.url || null,
              },
            ];
          });
        }
      } catch {
        toast.error("Failed to save SEO metadata");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-card border border-border">
        <button
          type="button"
          onClick={() => setActiveTab("blocks")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "blocks"
              ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="size-3.5" />
          <span>Page Content Blocks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("faqs")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "faqs"
              ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HelpCircle className="size-3.5" />
          <span>FAQs ({faqs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("testimonials")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "testimonials"
              ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquareQuote className="size-3.5" />
          <span>Client Testimonials ({testimonials.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("partners")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "partners"
              ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="size-3.5" />
          <span>Partners &amp; Logos ({partners.length})</span>
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
          <span>Per-Page SEO</span>
        </button>
      </div>

      {/* 1. CONTENT BLOCKS TAB */}
      {activeTab === "blocks" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Section Picker */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-card border border-border shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Page Section
            </h3>

            <div className="space-y-1">
              {[
                { page: "home" as const, key: "hero", label: "Home: Hero Copy & Tagline" },
                { page: "home" as const, key: "why-us", label: "Home: Why Mifaretech" },
                { page: "home" as const, key: "stats", label: "Home: Terminal Scale Stats" },
                { page: "about" as const, key: "story", label: "About: Company Story" },
                { page: "about" as const, key: "values", label: "About: Mission & Values" },
                { page: "solutions" as const, key: "intro", label: "Solutions: Header Intro" },
                { page: "contact" as const, key: "support", label: "Contact: Support SLA" },
              ].map((item) => {
                const isSelected = selectedPage === item.page && selectedBlockKey === item.key;
                return (
                  <button
                    key={`${item.page}-${item.key}`}
                    type="button"
                    onClick={() => handleSelectBlock(item.page, item.key)}
                    className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-colors ${
                      isSelected
                        ? "bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Editor */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Editing: {selectedPage} / {selectedBlockKey}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Changes update the live public website and revalidate edge caches.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveBlock}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-colors shadow-xs"
              >
                {isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Save className="size-3.5" />
                )}
                <span>Save Section</span>
              </button>
            </div>

            <form onSubmit={handleSaveBlock} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Section Headline / Title
                </label>
                <input
                  type="text"
                  value={blockTitle}
                  onChange={(e) => setBlockTitle(e.target.value)}
                  placeholder="e.g. Modern POS Hardware for High-Volume Counters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Rich Copy Content
                </label>
                <TiptapEditor value={blockBodyHtml} onChange={(html) => setBlockBodyHtml(html)} />
              </div>

              {/* Media Upload / Hero 6 Tiles */}
              {selectedPage === "home" && selectedBlockKey === "hero" ? (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Hero Accreditation Badge Text
                    </label>
                    <input
                      type="text"
                      value={heroBadge}
                      onChange={(e) => setHeroBadge(e.target.value)}
                      placeholder="e.g. Accredited Fametech Distributor"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Hero Showcase Hardware Tiles (Up to 8 Images)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Upload individual product hardware images for each of the 8 scattered hero
                      tiles on the homepage.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {heroTiles.map((tile, idx) => (
                      <div
                        key={tile.id}
                        className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-brand-700 dark:text-brand-300">
                            Tile #{idx + 1}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground">
                            {tile.tag} · {tile.subtag}
                          </span>
                        </div>

                        <SingleMediaUpload
                          key={`hero-slot-${tile.id}-${tile.mediaUrl || "none"}`}
                          folder="content/hero-tiles"
                          kind="image"
                          label={`Tile #${idx + 1} Image`}
                          initialItem={
                            tile.mediaUrl
                              ? {
                                  id: tile.mediaId || "",
                                  url: tile.mediaUrl,
                                  filename: `hero-tile-${idx + 1}`,
                                }
                              : null
                          }
                          onChange={(item) => {
                            setHeroTiles((prev) =>
                              prev.map((t, i) =>
                                i === idx
                                  ? {
                                      ...t,
                                      mediaId: item?.id || null,
                                      mediaUrl: item?.url || null,
                                    }
                                  : t,
                              ),
                            );
                          }}
                        />

                        <div className="space-y-2 pt-2 border-t border-border/60">
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block mb-0.5">
                              Label / Product Title
                            </label>
                            <input
                              type="text"
                              value={tile.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHeroTiles((prev) =>
                                  prev.map((t, i) => (i === idx ? { ...t, title: val } : t)),
                                );
                              }}
                              placeholder="e.g. Mobile POS"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-muted-foreground block mb-0.5">
                                Tag (Left)
                              </label>
                              <input
                                type="text"
                                value={tile.tag}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setHeroTiles((prev) =>
                                    prev.map((t, i) => (i === idx ? { ...t, tag: val } : t)),
                                  );
                                }}
                                placeholder="e.g. Mobile"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-muted-foreground block mb-0.5">
                                Badge (Right)
                              </label>
                              <input
                                type="text"
                                value={tile.subtag}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setHeroTiles((prev) =>
                                    prev.map((t, i) => (i === idx ? { ...t, subtag: val } : t)),
                                  );
                                }}
                                placeholder="e.g. M-POS"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground block mb-0.5">
                              Target Link URL
                            </label>
                            <input
                              type="text"
                              value={tile.href}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHeroTiles((prev) =>
                                  prev.map((t, i) => (i === idx ? { ...t, href: val } : t)),
                                );
                              }}
                              placeholder="e.g. /catalogue/compact-mobile-pos-terminal"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <SingleMediaUpload
                  folder={`content/${selectedPage}`}
                  kind="image"
                  label="Section Visual Asset"
                  initialItem={blockMediaItem}
                  onChange={(item) => {
                    setBlockMediaItem(item);
                    setBlockMediaId(item?.id || null);
                  }}
                />
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <span className="text-xs font-bold text-foreground block">Published Status</span>
                  <span className="text-[11px] text-muted-foreground">
                    Display this section on the live page
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={blockIsPublished}
                  onChange={(e) => setBlockIsPublished(e.target.checked)}
                  className="size-4 accent-brand-600 rounded cursor-pointer"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. FAQS TAB */}
      {activeTab === "faqs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Manage frequently asked questions rendered on Home and About pages.
            </p>
            <button
              type="button"
              onClick={openCreateFaq}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 transition-colors shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border shadow-xs overflow-hidden">
            {faqs.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                No FAQs created yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {faqs.map((f, idx) => (
                  <div
                    key={f.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-muted-foreground">
                          Q{idx + 1}.
                        </span>
                        <h4 className="text-xs font-bold text-foreground truncate">{f.question}</h4>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            f.isPublished
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {f.isPublished ? "Active" : "Hidden"}
                        </span>
                      </div>
                      <div
                        className="text-[11px] text-muted-foreground line-clamp-1 prose prose-sm dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: f.answerHtml }}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditFaq(f)}
                        className="p-2 rounded-lg bg-secondary hover:bg-muted text-foreground transition-colors font-bold"
                        title="Edit"
                      >
                        <Edit className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(f.id)}
                        className="p-2 rounded-lg bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. TESTIMONIALS TAB */}
      {activeTab === "testimonials" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Customer endorsements and client fleet deployments.
            </p>
            <button
              type="button"
              onClick={openCreateTestimonial}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 transition-colors shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-card border border-border shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-brand-600 dark:text-brand-400 font-serif text-3xl leading-none">
                    &ldquo;
                  </span>
                  <p className="text-xs text-foreground leading-relaxed italic line-clamp-4">
                    {t.quote}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2.5">
                    {t.avatarUrl ? (
                      <div className="relative size-8 rounded-full overflow-hidden shrink-0 border border-border">
                        <Image src={t.avatarUrl} alt={t.authorName} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {t.authorName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-foreground">{t.authorName}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {t.authorRole} {t.company ? `@ ${t.company}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditTestimonial(t)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PARTNERS TAB */}
      {activeTab === "partners" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Accredited distributor badges and manufacturer partner logos.
            </p>
            <button
              type="button"
              onClick={openCreatePartner}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 transition-colors shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Add Partner</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {partners.map((p) => (
              <div
                key={p.id}
                className="group relative p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col items-center justify-between text-center gap-2 aspect-square"
              >
                <div className="relative size-16 bg-muted/40 rounded-xl overflow-hidden flex items-center justify-center p-2">
                  {p.logoUrl ? (
                    <Image src={p.logoUrl} alt={p.name} fill className="object-contain p-2" />
                  ) : (
                    <Award className="size-6 text-muted-foreground" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold text-foreground truncate">{p.name}</p>
                  {p.accreditationNote && (
                    <p className="text-[10px] text-muted-foreground truncate">
                      {p.accreditationNote}
                    </p>
                  )}
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-card/90 rounded-lg p-1 border border-border">
                  <button
                    type="button"
                    onClick={() => openEditPartner(p)}
                    className="p-1 hover:text-foreground text-muted-foreground"
                  >
                    <Edit className="size-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePartner(p.id)}
                    className="p-1 hover:text-destructive text-muted-foreground"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PER-PAGE SEO TAB */}
      {activeTab === "seo" && (
        <div className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Search Engine &amp; Social Metadata
            </h3>
            <p className="text-xs text-muted-foreground">
              Configure open-graph previews and meta descriptions per page.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border w-fit">
            {(["home", "about", "catalogue", "solutions", "contact", "global"] as const).map(
              (p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelectSeoPage(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    selectedSeoPage === p
                      ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  /{p}
                </button>
              ),
            )}
          </div>

          <form onSubmit={handleSaveSeo} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Custom Page Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Page Title | Mifaretech"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Search result snippet (recommended 150-160 characters)..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden leading-relaxed"
              />
            </div>

            <SingleMediaUpload
              folder={`seo/${selectedSeoPage}`}
              kind="image"
              label="Open Graph Social Share Image"
              initialItem={seoOgItem}
              onChange={(item) => {
                setSeoOgItem(item);
                setSeoOgId(item?.id || null);
              }}
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-colors shadow-xs"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>Save SEO Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQ Modal */}
      <Dialog open={isFaqModalOpen} onOpenChange={setIsFaqModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSaveFaq} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingFaq ? "Edit FAQ" : "Add Frequently Asked Question"}</DialogTitle>
              <DialogDescription className="text-xs">
                Provide clear answers to commercial, warranty, and hardware compatibility queries.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="e.g. Do your POS terminals come with preloaded EPOS software?"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Answer *</label>
                <TiptapEditor value={faqAnswerHtml} onChange={(html) => setFaqAnswerHtml(html)} />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs font-bold text-foreground">Visible on Website</span>
                <input
                  type="checkbox"
                  checked={faqIsPublished}
                  onChange={(e) => setFaqIsPublished(e.target.checked)}
                  className="size-4 accent-brand-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-colors"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>{editingFaq ? "Save Changes" : "Create FAQ"}</span>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Testimonial Modal */}
      <Dialog open={isTestimonialModalOpen} onOpenChange={setIsTestimonialModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSaveTestimonial} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? "Edit Testimonial" : "Add Client Testimonial"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Real customer feedback from retail, supermarket, or hospitality managers.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Quote *</label>
                <textarea
                  rows={3}
                  required
                  value={tQuote}
                  onChange={(e) => setTQuote(e.target.value)}
                  placeholder="e.g. Mifaretech installed 14 touch POS terminals across our supermarket chain in 48 hours..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={tAuthor}
                    onChange={(e) => setTAuthor(e.target.value)}
                    placeholder="e.g. David Campbell"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={tRole}
                    onChange={(e) => setTRole(e.target.value)}
                    placeholder="e.g. Operations Director"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={tCompany}
                  onChange={(e) => setTCompany(e.target.value)}
                  placeholder="e.g. Westside Supermarkets UK"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                />
              </div>

              <SingleMediaUpload
                folder="testimonials"
                kind="image"
                label="Author Avatar"
                initialItem={tAvatarItem}
                onChange={(item) => {
                  setTAvatarItem(item);
                  setTAvatarId(item?.id || null);
                }}
              />

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs font-bold text-foreground">Visible on Website</span>
                <input
                  type="checkbox"
                  checked={tIsPublished}
                  onChange={(e) => setTIsPublished(e.target.checked)}
                  className="size-4 accent-brand-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-colors"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>{editingTestimonial ? "Save Changes" : "Create Testimonial"}</span>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Partner Modal */}
      <Dialog open={isPartnerModalOpen} onOpenChange={setIsPartnerModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSavePartner} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? "Edit Partner Logo" : "Add Partner / Accreditation"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Showcase authorized manufacturer accreditations and distribution agreements.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Partner / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="e.g. Fametech Taiwan"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Accreditation Note
                </label>
                <input
                  type="text"
                  value={pNote}
                  onChange={(e) => setPNote(e.target.value)}
                  placeholder="e.g. Authorized UK Hardware Distributor"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Website URL</label>
                <input
                  type="url"
                  value={pUrl}
                  onChange={(e) => setPUrl(e.target.value)}
                  placeholder="https://fametech.com.tw"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden font-mono"
                />
              </div>

              <SingleMediaUpload
                folder="partners"
                kind="image"
                label="Partner Logo"
                initialItem={pLogoItem}
                onChange={(item) => {
                  setPLogoItem(item);
                  setPLogoId(item?.id || null);
                }}
              />

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs font-bold text-foreground">Visible on Website</span>
                <input
                  type="checkbox"
                  checked={pIsPublished}
                  onChange={(e) => setPIsPublished(e.target.checked)}
                  className="size-4 accent-brand-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-800 disabled:opacity-40 transition-colors"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                <span>{editingPartner ? "Save Changes" : "Save Partner"}</span>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
