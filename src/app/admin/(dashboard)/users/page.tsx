import { Users } from "lucide-react";
import { UsersTable } from "@/components/admin/users-table";
import { db } from "@/db";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function AdminUsersPage() {
  // Strictly admin-only; will throw Forbidden error for editors
  const session = await requireRole(["admin"]);

  const usersList = await db.query.user.findMany({
    orderBy: (user, { desc }) => [desc(user.createdAt)],
  });

  return (
    <div className="space-y-8">
      {/* Page Title & Scope */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Users className="size-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Staff &amp; Access Control
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Manage authorized administrator and editor accounts, invite team members, and enforce 2FA
          security policies.
        </p>
      </div>

      {/* Users Interactive Table */}
      <UsersTable
        initialUsers={usersList.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          banned: u.banned,
          banReason: u.banReason,
          twoFactorEnabled: u.twoFactorEnabled,
          createdAt: u.createdAt,
        }))}
        currentUserId={session.user.id}
      />
    </div>
  );
}
