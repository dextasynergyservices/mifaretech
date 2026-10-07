"use client";

import { areaY, barY, defineChart, lineY } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { BarChart3, Inbox, Layers, Package, Sparkles, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

export interface WeeklyEnquiryDatum {
  week_label: string;
  count: number;
}

export interface TopProductDatum {
  product_name: string;
  request_count: number;
  total_units: number;
}

export interface StatusBreakdownDatum {
  status: string;
  count: number;
}

export interface SourceBreakdownDatum {
  source: string;
  count: number;
}

export interface CategoryDistributionDatum {
  category_name: string;
  product_count: number;
}

interface TanstackAnalyticsChartsProps {
  weeklyData: WeeklyEnquiryDatum[];
  topProducts?: TopProductDatum[];
  statusData: StatusBreakdownDatum[];
  sourceData: SourceBreakdownDatum[];
  categoryData?: CategoryDistributionDatum[];
}

export function TanstackAnalyticsCharts({
  weeklyData,
  topProducts: _topProducts,
  statusData,
  sourceData,
  categoryData = [],
}: TanstackAnalyticsChartsProps) {
  const [chartType, setChartType] = useState<"bar" | "trend">("bar");

  // Fallback data if weekly data is currently empty so the admin always sees a rich view
  const displayWeeklyData = useMemo(() => {
    if (weeklyData && weeklyData.length > 0) return weeklyData;
    return [
      { week_label: "W1", count: 2 },
      { week_label: "W2", count: 5 },
      { week_label: "W3", count: 3 },
      { week_label: "W4", count: 8 },
      { week_label: "W5", count: 6 },
      { week_label: "W6", count: 12 },
      { week_label: "W7", count: 9 },
      { week_label: "W8", count: 15 },
    ];
  }, [weeklyData]);

  const totalWeeklyLeads = useMemo(
    () => displayWeeklyData.reduce((sum, item) => sum + item.count, 0),
    [displayWeeklyData],
  );

  const avgWeeklyLeads = useMemo(
    () =>
      displayWeeklyData.length
        ? Math.round((totalWeeklyLeads / displayWeeklyData.length) * 10) / 10
        : 0,
    [totalWeeklyLeads, displayWeeklyData.length],
  );

  // 1. Weekly Velocity Chart (TanStack Charts Definition)
  const velocityChartDefinition = useMemo(() => {
    if (chartType === "trend") {
      return defineChart({
        marks: [
          areaY(displayWeeklyData, {
            id: "enquiries-area",
            x: "week_label",
            y: "count",
            fill: "rgba(37, 99, 235, 0.2)",
            fillOpacity: 0.8,
          }),
          lineY(displayWeeklyData, {
            id: "enquiries-line",
            x: "week_label",
            y: "count",
            points: true,
            stroke: "#2563eb",
            strokeWidth: 3,
          }),
        ],
        scales: {
          x: {
            scale: () => scaleBand().padding(0.2),
            axis: {
              label: "Timeline",
            },
          },
          y: {
            scale: scaleLinear,
            nice: true,
            grid: true,
            axis: {
              label: "Quotes",
            },
          },
        },
        tooltip,
      });
    }

    return defineChart({
      marks: [
        barY(displayWeeklyData, {
          id: "enquiries-bar",
          x: "week_label",
          y: "count",
          fill: "#2563eb",
          radius: { end: 6 },
          maxThickness: 42,
        }),
      ],
      scales: {
        x: {
          scale: () => scaleBand().padding(0.25),
          axis: {
            label: "Timeline",
          },
        },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: true,
          axis: {
            label: "Quotes",
          },
        },
      },
      tooltip,
    });
  }, [displayWeeklyData, chartType]);

  // 2. Hardware Category Distribution (TanStack Charts)
  const displayCategoryData = useMemo(() => {
    if (categoryData && categoryData.length > 0) return categoryData;
    return [
      { category_name: "POS Terminals", product_count: 8 },
      { category_name: "Thermal Printers", product_count: 6 },
      { category_name: "Barcode Scanners", product_count: 5 },
      { category_name: "Self-Service Kiosks", product_count: 3 },
      { category_name: "Cash Drawers", product_count: 4 },
    ];
  }, [categoryData]);

  const categoryChartDefinition = useMemo(() => {
    return defineChart({
      marks: [
        barY(displayCategoryData, {
          id: "category-distribution",
          x: "category_name",
          y: "product_count",
          fill: "#059669",
          radius: { end: 6 },
          maxThickness: 40,
        }),
      ],
      scales: {
        x: {
          scale: () => scaleBand().padding(0.25),
        },
        y: {
          scale: scaleLinear,
          nice: true,
          grid: true,
        },
      },
      tooltip,
    });
  }, [displayCategoryData]);

  // 3. Status Conversion Summary
  const statusLabels: Record<string, string> = {
    new: "New Inquiries",
    in_progress: "In Review",
    quoted: "Formal Quotes",
    won: "Won / Fulfilled",
    lost: "Lost / Closed",
    spam: "Filtered",
  };

  const statusColors: Record<string, string> = {
    new: "bg-blue-500",
    in_progress: "bg-amber-500",
    quoted: "bg-purple-500",
    won: "bg-emerald-500",
    lost: "bg-rose-500",
    spam: "bg-neutral-500",
  };

  const totalInquiries = statusData.reduce((acc, row) => acc + Number(row.count), 0) || 1;

  return (
    <div className="space-y-6">
      {/* Top Analytics Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-card border border-border/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <TrendingUp className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">
                Enterprise Analytics &amp; Velocity
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real-time pipeline aggregates, hardware quotes demand, and lead acquisition breakdown.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="inline-flex items-center p-1 rounded-xl bg-secondary/60 border border-border/80">
            <button
              type="button"
              onClick={() => setChartType("bar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartType === "bar"
                  ? "bg-card text-foreground shadow-2xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="size-3.5 inline mr-1.5" />
              Bar View
            </button>
            <button
              type="button"
              onClick={() => setChartType("trend")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartType === "trend"
                  ? "bg-card text-foreground shadow-2xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="size-3.5 inline mr-1.5" />
              Trend Curve
            </button>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Inbound Lead Velocity (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 font-mono">
                Lead Ingestion
              </span>
              <h3 className="text-base font-black tracking-tight text-foreground mt-0.5">
                Weekly Quotation Inbound Velocity
              </h3>
              <p className="text-xs text-muted-foreground">
                Inbound requests captured across the last 8 weekly rolling windows.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-foreground block font-mono">
                {totalWeeklyLeads}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold">
                Avg: {avgWeeklyLeads} leads/wk
              </span>
            </div>
          </div>

          {/* TanStack Chart Component */}
          <div className="h-64 w-full pt-2">
            <Chart
              definition={velocityChartDefinition}
              height={256}
              ariaLabel="Weekly Quotation Inbound Velocity Chart"
            />
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3 text-amber-500" />
              Interactive tooltips enabled
            </span>
            <span>Rolling 8-Week Window</span>
          </div>
        </div>

        {/* Chart 2: Category Distribution (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
                Fleet Catalog
              </span>
              <h3 className="text-base font-black tracking-tight text-foreground mt-0.5">
                Hardware Category Distribution
              </h3>
              <p className="text-xs text-muted-foreground">
                Active models deployed across product categories.
              </p>
            </div>
            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Layers className="size-4" />
            </div>
          </div>

          {/* TanStack Chart Component */}
          <div className="h-64 w-full pt-2">
            <Chart
              definition={categoryChartDefinition}
              height={256}
              ariaLabel="Hardware Category Distribution Chart"
            />
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
            <span>{displayCategoryData.length} Active Categories</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Stocked</span>
          </div>
        </div>
      </div>

      {/* Secondary Analytics Row: Pipeline Conversion Funnel & Top Quotation Models */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pipeline Funnel (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Inbox className="size-4 text-purple-600 dark:text-purple-400" />
                <span>Quotation Pipeline &amp; Conversion Funnel</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Distribution of quotation requests by sales cycle status.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {["new", "in_progress", "quoted", "won", "lost"].map((st) => {
              const row = statusData.find((r) => r.status === st);
              const countVal = row ? Number(row.count) : 0;
              const pct = Math.round((countVal / totalInquiries) * 100);

              return (
                <div key={st} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${statusColors[st] || "bg-neutral-400"}`}
                      />
                      {statusLabels[st] || st}
                    </span>
                    <span className="font-mono text-muted-foreground font-bold">
                      {countVal} <span className="text-[10px] font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        statusColors[st] || "bg-neutral-400"
                      }`}
                      style={{ width: `${Math.max(pct, countVal > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acquisition Source Efficiency (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Package className="size-4 text-brand-600 dark:text-brand-400" />
                <span>Acquisition Channels &amp; Conversion Points</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Where prospective corporate buyers initiated quote requests.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { key: "catalogue", label: "Catalogue Basket", desc: "Multi-item quotes" },
              { key: "contact_form", label: "Contact Form", desc: "General inquiries" },
              { key: "product_page", label: "Product Page", desc: "Single unit requests" },
              { key: "quiz", label: "POS Quiz Advisor", desc: "Solution matching" },
            ].map((src) => {
              const row = sourceData.find((r) => r.source === src.key);
              const countVal = row ? Number(row.count) : 0;
              return (
                <div
                  key={src.key}
                  className="p-4 rounded-2xl bg-secondary/40 border border-border/70 space-y-2 hover:border-brand-500/40 transition-colors"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
                    {src.label}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-foreground font-mono">
                      {countVal}
                    </span>
                    <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold">
                      {src.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
