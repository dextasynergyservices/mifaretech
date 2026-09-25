import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mifaretech.com";
const DEFAULT_TITLE = "Mifaretech | ...lean forward smartly!";
const DEFAULT_DESCRIPTION =
  "Mifaretech System Solutions — Accredited distributor of Fametech POS terminals, thermal receipt printers, barcode scanners, and retail infrastructure. Non-stop commercial reliability.";

interface MetadataInput {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = "/logo.png",
  canonical,
  noIndex = false,
  keywords = [
    "POS terminals",
    "Fametech distributor",
    "thermal receipt printers",
    "barcode scanners",
    "retail automation",
    "touch POS",
    "Mifaretech",
  ],
}: MetadataInput = {}): Metadata {
  const fullTitle = title ? `${title} | Mifaretech` : DEFAULT_TITLE;
  const canonicalUrl = canonical
    ? `${SITE_URL}${canonical.startsWith("/") ? canonical : `/${canonical}`}`
    : undefined;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl || SITE_URL,
      siteName: "Mifaretech System Solutions",
      locale: "en_GB",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    icons: {
      icon: [{ url: "/logo.png", type: "image/png" }],
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
  };
}

/* =========================================================================
   JSON-LD Structured Data Generators
   ========================================================================= */

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mifaretech System Solutions",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    telephone: "+447448670925",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+447448670925",
        contactType: "sales and customer service",
        availableLanguage: ["English"],
      },
    ],
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Mifaretech System Solutions",
    image: `${SITE_URL}/logo.png`,
    url: SITE_URL,
    telephone: "+447448670925",
    priceRange: "££",
    description:
      "Accredited distributor of high-performance POS touch terminals, thermal receipt printers, and enterprise retail infrastructure.",
  };
}

export interface ProductSchemaInput {
  name: string;
  modelNumber?: string;
  description: string;
  image?: string;
  brand?: string;
  category?: string;
  sku?: string;
}

/**
 * Generates Product Schema WITHOUT public offers or pricing,
 * complying with B2B custom quote enquiry structure.
 */
export function generateProductSchema({
  name,
  modelNumber,
  description,
  image = "/logo.png",
  brand = "Fametech",
  category,
  sku,
}: ProductSchemaInput) {
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    model: modelNumber || name,
    mpn: modelNumber,
    sku: sku || modelNumber,
    description,
    image: imageUrl,
    category,
    brand: {
      "@type": "Brand",
      name: brand,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
