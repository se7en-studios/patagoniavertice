"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const tipoLabel: Record<string, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
  desarrollo: "Inversión",
  lote: "Inversión",
  chacra: "Inversión",
};

const categoriaLabel: Record<string, string> = {
  venta: "Casa",
  alquiler: "Casa",
  desarrollo: "Desarrollo",
  lote: "Lote / Terreno",
  chacra: "Chacra",
};

export interface PropiedadDestacada {
  id: string;
  titulo: string;
  ciudad: string;
  barrio?: string | null;
  precio: number | null;
  moneda: string;
  tipo: string;
  superficie_m2?: number | null;
  imagenes: string[];
}

function formatSuperficie(m2?: number | null): string {
  return m2 ? `${m2} m²` : "Consultar superficie";
}

export default function PropiedadesDestacadasHome({
  propiedades,
}: {
  propiedades: PropiedadDestacada[];
}) {
  return (
    <section
      className="py-24 lg:py-36 relative overflow-hidden"
      style={{ background: "#09101F" }}
      id="propiedades-destacadas"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-20 blur-[130px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, #C9A84C 0%, #1A2752 70%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-10 bg-dorado" />
              <span className="eyebrow">Portfolio Inmobiliario</span>
            </div>
            <h2
              className="font-display font-medium text-crema leading-[1.05]"
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Propiedades de{" "}
              <em className="not-italic italic text-dorado font-normal">
                primer nivel
              </em>
            </h2>
            <p className="font-body text-crema/45 text-sm lg:text-base max-w-xl mt-4">
              Selección curada de residencias, loteos estratégicos y
              oportunidades de inversión en Río Negro y Patagonia.
            </p>
          </div>

          <Link
            href="/proyectos"
            className="group inline-flex items-center gap-3 font-body text-dorado text-xs tracking-[0.2em] uppercase border-b border-dorado/40 pb-1.5 hover:border-dorado transition-all self-start lg:self-auto"
          >
            <span>Ver Catálogo Completo</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Grid de Propiedades */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {propiedades.map((p) => {
              const precioLabel = p.precio
                ? `${p.moneda} ${p.precio.toLocaleString("es-AR")}`
                : "Consultar precio";
              const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hola Altum Inmobiliaria, quisiera recibir más información sobre la propiedad: ${p.titulo} (${p.ciudad} - ${precioLabel})`,
              )}`;

              return (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex flex-col bg-navy-900 border border-crema/10 overflow-hidden hover:border-dorado/50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                  style={{ background: "rgba(13,22,40,0.75)" }}
                >
                  {/* Imagen & Badges */}
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <Image
                      src={p.imagenes[0] ?? "/mari-menuco/bahia-playas-1.jpg"}
                      alt={p.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />

                    {/* Badge Superior Izquierdo: Tipo & Exclusividad */}
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
                      <span className="font-body text-[9px] font-semibold tracking-[0.2em] uppercase bg-dorado text-tierra px-2.5 py-1 shadow-sm">
                        {tipoLabel[p.tipo] ?? p.tipo}
                      </span>
                    </div>

                    {/* Categoría Badge Superior Derecho */}
                    <span className="absolute top-3.5 right-3.5 font-body text-[9px] tracking-[0.15em] uppercase text-crema/70 bg-black/40 backdrop-blur-sm px-2 py-0.5 border border-white/10">
                      {categoriaLabel[p.tipo] ?? p.tipo}
                    </span>

                    {/* Precio flotante sobre la foto */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <p className="font-display text-dorado text-2xl font-semibold tracking-tight">
                        {precioLabel}
                      </p>
                      <span className="font-body text-[11px] tracking-wider text-crema/60 uppercase">
                        {p.ciudad}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-body text-crema/35 text-[11px] tracking-widest uppercase mb-1.5">
                        {p.barrio ? `${p.barrio}, ${p.ciudad}` : p.ciudad}
                      </p>
                      <h3 className="font-display text-crema text-lg font-medium leading-snug group-hover:text-dorado transition-colors duration-200 mb-4 line-clamp-2">
                        {p.titulo}
                      </h3>

                      {/* Metadatos: Superficie */}
                      <div className="grid grid-cols-1 gap-2 py-3 border-y border-crema/8 mb-6 font-body text-xs text-crema/55">
                        <div className="flex items-center gap-2">
                          <SurfaceIcon />
                          <span className="truncate">
                            {formatSuperficie(p.superficie_m2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-dorado text-tierra font-body text-[10px] font-semibold tracking-[0.18em] uppercase hover:bg-dorado-light transition-colors"
                      >
                        <WaMiniIcon />
                        <span>Consultar</span>
                      </a>

                      <Link
                        href={`/contacto?propiedad=${encodeURIComponent(p.titulo)}`}
                        className="inline-flex items-center justify-center p-3 border border-crema/15 text-crema/60 hover:text-dorado hover:border-dorado transition-colors"
                        title="Agendar visita"
                      >
                        <CalendarIcon />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Estado vacío elegante */}
        {propiedades.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 py-20 px-8 text-center border border-crema/10 bg-navy-900/40 backdrop-blur-sm"
          >
            <div className="text-5xl mb-6 opacity-30">&#127968;</div>
            <h3 className="font-display text-crema text-2xl font-medium mb-3">
              Nuevas propiedades muy pronto
            </h3>
            <p className="font-body text-crema/40 text-sm leading-relaxed max-w-sm mx-auto mb-8">
              Estamos incorporando nuevas oportunidades al catálogo. Contactanos
              y te asesoramos directamente.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Altum, busco una propiedad específica.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-dorado text-tierra font-body text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-dorado-light transition-all"
            >
              Consultar con un asesor →
            </a>
          </motion.div>
        )}

        {/* Bottom Banner */}
        <div className="mt-16 p-8 lg:p-10 border border-dorado/25 bg-navy-800/40 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-display text-crema text-xl font-medium">
              ¿Buscás una propiedad específica o querés publicar la tuya?
            </h4>
            <p className="font-body text-crema/50 text-xs lg:text-sm">
              Asesoría personalizada, tasaciones certificadas y gestión integral
              sin letra chica.
            </p>
          </div>
          <a
            href="https://wa.me/5492996095742?text=Hola%20Altum%2C%20quisiera%20asesoramiento%20personalizado%20para%20una%20propiedad."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-3 px-7 py-3.5 border border-dorado text-dorado font-body text-[11px] font-medium tracking-[0.18em] uppercase hover:bg-dorado hover:text-tierra transition-all duration-300"
          >
            <span>Hablar con un asesor</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function SurfaceIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-dorado/70 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  );
}

function WaMiniIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}
