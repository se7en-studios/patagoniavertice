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
    <section className="relative bg-[#F6F8FB] py-28 lg:py-40 overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-8 lg:px-16 text-center">
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

        <p className="mt-10 font-body text-navy/45 text-[10px] tracking-[0.35em] uppercase font-semibold">
          ALTUM SCI · Servicios &amp; Consultoría Inmobiliaria · Patagonia
        </p>
      </div>

      {/* Datos verificables ya publicados en el resto del sitio */}
      <motion.dl
        className="relative max-w-5xl mx-auto mt-20 px-6 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-3xl bg-white/80 border border-white shadow-[0_18px_40px_-24px_rgba(14,26,51,0.3)] px-5 py-7 text-center"
          >
            <dd className="font-display text-navy text-4xl lg:text-5xl font-semibold tracking-tight">
              <AnimatedNumber value={s.value} suffix={s.suffix} />
            </dd>
            <dt className="font-body text-navy/55 text-[10px] tracking-[0.2em] uppercase mt-2">
              {s.label}
            </dt>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
