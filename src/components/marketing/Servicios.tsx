"use client";

import {
  ArrowRight,
  Building2,
  FileSignature,
  KeyRound,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

const WA = WHATSAPP_NUMBER;

const servicios = [
  {
    num: "01",
    titulo: "Compra y Venta de Activos",
    descripcion:
      "Comercialización estratégica de lotes frente al lago en Mari Menuco, residencias en Cipolletti y propiedades corporativas en la Patagonia.",
    waText: "Hola%2C%20me%20interesa%20comprar%20o%20vender%20un%20inmueble",
  },
  {
    num: "02",
    titulo: "Gestión & Renta Corporativa",
    descripcion:
      "Administración integral de alquileres residenciales y petroleros: selección rigurosa de locatarios, liquidaciones puntuales y resguardo patrimonial.",
    waText:
      "Hola%2C%20me%20interesa%20la%20administraci%C3%B3n%20de%20alquiler",
  },
  {
    num: "03",
    titulo: "Consultoría & Tasaciones",
    descripcion:
      "Dictámenes de valor con validez notarial, judicial y bancaria basados en comparables reales de cierre en Neuquén y Río Negro.",
    waText:
      "Hola%2C%20me%20interesa%20una%20consultor%C3%ADa%20estrat%C3%A9gica",
  },
  {
    num: "04",
    titulo: "Estructuración Legal & Contratos",
    descripcion:
      "Redacción y auditoría de boletos de compraventa, reservas, fideicomisos y contratos de locación bajo supervisión de Martillera Colegiada.",
    waText: "Hola%2C%20me%20interesa%20la%20revisi%C3%B3n%20de%20un%20contrato",
  },
];

const ICONOS = [Building2, KeyRound, TrendingUp, FileSignature];

export interface ServicioProp {
  id?: string;
  titulo: string;
  descripcion: string;
  activo?: boolean;
}

export default function Servicios({
  serviciosCustom,
}: {
  serviciosCustom?: ServicioProp[];
}) {
  const listaServicios =
    serviciosCustom &&
    serviciosCustom.filter((s) => s.activo !== false).length > 0
      ? serviciosCustom
          .filter((s) => s.activo !== false)
          .map((s, idx) => ({
            num: String(idx + 1).padStart(2, "0"),
            titulo: s.titulo,
            descripcion: s.descripcion,
            waText: encodeURIComponent(
              `Hola Estela, me interesa consultar por el servicio de ${s.titulo}`,
            ),
          }))
      : servicios;

  return (
    <section className="py-24 lg:py-32 bg-[#F6F8FB]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Minimalista */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-navy/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-dorado" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8A6A1B] font-semibold">
                Áreas de Práctica
              </span>
            </div>
            <h2
              className="font-display font-medium text-navy leading-[1.03]"
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Servicios de{" "}
              <em className="not-italic italic text-[#A47C1B]">
                alta precisión.
              </em>
            </h2>
          </div>

          <p className="font-body text-navy/60 text-sm lg:text-base leading-relaxed max-w-md">
            Cuatro verticales diseñadas para estructurar, proteger y potenciar
            cada operación inmobiliaria en Neuquén y Río Negro.
          </p>
        </div>

        {/* Grilla Arquitectónica 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mb-20">
          {listaServicios.map((s, i) => {
            const Icon = ICONOS[i % ICONOS.length];
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
                className="group relative rounded-3xl p-8 lg:p-10 bg-white border border-navy/[0.08] hover:border-dorado/60 shadow-[0_14px_34px_-22px_rgba(14,26,51,0.16)] hover:shadow-[0_24px_48px_-24px_rgba(14,26,51,0.26)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-7">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6F8FB] border border-navy/[0.07] text-navy group-hover:bg-[#0B1528] group-hover:text-dorado transition-colors">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <span className="font-mono text-xs text-navy/35 font-semibold tracking-[0.2em]">
                      {s.num}
                    </span>
                  </div>

                  <h3 className="font-display font-medium text-navy text-xl lg:text-2xl leading-snug mb-3">
                    {s.titulo}
                  </h3>

                  <p className="font-body text-sm leading-relaxed text-navy/60 mb-7">
                    {s.descripcion}
                  </p>
                </div>

                <div className="pt-5 border-t border-navy/[0.07] flex items-center justify-between">
                  <a
                    href={`https://wa.me/${WA}?text=${s.waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-navy group-hover:text-[#8A6A1B] font-semibold transition-colors"
                  >
                    <span>Solicitar Asesoría</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                  <span className="font-mono text-[10px] text-navy/35 uppercase">
                    Mat. 35 RP 2026
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Presentación Audiovisual Minimalista */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-80px" }}
          className="rounded-[2.25rem] bg-white border border-navy/[0.08] p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_-30px_rgba(14,26,51,0.16)]"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#8A6A1B] font-semibold block mb-2">
                Recorrido Audiovisual
              </span>
              <h3
                className="font-display font-medium text-navy leading-tight"
                style={{
                  fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Conocé el estándar de trabajo{" "}
                <em className="not-italic italic text-[#A47C1B]">ALTUM SCI</em>
              </h3>
            </div>
            <a
              href={`https://wa.me/${WA}?text=Vi%20su%20presentaci%C3%B3n%20institucional%20y%20quiero%20consultar`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 self-start lg:self-auto rounded-full bg-[#0B1528] hover:bg-dorado text-white hover:text-tierra font-body text-[11px] tracking-[0.15em] font-semibold uppercase px-6 py-3 transition-colors"
            >
              <span>Coordinar Reunión</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="flex justify-center">
            <VideoPlayer
              src="/videos/ALTUMSCI.mp4"
              poster="/videos/altumsci-poster.jpg"
              title="Servicios Altum"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
