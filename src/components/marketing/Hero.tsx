"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { HeroLandingConfig } from "@/lib/site-config-types";

const WA_HERO =
  "https://wa.me/5492996095742?text=Hola%20Altum%20SCI%2C%20quisiera%20asesoramiento%20personalizado%20sobre%20propiedades%20e%20inversiones.";

// value → parámetro que ya entiende /proyectos
const OPERACIONES = [
  { value: "venta", label: "comprar" },
  { value: "inversion", label: "invertir en" },
  { value: "alquiler", label: "alquilar" },
];

const TIPOS = [
  { value: "todos", label: "cualquier propiedad" },
  { value: "lote", label: "un lote frente al lago" },
  { value: "venta", label: "una casa o residencia" },
  { value: "alquiler", label: "un departamento" },
  { value: "chacra", label: "una chacra o fracción" },
];

const ZONAS = [
  { value: "todas", label: "toda la Patagonia" },
  { value: "Neuquén", label: "Mari Menuco" },
  { value: "Cipolletti", label: "Cipolletti" },
  { value: "Catriel", label: "Catriel" },
  { value: "General Roca", label: "General Roca" },
];

const TITLE_LINES = [
  { text: "Invertí en el eje", cls: "text-navy" },
  { text: "estratégico de la", cls: "text-navy" },
  { text: "Patagonia.", cls: "italic text-[#A47C1B]" },
];

const SELECT =
  "appearance-none bg-[#FBF0CF]/85 hover:bg-[#FBF0CF] px-3 py-1 rounded-xl font-display font-semibold text-navy border border-dorado/50 hover:border-dorado focus:outline-none focus:border-dorado cursor-pointer [field-sizing:content] max-w-full transition-colors shadow-sm";

export default function Hero({ heroConfig }: { heroConfig?: HeroLandingConfig }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const [operacion, setOperacion] = useState("venta");
  const [tipo, setTipo] = useState("todos");
  const [zona, setZona] = useState("todas");

  const eyebrowText =
    heroConfig?.eyebrow || "ALTUM SCI · Servicios & Consultoría Inmobiliaria";
  const lines = heroConfig?.tituloPrincipal
    ? [
        { text: heroConfig.tituloPrincipal, cls: "text-navy" },
        {
          text: heroConfig.tituloCursiva || "de la Patagonia.",
          cls: "italic text-[#A47C1B]",
        },
      ]
    : TITLE_LINES;
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

  return (
    <section className="relative min-h-[94vh] lg:min-h-screen flex flex-col overflow-hidden bg-[#F6F8FB]">
      {/* Fondo de video sin filtros CSS costosos por frame */}
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
        {/* Velos editoriales que garantizan contraste perfecto sin sobrecargar la GPU */}
        <div className="absolute inset-0 bg-white/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F6F8FB]/95 via-[#F6F8FB]/70 to-[#F6F8FB]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F6F8FB] via-[#F6F8FB]/25 to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-end max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full pt-28 md:pt-36 pb-12 md:pb-20">
        {/* Eyebrow badge editorial */}
        <div
          style={{ "--d": "0.15s" } as React.CSSProperties}
          className="hero-rise inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 border border-dorado/40 shadow-sm self-start mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-dorado" />
          <span className="font-body text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-navy">
            {eyebrowText}
          </span>
          <span className="hidden sm:inline font-body text-[11px] text-[#8A6A1B] font-semibold">
            · Neuquén &amp; Río Negro
          </span>
        </div>

        <h1
          className="font-display font-semibold leading-[1.02] mb-6 max-w-4xl"
          style={{
            fontSize: "clamp(2.5rem, min(6.4vw, 9.5vh), 5.6rem)",
            letterSpacing: "-0.03em",
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
                style={{ "--d": `${0.25 + i * 0.12}s` } as React.CSSProperties}
              >
                {line.text}
              </span>
            </span>
          ))}
        </h1>

        {/* Búsqueda conversacional de alta gama */}
        <div
          style={{ "--d": "0.65s" } as React.CSSProperties}
          className="hero-rise [--rise:22px] w-full max-w-4xl rounded-[1.75rem] md:rounded-[2rem] border border-dorado/35 bg-white/95 shadow-[0_24px_60px_-24px_rgba(14,26,51,0.28)] p-4 sm:p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4"
        >
          <p className="flex-1 font-display text-navy text-lg sm:text-xl md:text-2xl leading-[1.9] md:leading-[2]">
            Quiero{" "}
            <select
              aria-label="Operación"
              value={operacion}
              onChange={(e) => setOperacion(e.target.value)}
              className={SELECT}
            >
              {OPERACIONES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>{" "}
            <select
              aria-label="Tipo de inmueble"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className={SELECT}
            >
              {TIPOS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>{" "}
            en{" "}
            <select
              aria-label="Zona"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              className={SELECT}
            >
              {ZONAS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            .
          </p>
          <button
            type="button"
            onClick={handleSearch}
            aria-label="Buscar propiedades"
            className="btn-shimmer group shrink-0 inline-flex items-center justify-center gap-3 self-stretch md:self-auto rounded-full text-tierra font-body text-xs font-semibold tracking-[0.18em] uppercase px-8 py-4 transition-all duration-200 shadow-[0_12px_28px_-10px_rgba(184,150,90,0.75)]"
          >
            <span>Buscar</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Chips de filtro rápido */}
        <div
          style={{ "--d": "0.8s" } as React.CSSProperties}
          className="hero-rise mt-4 flex flex-wrap items-center gap-2 text-xs font-body"
        >
          <span className="text-navy/60 text-[11px] uppercase tracking-wider font-semibold mr-1">
            Accesos rápidos:
          </span>
          {[
            { label: "Lotes en Mari Menuco", t: "lote", z: "Neuquén" },
            { label: "Residencias Cipolletti", t: "venta", z: "Cipolletti" },
            { label: "Renta en Catriel", t: "todos", z: "Catriel" },
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
                className={`px-3.5 py-1.5 rounded-full border text-[11px] font-medium transition-all ${
                  active
                    ? "bg-dorado border-dorado text-tierra font-semibold shadow-sm"
                    : "bg-white/90 hover:bg-white border-dorado/30 hover:border-dorado text-navy/80 hover:text-navy shadow-sm"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Respaldo y contacto */}
        <div
          style={{ "--d": "0.95s" } as React.CSSProperties}
          className="hero-rise mt-6 flex flex-wrap items-center justify-between gap-y-3 font-body text-[11px] tracking-[0.12em] uppercase text-navy/75 pt-4 border-t border-navy/10 max-w-4xl"
        >
          <span className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Respaldo de Martillera Pública Matriculada (Mat. 35 RP 2026)
          </span>
          <a
            href={WA_HERO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-navy hover:text-[#8A6A1B] bg-white hover:bg-[#FBF0CF]/50 px-4 py-1.5 rounded-full border border-dorado/40 hover:border-dorado shadow-sm transition-all"
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
            <span>{ctaSecundarioText}</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
