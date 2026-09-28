import { Suspense } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminShellSkeleton } from "@/components/admin/admin-shell-skeleton";
import { requireRole } from "@/lib/session";

export const instant = false;

async function AuthenticatedAdminShell({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["admin", "editor"]);

  return (
    <AdminShell
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        image: session.user.image,
      }}
    >
      {children}
    </AdminShell>
  );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminShellSkeleton />}>
      <AuthenticatedAdminShell>{children}</AuthenticatedAdminShell>
    </Suspense>
  );
}
