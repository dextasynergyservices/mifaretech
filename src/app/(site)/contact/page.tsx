import type { Metadata } from "next";
import { Suspense } from "react";
import { getPageSeo, getSettings } from "@/server/queries";
import { ContactContent } from "./contact-content";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("contact");
  return {
    title: seo?.title || "Contact & Hardware Enquiries | Mifaretech",
    description:
      seo?.description ||
      "Speak with a hardware specialist or request commercial fleet pricing on genuine Fametech equipment.",
  };
}

export default async function ContactPage() {
  const [contactSettings, whatsappSettings] = await Promise.all([
    getSettings("contact"),
    getSettings("whatsapp"),
  ]);

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded-xl w-1/3" />
          <div className="h-4 bg-muted rounded-xl w-1/2" />
        </div>
      }
    >
      <ContactContent contactSettings={contactSettings} whatsappSettings={whatsappSettings} />
    </Suspense>
  );
}
