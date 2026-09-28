import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mifaretech System Solutions",
    short_name: "Mifaretech",
    description:
      "Accredited distributor of high-performance POS terminals, thermal receipt printers, and barcode scanners.",
    start_url: "/",
    display: "standalone",
    background_color: "#00082E",
    theme_color: "#F27500",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
