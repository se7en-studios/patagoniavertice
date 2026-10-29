"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * BentoDiferenciadores - layout bento asimétrico (inspirado en 21st.dev s/features).
 * Tono claro: las celdas se revelan escalonadas y cada una viaja a distinta
 * velocidad con el scroll, para dar profundidad.
 */

const diferenciadores = [
  {
    id: "trato",
    title: "Trato Directo",
    subtitle: "Sin intermediarios",
    description:
      "Hablás siempre con quienes toman las decisiones. Sin cadenas de llamadas ni asistentes. Eso marca la diferencia.",
    size: "large", // span 2 cols
    accent: "dorado",
    shift: 34,
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    id: "transparencia",
    title: "Transparencia Total",
    subtitle: "Sin letra chica",
    description:
      "Cada cláusula explicada, cada costo detallado. No hay sorpresas en ninguna etapa de la operación.",
    size: "small",
    accent: "none",
    shift: 64,
    icon: (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    id: "remoto",
    title: "Operás desde cualquier lugar",
    subtitle: "Visitas virtuales + gestión online",
    description:
      "Coordinamos visitas virtuales y gestionamos poderes notariales para que puedas comprar tu lote sin pisar Neuquén.",
    size: "wide",
    accent: "none",
    shift: 14,
    icon: (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "mercado",
    title: "Valuaciones precisas",
    subtitle: "Análisis de mercado real",
    description:
      "Precio justo según superficie, ubicación y comparables reales de la zona, no el que querés escuchar.",
    size: "small",
    accent: "none",
    shift: 44,
    icon: (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

function BentoCard({
  d,
  progress,
  reduced,
}: {
  d: (typeof diferenciadores)[number];
  progress: MotionValue<number>;
  reduced: boolean | null;
}) {
  const isWide = d.size === "large" || d.size === "wide";
  const isDorado = d.accent === "dorado";
  // Cada celda viaja a distinta velocidad: de +shift a -shift/2 px.
  const y = useTransform(
    progress,
    [0, 1],
    reduced ? [0, 0] : [d.shift, -d.shift / 2],
  );

  return (
    <motion.div style={{ y }} className={isWide ? "md:col-span-2" : ""}>
      <motion.div
        variants={cardVariants}
        className={`relative h-full p-6 lg:p-8 rounded-3xl group cursor-default overflow-hidden transition-shadow duration-300 hover:shadow-[0_28px_60px_-28px_rgba(14,26,51,0.4)] ${
          isDorado
            ? "border border-dorado/40 bg-gradient-to-br from-[#FBF0CF] to-white shadow-[0_18px_40px_-26px_rgba(201,168,76,0.6)]"
            : "border border-white bg-white shadow-[0_18px_40px_-26px_rgba(14,26,51,0.3)]"
        }`}
        whileHover={reduced ? undefined : { y: -4 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon */}
          <div
            className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full self-start ${
              isDorado
                ? "bg-white text-[#8A6A1B]"
                : "bg-[#EAF0F7] text-navy/70 group-hover:text-[#8A6A1B]"
            } transition-colors`}
          >
            {d.icon}
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#8A6A1B] mb-2">
              {d.subtitle}
            </p>
            <h3
              className="font-display font-medium leading-snug mb-3 text-navy"
              style={{
                fontSize:
                  d.size === "large"
                    ? "clamp(1.5rem, 2.5vw, 2rem)"
                    : "clamp(1.1rem, 1.8vw, 1.4rem)",
              }}
            >
              {d.title}
            </h3>
            <p className="font-body text-navy/60 text-[13px] leading-relaxed">
              {d.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BentoDiferenciadores() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden bg-[#EAF0F7]"
      aria-labelledby="diferenciadores-heading"
      id="por-que-altum"
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 lg:mb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-10 bg-dorado" />
            <span className="eyebrow !text-[#8A6A1B]">Por qué elegirnos</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:justify-between">
            <h2
              id="diferenciadores-heading"
              className="font-display font-medium text-navy leading-[1.0] max-w-xl"
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Lo que nos hace{" "}
              <em className="not-italic italic text-[#A47C1B]">diferentes</em>
            </h2>
            <p className="font-body text-navy/55 text-[14px] leading-relaxed max-w-sm lg:text-right">
              No somos una franquicia masiva. En ALTUM SCI brindamos asesoría
              estratégica, notarial y territorial directa en Neuquén y Río
              Negro.
            </p>
          </div>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {diferenciadores.map((d) => (
            <BentoCard
              key={d.id}
              d={d}
              progress={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </motion.div>

        {/* Bottom CTA link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <a
            href="https://wa.me/5492996095742?text=Hola%20Altum%20SCI%2C%20quisiera%20conocer%20m%C3%A1s%20sobre%20sus%20servicios%20e%20inversiones."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-6 py-3 font-body text-[11px] tracking-[0.2em] uppercase text-[#8A6A1B] hover:border-dorado hover:text-navy transition-colors duration-200"
          >
            Consultanos sin compromiso
            <span aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
