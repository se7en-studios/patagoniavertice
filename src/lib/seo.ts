export const siteUrl = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://altumsci.com.ar"
).replace(/\/$/, "");
export const siteName = "ALTUM SCI";
export const siteTagline = "Servicios & Consultoría Inmobiliaria";

// Datos reales de contacto (src/data/site-config.json)
export const contact = {
  telephone: "+5492996095742",
  email: "altumsci@gmail.com",
};

export function absoluteUrl(path = ""): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Metadata de página con canonical + OG + Twitter coherentes (la imagen la aporta opengraph-image). */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}) {
  const url = absoluteUrl(opts.path);
  const fullTitle = `${opts.title} | ${siteName}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website" as const,
      locale: "es_AR",
      siteName,
      url,
      title: fullTitle,
      description: opts.description,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: fullTitle,
      description: opts.description,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Inicio", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path === "/" ? "" : it.path),
    })),
  };
}
