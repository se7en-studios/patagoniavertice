"use client";

import { motion } from "framer-motion";

/**
 * BentoDiferenciadores - inspirado en Bento Grid de 21st.dev (s/features)
 * Reemplaza la sección "Por qué elegirnos" con un layout bento asimétrico
 * Diseño: navy/dorado/crema - Altum design system
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
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

function BentoCard({ d }: { d: (typeof diferenciadores)[number] }) {
  const isLarge = d.size === "large";
  const isStat = d.size === "stat";
  const isWide = d.size === "wide";
  const isDorado = d.accent === "dorado";

  return (
    <motion.div
      variants={cardVariants}
      className={`relative p-6 lg:p-8 border group cursor-default overflow-hidden transition-all duration-300
        ${isLarge ? "md:col-span-2" : ""}
        ${isWide ? "md:col-span-2" : ""}
        ${
          isDorado
            ? "border-dorado/25 hover:border-dorado/50"
            : "border-crema/[0.06] hover:border-crema/[0.14]"
        }`}
      style={{
        background: isDorado
          ? "linear-gradient(135deg, rgba(201,168,76,0.07) 0%, rgba(15,26,62,0.6) 100%)"
          : "rgba(15,26,62,0.4)",
      }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glow dorado en cards accent */}
      {isDorado && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Stat card especial */}
      {isStat ? (
        <div className="relative z-10">
          <p
            className="font-display font-medium text-dorado leading-none mb-2"
            style={{
              fontSize: "clamp(3.5rem, 7vw, 5rem)",
              letterSpacing: "-0.04em",
            }}
          >
            {d.title}
          </p>
          <p className="font-body text-[11px] tracking-[0.25em] uppercase text-crema/50 mb-3">
            {d.subtitle}
          </p>
          <p className="font-body text-crema/30 text-[13px] leading-relaxed">
            {d.description}
          </p>
        </div>
      ) : (
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon */}
          {d.icon && (
            <div
              className={`mb-5 ${isDorado ? "text-dorado" : "text-crema/40 group-hover:text-crema/60"} transition-colors`}
            >
              {d.icon}
            </div>
          )}

          {/* Content */}
          <div className="flex-1">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-dorado/50 mb-2">
              {d.subtitle}
            </p>
            <h3
              className={`font-display font-medium leading-snug mb-3 ${isDorado ? "text-dorado" : "text-crema"}`}
              style={{
                fontSize: isLarge
                  ? "clamp(1.5rem, 2.5vw, 2rem)"
                  : "clamp(1.1rem, 1.8vw, 1.4rem)",
              }}
            >
              {d.title}
            </h3>
            <p className="font-body text-crema/35 text-[13px] leading-relaxed">
              {d.description}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function BentoDiferenciadores() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "#080E1A" }}
      aria-labelledby="diferenciadores-heading"
      id="por-que-altum"
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(201,168,76,0.6) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

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
            <span className="eyebrow">Por qué elegirnos</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:justify-between">
            <h2
              id="diferenciadores-heading"
              className="font-display font-medium text-crema leading-[1.0] max-w-xl"
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Lo que nos hace{" "}
              <em className="not-italic italic text-dorado">diferentes</em>
            </h2>
            <p className="font-body text-crema/30 text-[14px] leading-relaxed max-w-xs lg:text-right">
              No somos una franquicia. Somos un equipo local que conoce Río
              Negro mejor que nadie.
            </p>
          </div>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {diferenciadores.map((d) => (
            <BentoCard key={d.id} d={d} />
          ))}
        </motion.div>

        {/* Bottom CTA link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <a
            href="https://wa.me/5492996095742?text=Hola%2C%20quiero%20conocer%20m%C3%A1s%20sobre%20Altum%20Inmobiliaria"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-dorado/50 hover:text-dorado transition-colors duration-200"
          >
            Consultanos sin compromiso
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
