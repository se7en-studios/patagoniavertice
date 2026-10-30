"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { coverImage } from "@/lib/property-images";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const tipoLabel: Record<string, string> = {
  venta: "Venta Exclusiva",
  alquiler: "Alquiler Corporativo",
  desarrollo: "Inversión & Plusvalía",
  lote: "Lote / Terreno",
  chacra: "Chacra / Campo",
};

const categoriaLabel: Record<string, string> = {
  venta: "Casa / Residencia",
  alquiler: "Corporativo",
  desarrollo: "Oportunidad",
  lote: "Frente al Lago",
  chacra: "Fracción",
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
  destacado_badge?: string;
}

const PROPIEDADES_SHOWCASE_FALLBACK: PropiedadDestacada[] = [
  {
    id: "mari-menuco-primera-linea",
    titulo: "Lote Frente al Lago - Bahía de las Playas",
    ciudad: "Mari Menuco, Neuquén",
    barrio: "Barrio Privado Bahía de las Playas",
    precio: 48000,
    moneda: "USD",
    tipo: "lote",
    superficie_m2: 1000,
    imagenes: ["/mari-menuco/bahia-playas-1.jpg"],
    destacado_badge: "Frente al Lago · Oportunidad",
  },
  {
    id: "residencia-cipolletti-premium",
    titulo: "Residencia Vanguardista con Piscina & Parque",
    ciudad: "Cipolletti, Río Negro",
    barrio: "Barrio Residencial Consolidado",
    precio: 195000,
    moneda: "USD",
    tipo: "venta",
    superficie_m2: 310,
    imagenes: ["/casa.avif"],
    destacado_badge: "Diseño Contemporáneo",
  },
  {
    id: "lote-panoramico-mari-menuco",
    titulo: "Terreno Panorámico con Bajada Náutica",
    ciudad: "Mari Menuco, Neuquén",
    barrio: "Bahía de las Playas",
    precio: 36000,
    moneda: "USD",
    tipo: "lote",
    superficie_m2: 850,
    imagenes: ["/mari-menuco/bahia-playas-2.jpg"],
    destacado_badge: "Vista al Lago 180°",
  },
  {
    id: "fraccion-desarrollo-alto-valle",
    titulo: "Fracción Estratégica para Inversión & Logística",
    ciudad: "Catriel, Río Negro",
    barrio: "Corredor Petrolero & Productivo",
    precio: 95000,
    moneda: "USD",
    tipo: "desarrollo",
    superficie_m2: 2500,
    imagenes: ["/bosque.avif"],
    destacado_badge: "Alta Renta Corporativa",
  },
  {
    id: "departamento-corporativo-cipolletti",
    titulo: "Semipiso Premium en Torre Central",
    ciudad: "Cipolletti, Río Negro",
    barrio: "Distrito Financiero",
    precio: 125000,
    moneda: "USD",
    tipo: "venta",
    superficie_m2: 125,
    imagenes: ["/noche.avif"],
    destacado_badge: "A Estrenar",
  },
  {
    id: "lote-segunda-linea-playas",
    titulo: "Lote con Servicios y Factibilidad Inmediata",
    ciudad: "Mari Menuco, Neuquén",
    barrio: "Bahía de las Playas - Sector Club House",
    precio: 32000,
    moneda: "USD",
    tipo: "lote",
    superficie_m2: 750,
    imagenes: ["/mari-menuco/bahia-playas-3.jpg"],
    destacado_badge: "Escrituración Inmediata",
  },
];

function formatSuperficie(m2?: number | null): string {
  return m2 ? `${m2.toLocaleString("es-AR")} m²` : "Consultar superficie";
}

const CATEGORIAS_TAB = [
  { id: "todas", label: "Todas las Oportunidades" },
  { id: "mari-menuco", label: "Mari Menuco (Lagos)" },
  { id: "residencial", label: "Casas & Residencias" },
  { id: "inversion", label: "Inversión & Lotes" },
];

export default function PropiedadesDestacadasHome({
  propiedades,
}: {
  propiedades: PropiedadDestacada[];
}) {
  const [tabActiva, setTabActiva] = useState("todas");
  const reduced = useReducedMotion();

  const listaBase = useMemo(() => {
    return propiedades && propiedades.length > 0
      ? propiedades
      : PROPIEDADES_SHOWCASE_FALLBACK;
  }, [propiedades]);

  const listaFiltrada = useMemo(() => {
    if (tabActiva === "todas") return listaBase;
    if (tabActiva === "mari-menuco") {
      return listaBase.filter(
        (p) =>
          p.ciudad.toLowerCase().includes("menuco") ||
          p.barrio?.toLowerCase().includes("playas"),
      );
    }
    if (tabActiva === "residencial") {
      return listaBase.filter(
        (p) => p.tipo === "venta" || p.tipo === "alquiler",
      );
    }
    if (tabActiva === "inversion") {
      return listaBase.filter(
        (p) =>
          p.tipo === "lote" || p.tipo === "desarrollo" || p.tipo === "chacra",
      );
    }
    return listaBase;
  }, [listaBase, tabActiva]);

  return (
    <section
      className="py-24 lg:py-32 relative overflow-hidden bg-[#F6F8FB]"
      id="propiedades-destacadas"
      style={{
        backgroundImage:
          "radial-gradient(650px circle at 50% 20%, rgba(201,168,76,0.10), transparent 70%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-10 bg-dorado" />
              <span className="eyebrow tracking-[0.25em] !text-[#8A6A1B]">
                ALTUM SCI · Portfolio Seleccionado
              </span>
            </div>
            <h2
              className="font-display font-medium text-navy leading-[1.05]"
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Propiedades &amp; Terrenos de{" "}
              <em className="not-italic italic text-[#A47C1B] font-normal">
                primer nivel
              </em>
            </h2>
            <p className="font-body text-navy/60 text-sm lg:text-base max-w-xl mt-4">
              Lotes exclusivos en Mari Menuco, residencias en Cipolletti y
              fracciones estratégicas con plusvalía real en el eje Neuquén – Río
              Negro.
            </p>
          </div>

          <Link
            href="/proyectos"
            className="group inline-flex items-center gap-3 rounded-full border border-dorado/40 bg-white px-5 py-2.5 font-body text-[#8A6A1B] text-xs font-semibold tracking-[0.16em] uppercase hover:bg-dorado hover:text-tierra transition-all shadow-sm self-start lg:self-auto"
          >
            <span>Ver Catálogo Completo</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {CATEGORIAS_TAB.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`font-body text-[11px] tracking-[0.16em] uppercase px-5 py-2.5 transition-all rounded-full ${
                tabActiva === tab.id
                  ? "bg-dorado text-tierra font-semibold shadow-md"
                  : "bg-white text-navy/65 border border-navy/10 hover:border-dorado hover:text-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid de Propiedades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          <AnimatePresence mode="popLayout">
            {listaFiltrada.map((p, idx) => {
              const precioLabel = p.precio
                ? `${p.moneda} ${p.precio.toLocaleString("es-AR")}`
                : "Consultar precio";
              const valorM2 =
                p.precio && p.superficie_m2 && p.superficie_m2 > 0
                  ? `${p.moneda} ${Math.round(p.precio / p.superficie_m2).toLocaleString("es-AR")}/m²`
                  : null;
              const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hola Altum SCI, quisiera recibir información y coordinar visita para la propiedad: ${p.titulo} (${p.ciudad} - ${precioLabel})`,
              )}`;

              const isFallback = PROPIEDADES_SHOWCASE_FALLBACK.some(
                (f) => f.id === p.id,
              );
              const detailHref = isFallback ? "/proyectos" : `/proyectos/${p.id}`;

              return (
                <motion.article
                  key={p.id}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.45,
                    delay: reduced ? 0 : (idx % 3) * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative flex flex-col rounded-3xl bg-white border border-dorado/20 hover:border-dorado/60 overflow-hidden shadow-[0_18px_40px_-24px_rgba(14,26,51,0.22)] hover:shadow-[0_28px_60px_-26px_rgba(14,26,51,0.35)] hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Imagen & Badges */}
                  <Link
                    href={detailHref}
                    className="relative block aspect-[16/11] overflow-hidden bg-navy/5"
                  >
                    <Image
                      src={coverImage(p.imagenes)}
                      alt={p.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" />

                    {/* Badge Superior Izquierdo: Tipo */}
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
                      <span className="font-body text-[9px] font-semibold tracking-[0.2em] uppercase rounded-full bg-dorado text-tierra px-3 py-1 shadow-sm">
                        {tipoLabel[p.tipo] ?? p.tipo}
                      </span>
                      {p.destacado_badge && (
                        <span className="font-body text-[8.5px] font-medium tracking-[0.15em] uppercase rounded-full bg-navy-950/85 text-dorado border border-dorado/40 px-2.5 py-1">
                          {p.destacado_badge}
                        </span>
                      )}
                    </div>

                    {/* Categoría Badge Superior Derecho */}
                    <span className="absolute top-3.5 right-3.5 font-body text-[9px] tracking-[0.15em] uppercase rounded-full text-navy font-medium bg-white/95 px-2.5 py-1 shadow-sm">
                      {categoriaLabel[p.tipo] ?? p.tipo}
                    </span>

                    {/* Precio flotante sobre la foto con alto contraste */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                      <div>
                        <p className="font-display text-white text-2xl font-bold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                          {precioLabel}
                        </p>
                        {valorM2 && (
                          <span className="font-mono text-[10px] text-dorado/95 block">
                            {valorM2}
                          </span>
                        )}
                      </div>
                      <span className="font-body text-[10px] tracking-wider text-white bg-navy-950/75 border border-white/15 px-2.5 py-1 rounded-full uppercase font-medium">
                        {p.ciudad.split(",")[0]}
                      </span>
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-body text-[#8A6A1B] text-[10px] font-semibold tracking-widest uppercase mb-1.5">
                        {p.barrio ? `${p.barrio}` : p.ciudad}
                      </p>
                      <Link href={detailHref}>
                        <h3 className="font-display text-navy text-lg font-medium leading-snug group-hover:text-[#8A6A1B] transition-colors duration-200 mb-4 line-clamp-2">
                          {p.titulo}
                        </h3>
                      </Link>

                      {/* Metadatos: Superficie & Seguridad */}
                      <div className="grid grid-cols-2 gap-2 py-3 border-y border-navy/10 mb-5 font-body text-xs text-navy/65">
                        <div className="flex items-center gap-2">
                          <SurfaceIcon />
                          <span className="truncate font-medium">
                            {formatSuperficie(p.superficie_m2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#8A6A1B] justify-end">
                          <span>✦</span>
                          <span className="truncate text-[10px] uppercase tracking-wider font-semibold">
                            Mat. 35 RP 2026
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-dorado text-tierra font-body text-[10px] font-semibold tracking-[0.18em] uppercase hover:bg-dorado-light transition-colors shadow-sm"
                      >
                        <WaMiniIcon />
                        <span>Consultar</span>
                      </a>

                      <Link
                        href={detailHref}
                        className="inline-flex items-center justify-center px-4 py-3 rounded-full border border-navy/15 text-navy/75 hover:text-[#8A6A1B] hover:border-dorado font-body text-[10px] font-semibold uppercase tracking-wider transition-colors"
                      >
                        Ver ficha
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-7 lg:p-10 rounded-[2rem] border border-dorado/25 bg-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_24px_60px_-30px_rgba(14,26,51,0.3)]">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#8A6A1B] text-xs font-semibold uppercase tracking-widest">
              <span>✦</span>
              <span>Asesoría Directa por Martillera Colegiada</span>
            </div>
            <h4 className="font-display text-navy text-xl lg:text-2xl font-medium">
              ¿Buscás una propiedad específica o querés tasar la tuya?
            </h4>
            <p className="font-body text-navy/60 text-xs lg:text-sm max-w-xl">
              Análisis comparativo de mercado en 24 horas, tasaciones oficiales
              con firma colegiada y gestión notarial transparente.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <a
              href="#tasador-express"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-dorado text-tierra font-body text-[11px] font-semibold tracking-[0.16em] uppercase hover:bg-dorado-light transition-all shadow-md"
            >
              ✦ Tasar mi propiedad
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Altum SCI, busco asesoramiento para una inversión o venta.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-navy/20 text-navy font-body text-[11px] font-semibold tracking-[0.16em] uppercase hover:border-dorado hover:text-[#8A6A1B] transition-all"
            >
              <span>Consultar Asesor</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SurfaceIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-dorado shrink-0"
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
