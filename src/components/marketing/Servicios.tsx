"use client";

import { useState } from "react";
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

function ServiceCard({
  s,
  i,
  prefersReduced,
}: {
  s: (typeof servicios)[number];
  i: number;
  prefersReduced: boolean | null;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={
        prefersReduced
          ? { opacity: 0 }
          : { clipPath: "inset(0 0 100% 0)", opacity: 0 }
      }
      whileInView={
        prefersReduced
          ? { opacity: 1 }
          : { clipPath: "inset(0 0 0% 0)", opacity: 1 }
      }
      transition={{ duration: 0.65, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-40px" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden p-8 lg:p-10 bg-navy-800 border-l-2 border-gold-500/40 cursor-pointer"
    >
      {/* Ghost number */}
      <motion.span
        animate={{ opacity: hovered ? 0.12 : 0.04 }}
        transition={{ duration: 0.25 }}
        className="absolute -bottom-2 right-4 font-display font-bold text-dorado select-none pointer-events-none leading-none"
        style={{ fontSize: "7rem", zIndex: 0 }}
        aria-hidden="true"
      >
        {s.num}
      </motion.span>

      {/* Hover background reveal */}
      {!prefersReduced && (
        <motion.div
          className="absolute inset-0 bg-navy-700"
          animate={{
            clipPath: hovered ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ zIndex: 1 }}
        />
      )}

      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
        <div className="font-body text-[11px] text-dorado tracking-[0.25em] uppercase mb-4">
          {s.num}
        </div>
        <h3
          className="font-display font-medium text-crema leading-tight mb-4"
          style={{
            fontSize: "clamp(1.3rem, 2vw, 1.6rem)",
            letterSpacing: "0.01em",
          }}
        >
          {s.titulo}
        </h3>
        <p
          className="font-body text-[15px] leading-relaxed mb-6 transition-colors duration-300"
          style={{
            color: hovered
              ? "rgba(245,239,230,0.65)"
              : "rgba(245,239,230,0.35)",
          }}
        >
          {s.descripcion}
        </p>
        <motion.a
          href={`https://wa.me/${WA}?text=${s.waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.18em] uppercase text-dorado/70 hover:text-dorado transition-colors duration-200"
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          Consultar por WhatsApp
          <span className="text-xs">→</span>
        </motion.a>
      </div>
    </motion.div>
  );
}

export default function Servicios() {
  const prefersReduced = useReducedMotion();

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
          <p className="font-body text-crema/35 text-[15px] leading-relaxed max-w-2xl">
            Cuatro líneas de trabajo para acompañarte en cada etapa de tu
            operación inmobiliaria en la Patagonia.
          </p>
        </motion.div>

        {/* Grid 2×2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-navy-700/30 mb-24 lg:mb-32">
          {servicios.map((s, i) => (
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
                <span className="eyebrow text-crema/30">
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
            <p className="font-body text-crema/30 text-[15px] leading-relaxed max-w-xs lg:text-right">
              Un recorrido visual por cómo trabajamos en cada operación.
            </p>
          </div>

          <div className="flex justify-center">
            <VideoPlayer src="/videos/ALTUMSCI.mp4" title="Servicios Altum" />
          </div>

          <div className="text-center mt-10">
            <a
              href={`https://wa.me/${WA}?text=Vi%20vuestro%20video%20y%20quiero%20consultar`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer inline-flex items-center gap-3 font-body text-tierra text-[11px] tracking-[0.15em] font-semibold uppercase px-9 py-4"
            >
              Consultar ahora
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
