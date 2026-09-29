"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { logAuditEvent } from "@/lib/audit";
import { requireRole } from "@/lib/session";

const saveSettingSchema = z.object({
  key: z.string().min(1).max(50),
  value: z.record(z.string(), z.unknown()),
});

export async function saveSiteSettingAction(rawInput: unknown) {
  const session = await requireRole(["admin", "editor"]);
  const { key, value } = saveSettingSchema.parse(rawInput);

  await db
    .insert(siteSettings)
    .values({
      key,
      value,
      updatedBy: session.user.id,
    })
    .onConflictDoUpdate({
      target: [siteSettings.key],
      set: {
        value,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      },
    });

  await logAuditEvent({
    actorId: session.user.id,
    action: "settings.update",
    entityType: "site_settings",
    entityId: key,
    metadata: { key },
  });

  updateTag("site-settings");
  updateTag(`site-settings-${key}`);
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/about");
  revalidatePath("/admin/settings");

  return { success: true };
}
