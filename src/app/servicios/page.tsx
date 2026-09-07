import type { Metadata } from "next";
import Link from "next/link";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { WHATSAPP_URL } from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://altumsci.com.ar";

export const metadata: Metadata = {
  title: "Servicios Inmobiliarios",
  alternates: { canonical: `${siteUrl}/servicios` },
  description:
    "Compra y venta de inmuebles, administración integral de alquileres, consultoría de inversión y contratos inmobiliarios en Río Negro y la Patagonia Argentina. Asesoría directa y profesional.",
  keywords: [
    "servicios inmobiliarios Río Negro",
    "compra venta inmuebles Patagonia",
    "administración alquileres Cipolletti",
    "consultoría inmobiliaria",
    "contratos inmobiliarios Río Negro",
    "tasaciones Cipolletti",
    "Altum Inmobiliaria",
  ],
};

const serviciosDetallados = [
  {
    num: "01",
    titulo: "Compra y Venta de Propiedades",
    categoria: "Residencial & Comercial",
    descripcion:
      "Acompañamiento integral en todo el proceso de adquisición o venta de casas, departamentos, terrenos, lotes en barrios privados y chacras en Río Negro y la Patagonia.",
    beneficios: [
      "Valuación de mercado real basada en operaciones efectivas cerradas.",
      "Fotografía profesional y difusión en canales de alta segmentación.",
      "Calificación previa de compradores para optimizar tiempos.",
      "Acompañamiento notarial y de escrituración hasta la entrega de llaves.",
    ],
    waQuery:
      "Hola Altum, me interesa asesoramiento para comprar o vender un inmueble.",
  },
  {
    num: "02",
    titulo: "Administración Integral de Alquileres",
    categoria: "Gestión de Renta & Mantenimiento",
    descripcion:
      "Nos encargamos de que tu propiedad genere ingresos constantes sin que tengas que ocuparte del día a día ni de la cobranza.",
    beneficios: [
      "Riguroso análisis crediticio y de garantías de inquilinos.",
      "Gestión de cobranza mensual y liquidación transparente.",
      "Supervisión y coordinación de mantenimiento y reparaciones.",
      "Actualizaciones contractuales conforme a la normativa vigente.",
    ],
    waQuery:
      "Hola Altum, me interesa delegar la administración de mi alquiler.",
  },
  {
    num: "03",
    titulo: "Consultoría de Inversión & Desarrollo",
    categoria: "Estrategia & Plusvalía",
    descripcion:
      "Asesoramos a inversores locales y foráneos (Buenos Aires, exterior) para identificar oportunidades de alta rentabilidad y plusvalía en el Alto Valle y la cordillera.",
    beneficios: [
      "Análisis de rendimiento proyectado (TIR, CAP Rate y Plusvalía).",
      "Detección de loteos y tierras estratégicas en zonas de expansión.",
      "Gestión de operaciones 100% a distancia para inversores remotos.",
      "Asesoramiento tributario y normativo regional.",
    ],
    waQuery:
      "Hola Altum, quisiera consultar opciones de inversión estratégica en la Patagonia.",
  },
  {
    num: "04",
    titulo: "Asesoría Legal & Redacción de Contratos",
    categoria: "Seguridad Jurídica",
    descripcion:
      "Redacción y revisión técnica de contratos inmobiliarios respaldada por martilleros y profesionales colegiados en Río Negro.",
    beneficios: [
      "Boleto de compraventa, reservas y cesiones de derechos.",
      "Contratos de locación residencial, comercial y temporaria.",
      "Revisión de títulos, planos y estados de dominio.",
      "Transparencia absoluta: sin cláusulas abusivas ni letra chica.",
    ],
    waQuery:
      "Hola Altum, necesito asesoría para la redacción o revisión de un contrato.",
  },
];

export default function ServiciosPage() {
  return (
    <main className="bg-crema min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="pt-40 pb-28 relative overflow-hidden text-crema"
        style={{
          background:
            "linear-gradient(145deg, #060A13 0%, #0D1628 50%, #080E1A 100%)",
        }}
      >
        <div className="absolute inset-0 grain-overlay opacity-[0.04] pointer-events-none" />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] opacity-15 blur-[140px] pointer-events-none rounded-full"
          style={{ background: "#C9A84C" }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-10 bg-dorado" />
            <span className="font-body text-dorado text-[11px] tracking-[0.35em] uppercase">
              Soluciones Inmobiliarias
            </span>
          </div>

          <h1
            className="font-display text-crema font-medium leading-[1.05] mb-6 max-w-4xl"
            style={{
              fontSize: "clamp(2.8rem, 6.5vw, 5.2rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Servicios inmobiliarios con{" "}
            <em className="not-italic italic text-dorado font-normal">
              rigor & respaldo
            </em>
          </h1>

          <p className="font-body text-crema/50 text-[15px] lg:text-base leading-relaxed max-w-2xl mb-10">
            Acompañamos a propietarios, compradores e inversores en cada etapa
            de su operación en Río Negro y la Patagonia Argentina. Trato directo
            y sin intermediarios.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer inline-flex items-center justify-center gap-3 px-8 py-4 font-body text-tierra text-[11px] font-semibold tracking-[0.16em] uppercase"
            >
              Consultar con un Asesor
            </a>
            <Link
              href="/proyectos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-crema/15 text-crema/70 font-body text-[11px] tracking-[0.16em] uppercase hover:border-dorado hover:text-dorado transition-colors"
            >
              Ver Propiedades Disponibles
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dorado/30 to-transparent" />
      </section>

      {/* ── Grid de Servicios ─────────────────────────────────────────────── */}
      <section className="py-28 bg-crema">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="space-y-16">
            {serviciosDetallados.map((s) => (
              <div
                key={s.num}
                className="p-8 lg:p-14 bg-white border border-tierra/10 shadow-sm hover:shadow-xl hover:border-dorado/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                {/* Info principal */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-dorado text-3xl font-bold">
                      {s.num}
                    </span>
                    <span className="h-px w-8 bg-dorado/40" />
                    <span className="font-body text-tierra/45 text-[11px] tracking-[0.2em] uppercase font-medium">
                      {s.categoria}
                    </span>
                  </div>

                  <h2 className="font-display text-tierra text-2xl lg:text-3xl font-medium">
                    {s.titulo}
                  </h2>

                  <p className="font-body text-tierra/65 text-sm lg:text-base leading-relaxed">
                    {s.descripcion}
                  </p>

                  <div className="pt-4 space-y-2.5">
                    <h3 className="font-body text-tierra/40 text-[10px] tracking-[0.2em] uppercase">
                      Puntos Clave del Servicio:
                    </h3>
                    {s.beneficios.map((b, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-tierra/80"
                      >
                        <span className="text-dorado mt-0.5">✦</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div
                  className="lg:col-span-5 p-8 bg-navy-950 text-crema flex flex-col justify-between space-y-6"
                  style={{ background: "#080E1A" }}
                >
                  <div className="space-y-2">
                    <span className="font-body text-dorado text-[10px] tracking-[0.2em] uppercase">
                      Atención Directa
                    </span>
                    <h3 className="font-display text-xl text-crema font-medium">
                      ¿Necesitás este servicio?
                    </h3>
                    <p className="font-body text-crema/45 text-xs">
                      Coordiná una reunión presencial o videollamada con nuestro
                      equipo.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <a
                      href={`https://wa.me/5492996095742?text=${encodeURIComponent(s.waQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-dorado text-tierra font-body text-[10px] font-semibold tracking-[0.18em] uppercase hover:bg-dorado-light transition-all text-center"
                    >
                      <span>Consultar por WhatsApp</span>
                      <span>→</span>
                    </a>

                    <Link
                      href="/contacto"
                      className="w-full inline-flex items-center justify-center py-3 px-6 border border-crema/15 text-crema/60 font-body text-[10px] tracking-[0.14em] uppercase hover:text-dorado hover:border-dorado transition-colors text-center"
                    >
                      Enviar Formulario
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Institucional ───────────────────────────────────────────── */}
      <section
        className="py-24 bg-navy-950 text-crema"
        style={{ background: "#060A13" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-10 bg-dorado/50" />
                <span className="eyebrow text-crema/40">
                  Video Institucional
                </span>
              </div>
              <h2
                className="font-display font-medium text-crema leading-[1.0]"
                style={{
                  fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Conocé cómo trabajamos en{" "}
                <em className="not-italic italic text-dorado">
                  cada operación
                </em>
              </h2>
            </div>
            <p className="font-body text-crema/40 text-sm leading-relaxed max-w-xs lg:text-right">
              Un recorrido visual por el compromiso y profesionalismo de Altum.
            </p>
          </div>

          <div className="flex justify-center">
            <VideoPlayer
              src="/videos/ALTUMSCI.mp4"
              title="Servicios Altum Inmobiliaria"
            />
          </div>
        </div>
      </section>

      {/* ── Respaldo Institucional ────────────────────────────────────────── */}
      <section className="py-20 bg-tierra text-crema">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-10 bg-dorado" />
            <span className="font-body text-dorado text-[11px] tracking-[0.25em] uppercase">
              Matrícula & Colegiación Oficial
            </span>
            <div className="h-px w-10 bg-dorado" />
          </div>

          <h2 className="font-display text-3xl lg:text-4xl text-crema font-medium">
            Seguridad jurídica con respaldo notarial en Río Negro
          </h2>

          <p className="font-body text-crema/50 text-sm max-w-2xl mx-auto">
            Todas las operaciones son auditadas y supervisadas por{" "}
            <strong>Estela Mari Rojas</strong> (Martillera & Corredora Pública
            Mat. 35 RP 2026 - IV Circunscripción).
          </p>
        </div>
      </section>
    </main>
  );
}
