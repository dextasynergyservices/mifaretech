import { asc } from "drizzle-orm";
import { db } from "@/db";
import { contentBlocks, faqs, partners, testimonials } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { ContentClient } from "./content-client";

export const instant = false;

export default async function AdminContentPage() {
  await requireRole(["admin", "editor"]);

  const [dbBlocks, dbFaqs, dbTestimonials, dbPartners, dbPageSeo] = await Promise.all([
    db.query.contentBlocks.findMany({
      orderBy: [asc(contentBlocks.page), asc(contentBlocks.sortOrder)],
      with: { media: true },
    }),
    db.query.faqs.findMany({
      orderBy: [asc(faqs.sortOrder)],
    }),
    db.query.testimonials.findMany({
      orderBy: [asc(testimonials.sortOrder)],
      with: { avatar: true },
    }),
    db.query.partners.findMany({
      orderBy: [asc(partners.sortOrder)],
      with: { logo: true },
    }),
    db.query.pageSeo.findMany({
      with: { ogMedia: true },
    }),
  ]);

  const blocks = dbBlocks.map((b) => ({
    id: b.id,
    page: b.page,
    blockKey: b.blockKey,
    title: b.title,
    bodyHtml: b.bodyHtml,
    data: b.data,
    mediaId: b.mediaId,
    mediaUrl: b.media?.secureUrl || null,
    isPublished: b.isPublished,
  }));

  const faqsList = dbFaqs.map((f) => ({
    id: f.id,
    question: f.question,
    answerHtml: f.answerHtml,
    sortOrder: f.sortOrder,
    isPublished: f.isPublished,
  }));

  const testimonialsList = dbTestimonials.map((t) => ({
    id: t.id,
    quote: t.quote,
    authorName: t.authorName,
    authorRole: t.authorRole,
    company: t.company,
    avatarMediaId: t.avatarMediaId,
    avatarUrl: t.avatar?.secureUrl || null,
    sortOrder: t.sortOrder,
    isPublished: t.isPublished,
  }));

  const partnersList = dbPartners.map((p) => ({
    id: p.id,
    name: p.name,
    websiteUrl: p.websiteUrl,
    logoMediaId: p.logoMediaId,
    logoUrl: p.logo?.secureUrl || null,
    accreditationNote: p.accreditationNote,
    sortOrder: p.sortOrder,
    isPublished: p.isPublished,
  }));

  const seoList = dbPageSeo.map((s) => ({
    page: s.page,
    title: s.title,
    description: s.description,
    ogMediaId: s.ogMediaId,
    ogUrl: s.ogMedia?.secureUrl || null,
  }));

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="editorial-badge">Content Management</span>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-1">
            Site Copy &amp; Media Assets
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Update marketing headlines, FAQs, client feedback, manufacturer partner logos, and SEO.
          </p>
        </div>
      </div>

      <ContentClient
        initialBlocks={blocks}
        initialFaqs={faqsList}
        initialTestimonials={testimonialsList}
        initialPartners={partnersList}
        initialPageSeo={seoList}
      />
    </div>
  );
}
