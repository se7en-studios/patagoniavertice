"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import TypewriterText from "@/components/ui/TypewriterText";

const WA_HERO =
  "https://wa.me/5492996095742?text=Hola%2C%20quisiera%20consultar%20propiedades%20de%20Altum%20Inmobiliaria";

const SERVICES = ["Venta", "Alquiler", "Consultoría", "Contratos"];

const MARQUEE_ITEMS = [
  "ALTUM INMOBILIARIA",
  "VENTA",
  "ALQUILER",
  "CONSULTORÍA",
  "CONTRATOS",
  "NEUQUÉN",
  "PATAGONIA",
  "PROPIEDADES",
  "ALTUM INMOBILIARIA",
  "VENTA",
  "ALQUILER",
  "CONSULTORÍA",
  "CONTRATOS",
  "NEUQUÉN",
  "PATAGONIA",
  "PROPIEDADES",
];

const titleLines = [
  { text: "Tu inversión,", cls: "text-crema font-bold" },
  { text: "en el corazón", cls: "text-crema/40 pl-0 lg:pl-16 font-medium" },
  { text: "de la Patagonia.", cls: "text-dorado font-bold" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  // Buscador interactivo - conectado a /proyectos
  const [tipoInmueble, setTipoInmueble] = useState("todos");
  const [ubicacion, setUbicacion] = useState("todas");
  const [operacion, setOperacion] = useState("venta");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (tipoInmueble !== "todos") params.set("tipo", tipoInmueble);
    if (ubicacion !== "todas") params.set("ciudad", ubicacion);
    if (operacion !== "venta") params.set("operacion", operacion);
    router.push(`/proyectos${params.toString() ? `?${params}` : ""}`);
  };

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.75;
  }, []);

  // GSAP staggered entrance: badge 0.3s → headline 0.6s (letter reveal)
  // → subtitle 0.9s → CTAs 1.2s. Duration 0.8s, stagger 0.2s.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-badge",
        { autoAlpha: 0, x: 20 },
        { autoAlpha: 1, x: 0, duration: 0.8 },
        0.3,
      );
      tl.fromTo(
        ".hero-eyebrow",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.8 },
        0.3,
      );
      tl.fromTo(
        ".hero-char",
        { yPercent: 115, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.02 },
        0.6,
      );
      tl.fromTo(
        [".hero-chips", ".hero-sub"],
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.2 },
        0.9,
      );
      tl.fromTo(
        ".hero-cta",
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.2 },
        1.2,
      );
      tl.fromTo(
        ".hero-marquee",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.6 },
        1.5,
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
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── Video background - parallax + subtle scale on load ── */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: 1.1 }}>
        <motion.video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          poster="/hero.png"
          autoPlay
          muted
          loop
          playsInline
          initial={{ scale: 1.0 }}
          animate={{ scale: 1.03 }}
          transition={{ duration: 8, ease: "linear" }}
        >
          {/* WebM primero (mejor compresión en Chrome/Firefox), MP4 como fallback */}
          <source src="/bg-hero.webm" type="video/webm" />
          <source src="/bg-hero-opt.mp4" type="video/mp4" />
        </motion.video>
      </motion.div>

      {/* ── Overlays ─────────────────────────────────────────────────────── */}
      {/* Navy brand tint - más ligero para ver el video */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, rgba(15,26,62,0.35) 0%, rgba(26,39,82,0.20) 38%, rgba(10,18,40,0.75) 100%)",
        }}
      />
      {/* Bottom-up dark para legibilidad del texto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,18,40,0.92) 0%, rgba(10,18,40,0.15) 52%, transparent 100%)",
        }}
      />
      {/* Grain texture */}
      <div className="absolute inset-0 grain-overlay opacity-[0.04] mix-blend-overlay" />

      {/* Left gold accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-dorado/20 to-transparent" />

      {/* ── Brand badge - GSAP entrada 0.3s ─────────────────────────────── */}
      <div className="hero-badge absolute top-28 right-6 lg:right-12 opacity-0">
        <div
          className="flex flex-col gap-1 backdrop-blur-sm border border-dorado/20 px-4 py-3"
          style={{ background: "rgba(26,39,82,0.55)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-dorado badge-pulse flex-shrink-0" />
            <span className="font-body text-dorado/80 text-[10px] tracking-[0.22em] uppercase">
              Estela Mari Rojas
            </span>
          </div>
          <p className="font-body text-crema/30 text-[9px] tracking-[0.18em] uppercase pl-[18px]">
            Martillera · Mat. 35 RP 2026 · Río Negro
          </p>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <motion.div
        className="relative flex-1 flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-12 w-full pb-20 pt-40"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Eyebrow - GSAP 0.3s */}
        <div className="hero-eyebrow flex items-center gap-4 mb-10 opacity-0">
          <div className="h-px w-10 bg-dorado" />
          <span className="eyebrow">Neuquén · Patagonia Argentina</span>
        </div>

        {/* Headline - GSAP letter-reveal 0.6s, escala H1 56px */}
        <h1
          className="font-display font-medium leading-[1.1] max-w-5xl mb-8"
          style={{
            fontSize: "clamp(2.75rem, 6vw, var(--text-h1))",
            letterSpacing: "0.01em",
          }}
          aria-label={titleLines.map((l) => l.text).join(" ")}
        >
          {titleLines.map((line, i) => (
            <span
              key={i}
              className={`block overflow-hidden ${line.cls}`}
              aria-hidden="true"
            >
              {line.text.split("").map((ch, j) => (
                <span key={j} className="hero-char inline-block opacity-0">
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* Services chips - GSAP 0.9s */}
        <div className="hero-chips flex flex-wrap gap-2 mb-8 opacity-0">
          {SERVICES.map((service) => (
            <span
              key={service}
              className="font-body text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 border border-dorado/25 text-dorado/65"
              style={{ background: "rgba(201,168,76,0.07)" }}
            >
              {service}
            </span>
          ))}
        </div>

        {/* Subtitle - typewriter rotativo */}
        <div className="hero-sub font-body text-crema/45 text-[15px] lg:text-base leading-relaxed max-w-md mb-12 opacity-0 min-h-[3rem]">
          <TypewriterText
            texts={[
              "Terrenos frente al lago Mari Menuco, Neuquén.",
              "Trato directo. Sin intermediarios.",
              "Tu inversión, en el corazón de Patagonia.",
              "Transparencia total en cada operación.",
            ]}
            className="text-crema/45"
            cursorClassName="bg-dorado/50"
            typeSpeed={50}
            deleteSpeed={28}
            pauseMs={2500}
            startDelay={1400}
          />
        </div>

        {/* CTAs - GSAP 1.2s, glow oro */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Primary - Ver Servicios */}
          <Link
            href="/servicios"
            className="hero-cta opacity-0 group cta-glow inline-flex items-center justify-center gap-3 px-9 py-4 btn-shimmer text-tierra font-body text-[11px] font-semibold tracking-[0.15em] uppercase"
          >
            Ver Servicios
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>

          {/* Secondary - WhatsApp */}
          <a
            href={WA_HERO}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta opacity-0 cta-glow inline-flex items-center justify-center gap-3 px-9 py-4 border border-crema/15 text-crema/70 font-body text-[11px] font-medium tracking-[0.15em] uppercase hover:border-dorado hover:text-dorado transition-colors duration-300"
          >
            <WaIcon />
            Consultar por WhatsApp
          </a>

          {/* Terciario - Tasador Online */}
          <a
            href="#tasador-express"
            className="hero-cta opacity-0 cta-glow inline-flex items-center justify-center gap-3 px-9 py-4 border border-dorado/40 text-dorado font-body text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-dorado hover:text-tierra transition-all duration-300"
          >
            ✦ Tasar mi propiedad
          </a>
        </div>

        {/* ── Luxury Quick Search Bar ── */}
        <div className="hero-cta opacity-0 max-w-4xl w-full p-4 lg:p-6 bg-navy-950/80 backdrop-blur-xl border border-dorado/30 shadow-2xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Tipo Inmueble */}
            <div className="flex-1 bg-navy-900/90 border border-crema/15 px-4 py-2.5">
              <label className="block font-body text-[9px] tracking-[0.2em] uppercase text-dorado/80 mb-0.5">
                Tipo de Inmueble
              </label>
              <select
                aria-label="Tipo de Inmueble"
                value={tipoInmueble}
                onChange={(e) => setTipoInmueble(e.target.value)}
                className="w-full bg-transparent text-crema font-body text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="todos" className="bg-navy-950 text-crema">
                  Todos los tipos
                </option>
                <option value="venta" className="bg-navy-950 text-crema">
                  Casas &amp; Residencias
                </option>
                <option value="alquiler" className="bg-navy-950 text-crema">
                  Departamentos
                </option>
                <option value="lote" className="bg-navy-950 text-crema">
                  Lotes &amp; Terrenos
                </option>
                <option value="chacra" className="bg-navy-950 text-crema">
                  Chacras &amp; Campos
                </option>
              </select>
            </div>

            {/* Ubicación */}
            <div className="flex-1 bg-navy-900/90 border border-crema/15 px-4 py-2.5">
              <label className="block font-body text-[9px] tracking-[0.2em] uppercase text-dorado/80 mb-0.5">
                Ubicación / Región
              </label>
              <select
                aria-label="Ubicación o Región"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="w-full bg-transparent text-crema font-body text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="todas" className="bg-navy-950 text-crema">
                  Toda la Patagonia
                </option>
                <option value="Neuquén" className="bg-navy-950 text-crema">
                  Mari Menuco (Neuquén)
                </option>
              </select>
            </div>

            {/* Operación */}
            <div className="flex-1 bg-navy-900/90 border border-crema/15 px-4 py-2.5">
              <label className="block font-body text-[9px] tracking-[0.2em] uppercase text-dorado/80 mb-0.5">
                Operación
              </label>
              <select
                aria-label="Tipo de Operación"
                value={operacion}
                onChange={(e) => setOperacion(e.target.value)}
                className="w-full bg-transparent text-crema font-body text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="venta" className="bg-navy-950 text-crema">
                  Comprar / Venta
                </option>
                <option value="alquiler" className="bg-navy-950 text-crema">
                  Alquiler
                </option>
                <option value="inversion" className="bg-navy-950 text-crema">
                  Inversión Estratégica
                </option>
              </select>
            </div>

            {/* Botón Buscar */}
            <button
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-dorado text-tierra font-body text-[11px] font-semibold tracking-[0.16em] uppercase hover:bg-dorado-light transition-all shadow-md shrink-0 active:scale-95"
            >
              <span>Buscar</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Marquee ticker ────────────────────────────────────────────────── */}
      <motion.div
        className="relative border-t border-crema/8 overflow-hidden h-11 backdrop-blur-sm shrink-0"
        style={{ background: "rgba(15,26,62,0.45)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        {/* Scroll indicator */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
          <div className="relative h-5 w-px overflow-hidden">
            <div
              className="absolute inset-0 bg-dorado/60"
              style={{ animation: "scrollDown 1.8s ease-in-out infinite" }}
            />
          </div>
        </div>

        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(15,26,62,0.5), transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, rgba(15,26,62,0.5), transparent)",
          }}
        />

        {/* Animating track */}
        <motion.div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "max-content",
          }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1.25rem",
                padding: "0 1.5rem",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              <span className="font-body text-crema/25 text-[9px] tracking-[0.4em] uppercase">
                {item}
              </span>
              <span className="text-dorado/30 text-[10px]">·</span>
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function WaIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
