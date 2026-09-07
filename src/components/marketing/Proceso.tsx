"use client";

import { useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";

const pasos = [
  {
    num: "01",
    titulo: "Consultá",
    descripcion:
      "Nos contás tu idea, tu presupuesto y tus objetivos. Sin compromiso. Analizamos juntos las opciones que mejor se adaptan a vos.",
    detalle: "Reunión inicial · Análisis de perfil · Opciones a medida",
  },
  {
    num: "02",
    titulo: "Elegí",
    descripcion:
      "Te presentamos las propiedades y alternativas disponibles con toda la información: ubicación, condiciones y documentación.",
    detalle:
      "Presentación de opciones · Visita a la propiedad · Propuesta económica",
  },
  {
    num: "03",
    titulo: "Concretá",
    descripcion:
      "Firmamos, estructuramos la operación y te acompañamos hasta la escritura, con reportes periódicos y comunicación directa.",
    detalle: "Firma de contrato · Gestión documental · Acompañamiento total",
  },
];

function Paso({
  paso,
  index,
}: {
  paso: (typeof pasos)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative flex gap-6 lg:gap-10 pb-16 last:pb-0"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeInOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Circle on the rail */}
      <div className="relative shrink-0 w-12 flex justify-center">
        <motion.div
          className="relative z-10 w-12 h-12 rounded-full border border-dorado/50 bg-tierra flex items-center justify-center"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        >
          <span className="font-display text-dorado text-sm font-medium">
            {paso.num}
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <h3
          className="font-display text-crema font-medium leading-tight mb-4"
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            letterSpacing: "-0.02em",
          }}
        >
          {paso.titulo}
        </h3>

        <p className="font-body text-crema/40 text-[15px] leading-relaxed max-w-xl">
          {paso.descripcion}
        </p>

        {/* Detail - expands smoothly on hover */}
        <motion.div
          className="overflow-hidden"
          initial={false}
          animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="pt-5 space-y-1.5">
            {paso.detalle.split(" · ").map((d) => (
              <div key={d} className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-dorado/40 shrink-0" />
                <span className="font-body text-crema/30 text-[11px] tracking-[0.12em] uppercase">
                  {d}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function PasoFlipCard({
  paso,
  index,
}: {
  paso: (typeof pasos)[number];
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="relative"
      style={{ perspective: "1200px" }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeInOut" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="relative h-72"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 border border-crema/10 p-8 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="font-display text-dorado/60 text-sm font-medium">
            {paso.num}
          </span>
          <h3
            className="font-display text-crema font-medium leading-tight"
            style={{
              fontSize: "clamp(1.6rem, 2.2vw, 2rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {paso.titulo}
          </h3>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 border border-dorado/30 p-8 flex flex-col justify-center gap-4"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "rgba(201,168,76,0.05)",
          }}
        >
          <p className="font-body text-crema/50 text-[13px] leading-relaxed">
            {paso.descripcion}
          </p>
          <div className="space-y-1.5">
            {paso.detalle.split(" · ").map((d) => (
              <div key={d} className="flex items-center gap-2.5">
                <span className="w-1 h-1 rounded-full bg-dorado/50 shrink-0" />
                <span className="font-body text-crema/40 text-[10px] tracking-[0.1em] uppercase">
                  {d}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Proceso() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.8", "end 0.55"],
  });

  return (
    <section className="bg-tierra relative overflow-hidden py-28 lg:py-36">
      {/* Grain */}
      <div className="absolute inset-0 grain-overlay opacity-[0.04] pointer-events-none" />

      {/* Large background word */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-crema/[0.025] font-medium leading-none select-none pointer-events-none"
        style={{
          fontSize: "clamp(8rem, 22vw, 18rem)",
          letterSpacing: "-0.06em",
        }}
        aria-hidden="true"
      >
        ALTUM
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 lg:mb-28">
          <div>
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="h-px w-10 bg-dorado/50" />
              <span className="eyebrow text-crema/30">Cómo trabajamos</span>
            </motion.div>

            <motion.h2
              className="font-display text-crema font-medium leading-[1.0]"
              style={{
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                letterSpacing: "-0.03em",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeInOut" }}
            >
              Tu operación,{" "}
              <em className="not-italic italic text-dorado">paso a paso</em>
            </motion.h2>
          </div>

          <motion.p
            className="font-body text-crema/30 text-[15px] leading-relaxed max-w-xs lg:text-right"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Un proceso claro y transparente, diseñado para que tomes decisiones
            con confianza.
          </motion.p>
        </div>

        {/* Vertical timeline - mobile/tablet */}
        <div ref={railRef} className="relative max-w-3xl lg:hidden">
          {/* SVG vertical line - drawn on scroll */}
          <svg
            className="absolute left-6 top-0 h-full w-px overflow-visible"
            aria-hidden="true"
            preserveAspectRatio="none"
            viewBox="0 0 1 100"
          >
            {/* Track */}
            <line
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="100"
              stroke="rgba(245,239,230,0.08)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            {/* Animated gold path */}
            <motion.path
              d="M 0.5 0 L 0.5 100"
              stroke="#C9A84C"
              strokeWidth="1"
              fill="none"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>

          {pasos.map((paso, i) => (
            <Paso key={paso.num} paso={paso} index={i} />
          ))}
        </div>

        {/* Horizontal timeline - desktop */}
        <div className="hidden lg:block relative">
          {/* Línea dorada horizontal */}
          <motion.div
            className="absolute top-0 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-transparent via-dorado/50 to-transparent origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="grid grid-cols-3 gap-8 pt-14">
            {pasos.map((paso, i) => (
              <PasoFlipCard key={paso.num} paso={paso} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
