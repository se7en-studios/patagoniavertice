"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SlideInLeft, SlideInRight } from "@/components/ui/AnimateOnScroll";
import PatagoniaGallery from "@/components/marketing/PatagoniaGallery";
import { useScrollReveal } from "@/lib/useScrollReveal";

const valores = [
  "Transparencia",
  "Compromiso",
  "Calidad",
  "Visión",
  "Territorio",
];

const credenciales = [
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
    label: "Profesional Matriculada",
    value: "Matrícula 35 RP 2026",
    sub: "Colegio de Martilleros y Corredores Públicos · Río Negro IV Circunscripción",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    label: "Zona de Cobertura",
    value: "Catriel y Cipolletti",
    sub: "Todo el Alto Valle de Río Negro · Patagonia Argentina",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
    label: "Seguridad Jurídica",
    value: "Transparencia · Respaldo",
    sub: "Profesionalismo garantizado en cada operación inmobiliaria",
  },
];

export default function Nosotros() {
  const titleRef = useScrollReveal<HTMLHeadingElement>({ y: 30 });
  const estelaRef = useScrollReveal<HTMLHeadingElement>({ y: 24 });

  return (
    <section className="bg-crema overflow-hidden">
      {/* ── PARTE 1: Intro empresa ───────────────────────────────────── */}
      <div className="py-28 lg:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: text */}
            <SlideInLeft>
              <div className="flex items-center gap-4 mb-8">
                <motion.div
                  className="h-px bg-dorado origin-left"
                  style={{ width: 40 }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
                <span className="eyebrow">Quiénes somos</span>
              </div>

              <h2
                ref={titleRef}
                className="font-display text-tierra font-medium leading-[1.08] mb-8 opacity-0"
                style={{
                  fontSize: "clamp(2.4rem, 4.8vw, 3.8rem)",
                  letterSpacing: "0.015em",
                }}
              >
                Raíces patagónicas,{" "}
                <em className="not-italic italic text-dorado">
                  visión de futuro
                </em>
              </h2>

              <div className="space-y-4 font-body text-tierra/50 text-[15px] leading-relaxed mb-10">
                <p>
                  Somos una consultora inmobiliaria especializada en operaciones
                  de alto nivel en Río Negro y la Patagonia. Servicio directo,
                  transparencia total, sin intermediarios.
                </p>
                <p>
                  Cada operación nace de un profundo conocimiento del
                  territorio, del mercado y de las personas que eligen la
                  Patagonia como su lugar en el mundo.
                </p>
              </div>

              <Link
                href="/nosotros"
                className="inline-flex items-center gap-3 font-body text-[11px] tracking-[0.15em] font-semibold uppercase bg-tierra text-crema px-9 py-4 hover:bg-dorado transition-colors duration-300"
              >
                Conocer más
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </SlideInLeft>

            {/* Right: gallery */}
            <SlideInRight delay={0.1}>
              <PatagoniaGallery />
            </SlideInRight>
          </div>
        </div>
      </div>

      {/* ── DIVISOR GOLD ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          className="h-px gold-line"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left" }}
        />
      </div>

      {/* ── PARTE 2: Estela Mari Rojas ───────────────────────────────── */}
      <div className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-4 mb-16 lg:mb-20"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-10 bg-dorado" />
            <span className="eyebrow">La profesional detrás de Altum</span>
          </motion.div>

          <div className="max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Foto Real de Estela */}
            <div className="md:col-span-4 flex justify-center md:justify-start">
              <div className="relative w-44 h-44 lg:w-52 lg:h-52 rounded-full overflow-hidden border-2 border-dorado shadow-2xl">
                <Image
                  src="/estela.jpg"
                  alt="Estela Mari Rojas - Martillera Colegiada"
                  fill
                  sizes="(max-width: 768px) 180px, 220px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Contenido */}
            <div className="md:col-span-8">
              <SlideInRight delay={0.15}>
                {/* Nombre + título */}
                <div className="mb-8">
                  <h2
                    ref={estelaRef}
                    className="font-display text-tierra font-medium leading-[1.05] mb-2 opacity-0"
                    style={{
                      fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Estela Mari{" "}
                    <em className="not-italic italic text-dorado">Rojas</em>
                  </h2>
                  <p className="font-body text-tierra/55 text-xs tracking-[0.2em] uppercase font-semibold">
                    Martillera y Corredora Pública Colegiada
                  </p>
                </div>

              {/* Credenciales */}
              <div className="space-y-6 mb-10">
                {credenciales.map((c, i) => (
                  <motion.div
                    key={c.label}
                    className="flex gap-4 group"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.55,
                      delay: 0.2 + i * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-dorado/25 text-dorado/60 group-hover:border-dorado/50 group-hover:text-dorado transition-colors duration-300"
                      style={{ background: "rgba(201,168,76,0.05)" }}
                    >
                      {c.icon}
                    </div>
                    {/* Text */}
                    <div className="pt-0.5">
                      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-tierra/35 mb-0.5">
                        {c.label}
                      </p>
                      <p className="font-body text-tierra font-semibold text-[14px] mb-0.5">
                        {c.value}
                      </p>
                      <p className="font-body text-tierra/40 text-[12px] leading-snug">
                        {c.sub}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Separador */}
              <motion.div
                className="h-px gold-line mb-10"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ transformOrigin: "left" }}
              />

              {/* Frase firma */}
              <motion.blockquote
                className="relative pl-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.55 }}
              >
                {/* Left accent */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-dorado/50" />
                <p
                  className="font-display text-tierra font-medium italic leading-snug mb-2"
                  style={{ fontSize: "clamp(1.2rem, 2vw, 1.45rem)" }}
                >
                  &ldquo;No vendemos propiedades.
                  <br />
                  Acompañamos decisiones patrimoniales.&rdquo;
                </p>
                <p className="font-body text-tierra/35 text-[10px] tracking-[0.25em] uppercase">
                  - Estela Mari Rojas · Altum Inmobiliaria
                </p>
              </motion.blockquote>
            </SlideInRight>
          </div>
        </div>
      </div>
    </div>

      {/* ── Valores strip ────────────────────────────────────────────── */}
      <div className="border-t border-arena overflow-hidden">
        <motion.div
          style={{ display: "flex", width: "max-content" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          {[...valores, ...valores, ...valores, ...valores].map((v, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1.5rem",
                padding: "1.25rem 2rem",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <span className="font-display text-tierra/40 font-medium italic text-xl">
                {v}
              </span>
              <span className="text-dorado/40 text-sm">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
