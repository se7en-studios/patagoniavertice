import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { coverImage } from "@/lib/property-images";
import { siteName, siteUrl } from "@/lib/seo";

export const alt = `Propiedad en ${siteName}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Edge: el runtime Node de next/og falla en Windows (fileURLToPath) y no necesitamos disco.
export const runtime = "edge";

const MAX_IMAGE_BYTES = 1_500_000;
const PHOTO_MIMES = ["image/jpeg", "image/png"];

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

/** Devuelve data URI (solo jpg/png, que es lo que soporta satori) o null para caer a diseño solo-texto. */
async function loadPhoto(src: string): Promise<string | null> {
  try {
    const isAbsolute = src.startsWith("http://") || src.startsWith("https://");
    const url = isAbsolute
      ? src
      : `${siteUrl}${src.startsWith("/") ? "" : "/"}${src}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    const mime = (res.headers.get("content-type") ?? "").split(";")[0];
    if (!res.ok || !PHOTO_MIMES.includes(mime)) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.length > MAX_IMAGE_BYTES) return null;
    return `data:${mime};base64,${toBase64(bytes)}`;
  } catch {
    return null;
  }
}

function formatPrice(precio: number | null, moneda: string | null) {
  if (!precio) return "Consultar precio";
  return `${moneda ?? "USD"} ${precio.toLocaleString("es-AR")}`;
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let titulo = "Propiedad en Neuquén y Río Negro";
  let ciudad = "";
  let precio = "";
  let photo: string | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("propiedades")
      .select("titulo, ciudad, precio, moneda, imagenes")
      .eq("id", id)
      .eq("publicado", true)
      .single();
    if (data) {
      titulo = String(data.titulo).slice(0, 90);
      ciudad = data.ciudad ?? "";
      precio = formatPrice(data.precio, data.moneda);
      photo = await loadPhoto(coverImage(data.imagenes));
    }
  } catch {
    /* sin conexión: diseño genérico */
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#0F1A30",
        color: "#F0EBE1",
      }}
    >
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          width={520}
          height={630}
          style={{ objectFit: "cover" }}
          alt=""
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#C9A84C",
            letterSpacing: 3,
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: photo ? 52 : 68,
            fontWeight: 700,
            marginTop: 24,
            lineHeight: 1.1,
          }}
        >
          {titulo}
        </div>
        {ciudad && (
          <div
            style={{
              display: "flex",
              fontSize: 32,
              marginTop: 20,
              opacity: 0.75,
            }}
          >
            {ciudad}
          </div>
        )}
        {precio && (
          <div
            style={{
              display: "flex",
              fontSize: 44,
              marginTop: 28,
              color: "#C9A84C",
            }}
          >
            {precio}
          </div>
        )}
      </div>
    </div>,
    size,
  );
}
