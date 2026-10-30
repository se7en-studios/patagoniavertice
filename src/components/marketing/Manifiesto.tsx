"use client";

import { motion } from "framer-motion";
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

export default function Manifiesto({
  statsCustom,
}: {
  statsCustom?: StatManifiesto[];
}) {
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
      {/* Cinta Continua PropTech de Indicadores de Mercado (GPU Marquee) */}
      <div className="relative bg-[#0B1528] border-y border-dorado/25 py-3 overflow-hidden select-none mb-16 lg:mb-20">
        <div className="marquee-track-slow">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((text, idx) => (
            <div
              key={idx}
              className="flex items-center gap-6 px-6 font-mono text-[10.5px] tracking-[0.2em] uppercase text-white/85 whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-dorado shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Editorial Statement con Reveal Progresivo */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white border border-navy/10 mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-dorado animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-navy/70 font-semibold">
              Tesis de Inversión · Patagonia Norte
            </span>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-medium text-navy text-3xl sm:text-4xl lg:text-[3.25rem] leading-[1.12]"
            style={{ letterSpacing: "-0.03em" }}
          >
            El territorio con mayor{" "}
            <span className="font-editorial italic text-[#A47C1B]">
              proyección económica
            </span>{" "}
            de Argentina exige gestión inmobiliaria de precisión, sin
            intermediarios y con respaldo colegiado.
          </motion.blockquote>
        </div>

        {/* Architectural 4-Column Metric Grid con Contadores y Línea Dorada Animada */}
        <div className="mt-12 lg:mt-14 rounded-3xl bg-white border border-navy/[0.08] shadow-[0_20px_50px_-30px_rgba(14,26,51,0.14)] overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-navy/[0.07]">
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
                  <span className="font-mono text-[10px] tracking-[0.2em] text-navy/35 font-semibold group-hover:text-[#8A6A1B] transition-colors">
                    0{i + 1} / MÉTRICA
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-dorado/70 group-hover:scale-125 transition-transform" />
                </div>

                <div>
                  <dd className="font-display text-navy text-4xl lg:text-[2.85rem] font-semibold tracking-tight leading-none">
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
                  <dt className="font-body text-navy text-xs tracking-[0.14em] uppercase mt-3 font-semibold">
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
