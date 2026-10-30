"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Building2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type { HeroLandingConfig } from "@/lib/site-config-types";

const WA_HERO =
  "https://wa.me/5492996095742?text=Hola%20Altum%20SCI%2C%20quisiera%20asesoramiento%20personalizado%20sobre%20propiedades%20e%20inversiones.";

const OPERACIONES = [
  { value: "venta", label: "Comprar Propiedad" },
  { value: "inversion", label: "Inversión & Plusvalía" },
  { value: "alquiler", label: "Alquiler Corporativo" },
];

const TIPOS = [
  { value: "todos", label: "Todos los activos" },
  { value: "lote", label: "Lotes frente al lago" },
  { value: "venta", label: "Casas & Residencias" },
  { value: "alquiler", label: "Departamentos" },
  { value: "chacra", label: "Chacras & Fracciones" },
];

const ZONAS = [
  { value: "todas", label: "Toda la Patagonia" },
  { value: "Neuquén", label: "Mari Menuco (Lagos)" },
  { value: "Cipolletti", label: "Cipolletti (Alto Valle)" },
  { value: "Catriel", label: "Catriel (Polo Energético)" },
  { value: "General Roca", label: "General Roca" },
];

const TITLE_LINES = [
  { text: "Invertí en el eje", cls: "text-navy" },
  { text: "estratégico de la", cls: "text-navy" },
  { text: "Patagonia.", cls: "italic text-[#A47C1B]" },
];

const LIVE_HIGHLIGHTS = [
  {
    code: "01 · FRENTE AL LAGO",
    title: "Bahía de las Playas · Mari Menuco",
    price: "Desde USD 32.000",
    metric: "+18% Plusvalía anual",
    detail: "Lotes de 750 a 1.000 m² · Agua, Luz, WakePark & Club House",
    href: "#sec-lago",
    image: "/mari-menuco/bahia-playas-1.jpg",
  },
  {
    code: "02 · RESIDENCIAL PREMIUM",
    title: "Cipolletti · Corredor Alto Valle",
    price: "Desde USD 125.000",
    metric: "A 10 min de Neuquén",
    detail: "Casas en barrios cerrados y semipisos con escritura inmediata",
    href: "#sec-propiedades",
    image: "/casa.avif",
  },
  {
    code: "03 · RENTA CORPORATIVA",
    title: "Catriel & Eje Vaca Muerta",
    price: "Renta 12–14% USD",
    metric: "Contratos verificados",
    detail: "Fracciones logísticas y unidades para empresas de servicios",
    href: "#sec-calculadora",
    image: "/bosque.avif",
  },
];

export default function Hero({ heroConfig }: { heroConfig?: HeroLandingConfig }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const [operacion, setOperacion] = useState("venta");
  const [tipo, setTipo] = useState("todos");
  const [zona, setZona] = useState("todas");
  const [activeHighlight, setActiveHighlight] = useState(0);

  const eyebrowText =
    heroConfig?.eyebrow || "ALTUM SCI · Real Estate & Consultoría Patrimonial";
  const lines = heroConfig?.tituloPrincipal
    ? [
        { text: heroConfig.tituloPrincipal, cls: "text-navy" },
        {
          text: heroConfig.tituloCursiva || "de la Patagonia.",
          cls: "italic text-[#A47C1B]",
        },
      ]
    : TITLE_LINES;
  const subtituloText =
    heroConfig?.subtitulo ||
    "Lotes exclusivos frente al lago en Mari Menuco, residencias en Cipolletti y activos de renta en moneda dura con respaldo notarial colegiado.";
  const ctaSecundarioText =
    heroConfig?.ctaSecundario || "Hablar directamente con Estela";

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (tipo !== "todos") params.set("tipo", tipo);
    if (zona !== "todas") params.set("ciudad", zona);
    if (operacion !== "venta") params.set("operacion", operacion);
    router.push(`/proyectos${params.toString() ? `?${params}` : ""}`);
  };

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.8;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % LIVE_HIGHLIGHTS.length);
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  const currentItem = LIVE_HIGHLIGHTS[activeHighlight];

  return (
    <section className="relative min-h-[94vh] lg:min-h-screen flex flex-col overflow-hidden bg-[#F6F8FB]">
      {/* Fondo de video con velo arquitectónico minimalista */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          poster="/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/bg-hero.webm" type="video/webm" />
          <source src="/bg-hero-opt.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F6F8FB]/95 via-[#F6F8FB]/80 to-[#F6F8FB]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F6F8FB] via-[#F6F8FB]/30 to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-end max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full pt-28 md:pt-36 pb-12 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-8">
          {/* Columna Izquierda: Titular y Propuesta */}
          <div className="lg:col-span-8">
            {/* Eyebrow minimalista estilo PropTech */}
            <div
              style={{ "--d": "0.12s" } as React.CSSProperties}
              className="hero-rise inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-navy/10 shadow-[0_2px_10px_rgba(14,26,51,0.04)] self-start mb-6 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-dorado animate-pulse" />
              <span className="font-mono text-[10px] font-semibold tracking-[0.16em] uppercase text-navy">
                {eyebrowText}
              </span>
              <span className="hidden sm:inline font-mono text-[10px] text-[#8A6A1B] font-semibold">
                · NEUQUÉN &amp; RÍO NEGRO
              </span>
            </div>

            {/* Titular Principal */}
            <h1
              className="font-display font-medium leading-[1.01] mb-5 max-w-4xl"
              style={{
                fontSize: "clamp(2.6rem, min(6.2vw, 9.2vh), 5.4rem)",
                letterSpacing: "-0.035em",
              }}
              aria-label={lines.map((l) => l.text).join(" ")}
            >
              {lines.map((line, i) => (
                <span
                  key={line.text}
                  className="block overflow-hidden pb-[0.06em]"
                  aria-hidden="true"
                >
                  <span
                    className={`hero-line block ${line.cls}`}
                    style={
                      { "--d": `${0.22 + i * 0.1}s` } as React.CSSProperties
                    }
                  >
                    {line.text}
                  </span>
                </span>
              ))}
            </h1>

            <p
              style={{ "--d": "0.5s" } as React.CSSProperties}
              className="hero-rise font-body text-navy/65 text-sm sm:text-base max-w-xl leading-relaxed"
            >
              {subtituloText}
            </p>
          </div>

          {/* Columna Derecha (Desktop): Tarjeta Interactiva de Activo Destacado en Vivo */}
          <div className="hidden lg:block lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-white/92 backdrop-blur-xl border border-navy/10 p-4 shadow-[0_24px_55px_-20px_rgba(14,26,51,0.22)]"
            >
              {/* Selector de las 3 oportunidades */}
              <div className="flex items-center justify-between gap-1.5 mb-3">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-navy/50 font-semibold">
                  Radar Patrimonial
                </span>
                <div className="flex items-center gap-1.5">
                  {LIVE_HIGHLIGHTS.map((h, idx) => (
                    <button
                      key={h.code}
                      type="button"
                      onClick={() => setActiveHighlight(idx)}
                      aria-label={`Ver destacado ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeHighlight
                          ? "w-6 bg-dorado"
                          : "w-2 bg-navy/15 hover:bg-navy/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.code}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={currentItem.href} className="group block">
                    <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-3 border border-navy/[0.06]">
                      <Image
                        src={currentItem.image}
                        alt={currentItem.title}
                        fill
                        sizes="360px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/15 to-transparent" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-navy-950/85 text-dorado font-mono text-[9px] uppercase tracking-wider font-semibold">
                        {currentItem.code}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 text-navy font-mono text-[9.5px] font-semibold shadow-sm">
                        <TrendingUp className="w-3 h-3 text-[#8A6A1B]" />
                        {currentItem.metric}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h2 className="font-display text-base font-semibold text-navy group-hover:text-[#8A6A1B] transition-colors truncate">
                        {currentItem.title}
                      </h2>
                      <span className="font-mono text-[11px] font-bold text-[#8A6A1B] shrink-0">
                        {currentItem.price}
                      </span>
                    </div>

                    <p className="font-body text-[11.5px] text-navy/60 line-clamp-2 leading-relaxed">
                      {currentItem.detail}
                    </p>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Buscador Arquitectónico de 4 Columnas (Estilo PropTech Minimalista) */}
        <div
          style={{ "--d": "0.62s" } as React.CSSProperties}
          className="hero-rise [--rise:18px] w-full max-w-5xl rounded-2xl md:rounded-full border border-navy/10 bg-white/95 backdrop-blur-xl shadow-[0_24px_60px_-20px_rgba(14,26,51,0.18)] p-2 md:p-2.5"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 items-center divide-y md:divide-y-0 md:divide-x divide-navy/[0.08]">
            {/* Col 1: Operación */}
            <div className="md:col-span-3 px-4 py-2.5">
              <label
                htmlFor="hero-op"
                className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-navy/45 mb-0.5"
              >
                <Sparkles className="w-3 h-3 text-dorado" />
                <span>01 · Objetivo</span>
              </label>
              <select
                id="hero-op"
                value={operacion}
                onChange={(e) => setOperacion(e.target.value)}
                className="w-full bg-transparent font-body text-xs sm:text-sm font-semibold text-navy focus:outline-none cursor-pointer"
              >
                {OPERACIONES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Col 2: Tipo de Propiedad */}
            <div className="md:col-span-4 px-4 py-2.5">
              <label
                htmlFor="hero-tipo"
                className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-navy/45 mb-0.5"
              >
                <Building2 className="w-3 h-3 text-dorado" />
                <span>02 · Tipo de Activo</span>
              </label>
              <select
                id="hero-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-transparent font-body text-xs sm:text-sm font-semibold text-navy focus:outline-none cursor-pointer"
              >
                {TIPOS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Col 3: Ubicación */}
            <div className="md:col-span-3 px-4 py-2.5">
              <label
                htmlFor="hero-zona"
                className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-navy/45 mb-0.5"
              >
                <MapPin className="w-3 h-3 text-dorado" />
                <span>03 · Ubicación</span>
              </label>
              <select
                id="hero-zona"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className="w-full bg-transparent font-body text-xs sm:text-sm font-semibold text-navy focus:outline-none cursor-pointer"
              >
                {ZONAS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Col 4: Botón Buscar */}
            <div className="md:col-span-2 pt-2 md:pt-0 md:pl-2">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl md:rounded-full bg-[#0B1528] hover:bg-dorado text-white hover:text-tierra font-body text-[11px] font-semibold tracking-[0.16em] uppercase py-3.5 px-5 transition-all duration-200 shadow-sm group"
              >
                <span>Explorar</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Chips minimalistas de acceso rápido */}
        <div
          style={{ "--d": "0.75s" } as React.CSSProperties}
          className="hero-rise mt-4 flex flex-wrap items-center gap-2 text-xs font-body"
        >
          <span className="font-mono text-navy/45 text-[10px] uppercase tracking-widest mr-1">
            Tendencias:
          </span>
          {[
            {
              label: "Bahía de las Playas · Mari Menuco",
              t: "lote",
              z: "Neuquén",
            },
            { label: "Residencias en Cipolletti", t: "venta", z: "Cipolletti" },
            { label: "Renta USD · Catriel", t: "todos", z: "Catriel" },
          ].map((item) => {
            const active = tipo === item.t && zona === item.z;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setTipo(item.t);
                  setZona(item.z);
                }}
                className={`px-3.5 py-1 rounded-full border text-[11px] transition-all ${
                  active
                    ? "bg-navy text-white border-navy font-medium"
                    : "bg-white/80 hover:bg-white border-navy/10 hover:border-navy/30 text-navy/75 hover:text-navy"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Barra Inferior de Garantía Colegiada y Contacto Directo */}
        <div
          style={{ "--d": "0.88s" } as React.CSSProperties}
          className="hero-rise mt-7 flex flex-wrap items-center justify-between gap-y-3 font-body text-[11px] text-navy/70 pt-4 border-t border-navy/[0.08] max-w-5xl"
        >
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="inline-flex items-center gap-2 font-medium text-navy">
              <ShieldCheck className="w-4 h-4 text-[#8A6A1B]" />
              <span>Martillera Pública Estela Mari Rojas · Mat. 35 RP 2026</span>
            </span>
            <span className="hidden md:inline-block text-navy/25">|</span>
            <span className="hidden md:inline-block font-mono text-[10px] uppercase tracking-wider text-navy/55">
              Lotes desde USD 32.000 · Renta Corporativa 12–14% USD
            </span>
          </div>

          <a
            href={WA_HERO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 font-semibold text-navy hover:text-[#8A6A1B] bg-white hover:bg-[#FBF0CF]/40 px-4 py-1.5 rounded-full border border-navy/12 hover:border-dorado shadow-sm transition-all"
          >
            <span className="relative w-5 h-5 rounded-full overflow-hidden ring-1 ring-dorado shrink-0">
              <Image
                src="/estela-avatar.jpg"
                alt="Estela Mari Rojas"
                fill
                sizes="20px"
                className="object-cover"
              />
            </span>
            <span className="text-[11px] tracking-wide">{ctaSecundarioText}</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
