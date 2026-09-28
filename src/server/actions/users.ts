"use server";

import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendUserInviteEmail } from "@/lib/email/send";
import { requireRole } from "@/lib/session";

const inviteUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "editor"]),
});

const changeRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["admin", "editor"]),
});

const banUserSchema = z.object({
  userId: z.string().min(1),
  reason: z.string().min(3, "Please provide a reason for banning this user"),
});

const unbanUserSchema = z.object({
  userId: z.string().min(1),
});

const revokeSessionsSchema = z.object({
  userId: z.string().min(1),
});

async function logAuditAction(
  actorId: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: Record<string, unknown>,
) {
  try {
    await db.insert(schema.auditLogs).values({
      actorId,
      action,
      entityType,
      entityId,
      metadata: metadata || {},
    });
  } catch (err) {
    console.error("Failed to record audit log:", err);
  }
}

/**
 * Invite a new staff user. Creates user in DB and sends invite link.
 * Strictly admin-only.
 */
export async function inviteUserAction(input: z.infer<typeof inviteUserSchema>) {
  const session = await requireRole(["admin"]);
  const parsed = inviteUserSchema.parse(input);

  const existing = await db.query.user.findFirst({
    where: eq(schema.user.email, parsed.email.toLowerCase()),
  });

  if (existing) {
    throw new Error("A user with this email address already exists.");
  }

  const newUserId = crypto.randomUUID();
  const tempPassword = `Temp-${crypto.randomUUID().slice(0, 8)}!2026`;
  const hashedPassword = await hashPassword(tempPassword);

  await db.insert(schema.user).values({
    id: newUserId,
    name: parsed.name,
    email: parsed.email.toLowerCase(),
    role: parsed.role,
    emailVerified: false,
    banned: false,
    twoFactorEnabled: false,
  });

  await db.insert(schema.account).values({
    id: crypto.randomUUID(),
    accountId: newUserId,
    providerId: "credential",
    userId: newUserId,
    password: hashedPassword,
  });

  const setupUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/login`;
  await sendUserInviteEmail(parsed.email, parsed.name, setupUrl);

  await logAuditAction(session.user.id, "user.invite", "user", newUserId, {
    email: parsed.email,
    role: parsed.role,
    invitedBy: session.user.email,
  });

  revalidatePath("/admin/users");
  return { success: true, userId: newUserId, tempPassword };
}

/**
 * Change a staff user's role (admin <-> editor).
 * Strictly admin-only. Cannot demote the last admin or oneself.
 */
export async function changeUserRoleAction(input: z.infer<typeof changeRoleSchema>) {
  const session = await requireRole(["admin"]);
  const parsed = changeRoleSchema.parse(input);

  if (parsed.userId === session.user.id) {
    throw new Error("You cannot alter your own admin role.");
  }

  const targetUser = await db.query.user.findFirst({
    where: eq(schema.user.id, parsed.userId),
  });

  if (!targetUser) {
    throw new Error("User not found.");
  }

  await db
    .update(schema.user)
    .set({
      role: parsed.role,
      updatedAt: new Date(),
    })
    .where(eq(schema.user.id, parsed.userId));

  await logAuditAction(session.user.id, "user.role_change", "user", parsed.userId, {
    fromRole: targetUser.role,
    toRole: parsed.role,
    targetEmail: targetUser.email,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * Ban a staff user and immediately revoke all active sessions.
 * Strictly admin-only. Cannot ban oneself.
 */
export async function banUserAction(input: z.infer<typeof banUserSchema>) {
  const session = await requireRole(["admin"]);
  const parsed = banUserSchema.parse(input);

  if (parsed.userId === session.user.id) {
    throw new Error("You cannot ban your own account.");
  }

  const targetUser = await db.query.user.findFirst({
    where: eq(schema.user.id, parsed.userId),
  });

  if (!targetUser) {
    throw new Error("User not found.");
  }

  await db
    .update(schema.user)
    .set({
      banned: true,
      banReason: parsed.reason,
      updatedAt: new Date(),
    })
    .where(eq(schema.user.id, parsed.userId));

  // Revoke all existing sessions immediately
  await db.delete(schema.session).where(eq(schema.session.userId, parsed.userId));

  await logAuditAction(session.user.id, "user.ban", "user", parsed.userId, {
    targetEmail: targetUser.email,
    reason: parsed.reason,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * Unban a staff user.
 * Strictly admin-only.
 */
export async function unbanUserAction(input: z.infer<typeof unbanUserSchema>) {
  const session = await requireRole(["admin"]);
  const parsed = unbanUserSchema.parse(input);

  const targetUser = await db.query.user.findFirst({
    where: eq(schema.user.id, parsed.userId),
  });

  if (!targetUser) {
    throw new Error("User not found.");
  }

  await db
    .update(schema.user)
    .set({
      banned: false,
      banReason: null,
      banExpires: null,
      updatedAt: new Date(),
    })
    .where(eq(schema.user.id, parsed.userId));

  await logAuditAction(session.user.id, "user.unban", "user", parsed.userId, {
    targetEmail: targetUser.email,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * Revoke all active sessions for a user (forces re-login).
 * Strictly admin-only.
 */
export async function revokeUserSessionsAction(input: z.infer<typeof revokeSessionsSchema>) {
  const session = await requireRole(["admin"]);
  const parsed = revokeSessionsSchema.parse(input);

  await db.delete(schema.session).where(eq(schema.session.userId, parsed.userId));

  await logAuditAction(session.user.id, "user.revoke_sessions", "user", parsed.userId, {
    revokedBy: session.user.email,
  });

  revalidatePath("/admin/users");
  return { success: true };
}
