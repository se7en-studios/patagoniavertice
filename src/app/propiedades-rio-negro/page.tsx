import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://altumsci.com.ar";

export const metadata: Metadata = {
  title: "Propiedades en Río Negro: Compra y Venta",
  description:
    "Encontrá propiedades en Río Negro con Altum Inmobiliaria. Casas, departamentos, terrenos y locales en venta y alquiler en Cipoletti, Catriel, General Roca, Viedma y toda la Patagonia Argentina.",
  keywords: [
    "propiedades Río Negro",
    "inmuebles Río Negro",
    "casas en venta Río Negro",
    "terrenos Río Negro",
    "alquiler Río Negro",
    "departamentos Río Negro",
    "comprar propiedad Río Negro",
    "inversión inmobiliaria Río Negro",
    "propiedades Patagonia Argentina",
    "inmobiliaria Río Negro",
    "mercado inmobiliario Río Negro",
    "General Roca propiedades",
    "Viedma inmobiliaria",
  ],
  alternates: { canonical: `${siteUrl}/propiedades-rio-negro` },
  openGraph: {
    title: "Propiedades en Río Negro - Altum Inmobiliaria",
    description:
      "El mercado inmobiliario de mayor crecimiento en Argentina. Propiedades en Cipoletti, Catriel, General Roca, Viedma y toda la Patagonia. Altum Inmobiliaria.",
    url: `${siteUrl}/propiedades-rio-negro`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const ciudades = [
  {
    nombre: "Cipoletti",
    descripcion:
      "Capital del Alto Valle. Mercado residencial activo con alta demanda de alquileres.",
    link: "/inmobiliaria-cipoletti",
    crecimiento: "Alta demanda",
  },
  {
    nombre: "Catriel",
    descripcion:
      "Ciudad petrolera con alto rendimiento de alquileres para trabajadores de la industria.",
    link: "/inmobiliaria-catriel",
    crecimiento: "Muy alta rentabilidad",
  },
  {
    nombre: "General Roca",
    descripcion:
      "Centro comercial y agroindustrial del Alto Valle con mercado inmobiliario en expansión.",
    link: "/contacto",
    crecimiento: "En expansión",
  },
  {
    nombre: "Viedma",
    descripcion:
      "Capital provincial con crecimiento sostenido impulsado por la administración pública.",
    link: "/contacto",
    crecimiento: "Crecimiento estable",
  },
  {
    nombre: "Neuquén (área)",
    descripcion:
      "Zona limítrofe con el mayor polo urbano de la Patagonia. Alta liquidez y demanda.",
    link: "/contacto",
    crecimiento: "Alta liquidez",
  },
  {
    nombre: "Zona Rural",
    descripcion:
      "Campos, chacras y propiedades rurales en el Valle del Río Negro y sus alrededores.",
    link: "/contacto",
    crecimiento: "Oportunidades únicas",
  },
];

const tiposPropiedad = [
  {
    tipo: "Casas",
    descripcion: "Viviendas familiares en todos los barrios de Río Negro.",
    icon: "🏡",
  },
  {
    tipo: "Departamentos",
    descripcion: "Unidades en edificios de altura y complejos residenciales.",
    icon: "🏢",
  },
  {
    tipo: "Terrenos",
    descripcion: "Lotes en urbanizaciones consolidadas y en desarrollo.",
    icon: "📐",
  },
  {
    tipo: "Locales Comerciales",
    descripcion: "Espacios para negocios y emprendimientos en zonas céntricas.",
    icon: "🏪",
  },
  {
    tipo: "Oficinas",
    descripcion:
      "Espacios de trabajo en los principales centros urbanos de Río Negro.",
    icon: "💼",
  },
  {
    tipo: "Campos y Chacras",
    descripcion: "Propiedades rurales y agrícolas en el Valle del Río Negro.",
    icon: "🌾",
  },
];

export default function PropiedadesRioNegro() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Propiedades Río Negro",
                item: `${siteUrl}/propiedades-rio-negro`,
              },
            ],
          }),
        }}
      />

      <main className="min-h-screen">
        {/* Hero */}
        <section
          className="relative pt-40 pb-24 lg:pb-32 overflow-hidden"
          style={{
            background:
              "linear-gradient(155deg, #0A1228 0%, #0F1A3E 45%, #080E1A 100%)",
          }}
        >
          <div className="absolute inset-0 grain-overlay opacity-[0.03] pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-dorado/20 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
            <nav
              className="flex items-center gap-2 mb-12 font-body text-[11px] tracking-[0.15em] uppercase"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                className="text-crema/30 hover:text-dorado transition-colors"
              >
                Inicio
              </Link>
              <span className="text-dorado/30">·</span>
              <span className="text-dorado/70">Propiedades Río Negro</span>
            </nav>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-10 bg-dorado" />
              <span className="font-body text-dorado/70 text-[10px] tracking-[0.3em] uppercase">
                Patagonia Argentina
              </span>
            </div>

            <h1
              className="font-display font-medium text-crema leading-[1.05] mb-6"
              style={{
                fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Propiedades en{" "}
              <em className="not-italic italic text-dorado">Río Negro</em>
            </h1>

            <p className="font-body text-crema/45 text-[16px] leading-relaxed max-w-2xl mb-10">
              Río Negro es la provincia con mayor crecimiento inmobiliario de la
              Patagonia Argentina. En Altum tenemos más de 5 años operando en el
              mercado local con más de 200 operaciones exitosas en toda la
              provincia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/5492996095742?text=Hola%2C%20busco%20propiedades%20en%20R%C3%ADo%20Negro"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shimmer inline-flex items-center justify-center gap-3 px-8 py-4 font-body text-tierra text-[11px] font-semibold tracking-[0.15em] uppercase"
              >
                Ver propiedades disponibles
              </a>
              <Link
                href="/proyectos"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-crema/15 text-crema/60 font-body text-[11px] tracking-[0.15em] uppercase hover:border-dorado hover:text-dorado transition-colors"
              >
                Ver proyectos
              </Link>
            </div>
          </div>
        </section>

        {/* Ciudades */}
        <section className="py-24 lg:py-32 bg-navy-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px w-10 bg-dorado" />
              <span className="font-body text-dorado/70 text-[10px] tracking-[0.3em] uppercase">
                Zonas donde operamos
              </span>
            </div>
            <h2
              className="font-display font-medium text-crema mb-16"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Propiedades en toda la{" "}
              <em className="not-italic italic text-dorado">
                provincia de Río Negro
              </em>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ciudades.map((c) => (
                <Link
                  key={c.nombre}
                  href={c.link}
                  className="group p-6 border border-crema/[0.06] hover:border-dorado/30 bg-navy-800 transition-all duration-300 hover:bg-navy-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display font-medium text-crema text-xl group-hover:text-dorado transition-colors">
                      {c.nombre}
                    </h3>
                    <span className="font-body text-[9px] tracking-[0.15em] uppercase px-2 py-1 text-dorado/60 border border-dorado/20">
                      {c.crecimiento}
                    </span>
                  </div>
                  <p className="font-body text-crema/35 text-[13px] leading-relaxed mb-4">
                    {c.descripcion}
                  </p>
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-dorado/50 group-hover:text-dorado transition-colors">
                    Ver propiedades →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Tipos de propiedad */}
        <section className="py-24 bg-tierra">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2
              className="font-display font-medium text-crema mb-16"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Tipos de propiedades en{" "}
              <em className="not-italic italic text-dorado">Río Negro</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tiposPropiedad.map((t) => (
                <div key={t.tipo} className="flex gap-4 items-start">
                  <span className="text-2xl shrink-0">{t.icon}</span>
                  <div>
                    <h3 className="font-display font-medium text-crema text-lg mb-2">
                      {t.tipo}
                    </h3>
                    <p className="font-body text-crema/40 text-[13px] leading-relaxed">
                      {t.descripcion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-navy-900 text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2
              className="font-display font-medium text-crema mb-6"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Tu propiedad ideal en{" "}
              <em className="not-italic italic text-dorado">Río Negro</em>
            </h2>
            <p className="font-body text-crema/40 text-[15px] mb-10">
              Contamos con un amplio portfolio de propiedades en toda la
              provincia. Consultanos y te presentamos las opciones que mejor se
              adaptan a tu presupuesto y objetivos.
            </p>
            <a
              href="https://wa.me/5492996095742?text=Hola%2C%20quiero%20ver%20propiedades%20disponibles%20en%20R%C3%ADo%20Negro"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer inline-flex items-center gap-3 px-10 py-4 font-body text-tierra text-[11px] font-semibold tracking-[0.15em] uppercase"
            >
              Consultar propiedades disponibles
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
