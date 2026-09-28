import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CatalogueActiveFilters } from "@/components/site/catalogue-active-filters";
import { CatalogueSidebar, type CategoryOption } from "@/components/site/catalogue-sidebar";
import { PaginatedProductGrid } from "@/components/site/paginated-product-grid";
import { searchParamsCache } from "@/lib/catalogue-search-params";
import { getCategories, getPageSeo, getPublishedProducts } from "@/server/queries";

interface CataloguePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("catalogue");
  return {
    title: seo?.title || "Enterprise Hardware Catalogue | Mifaretech",
    description:
      seo?.description ||
      "Commercial POS terminals, high-speed thermal printers, and omnidirectional barcode scanners.",
  };
}

async function ProductListSection({
  searchParams,
  categoriesList,
}: CataloguePageProps & { categoriesList: CategoryOption[] }) {
  const resolvedParams = await searchParams;
  const { category, q } = searchParamsCache.parse(resolvedParams);

  const productsList = await getPublishedProducts({
    categorySlug: category === "all" ? undefined : category,
    query: q || undefined,
  });

  return (
    <div className="space-y-6">
      <CatalogueActiveFilters categories={categoriesList} totalResults={productsList.length} />

      <PaginatedProductGrid
        products={productsList.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          modelNumber: p.modelNumber,
          shortDescription: p.shortDescription,
          highlights: p.highlights || [],
          category: p.category,
          cover: p.cover,
        }))}
        pageSize={6}
      />
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="h-4 w-44 bg-secondary/60 rounded-md animate-pulse" />
        <div className="h-4 w-32 bg-secondary/40 rounded-md animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-card border border-border flex flex-col justify-between h-[430px] animate-pulse space-y-4"
          >
            <div className="aspect-4/3 w-full bg-secondary/40 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-secondary/60 rounded-md" />
              <div className="h-5 w-3/4 bg-secondary/80 rounded-md" />
              <div className="h-3 w-full bg-secondary/40 rounded-md" />
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="h-8 w-24 bg-secondary/50 rounded-full" />
              <div className="h-8 w-20 bg-secondary/70 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="w-full lg:w-72 xl:w-80 shrink-0">
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-6 animate-pulse">
        <div className="h-5 w-36 bg-secondary/70 rounded-md" />
        <div className="h-10 w-full bg-secondary/50 rounded-xl" />
        <div className="space-y-2 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-9 w-full bg-secondary/40 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const categoriesList = await getCategories();
  const totalProducts = categoriesList.reduce((acc, cat) => acc + (cat.productCount ?? 0), 0);

  return (
    <div className="flex flex-col gap-10 pb-24 pt-8 sm:pt-14 overflow-x-hidden">
      {/* 1. Page Header & Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl space-y-3">
          <span className="editorial-badge">Enterprise Hardware Catalogue</span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Commercial Hardware Solutions
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Explore industrial Fametech all-in-one POS terminals, high-speed thermal printers, and
            omnidirectional barcode scanners. Add hardware to your enquiry list for custom fleet
            quotations and technical engineering datasheets.
          </p>
        </div>
      </section>

      {/* 2. Main 2-Column Catalogue Suite (Left Sidebar + Right Product Grid) */}
      <section
        id="catalogue-grid"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full scroll-mt-24"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Persistent Faceted Sidebar (Suspended for nuqs URL sync) */}
          <Suspense fallback={<SidebarSkeleton />}>
            <CatalogueSidebar
              categories={categoriesList.map((c) => ({
                id: c.id,
                slug: c.slug,
                name: c.name,
                productCount: c.productCount,
              }))}
              totalProductsCount={totalProducts}
            />
          </Suspense>

          {/* Right Column: Active Filters Bar & Paginated Product Grid */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductListSection
                searchParams={searchParams}
                categoriesList={categoriesList.map((c) => ({
                  id: c.id,
                  slug: c.slug,
                  name: c.name,
                }))}
              />
            </Suspense>
          </main>
        </div>
      </section>

      {/* 3. Bottom Hardware Sourcing Assurance Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-secondary/30 border border-border flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">
              Require a specialized SKU or custom hardware configuration?
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl">
              As an accredited direct Fametech partner, we source enterprise configurations with
              custom peripherals, VESA mounts, and specialized firmware.
            </p>
          </div>

          <Link
            href="/contact"
            className="px-6 py-3 rounded-full bg-card border border-border hover:bg-muted text-foreground font-bold text-xs uppercase tracking-wider transition-all shrink-0"
          >
            Request Custom Hardware Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
