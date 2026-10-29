import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import { coverImage } from "@/lib/property-images";
import { siteName } from "@/lib/seo";

export const alt = `Propiedad en ${siteName}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MAX_IMAGE_BYTES = 1_500_000;
const MIME: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };

/** Devuelve data URI (solo jpg/png, que es lo que soporta satori) o null para caer a diseño solo-texto. */
async function loadPhoto(src: string): Promise<string | null> {
  try {
    let buf: Buffer;
    let mime: string;
    if (/^https?:\/\//.test(src)) {
      const res = await fetch(src, { signal: AbortSignal.timeout(4000) });
      mime = (res.headers.get("content-type") ?? "").split(";")[0];
      if (!res.ok || !Object.values(MIME).includes(mime)) return null;
      buf = Buffer.from(await res.arrayBuffer());
    } else {
      const rel = path.normalize(src).split(path.sep).filter(Boolean).join(path.sep);
      if (rel.startsWith("..")) return null;
      mime = MIME[path.extname(rel).toLowerCase()];
      if (!mime) return null;
      buf = await readFile(path.join(process.cwd(), "public", rel));
    }
    if (buf.length > MAX_IMAGE_BYTES) return null;
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function formatPrice(precio: number | null, moneda: string | null) {
  if (!precio) return "Consultar precio";
  return `${moneda ?? "USD"} ${precio.toLocaleString("es-AR")}`;
}

export default async function Image({ params }: { params: { id: string } }) {
  let titulo = "Propiedad en Neuquén y Río Negro";
  let ciudad = "";
  let precio = "";
  let photo: string | null = null;

  try {
    const { data } = await createClient()
      .from("propiedades")
      .select("titulo, ciudad, precio, moneda, imagenes")
      .eq("id", params.id)
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
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0F1A30", color: "#F0EBE1" }}>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} width={520} height={630} style={{ objectFit: "cover" }} alt="" />
        )}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 64, flex: 1 }}>
          <div style={{ display: "flex", fontSize: 28, color: "#C9A84C", letterSpacing: 3 }}>{siteName}</div>
          <div style={{ display: "flex", fontSize: photo ? 52 : 68, fontWeight: 700, marginTop: 24, lineHeight: 1.1 }}>
            {titulo}
          </div>
          {ciudad && <div style={{ display: "flex", fontSize: 32, marginTop: 20, opacity: 0.75 }}>{ciudad}</div>}
          {precio && <div style={{ display: "flex", fontSize: 44, marginTop: 28, color: "#C9A84C" }}>{precio}</div>}
        </div>
      </div>
    ),
    size,
  );
}
