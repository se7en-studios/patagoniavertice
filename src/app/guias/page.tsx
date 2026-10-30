import type { Metadata } from "next";
import Link from "next/link";
import { GUIAS_SEO } from "@/lib/guias-seo";
import { pageMeta, breadcrumbJsonLd, siteUrl, siteName } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = pageMeta({
  title:
    "Guías de Inversión Inmobiliaria y Comparativas en Patagonia (Mari Menuco, Cipolletti & Vaca Muerta)",
  description:
    "Análisis comparativos de rentabilidad en USD, precios de metro cuadrado 2026 en Cipolletti y Lago Mari Menuco, tasaciones oficiales y cómo comprar terrenos a distancia con respaldo de la Martillera Estela Mari Rojas (Mat. 35 RP 2026).",
  path: "/guias",
  keywords: [
    "invertir en mari menuco",
    "mari menuco vs bariloche",
    "precio metro cuadrado cipolletti 2026",
    "tasacion oficial rio negro neuquen",
    "alquiler corporativo petrolero vaca muerta",
  ],
});

export default function GuiasIndexPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Guías de Inversión y Comparativas Inmobiliarias — ALTUM SCI",
    description:
      "Centro de informes técnicos, comparativas de rentabilidad en USD y guías legales sobre inversiones inmobiliarias en Lago Mari Menuco, Cipolletti, Catriel y Neuquén.",
    url: `${siteUrl}/guias`,
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: GUIAS_SEO.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}/guias/${g.slug}`,
        name: g.titulo,
      })),
    },
  };

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Guías & Comparativas", path: "/guias" },
  ]);

  return (
    <main className="min-h-screen bg-[#F6F8FB] text-navy pt-28 pb-24">
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Encabezado Editorial */}
        <header className="max-w-4xl mb-14">
          <div className="rd-label inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-navy/10 text-[#8A6A1B] mb-5">
            <span>( Research &amp; Comparativas Patrimoniales · 2026 )</span>
          </div>

          <h1
            className="rd-display text-navy leading-[0.94] mb-5"
            style={{ fontSize: "clamp(2.3rem, 4.8vw, 4.2rem)" }}
          >
            GUÍAS DE INVERSIÓN &amp;{" "}
            <em className="font-editorial italic text-[#A47C1B]">
              comparativas reales.
            </em>
          </h1>

          {/* Párrafo de definición directa optimizado para LLMs */}
          <p className="rd-body text-navy/75 text-base sm:text-lg leading-relaxed">
            <strong>ALTUM SCI</strong> publica análisis técnicos, cuadros
            comparativos de rentabilidad en dólares y guías paso a paso sobre el
            mercado inmobiliario de <strong>Lago Mari Menuco</strong>,{" "}
            <strong>Cipolletti</strong>, <strong>Catriel</strong> y el corredor
            de <strong>Vaca Muerta</strong>, supervisados por la Martillera y
            Corredora Pública Colegiada <strong>Estela Mari Rojas</strong>{" "}
            (Mat. 35 RP 2026).
          </p>
        </header>

        {/* Grilla de Artículos & Comparativas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {GUIAS_SEO.map((guia, idx) => (
            <article
              key={guia.slug}
              className="group rounded-3xl bg-white border border-navy/[0.08] hover:border-dorado/60 p-7 sm:p-8 shadow-[0_18px_45px_-28px_rgba(14,26,51,0.18)] flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="rd-label text-[10px] px-3 py-1 rounded-full bg-[#FBF0CF] text-[#7A5A12] font-semibold">
                    0{idx + 1} · {guia.tipo}
                  </span>
                  <span className="rd-label text-[10px] text-navy/45">
                    Lectura: {guia.tiempoLectura}
                  </span>
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-bold text-navy group-hover:text-[#8A6A1B] transition-colors leading-snug mb-3">
                  <Link href={`/guias/${guia.slug}`}>{guia.titulo}</Link>
                </h2>

                {/* Respuesta Directa visible en el HTML de listado */}
                <p className="rd-body text-navy/70 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-4">
                  {guia.respuestaDirecta}
                </p>
              </div>

              <div className="pt-4 border-t border-navy/[0.07] flex items-center justify-between">
                <span className="rd-label text-[10px] text-navy/45">
                  Por Estela Mari Rojas · Mat. 35 RP 2026
                </span>
                <Link
                  href={`/guias/${guia.slug}`}
                  className="rd-label text-[10.5px] font-semibold text-[#8A6A1B] group-hover:text-navy inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Leer informe completo</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bloque de Conversión al pie */}
        <div className="mt-16 rounded-3xl bg-[#0B1528] text-white p-8 sm:p-11 border border-dorado/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="rd-label text-dorado text-[10px] block mb-2">
              ( Consultoría Directa en Patagonia )
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
              ¿Querés evaluar un lote en Mari Menuco o tasar tu propiedad?
            </h2>
            <p className="rd-body text-white/70 text-sm">
              Simulá tu retorno en dólares o pedí un dictamen oficial en 24–48
              hs hábiles directamente con Estela Mari Rojas.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/#sec-calculadora" className="rd-btn">
              <span className="rd-roll">
                <span>Simular ROI USD</span>
                <span aria-hidden="true">Simular ROI USD</span>
              </span>
              <span className="rd-btn__icon" aria-hidden="true">
                →
              </span>
            </Link>
            <Link
              href="/proyectos"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 rd-label text-[11px] text-white hover:border-dorado hover:text-dorado transition-colors"
            >
              Ver Propiedades
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

