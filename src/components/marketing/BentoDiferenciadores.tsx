"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Globe2, LineChart, ArrowUpRight } from "lucide-react";

const diferenciadores = [
  {
    id: "trato",
    title: "Trato Directo con Martillera Matriculada",
    subtitle: "01 · Sin intermediarios ni franquicias",
    description:
      "Cada negociación, tasación y revisión documental es conducida personalmente por Estela Mari Rojas (Mat. 35 RP 2026). Sin vendedores rotativos ni cadenas de llamadas.",
    size: "large",
    dark: true,
    Icon: Users,
  },
  {
    id: "transparencia",
    title: "Auditoría Legal y Dominial Previa",
    subtitle: "02 · Cero sorpresas",
    description:
      "Verificamos títulos, planos, certificados de libre deuda y factibilidad de servicios antes de publicar o reservar cualquier lote o propiedad.",
    size: "small",
    dark: false,
    Icon: ShieldCheck,
  },
  {
    id: "remoto",
    title: "Operatoria 100% Remota para Inversores",
    subtitle: "03 · Desde cualquier ciudad del país",
    description:
      "Recorridas en vivo por videollamada en Mari Menuco y Cipolletti, firma digital de reservas y gestión integral con escribanía de confianza.",
    size: "wide",
    dark: false,
    Icon: Globe2,
  },
  {
    id: "mercado",
    title: "Inteligencia de Precios Reales",
    subtitle: "04 · Valuación precisa",
    description:
      "Trabajamos con valores reales de escrituración por metro cuadrado en el Alto Valle y corredor Vaca Muerta para proteger tu capital.",
    size: "small",
    dark: false,
    Icon: LineChart,
  },
];

export default function BentoDiferenciadores() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden bg-white border-y border-navy/[0.06]"
      aria-labelledby="diferenciadores-heading"
      id="por-que-altum"
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Minimalista */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6F8FB] border border-navy/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-dorado" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8A6A1B] font-semibold">
                Diferencial Boutique
              </span>
            </div>
            <h2
              id="diferenciadores-heading"
              className="font-display font-medium text-navy leading-[1.03]"
              style={{
                fontSize: "clamp(2.3rem, 4.3vw, 3.6rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Por qué los inversores eligen{" "}
              <em className="font-editorial italic text-[#A47C1B]">ALTUM SCI.</em>
            </h2>
          </div>

          <p className="font-body text-navy/60 text-sm lg:text-base leading-relaxed max-w-md">
            Alejados del modelo de franquicias masivas, operamos como una firma
            de consultoría patrimonial con rigor técnico y trato directo.
          </p>
        </div>

        {/* Minimalist Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {diferenciadores.map((d, i) => {
            const isWide = d.size === "large" || d.size === "wide";
            const Icon = d.Icon;
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className={`${isWide ? "md:col-span-2" : ""} rounded-3xl p-7 lg:p-9 border transition-all duration-300 flex flex-col justify-between ${
                  d.dark
                    ? "bg-[#0B1528] text-white border-navy shadow-[0_24px_50px_-26px_rgba(14,26,51,0.45)]"
                    : "bg-[#F6F8FB] text-navy border-navy/[0.08] hover:bg-white hover:border-dorado/50 hover:shadow-[0_20px_44px_-26px_rgba(14,26,51,0.16)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
                        d.dark
                          ? "bg-white/10 text-dorado border border-white/10"
                          : "bg-white text-[#8A6A1B] border border-navy/[0.08]"
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={1.6} />
                    </span>
                    <span
                      className={`font-mono text-[10px] tracking-[0.18em] uppercase font-semibold ${
                        d.dark ? "text-dorado" : "text-[#8A6A1B]"
                      }`}
                    >
                      {d.subtitle}
                    </span>
                  </div>

                  <h3
                    className={`font-display font-medium leading-snug mb-3 ${
                      d.dark ? "text-white" : "text-navy"
                    }`}
                    style={{
                      fontSize: isWide
                        ? "clamp(1.45rem, 2.3vw, 1.9rem)"
                        : "clamp(1.25rem, 1.8vw, 1.5rem)",
                    }}
                  >
                    {d.title}
                  </h3>

                  <p
                    className={`font-body text-sm leading-relaxed ${
                      d.dark ? "text-white/70" : "text-navy/65"
                    }`}
                  >
                    {d.description}
                  </p>
                </div>

                {d.dark && (
                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/55">
                      Colegio de Martilleros · Mat. 35 RP 2026
                    </span>
                    <a
                      href="https://wa.me/5492996095742?text=Hola%20Estela%20(ALTUM%20SCI)%2C%20quisiera%20coordinar%20una%20consulta%20directa."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-dorado hover:underline font-semibold"
                    >
                      <span>Hablar con Estela</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
