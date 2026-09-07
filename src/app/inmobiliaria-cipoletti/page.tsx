import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://altumsci.com.ar";

export const metadata: Metadata = {
  title: "Inmobiliaria en Cipolletti: Propiedades & Inversión en Río Negro",
  description:
    "Altum Inmobiliaria en Cipolletti, Río Negro. Casas en venta, alquileres, loteos residenciales y asesoramiento legal con martillera matriculada.",
  keywords: [
    "inmobiliaria Cipolletti",
    "inmobiliaria Cipoletti",
    "propiedades en Cipolletti",
    "casas en venta Cipolletti",
    "alquiler Cipolletti Río Negro",
    "lotes en venta Cipolletti",
    "tasaciones Cipolletti",
    "Altum Cipolletti",
    "martillero Cipolletti",
    "Alto Valle inmobiliaria",
  ],
  alternates: { canonical: `${siteUrl}/inmobiliaria-cipoletti` },
  openGraph: {
    title: "Inmobiliaria en Cipolletti - Altum Inmobiliaria",
    description:
      "La inmobiliaria de referencia en Cipolletti. Propiedades residenciales, loteos y comerciales en el Alto Valle de Río Negro.",
    url: `${siteUrl}/inmobiliaria-cipoletti`,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

const serviciosCipolletti = [
  {
    titulo: "Compra y Venta en Cipolletti",
    descripcion:
      "Casas en barrios cerrados, departamentos céntricos y lotes residenciales con documentación 100% verificada.",
    icon: "🏡",
  },
  {
    titulo: "Alquileres & Renta Residencial",
    descripcion:
      "Administración integral de alquileres con garantía de cobro puntual y rigurosa selección de inquilinos.",
    icon: "🔑",
  },
  {
    titulo: "Tasaciones Oficiales",
    descripcion:
      "Tasación profesional con firma de Estela Mari Rojas (Mat. 35 RP 2026) basada en operaciones reales del Alto Valle.",
    icon: "📊",
  },
  {
    titulo: "Loteos & Nuevos Desarrollos",
    descripcion:
      "Comercialización de loteos en zonas de alta plusvalía y expansión urbana de Cipolletti.",
    icon: "📐",
  },
];

const barrios = [
  "Centro",
  "Los Tilos",
  "Rincón Lindo",
  "El Manzanar",
  "Las Viñas",
  "La Falda",
  "Ferri",
  "Costa Norte",
];

export default function InmobiliariaCipollettiPage() {
  return (
    <main className="bg-crema min-h-screen">
      {/* Breadcrumb Schema */}
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
                name: "Inmobiliaria Cipolletti",
                item: `${siteUrl}/inmobiliaria-cipoletti`,
              },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section
        className="relative pt-40 pb-24 lg:pb-32 overflow-hidden text-crema"
        style={{
          background:
            "linear-gradient(135deg, #0A1228 0%, #0F1A3E 50%, #080E1A 100%)",
        }}
      >
        <div className="absolute inset-0 grain-overlay opacity-[0.03] pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-dorado/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 z-10">
          <nav
            className="flex items-center gap-2 mb-8 font-body text-[11px] tracking-[0.15em] uppercase"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-crema/30 hover:text-dorado transition-colors"
            >
              Inicio
            </Link>
            <span className="text-dorado/30">·</span>
            <span className="text-dorado/70">Cipolletti</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-10 bg-dorado" />
            <span className="font-body text-dorado/70 text-[10px] tracking-[0.3em] uppercase">
              Río Negro · Alto Valle
            </span>
          </div>

          <h1
            className="font-display font-medium text-crema leading-[1.05] mb-6 max-w-4xl"
            style={{
              fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Inmobiliaria en{" "}
            <em className="not-italic italic text-dorado font-normal">
              Cipolletti
            </em>
          </h1>

          <p className="font-body text-crema/50 text-[16px] leading-relaxed max-w-2xl mb-10">
            Somos la inmobiliaria de referencia en Cipolletti y el Alto Valle de
            Río Negro. Comprá, vendé o administrá tu propiedad con respaldo
            matriculado y transparencia total.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/5492996095742?text=Hola%2C%20busco%20asesoramiento%20inmobiliario%20en%20Cipolletti"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer inline-flex items-center justify-center gap-3 px-8 py-4 font-body text-tierra text-[11px] font-semibold tracking-[0.15em] uppercase"
            >
              Consultar Propiedades en Cipolletti
            </a>
            <Link
              href="/proyectos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-crema/15 text-crema/70 font-body text-[11px] tracking-[0.15em] uppercase hover:border-dorado hover:text-dorado transition-colors"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios en Cipolletti */}
      <section
        className="py-24 bg-navy-900 text-crema"
        style={{ background: "#060A13" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-10 bg-dorado" />
            <span className="font-body text-dorado/70 text-[10px] tracking-[0.3em] uppercase">
              Cobertura Integral
            </span>
          </div>

          <h2
            className="font-display font-medium text-crema mb-14"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Servicios inmobiliarios en{" "}
            <em className="not-italic italic text-dorado font-normal">
              Cipolletti
            </em>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-navy-700/20">
            {serviciosCipolletti.map((s) => (
              <div
                key={s.titulo}
                className="p-8 lg:p-10 bg-navy-950 border-l-2 border-dorado/30 hover:border-dorado transition-colors"
                style={{ background: "#080E1A" }}
              >
                <div className="text-3xl mb-4" aria-hidden="true">
                  {s.icon}
                </div>
                <h3 className="font-display font-medium text-crema text-xl mb-3">
                  {s.titulo}
                </h3>
                <p className="font-body text-crema/45 text-[14px] leading-relaxed">
                  {s.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Barrios */}
      <section className="py-16 bg-tierra text-crema">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="font-display font-medium text-crema text-2xl mb-6">
            Operamos en los principales barrios de Cipolletti
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {barrios.map((b) => (
              <span
                key={b}
                className="font-body text-[11px] tracking-[0.15em] uppercase px-4 py-2 border border-dorado/25 text-dorado"
                style={{ background: "rgba(201,168,76,0.08)" }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Tasación */}
      <section
        className="py-24 bg-navy-950 text-center text-crema"
        style={{ background: "#060A13" }}
      >
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <h2
            className="font-display font-medium text-crema"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.02em",
            }}
          >
            ¿Querés tasar o vender tu propiedad en{" "}
            <em className="not-italic italic text-dorado font-normal">
              Cipolletti
            </em>
            ?
          </h2>
          <p className="font-body text-crema/50 text-[15px]">
            Coordiná una tasación profesional con la Martillera Estela Mari
            Rojas (Mat. 35 RP 2026).
          </p>
          <a
            href="https://wa.me/5492996095742?text=Hola%20Altum%2C%20solicito%20tasacion%20en%20Cipolletti."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shimmer inline-flex items-center gap-3 px-10 py-4 font-body text-tierra text-[11px] font-semibold tracking-[0.16em] uppercase"
          >
            Solicitar Tasación en Cipolletti
          </a>
        </div>
      </section>
    </main>
  );
}
