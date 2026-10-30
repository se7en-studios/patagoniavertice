"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SlideInLeft, SlideInRight } from "@/components/ui/AnimateOnScroll";
import PatagoniaGallery from "@/components/marketing/PatagoniaGallery";

const valores = [
  "Transparencia",
  "Compromiso",
  "Calidad",
  "Visión",
  "Territorio",
  "Seguridad Jurídica",
];

export interface PerfilProps {
  nombre?: string;
  titulo?: string;
  matricula?: string;
  colegio?: string;
  foto?: string;
  bio?: string;
  cobertura?: string;
  whatsapp?: string;
  fraseConfianza?: string;
  subfraseConfianza?: string;
}

export default function Nosotros({ perfil }: { perfil?: PerfilProps }) {
  const nombreEstela = perfil?.nombre || "Estela Mari Rojas";
  const matriculaEstela = perfil?.matricula || "Mat. 35 RP 2026";
  const colegioEstela =
    perfil?.colegio ||
    "Colegio de Martilleros y Corredores Públicos · Río Negro IV Circunscripción";
  const fotoEstela = perfil?.foto || "/estela.jpg";
  const coberturaEstela =
    perfil?.cobertura || "Mari Menuco, Cipolletti & Catriel";
  const whatsappEstela = perfil?.whatsapp || "5492996095742";
  const fraseConfianza =
    perfil?.fraseConfianza || "Una operación clara empieza con información.";
  const subfraseConfianza =
    perfil?.subfraseConfianza ||
    "Revisar la documentación, dejar los acuerdos por escrito y contar con asesoramiento profesional puede evitarte problemas después.";

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
      value: coberturaEstela,
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
      <div className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Left: text */}
            <SlideInLeft>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-10 bg-dorado" />
                <span className="eyebrow !text-[#8A6A1B]">Quiénes somos</span>
              </div>

              <h2
                className="font-display text-navy font-medium leading-[1.08] mb-6"
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

              <div className="space-y-4 font-body text-navy/65 text-[15px] leading-relaxed mb-9">
                <p>
                  En <strong>ALTUM SCI</strong> (Servicios &amp; Consultoría
                  Inmobiliaria) lideramos operaciones estratégicas de alto nivel
                  en Neuquén, Río Negro y la Patagonia. Conectamos inversores y
                  familias con oportunidades de tierra y residencias con alto
                  potencial de plusvalía.
                </p>
                <p>
                  {perfil?.bio ||
                    `Cada operación cuenta con el respaldo legal y matriculado de ${nombreEstela} (${matriculaEstela}), garantizando transparencia notarial absoluta, trato directo y confidencialidad sin intermediarios.`}
                </p>
              </div>

              <Link
                href="/nosotros"
                className="inline-flex items-center gap-3 rounded-full font-body text-[11px] tracking-[0.15em] font-semibold uppercase bg-navy text-white px-8 py-4 hover:bg-[#8A6A1B] transition-colors duration-200 shadow-md"
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
        <div className="h-px gold-line" />
      </div>

      {/* ── PARTE 2: Estela Mari Rojas ───────────────────────────────── */}
      <div className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-14 lg:mb-18">
            <div className="h-px w-10 bg-dorado" />
            <span className="eyebrow !text-[#8A6A1B]">
              La profesional detrás de Altum
            </span>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Pieza Editorial / Foto Oficial de Estela */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="relative w-full max-w-[380px] sm:max-w-[420px]"
              >
                {/* Card marco editorial sin hueco blanco al scrollear */}
                <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white shadow-[0_28px_64px_-20px_rgba(14,26,51,0.35)] border border-dorado/35">
                  <Image
                    src={fotoEstela}
                    alt={`${nombreEstela} - Martillera Colegiada ALTUM`}
                    fill
                    sizes="(max-width: 768px) 380px, 420px"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Badge flotante de matrícula */}
                <div className="mt-3.5 flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-dorado/30 shadow-sm text-xs">
                  <span className="font-body font-semibold text-navy tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Martillera Matriculada
                  </span>
                  <span className="font-mono text-[#8A6A1B] font-bold">
                    {matriculaEstela}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Contenido Editorial & Respaldo */}
            <div className="lg:col-span-7">
              <SlideInRight delay={0.1}>
                {/* Nombre + título */}
                <div className="mb-6">
                  <h2
                    className="font-display text-navy font-medium leading-[1.05] mb-2"
                    style={{
                      fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {nombreEstela.split(" ")[0]}{" "}
                    {nombreEstela.split(" ")[1] || ""}{" "}
                    <em className="not-italic italic text-[#A47C1B]">
                      {nombreEstela.split(" ").slice(2).join(" ") || "Rojas"}
                    </em>
                  </h2>
                  <p className="font-body text-navy/60 text-xs tracking-[0.2em] uppercase font-semibold">
                    {perfil?.titulo ||
                      "Martillera y Corredora Pública Colegiada"}{" "}
                    · ALTUM SCI
                  </p>
                </div>

                {/* Cita de confianza */}
                <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#FBF0CF]/35 border border-dorado/30">
                  <p className="font-display text-navy text-lg sm:text-xl font-medium leading-snug mb-1.5">
                    &ldquo;{fraseConfianza}&rdquo;
                  </p>
                  <p className="font-body text-navy/70 text-xs sm:text-sm leading-relaxed">
                    {subfraseConfianza}
                  </p>
                  <p className="mt-2 font-display italic text-[#8A6A1B] text-sm font-medium">
                    Tu confianza también es parte del trato.
                  </p>
                </div>

                {/* Credenciales */}
                <div className="space-y-3.5 mb-8">
                  {credenciales.map((c) => (
                    <div
                      key={c.label}
                      className="flex gap-4 group p-3 rounded-2xl bg-white/75 border border-navy/5 transition-colors hover:border-dorado/35 hover:bg-white"
                    >
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-[#FBF0CF]/60 border border-dorado/25 text-[#8A6A1B] group-hover:bg-dorado group-hover:text-tierra transition-colors duration-200">
                        {c.icon}
                      </div>
                      <div className="pt-0.5">
                        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-navy/45 mb-0.5">
                          {c.label}
                        </p>
                        <p className="font-body text-navy font-semibold text-[14px] mb-0.5">
                          {c.value}
                        </p>
                        <p className="font-body text-navy/60 text-[12px] leading-snug">
                          {c.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botón CTA directo con Estela */}
                <div className="pt-1">
                  <a
                    href={`https://wa.me/${whatsappEstela.replace(/\D/g, "")}?text=Hola%20Estela%20Mari%20Rojas%20(ALTUM%20SCI)%2C%20quisiera%20solicitar%20asesoramiento%20personalizado.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3.5 bg-navy hover:bg-[#8A6A1B] text-white rounded-full font-body font-semibold text-xs uppercase tracking-[0.15em] shadow-[0_12px_28px_-10px_rgba(14,26,51,0.5)] transition-all duration-200 group"
                  >
                    <span>Consultar directamente con Estela</span>
                    <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                </div>
              </SlideInRight>
            </div>
          </div>
        </div>
      </div>

      {/* ── Valores strip (GPU CSS) ──────────────────────────────────── */}
      <div className="border-t border-navy/10 overflow-hidden bg-white/50">
        <div className="marquee-track-slow">
          {[...valores, ...valores, ...valores, ...valores].map((v, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-6 px-8 py-4 whitespace-nowrap shrink-0"
            >
              <span className="font-display text-navy/45 font-medium italic text-xl">
                {v}
              </span>
              <span className="text-dorado/60 text-sm">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
