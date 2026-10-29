"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const words = [
  { text: "El", italic: false },
  { text: "territorio", italic: false },
  { text: "más", italic: false },
  { text: "generoso", italic: true },
  { text: "de", italic: false },
  { text: "Argentina", italic: false },
  { text: "espera", italic: false },
  { text: "a", italic: false },
  { text: "quienes", italic: false },
  { text: "saben", italic: false },
  { text: "mirar", italic: false },
  { text: "más", italic: false },
  { text: "allá.", italic: false },
];

const STATS = [
  { value: 4, suffix: "", label: "Zonas de operación" },
  { value: 65, suffix: " km", label: "Mari Menuco ↔ Neuquén" },
  { value: 24, suffix: " hs", label: "Dictamen de tasación" },
  { value: 100, suffix: "%", label: "Trámite legal y remoto" },
];

export default function Manifiesto() {
  return (
    <section className="relative bg-crema py-28 lg:py-40 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px gold-line" />

      <div className="relative max-w-3xl mx-auto px-8 lg:px-16 text-center">
        {/* Ornament */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-12"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <div className="h-px w-16 bg-dorado" />
          <div className="w-1.5 h-1.5 rotate-45 bg-dorado" />
          <div className="h-px w-16 bg-dorado" />
        </motion.div>

        {/* Word-by-word reveal */}
        <blockquote
          className="font-display font-medium text-tierra text-2xl sm:text-3xl lg:text-4xl leading-snug"
          style={{ letterSpacing: "-0.02em" }}
          aria-label="El territorio más generoso de Argentina espera a quienes saben mirar más allá."
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`inline-block mr-[0.28em] ${
                word.italic ? "not-italic italic text-dorado" : ""
              }`}
            >
              {word.text}
            </motion.span>
          ))}
        </blockquote>

        <motion.div
          className="flex items-center justify-center gap-5 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.85 }}
        >
          <div className="h-px w-10 bg-dorado/50" />
          <span className="font-body text-tierra/40 text-[10px] tracking-[0.35em] uppercase font-semibold">
            ALTUM SCI · Servicios &amp; Consultoría Inmobiliaria · Patagonia
          </span>
          <div className="h-px w-10 bg-dorado/50" />
        </motion.div>
      </div>

      {/* Datos verificables ya publicados en el resto del sitio */}
      <motion.dl
        className="relative max-w-5xl mx-auto mt-20 px-8 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-y-10 border-t border-dorado/25 pt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="text-center lg:border-l lg:first:border-l-0 border-dorado/20"
          >
            <dd className="font-display text-tierra text-4xl lg:text-5xl font-semibold tracking-tight">
              <AnimatedNumber value={s.value} suffix={s.suffix} />
            </dd>
            <dt className="font-body text-tierra/55 text-[10px] tracking-[0.22em] uppercase mt-2">
              {s.label}
            </dt>
          </div>
        ))}
      </motion.dl>

      <div className="absolute bottom-0 left-0 right-0 h-px gold-line" />
    </section>
  );
}
