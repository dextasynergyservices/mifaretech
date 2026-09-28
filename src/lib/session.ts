import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";

export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

export type Role = "admin" | "editor";

/** Call at the top of every admin page/layout and every Server Action. */
export async function requireRole(allowed: Role[] = ["admin", "editor"]) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  const role = session.user.role as Role | null | undefined;
  if (!role || !allowed.includes(role) || session.user.banned) {
    throw new Error("Forbidden");
  }
  return session;
}
