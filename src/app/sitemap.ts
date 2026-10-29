import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/seo";

type Entry = [path: string, changeFrequency: "weekly" | "monthly", priority: number];

// ponytail: lastModified de páginas estáticas = fecha de build/revalidación; sin fecha real por página.
const STATIC: Entry[] = [
  ["", "weekly", 1],
  ["/proyectos", "weekly", 0.9],
  ["/propiedades-rio-negro", "monthly", 0.8],
  ["/inmobiliaria-cipoletti", "monthly", 0.8],
  ["/inmobiliaria-catriel", "monthly", 0.8],
  ["/servicios", "monthly", 0.8],
  ["/contacto", "monthly", 0.7],
  ["/nosotros", "monthly", 0.6],
  ["/sumate", "monthly", 0.4],
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

  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("propiedades")
      .select("id, updated_at")
      .eq("publicado", true);
    propertyPages = (data ?? []).map((p) => ({
      url: `${siteUrl}/proyectos/${p.id}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch {
    /* Supabase no disponible: el sitemap sale solo con páginas estáticas */
  }

  return [...staticPages, ...propertyPages];
}
