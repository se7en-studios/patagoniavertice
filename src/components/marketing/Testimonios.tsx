"use client";

import { motion } from "framer-motion";

const diferenciadores = [
  {
    titulo: "Empresa 100% patagónica",
    descripcion:
      "Nacimos y crecimos en la Patagonia. Conocemos el territorio, el mercado y los barrios mejor que nadie. No somos una inversora de afuera.",
  },
  {
    titulo: "Transparencia total",
    descripcion:
      "Contratos claros, condiciones garantizadas y comunicación constante durante toda la operación. Sin letra chica.",
  },
  {
    titulo: "Trato directo",
    descripcion:
      "Negociás con quienes toman las decisiones. Sin intermediarios, sin burocracia. Condiciones adaptadas a tu situación.",
  },
  {
    titulo: "Calidad en cada detalle",
    descripcion:
      "Atención personalizada y rigor profesional en cada operación en Río Negro y la Patagonia. Nuestro trabajo habla por nosotros.",
  },
  {
    titulo: "Acompañamiento real",
    descripcion:
      "Desde la primera consulta hasta la escritura. Nuestro equipo está disponible para vos, no una central de atención.",
  },
  {
    titulo: "Postventa activa",
    descripcion:
      "El vínculo no termina con la entrega. Seguimos acompañándote con gestión de garantías y lo que necesites.",
  },
];

export default function PorQueElegirnos() {
  return (
    <section className="py-24 lg:py-32 bg-navy-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 lg:mb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-10 bg-dorado" />
            <span className="eyebrow">Por qué elegirnos</span>
          </div>
          <h2
            className="font-display font-medium text-crema leading-[1.0] mb-5"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Lo que nos hace{" "}
            <em className="font-editorial italic text-dorado">diferentes</em>
          </h2>
          <p className="font-body text-crema/60 text-[15px] leading-relaxed max-w-2xl">
            No somos la única inmobiliaria en Río Negro y la Patagonia. Pero sí
            la que más te acompaña.
          </p>
        </motion.div>

        {/* Grid 2×3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {diferenciadores.map((d, i) => (
            <motion.div
              key={d.titulo}
              initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
              whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
              transition={{
                duration: 0.65,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ backgroundColor: "rgba(201,168,76,0.04)" }}
              className="relative space-y-3 pl-6"
              style={{ borderLeft: "2px solid rgba(201,168,76,0.2)" }}
            >
              {/* Border-left dorado que crece en viewport */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-dorado origin-top"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />

              {/* Número ghost */}
              <span
                className="absolute -top-2 right-0 font-display font-bold text-dorado/[0.06] select-none pointer-events-none leading-none"
                style={{ fontSize: "5rem" }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3
                className="font-display font-medium text-crema relative z-10"
                style={{
                  fontSize: "clamp(1.3rem, 2vw, 1.6rem)",
                  letterSpacing: "0.01em",
                }}
              >
                {d.titulo}
              </h3>
              <p className="font-body text-crema/65 text-[15px] leading-relaxed relative z-10">
                {d.descripcion}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
