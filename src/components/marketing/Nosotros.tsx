"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Award } from "lucide-react";

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
    "Revisar la documentación, dejar los acuerdos por escrito y contar con asesoramiento profesional colegiado en cada etapa.";

  const pilares = [
    {
      Icon: Award,
      label: "Matrícula Oficial",
      value: matriculaEstela,
      sub: colegioEstela,
    },
    {
      Icon: MapPin,
      label: "Cobertura Estratégica",
      value: coberturaEstela,
      sub: "Alto Valle de Río Negro & Neuquén · Patagonia",
    },
    {
      Icon: ShieldCheck,
      label: "Trato Directo & Legal",
      value: "Compra-Venta · Tasaciones · Loteos · Contratos",
      sub: "Sin intermediarios ni franquicias masivas",
    },
  ];

  return (
    <section className="py-16 lg:py-22 bg-[#F6F8FB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="rounded-[2.25rem] bg-white border border-navy/10 p-7 sm:p-10 lg:p-14 shadow-[0_20px_50px_-30px_rgba(14,26,51,0.14)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Columna Izquierda: Retrato Oficial de Estela + Sello Rotatorio se7endev */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-[360px] relative"
              >
                <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-navy/5 border border-navy/10 shadow-md">
                  <Image
                    src={fotoEstela}
                    alt={`${nombreEstela} - Martillera Colegiada ALTUM`}
                    fill
                    sizes="(max-width: 768px) 340px, 380px"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Sello circular rotatorio estilo se7endev */}
                <div
                  className="hidden sm:flex absolute -top-5 -right-5 w-24 h-24 rounded-full bg-[#070E1B] border border-dorado/40 shadow-xl items-center justify-center pointer-events-none"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="w-20 h-20 rd-spin text-dorado"
                  >
                    <defs>
                      <path
                        id="estela-seal-circle"
                        d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                      />
                    </defs>
                    <text
                      fill="currentColor"
                      fontSize="8.3"
                      letterSpacing="2.1"
                      fontFamily="var(--font-mono)"
                    >
                      <textPath href="#estela-seal-circle">
                        MAT. 35 RP 2026 · FIRMA COLEGIADA ·
                      </textPath>
                    </text>
                  </svg>
                  <span className="absolute w-2.5 h-2.5 rounded-full bg-dorado" />
                </div>

                <div className="mt-3 flex items-center justify-between px-4 py-2.5 bg-[#F6F8FB] rounded-2xl border border-navy/10">
                  <span className="rd-label !text-[10px] !tracking-[0.16em] text-navy flex items-center gap-2">
                    <span className="rd-ping" />
                    Martillera Matriculada
                  </span>
                  <span className="rd-label !text-[10px] !tracking-[0.16em] text-[#8A6A1B]">
                    {matriculaEstela}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Columna Derecha: Perfil Ejecutivo & Servicios Clave */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="rd-label !text-[10px] text-navy/40">[07]</span>
                  <div className="h-px w-8 bg-dorado" />
                  <span className="rd-label !text-[10px] !tracking-[0.22em] text-[#8A6A1B]">
                    Dirección Profesional · ALTUM SCI
                  </span>
                </div>

                <h2
                  className="rd-display text-navy"
                  style={{
                    fontSize: "clamp(2.2rem, 3.9vw, 3.25rem)",
                  }}
                >
                  {nombreEstela.split(" ")[0]}{" "}
                  {nombreEstela.split(" ")[1] || ""}{" "}
                  <em className="rd-serif text-[#A47C1B]">
                    {nombreEstela.split(" ").slice(2).join(" ") || "Rojas"}
                  </em>
                </h2>
                <p className="rd-label !text-[10.5px] !tracking-[0.18em] text-navy/55 mt-1.5">
                  {perfil?.titulo || "Martillera y Corredora Pública Colegiada"}
                </p>
              </div>

              {/* Frase de respaldo */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="p-5 rounded-2xl bg-[#F6F8FB] border border-navy/10"
              >
                <p className="font-display text-navy text-base sm:text-lg font-medium tracking-tight leading-snug">
                  &ldquo;{fraseConfianza}&rdquo;
                </p>
                <p className="font-body text-navy/65 text-xs sm:text-sm leading-relaxed mt-1">
                  {subfraseConfianza}
                </p>
              </motion.div>

              {/* 3 Pilares con Grilla Hairline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-navy/10 rounded-2xl border border-navy/10 bg-[#F6F8FB]/70 overflow-hidden">
                {pilares.map(({ Icon, label, value, sub }, idx) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.12 + idx * 0.07 }}
                    className="group p-4 hover:bg-white transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-4 h-4 text-[#8A6A1B] group-hover:scale-110 transition-transform" />
                      <span className="rd-label !text-[9px] !tracking-[0.16em] text-navy/45">
                        {label}
                      </span>
                    </div>
                    <p className="font-display text-xs font-semibold text-navy leading-snug">
                      {value}
                    </p>
                    <p className="font-body text-[11px] text-navy/55 mt-0.5 leading-snug">
                      {sub}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Acciones con botones se7endev */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${whatsappEstela.replace(/\D/g, "")}?text=Hola%20Estela%20Mari%20Rojas%20(ALTUM%20SCI)%2C%20quisiera%20solicitar%20asesoramiento%20personalizado.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rd-btn bg-[#0B1528] hover:bg-dorado text-white hover:text-tierra rd-label !text-[10px] !tracking-[0.16em] pl-5 pr-2 py-2 shadow-sm"
                >
                  <span className="rd-roll" data-text="Hablar con Estela">
                    <span>Hablar con Estela</span>
                  </span>
                  <span className="rd-btn__icon w-7 h-7 bg-dorado text-tierra">
                    ↗
                  </span>
                </a>
                <Link
                  href="/servicios"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-navy/15 text-navy hover:border-navy rd-label !text-[10px] !tracking-[0.16em] transition-colors"
                >
                  <span>Ver Servicios</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
