import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIAS_SEO, getGuiaBySlug } from "@/lib/guias-seo";
import { pageMeta, breadcrumbJsonLd, siteUrl, siteName } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function generateStaticParams() {
  return GUIAS_SEO.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guia = getGuiaBySlug(slug);
  if (!guia) {
    return { title: "Guía Inmobiliaria" };
  }
  return pageMeta({
    title: guia.titulo,
    description: guia.respuestaDirecta.slice(0, 160),
    path: `/guias/${guia.slug}`,
    keywords: guia.keywords,
  });
}

export default async function GuiaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guia = getGuiaBySlug(slug);
  if (!guia) notFound();

  const otrasGuias = GUIAS_SEO.filter((g) => g.slug !== guia.slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guia.titulo,
    description: guia.respuestaDirecta,
    datePublished: guia.fechaPublicacion,
    dateModified: guia.fechaActualizacion,
    author: {
      "@type": "Person",
      name: "Estela Mari Rojas",
      jobTitle: "Martillera y Corredora Pública Colegiada (Mat. 35 RP 2026)",
      url: `${siteUrl}/nosotros`,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon-altum.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/guias/${guia.slug}`,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guia.faqs.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.respuesta,
      },
    })),
  };

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Guías & Comparativas", path: "/guias" },
    { name: guia.titulo, path: `/guias/${guia.slug}` },
  ]);

  return (
    <main className="min-h-screen bg-[#F6F8FB] text-navy pt-28 pb-24">
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbs} />

      <article className="max-w-4xl mx-auto px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="rd-label text-[10px] text-navy/50 mb-6 flex flex-wrap items-center gap-2"
        >
          <Link href="/" className="hover:text-navy">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/guias" className="hover:text-navy">
            Guías &amp; Comparativas
          </Link>
          <span>/</span>
          <span className="text-[#8A6A1B] truncate max-w-[260px] sm:max-w-md">
            {guia.tipo}
          </span>
        </nav>

        {/* Encabezado del Artículo (Un único H1 semántico) */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rd-label text-[10px] px-3 py-1 rounded-full bg-[#FBF0CF] text-[#7A5A12] font-semibold">
              {guia.tipo}
            </span>
            <span className="rd-label text-[10px] text-navy/45">
              Actualizado: {guia.fechaActualizacion} · {guia.tiempoLectura} de
              lectura
            </span>
          </div>

          <h1
            className="font-display text-navy font-extrabold leading-[1.06] mb-4"
            style={{ fontSize: "clamp(1.95rem, 3.8vw, 3.1rem)" }}
          >
            {guia.titulo}
          </h1>

          <p className="rd-body text-navy/65 text-base sm:text-lg leading-relaxed">
            {guia.subtitulo}
          </p>
        </header>

        {/* RESPUESTA DIRECTA EN EL PRIMER PÁRRAFO (Optimizado para citación literal de ChatGPT, Perplexity y Google AI) */}
        <section
          aria-label="Respuesta directa"
          className="rounded-3xl bg-white border-2 border-dorado/50 p-6 sm:p-8 shadow-[0_18px_40px_-24px_rgba(14,26,51,0.16)] mb-10"
        >
          <div className="rd-label text-[10px] text-[#8A6A1B] font-semibold mb-2">
            ✦ Síntesis Ejecutiva · Respuesta Directa
          </div>
          <p className="rd-body text-navy text-base sm:text-[17px] leading-relaxed font-medium">
            {guia.respuestaDirecta}
          </p>
        </section>

        {/* Tabla Comparativa HTML Semántica (cuando aplica) */}
        {guia.tablaComparativa && guia.tablaHeaders && (
          <section className="mb-12 overflow-hidden rounded-3xl bg-white border border-navy/10 shadow-sm">
            <div className="px-6 py-4 bg-[#0B1528] text-white flex items-center justify-between">
              <h2 className="font-display text-base sm:text-lg font-bold">
                Cuadro Comparativo Directo (Mercado 2026)
              </h2>
              <span className="rd-label text-[9.5px] text-dorado">
                Fuente: ALTUM SCI · Mat. 35 RP 2026
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-navy/10 bg-[#F6F8FB] rd-label text-[10px] text-navy/70">
                    <th className="p-4">Criterio Evaluado</th>
                    <th className="p-4 text-[#7A5A12]">
                      {guia.tablaHeaders.colA}
                    </th>
                    <th className="p-4">{guia.tablaHeaders.colB}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/[0.07] rd-body text-xs sm:text-sm">
                  {guia.tablaComparativa.map((row) => (
                    <tr key={row.criterio} className="hover:bg-[#F6F8FB]/60">
                      <td className="p-4 font-semibold text-navy">
                        {row.criterio}
                      </td>
                      <td className="p-4 font-medium text-navy bg-[#FBF0CF]/20">
                        {row.opcionA}
                      </td>
                      <td className="p-4 text-navy/70">{row.opcionB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Desarrollo Técnico por Secciones */}
        <div className="space-y-8 mb-12">
          {guia.secciones.map((sec) => (
            <section
              key={sec.titulo}
              className="rounded-3xl bg-white border border-navy/[0.07] p-6 sm:p-8 space-y-3"
            >
              <h2 className="font-display text-xl sm:text-2xl font-bold text-navy">
                {sec.titulo}
              </h2>
              {sec.contenido.map((par, i) => (
                <p
                  key={i}
                  className="rd-body text-navy/75 text-sm sm:text-base leading-relaxed"
                >
                  {par}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* CTA de Acción Directa hacia la Herramienta que Resuelve el Problema */}
        <div className="rounded-3xl bg-[#0B1528] text-white p-7 sm:p-9 border border-dorado/35 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="rd-label text-dorado text-[10px] block mb-1.5">
              Respaldo Profesional · Estela Mari Rojas (Mat. 35 RP 2026)
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              ¿Querés dar el siguiente paso con números reales?
            </h3>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href={guia.ctaHref} className="rd-btn">
              <span className="rd-roll">
                <span>{guia.ctaTexto}</span>
                <span aria-hidden="true">{guia.ctaTexto}</span>
              </span>
              <span className="rd-btn__icon" aria-hidden="true">
                →
              </span>
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hola Estela (ALTUM SCI), leí su guía "${guia.titulo}" y quisiera recibir asesoramiento.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 rd-label text-[10.5px] text-white hover:border-dorado hover:text-dorado transition-colors"
            >
              WhatsApp Directo
            </a>
          </div>
        </div>

        {/* Preguntas Frecuentes del Artículo (Marcadas con FAQPage JSON-LD) */}
        <section className="mb-14">
          <h2 className="font-display text-2xl font-bold text-navy mb-5">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-3">
            {guia.faqs.map((faq) => (
              <div
                key={faq.pregunta}
                className="rounded-2xl bg-white border border-navy/10 p-5 sm:p-6"
              >
                <h3 className="font-display text-base sm:text-lg font-bold text-navy mb-2">
                  {faq.pregunta}
                </h3>
                <p className="rd-body text-navy/70 text-sm leading-relaxed">
                  {faq.respuesta}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Enlaces Internos a Otras Notas del Mismo Tema */}
        <section className="pt-8 border-t border-navy/10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-navy">
              Otras guías y comparativas relacionadas
            </h2>
            <Link
              href="/guias"
              className="rd-label text-[10px] text-[#8A6A1B] hover:underline"
            >
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otrasGuias.map((otra) => (
              <Link
                key={otra.slug}
                href={`/guias/${otra.slug}`}
                className="p-5 rounded-2xl bg-white border border-navy/[0.08] hover:border-dorado/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="rd-label text-[9.5px] text-[#8A6A1B] block mb-1.5">
                    {otra.tipo}
                  </span>
                  <h3 className="font-display text-sm font-bold text-navy line-clamp-3">
                    {otra.titulo}
                  </h3>
                </div>
                <span className="rd-label text-[9.5px] text-navy/50 mt-4 block">
                  Leer informe →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
