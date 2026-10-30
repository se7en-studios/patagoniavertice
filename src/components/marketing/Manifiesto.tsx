"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type { StatManifiesto } from "@/lib/site-config-types";

const TICKER_ITEMS = [
  "BAHÍA DE LAS PLAYAS · LOTES FRENTE AL LAGO DESDE USD 32.000",
  "CIPOLLETTI RESIDENCIAL · CORREDOR ALTO VALLE USD 1.380/M²",
  "CATRIEL & EJE VACA MUERTA · RENTA CORPORATIVA 12–14% USD",
  "ESTELA MARI ROJAS · MARTILLERA COLEGIADA MAT. 35 RP 2026",
  "OPERATORIA PRESENCIAL & 100% REMOTA CON FIRMA CERTIFICADA",
  "TASACIÓN PERICIAL OFICIAL EN 24–48 HS HÁBILES",
];

const MANIFIESTO_WORDS: { text: string; highlight?: boolean }[] = [
  { text: "El" },
  { text: "territorio" },
  { text: "con" },
  { text: "mayor" },
  { text: "proyección", highlight: true },
  { text: "económica", highlight: true },
  { text: "de" },
  { text: "Argentina" },
  { text: "exige" },
  { text: "gestión" },
  { text: "inmobiliaria" },
  { text: "de" },
  { text: "precisión," },
  { text: "sin" },
  { text: "intermediarios" },
  { text: "y" },
  { text: "con" },
  { text: "respaldo", highlight: true },
  { text: "colegiado.", highlight: true },
];

const STATS = [
  {
    value: 4,
    prefix: "",
    suffix: "",
    label: "Polos de operación",
    detail: "Mari Menuco, Cipolletti, Catriel y Gral. Roca",
  },
  {
    value: 65,
    prefix: "",
    suffix: " km",
    label: "Corredor al Lago",
    detail: "45 min por Ruta 7 y Ruta 51 desde Neuquén",
  },
  {
    value: 24,
    prefix: "",
    suffix: " hs",
    label: "Dictamen Técnico",
    detail: "Valuación real con firma de Martillera Colegiada",
  },
  {
    value: 100,
    prefix: "",
    suffix: "%",
    label: "Seguridad Jurídica",
    detail: "Revisión dominial, boletos y escrituración",
  },
];

function parseNumericStat(raw: string): {
  prefix: string;
  num: number | null;
  suffix: string;
} {
  const match = raw.trim().match(/^([^0-9]*)(\d+)(.*)$/);
  if (!match) return { prefix: "", num: null, suffix: raw };
  return {
    prefix: match[1] || "",
    num: Number(match[2]),
    suffix: match[3] || "",
  };
}

function ScrubWord({
  word,
  highlight,
  index,
  total,
  progress,
}: {
  word: string;
  highlight?: boolean;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = (index / total) * 0.75;
  const end = start + 0.25;
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  const y = useTransform(progress, [start, end], [6, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block mr-[0.26em] will-change-transform ${
        highlight ? "rd-serif text-[#A47C1B]" : "text-navy"
      }`}
    >
      {word}
    </motion.span>
  );
}

export default function Manifiesto({
  statsCustom,
}: {
  statsCustom?: StatManifiesto[];
}) {
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const { scrollYProgress } = useScroll({
    target: quoteRef,
    offset: ["start 88%", "end 48%"],
  });

  const items =
    statsCustom && statsCustom.length > 0
      ? statsCustom.map((st) => {
          const parsed = parseNumericStat(st.valor);
          return {
            id: st.id,
            raw: st.valor,
            value: parsed.num,
            prefix: parsed.prefix,
            suffix: parsed.suffix,
            label: st.etiqueta,
            detail: st.detalle,
          };
        })
      : STATS.map((s, idx) => ({
          id: `st-${idx}`,
          raw: `${s.prefix}${s.value}${s.suffix}`,
          value: s.value,
          prefix: s.prefix,
          suffix: s.suffix,
          label: s.label,
          detail: s.detail,
        }));

  return (
    <section className="relative bg-[#F6F8FB] pb-16 lg:pb-24 overflow-hidden">
      {/* Cinta Continua PropTech de Indicadores de Mercado (Estilo se7endev.vercel.app: .rd-condensed + estrella 4 puntas) */}
      <div className="relative bg-[#070E1B] border-y border-dorado/25 py-3.5 overflow-hidden select-none mb-16 lg:mb-20">
        <div className="marquee-track-slow">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((text, idx) => (
            <div
              key={idx}
              className="flex items-center gap-6 px-6 rd-condensed text-xl sm:text-2xl text-white/90 whitespace-nowrap"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-3.5 w-3.5 text-dorado shrink-0"
                fill="currentColor"
              >
                <path d="M12 0c.6 5.2 1.6 8 3.3 9.1 1.4.9 4.2 1.4 8.7 2.9-4.5 1.5-7.3 2-8.7 2.9C13.6 16 12.6 18.8 12 24c-.6-5.2-1.6-8-3.3-9.1C7.3 14 4.5 13.5 0 12c4.5-1.5 7.3-2 8.7-2.9C10.4 8 11.4 5.2 12 0Z" />
              </svg>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Editorial Statement con Iluminación Progresiva Palabra por Palabra en Scroll */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-navy/10 mb-6 shadow-sm"
          >
            <span className="rd-ping" />
            <span className="rd-label !text-[10px] !tracking-[0.22em] text-navy/75">
              [01 · TESIS DE INVERSIÓN PATAGONIA NORTE]
            </span>
          </motion.div>

          <blockquote
            ref={quoteRef}
            className="rd-display text-3xl sm:text-4xl lg:text-[3.35rem] leading-[1.08]"
          >
            {MANIFIESTO_WORDS.map((item, idx) => (
              <ScrubWord
                key={`${item.text}-${idx}`}
                word={item.text}
                highlight={item.highlight}
                index={idx}
                total={MANIFIESTO_WORDS.length}
                progress={scrollYProgress}
              />
            ))}
          </blockquote>
        </div>

        {/* Architectural 4-Column Metric Grid con Contadores y Línea Dorada Animada */}
        <div className="mt-12 lg:mt-14 rounded-3xl bg-white border border-navy/10 shadow-[0_20px_50px_-30px_rgba(14,26,51,0.14)] overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-navy/10">
            {items.map((item, i) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative p-7 lg:p-8 flex flex-col justify-between hover:bg-[#F6F8FB]/70 transition-colors"
              >
                {/* Barra superior dorada que se expande al entrar en viewport */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-dorado via-dorado/60 to-transparent origin-left"
                />

                <div className="flex items-center justify-between mb-5">
                  <span className="rd-label !text-[10px] !tracking-[0.2em] text-navy/40 group-hover:text-[#8A6A1B] transition-colors">
                    [0{i + 1} / MÉTRICA]
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-dorado/70 group-hover:scale-125 transition-transform" />
                </div>

                <div>
                  <dd className="rd-condensed tabular-nums text-navy text-5xl lg:text-[4rem] leading-none">
                    {item.value !== null ? (
                      <AnimatedNumber
                        value={item.value}
                        prefix={item.prefix}
                        suffix={item.suffix}
                      />
                    ) : (
                      item.raw
                    )}
                  </dd>
                  <dt className="rd-label !text-[10.5px] !tracking-[0.16em] text-navy mt-3">
                    {item.label}
                  </dt>
                  {item.detail && (
                    <p className="font-body text-navy/55 text-xs mt-1.5 leading-relaxed">
                      {item.detail}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
