import { sql } from "drizzle-orm";
import {
  ArrowRight,
  Inbox,
  Layers,
  Monitor,
  Package,
  Plus,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { TanstackAnalyticsCharts } from "@/components/admin/analytics/tanstack-analytics-charts";
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
    weeklyEnquiriesRes,
    topProductsRes,
    statusBreakdownRes,
    sourceBreakdownRes,
    categoryDistributionRes,
  ] = await Promise.all([
    db.$count(schema.products).catch(() => 0),
    db.$count(schema.categories).catch(() => 0),
    db.$count(schema.enquiries).catch(() => 0),
    db.$count(schema.user).catch(() => 0),
    db.query.enquiries
      .findMany({
        orderBy: (enquiries, { desc }) => [desc(enquiries.createdAt)],
        limit: 5,
      })
      .catch(() => []),
    db.query.user
      .findFirst({
        where: (user, { eq }) => eq(user.id, session.user.id),
      })
      .catch(() => null),
    // Weekly inquiries aggregate
    db
      .execute<{ week_label: string; count: number }>(sql`
        SELECT to_char(date_trunc('week', created_at), 'DD Mon') as week_label, count(*)::int as count
        FROM enquiries
        WHERE created_at > now() - interval '8 weeks'
        GROUP BY date_trunc('week', created_at)
        ORDER BY date_trunc('week', created_at) asc
      `)
      .catch(() => ({ rows: [] })),
    // Top requested products
    db
      .execute<{ product_name: string; request_count: number; total_units: number }>(sql`
        SELECT product_name, count(*)::int as request_count, coalesce(sum(quantity), 0)::int as total_units
        FROM enquiry_items
        GROUP BY product_name
        ORDER BY request_count desc
        LIMIT 5
      `)
      .catch(() => ({ rows: [] })),
    // Status breakdown
    db
      .execute<{ status: string; count: number }>(sql`
        SELECT status, count(*)::int as count
        FROM enquiries
        GROUP BY status
      `)
      .catch(() => ({ rows: [] })),
    // Source breakdown
    db
      .execute<{ source: string; count: number }>(sql`
        SELECT source, count(*)::int as count
        FROM enquiries
        GROUP BY source
      `)
      .catch(() => ({ rows: [] })),
    // Category distribution
    db
      .execute<{ category_name: string; product_count: number }>(sql`
        SELECT c.name as category_name, count(p.id)::int as product_count
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        WHERE c.is_active = true
        GROUP BY c.name
        ORDER BY product_count desc
        LIMIT 6
      `)
      .catch(() => ({ rows: [] })),
  ]);

  const has2FA = currentUserRecord?.twoFactorEnabled ?? false;

  const weeklyRows =
    (weeklyEnquiriesRes as { rows: { week_label: string; count: number }[] }).rows || [];
  const topProducts =
    (
      topProductsRes as {
        rows: { product_name: string; request_count: number; total_units: number }[];
      }
    ).rows || [];
  const statusRows =
    (statusBreakdownRes as { rows: { status: string; count: number }[] }).rows || [];
  const sourceRows =
    (sourceBreakdownRes as { rows: { source: string; count: number }[] }).rows || [];
  const categoryRows =
    (categoryDistributionRes as { rows: { category_name: string; product_count: number }[] })
      .rows || [];

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
            <span>New Hardware</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Inbox className="size-3.5" />
            <span>Enquiry Inbox</span>
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
              <Layers className="size-4" />
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

      {/* 3. TanStack Charts Analytics Section */}
      <TanstackAnalyticsCharts
        weeklyData={weeklyRows}
        topProducts={topProducts}
        statusData={statusRows}
        sourceData={sourceRows}
        categoryData={categoryRows}
      />

      {/* Top-Requested Hardware Leaderboard */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Package className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>Top-Requested Hardware Leaderboard</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Most requested hardware models across client quotation baskets.
          </p>
        </div>

        {topProducts.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No product enquiry data collected yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topProducts.map((p, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-secondary/30 border border-border/70 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="size-6 rounded-lg bg-card border border-border/80 flex items-center justify-center font-mono text-[10px] font-bold text-muted-foreground shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-foreground truncate">{p.product_name}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400 block">
                    {p.request_count} quotes
                  </span>
                  <span className="text-[10px] text-muted-foreground">{p.total_units} units</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Recent Inbound Enquiries Preview */}
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
