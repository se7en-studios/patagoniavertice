"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import type { StatManifiesto } from "@/lib/site-config-types";

const STATS = [
  {
    value: 4,
    suffix: "",
    label: "Polos de operación",
    detail: "Mari Menuco, Cipolletti, Catriel y Gral. Roca",
  },
  {
    value: 65,
    suffix: " km",
    label: "Corredor al Lago",
    detail: "45 min por Ruta 7 y Ruta 51 desde Neuquén",
  },
  {
    value: 24,
    suffix: " hs",
    label: "Dictamen Técnico",
    detail: "Valuación real con firma de Martillera Colegiada",
  },
  {
    value: 100,
    suffix: "%",
    label: "Seguridad Jurídica",
    detail: "Revisión dominial, boletos y escrituración",
  },
];

export default function Manifiesto({
  statsCustom,
}: {
  statsCustom?: StatManifiesto[];
}) {
  return (
    <section className="relative bg-[#F6F8FB] py-20 lg:py-28 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Editorial Statement */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white border border-navy/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-dorado" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-navy/70 font-semibold">
              Tesis de Inversión · Patagonia Norte
            </span>
          </div>

          <motion.blockquote
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-medium text-navy text-3xl sm:text-4xl lg:text-[3.35rem] leading-[1.12]"
            style={{ letterSpacing: "-0.03em" }}
          >
            El territorio con mayor{" "}
            <span className="italic text-[#A47C1B]">proyección económica</span>{" "}
            de Argentina exige gestión inmobiliaria de precisión, sin
            intermediarios y con respaldo colegiado.
          </motion.blockquote>
        </div>

        {/* Architectural 4-Column Metric Grid */}
        <div className="mt-14 lg:mt-16 rounded-3xl bg-white border border-navy/[0.08] shadow-[0_20px_50px_-30px_rgba(14,26,51,0.14)] overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-navy/[0.07]">
            {statsCustom && statsCustom.length > 0
              ? statsCustom.map((st, i) => (
                  <motion.div
                    key={st.id || i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                    className="p-7 lg:p-8 flex flex-col justify-between hover:bg-[#F6F8FB]/60 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-navy/35 font-semibold">
                        0{i + 1}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-dorado/70" />
                    </div>
                    <div>
                      <dd className="font-display text-navy text-4xl lg:text-[2.75rem] font-semibold tracking-tight leading-none">
                        {st.valor}
                      </dd>
                      <dt className="font-body text-navy text-xs tracking-[0.14em] uppercase mt-3 font-semibold">
                        {st.etiqueta}
                      </dt>
                      {st.detalle && (
                        <p className="font-body text-navy/50 text-xs mt-1 leading-relaxed">
                          {st.detalle}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              : STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                    className="p-7 lg:p-8 flex flex-col justify-between hover:bg-[#F6F8FB]/60 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-navy/35 font-semibold">
                        0{i + 1}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-dorado/70" />
                    </div>
                    <div>
                      <dd className="font-display text-navy text-4xl lg:text-[2.75rem] font-semibold tracking-tight leading-none">
                        <AnimatedNumber value={s.value} suffix={s.suffix} />
                      </dd>
                      <dt className="font-body text-navy text-xs tracking-[0.14em] uppercase mt-3 font-semibold">
                        {s.label}
                      </dt>
                      <p className="font-body text-navy/50 text-xs mt-1 leading-relaxed">
                        {s.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
