import Image from "next/image";
import Link from "next/link";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const ZONA = {
  nombre: "Mari Menuco",
  provincia: "Neuquén",
  tagline: "Barrio Privado Bahía de las Playas, sobre el lago Mari Menuco",
  descripcion:
    "Terrenos frente al lago Mari Menuco, a 65 km de Neuquén capital. El barrio cuenta con agua y luz, y tiene WakePark y Club House proyectados.",
  destacados: [
    "Frente al lago, a 65 km de Neuquén capital",
    "Agua y luz en el lote",
    "WakePark y Club House proyectados para el barrio",
  ],
  imagen: "/mari-menuco/bahia-playas-1.jpg",
  enlace: "/proyectos",
};

export default function ZonasInteractivas() {
  return (
    <section
      className="py-24 lg:py-36 relative overflow-hidden text-crema"
      style={{ background: "#060A13" }}
      id="zonas-cobertura"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-10 bg-dorado" />
              <span className="eyebrow">Territorio & Mercado</span>
            </div>
            <h2
              className="font-display font-medium text-crema leading-[1.05]"
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Donde la Patagonia{" "}
              <em className="not-italic italic text-dorado">crece</em>
            </h2>
            <p className="font-body text-crema/45 text-sm lg:text-base max-w-xl mt-4">
              Nuestro foco hoy: terrenos frente al lago en Neuquén, con
              proyección de crecimiento y respaldo profesional en cada paso.
            </p>
          </div>
        </div>

        {/* Feature Panel */}
        <div className="relative border border-crema/10 bg-navy-900/60 overflow-hidden backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Left Column: Image */}
            <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[540px] overflow-hidden">
              <Image
                src={ZONA.imagen}
                alt={ZONA.nombre}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-navy-950 via-navy-950/40 to-transparent" />
            </div>

            {/* Right Column: Information & Points */}
            <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="font-body text-crema/35 text-[11px] tracking-[0.22em] uppercase">
                    {ZONA.provincia}
                  </span>
                  <h3 className="font-display text-3xl lg:text-4xl text-crema font-medium">
                    {ZONA.nombre}
                  </h3>
                </div>

                <p className="font-body text-dorado text-sm font-medium leading-snug">
                  {ZONA.tagline}
                </p>

                <p className="font-body text-crema/55 text-sm leading-relaxed">
                  {ZONA.descripcion}
                </p>

                {/* Highlights */}
                <div className="space-y-2.5 pt-4 border-t border-crema/10">
                  <h4 className="font-body text-crema/40 text-[10px] tracking-[0.2em] uppercase">
                    Ventajas
                  </h4>
                  {ZONA.destacados.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-crema/70"
                    >
                      <span className="text-dorado mt-0.5">✦</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 flex flex-col sm:flex-row gap-3 border-t border-crema/10">
                <Link
                  href={ZONA.enlace}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-dorado text-tierra font-body text-[11px] font-semibold tracking-[0.16em] uppercase hover:bg-dorado-light transition-all text-center"
                >
                  <span>Ver Oportunidades en {ZONA.nombre}</span>
                  <span>→</span>
                </Link>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hola Altum Inmobiliaria, me interesa consultar opciones de inversión y propiedades en ${ZONA.nombre}.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-3.5 border border-crema/15 text-crema/60 hover:text-dorado hover:border-dorado transition-colors text-center text-xs tracking-wider"
                >
                  Consultar Asesor
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
