import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/seo";
import { GUIAS_SEO } from "@/lib/guias-seo";

const INDEXNOW_KEY = "altumsci2026indexnow";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      urls?: string[];
    };

    const host = new URL(siteUrl).host;
    const showcaseIds = [
      "mari-menuco-primera-linea",
      "residencia-cipolletti-premium",
      "lote-panoramico-mari-menuco",
      "fraccion-desarrollo-alto-valle",
      "departamento-corporativo-cipolletti",
      "lote-segunda-linea-playas",
    ];
    const urlList =
      body.urls && body.urls.length > 0
        ? body.urls
        : [
            siteUrl,
            `${siteUrl}/en`,
            `${siteUrl}/proyectos`,
            `${siteUrl}/guias`,
            `${siteUrl}/inmobiliaria-cipoletti`,
            `${siteUrl}/inmobiliaria-catriel`,
            `${siteUrl}/propiedades-rio-negro`,
            `${siteUrl}/servicios`,
            `${siteUrl}/nosotros`,
            `${siteUrl}/contacto`,
            ...GUIAS_SEO.map((g) => `${siteUrl}/guias/${g.slug}`),
            ...showcaseIds.map((id) => `${siteUrl}/proyectos/${id}`),
          ];

    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
      urlList,
    };

    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      submittedCount: urlList.length,
      urls: urlList,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}

