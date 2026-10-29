"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface ZonaInfo {
  id: string;
  nombre: string;
  provincia: string;
  tagline: string;
  descripcion: string;
  destacados: string[];
  imagen: string;
  enlace: string;
  tipoInversion: string;
}

const ZONAS_PATAGONIA: ZonaInfo[] = [
  {
    id: "mari-menuco",
    nombre: "Mari Menuco",
    provincia: "Neuquén",
    tagline: "Barrio Privado Bahía de las Playas, frente al lago",
    descripcion:
      "Terrenos exclusivos con costa y vista panorámica al lago Mari Menuco, a solo 65 km de Neuquén Capital. Cuenta con tendido de agua y luz, y proyectos aprobados de WakePark y Club House náutico.",
    destacados: [
      "Frente al lago con bajada náutica privada",
      "Servicios de agua y energía en el lote",
      "Club House y WakePark proyectados para el barrio",
      "Escrituración y supervisión legal colegiada",
    ],
    imagen: "/mari-menuco/bahia-playas-1.jpg",
    enlace: "/proyectos?ciudad=Neuquén",
    tipoInversion: "Lotes & Casas de Lago · Alta Plusvalía",
  },
  {
    id: "cipolletti",
    nombre: "Cipolletti",
    provincia: "Río Negro",
    tagline: "Residencias de vanguardia y barrios consolidados",
    descripcion:
      "El polo residencial de mayor demanda del Alto Valle, conectado de forma directa con Neuquén Capital. Ideal para familias e inversores que buscan seguridad, confort y alta liquidez inmobiliaria.",
    destacados: [
      "A solo 10 minutos de Neuquén Capital",
      "Barrios cerrados con seguridad las 24 horas",
      "Departamentos de categoría y residencias premium",
      "Demanda sostenida de alquiler residencial y corporativo",
    ],
    imagen: "/casa.avif",
    enlace: "/inmobiliaria-cipoletti",
    tipoInversion: "Residencial & Corporativo · Rentabilidad Estable",
  },
  {
    id: "catriel",
    nombre: "Catriel & Vaca Muerta",
    provincia: "Río Negro",
    tagline: "Eje estratégico energético y renta en moneda dura",
    descripcion:
      "Ubicación privilegiada en el corredor hidrocarburífero del norte patagónico. Fracciones logísticas, lotes para desarrollo y viviendas acondicionadas para ejecutivos y contratistas petroleros.",
    destacados: [
      "Alquileres corporativos a empresas de servicios petroleros",
      "Contratos en USD con alta rentabilidad anual (12-14%)",
      "Fracciones industriales y terrenos con acceso a rutas clave",
      "Baja tasa de vacancia por demanda continua",
    ],
    imagen: "/bosque.avif",
    enlace: "/inmobiliaria-catriel",
    tipoInversion: "Renta Corporativa en USD · Fracciones Logísticas",
  },
  {
    id: "general-roca",
    nombre: "General Roca & Valle",
    provincia: "Río Negro",
    tagline: "Chacras productivas y lotes en expansión urbana",
    descripcion:
      "El corazón productivo y cultural del Alto Valle. Oportunidades únicas en chacras de descanso, fracciones con derecho de riego y loteos abiertos y cerrados con gran potencial de apreciación a mediano plazo.",
    destacados: [
      "Chacras con entorno natural y servicios consolidados",
      "Loteos con valores de m² competitivos en preventa",
      "Excelente conectividad sobre la Ruta Nacional 22",
      "Asesoramiento notarial y deslindes certificados",
    ],
    imagen: "/noche.avif",
    enlace: "/propiedades-rio-negro",
    tipoInversion: "Chacras, Campos & Loteos en Expansión",
  },
];

export default function ZonasInteractivas() {
  const [zonaActiva, setZonaActiva] = useState<ZonaInfo>(ZONAS_PATAGONIA[0]);

  return (
    <section
      className="py-24 lg:py-36 relative overflow-hidden text-crema"
      style={{ background: "#050811" }}
      id="zonas-cobertura"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[350px] opacity-15 blur-[140px] pointer-events-none rounded-full"
        style={{ background: "#C9A84C" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-10 bg-dorado" />
              <span className="eyebrow tracking-[0.25em] text-dorado">
                Territorio &amp; Mercado Estratégico
              </span>
            </div>
            <h2
              className="font-display font-medium text-crema leading-[1.05]"
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Donde la Patagonia{" "}
              <em className="not-italic italic text-dorado">crece y rinde</em>
            </h2>
            <p className="font-body text-crema/55 text-sm lg:text-base max-w-xl mt-4">
              Explorá las 4 micro-regiones con mayor desarrollo, plusvalía y retorno de capital en Neuquén y Río Negro con el respaldo de <strong>ALTUM SCI</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 border border-dorado/30 bg-navy-950/80 px-4 py-2 self-start lg:self-auto backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-dorado animate-ping" />
            <span className="font-body text-crema/70 text-xs tracking-wider uppercase font-medium">
              4 Zonas con Operaciones Activas
            </span>
          </div>
        </div>

        {/* Territory Tabs Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {ZONAS_PATAGONIA.map((zona) => {
            const isSelected = zona.id === zonaActiva.id;
            return (
              <button
                key={zona.id}
                onClick={() => setZonaActiva(zona)}
                className={`p-4 text-left border transition-all relative overflow-hidden backdrop-blur-sm ${
                  isSelected
                    ? "border-dorado bg-navy-900/90 text-crema shadow-lg"
                    : "border-crema/10 bg-navy-950/40 text-crema/50 hover:border-crema/30 hover:text-crema"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-tab-line"
                    className="absolute top-0 left-0 right-0 h-1 bg-dorado"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="block font-body text-[9px] tracking-[0.2em] uppercase text-dorado/80 mb-1">
                  {zona.provincia}
                </span>
                <span className="block font-display text-sm md:text-base font-semibold text-crema">
                  {zona.nombre}
                </span>
                <span className="block font-body text-[9.5px] text-crema/65 truncate mt-0.5">
                  {zona.tipoInversion.split("·")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Feature Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={zonaActiva.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative border border-dorado/30 bg-navy-900/70 overflow-hidden backdrop-blur-xl shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              {/* Left Column: Image with dynamic overlay */}
              <div className="lg:col-span-7 relative min-h-[340px] lg:min-h-[540px] overflow-hidden">
                <Image
                  src={zonaActiva.imagen}
                  alt={zonaActiva.nombre}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-navy-950 via-navy-950/45 to-transparent" />

                {/* Floating pill over image */}
                <div className="absolute bottom-6 left-6 right-6 lg:right-auto z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/60 backdrop-blur-md border border-dorado/30 text-dorado font-body text-[10px] tracking-wider uppercase font-semibold">
                    <span>✦</span>
                    <span>{zonaActiva.tipoInversion}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Information & Points */}
              <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="font-body text-dorado text-[11px] tracking-[0.25em] uppercase font-semibold">
                      {zonaActiva.provincia} · Polo Seleccionado
                    </span>
                    <h3 className="font-display text-3xl lg:text-4xl text-crema font-medium">
                      {zonaActiva.nombre}
                    </h3>
                  </div>

                  <p className="font-body text-dorado text-sm font-medium leading-snug">
                    {zonaActiva.tagline}
                  </p>

                  <p className="font-body text-crema/65 text-sm leading-relaxed">
                    {zonaActiva.descripcion}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2.5 pt-4 border-t border-crema/10">
                    <h4 className="font-body text-crema/65 text-[10px] tracking-[0.2em] uppercase">
                      Ventajas Estratégicas
                    </h4>
                    {zonaActiva.destacados.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-crema/80 font-body"
                      >
                        <span className="text-dorado mt-0.5">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-col sm:flex-row gap-3 border-t border-crema/10">
                  <Link
                    href={zonaActiva.enlace}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-dorado text-tierra font-body text-[11px] font-semibold tracking-[0.16em] uppercase hover:bg-dorado-light transition-all text-center shadow-md"
                  >
                    <span>Ver Oportunidades</span>
                    <span>→</span>
                  </Link>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hola ALTUM SCI, me interesa consultar opciones de inversión y propiedades en ${zonaActiva.nombre} (${zonaActiva.provincia}).`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-3.5 border border-crema/20 text-crema/80 hover:text-dorado hover:border-dorado transition-colors text-center text-xs tracking-wider"
                  >
                    Consultar Asesor
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
