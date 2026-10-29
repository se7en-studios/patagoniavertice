"use client";

import { useRouter } from "next/navigation";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";

const WA_HERO =
  "https://wa.me/5492996095742?text=Hola%20Altum%20SCI%2C%20quisiera%20asesoramiento%20personalizado%20sobre%20propiedades%20e%20inversiones.";

const TABS = [
  { id: "venta", label: "Comprar" },
  { id: "inversion", label: "Inversión & Lotes" },
  { id: "alquiler", label: "Alquiler" },
];

const TIPOS = [
  { value: "todos", label: "Todos los tipos" },
  { value: "lote", label: "Lotes frente al lago" },
  { value: "venta", label: "Casas y residencias" },
  { value: "alquiler", label: "Departamentos y dúplex" },
  { value: "chacra", label: "Chacras y fracciones" },
];

const ZONAS = [
  { value: "todas", label: "Toda la Patagonia" },
  { value: "Neuquén", label: "Mari Menuco (Neuquén)" },
  { value: "Cipolletti", label: "Cipolletti" },
  { value: "Catriel", label: "Catriel" },
  { value: "General Roca", label: "General Roca" },
];

const CONFIANZA = [
  { icon: BadgeCheck, text: "Martillera matriculada · Mat. 35 RP 2026" },
  { icon: ShieldCheck, text: "Validez notarial y seguridad jurídica" },
  { icon: MapPin, text: "Neuquén · Río Negro · Patagonia" },
];

const TITLE_LINES = [
  { text: "Invertí en el eje", cls: "text-crema" },
  { text: "estratégico de la", cls: "text-crema" },
  { text: "Patagonia.", cls: "text-dorado" },
];

const MARQUEE_ITEMS = [
  "ALTUM SCI",
  "SERVICIOS & CONSULTORÍA INMOBILIARIA",
  "MARI MENUCO",
  "CIPOLLETTI",
  "CATRIEL",
  "GENERAL ROCA",
  "VACA MUERTA",
  "PATAGONIA ARGENTINA",
];

const FIELD_LABEL =
  "block font-body text-[9px] tracking-[0.22em] uppercase text-dorado mb-1";
const FIELD_SELECT =
  "w-full bg-transparent text-crema font-body text-sm font-medium focus:outline-none cursor-pointer";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const [tipo, setTipo] = useState("todos");
  const [zona, setZona] = useState("todas");
  const [operacion, setOperacion] = useState("venta");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (tipo !== "todos") params.set("tipo", tipo);
    if (zona !== "todas") params.set("ciudad", zona);
    if (operacion !== "venta") params.set("operacion", operacion);
    router.push(`/proyectos${params.toString() ? `?${params}` : ""}`);
  };

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.75;
  }, []);

  // Entrada escalonada: eyebrow → titular (por línea) → subtítulo → CTAs → buscador
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-eyebrow",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.8 },
        0.2,
      );
      tl.fromTo(
        ".hero-line",
        { yPercent: 110, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 1, stagger: 0.14 },
        0.4,
      );
      tl.fromTo(
        ".hero-sub, .hero-cta",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 },
        1.0,
      );
      tl.fromTo(
        ".hero-search",
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.9 },
        1.3,
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col overflow-hidden bg-navy-950"
    >
      {/* Video de fondo con parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: 1.1 }}>
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
      </motion.div>

      {/* Overlays: tinte de marca + base oscura para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/45 to-navy-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-navy-950/40" />
      <div className="absolute inset-0 grain-overlay opacity-[0.04] mix-blend-overlay" />

      {/* Contenido */}
      <motion.div
        className="relative flex-1 flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-12 w-full pt-28 md:pt-32 pb-8"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="hero-eyebrow flex items-center gap-4 mb-5 opacity-0">
          <div className="h-px w-10 bg-dorado" />
          <span className="font-body text-dorado text-[11px] md:text-xs font-semibold tracking-[0.28em] uppercase [text-shadow:0_1px_12px_rgba(0,0,0,0.8)]">
            Altum SCI · Servicios &amp; Consultoría Inmobiliaria
          </span>
        </div>

        <h1
          className="font-display font-semibold leading-[1.02] mb-5 max-w-4xl"
          style={{
            fontSize: "clamp(2.6rem, min(7.2vw, 10.5vh), 6.25rem)",
            letterSpacing: "-0.03em",
          }}
          aria-label={TITLE_LINES.map((l) => l.text).join(" ")}
        >
          {TITLE_LINES.map((line) => (
            <span
              key={line.text}
              className="block overflow-hidden pb-[0.08em]"
              aria-hidden="true"
            >
              <span className={`hero-line block opacity-0 ${line.cls}`}>
                {line.text}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-sub opacity-0 font-body text-crema/85 text-base lg:text-lg leading-relaxed max-w-xl mb-6 [text-shadow:0_1px_16px_rgba(0,0,0,0.7)]">
          Lotes frente al lago Mari Menuco, residencias y oportunidades de
          inversión en Neuquén y Río Negro, con el respaldo de una martillera
          matriculada.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <a
            href="#propiedades-destacadas"
            className="hero-cta opacity-0 group btn-shimmer inline-flex items-center gap-3 px-9 py-4 text-tierra font-body text-[11px] font-semibold tracking-[0.16em] uppercase shadow-lg"
          >
            Explorar propiedades
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href={WA_HERO}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta opacity-0 inline-flex items-center gap-2.5 px-8 py-4 border border-crema/35 text-crema font-body text-[11px] font-semibold tracking-[0.16em] uppercase backdrop-blur-sm hover:border-dorado hover:text-dorado transition-colors duration-300"
          >
            Hablar con Estela
          </a>
        </div>

        {/* Buscador en vidrio */}
        <div className="hero-search opacity-0 w-full max-w-5xl border border-crema/20 bg-navy-950/55 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-1 px-3 pt-3 border-b border-crema/10">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setOperacion(t.id)}
                className={`font-body text-[10px] tracking-[0.18em] uppercase px-4 py-2.5 transition-colors ${
                  operacion === t.id
                    ? "text-dorado border-b-2 border-dorado -mb-px"
                    : "text-crema/60 hover:text-crema"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] items-stretch">
            <label className="px-6 py-4 border-b md:border-b-0 md:border-r border-crema/10 hover:bg-crema/[0.04] transition-colors">
              <span className={FIELD_LABEL}>Tipo de inmueble</span>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className={FIELD_SELECT}
              >
                {TIPOS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-navy-950">
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="px-6 py-4 border-b md:border-b-0 md:border-r border-crema/10 hover:bg-crema/[0.04] transition-colors">
              <span className={FIELD_LABEL}>Zona</span>
              <select
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className={FIELD_SELECT}
              >
                {ZONAS.map((o) => (
                  <option key={o.value} value={o.value} className="bg-navy-950">
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-dorado text-tierra font-body text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-gold-400 transition-colors"
            >
              <Search className="h-4 w-4" />
              Buscar
            </button>
          </div>
        </div>

        {/* Barra de confianza */}
        <ul className="hero-sub opacity-0 mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {CONFIANZA.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-2.5 font-body text-[11px] tracking-[0.12em] uppercase text-crema/70"
            >
              <Icon className="h-4 w-4 text-dorado" strokeWidth={1.5} />
              {text}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Ticker */}
      <div className="relative border-t border-crema/10 overflow-hidden h-11 bg-navy-950/70 backdrop-blur-sm shrink-0">
        <motion.div
          className="flex items-center h-full w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
          {[
            ...MARQUEE_ITEMS,
            ...MARQUEE_ITEMS,
            ...MARQUEE_ITEMS,
            ...MARQUEE_ITEMS,
          ].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-5 px-6 shrink-0 whitespace-nowrap"
            >
              <span className="font-body text-crema/45 text-[9px] tracking-[0.4em] uppercase">
                {item}
              </span>
              <span className="text-dorado/50 text-[10px]">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
