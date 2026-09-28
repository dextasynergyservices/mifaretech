import { ImageResponse } from "next/og";

export const alt = "Mifaretech | ...lean forward smartly!";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#00082E",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "80px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(242, 117, 0, 0.15)",
          border: "1px solid rgba(242, 117, 0, 0.4)",
          padding: "8px 20px",
          borderRadius: "9999px",
          color: "#F27500",
          fontSize: "20px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        Accredited Fametech Distributor
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Mifaretech
        </div>
        <div
          style={{
            fontSize: "44px",
            fontWeight: 800,
            color: "#F27500",
            letterSpacing: "-0.02em",
          }}
        >
          ...lean forward smartly!
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#94A3B8",
            maxWidth: "800px",
            marginTop: "8px",
            lineHeight: 1.4,
          }}
        >
          Enterprise touch POS terminals, thermal receipt printers, and omnidirectional barcode
          scanners built for non-stop counter reliability.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          paddingTop: "32px",
          color: "#64748B",
          fontSize: "20px",
          fontWeight: 600,
        }}
      >
        <span>mifaretech.co.uk</span>
        <span>United Kingdom • West Africa Hubs</span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
