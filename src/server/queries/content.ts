import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import {
  contentBlocks,
  faqs,
  pageSeo,
  partners,
  type sitePage,
  siteSettings,
  type solutionKind,
  solutions,
  testimonials,
} from "@/db/schema";

export async function getContentBlocks(page: (typeof sitePage.enumValues)[number]) {
  "use cache";
  cacheTag("content-blocks", `content-blocks-${page}`);
  cacheLife("hours");

  try {
    const blocks = await db.query.contentBlocks.findMany({
      where: and(eq(contentBlocks.page, page), eq(contentBlocks.isPublished, true)),
      orderBy: [asc(contentBlocks.sortOrder)],
    });

    // Map into a key-accessible record as well as array
    const byKey: Record<string, (typeof blocks)[number]> = {};
    for (const b of blocks) {
      byKey[b.blockKey] = b;
    }

    return {
      list: blocks,
      byKey,
    };
  } catch {
    return {
      list: [],
      byKey: {},
    };
  }
}

export async function getSettings(key?: string) {
  "use cache";
  cacheTag("site-settings", key ? `site-settings-${key}` : "site-settings-all");
  cacheLife("hours");

  try {
    if (key) {
      const setting = await db.query.siteSettings.findFirst({
        where: eq(siteSettings.key, key),
      });
      return setting?.value as Record<string, unknown> | null;
    }

    const all = await db.query.siteSettings.findMany();
    const result: Record<string, Record<string, unknown>> = {};
    for (const s of all) {
      result[s.key] = s.value;
    }
    return result;
  } catch {
    return null;
  }
}

export async function getSolutions(kind?: (typeof solutionKind.enumValues)[number]) {
  "use cache";
  cacheTag("solutions", kind ? `solutions-${kind}` : "solutions-all");
  cacheLife("hours");

  try {
    const conditions = [eq(solutions.isPublished, true)];
    if (kind) {
      conditions.push(eq(solutions.kind, kind));
    }

    return await db.query.solutions.findMany({
      where: and(...conditions),
      orderBy: [asc(solutions.sortOrder)],
    });
  } catch {
    return [];
  }
}

export async function getFaqs() {
  "use cache";
  cacheTag("faqs");
  cacheLife("hours");

  try {
    return await db.query.faqs.findMany({
      where: eq(faqs.isPublished, true),
      orderBy: [asc(faqs.sortOrder)],
    });
  } catch {
    return [];
  }
}

export async function getTestimonials() {
  "use cache";
  cacheTag("testimonials");
  cacheLife("hours");

  try {
    return await db.query.testimonials.findMany({
      where: eq(testimonials.isPublished, true),
      orderBy: [asc(testimonials.sortOrder)],
    });
  } catch {
    return [];
  }
}

export async function getPartners() {
  "use cache";
  cacheTag("partners");
  cacheLife("hours");

  try {
    return await db.query.partners.findMany({
      where: eq(partners.isPublished, true),
      orderBy: [asc(partners.sortOrder)],
    });
  } catch {
    return [];
  }
}

export async function getPageSeo(page: (typeof sitePage.enumValues)[number]) {
  "use cache";
  cacheTag("page-seo", `page-seo-${page}`);
  cacheLife("hours");

  try {
    return await db.query.pageSeo.findFirst({
      where: eq(pageSeo.page, page),
    });
  } catch {
    return null;
  }
}
