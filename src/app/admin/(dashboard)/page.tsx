import {
  ArrowRight,
  Briefcase,
  Inbox,
  Monitor,
  Plus,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { requireRole } from "@/lib/session";

export const instant = false;

export default async function AdminDashboardOverviewPage() {
  const session = await requireRole(["admin", "editor"]);

  const [
    totalProducts,
    totalCategories,
    totalEnquiries,
    totalUsers,
    recentEnquiries,
    currentUserRecord,
  ] = await Promise.all([
    db.$count(schema.products),
    db.$count(schema.categories),
    db.$count(schema.enquiries),
    db.$count(schema.user),
    db.query.enquiries.findMany({
      orderBy: (enquiries, { desc }) => [desc(enquiries.createdAt)],
      limit: 5,
    }),
    db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, session.user.id),
    }),
  ]);

  const has2FA = currentUserRecord?.twoFactorEnabled ?? false;

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Welcome back, {session.user.name?.split(" ")[0]}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-brand-600/10 text-brand-700 dark:bg-brand-400/10 dark:text-brand-300 font-mono text-[10px] font-bold uppercase">
              {session.user.role || "staff"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Mifaretech fleet management and enterprise hardware administration console.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/catalogue/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-900 text-white dark:bg-brand-500 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-800 transition-all shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>New Product</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Inbox className="size-3.5" />
            <span>View Enquiries</span>
          </Link>
        </div>
      </div>

      {/* 2FA Security Notice (if not yet configured) */}
      {!has2FA && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">
                Two-Factor Authentication Recommended
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Protect your administrator account with a time-based authenticator (TOTP) app before
                production launch.
              </p>
            </div>
          </div>
          <Link
            href="/admin/security/2fa"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs tracking-wider shrink-0 hover:bg-amber-700 transition-all"
          >
            <ShieldCheck className="size-3.5" />
            <span>Enrol 2FA Now</span>
          </Link>
        </div>
      )}

      {/* 2. Key Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Inbound Enquiries */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Enquiries</span>
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <Inbox className="size-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black tracking-tight text-foreground block">
              {totalEnquiries}
            </span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="size-3 text-emerald-500" />
              <span>Commercial quote requests</span>
            </span>
          </div>
        </div>

        {/* Card 2: Active Products */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Hardware Models</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Monitor className="size-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black tracking-tight text-foreground block">
              {totalProducts}
            </span>
            <span className="text-[11px] text-muted-foreground block mt-1">
              Across {totalCategories} hardware categories
            </span>
          </div>
        </div>

        {/* Card 3: Categories & Solutions */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Categories</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="size-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black tracking-tight text-foreground block">
              {totalCategories}
            </span>
            <span className="text-[11px] text-muted-foreground block mt-1">
              POS, Printers, Scanners, Kiosks
            </span>
          </div>
        </div>

        {/* Card 4: Staff Users */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Staff Accounts</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Users className="size-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black tracking-tight text-foreground block">
              {totalUsers}
            </span>
            <span className="text-[11px] text-muted-foreground block mt-1">
              Authorized admin &amp; editor accounts
            </span>
          </div>
        </div>
      </div>

      {/* 3. Recent Inbound Enquiries Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Recent Fleet Enquiries
            </h2>
            <p className="text-xs text-muted-foreground">
              Latest client hardware quotations and contact submissions.
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          {recentEnquiries.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Inbox className="size-8 mx-auto text-muted-foreground" />
              <p className="text-xs font-bold text-foreground">No enquiries received yet</p>
              <p className="text-xs text-muted-foreground">
                Inbound requests submitted from the catalogue or contact forms will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {recentEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{enquiry.name}</span>
                      {enquiry.company && (
                        <span className="text-xs text-muted-foreground">
                          &bull; {enquiry.company}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {enquiry.message || "Hardware specification enquiry"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-secondary text-foreground">
                      {enquiry.status}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
