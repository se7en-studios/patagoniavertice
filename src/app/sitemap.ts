import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/seo";
import { GUIAS_SEO } from "@/lib/guias-seo";

type Entry = [
  path: string,
  changeFrequency: "daily" | "weekly" | "monthly",
  priority: number,
];

const STATIC: Entry[] = [
  ["", "weekly", 1],
  ["/en", "weekly", 0.9],
  ["/proyectos", "weekly", 0.95],
  ["/guias", "daily", 0.9],
  ["/propiedades-rio-negro", "monthly", 0.85],
  ["/inmobiliaria-cipoletti", "monthly", 0.85],
  ["/inmobiliaria-catriel", "monthly", 0.85],
  ["/servicios", "monthly", 0.8],
  ["/contacto", "monthly", 0.75],
  ["/nosotros", "monthly", 0.7],
  ["/sumate", "monthly", 0.4],
];

const SHOWCASE_PROPERTY_IDS = [
  "mari-menuco-primera-linea",
  "residencia-cipolletti-premium",
  "lote-panoramico-mari-menuco",
  "fraccion-desarrollo-alto-valle",
  "departamento-corporativo-cipolletti",
  "lote-segunda-linea-playas",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = STATIC.map(
    ([path, changeFrequency, priority]) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const guiaPages: MetadataRoute.Sitemap = GUIAS_SEO.map((g) => ({
    url: `${siteUrl}/guias/${g.slug}`,
    lastModified: new Date(g.fechaActualizacion),
    changeFrequency: "weekly" as const,
    priority: 0.88,
  }));

  const showcasePages: MetadataRoute.Sitemap = SHOWCASE_PROPERTY_IDS.map(
    (id) => ({
      url: `${siteUrl}/proyectos/${id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }),
  );

  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("propiedades")
      .select("id, updated_at")
      .eq("publicado", true);
    propertyPages = (data ?? [])
      .filter((p) => !SHOWCASE_PROPERTY_IDS.includes(p.id))
      .map((p) => ({
        url: `${siteUrl}/proyectos/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
  } catch {
    /* Supabase no disponible: el sitemap incluye las páginas estáticas, guías y propiedades showcase */
  }

  return [...staticPages, ...guiaPages, ...showcasePages, ...propertyPages];
}
