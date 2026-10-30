"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { BandaLagoConfig } from "@/lib/site-config-types";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { guardarLeadAltum } from "@/app/actions/leads-altum";

const PUNTOS = [
  "Frente al lago con bajada náutica",
  "Agua y energía en el lote",
  "Escrituración con martillera colegiada",
];

interface SectorMasterplan {
  id: string;
  codigo: string;
  nombre: string;
  estado: "Disponible" | "Últimos Lotes" | "Preventa Activa";
  superficie: string;
  precioRef: string;
  lotesDisponibles: number;
  descripcion: string;
  servicios: string[];
  coords: { x: number; y: number };
}

const SECTORES_BAHIA: SectorMasterplan[] = [
  {
    id: "costa-lago",
    codigo: "Sector A",
    nombre: "Primera Línea de Costa",
    estado: "Últimos Lotes",
    superficie: "850 – 1.000 m²",
    precioRef: "Desde USD 48.000",
    lotesDisponibles: 4,
    descripcion:
      "Ubicación privilegiada sobre la ribera del Lago Mari Menuco, con acceso directo a la playa y bajada náutica exclusiva.",
    servicios: [
      "Frente directo al lago",
      "Bajada náutica privada",
      "Tendido de agua y energía",
      "Seguridad 24 hs",
    ],
    coords: { x: 68, y: 34 },
  },
  {
    id: "terrazas-panoramicas",
    codigo: "Sector B",
    nombre: "Terrazas Panorámicas",
    estado: "Disponible",
    superficie: "750 – 900 m²",
    precioRef: "Desde USD 36.000",
    lotesDisponibles: 9,
    descripcion:
      "Lotes emplazados sobre una terraza natural sobreelevada que asegura visuales despejadas de 180° hacia el espejo de agua.",
    servicios: [
      "Vista panorámica asegurada",
      "Red eléctrica y agua potable",
      "Calles consolidadas",
      "Aptitud constructiva inmediata",
    ],
    coords: { x: 48, y: 48 },
  },
  {
    id: "entorno-wakepark",
    codigo: "Sector C",
    nombre: "Entorno WakePark",
    estado: "Disponible",
    superficie: "750 – 850 m²",
    precioRef: "Desde USD 34.000",
    lotesDisponibles: 11,
    descripcion:
      "Sector contiguo al área deportiva y al proyecto aprobado de WakePark, ideal para perfil joven, deportivo y renta temporaria.",
    servicios: [
      "Contiguo al WakePark proyectado",
      "Alta demanda de alquiler temporario",
      "Agua y luz en puerta de lote",
      "Acceso rápido a sector náutico",
    ],
    coords: { x: 74, y: 66 },
  },
  {
    id: "rincon-clubhouse",
    codigo: "Sector D",
    nombre: "Rincón Club House",
    estado: "Preventa Activa",
    superficie: "750 – 850 m²",
    precioRef: "Desde USD 32.000",
    lotesDisponibles: 14,
    descripcion:
      "El ticket de ingreso más competitivo de Bahía de las Playas, próximo al pórtico de acceso controlado y al futuro Club House social.",
    servicios: [
      "Valor de preventa con alta plusvalía",
      "Cercanía al Club House y pórtico",
      "Financiación personalizada",
      "Supervisión notarial Mat. 35 RP 2026",
    ],
    coords: { x: 28, y: 68 },
  },
];

export default function BandaLago({ config }: { config?: BandaLagoConfig }) {
  const etiqueta = config?.etiqueta || "Mari Menuco · Neuquén";
  const precioDesde = config?.precioDesde || "Desde USD 32.000";
  const titulo = config?.titulo || "Tu lote,";
  const tituloCursiva = config?.tituloCursiva || "frente al lago";
  const superficieRef = config?.superficieRef || "750–1000 m²";
  const distanciaRef = config?.distanciaRef || "65 km";

  const [sectorActivo, setSectorActivo] = useState<SectorMasterplan>(
    SECTORES_BAHIA[0],
  );
  const [modalVisita, setModalVisita] = useState(false);
  const [nombreVisita, setNombreVisita] = useState("");
  const [telefonoVisita, setTelefonoVisita] = useState("");
  const [fechaVisita, setFechaVisita] = useState("");
  const [horaVisita, setHoraVisita] = useState("11:00");
  const [enviando, setEnviando] = useState(false);
  const [enviadoOk, setEnviadoOk] = useState(false);

  const handleAgendarVisitaLago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreVisita.trim() || !telefonoVisita.trim()) return;
    setEnviando(true);
    await guardarLeadAltum({
      nombre: nombreVisita.trim(),
      telefono: telefonoVisita.trim(),
      tipo_consulta: "inversion",
      origen: "masterplan-lago",
      mensaje: `Solicitud de plano y visita a Bahía de las Playas (Mari Menuco) · ${sectorActivo.codigo}: ${sectorActivo.nombre} (${sectorActivo.precioRef}).${fechaVisita ? ` Fecha preferida: ${fechaVisita} a las ${horaVisita} hs.` : ""}`,
      detalle: {
        zona: "Mari Menuco · Bahía de las Playas",
        sector: `${sectorActivo.codigo} - ${sectorActivo.nombre}`,
        precio_ref: sectorActivo.precioRef,
        ...(fechaVisita ? { fecha_visita: fechaVisita, hora_visita: horaVisita } : {}),
      },
    });
    setEnviando(false);
    setEnviadoOk(true);

    const textoWa = `Hola Estela (ALTUM SCI), me interesa recibir el plano de lotes disponibles en Bahía de las Playas (Mari Menuco) · *${sectorActivo.codigo}: ${sectorActivo.nombre}* (${sectorActivo.precioRef}).${
      fechaVisita
        ? `\nMe gustaría coordinar una visita para el día ${fechaVisita} alrededor de las ${horaVisita} hs.`
        : ""
    }\nMi nombre es ${nombreVisita.trim()}.`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textoWa)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <section className="relative bg-[#F6F8FB] px-4 lg:px-8 py-10 lg:py-16">
      {/* Banner Principal de Mari Menuco */}
      <div className="relative h-[78vh] min-h-[560px] max-w-[1400px] mx-auto overflow-hidden rounded-[2rem] lg:rounded-[3rem] shadow-[0_30px_70px_-30px_rgba(14,26,51,0.45)] border border-dorado/25">
        <Image
          src="/mari-menuco/bahia-playas-2.jpg"
          alt="Costa del lago Mari Menuco con sombrilla de paja"
          fill
          sizes="(max-width: 1440px) 100vw, 1400px"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-navy-950/15 to-navy-950/25" />

        {/* Badge superior izquierdo sobre la foto */}
        <div className="absolute top-6 left-6 lg:top-10 lg:left-10 z-10 hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-navy-950/80 border border-white/20 text-white font-body text-[11px] tracking-[0.16em] uppercase shadow-md">
          <span className="w-2 h-2 rounded-full bg-dorado animate-pulse" />
          <span>Bahía de las Playas · Lago Mari Menuco</span>
        </div>

        <div className="relative h-full px-5 lg:px-14 flex items-end lg:items-center justify-center lg:justify-end pb-5 lg:pb-0">
          <div className="w-full max-w-md">
            <motion.div
              className="w-full rounded-[2rem] border border-dorado/35 bg-white/95 shadow-[0_28px_64px_-22px_rgba(14,26,51,0.55)] p-6 sm:p-8 lg:p-9"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between gap-2 mb-5">
                <span className="inline-flex items-center rounded-full bg-[#FBF0CF] text-[#7A5A12] font-body text-[11px] font-semibold tracking-[0.14em] uppercase px-3.5 py-1.5">
                  {etiqueta}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-navy/60 font-semibold">
                  {precioDesde}
                </span>
              </div>
              <h2
                className="font-display font-medium text-navy leading-[1.04] mb-4"
                style={{
                  fontSize: "clamp(2.2rem, 4.4vw, 3.4rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                {titulo}{" "}
                <em className="not-italic italic text-[#A47C1B]">
                  {tituloCursiva}
                </em>
              </h2>

              {/* Mini indicadores clave */}
              <div className="grid grid-cols-3 gap-2 mb-5 py-3 border-y border-navy/10 text-center">
                <div>
                  <span className="block font-display text-base font-bold text-navy">
                    {superficieRef}
                  </span>
                  <span className="block font-body text-[9px] uppercase tracking-wider text-navy/55">
                    Superficie
                  </span>
                </div>
                <div className="border-x border-navy/10">
                  <span className="block font-display text-base font-bold text-navy">
                    {distanciaRef}
                  </span>
                  <span className="block font-body text-[9px] uppercase tracking-wider text-navy/55">
                    De Neuquén
                  </span>
                </div>
                <div>
                  <span className="block font-display text-base font-bold text-[#8A6A1B]">
                    100%
                  </span>
                  <span className="block font-body text-[9px] uppercase tracking-wider text-navy/55">
                    Con Servicios
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-7">
                {PUNTOS.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-3 font-body text-navy/80 text-[14px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-dorado shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href="#masterplan-bahia"
                  className="btn-shimmer flex-1 inline-flex items-center justify-center gap-2.5 rounded-full font-body text-tierra text-[11px] tracking-[0.16em] font-semibold uppercase px-6 py-3.5 shadow-md"
                >
                  Explorar Sectores &amp; Lotes
                  <span aria-hidden="true">↓</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setEnviadoOk(false);
                    setModalVisita(true);
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-navy/15 bg-white hover:border-dorado px-4 py-3.5 font-body text-[11px] font-semibold uppercase tracking-wider text-navy hover:text-[#8A6A1B] transition-colors"
                >
                  Agendar Visita
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Masterplan Interactivo de Sectores — Bahía de las Playas */}
      <div
        id="masterplan-bahia"
        className="max-w-[1400px] mx-auto mt-8 rounded-[2rem] lg:rounded-[2.5rem] bg-white border border-dorado/25 p-6 sm:p-8 lg:p-10 shadow-[0_24px_60px_-30px_rgba(14,26,51,0.28)]"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 mb-6 border-b border-navy/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-dorado" />
              <span className="font-body text-[10px] tracking-[0.24em] uppercase font-semibold text-[#8A6A1B]">
                Masterplan Interactivo · Bahía de las Playas
              </span>
            </div>
            <h3 className="font-display text-2xl lg:text-3xl text-navy font-medium">
              Seleccioná un sector del barrio para ver{" "}
              <em className="not-italic italic text-[#A47C1B]">
                disponibilidad y valores
              </em>
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-body text-navy/65">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Agua y Luz en lote
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF0CF] text-[#7A5A12] border border-dorado/30 font-medium">
              ✦ WakePark &amp; Club House proyectados
            </span>
          </div>
        </div>

        {/* Selector de los 4 Sectores */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {SECTORES_BAHIA.map((sec) => {
            const activo = sec.id === sectorActivo.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSectorActivo(sec)}
                className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${
                  activo
                    ? "border-dorado bg-[#FBF0CF]/35 shadow-md"
                    : "border-navy/10 bg-[#F6F8FB] hover:border-dorado/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8A6A1B]">
                    {sec.codigo}
                  </span>
                  <span
                    className={`text-[9px] font-body font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      sec.estado === "Últimos Lotes"
                        ? "bg-amber-100 text-amber-800"
                        : sec.estado === "Preventa Activa"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {sec.estado}
                  </span>
                </div>
                <p className="font-display text-base font-semibold text-navy leading-snug">
                  {sec.nombre}
                </p>
                <p className="font-mono text-xs text-navy/65 mt-1">
                  {sec.precioRef} · {sec.superficie}
                </p>
              </button>
            );
          })}
        </div>

        {/* Panel Esquemático + Detalle del Sector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Mapa Esquemático Interactivo de la Costa */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-[#0D1A2D] border border-navy/15 min-h-[290px] sm:min-h-[340px] flex flex-col justify-between p-5">
            <svg
              viewBox="0 0 600 320"
              className="absolute inset-0 w-full h-full object-cover"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="lagoWater" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0F3556" />
                  <stop offset="100%" stopColor="#092238" />
                </linearGradient>
                <linearGradient id="costaArena" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#172A45" />
                  <stop offset="100%" stopColor="#0D1A2D" />
                </linearGradient>
              </defs>

              {/* Tierra / Meseta */}
              <rect width="600" height="320" fill="url(#costaArena)" />

              {/* Espejo de Agua Lago Mari Menuco (Norte/Este) */}
              <path
                d="M 180 0 C 230 65, 320 95, 430 115 C 510 130, 560 175, 600 210 L 600 0 Z"
                fill="url(#lagoWater)"
              />
              {/* Línea de ribera dorada */}
              <path
                d="M 180 0 C 230 65, 320 95, 430 115 C 510 130, 560 175, 600 210"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="2.5"
                strokeDasharray="5 4"
              />

              {/* Calles internas del barrio */}
              <path
                d="M 60 280 Q 190 210 310 165 T 510 195"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1.5"
              />
              <path
                d="M 140 295 Q 250 185 385 125"
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1.5"
              />
              <path
                d="M 90 160 Q 260 140 460 245"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.2"
              />

              {/* Etiqueta Lago */}
              <text
                x="430"
                y="55"
                fill="#7CC4FA"
                fontSize="12"
                fontWeight="600"
                letterSpacing="3"
                opacity="0.85"
              >
                LAGO MARI MENUCO
              </text>
              <text
                x="430"
                y="72"
                fill="#7CC4FA"
                fontSize="9"
                letterSpacing="1.5"
                opacity="0.6"
              >
                BAHÍA DE LAS PLAYAS · BAJADA NÁUTICA
              </text>
            </svg>

            {/* Nodos interactivos de los 4 sectores sobre el plano */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-950/85 border border-white/15 text-[10px] font-mono uppercase tracking-wider text-white/85">
                Plano Zonificado · Hacé clic en cada sector
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] text-dorado bg-navy-950/80 px-2.5 py-1 rounded-full border border-dorado/30">
                {sectorActivo.lotesDisponibles} lotes disponibles en {sectorActivo.codigo}
              </span>
            </div>

            <div className="relative z-10 h-44 sm:h-52 w-full">
              {SECTORES_BAHIA.map((sec) => {
                const isSelected = sec.id === sectorActivo.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSectorActivo(sec)}
                    style={{
                      left: `${sec.coords.x}%`,
                      top: `${sec.coords.y}%`,
                    }}
                    className={`-translate-x-1/2 -translate-y-1/2 absolute group flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                      isSelected
                        ? "bg-dorado text-tierra border-white font-bold scale-110 shadow-[0_0_25px_rgba(201,168,76,0.7)] z-20"
                        : "bg-navy-950/85 text-white border-dorado/40 hover:border-dorado hover:scale-105 z-10"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? "bg-tierra" : "bg-dorado"
                      }`}
                    />
                    <span className="font-mono text-[10px] tracking-wider uppercase whitespace-nowrap">
                      {sec.codigo} · {sec.nombre.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-[10px] font-body text-white/70">
              <span>⚓ Bajada Náutica Directa</span>
              <span>🏄 Laguna WakePark</span>
              <span>🏛️ Futuro Club House</span>
              <span>⚡ Agua y Luz en lote</span>
            </div>
          </div>

          {/* Ficha del Sector Seleccionado */}
          <div className="lg:col-span-5 rounded-2xl bg-[#F6F8FB] border border-navy/10 p-6 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={sectorActivo.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#8A6A1B] font-bold">
                    {sectorActivo.codigo} · Bahía de las Playas
                  </span>
                  <span className="font-mono text-xs font-semibold text-navy bg-white px-3 py-1 rounded-full border border-navy/10">
                    {sectorActivo.lotesDisponibles} lotes disponibles
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-2xl text-navy font-semibold">
                    {sectorActivo.nombre}
                  </h4>
                  <p className="font-display text-xl text-[#8A6A1B] font-semibold mt-1">
                    {sectorActivo.precioRef}{" "}
                    <span className="font-body text-xs text-navy/55 font-normal">
                      · Lotes de {sectorActivo.superficie}
                    </span>
                  </p>
                </div>

                <p className="font-body text-navy/70 text-xs sm:text-sm leading-relaxed">
                  {sectorActivo.descripcion}
                </p>

                <div className="space-y-2 pt-3 border-t border-navy/10">
                  <p className="font-body text-[10px] uppercase tracking-[0.18em] text-navy/50 font-semibold">
                    Características del Sector
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sectorActivo.servicios.map((srv) => (
                      <div
                        key={srv}
                        className="flex items-center gap-2 text-xs font-body text-navy/80"
                      >
                        <span className="text-[#A47C1B] font-bold">✓</span>
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="pt-5 mt-5 border-t border-navy/10 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEnviadoOk(false);
                  setModalVisita(true);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-dorado text-tierra font-body text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-dorado-light transition-all shadow-sm"
              >
                <span>Pedir Plano &amp; Agendar Visita</span>
                <span>→</span>
              </button>
              <Link
                href="/proyectos?ciudad=Neuquén"
                className="inline-flex items-center justify-center py-3.5 px-4 rounded-full border border-navy/15 bg-white text-navy hover:border-dorado hover:text-[#8A6A1B] font-body text-[11px] font-semibold uppercase tracking-wider transition-colors"
              >
                Ver Fichas
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Solicitud de Plano y Agendamiento de Visita en Mari Menuco */}
      <AnimatePresence>
        {modalVisita && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/75 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalVisita(false)}
          >
            <motion.div
              className="w-full max-w-lg rounded-3xl bg-white border border-dorado/30 p-6 sm:p-8 shadow-2xl text-navy"
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A6A1B] font-semibold">
                    Bahía de las Playas · {sectorActivo.codigo}
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-navy mt-0.5">
                    Solicitar Plano y Coordinar Visita
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalVisita(false)}
                  className="w-8 h-8 rounded-full bg-navy/5 hover:bg-navy/10 flex items-center justify-center text-navy/60"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              <p className="font-body text-xs text-navy/65 mb-5">
                Recibí el plano actualizado de{" "}
                <strong>{sectorActivo.nombre}</strong> ({sectorActivo.precioRef}) y
                coordiná una recorrida guiada con{" "}
                <strong>Estela Mari Rojas</strong> (Mat. 35 RP 2026). Tu solicitud
                queda agendada directamente en nuestro sistema.
              </p>

              {enviadoOk ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 text-center">
                  <p className="font-display text-lg font-semibold">
                    ¡Solicitud registrada con éxito!
                  </p>
                  <p className="font-body text-xs text-emerald-800">
                    Ya agendamos tu consulta en el CRM de ALTUM SCI y abrimos
                    WhatsApp para enviarte el plano de lotes disponibles.
                  </p>
                  <button
                    type="button"
                    onClick={() => setModalVisita(false)}
                    className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-navy text-white font-body text-xs uppercase tracking-wider font-semibold"
                  >
                    Cerrar ventana
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAgendarVisitaLago} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-body text-[10px] uppercase tracking-wider text-navy/60 mb-1">
                        Tu Nombre y Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        value={nombreVisita}
                        onChange={(e) => setNombreVisita(e.target.value)}
                        placeholder="Ej: Martín Gómez"
                        className="w-full rounded-xl border border-navy/15 px-3.5 py-2.5 text-sm font-body text-navy focus:border-dorado focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-[10px] uppercase tracking-wider text-navy/60 mb-1">
                        Tu WhatsApp / Teléfono *
                      </label>
                      <input
                        type="tel"
                        required
                        value={telefonoVisita}
                        onChange={(e) => setTelefonoVisita(e.target.value)}
                        placeholder="Ej: +54 9 299 ..."
                        className="w-full rounded-xl border border-navy/15 px-3.5 py-2.5 text-sm font-body text-navy focus:border-dorado focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-body text-[10px] uppercase tracking-wider text-navy/60 mb-1">
                        Fecha tentativa de visita (opcional)
                      </label>
                      <input
                        type="date"
                        value={fechaVisita}
                        onChange={(e) => setFechaVisita(e.target.value)}
                        className="w-full rounded-xl border border-navy/15 px-3.5 py-2.5 text-sm font-body text-navy focus:border-dorado focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-[10px] uppercase tracking-wider text-navy/60 mb-1">
                        Franja horaria preferida
                      </label>
                      <select
                        value={horaVisita}
                        onChange={(e) => setHoraVisita(e.target.value)}
                        className="w-full rounded-xl border border-navy/15 px-3.5 py-2.5 text-sm font-body text-navy focus:border-dorado focus:outline-none bg-white"
                      >
                        <option value="10:00">Mañana (10:00 hs)</option>
                        <option value="11:30">Mediodía (11:30 hs)</option>
                        <option value="15:00">Tarde (15:00 hs)</option>
                        <option value="17:00">Atardecer en el Lago (17:00 hs)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={() => setModalVisita(false)}
                      className="px-5 py-3 rounded-full border border-navy/15 text-navy/65 font-body text-xs uppercase tracking-wider"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={enviando}
                      className="flex-1 py-3.5 px-6 rounded-full bg-dorado text-tierra font-body text-xs font-semibold uppercase tracking-[0.16em] hover:bg-dorado-light transition-all shadow-md disabled:opacity-60"
                    >
                      {enviando
                        ? "Agendando..."
                        : "Recibir Plano y Confirmar por WhatsApp →"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
