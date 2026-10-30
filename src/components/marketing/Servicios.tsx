"use client";

import {
  Building2,
  FileSignature,
  KeyRound,
  TrendingUp,
  ShieldCheck,
  Users,
  Globe2,
  LineChart,
} from "lucide-react";
import { motion } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

const WA = WHATSAPP_NUMBER;

const PROPUESTA_VALOR = [
  {
    num: "01",
    titulo: "Trato Directo con Titular",
    detalle: "Sin intermediarios ni franquicias masivas",
    Icon: Users,
  },
  {
    num: "02",
    titulo: "Auditoría Legal Previa",
    detalle: "Títulos, planos y libre deuda verificados",
    Icon: ShieldCheck,
  },
  {
    num: "03",
    titulo: "Operatoria 100% Remota",
    detalle: "Visitas por videollamada y gestión notarial",
    Icon: Globe2,
  },
  {
    num: "04",
    titulo: "Precios de Cierre Real",
    detalle: "Valuaciones basadas en escrituras efectivas",
    Icon: LineChart,
  },
];

const servicios = [
  {
    num: "01",
    tag: "Comercialización",
    titulo: "Compra y Venta de Activos",
    descripcion:
      "Comercialización estratégica de lotes frente al lago en Mari Menuco, residencias en Cipolletti y propiedades corporativas en la Patagonia.",
    entregables: [
      "Calificación de compradores e inversores",
      "Acompañamiento hasta la escritura traslativa",
    ],
    waText: "Hola%2C%20me%20interesa%20comprar%20o%20vender%20un%20inmueble",
  },
  {
    num: "02",
    tag: "Renta & Locaciones",
    titulo: "Gestión & Renta Corporativa",
    descripcion:
      "Administración integral de alquileres residenciales y petroleros: selección rigurosa de locatarios, liquidaciones puntuales y resguardo patrimonial.",
    entregables: [
      "Contratos corporativos en moneda dura",
      "Scoring crediticio y control de mantenimiento",
    ],
    waText:
      "Hola%2C%20me%20interesa%20la%20administraci%C3%B3n%20de%20alquiler",
  },
  {
    num: "03",
    tag: "Peritaje Oficial",
    titulo: "Consultoría & Tasaciones",
    descripcion:
      "Dictámenes de valor con validez notarial, judicial y bancaria basados en comparables reales de cierre en Neuquén y Río Negro.",
    entregables: [
      "Informe firmado por Martillera Mat. 35 RP 2026",
      "Análisis de plusvalía y factibilidad",
    ],
    waText:
      "Hola%2C%20me%20interesa%20una%20consultor%C3%ADa%20estrat%C3%A9gica",
  },
  {
    num: "04",
    tag: "Seguridad Jurídica",
    titulo: "Estructuración Legal & Contratos",
    descripcion:
      "Redacción y auditoría de boletos de compraventa, reservas, cesiones y contratos de locación bajo supervisión colegiada.",
    entregables: [
      "Auditoría de dominio e inhibiciones",
      "Coordinación directa con escribanía",
    ],
    waText: "Hola%2C%20me%20interesa%20la%20revisi%C3%B3n%20de%20un%20contrato",
  },
];

const PASOS_OPERACION = [
  {
    num: "01",
    titulo: "Diagnóstico & Perfil",
    desc: "Definimos tu objetivo patrimonial, horizonte de inversión o necesidad habitacional en una reunión directa con Estela.",
  },
  {
    num: "02",
    titulo: "Curaduría & Visita",
    desc: "Presentamos activos auditados con carpeta técnica completa y coordinamos recorrida presencial o virtual en vivo.",
  },
  {
    num: "03",
    titulo: "Estructuración & Cierre",
    desc: "Instrumentamos reserva, boleto o contrato y supervisamos cada instancia notarial hasta la entrega de posesión.",
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
          .map((s, idx) => {
            const base = servicios[idx % servicios.length];
            return {
              ...base,
              num: String(idx + 1).padStart(2, "0"),
              titulo: s.titulo,
              descripcion: s.descripcion,
              waText: encodeURIComponent(
                `Hola Estela, me interesa consultar por el servicio de ${s.titulo}`,
              ),
            };
          })
      : servicios;

  const handleSpotlightMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      className="py-20 lg:py-28 bg-white border-y border-navy/[0.06] overflow-hidden"
      id="propuesta-servicios"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* ── 1. Cabecera: Propuesta de Valor Integral (Estilo se7endev) ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 pb-7 border-b border-navy/10">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="rd-label !text-[10px] text-navy/40">[03]</span>
              <div className="h-px w-8 bg-dorado" />
              <span className="rd-label !text-[10px] !tracking-[0.24em] text-[#8A6A1B]">
                Propuesta de Valor &amp; Servicios Integrales
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="rd-display text-navy"
              style={{
                fontSize: "clamp(2.35rem, 4.4vw, 3.85rem)",
              }}
            >
              Gestión inmobiliaria de{" "}
              <em className="rd-serif text-[#A47C1B]">
                extremo a extremo.
              </em>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="font-body text-navy/65 text-sm lg:text-base leading-relaxed max-w-md"
          >
            Combinamos inteligencia territorial en Neuquén y Río Negro con el
            respaldo jurídico directo de una firma matriculada.
          </motion.p>
        </div>

        {/* ── 2. Tira de los 4 Pilares de Valor (Grilla Hairline Editorial) ── */}
        <div className="rounded-[1.65rem] bg-[#F6F8FB] border border-navy/10 overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-navy/10 mb-12">
          {PROPUESTA_VALOR.map((item, i) => {
            const Icon = item.Icon;
            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="p-6 flex flex-col justify-between hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="rd-label !text-[10px] !tracking-[0.2em] text-[#8A6A1B]">
                    [PILAR {item.num}]
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-navy/10 text-[#8A6A1B]">
                    <Icon className="w-4 h-4" strokeWidth={1.7} />
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold tracking-tight text-navy leading-snug">
                    {item.titulo}
                  </h3>
                  <p className="font-body text-xs text-navy/60 mt-1 leading-relaxed">
                    {item.detalle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── 3. Grilla Arquitectónica 2x2 de Servicios con Spotlight ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mb-14">
          {listaServicios.map((s, i) => {
            const Icon = ICONOS[i % ICONOS.length];
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: (i % 2) * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseMove={handleSpotlightMove}
                className="group relative overflow-hidden rounded-[1.85rem] p-7 lg:p-9 bg-[#F6F8FB] hover:bg-white border border-navy/10 hover:border-dorado/60 shadow-[0_14px_34px_-24px_rgba(14,26,51,0.14)] hover:shadow-[0_26px_54px_-24px_rgba(14,26,51,0.24)] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Spotlight interactivo en GPU */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), rgba(201,168,76,0.13), transparent 65%)",
                  }}
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-navy/10">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white border border-navy/10 text-navy group-hover:bg-[#0B1528] group-hover:text-dorado transition-colors">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 border border-navy/10 rd-label !text-[9.5px] !tracking-[0.18em] text-[#8A6A1B]">
                      <span>[{s.num}]</span>
                      <span>·</span>
                      <span>{s.tag}</span>
                    </span>
                  </div>

                  <h3 className="font-display font-medium tracking-tight text-navy text-xl lg:text-2xl leading-snug mb-2.5">
                    {s.titulo}
                  </h3>

                  <p className="font-body text-sm leading-relaxed text-navy/65 mb-5">
                    {s.descripcion}
                  </p>

                  {s.entregables && (
                    <div className="space-y-1.5 mb-6 pt-4 border-t border-navy/10">
                      {s.entregables.map((ent) => (
                        <div
                          key={ent}
                          className="flex items-center gap-2 text-xs font-body text-navy/75"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-dorado shrink-0" />
                          <span>{ent}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative z-10 pt-4 border-t border-navy/10 flex items-center justify-between">
                  <a
                    href={`https://wa.me/${WA}?text=${s.waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rd-btn bg-[#0B1528] group-hover:bg-dorado text-white group-hover:text-tierra rd-label !text-[9.5px] !tracking-[0.16em] pl-4 pr-1.5 py-1.5 transition-colors"
                  >
                    <span className="rd-roll" data-text="Solicitar Asesoría">
                      <span>Solicitar Asesoría</span>
                    </span>
                    <span className="rd-btn__icon w-6 h-6 bg-dorado group-hover:bg-[#0B1528] text-tierra group-hover:text-dorado">
                      ↗
                    </span>
                  </a>
                  <span className="rd-label !text-[9.5px] !tracking-[0.16em] text-navy/45">
                    Mat. 35 RP 2026
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── 4. Metodología en 3 Pasos + Video Institucional en Bloque Ejecutivo ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="rounded-[2.25rem] bg-[#070E1B] text-white border border-white/10 p-6 sm:p-10 lg:p-12 shadow-[0_26px_64px_-28px_rgba(7,14,27,0.55)]"
        >
          {/* Los 3 pasos de operación */}
          <div className="mb-10 pb-10 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
              <div>
                <span className="rd-label !text-[10px] !tracking-[0.22em] text-dorado block mb-2">
                  [PROTOCOLO DE EJECUCIÓN · ALTUM SCI]
                </span>
                <h3 className="rd-display text-2xl sm:text-3xl text-white">
                  Tu operación inmobiliaria en{" "}
                  <em className="rd-serif text-dorado">
                    3 etapas claras
                  </em>
                </h3>
              </div>
              <span className="rd-label !text-[10px] !tracking-[0.18em] text-white/50">
                100% Trazabilidad Documental
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              {PASOS_OPERACION.map((paso, idx) => (
                <motion.div
                  key={paso.num}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="rd-condensed text-3xl text-dorado">
                      {paso.num}
                    </span>
                    <span className="rd-label !text-[9.5px] !tracking-[0.18em] text-white/40">
                      [ETAPA 0{idx + 1}]
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-medium tracking-tight text-white mb-1.5">
                    {paso.titulo}
                  </h4>
                  <p className="font-body text-xs text-white/65 leading-relaxed">
                    {paso.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Video Institucional */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-7">
            <div>
              <span className="rd-label !text-[10px] !tracking-[0.22em] text-dorado block mb-1.5">
                Presentación Audiovisual · Estudio ALTUM
              </span>
              <h3 className="rd-display text-xl sm:text-2xl text-white">
                Conocé por dentro el estándar de{" "}
                <em className="rd-serif text-dorado">ALTUM SCI</em>
              </h3>
            </div>
            <a
              href={`https://wa.me/${WA}?text=Vi%20su%20presentaci%C3%B3n%20institucional%20y%20quiero%20consultar`}
              target="_blank"
              rel="noopener noreferrer"
              className="rd-btn self-start lg:self-auto bg-dorado hover:bg-dorado-light text-tierra rd-label !text-[10px] !tracking-[0.16em] pl-5 pr-2 py-2"
            >
              <span className="rd-roll" data-text="Coordinar Reunión">
                <span>Coordinar Reunión</span>
              </span>
              <span className="rd-btn__icon w-7 h-7 bg-[#070E1B] text-dorado">
                ↗
              </span>
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
