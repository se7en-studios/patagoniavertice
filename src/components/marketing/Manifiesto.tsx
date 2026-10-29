"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const STATS = [
  { value: 4, suffix: "", label: "Zonas de operación" },
  { value: 65, suffix: " km", label: "Mari Menuco ↔ Neuquén" },
  { value: 24, suffix: " hs", label: "Dictamen de tasación" },
  { value: 100, suffix: "%", label: "Trámite legal y remoto" },
];

export default function Manifiesto() {
  return (
    <section
      className="relative bg-[#F6F8FB] py-20 lg:py-28 overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(550px circle at 50% 35%, rgba(201,168,76,0.13), transparent 70%)",
      }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-16 text-center">
        {/* Comilla ornamental */}
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-dorado/35 bg-white text-[#A47C1B] text-2xl font-serif shadow-sm">
          &ldquo;
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-medium text-navy text-3xl sm:text-4xl lg:text-6xl leading-[1.12]"
          style={{ letterSpacing: "-0.03em" }}
        >
          El territorio más{" "}
          <span className="italic text-[#A47C1B]">generoso</span> de Argentina
          espera a quienes saben mirar más allá.
        </motion.blockquote>

        <p className="mt-7 font-body text-navy/55 text-[10px] tracking-[0.32em] uppercase font-semibold">
          ALTUM SCI · Servicios &amp; Consultoría Inmobiliaria · Patagonia
        </p>
      </div>

      {/* Datos verificables */}
      <div className="relative z-10 max-w-5xl mx-auto mt-14 px-5 sm:px-8 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-5">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.5,
              delay: i * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group rounded-3xl bg-white border border-dorado/25 hover:border-dorado/65 shadow-[0_14px_34px_-20px_rgba(14,26,51,0.2)] hover:-translate-y-1 transition-all duration-200 px-5 py-6 lg:py-7 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-dorado/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <dd className="font-display text-navy text-4xl lg:text-5xl font-semibold tracking-tight">
              <AnimatedNumber value={s.value} suffix={s.suffix} />
            </dd>
            <dt className="font-body text-navy/65 text-[10px] tracking-[0.18em] uppercase mt-2 font-semibold">
              {s.label}
            </dt>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
