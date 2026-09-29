import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { requireRole } from "@/lib/session";

export const instant = false;

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireRole(["admin", "editor"]);
  const { id } = await params;

  const [product, allCategories] = await Promise.all([
    db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        category: true,
        cover: true,
        specs: {
          orderBy: (specs, { asc }) => [asc(specs.sortOrder)],
        },
        images: {
          with: {
            media: true,
          },
          orderBy: (images, { asc }) => [asc(images.sortOrder)],
        },
        documents: {
          with: {
            media: true,
          },
          orderBy: (documents, { asc }) => [asc(documents.sortOrder)],
        },
      },
    }),
    db.query.categories.findMany({
      orderBy: [asc(categories.sortOrder), asc(categories.name)],
    }),
  ]);

  if (!product) {
    notFound();
  }

  const categoryOptions = allCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  const datasheetDoc = product.documents?.[0];

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId,
    modelNumber: product.modelNumber,
    shortDescription: product.shortDescription,
    description: product.description as Record<string, unknown> | null,
    descriptionHtml: product.descriptionHtml || "",
    highlights: product.highlights || [],
    status: product.status,
    isFeatured: product.isFeatured,
    sortOrder: product.sortOrder,
    coverMediaId: product.coverMediaId,
    coverMedia: product.cover
      ? {
          id: product.cover.id,
          url: product.cover.secureUrl,
          filename: product.cover.filename,
        }
      : null,
    galleryImages: (product.images || [])
      .filter((img) => Boolean(img.media))
      .map((img) => ({
        id: img.media.id,
        url: img.media.secureUrl,
        filename: img.media.filename,
        altText: img.media.altText || "",
      })),
    datasheetMediaId: datasheetDoc?.mediaId || null,
    datasheetMedia: datasheetDoc?.media
      ? {
          id: datasheetDoc.media.id,
          url: datasheetDoc.media.secureUrl,
          filename: datasheetDoc.media.filename,
        }
      : null,
    datasheetTitle: datasheetDoc?.title || "",
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    specs: (product.specs || []).map((s) => ({
      groupName: s.groupName,
      label: s.label,
      value: s.value,
      sortOrder: s.sortOrder,
    })),
  };

  return <ProductForm initialData={initialData} categories={categoryOptions} />;
}
