"use client";

import { motion } from "framer-motion";

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
  return (
    <motion.div
      className="relative flex gap-6 lg:gap-10 pb-14 last:pb-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Circle on the rail */}
      <div className="relative shrink-0 w-12 flex justify-center">
        <div className="relative z-10 w-12 h-12 rounded-full border border-dorado/60 bg-white shadow-[0_8px_20px_-10px_rgba(14,26,51,0.35)] flex items-center justify-center">
          <span className="font-display text-[#8A6A1B] text-sm font-semibold">
            {paso.num}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <h3
          className="font-display text-navy font-medium leading-tight mb-3"
          style={{
            fontSize: "clamp(1.7rem, 3vw, 2.2rem)",
            letterSpacing: "-0.02em",
          }}
        >
          {paso.titulo}
        </h3>

        <p className="font-body text-navy/65 text-[15px] leading-relaxed max-w-xl">
          {paso.descripcion}
        </p>

        <div className="pt-4 space-y-1.5">
          {paso.detalle.split(" · ").map((d) => (
            <div key={d} className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-dorado shrink-0" />
              <span className="font-body text-navy/60 text-[11px] tracking-[0.12em] uppercase">
                {d}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PasoCard({
  paso,
  index,
}: {
  paso: (typeof pasos)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      className="group relative rounded-3xl bg-white p-8 xl:p-10 border border-navy/10 hover:border-dorado/60 shadow-[0_18px_40px_-26px_rgba(14,26,51,0.35)] hover:shadow-[0_24px_48px_-24px_rgba(201,168,76,0.28)] transition-all duration-300"
    >
      <div
        className="relative mb-6 h-[4.5rem] font-display font-semibold leading-none text-[#C9A84C]"
        style={{ fontSize: "4.5rem", letterSpacing: "-0.04em" }}
      >
        {paso.num}
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
  return (
    <section className="bg-[#F6F8FB] relative overflow-hidden py-24 lg:py-32">
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
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 lg:mb-24">
          <div>
            <motion.div
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-px w-10 bg-dorado" />
              <span className="eyebrow !text-[#8A6A1B]">Cómo trabajamos</span>
            </motion.div>

            <motion.h2
              className="font-display text-navy font-medium leading-[1.0]"
              style={{
                fontSize: "clamp(2.6rem, 5.5vw, 4.6rem)",
                letterSpacing: "-0.03em",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
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
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Un proceso claro y transparente, diseñado para que tomes decisiones
            con confianza.
          </motion.p>
        </div>

        {/* Vertical timeline - mobile/tablet */}
        <div className="relative max-w-3xl lg:hidden">
          <div
            className="absolute left-6 top-2 bottom-2 w-0.5 bg-gradient-to-b from-dorado via-dorado/60 to-dorado/15"
            aria-hidden="true"
          />

          {pasos.map((paso, i) => (
            <Paso key={paso.num} paso={paso} index={i} />
          ))}
        </div>

        {/* Horizontal timeline - desktop */}
        <div className="hidden lg:block relative">
          <div
            className="absolute top-0 left-[16.5%] right-[16.5%] h-[2px] rounded-full bg-gradient-to-r from-dorado/40 via-dorado to-dorado/40"
            aria-hidden="true"
          />
          <div className="grid grid-cols-3 gap-8 pt-12">
            {pasos.map((paso, i) => (
              <PasoCard key={paso.num} paso={paso} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
