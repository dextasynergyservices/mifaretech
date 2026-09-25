"use client";

import { ArrowRight, CheckCircle2, Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useEnquiryBasket } from "@/lib/basket-store";
import { CATEGORIES, PRODUCTS, type ProductItem } from "@/lib/catalogue-data";

export default function CataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);

  const { itemCount, addItem } = useEnquiryBasket();

  // Filter products by category and search text
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.modelNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleEnquire = (product: ProductItem) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="flex flex-col gap-12 pb-24 pt-8 sm:pt-16">
      {/* 1. Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl space-y-3">
          <span className="editorial-badge">Enterprise Hardware Catalogue</span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            Commercial Hardware Solutions
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Browse certified Fametech POS terminals, high-speed thermal printers, and
            omnidirectional barcode scanners. Add items to your enquiry basket to request tailored
            fleet pricing and technical datasheets.
          </p>
        </div>
      </section>

      {/* 2. Controls & Filter Chips */}
      <section className="sticky top-[69px] z-30 bg-background/95 backdrop-blur-md border-y border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Filter Chips (Strictly by Product Type only — NO brand filters) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand-700 text-white dark:bg-brand-400 dark:text-brand-950 shadow-xs"
                        : "bg-secondary text-foreground hover:bg-muted border border-border/60"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Search Input Box */}
            <div className="relative shrink-0 w-full md:w-72">
              <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search models, specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
          <span>Showing {filteredProducts.length} items</span>
          <span>Prices provided upon formal quotation</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 rounded-3xl bg-secondary/30 border border-border space-y-3">
            <SlidersHorizontal className="size-8 text-muted-foreground mx-auto" />
            <p className="text-base font-bold">No hardware matching your filter criteria</p>
            <p className="text-xs text-muted-foreground">
              Try clearing your search term or selecting &apos;All Products&apos;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-full bg-brand-700 text-white text-xs font-bold mt-2 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col justify-between p-6 rounded-3xl bg-card border border-border hover:border-brand-500/50 transition-all duration-300 shadow-xs hover:shadow-lg group"
              >
                <div>
                  {/* Image Presentation */}
                  <div className="relative aspect-4/3 w-full bg-secondary/30 rounded-2xl p-6 mb-6 flex items-center justify-center overflow-hidden">
                    <div className="relative size-40 group-hover:scale-105 transition-transform duration-500">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="160px"
                        className="object-contain"
                      />
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="editorial-badge">{product.categoryName}</span>
                    </div>
                    {product.isFeatured && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-accent text-accent-foreground">
                          Popular
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {product.modelNumber}
                    </p>
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <ul className="mt-4 space-y-1.5 border-t border-border/70 pt-4">
                    {product.highlights.slice(0, 3).map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2 text-xs text-foreground/80"
                      >
                        <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions: Learn More & Enquire */}
                <div className="pt-6 mt-6 border-t border-border flex items-center justify-between gap-3">
                  <Link
                    href={`/catalogue/${product.slug}`}
                    className="text-xs font-bold text-muted-foreground hover:text-foreground underline underline-offset-4"
                  >
                    Learn more
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleEnquire(product)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <ShoppingBag className="size-3.5" />
                    <span>{addedId === product.id ? "Added!" : "Enquire"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Sticky Mobile Enquiry Bar when items exist */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
          <Link
            href="/contact"
            className="w-full flex items-center justify-between px-5 py-3.5 rounded-full bg-brand-950 text-white shadow-2xl border border-brand-800"
          >
            <div className="flex items-center gap-2">
              <span className="size-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                {itemCount}
              </span>
              <span className="text-xs font-bold">Enquiry Basket</span>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-accent">
              <span>View &amp; Submit</span>
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
