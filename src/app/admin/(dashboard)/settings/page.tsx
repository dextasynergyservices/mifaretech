import { eq } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";
import { requireRole } from "@/lib/session";
import { SettingsClient } from "./settings-client";

export const instant = false;

export default async function AdminSettingsPage() {
  await requireRole(["admin", "editor"]);

  const allSettings = await db.query.siteSettings.findMany();
  const settingsMap: Record<string, Record<string, unknown>> = {};
  for (const s of allSettings) {
    settingsMap[s.key] = s.value;
  }

  // Fetch OG image if set in seo
  const seoSettings = (settingsMap.seo || {}) as Record<string, unknown>;
  const ogMediaId = seoSettings.ogMediaId as string | undefined;

  let ogMedia = null;
  if (ogMediaId) {
    const foundMedia = await db.query.media.findFirst({
      where: eq(media.id, ogMediaId),
    });
    if (foundMedia) {
      ogMedia = {
        id: foundMedia.id,
        url: foundMedia.secureUrl,
        filename: foundMedia.filename,
      };
    }
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="editorial-badge">Access &amp; System</span>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-1">
            Global Site Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure legal company details, contact inboxes, WhatsApp support line, and social
            profiles.
          </p>
        </div>
      </div>

      <SettingsClient initialSettings={settingsMap} ogMedia={ogMedia} />
    </div>
  );
}
