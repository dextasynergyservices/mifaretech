export interface ProductSpec {
  group?: string;
  label: string;
  value: string;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  modelNumber: string;
  category:
    | "pos-terminals"
    | "receipt-printers"
    | "barcode-scanners"
    | "cash-drawers"
    | "kiosks"
    | "software";
  categoryName: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  specs: ProductSpec[];
  image: string;
  gallery: string[];
  datasheetUrl?: string;
  isFeatured?: boolean;
}

export const CATEGORIES = [
  { id: "all", name: "All Products" },
  { id: "pos-terminals", name: "POS Terminals" },
  { id: "receipt-printers", name: "Receipt Printers" },
  { id: "barcode-scanners", name: "Barcode Scanners" },
  { id: "cash-drawers", name: "Cash Drawers" },
  { id: "kiosks", name: "Self-Service Kiosks" },
  { id: "software", name: "POS Software" },
] as const;

export const PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    slug: "fametech-pos-1000",
    name: "Enterprise Touch POS Terminal",
    modelNumber: "POS-1000-HD",
    category: "pos-terminals",
    categoryName: "POS Terminals",
    shortDescription:
      'Ultra-responsive 15.6" bezel-free capacitive touch terminal designed for rigorous 24/7 retail and dining environments.',
    description:
      "The POS-1000-HD delivers enterprise-grade processing performance, an ultra-durable aluminum die-cast housing, and fanless heat dissipation for quiet, continuous operation in busy retail, supermarket, and restaurant counters.",
    highlights: [
      "15.6-inch Full HD bezel-free projected capacitive touch display",
      "Industrial-grade fanless architecture prevents dust ingestion",
      "Comprehensive I/O: 6x USB, 4x Serial, Gigabit LAN, RJ11 Cash Drawer port",
      'Optional secondary 10.1" customer-facing display',
    ],
    specs: [
      {
        group: "Processing",
        label: "Processor",
        value: "Intel® Core™ i3/i5 or Celeron® Quad-Core",
      },
      { group: "Processing", label: "Memory (RAM)", value: "8GB DDR4 (Expandable to 16GB)" },
      { group: "Processing", label: "Storage", value: "128GB / 256GB M.2 High-Speed SSD" },
      { group: "Display", label: "Primary Screen", value: '15.6" TFT LCD (1920 x 1080), 350 nits' },
      {
        group: "Display",
        label: "Touch Technology",
        value: "True-Flat 10-Point Projected Capacitive (PCAP)",
      },
      {
        group: "Connectivity",
        label: "Ports",
        value: "6x USB (2x USB 3.0), 3x COM (DB9), 1x RJ45 Gigabit LAN, 1x RJ11 (12V/24V)",
      },
      {
        group: "Physical",
        label: "Housing",
        value: "Heavy-duty Aluminum Die-Cast Chassis, IP65 Front Panel",
      },
    ],
    image: "/logo.png",
    gallery: ["/logo.png"],
    isFeatured: true,
  },
  {
    id: "prod-2",
    slug: "heavy-duty-thermal-receipt-printer",
    name: "High-Speed Thermal Receipt Printer",
    modelNumber: "PRP-300-PRO",
    category: "receipt-printers",
    categoryName: "Receipt Printers",
    shortDescription:
      "300mm/s rapid receipt printing with auto-cutter and triple connectivity for high-volume billing.",
    description:
      "Engineered for intense checkout pressure, the PRP-300-PRO produces crisp receipts and kitchen tickets at up to 300 mm per second. Equipped with USB, Ethernet, and Serial interfaces as standard.",
    highlights: [
      "Blazing 300 mm/sec thermal printing speed",
      "Durable auto-cutter rated for over 2 million cuts",
      "Triple Interface: USB + Ethernet (LAN) + RS-232 Serial",
      "Supports standard 80mm and 58mm paper widths",
    ],
    specs: [
      { group: "Printing", label: "Print Method", value: "Direct Thermal" },
      { group: "Printing", label: "Print Speed", value: "300 mm/second" },
      { group: "Printing", label: "Resolution", value: "203 DPI (8 dots/mm)" },
      { group: "Paper", label: "Paper Width", value: "79.5 ± 0.5 mm or 57.5 ± 0.5 mm" },
      { group: "Reliability", label: "Print Head Life", value: "150 km" },
      {
        group: "Reliability",
        label: "Auto-Cutter Life",
        value: "2,000,000 cuts (Partial / Full cut)",
      },
      {
        group: "Interface",
        label: "Standard Ports",
        value: "USB Type-B, RJ45 Ethernet, DB9 Serial, RJ11 Cash Drawer",
      },
    ],
    image: "/logo.png",
    gallery: ["/logo.png"],
    isFeatured: true,
  },
  {
    id: "prod-3",
    slug: "omnidirectional-2d-barcode-scanner",
    name: "Hands-Free Desktop 2D Presentation Scanner",
    modelNumber: "SC-900-OMNI",
    category: "barcode-scanners",
    categoryName: "Barcode Scanners",
    shortDescription:
      "Rapid omnidirectional scanning of 1D and 2D barcodes from paper labels and mobile phone screens.",
    description:
      "The SC-900-OMNI provides instantaneous hands-free barcode reading with aggressive decoding of faded, damaged, or digital screen barcodes, making checkout lanes flow effortlessly.",
    highlights: [
      "Omnidirectional scanning eliminates the need to align barcodes",
      "Instant decoding of electronic vouchers, QR codes, and PDF417",
      "Wide-angle field of view with motion tolerance",
      "Plug-and-play USB HID / Virtual COM connectivity",
    ],
    specs: [
      { group: "Optics", label: "Image Sensor", value: "1280 x 800 pixels CMOS" },
      { group: "Performance", label: "Scan Angle", value: "Horizontal 60°, Vertical 40°" },
      {
        group: "Supported Symbologies",
        label: "1D / 2D",
        value: "QR Code, DataMatrix, PDF417, UPC/EAN, Code 128, GS1 Databar",
      },
      { group: "Interface", label: "Cable", value: "USB (Keyboard Emulation / Virtual COM)" },
      {
        group: "Durability",
        label: "Drop Resistance",
        value: "Designed to survive 1.5m drops onto concrete",
      },
    ],
    image: "/logo.png",
    gallery: ["/logo.png"],
    isFeatured: true,
  },
  {
    id: "prod-4",
    slug: "heavy-duty-metal-cash-drawer",
    name: "Heavy-Duty Steel Cash Drawer",
    modelNumber: "CD-410-HD",
    category: "cash-drawers",
    categoryName: "Cash Drawers",
    shortDescription:
      "Solid steel construction with 3-position lock, reinforced roller bearings, and adjustable note/coin compartments.",
    description:
      "Built for maximum cash security and relentless daily cycles, the CD-410-HD features robust steel latching and a heavy-duty ball-bearing slide mechanism tested to over 1,000,000 opening cycles.",
    highlights: [
      "Reinforced heavy-gauge steel casing with anti-scratch powder coat",
      "3-position key lock: Locked closed, Manual open, Electrically driven",
      "5 adjustable bill slots with heavy wire grippers + 8 coin cups",
      "Direct RJ11 connection to all standard receipt printers",
    ],
    specs: [
      { group: "Dimensions", label: "Size (W x D x H)", value: "410mm x 420mm x 100mm" },
      { group: "Cash Tray", label: "Layout", value: "5 Bill / 8 Coin removable cash tray" },
      {
        group: "Mechanism",
        label: "Slide Bearings",
        value: "Polyurethane heavy-duty ball bearing rollers",
      },
      { group: "Lock", label: "Key Lock", value: "3-position lock with 2 keys" },
      { group: "Signal", label: "Voltage", value: "12V / 24V compatible pulse via RJ11" },
    ],
    image: "/logo.png",
    gallery: ["/logo.png"],
    isFeatured: false,
  },
  {
    id: "prod-5",
    slug: "self-service-ordering-kiosk",
    name: "Interactive Self-Service Payment Kiosk",
    modelNumber: "KS-215-STAND",
    category: "kiosks",
    categoryName: "Self-Service Kiosks",
    shortDescription:
      "21.5-inch freestanding or counter kiosk with integrated receipt printer and scanner for express checkout.",
    description:
      "Empower customers to place orders, browse catalogues, and pay independently. The KS-215 integrates an 80mm thermal receipt printer, 2D scanner, and mounting bracket for EMV card payment terminals.",
    highlights: [
      'Vibrant 21.5" portrait touch display with anti-glare finish',
      "Built-in 80mm high-speed thermal receipt printer with auto-cutter",
      "Integrated 2D barcode scanner for loyalty cards and coupons",
      "Modular pedestal stand with floor bolting or countertop bracket",
    ],
    specs: [
      {
        group: "Display",
        label: "Panel",
        value: '21.5" Full HD (1080 x 1920) 10-point PCAP Touch',
      },
      {
        group: "System",
        label: "Computing Unit",
        value: "Intel® Core™ i3 or Android Industrial SoC",
      },
      {
        group: "Printer",
        label: "Receipt Printer",
        value: "Integrated 80mm Thermal, 250mm/s auto-cutter",
      },
      { group: "Scanner", label: "Barcode Engine", value: "Wide-angle 2D Optical Imager" },
      {
        group: "Network",
        label: "Connectivity",
        value: "Gigabit Ethernet, Dual-Band Wi-Fi, Bluetooth",
      },
    ],
    image: "/logo.png",
    gallery: ["/logo.png"],
    isFeatured: true,
  },
  {
    id: "prod-6",
    slug: "retail-hospitality-pos-suite",
    name: "Enterprise Retail & POS Software Suite",
    modelNumber: "MFT-SUITE-V4",
    category: "software",
    categoryName: "POS Software",
    shortDescription:
      "Cloud-connected, offline-resilient POS management software with inventory tracking, sales reports, and multi-branch control.",
    description:
      "Designed for seamless pairing with Mifaretech hardware, this suite keeps your counter running even during internet dropouts, automatically synchronizing inventory, tax reports, and sales data once reconnected.",
    highlights: [
      "Offline-first architecture ensures sales never stop",
      "Real-time stock control, purchase orders, and supplier management",
      "Multi-store consolidated reporting and cloud dashboard",
      "Integrated employee permission tiers, shift reconciliations, and audit trails",
    ],
    specs: [
      {
        group: "Compatibility",
        label: "OS Support",
        value: "Windows 10/11 IoT Enterprise, Linux, Android",
      },
      {
        group: "Deployment",
        label: "Architecture",
        value: "Hybrid Cloud with local offline data persistence",
      },
      {
        group: "Integrations",
        label: "Peripherals",
        value: "Receipt printers, customer displays, barcode scanners, weight scales, cash drawers",
      },
      {
        group: "Compliance",
        label: "Tax & Fiscal",
        value: "Standard fiscal compliance modules and detailed VAT breakdown",
      },
    ],
    image: "/logo.png",
    gallery: ["/logo.png"],
    isFeatured: false,
  },
];
