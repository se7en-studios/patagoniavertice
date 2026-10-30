"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
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
  { text: "Patagonia.", cls: "font-editorial italic text-[#A47C1B]" },
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
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -28]);

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
          cls: "font-editorial italic text-[#A47C1B]",
        },
      ]
    : TITLE_LINES;
  const subtituloText =
    heroConfig?.subtitulo ||
    "ALTUM SCI es la consultora inmobiliaria de Estela Mari Rojas (Martillera Pública Mat. 35 RP 2026) en Neuquén y Río Negro: lotes frente al Lago Mari Menuco desde USD 32.000, residencias en Cipolletti, alquileres corporativos en Vaca Muerta (12–14% USD) y tasaciones oficiales.";
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
    <section
      ref={sectionRef}
      className="relative min-h-[94vh] lg:min-h-screen flex flex-col overflow-hidden bg-[#F6F8FB]"
    >
      {/* Fondo de video con Parallax Multicapa en GPU */}
      <motion.div
        style={{ scale: bgScale, y: bgY }}
        className="absolute inset-0 overflow-hidden will-change-transform"
      >
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
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex-1 flex flex-col justify-end max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full pt-28 md:pt-36 pb-12 md:pb-20 will-change-transform"
      >
        {/* Top Metadata Bar estilo se7endev.vercel.app */}
        <div
          style={{ "--d": "0.08s" } as React.CSSProperties}
          className="hero-rise rd-label flex items-center justify-between gap-4 text-navy/65 mb-5 border-b border-navy/[0.08] pb-3"
        >
          <span>( {eyebrowText} )</span>
          <span className="hidden sm:inline">
            Mat. 35 RP 2026 · Patagonia, AR
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-8">
          {/* Columna Izquierda: Titular .rd-display + Sello Giratorio .rd-spin */}
          <div className="lg:col-span-8 relative">
            {/* Sello Circular Giratorio estilo se7endev.vercel.app */}
            <div
              aria-hidden="true"
              className="hidden sm:grid absolute right-2 -top-4 h-[108px] w-[108px] place-items-center rounded-full bg-[#0B1528] text-white shadow-[0_18px_45px_-15px_rgba(11,21,40,0.45)] border border-dorado/40 z-20"
            >
              <svg
                viewBox="0 0 200 200"
                className="rd-spin absolute inset-0 h-full w-full"
              >
                <defs>
                  <path
                    id="altum-seal-path"
                    d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
                  />
                </defs>
                <text
                  className="rd-label"
                  style={{
                    fontSize: "14px",
                    letterSpacing: "0.18em",
                    fontWeight: 700,
                  }}
                  fill="#F6F8FB"
                >
                  <textPath href="#altum-seal-path">
                    ESTELA ROJAS ✦ MAT. 35 RP 2026 ✦ ALTUM ✦{" "}
                  </textPath>
                </text>
              </svg>
              <span className="rd-display text-xl text-dorado">✦</span>
            </div>

            {/* Titular Principal con Archivo Wide ("wdth" 122) + Instrument Serif Italic */}
            <h1
              className="rd-display leading-[0.9] mb-5 max-w-4xl"
              style={{
                fontSize: "clamp(2.5rem, min(6.2vw, 9.2vh), 5.3rem)",
              }}
              aria-label={lines.map((l) => l.text).join(" ")}
            >
              {lines.map((line, i) => (
                <span
                  key={line.text}
                  className="block overflow-hidden pb-[0.08em]"
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
              className="hero-rise font-body text-navy/80 text-base sm:text-lg max-w-xl leading-relaxed"
            >
              Lotes frente al Lago Mari Menuco, residencias en Cipolletti y
              renta corporativa en Vaca Muerta con respaldo colegiado directo.
              <span className="sr-only"> {subtituloText}</span>
            </p>
          </div>

          {/* Columna Derecha (Desktop): Tarjeta Interactiva de Activo Destacado en Vivo */}
          <div className="hidden lg:block lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-3xl bg-white/94 backdrop-blur-xl border border-navy/10 p-5 shadow-[0_24px_55px_-20px_rgba(14,26,51,0.22)]"
            >
              {/* Barra de progreso en vivo del Radar (5.2s) */}
              <motion.div
                key={`bar-${activeHighlight}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5.2, ease: "linear" }}
                className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-dorado via-[#A47C1B] to-dorado origin-left"
              />

              {/* Selector de las 3 oportunidades */}
              <div className="flex items-center justify-between gap-1.5 mb-3">
                <span className="inline-flex items-center gap-2 rd-label !text-[10px] !tracking-[0.18em] text-navy/60">
                  <span className="rd-ping" />
                  Destacados
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
                  <Link
                    href={currentItem.href}
                    data-cursor="EXPLORAR ↗"
                    className="group block"
                  >
                    <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-3.5 border border-navy/[0.06]">
                      <Image
                        src={currentItem.image}
                        alt={currentItem.title}
                        fill
                        sizes="360px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/15 to-transparent" />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-navy rd-label !text-[10px] shadow-sm">
                        <TrendingUp className="w-3 h-3 text-[#8A6A1B]" />
                        {currentItem.metric}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="font-display text-lg font-semibold tracking-tight text-navy group-hover:text-[#8A6A1B] transition-colors truncate">
                        {currentItem.title}
                      </h2>
                      <span className="rd-condensed text-base text-[#8A6A1B] shrink-0">
                        {currentItem.price}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Buscador Arquitectónico Minimalista */}
        <div
          style={{ "--d": "0.62s" } as React.CSSProperties}
          className="hero-rise [--rise:18px] w-full max-w-5xl rounded-2xl md:rounded-full border border-navy/10 bg-white/95 backdrop-blur-xl shadow-[0_24px_60px_-20px_rgba(14,26,51,0.18)] p-2 md:p-2.5"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 items-center divide-y md:divide-y-0 md:divide-x divide-navy/[0.08]">
            {/* Col 1: Operación */}
            <div className="md:col-span-3 px-4 py-2.5">
              <label
                htmlFor="hero-op"
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-navy/45 mb-0.5"
              >
                <Sparkles className="w-3 h-3 text-dorado" />
                <span>Objetivo</span>
              </label>
              <select
                id="hero-op"
                value={operacion}
                onChange={(e) => setOperacion(e.target.value)}
                className="w-full bg-transparent font-body text-sm font-semibold text-navy focus:outline-none cursor-pointer"
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
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-navy/45 mb-0.5"
              >
                <Building2 className="w-3 h-3 text-dorado" />
                <span>Activo</span>
              </label>
              <select
                id="hero-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-transparent font-body text-sm font-semibold text-navy focus:outline-none cursor-pointer"
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
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-navy/45 mb-0.5"
              >
                <MapPin className="w-3 h-3 text-dorado" />
                <span>Ubicación</span>
              </label>
              <select
                id="hero-zona"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className="w-full bg-transparent font-body text-sm font-semibold text-navy focus:outline-none cursor-pointer"
              >
                {ZONAS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Col 4: Botón Buscar estilo se7endev */}
            <div className="md:col-span-2 pt-2 md:pt-0 md:pl-2">
              <button
                type="button"
                onClick={handleSearch}
                className="rd-btn w-full justify-between bg-[#0B1528] hover:bg-dorado text-white hover:text-tierra rd-label !text-[10.5px] !tracking-[0.16em] pl-4 pr-1.5 py-2 shadow-sm"
              >
                <span className="rd-roll" data-text="Explorar">
                  <span>Explorar</span>
                </span>
                <span className="rd-btn__icon w-7 h-7 bg-dorado text-tierra">
                  ↗
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Barra Inferior Minimalista */}
        <div
          style={{ "--d": "0.78s" } as React.CSSProperties}
          className="hero-rise mt-6 flex flex-wrap items-center justify-between gap-y-3 font-body text-xs text-navy/75 pt-4 border-t border-navy/[0.08] max-w-5xl"
        >
          <span className="inline-flex items-center gap-2 font-medium text-navy">
            <ShieldCheck className="w-4 h-4 text-[#8A6A1B]" />
            <span>Estela Mari Rojas · Martillera Pública Mat. 35 RP 2026</span>
          </span>

          <a
            href={WA_HERO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 font-semibold text-navy hover:text-[#8A6A1B] bg-white hover:bg-[#FBF0CF]/40 px-4 py-2 rounded-full border border-navy/12 hover:border-dorado shadow-sm transition-all"
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
            <span className="text-xs">{ctaSecundarioText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
