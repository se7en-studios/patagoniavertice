import type { Metadata } from "next";
import { pageMeta, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";

export const metadata: Metadata = pageMeta({
  title: "Inmobiliaria en Catriel | Venta y Alquiler",
  description:
    "Comprá, vendé o alquilá propiedades en Catriel, Río Negro. Casas, departamentos y alquiler corporativo con martillera matriculada (Mat. 35 RP 2026).",
  path: "/inmobiliaria-catriel",
  keywords: [
    "inmobiliaria Catriel",
    "propiedades en Catriel",
    "casas en venta Catriel",
    "alquiler Catriel Río Negro",
    "vender propiedad Catriel",
    "inversión inmobiliaria Catriel",
    "renta petrolera Catriel",
    "departamentos Catriel",
    "terrenos Catriel",
    "Altum Catriel",
  ],
});

const serviciosCatriel = [
  {
    titulo: "Propiedades Residenciales",
    descripcion:
      "Casas familiares, departamentos a estrenar y lotes en los sectores consolidados de Catriel.",
    icon: "🏠",
  },
  {
    titulo: "Renta Corporativa Petrolera",
    descripcion:
      "Gestión de contratos de alquiler para empresas de servicios petroleros y personal jerárquico con rentabilidad del 10% al 13% anual.",
    icon: "💰",
  },
  {
    titulo: "Inmuebles Comerciales & Galpones",
    descripcion:
      "Locales, bases operativas y depósitos adaptados a los requerimientos de la industria regional.",
    icon: "🏢",
  },
  {
    titulo: "Administración Integral",
    descripcion:
      "Control de pagos, liquidaciones mensuales y gestión de mantenimiento sin complicaciones para propietarios.",
    icon: "🔑",
  },
];

export default function InmobiliariaCatrielPage() {
  return (
    <main className="bg-crema min-h-screen">
      {/* Breadcrumb Schema */}
      <JsonLd data={breadcrumbJsonLd([{ name: "Inmobiliaria Catriel", path: "/inmobiliaria-catriel" }])} />

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
            <span className="text-dorado/70">Catriel</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <span className="rd-ping" />
            <div className="h-px w-8 bg-dorado" />
            <span className="rd-label !text-[10px] !tracking-[0.26em] text-dorado">
              [RÍO NEGRO · POLO ENERGÉTICO VACA MUERTA]
            </span>
          </div>

          <h1
            className="rd-display text-crema mb-6 max-w-4xl"
            style={{
              fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
            }}
          >
            Inmobiliaria en{" "}
            <em className="rd-serif text-dorado">
              Catriel
            </em>
          </h1>

          {/* Definición directa de 50 palabras optimizada para Google & ChatGPT */}
          <p className="font-body text-crema/75 text-base sm:text-lg leading-relaxed max-w-2xl mb-10">
            <strong>ALTUM SCI</strong> lidera la estructuración de alquileres
            corporativos petroleros (rentabilidad del 12% al 14% anual en USD),
            compraventa de fracciones logísticas sobre Ruta 151 (desde USD 95.000) y
            viviendas para ejecutivos en <strong>Catriel y el corredor norte de Vaca Muerta</strong>,
            bajo supervisión de la Martillera Estela Mari Rojas (Mat. 35 RP 2026).
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/5492996095742?text=Hola%2C%20busco%20propiedades%20o%20inversiones%20en%20Catriel"
              target="_blank"
              rel="noopener noreferrer"
              className="rd-btn justify-between bg-dorado hover:bg-dorado-light text-tierra rd-label !text-[10.5px] !tracking-[0.16em] pl-6 pr-2 py-2.5"
            >
              <span className="rd-roll" data-text="Consultar Oportunidades en Catriel">
                <span>Consultar Oportunidades en Catriel</span>
              </span>
              <span className="rd-btn__icon w-8 h-8 bg-[#070E1B] text-dorado">
                ↗
              </span>
            </a>
            <Link
              href="/proyectos?ciudad=Catriel"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-crema/20 text-crema/85 rd-label !text-[10.5px] !tracking-[0.16em] hover:border-dorado hover:text-dorado transition-colors"
            >
              Ver Activos en Catriel
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios en Catriel */}
      <section
        className="py-24 bg-navy-900 text-crema"
        style={{ background: "#060A13" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-10 bg-dorado" />
            <span className="font-body text-dorado/70 text-[10px] tracking-[0.3em] uppercase">
              Soluciones Integrales
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
              Catriel
            </em>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-navy-700/20">
            {serviciosCatriel.map((s) => (
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
            ¿Querés publicar o tasar una propiedad en{" "}
            <em className="not-italic italic text-dorado font-normal">
              Catriel
            </em>
            ?
          </h2>
          <p className="font-body text-crema/50 text-[15px]">
            Tasación profesional con la Martillera Estela Mari Rojas (Mat. 35 RP
            2026).
          </p>
          <a
            href="https://wa.me/5492996095742?text=Hola%20Altum%2C%20solicito%20tasacion%20en%20Catriel."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shimmer inline-flex items-center gap-3 px-10 py-4 font-body text-tierra text-[11px] font-semibold tracking-[0.16em] uppercase"
          >
            Solicitar Tasación en Catriel
          </a>
        </div>
      </section>
    </main>
  );
}
