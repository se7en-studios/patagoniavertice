import { ImageResponse } from "next/og";
import { siteName, siteTagline, siteUrl } from "@/lib/seo";

export const alt = `${siteName} · ${siteTagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default function Image() {
  const logoUrl = `${siteUrl}/logo-altum-crop.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: "linear-gradient(135deg, #060C18 0%, #0B1528 60%, #101F3C 100%)",
          color: "#F6F8FB",
          border: "2px solid rgba(201,168,76,0.35)",
        }}
      >
        {/* Columna izquierda: Identidad y Propuesta */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "720px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: 48,
                height: 3,
                background: "#C9A84C",
                display: "flex",
              }}
            />
            <div
              style={{
                display: "flex",
                fontSize: 20,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#C9A84C",
                fontWeight: 600,
              }}
            >
              ESTELA MARI ROJAS · MAT. 35 RP 2026
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 78,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: 2,
              lineHeight: 1.05,
            }}
          >
            {siteName}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "#C9A84C",
              marginTop: 14,
              fontWeight: 600,
            }}
          >
            {siteTagline}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "rgba(246,248,251,0.78)",
              marginTop: 26,
              lineHeight: 1.4,
            }}
          >
            Lotes frente al Lago Mari Menuco · Residencias en Cipolletti · Tasaciones Oficiales &amp; Consultoría en Río Negro y Neuquén
          </div>
        </div>

        {/* Columna derecha: Emblema Oficial ALTUM sobre insignia blanca */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 270,
            height: 290,
            borderRadius: 36,
            background: "#FFFFFF",
            border: "4px solid #C9A84C",
            boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
            padding: 28,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="Logo ALTUM SCI"
            width={195}
            height={228}
            style={{
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
