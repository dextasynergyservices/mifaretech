import { asc } from "drizzle-orm";
import { db } from "@/db";
import { solutions } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { SolutionsClient } from "./solutions-client";

export const instant = false;

export default async function AdminSolutionsPage() {
  await requireRole(["admin", "editor"]);

  const allSolutions = await db.query.solutions.findMany({
    orderBy: [asc(solutions.kind), asc(solutions.sortOrder)],
    with: {
      media: true,
    },
  });

  const items = allSolutions.map((s) => ({
    id: s.id,
    kind: s.kind,
    title: s.title,
    slug: s.slug,
    summary: s.summary,
    bodyHtml: s.bodyHtml,
    mediaId: s.mediaId,
    mediaUrl: s.media?.secureUrl || null,
    sortOrder: s.sortOrder,
    isPublished: s.isPublished,
  }));

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="editorial-badge">Hardware Fleet</span>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-1">
            Industry Solutions &amp; Services
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Tailor hardware packages by industry vertical (retail, dining, pharmacy) and deployment
            services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-card border border-border text-xs font-bold text-foreground">
            Total: {items.length} items
          </span>
        </div>
      </div>

      <SolutionsClient initialSolutions={items} />
    </div>
  );
}
