"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const words = [
  { text: "El", accent: false },
  { text: "territorio", accent: false },
  { text: "más", accent: false },
  { text: "generoso", accent: true },
  { text: "de", accent: false },
  { text: "Argentina", accent: false },
  { text: "espera", accent: false },
  { text: "a", accent: false },
  { text: "quienes", accent: false },
  { text: "saben", accent: false },
  { text: "mirar", accent: false },
  { text: "más", accent: false },
  { text: "allá.", accent: false },
];

const STATS = [
  { value: 4, suffix: "", label: "Zonas de operación" },
  { value: 65, suffix: " km", label: "Mari Menuco ↔ Neuquén" },
  { value: 24, suffix: " hs", label: "Dictamen de tasación" },
  { value: 100, suffix: "%", label: "Trámite legal y remoto" },
];

// Cada palabra se enciende cuando el scroll llega a su turno.
function Word({
  text,
  accent,
  index,
  progress,
}: {
  text: string;
  accent: boolean;
  index: number;
  progress: MotionValue<number>;
}) {
  const step = 1 / words.length;
  const opacity = useTransform(
    progress,
    [index * step, (index + 1) * step],
    [0.16, 1],
  );
  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block mr-[0.28em] ${
        accent ? "italic text-[#A47C1B]" : ""
      }`}
    >
      {text}
    </motion.span>
  );
}

export default function Manifiesto() {
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const { scrollYProgress } = useScroll({
    target: quoteRef,
    offset: ["start 0.85", "end 0.5"],
  });

  return (
    <section className="relative bg-[#F6F8FB] py-28 lg:py-36 overflow-hidden">
      {/* Glow ambiental dorado suave */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-0 opacity-40"
        aria-hidden="true"
      >
        <div className="h-[450px] w-[600px] rounded-full bg-gradient-to-tr from-dorado/25 via-dorado/10 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 lg:px-16 text-center">
        {/* Comilla ornamental */}
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center text-dorado/60 text-2xl font-serif">
          &ldquo;
        </div>

        <blockquote
          ref={quoteRef}
          className="font-display font-medium text-navy text-3xl sm:text-4xl lg:text-6xl leading-[1.12]"
          style={{ letterSpacing: "-0.03em" }}
          aria-label="El territorio más generoso de Argentina espera a quienes saben mirar más allá."
        >
          {words.map((word, i) => (
            <Word
              key={i}
              text={word.text}
              accent={word.accent}
              index={i}
              progress={scrollYProgress}
            />
          ))}
        </blockquote>

        <p className="mt-8 font-body text-navy/45 text-[10px] tracking-[0.35em] uppercase font-semibold">
          ALTUM SCI · Servicios &amp; Consultoría Inmobiliaria · Patagonia
        </p>
      </div>

      {/* Datos verificables ya publicados en el resto del sitio */}
      <motion.dl
        className="relative z-10 max-w-5xl mx-auto mt-16 px-6 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group rounded-3xl bg-white/90 backdrop-blur-md border border-dorado/20 hover:border-dorado/60 shadow-[0_18px_40px_-24px_rgba(14,26,51,0.25)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 px-5 py-7 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-dorado/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <dd className="font-display text-navy text-4xl lg:text-5xl font-semibold tracking-tight">
              <AnimatedNumber value={s.value} suffix={s.suffix} />
            </dd>
            <dt className="font-body text-navy/60 text-[10px] tracking-[0.2em] uppercase mt-2 font-medium">
              {s.label}
            </dt>
          </motion.div>
        ))}
      </motion.dl>
    </section>
  );
}
