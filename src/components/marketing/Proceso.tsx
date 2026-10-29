"use client";

import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

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
        <div className="relative z-10 w-12 h-12 rounded-full border border-dorado/60 bg-white shadow-[0_8px_20px_-10px_rgba(14,26,51,0.35)] flex items-center justify-center">
          <span className="font-display text-[#8A6A1B] text-sm font-medium">
            {paso.num}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <h3
          className="font-display text-navy font-medium leading-tight mb-4"
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            letterSpacing: "-0.02em",
          }}
        >
          {paso.titulo}
        </h3>

        <p className="font-body text-navy/65 text-[15px] leading-relaxed max-w-xl">
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
                <span className="w-1 h-1 rounded-full bg-dorado shrink-0" />
                <span className="font-body text-navy/55 text-[11px] tracking-[0.12em] uppercase">
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

// Cada tarjeta se "enciende" cuando la línea de progreso llega a su turno.
function PasoCard({
  paso,
  index,
  progress,
  reduced,
}: {
  paso: (typeof pasos)[number];
  index: number;
  progress: MotionValue<number>;
  reduced: boolean | null;
}) {
  const start = index * 0.28;
  const active = useTransform(progress, [start, start + 0.18], [0, 1]);
  const lift = useTransform(
    progress,
    [start, start + 0.18],
    reduced ? [0, 0] : [22, 0],
  );
  const dim = useTransform(progress, [start, start + 0.18], [0.55, 1]);

  return (
    <motion.div
      className="relative rounded-3xl bg-white p-8 xl:p-10 shadow-[0_18px_40px_-26px_rgba(14,26,51,0.35)]"
      style={{ y: lift, opacity: dim }}
    >
      {/* Borde dorado que aparece al activarse */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-dorado/70"
        style={{ opacity: active }}
        aria-hidden="true"
      />
      <div
        className="relative mb-6 h-[5rem] font-display font-semibold leading-none"
        style={{ fontSize: "5rem", letterSpacing: "-0.04em" }}
      >
        <span className="absolute inset-0 text-navy/[0.07]">{paso.num}</span>
        <motion.span
          className="absolute inset-0 text-[#C9A84C]"
          style={{ opacity: active }}
        >
          {paso.num}
        </motion.span>
      </div>
      <h3
        className="font-display text-navy font-medium leading-tight mb-4"
        style={{
          fontSize: "clamp(1.6rem, 2.2vw, 2rem)",
          letterSpacing: "-0.02em",
        }}
      >
        {paso.titulo}
      </h3>
      <p className="font-body text-navy/65 text-[14px] leading-relaxed mb-6">
        {paso.descripcion}
      </p>
      <ul className="space-y-2 border-t border-navy/10 pt-5">
        {paso.detalle.split(" · ").map((d) => (
          <li key={d} className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-dorado shrink-0" />
            <span className="font-body text-navy/60 text-[11px] tracking-[0.12em] uppercase">
              {d}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Proceso() {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.8", "end 0.55"],
  });
  const { scrollYProgress: deskProgress } = useScroll({
    target: deskRef,
    offset: ["start 0.75", "end 0.6"],
  });

  return (
    <section className="bg-[#F6F8FB] relative overflow-hidden py-28 lg:py-36">
      {/* Large background word */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-navy/[0.035] font-medium leading-none select-none pointer-events-none"
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
              <div className="h-px w-10 bg-dorado" />
              <span className="eyebrow !text-[#8A6A1B]">Cómo trabajamos</span>
            </motion.div>

            <motion.h2
              className="font-display text-navy font-medium leading-[1.0]"
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
              <em className="not-italic italic text-[#A47C1B]">paso a paso</em>
            </motion.h2>
          </div>

          <motion.p
            className="font-body text-navy/60 text-[15px] leading-relaxed max-w-xs lg:text-right"
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
              stroke="rgba(26,39,82,0.12)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            {/* Animated gold path */}
            <motion.path
              d="M 0.5 0 L 0.5 100"
              stroke="#C9A84C"
              strokeWidth="2"
              fill="none"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: reduced ? 1 : scrollYProgress }}
            />
          </svg>

          {pasos.map((paso, i) => (
            <Paso key={paso.num} paso={paso} index={i} />
          ))}
        </div>

        {/* Horizontal timeline - desktop: la línea se dibuja con el scroll */}
        <div ref={deskRef} className="hidden lg:block relative">
          <div
            className="absolute top-0 left-[16.5%] right-[16.5%] h-[2px] rounded-full bg-navy/10"
            aria-hidden="true"
          />
          <motion.div
            className="absolute top-0 left-[16.5%] right-[16.5%] h-[2px] rounded-full bg-dorado origin-left"
            style={{ scaleX: reduced ? 1 : deskProgress }}
            aria-hidden="true"
          />
          <div className="grid grid-cols-3 gap-8 pt-14">
            {pasos.map((paso, i) => (
              <PasoCard
                key={paso.num}
                paso={paso}
                index={i}
                progress={deskProgress}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
