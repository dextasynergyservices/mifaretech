import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { getProductBySlug, getRelatedProducts } from "@/server/queries";
import { ProductView } from "./product-view";

export async function generateStaticParams() {
  const publishedProducts = await db.query.products.findMany({
    where: (products, { eq }) => eq(products.status, "published"),
    columns: { slug: true },
  });
  return publishedProducts.map((p) => ({ slug: p.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Hardware Model Not Found | Mifaretech",
    };
  }

  return {
    title: product.seoTitle || `${product.name} | Mifaretech POS Hardware`,
    description:
      product.seoDescription ||
      product.shortDescription ||
      "Accredited distributor of commercial touch POS terminals and automated peripherals.",
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = product.categoryId
    ? await getRelatedProducts(product.categoryId, product.id, 2)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.cover?.secureUrl || "https://mifaretech.co.uk/logo.png",
    description: product.shortDescription || product.name,
    sku: product.modelNumber || product.id,
    brand: {
      "@type": "Brand",
      name: "Fametech (TYSSO)",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "GBP",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceType: "https://schema.org/InvoicePrice",
        description: "B2B commercial fleet pricing provided upon enquiry",
      },
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Mifaretech System Solutions",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductView
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          modelNumber: product.modelNumber,
          shortDescription: product.shortDescription,
          descriptionHtml: product.descriptionHtml,
          highlights: product.highlights || [],
          category: product.category,
          cover: product.cover,
          specs: product.specs || [],
          images: product.images || [],
          documents: product.documents || [],
        }}
        related={related.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          shortDescription: r.shortDescription,
          category: r.category,
          cover: r.cover,
        }))}
      />
    </>
  );
}
