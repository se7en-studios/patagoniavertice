import { ImageResponse } from "next/og";
import { siteName, siteTagline } from "@/lib/seo";

export const alt = `${siteName} · ${siteTagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Edge: el runtime Node de next/og falla al prerenderizar en Windows (fileURLToPath).
export const runtime = "edge";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0F1A30",
          color: "#F0EBE1",
        }}
      >
        <div style={{ display: "flex", width: 120, height: 4, background: "#C9A84C", marginBottom: 40 }} />
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700, color: "#C9A84C", letterSpacing: 4 }}>
          {siteName}
        </div>
        <div style={{ display: "flex", fontSize: 44, marginTop: 24 }}>{siteTagline}</div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 40, opacity: 0.7 }}>
          Neuquén · Río Negro · Patagonia Argentina
        </div>
      </div>
    ),
    size,
  );
}
