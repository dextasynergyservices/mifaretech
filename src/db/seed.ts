import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Load environment variables
config({ path: ".env.local" });
config({ path: ".env" });

const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Missing DATABASE_URL or DATABASE_URL_UNPOOLED in environment");
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Starting Mifaretech database seed...");

  // 1. Categories
  const categoryDefs = [
    {
      id: "c1111111-1111-1111-1111-111111111111",
      slug: "pos-terminals",
      name: "POS Touch Terminals",
      description:
        "Fanless, aluminum die-cast enterprise touch POS terminals engineered for continuous counter operation.",
      sortOrder: 1,
      isActive: true,
      seoTitle: "Commercial POS Touch Terminals | Mifaretech",
      seoDescription:
        "Industrial-grade touchscreen POS terminals for supermarkets, restaurants, and retail stores.",
    },
    {
      id: "c2222222-2222-2222-2222-222222222222",
      slug: "receipt-printers",
      name: "Thermal Receipt Printers",
      description:
        "High-speed 250mm/s – 300mm/s thermal POS printers with auto-cutters and jam-free cutter mechanics.",
      sortOrder: 2,
      isActive: true,
      seoTitle: "Heavy-Duty Thermal Receipt Printers | Mifaretech",
      seoDescription:
        "High-speed thermal receipt printers with multi-interface USB, Serial, and Ethernet connectivity.",
    },
    {
      id: "c3333333-3333-3333-3333-333333333333",
      slug: "barcode-scanners",
      name: "Barcode Scanners",
      description:
        "Omnidirectional countertop and rugged handheld 1D/2D QR-code scanners for rapid item capture.",
      sortOrder: 3,
      isActive: true,
      seoTitle: "2D Barcode & QR Scanners | Mifaretech",
      seoDescription:
        "High-throughput omnidirectional and handheld barcode scanners for rapid retail checkout.",
    },
    {
      id: "c4444444-4444-4444-4444-444444444444",
      slug: "cash-drawers",
      name: "Cash Drawers",
      description:
        "Heavy-duty steel construction with RJ11 printer-kick interfaces and high-cycle ball-bearing rollers.",
      sortOrder: 4,
      isActive: true,
      seoTitle: "Heavy-Duty Steel Cash Drawers | Mifaretech",
      seoDescription:
        "Secure steel cash drawers with RJ11 interface, adjustable bill/coin trays, and key locks.",
    },
    {
      id: "c5555555-5555-5555-5555-555555555555",
      slug: "kiosks",
      name: "Self-Service Kiosks",
      description:
        'Interactive ordering and self-checkout terminals featuring 21.5" touchscreens and modular receipt printers.',
      sortOrder: 5,
      isActive: true,
      seoTitle: "Interactive Self-Service Kiosks | Mifaretech",
      seoDescription:
        "Compact self-checkout and customer ordering kiosk stations for quick service retail.",
    },
    {
      id: "c6666666-6666-6666-6666-666666666666",
      slug: "software",
      name: "POS Software & OS",
      description:
        "Pre-configured embedded Windows IoT and Linux operating systems with certified driver packages.",
      sortOrder: 6,
      isActive: true,
      seoTitle: "POS Operating Systems & Driver Suites | Mifaretech",
      seoDescription:
        "Industrial OS images, OPOS drivers, and device management tools for POS fleets.",
    },
  ];

  for (const cat of categoryDefs) {
    await db
      .insert(schema.categories)
      .values(cat)
      .onConflictDoUpdate({
        target: schema.categories.slug,
        set: {
          name: cat.name,
          description: cat.description,
          sortOrder: cat.sortOrder,
          isActive: cat.isActive,
          seoTitle: cat.seoTitle,
          seoDescription: cat.seoDescription,
        },
      });
  }
  console.log("✅ Seeded categories");

  // 2. Products
  const productDefs = [
    {
      id: "a1111111-1111-1111-1111-111111111111",
      categoryId: "c1111111-1111-1111-1111-111111111111",
      slug: "fametech-pos-1000",
      name: "Enterprise Touch POS Terminal",
      modelNumber: "POS-1000-HD",
      shortDescription:
        'Ultra-responsive 15.6" bezel-free capacitive touch terminal designed for rigorous 24/7 retail and dining environments.',
      descriptionHtml:
        "<p>The <strong>POS-1000-HD</strong> delivers enterprise-grade processing performance, an ultra-durable aluminum die-cast housing, and fanless heat dissipation for quiet, continuous operation in busy retail, supermarket, and restaurant counters.</p><p>Equipped with an IP65-sealed front bezel to resist accidental spills, moisture, and dust contamination.</p>",
      highlights: [
        "15.6-inch Full HD bezel-free projected capacitive touch display",
        "Industrial-grade fanless architecture prevents dust ingestion",
        "Comprehensive I/O: 6x USB, 4x Serial, Gigabit LAN, RJ11 Cash Drawer port",
        'Optional secondary 10.1" customer-facing display',
      ],
      status: "published" as const,
      isFeatured: true,
      sortOrder: 1,
      seoTitle: "Fametech POS-1000 Touch Terminal | Mifaretech",
      seoDescription:
        'Industrial fanless 15.6" touch terminal with Intel processing and aluminum die-cast chassis.',
      publishedAt: new Date(),
    },
    {
      id: "a2222222-2222-2222-2222-222222222222",
      categoryId: "c2222222-2222-2222-2222-222222222222",
      slug: "heavy-duty-thermal-receipt-printer",
      name: "High-Speed Thermal Receipt Printer",
      modelNumber: "PRP-300-PLUS",
      shortDescription:
        "300mm/s rapid thermal receipt printer with auto-cutter and triple interface ports for high-volume transactions.",
      descriptionHtml:
        "<p>Engineered for non-stop receipt generation at peak rush hours. The <strong>PRP-300-PLUS</strong> features high-speed printing at 300mm/s, easy drop-in paper loading, and a robust ceramic thermal head with over 150km lifespan.</p>",
      highlights: [
        "Lightning-fast 300mm/sec maximum print speed",
        "Triple connectivity: USB + Serial RS-232 + Ethernet LAN standard",
        "Heavy-duty auto-cutter rated for 1.5 million clean cuts",
        "Drop-in paper roll loading supports both 58mm and 80mm widths",
      ],
      status: "published" as const,
      isFeatured: true,
      sortOrder: 2,
      seoTitle: "Fametech PRP-300 Thermal Receipt Printer | Mifaretech",
      seoDescription:
        "300mm/s rapid receipt printer with triple interface ports and 1.5M cut auto-cutter.",
      publishedAt: new Date(),
    },
    {
      id: "a3333333-3333-3333-3333-333333333333",
      categoryId: "c3333333-3333-3333-3333-333333333333",
      slug: "omnidirectional-countertop-scanner",
      name: "Omnidirectional Countertop Barcode Scanner",
      modelNumber: "SC-900-OMNI",
      shortDescription:
        "Hands-free 2D CMOS imaging scanner engineered for rapid supermarket scanning of printed and mobile screens.",
      descriptionHtml:
        "<p>The <strong>SC-900-OMNI</strong> offers seamless 360-degree item scanning. It reads damaged barcodes, laminated packaging, and low-light mobile coupons effortlessly, keeping counter queues moving rapidly.</p>",
      highlights: [
        "High-density 1280x800 CMOS optical sensor",
        "Omnidirectional reading angle: eliminates need to orient items",
        "Snappy scanning from smartphone and tablet screens",
        "Vibration and audible confirmation for noisy checkout environments",
      ],
      status: "published" as const,
      isFeatured: true,
      sortOrder: 3,
      seoTitle: "SC-900 Omnidirectional Barcode Scanner | Mifaretech",
      seoDescription: "Countertop hands-free 2D imager for high-density barcode scanning.",
      publishedAt: new Date(),
    },
    {
      id: "a4444444-4444-4444-4444-444444444444",
      categoryId: "c4444444-4444-4444-4444-444444444444",
      slug: "heavy-duty-steel-cash-drawer",
      name: "Heavy-Duty Commercial Cash Drawer",
      modelNumber: "CD-410-HD",
      shortDescription:
        "Steel-reinforced cash drawer with RJ11 receipt printer trigger, adjustable coin dividers, and keylock.",
      descriptionHtml:
        "<p>Built for demanding cash transactions with reinforced steel construction and heavy-duty ball-bearing rollers tested to over 1,000,000 opening cycles.</p>",
      highlights: [
        "Reinforced thick-gauge cold-rolled steel housing",
        "Standard RJ11 / RJ12 24V printer kick-out trigger interface",
        "5 Bill compartments with metal wire grippers and 8 removable coin trays",
        "3-position key lock: locked, open, and electrical pulse bypass",
      ],
      status: "published" as const,
      isFeatured: true,
      sortOrder: 4,
      seoTitle: "CD-410 Heavy Duty Cash Drawer | Mifaretech",
      seoDescription:
        "Industrial steel cash drawer with RJ11 printer interface and 1M cycle roller mechanism.",
      publishedAt: new Date(),
    },
    {
      id: "a5555555-5555-5555-5555-555555555555",
      categoryId: "c5555555-5555-5555-5555-555555555555",
      slug: "interactive-self-service-kiosk",
      name: "Self-Ordering Interactive Kiosk",
      modelNumber: "KS-215-TOUCH",
      shortDescription:
        'Sleek 21.5" portrait interactive terminal with integrated thermal printer, 2D scanner, and payment mount.',
      descriptionHtml:
        "<p>Elevate customer autonomy and reduce checkout wait times with the <strong>KS-215-TOUCH</strong> self-ordering kiosk. Ideal for QSR dining, cinema ticketing, and boutique retail stores.</p>",
      highlights: [
        "21.5-inch Full HD portrait display with 10-point capacitive touch",
        "Built-in 80mm thermal receipt printer with auto-cutter",
        "Embedded high-speed 2D barcode scanner for loyalty and coupons",
        "Modular mounting bracket for standard EMV payment pin-pads",
      ],
      status: "published" as const,
      isFeatured: true,
      sortOrder: 5,
      seoTitle: "KS-215 Self Service Kiosk Terminal | Mifaretech",
      seoDescription: 'Interactive 21.5" ordering kiosk with thermal printer and 2D imager.',
      publishedAt: new Date(),
    },
    {
      id: "a6666666-6666-6666-6666-666666666666",
      categoryId: "c1111111-1111-1111-1111-111111111111",
      slug: "compact-mobile-pos-terminal",
      name: "Handheld Mobile POS Terminal",
      modelNumber: "M-POS-600",
      shortDescription:
        'Rugged 5.5" Android POS terminal with built-in thermal printer, 4G, and barcode scanner for queue-busting.',
      descriptionHtml:
        "<p>The <strong>M-POS-600</strong> brings point-of-sale mobility to table service, warehouse inventory counts, and pop-up events. Combines Android performance with a long-life 5200mAh battery.</p>",
      highlights: [
        "Integrated 58mm thermal receipt printer",
        "Built-in 1D/2D professional barcode scanner engine",
        "4G LTE, dual-band Wi-Fi, Bluetooth 5.0, and GPS",
        "All-day 5200mAh swappable battery pack",
      ],
      status: "published" as const,
      isFeatured: false,
      sortOrder: 6,
      seoTitle: "M-POS-600 Mobile POS Terminal | Mifaretech",
      seoDescription:
        "Rugged handheld terminal with integrated thermal printer and 4G connectivity.",
      publishedAt: new Date(),
    },
    {
      id: "a7777777-7777-7777-7777-777777777777",
      categoryId: "c1111111-1111-1111-1111-111111111111",
      slug: "dual-screen-touch-pos-terminal",
      name: "Dual-Screen Enterprise POS Terminal",
      modelNumber: "POS-3000-PRO",
      shortDescription:
        '15.6" primary operator touch screen paired with an integrated 10.1" customer-facing media display.',
      descriptionHtml:
        "<p>The <strong>POS-3000-PRO</strong> boosts counter transparency and promotional upsells by presenting live itemized billing and promotional campaigns on the customer-facing secondary panel.</p>",
      highlights: [
        'Primary 15.6" Full HD PCAP touch display with IP65 water-resistant front',
        'Integrated 10.1" secondary screen for customer totals and branded media',
        "Intel Quad-Core processing with silent aluminum heat dissipation",
        "Clean cable concealment passage integrated directly into the base",
      ],
      status: "published" as const,
      isFeatured: true,
      sortOrder: 7,
      seoTitle: "POS-3000-PRO Dual Screen Terminal | Mifaretech",
      seoDescription:
        'Dual-screen POS terminal with 15.6" operator display and 10.1" customer monitor.',
      publishedAt: new Date(),
    },
    {
      id: "a8888888-8888-8888-8888-888888888888",
      categoryId: "c2222222-2222-2222-2222-222222222222",
      slug: "compact-front-exit-receipt-printer",
      name: "Compact Front-Exit Thermal Printer",
      modelNumber: "PRP-250-ECO",
      shortDescription:
        "Space-saving front-exit thermal receipt printer designed for under-counter and kitchen splash zones.",
      descriptionHtml:
        "<p>Featuring a front-loading and front-dispensing design, the <strong>PRP-250-ECO</strong> prevents accidental liquid spill ingress, making it ideal for bars and compact retail checkout points.</p>",
      highlights: [
        "Front paper exit shields print mechanism from counter spillages",
        "250 mm/sec rapid throughput with full and partial auto-cut",
        "Drop-in paper loading with paper-near-end optical sensor",
        "Dual interface: USB and Ethernet LAN with OPOS driver suite",
      ],
      status: "published" as const,
      isFeatured: false,
      sortOrder: 8,
      seoTitle: "PRP-250 Front Exit Thermal Printer | Mifaretech",
      seoDescription:
        "Spill-resistant front-exit receipt printer with auto-cutter for hospitality counters.",
      publishedAt: new Date(),
    },
    {
      id: "a9999999-9999-9999-9999-999999999999",
      categoryId: "c3333333-3333-3333-3333-333333333333",
      slug: "industrial-wireless-2d-scanner",
      name: "Wireless Rugged 2D Barcode Scanner",
      modelNumber: "SC-650-RUGGED",
      shortDescription:
        "Heavy-duty cordless 2D imager with charging cradle and up to 100m wireless communication range.",
      descriptionHtml:
        "<p>Engineered for warehouse staging, bulky item counter scans, and garden center inventory counts. Survives repeated 1.8-meter concrete drops without performance degradation.</p>",
      highlights: [
        "2.4GHz wireless and Bluetooth 5.0 transmission with up to 100m range",
        "High-performance CMOS engine reads damaged and low-contrast codes",
        "Drop-tested to 1.8m concrete drops with IP54 dust protection",
        "2600mAh battery delivers over 40,000 continuous scans per charge",
      ],
      status: "published" as const,
      isFeatured: false,
      sortOrder: 9,
      seoTitle: "SC-650 Wireless Rugged Barcode Scanner | Mifaretech",
      seoDescription: "Industrial 2D wireless barcode scanner with charging cradle and 100m range.",
      publishedAt: new Date(),
    },
    {
      id: "aaaaaaa0-0000-0000-0000-000000000001",
      categoryId: "c4444444-4444-4444-4444-444444444444",
      slug: "compact-space-saving-cash-drawer",
      name: "Compact Space-Saving Steel Cash Drawer",
      modelNumber: "CD-330-COMPACT",
      shortDescription:
        "Ultra-compact 330mm width steel cash drawer engineered for narrow boutique and cafe counters.",
      descriptionHtml:
        "<p>Maximizes valuable counter workspace while retaining commercial security. Includes 4 bill sections with wire clips and 8 coin compartments.</p>",
      highlights: [
        "Narrow 330mm width footprint for space-constrained countertops",
        "Heavy-duty steel casing with smooth steel ball-bearing suspension",
        "Standard 24V RJ11 kick-out cable compatible with all POS printers",
        "3-position key release mechanism: manual open, lock, and pulse drive",
      ],
      status: "published" as const,
      isFeatured: false,
      sortOrder: 10,
      seoTitle: "CD-330 Compact Cash Drawer | Mifaretech",
      seoDescription: "Space-saving 330mm heavy-duty steel cash drawer for narrow retail counters.",
      publishedAt: new Date(),
    },
    {
      id: "aaaaaaa0-0000-0000-0000-000000000002",
      categoryId: "c5555555-5555-5555-5555-555555555555",
      slug: "enterprise-self-checkout-station",
      name: "Enterprise 27-inch Self-Checkout Station",
      modelNumber: "KS-270-PAY",
      shortDescription:
        'Large-format 27" self-checkout kiosk with integrated thermal receipt printer, scanner, and EMV mount.',
      descriptionHtml:
        "<p>Designed for high-throughput supermarket lanes and multi-lane retail stores to automate checkout and eliminate queuing bottlenecks.</p>",
      highlights: [
        "27-inch Full HD commercial touchscreen with antimicrobial coating",
        "High-speed 80mm receipt cutter with automatic paper retraction",
        "Omnidirectional barcode reader for effortless self-scanning",
        "Universal payment bracket for Ingenico and Verifone terminals",
      ],
      status: "published" as const,
      isFeatured: false,
      sortOrder: 11,
      seoTitle: "KS-270 Enterprise Self-Checkout Station | Mifaretech",
      seoDescription: "27-inch self-checkout kiosk station for retail supermarkets and franchises.",
      publishedAt: new Date(),
    },
    {
      id: "aaaaaaa0-0000-0000-0000-000000000003",
      categoryId: "c6666666-6666-6666-6666-666666666666",
      slug: "windows-iot-enterprise-suite",
      name: "Windows 11 IoT Enterprise OS & OPOS Driver Suite",
      modelNumber: "OS-IOT-WIN11",
      shortDescription:
        "Pre-configured embedded Windows IoT operating system with certified Fametech OPOS peripheral drivers.",
      descriptionHtml:
        "<p>Delivered pre-installed or via deployment imaging. Provides long-term servicing channel (LTSC) stability and unified OPOS peripheral communication.</p>",
      highlights: [
        "10-year Long-Term Servicing Channel (LTSC) OS lifecycle support",
        "Pre-installed OPOS driver pack for printers, cash drawers, and displays",
        "Hardware watchdog and shell lockdown security capabilities",
        "Turnkey setup for immediate POS application installation",
      ],
      status: "published" as const,
      isFeatured: false,
      sortOrder: 12,
      seoTitle: "Windows 11 IoT OS & OPOS Drivers | Mifaretech",
      seoDescription: "Pre-configured embedded OS image and certified OPOS peripheral drivers.",
      publishedAt: new Date(),
    },
  ];

  for (const prod of productDefs) {
    await db
      .insert(schema.products)
      .values(prod)
      .onConflictDoUpdate({
        target: schema.products.slug,
        set: {
          name: prod.name,
          modelNumber: prod.modelNumber,
          shortDescription: prod.shortDescription,
          descriptionHtml: prod.descriptionHtml,
          highlights: prod.highlights,
          status: prod.status,
          isFeatured: prod.isFeatured,
          sortOrder: prod.sortOrder,
          seoTitle: prod.seoTitle,
          seoDescription: prod.seoDescription,
          publishedAt: prod.publishedAt,
        },
      });
  }
  console.log("✅ Seeded products");

  // 3. Product Specs
  const specs = [
    {
      productId: "a1111111-1111-1111-1111-111111111111",
      group: "Performance",
      label: "Processor",
      value: "Intel Celeron / Core i3 Fanless Low Power",
    },
    {
      productId: "a1111111-1111-1111-1111-111111111111",
      group: "Display",
      label: "Screen Size",
      value: "15.6 inch TFT LCD (1920 x 1080 Full HD)",
    },
    {
      productId: "a1111111-1111-1111-1111-111111111111",
      group: "Display",
      label: "Touch Type",
      value: "Projected Capacitive Multi-Touch (PCAP)",
    },
    {
      productId: "a1111111-1111-1111-1111-111111111111",
      group: "Connectivity",
      label: "I/O Ports",
      value: "6x USB 2.0/3.0, 4x COM (RJ45/DB9), 1x Gigabit LAN, 1x RJ11",
    },
    {
      productId: "a2222222-2222-2222-2222-222222222222",
      group: "Printing",
      label: "Speed",
      value: "Up to 300 mm/second",
    },
    {
      productId: "a2222222-2222-2222-2222-222222222222",
      group: "Printing",
      label: "Resolution",
      value: "203 DPI (8 dots/mm)",
    },
    {
      productId: "a2222222-2222-2222-2222-222222222222",
      group: "Paper",
      label: "Roll Width",
      value: "80mm / 58mm with spacer plate",
    },
    {
      productId: "a2222222-2222-2222-2222-222222222222",
      group: "Reliability",
      label: "Cutter Life",
      value: "1,500,000 cuts",
    },
    {
      productId: "a3333333-3333-3333-3333-333333333333",
      group: "Optical",
      label: "Sensor",
      value: "CMOS 1280 x 800 pixels",
    },
    {
      productId: "a3333333-3333-3333-3333-333333333333",
      group: "Symbologies",
      label: "Decoding",
      value: "All standard 1D barcodes + 2D QR, DataMatrix, PDF417",
    },
  ];

  await db.delete(schema.productSpecs);
  for (const s of specs) {
    await db.insert(schema.productSpecs).values(s);
  }
  console.log("✅ Seeded product specs");

  // 4. Site Settings
  const settings = [
    {
      key: "company",
      value: {
        legalName: "Mifaretech System Solutions",
        tagline: "Mifaretech ...lean forward smartly!",
        accreditation: "Accredited Fametech Distributor",
        foundedYear: 2018,
      },
    },
    {
      key: "contact",
      value: {
        emails: ["sales@mifaretech.co.uk", "support@mifaretech.co.uk"],
        phones: ["+44 7448 670925"],
        whatsapp: "+447448670925",
        address: "London & Nationwide UK Operations / Regional Hubs",
        hours: "Mon – Fri: 08:30 – 17:30 GMT",
        dispatch: "UK Nationwide & West Africa Hubs",
      },
    },
    {
      key: "seo",
      value: {
        siteName: "Mifaretech System Solutions",
        defaultTitle: "Mifaretech | ...lean forward smartly!",
        defaultDescription:
          "Accredited distributor of high-performance Fametech POS terminals, receipt printers, and barcode scanners.",
      },
    },
  ];

  for (const set of settings) {
    await db
      .insert(schema.siteSettings)
      .values(set)
      .onConflictDoUpdate({
        target: schema.siteSettings.key,
        set: { value: set.value },
      });
  }
  console.log("✅ Seeded site settings");

  // 5. Page SEO
  const pageSeoList = [
    {
      page: "home" as const,
      title: "Mifaretech | ...lean forward smartly!",
      description:
        "Accredited distributor of high-performance POS terminals, thermal receipt printers, and barcode scanners.",
    },
    {
      page: "about" as const,
      title: "About Us | Mifaretech",
      description:
        "Accredited distributor bridge connecting direct Fametech hardware engineering with enterprise retail operators.",
    },
    {
      page: "catalogue" as const,
      title: "Enterprise Hardware Catalogue | Mifaretech",
      description:
        "Commercial POS terminals, high-speed thermal printers, and omnidirectional barcode scanners.",
    },
    {
      page: "solutions" as const,
      title: "Industry Solutions & Staging | Mifaretech",
      description:
        "Tailored counter hardware setups for retail boutiques, supermarkets, restaurants, and pharmacies.",
    },
    {
      page: "contact" as const,
      title: "Contact & Hardware Enquiries | Mifaretech",
      description:
        "Speak with a hardware specialist or request commercial fleet pricing on genuine Fametech equipment.",
    },
  ];

  for (const ps of pageSeoList) {
    await db
      .insert(schema.pageSeo)
      .values(ps)
      .onConflictDoUpdate({
        target: schema.pageSeo.page,
        set: { title: ps.title, description: ps.description },
      });
  }
  console.log("✅ Seeded page SEO");

  // 6. Content Blocks
  const contentBlocksData = [
    {
      page: "home" as const,
      blockKey: "hero",
      title: "We engineer hardware for busy counters",
      bodyHtml:
        "<p>Accredited distributor of high-performance POS touch terminals, thermal receipt printers, omnidirectional barcode scanners, and enterprise retail infrastructure. Built for non-stop reliability.</p>",
      data: {
        tagline: "Mifaretech ...lean forward smartly!",
        badge: "Accredited Fametech Distributor",
        ctaPrimary: "Request a Quote",
        ctaSecondary: "Browse Catalogue",
      },
    },
    {
      page: "home" as const,
      blockKey: "why-mifaretech",
      title: "Why leading retailers trust Mifaretech",
      bodyHtml:
        "<p>Direct factory accreditation guarantees zero grey-market risk, verified serial numbers, and industrial non-stop uptime.</p>",
      data: {
        pillars: [
          {
            number: "01",
            title: "Direct Factory Provenance",
            desc: "No refurbished units, zero third-party grey market risk. All hardware originates directly from Fametech assembly lines with sealed warranties.",
          },
          {
            number: "02",
            title: "Counter Uptime Engineering",
            desc: "Commercial fanless aluminum housings dissipate heat silently and protect motherboards from dust, grease, and airborne counter particulates.",
          },
          {
            number: "03",
            title: "Dedicated Hardware Specialists",
            desc: "Speak directly with engineers who understand interface drivers, OPOS configurations, and multi-terminal network deployments.",
          },
        ],
      },
    },
    {
      page: "home" as const,
      blockKey: "stats",
      title: "Engineered for high-volume transactions",
      data: {
        stats: [
          { value: "50,000+", label: "Operating Hours MTBF" },
          { value: "< 0.12%", label: "Hardware RMA Rate" },
          { value: "300 mm/s", label: "Peak Thermal Print Speed" },
          { value: "24-48h", label: "Fleet Replacement Dispatch" },
        ],
      },
    },
  ];

  for (const cb of contentBlocksData) {
    await db
      .insert(schema.contentBlocks)
      .values(cb)
      .onConflictDoUpdate({
        target: [schema.contentBlocks.page, schema.contentBlocks.blockKey],
        set: {
          title: cb.title,
          bodyHtml: cb.bodyHtml,
          data: cb.data,
        },
      });
  }
  console.log("✅ Seeded content blocks");

  // 7. Solutions
  const solutionItems = [
    {
      kind: "industry" as const,
      title: "Retail Boutiques & Apparel Chains",
      slug: "retail-boutiques",
      summary:
        "Aesthetic bezel-free touch terminals, secondary customer displays, and fast barcode scanning for elevated checkout experiences.",
      bodyHtml:
        "<p>Modern apparel and boutique retail demands sleek hardware that complements store aesthetics while offering dependable transaction processing.</p>",
      sortOrder: 1,
    },
    {
      kind: "industry" as const,
      title: "Supermarkets & FMCG Checkout",
      slug: "supermarkets-fmcg",
      summary:
        "High-throughput lanes with hands-free omnidirectional 2D scanners, heavy steel cash drawers, and dual thermal printers.",
      bodyHtml:
        "<p>Continuous customer queues require equipment that operates smoothly under sustained item scanning and heavy cash drawer cycles.</p>",
      sortOrder: 2,
    },
    {
      kind: "industry" as const,
      title: "Quick-Service Restaurants & Hospitality",
      slug: "qsr-hospitality",
      summary:
        "Spill-resistant fanless touch stations built to endure kitchen humidity, heat, and high-frequency dispatch orders.",
      bodyHtml:
        "<p>IP65-rated front panels resist grease and liquid accidents, keeping order processing active during rush hours.</p>",
      sortOrder: 3,
    },
    {
      kind: "service" as const,
      title: "Turnkey Hardware Procurement",
      slug: "hardware-procurement",
      summary:
        "Brand-new, factory-sealed POS terminals, thermal printers, cash drawers, and scanners with verified manufacturer warranty.",
      sortOrder: 1,
    },
    {
      kind: "service" as const,
      title: "Pre-Deployment Staging & Driver Flashing",
      slug: "staging-driver-flashing",
      summary:
        "Pre-configured firmware, OPOS drivers, and operating system images tailored for zero-friction on-site deployment.",
      sortOrder: 2,
    },
  ];

  for (const sol of solutionItems) {
    await db
      .insert(schema.solutions)
      .values(sol)
      .onConflictDoUpdate({
        target: schema.solutions.slug,
        set: {
          title: sol.title,
          summary: sol.summary,
          bodyHtml: sol.bodyHtml,
          sortOrder: sol.sortOrder,
        },
      });
  }
  console.log("✅ Seeded solutions");

  // 8. FAQs
  const faqItems = [
    {
      question: "Are all POS terminals and printers brand new with manufacturer warranty?",
      answerHtml:
        "<p>Yes. Mifaretech is an accredited direct distributor for Fametech. Every unit is brand new, sealed in original factory packaging with full serial traceability and comprehensive warranty support.</p>",
      sortOrder: 1,
    },
    {
      question: "Do your touch terminals support standard Windows and Linux POS software?",
      answerHtml:
        "<p>Yes. Our POS terminals feature standard x86 Intel architectures and support Windows 10/11 IoT Enterprise, Windows Pro, and standard Linux distributions (Ubuntu, Debian) with universal OPOS drivers.</p>",
      sortOrder: 2,
    },
    {
      question: "How quickly can replacement hardware or fleet orders be dispatched?",
      answerHtml:
        "<p>Standard hardware models in stock are dispatched within 24 hours across the UK and to our regional international logistics hubs. Custom firmware staging orders typically dispatch in 48 hours.</p>",
      sortOrder: 3,
    },
    {
      question: "Can we request sample units for evaluation before large-scale rollouts?",
      answerHtml:
        "<p>Yes. Qualified retail chains, POS software ISVs, and enterprise partners can request evaluation demo units through our sales consultation team.</p>",
      sortOrder: 4,
    },
  ];

  await db.delete(schema.faqs);
  for (const faq of faqItems) {
    await db.insert(schema.faqs).values(faq);
  }
  console.log("✅ Seeded FAQs");

  // 9. Testimonials
  const testimonialItems = [
    {
      quote:
        "Mifaretech provided 45 Fametech terminals for our multi-store upgrade. Zero hardware failures in 18 months of rigorous daily checkout.",
      authorName: "Marcus Sterling",
      authorRole: "Head of Retail IT",
      company: "Apex Food Markets",
      sortOrder: 1,
    },
    {
      quote:
        "The PRP-300 thermal printers are virtually unjammable. The 300mm/s speed made a palpable difference to our peak-hour counter throughput.",
      authorName: "Sarah Jenkins",
      authorRole: "Operations Director",
      company: "Coastal Hospitality Group",
      sortOrder: 2,
    },
  ];

  await db.delete(schema.testimonials);
  for (const t of testimonialItems) {
    await db.insert(schema.testimonials).values(t);
  }
  console.log("✅ Seeded testimonials");

  // 10. Partners
  const partnerItems = [
    {
      name: "Fametech (TYSSO)",
      websiteUrl: "https://fametech.com.tw",
      accreditationNote: "Accredited Global Hardware Manufacturer",
      sortOrder: 1,
    },
    {
      name: "Intel IoT Solutions",
      websiteUrl: "https://intel.com",
      accreditationNote: "Embedded Processing Partner",
      sortOrder: 2,
    },
    {
      name: "Microsoft Windows IoT",
      websiteUrl: "https://microsoft.com",
      accreditationNote: "Certified OS Partner",
      sortOrder: 3,
    },
  ];

  await db.delete(schema.partners);
  for (const p of partnerItems) {
    await db.insert(schema.partners).values(p);
  }
  console.log("✅ Seeded partners");

  console.log("🎉 Database seeding complete!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
