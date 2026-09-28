"use client";

import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  LogOut,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  banUserAction,
  changeUserRoleAction,
  inviteUserAction,
  revokeUserSessionsAction,
  unbanUserAction,
} from "@/server/actions/users";

export interface StaffUserItem {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  twoFactorEnabled: boolean | null;
  createdAt: Date;
}

interface UsersTableProps {
  initialUsers: StaffUserItem[];
  currentUserId: string;
}

export function UsersTable({ initialUsers, currentUserId }: UsersTableProps) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "editor">("all");

  // Dialog States
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor">("editor");
  const [invitedCredentials, setInvitedCredentials] = useState<{
    email: string;
    tempPass: string;
  } | null>(null);

  // Ban Dialog State
  const [banningUser, setBanningUser] = useState<StaffUserItem | null>(null);
  const [banReason, setBanReason] = useState("");

  const filteredUsers = initialUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await inviteUserAction({
          name: inviteName.trim(),
          email: inviteEmail.trim().toLowerCase(),
          role: inviteRole,
        });
        toast.success(`Invitation dispatched to ${inviteEmail}`);
        setInvitedCredentials({
          email: inviteEmail,
          tempPass: res.tempPassword,
        });
        setInviteName("");
        setInviteEmail("");
      } catch (err: unknown) {
        const errObj = err as { message?: string };
        toast.error(errObj.message || "Failed to invite user");
      }
    });
  };

  const handleChangeRole = (userId: string, targetRole: "admin" | "editor") => {
    startTransition(async () => {
      try {
        await changeUserRoleAction({ userId, role: targetRole });
        toast.success(`Role updated to ${targetRole}`);
      } catch (err: unknown) {
        const errObj = err as { message?: string };
        toast.error(errObj.message || "Failed to alter role");
      }
    });
  };

  const handleConfirmBan = () => {
    if (!banningUser) return;
    startTransition(async () => {
      try {
        await banUserAction({
          userId: banningUser.id,
          reason: banReason.trim() || "Administrative security lock",
        });
        toast.success(`Account for ${banningUser.email} has been suspended.`);
        setBanningUser(null);
        setBanReason("");
      } catch (err: unknown) {
        const errObj = err as { message?: string };
        toast.error(errObj.message || "Failed to suspend account");
      }
    });
  };

  const handleUnban = (userId: string) => {
    startTransition(async () => {
      try {
        await unbanUserAction({ userId });
        toast.success("Account suspension lifted.");
      } catch (err: unknown) {
        const errObj = err as { message?: string };
        toast.error(errObj.message || "Failed to lift suspension");
      }
    });
  };

  const handleRevokeSessions = (userId: string, email: string) => {
    startTransition(async () => {
      try {
        await revokeUserSessionsAction({ userId });
        toast.success(`All active sessions for ${email} revoked.`);
      } catch (err: unknown) {
        const errObj = err as { message?: string };
        toast.error(errObj.message || "Failed to revoke sessions");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Role Filter Chips */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border/80 text-xs">
            <button
              type="button"
              onClick={() => setRoleFilter("all")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                roleFilter === "all"
                  ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({initialUsers.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("admin")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                roleFilter === "admin"
                  ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Admins ({initialUsers.filter((u) => u.role === "admin").length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("editor")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                roleFilter === "editor"
                  ? "bg-brand-900 text-white dark:bg-brand-500 dark:text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Editors ({initialUsers.filter((u) => u.role === "editor").length})
            </button>
          </div>
        </div>

        {/* Invite Button */}
        <button
          type="button"
          onClick={() => {
            setInvitedCredentials(null);
            setIsInviteOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white hover:bg-brand-800 font-bold text-xs uppercase tracking-wider transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <UserPlus className="size-4" />
          <span>Invite Staff</span>
        </button>
      </div>

      {/* 2. Staff Table Card */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border/80 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4 sm:px-6">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">2FA Security</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Enrolled</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No staff accounts match your search filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelf = user.id === currentUserId;
                  return (
                    <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                      {/* Name & Email */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                            {user.name.slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-bold text-foreground block">
                              {user.name}{" "}
                              {isSelf && (
                                <span className="text-[10px] text-brand-600 font-normal">
                                  (You)
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-muted-foreground block">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Pill */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                            user.role === "admin"
                              ? "bg-brand-600/10 text-brand-700 dark:bg-brand-400/10 dark:text-brand-300 border border-brand-500/20"
                              : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20"
                          }`}
                        >
                          {user.role || "staff"}
                        </span>
                      </td>

                      {/* 2FA Status */}
                      <td className="py-4 px-4">
                        {user.twoFactorEnabled ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                            <ShieldCheck className="size-3.5" />
                            <span>Protected</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground text-[11px]">
                            <Shield className="size-3.5" />
                            <span>Disabled</span>
                          </span>
                        )}
                      </td>

                      {/* Account Status */}
                      <td className="py-4 px-4">
                        {user.banned ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 text-[10px] font-bold uppercase">
                            <Ban className="size-3" />
                            <span>Suspended</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                            <UserCheck className="size-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      {/* Enrolled Date */}
                      <td className="py-4 px-4 text-muted-foreground font-mono text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          {/* Role Toggle Button */}
                          {!isSelf && (
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={() =>
                                handleChangeRole(
                                  user.id,
                                  user.role === "admin" ? "editor" : "admin",
                                )
                              }
                              className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-secondary text-[11px] font-semibold text-foreground transition-colors cursor-pointer disabled:opacity-50"
                              title={`Switch role to ${user.role === "admin" ? "Editor" : "Admin"}`}
                            >
                              Make {user.role === "admin" ? "Editor" : "Admin"}
                            </button>
                          )}

                          {/* Ban / Unban Button */}
                          {!isSelf &&
                            (user.banned ? (
                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() => handleUnban(user.id)}
                                className="px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() => {
                                  setBanningUser(user);
                                  setBanReason("");
                                }}
                                className="px-2.5 py-1 rounded-lg border border-destructive/20 bg-destructive/10 hover:bg-destructive/20 text-destructive text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                Suspend
                              </button>
                            ))}

                          {/* Revoke Sessions */}
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleRevokeSessions(user.id, user.email)}
                            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                            title="Revoke active sessions"
                          >
                            <LogOut className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Invite Staff Modal Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Invite Staff Member</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create an authorized staff account with defined access permissions.
            </DialogDescription>
          </DialogHeader>

          {invitedCredentials ? (
            <div className="space-y-4 py-3">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <CheckCircle2 className="size-4" />
                  <span>Account Created &amp; Invitation Sent!</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  An email has been dispatched to <strong>{invitedCredentials.email}</strong>. For
                  local or emergency onboarding, the temporary passphrase is:
                </p>
                <div className="p-2.5 rounded-xl bg-card border border-border font-mono text-xs font-bold text-foreground select-all">
                  {invitedCredentials.tempPass}
                </div>
              </div>
              <DialogFooter>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="w-full px-4 py-2 rounded-xl bg-brand-900 text-white font-bold text-xs"
                >
                  Done
                </button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleInviteSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label htmlFor="invite-fullname" className="text-xs font-bold text-foreground">
                  Full Name
                </label>
                <input
                  id="invite-fullname"
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="invite-user-email" className="text-xs font-bold text-foreground">
                  Email Address
                </label>
                <input
                  id="invite-user-email"
                  type="email"
                  required
                  placeholder="sarah@mifaretech.co.uk"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-foreground block">Access Role</span>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setInviteRole("editor")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      inviteRole === "editor"
                        ? "border-brand-500 bg-brand-500/10 font-bold"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs font-bold text-foreground block">Editor</span>
                    <span className="text-[10px] text-muted-foreground block">
                      Manage products, blocks, &amp; enquiries.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteRole("admin")}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      inviteRole === "admin"
                        ? "border-brand-500 bg-brand-500/10 font-bold"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs font-bold text-foreground block">Admin</span>
                    <span className="text-[10px] text-muted-foreground block">
                      Full control including user invites &amp; audit.
                    </span>
                  </button>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  {isPending ? "Inviting..." : "Send Invitation"}
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 4. Ban Confirmation Modal Dialog */}
      <Dialog open={Boolean(banningUser)} onOpenChange={() => setBanningUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="size-4" />
              <span>Suspend Staff Account</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to suspend access for <strong>{banningUser?.email}</strong>?
              They will be immediately signed out of all active sessions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label htmlFor="ban-reason-text" className="text-xs font-bold text-foreground">
              Suspension Reason
            </label>
            <textarea
              id="ban-reason-text"
              required
              rows={2}
              placeholder="e.g. Employee offboarding or security review"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-destructive"
            />
          </div>

          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={() => setBanningUser(null)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleConfirmBan}
              className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs cursor-pointer disabled:opacity-50"
            >
              {isPending ? "Suspending..." : "Confirm Suspension"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
