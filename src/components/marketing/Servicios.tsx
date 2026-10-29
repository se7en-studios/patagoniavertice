"use client";

import {
  ArrowRight,
  Building2,
  FileSignature,
  KeyRound,
  TrendingUp,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

const WA = WHATSAPP_NUMBER;

const servicios = [
  {
    num: "01",
    titulo: "Compra y Venta de Inmuebles",
    descripcion:
      "Gestionamos la compra y venta de propiedades residenciales y comerciales en Río Negro y la Patagonia.",
    waText: "Hola%2C%20me%20interesa%20comprar%20o%20vender%20un%20inmueble",
  },
  {
    num: "02",
    titulo: "Administración de Alquileres",
    descripcion:
      "Administramos tu propiedad de forma integral: búsqueda de inquilinos, cobros y mantenimiento.",
    waText:
      "Hola%2C%20me%20interesa%20la%20administraci%C3%B3n%20de%20alquiler",
  },
  {
    num: "03",
    titulo: "Consultoría Estratégica",
    descripcion:
      "Análisis de mercado, valuación de activos y asesoramiento en decisiones de inversión.",
    waText:
      "Hola%2C%20me%20interesa%20una%20consultor%C3%ADa%20estrat%C3%A9gica",
  },
  {
    num: "04",
    titulo: "Redacción y Revisión de Contratos",
    descripcion:
      "Redactamos y revisamos contratos de compraventa, locación y opciones de compra.",
    waText: "Hola%2C%20me%20interesa%20la%20revisi%C3%B3n%20de%20un%20contrato",
  },
];

const ICONOS = [Building2, KeyRound, TrendingUp, FileSignature];

function ServiceCard({
  s,
  i,
  prefersReduced,
}: {
  s: (typeof servicios)[number];
  i: number;
  prefersReduced: boolean | null;
}) {
  const Icon = ICONOS[i % ICONOS.length];

  // Spotlight dorado que sigue al cursor (solo CSS vars, sin re-render)
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-40px" }}
      onMouseMove={handleMove}
      className="group relative overflow-hidden p-8 lg:p-10 bg-navy-800/70 border border-crema/10 hover:border-dorado/50 transition-colors duration-500"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(201,168,76,0.14), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <span
        className="absolute -bottom-3 right-4 font-display font-bold text-dorado/[0.06] group-hover:text-dorado/[0.12] transition-colors duration-500 select-none pointer-events-none leading-none"
        style={{ fontSize: "7.5rem" }}
        aria-hidden="true"
      >
        {s.num}
      </span>

      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <span className="flex h-12 w-12 items-center justify-center border border-dorado/40 bg-dorado/10 text-dorado transition-all duration-500 group-hover:bg-dorado group-hover:text-tierra">
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <span className="font-body text-[11px] text-dorado tracking-[0.25em] uppercase">
            {s.num}
          </span>
        </div>
        <h3
          className="font-display font-medium text-crema leading-tight mb-4"
          style={{ fontSize: "clamp(1.3rem, 2vw, 1.6rem)" }}
        >
          {s.titulo}
        </h3>
        <p className="font-body text-[15px] leading-relaxed mb-8 text-crema/65 group-hover:text-crema/85 transition-colors duration-300">
          {s.descripcion}
        </p>
        <a
          href={`https://wa.me/${WA}?text=${s.waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.18em] uppercase text-dorado hover:text-crema transition-colors duration-200"
        >
          Consultar por WhatsApp
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
}

export interface ServicioProp {
  id?: string;
  titulo: string;
  descripcion: string;
  activo?: boolean;
}

export default function Servicios({
  serviciosCustom,
}: {
  serviciosCustom?: ServicioProp[];
}) {
  const prefersReduced = useReducedMotion();

  const listaServicios =
    serviciosCustom &&
    serviciosCustom.filter((s) => s.activo !== false).length > 0
      ? serviciosCustom
          .filter((s) => s.activo !== false)
          .map((s, idx) => ({
            num: String(idx + 1).padStart(2, "0"),
            titulo: s.titulo,
            descripcion: s.descripcion,
            waText: encodeURIComponent(
              `Hola Estela, me interesa consultar por el servicio de ${s.titulo}`,
            ),
          }))
      : servicios;

  return (
    <section className="py-24 lg:py-32 bg-navy-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 lg:mb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-10 bg-dorado" />
            <span className="eyebrow">Lo que hacemos</span>
          </div>
          <h2
            className="font-display font-medium text-crema leading-[1.0] mb-5"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Nuestros{" "}
            <em className="not-italic italic text-dorado">servicios</em>
          </h2>
          <p className="font-body text-crema/65 text-[15px] leading-relaxed max-w-2xl">
            Cuatro líneas de trabajo para acompañarte en cada etapa de tu
            operación inmobiliaria en la Patagonia.
          </p>
        </motion.div>

        {/* Grid 2×2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-24 lg:mb-32 md:[&>*:last-child:nth-child(odd)]:col-span-2">
          {listaServicios.map((s, i) => (
            <ServiceCard
              key={s.num}
              s={s}
              i={i}
              prefersReduced={prefersReduced}
            />
          ))}
        </div>

        {/* Video - separado con border */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="pt-20 lg:pt-24 border-t border-dorado/15"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-10 bg-dorado/50" />
                <span className="eyebrow text-crema/50">
                  Video institucional
                </span>
              </div>
              <h3
                className="font-display font-medium text-crema leading-[1.0]"
                style={{
                  fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Conocé nuestro{" "}
                <em className="not-italic italic text-dorado">proceso</em>
              </h3>
            </div>
            <p className="font-body text-crema/55 text-[15px] leading-relaxed max-w-xs lg:text-right">
              Un recorrido visual por cómo trabajamos en cada operación.
            </p>
          </div>

          <div className="flex justify-center">
            <VideoPlayer
              src="/videos/ALTUMSCI.mp4"
              poster="/videos/altumsci-poster.jpg"
              title="Servicios Altum"
            />
          </div>

          <div className="text-center mt-10">
            <a
              href={`https://wa.me/${WA}?text=Vi%20vuestro%20video%20y%20quiero%20consultar`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer inline-flex items-center gap-3 font-body text-tierra text-[11px] tracking-[0.15em] font-semibold uppercase px-9 py-4"
            >
              Consultar ahora
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
