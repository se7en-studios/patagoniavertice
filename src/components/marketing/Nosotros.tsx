"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
export interface PerfilProps {
  nombre?: string;
  titulo?: string;
  matricula?: string;
  colegio?: string;
  foto?: string;
  bio?: string;
}

export default function Nosotros({ perfil }: { perfil?: PerfilProps }) {
  const titleRef = useScrollReveal<HTMLHeadingElement>({ y: 30 });
  const estelaRef = useScrollReveal<HTMLHeadingElement>({ y: 24 });
  const reduced = useReducedMotion();

  // Foto de Estela: parallax suave dentro del círculo.
  const fotoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: fotoProgress } = useScroll({
    target: fotoRef,
    offset: ["start end", "end start"],
  });
  const fotoY = useTransform(fotoProgress, [0, 1], reduced ? ["0%", "0%"] : ["-9%", "9%"]);

  const nombreEstela = perfil?.nombre || "Estela Mari Rojas";
  const matriculaEstela = perfil?.matricula || "Matrícula 35 RP 2026";
  const colegioEstela = perfil?.colegio || "Colegio de Martilleros y Corredores Públicos · Río Negro IV Circunscripción";
  const fotoEstela = perfil?.foto || "/estela.jpg";

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
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
          />
        </svg>
      ),
      label: "Profesional Matriculada",
      value: matriculaEstela,
      sub: colegioEstela,
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
      value: "Mari Menuco, Cipolletti & Catriel",
      sub: "Alto Valle de Río Negro & Neuquén · Patagonia Argentina",
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
      value: "Transparencia · Respaldo Notarial",
      sub: "Profesionalismo garantizado en cada operación inmobiliaria",
    },
  ];

  return (
    <section className="bg-[#F6F8FB] overflow-hidden">
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
                <span className="eyebrow !text-[#8A6A1B]">Quiénes somos</span>
              </div>

              <h2
                ref={titleRef}
                className="font-display text-navy font-medium leading-[1.08] mb-8 opacity-0"
                style={{
                  fontSize: "clamp(2.4rem, 4.8vw, 3.8rem)",
                  letterSpacing: "0.015em",
                }}
              >
                Raíces patagónicas,{" "}
                <em className="not-italic italic text-[#A47C1B]">
                  visión de futuro
                </em>
              </h2>

              <div className="space-y-4 font-body text-navy/60 text-[15px] leading-relaxed mb-10">
                <p>
                  En <strong>ALTUM SCI</strong> (Servicios &amp; Consultoría Inmobiliaria) lideramos operaciones estratégicas de alto nivel en Neuquén, Río Negro y la Patagonia. Conectamos inversores y familias con oportunidades de tierra y residencias con alto potencial de plusvalía.
                </p>
                <p>
                  Cada operación cuenta con el respaldo legal y matriculado de <strong>Estela Mari Rojas</strong> (Mat. 35 RP 2026), garantizando transparencia notarial absoluta, trato directo y confidencialidad sin intermediarios.
                </p>
              </div>

              <Link
                href="/nosotros"
                className="inline-flex items-center gap-3 rounded-full font-body text-[11px] tracking-[0.15em] font-semibold uppercase bg-navy text-white px-9 py-4 hover:bg-[#8A6A1B] transition-colors duration-300"
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
            <span className="eyebrow !text-[#8A6A1B]">La profesional detrás de Altum</span>
          </motion.div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Pieza Editorial / Foto Oficial de Estela */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[380px] sm:max-w-[420px]"
              >
                {/* Glow decorativo de fondo */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-dorado/20 via-dorado/5 to-transparent rounded-3xl blur-xl -z-10 opacity-70" />

                {/* Card marco editorial */}
                <div
                  ref={fotoRef}
                  className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-[0_30px_70px_-20px_rgba(14,26,51,0.35)] border border-dorado/35 ring-1 ring-black/5"
                >
                  <motion.div
                    className="absolute inset-0"
                    style={{ y: fotoY }}
                  >
                    <Image
                      src={fotoEstela}
                      alt={`${nombreEstela} - Martillera Colegiada ALTUM`}
                      fill
                      sizes="(max-width: 768px) 380px, 420px"
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </div>

                {/* Badge flotante de matrícula */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-3.5 flex items-center justify-between px-4 py-2.5 bg-white/90 backdrop-blur-md rounded-xl border border-dorado/25 shadow-sm text-xs"
                >
                  <span className="font-body font-semibold text-navy tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Martillera Matriculada
                  </span>
                  <span className="font-mono text-dorado-oscuro font-bold">
                    {matriculaEstela}
                  </span>
                </motion.div>
              </motion.div>
            </div>

            {/* Contenido Editorial & Respaldo */}
            <div className="lg:col-span-7">
              <SlideInRight delay={0.15}>
                {/* Nombre + título */}
                <div className="mb-6">
                  <h2
                    ref={estelaRef}
                    className="font-display text-navy font-medium leading-[1.05] mb-2 opacity-0"
                    style={{
                      fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {nombreEstela.split(" ")[0]} {nombreEstela.split(" ")[1] || ""}{" "}
                    <em className="not-italic italic text-[#A47C1B]">
                      {nombreEstela.split(" ").slice(2).join(" ") || "Rojas"}
                    </em>
                  </h2>
                  <p className="font-body text-navy/60 text-xs tracking-[0.2em] uppercase font-semibold">
                    Martillera y Corredora Pública Colegiada · ALTUM SCI
                  </p>
                </div>

                {/* Cita de confianza */}
                <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#F8F5EE] border border-dorado/20">
                  <p className="font-display text-navy text-lg sm:text-xl font-medium leading-snug mb-1.5">
                    &ldquo;Una operación clara empieza con información.&rdquo;
                  </p>
                  <p className="font-body text-navy/70 text-xs sm:text-sm leading-relaxed">
                    Revisar la documentación, dejar los acuerdos por escrito y contar con asesoramiento profesional puede evitarte problemas después.
                  </p>
                  <p className="mt-2 font-display italic text-[#8A6A1B] text-sm font-medium">
                    Tu confianza también es parte del trato.
                  </p>
                </div>

                {/* Credenciales */}
                <div className="space-y-4 mb-8">
                  {credenciales.map((c, i) => (
                    <motion.div
                      key={c.label}
                      className="flex gap-4 group p-2.5 rounded-xl transition-colors hover:bg-white/80"
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
                        className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-white shadow-sm border border-dorado/20 text-[#8A6A1B] group-hover:bg-dorado group-hover:text-white transition-colors duration-300"
                      >
                        {c.icon}
                      </div>
                      {/* Text */}
                      <div className="pt-0.5">
                        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-navy/40 mb-0.5">
                          {c.label}
                        </p>
                        <p className="font-body text-navy font-semibold text-[14px] mb-0.5">
                          {c.value}
                        </p>
                        <p className="font-body text-navy/55 text-[12px] leading-snug">
                          {c.sub}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Botón CTA directo con Estela */}
                <div className="pt-2">
                  <a
                    href="https://wa.me/5492996095742?text=Hola%20Estela%20Mari%20Rojas%20(ALTUM%20SCI)%2C%20quisiera%20solicitar%20asesoramiento%20personalizado."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3.5 bg-navy hover:bg-navy-dark text-white rounded-xl font-body font-semibold text-sm shadow-[0_12px_28px_-10px_rgba(14,26,51,0.5)] hover:shadow-xl transition-all duration-300 group"
                  >
                    <span>Consultar directamente con Estela</span>
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                </div>
              </SlideInRight>
            </div>
          </div>
      </div>
    </div>

      {/* ── Valores strip ────────────────────────────────────────────── */}
      <div className="border-t border-navy/10 overflow-hidden">
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
              <span className="font-display text-navy/40 font-medium italic text-xl">
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
