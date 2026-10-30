"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Award, ArrowRight } from "lucide-react";

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
        <div className="rounded-[2.25rem] bg-white border border-navy/[0.08] p-7 sm:p-10 lg:p-14 shadow-[0_20px_50px_-30px_rgba(14,26,51,0.14)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Columna Izquierda: Retrato Oficial de Estela */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-[360px]"
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

                <div className="mt-3 flex items-center justify-between px-4 py-2.5 bg-[#F6F8FB] rounded-2xl border border-navy/[0.08] text-xs">
                  <span className="font-body font-semibold text-navy flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Martillera Matriculada
                  </span>
                  <span className="font-mono text-[#8A6A1B] font-bold">
                    {matriculaEstela}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Columna Derecha: Perfil Ejecutivo & Servicios Clave */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6F8FB] border border-navy/10 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-dorado" />
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8A6A1B] font-semibold">
                    Dirección Profesional · ALTUM SCI
                  </span>
                </div>

                <h2
                  className="font-display text-navy font-medium leading-[1.04]"
                  style={{
                    fontSize: "clamp(2.1rem, 3.8vw, 3.1rem)",
                    letterSpacing: "-0.025em",
                  }}
                >
                  {nombreEstela.split(" ")[0]}{" "}
                  {nombreEstela.split(" ")[1] || ""}{" "}
                  <em className="not-italic italic text-[#A47C1B]">
                    {nombreEstela.split(" ").slice(2).join(" ") || "Rojas"}
                  </em>
                </h2>
                <p className="font-mono text-navy/55 text-[11px] tracking-[0.16em] uppercase mt-1">
                  {perfil?.titulo || "Martillera y Corredora Pública Colegiada"}
                </p>
              </div>

              {/* Frase de respaldo */}
              <div className="p-4 rounded-2xl bg-[#F6F8FB] border border-navy/[0.07]">
                <p className="font-display text-navy text-base sm:text-lg font-medium leading-snug">
                  &ldquo;{fraseConfianza}&rdquo;
                </p>
                <p className="font-body text-navy/65 text-xs sm:text-sm leading-relaxed mt-1">
                  {subfraseConfianza}
                </p>
              </div>

              {/* 3 Pilares */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {pilares.map(({ Icon, label, value, sub }) => (
                  <div
                    key={label}
                    className="p-3.5 rounded-2xl bg-[#F6F8FB]/70 border border-navy/[0.07]"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-4 h-4 text-[#8A6A1B]" />
                      <span className="font-mono text-[9.5px] uppercase tracking-wider text-navy/45">
                        {label}
                      </span>
                    </div>
                    <p className="font-body text-xs font-semibold text-navy leading-snug">
                      {value}
                    </p>
                    <p className="font-body text-[11px] text-navy/55 mt-0.5 leading-snug">
                      {sub}
                    </p>
                  </div>
                ))}
              </div>

              {/* Acciones */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${whatsappEstela.replace(/\D/g, "")}?text=Hola%20Estela%20Mari%20Rojas%20(ALTUM%20SCI)%2C%20quisiera%20solicitar%20asesoramiento%20personalizado.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#0B1528] hover:bg-dorado text-white hover:text-tierra rounded-full font-body font-semibold text-xs uppercase tracking-[0.15em] transition-all shadow-sm"
                >
                  <span>Hablar con Estela</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <Link
                  href="/servicios"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-navy/15 text-navy hover:border-navy font-body text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
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
