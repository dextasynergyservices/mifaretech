import {
  ArrowRight,
  Building2,
  Code,
  GraduationCap,
  HeartPulse,
  Hotel,
  Layers,
  Lightbulb,
  type LucideIcon,
  Network,
  Pill,
  ShieldCheck,
  ShoppingCart,
  Store,
  Truck,
  UtensilsCrossed,
  Warehouse,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, SplitLines } from "@/components/motion/reveal";
import { getPageSeo, getSolutions } from "@/server/queries";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("solutions");
  return {
    title: seo?.title || "Industry Solutions & Services | Mifaretech",
    description:
      seo?.description ||
      "Smart technology solutions across RFID access control, Mifare hotel door locks, Fametech POS, and enterprise software.",
  };
}

const industryIconMap: Record<string, LucideIcon> = {
  "hospitality-hotels": Hotel,
  "restaurants-food-service": UtensilsCrossed,
  "retail-apparel": Store,
  "commercial-offices": Building2,
  "education-campus": GraduationCap,
  "healthcare-care-homes": HeartPulse,
  "leisure-events-warehousing": Warehouse,
  // legacy fallbacks
  "retail-boutiques": Store,
  "supermarkets-fmcg": ShoppingCart,
  "qsr-hospitality": UtensilsCrossed,
  pharmacies: Pill,
  hospitality: Hotel,
};

const serviceIconMap: Record<string, LucideIcon> = {
  "technology-consultancy": Lightbulb,
  "system-design": Layers,
  "equipment-supply": Truck,
  "installation-configuration": Wrench,
  "software-customisation": Code,
  "system-integration": Network,
  "after-sales-support": ShieldCheck,
  // legacy fallbacks
  "hardware-procurement": Truck,
  "staging-driver-flashing": Wrench,
  training: GraduationCap,
  sla: ShieldCheck,
};

export default async function SolutionsPage() {
  const [industrySolutions, serviceSolutions] = await Promise.all([
    getSolutions("industry"),
    getSolutions("service"),
  ]);

  return (
    <div className="flex flex-col gap-24 sm:gap-32 pb-20 overflow-x-hidden">
      {/* 1. Header */}
      <section className="pt-12 sm:pt-20 lg:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="editorial-badge">Enterprise Solutions</span>
            <SplitLines
              lines={[
                <span key="1" className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                  Point-of-sale architectures
                </span>,
                <span key="2" className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                  tailored to your industry.
                </span>,
              ]}
            />
            <Reveal delay={0.2}>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
                Whether you run a fast-paced supermarket or a high-end boutique, we supply and
                deploy the exact hardware combination required for flawless operations.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. Industries Served Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="editorial-tag text-brand-700 dark:text-brand-300">
              Sector Configurations
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Industries we power</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
            Proven hardware topologies matched to checkout velocity and counter space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industrySolutions.map((item) => {
            const Icon = industryIconMap[item.slug] || Store;
            return (
              <div
                key={item.id}
                className="p-8 rounded-3xl bg-card border border-border flex flex-col justify-between space-y-6 hover:border-brand-500/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="size-12 rounded-2xl bg-brand-50 dark:bg-brand-900/50 flex items-center justify-center text-brand-700 dark:text-brand-300 group-hover:scale-110 transition-transform">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>
                </div>

                <div className="pt-4 border-t border-border/80">
                  <Link
                    href={`/contact?industry=${encodeURIComponent(item.title)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-700 dark:text-accent-400 hover:underline"
                  >
                    <span>Request industry setup</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Services & Staging */}
      <section className="bg-secondary/30 py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="editorial-tag text-brand-700 dark:text-brand-300">
              End-to-End Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
              Full lifecycle hardware support
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              From unboxing and firmware flashing to long-term replacement agreements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {serviceSolutions.map((srv) => {
              const Icon = serviceIconMap[srv.slug] || Wrench;
              return (
                <div
                  key={srv.id}
                  className="p-8 rounded-3xl bg-card border border-border flex items-start gap-5 hover:border-brand-500/50 transition-colors"
                >
                  <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center text-accent shrink-0">
                    <Icon className="size-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">{srv.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{srv.summary}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Consultation CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight">Need a custom hardware rollout?</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Speak with a hardware deployment engineer about specs, drivers, and lead times.
            </p>
          </div>

          <Link
            href="/contact"
            className="px-7 py-3.5 rounded-full bg-accent hover:bg-accent-600 text-accent-foreground font-black text-xs uppercase tracking-wider shadow-sm transition-all shrink-0"
          >
            Speak with an Engineer
          </Link>
        </div>
      </section>
    </div>
  );
}
