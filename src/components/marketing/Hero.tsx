"use client";

import { useRouter } from "next/navigation";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

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
  { text: "Patagonia.", cls: "text-[#A47C1B]" },
];

// Cada selector se achica al texto elegido (field-sizing) y se subraya en dorado.
const SELECT =
  "appearance-none bg-transparent font-display font-semibold text-navy border-b-2 border-dorado/70 hover:border-dorado focus:outline-none focus:border-dorado cursor-pointer [field-sizing:content] max-w-full";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const [operacion, setOperacion] = useState("venta");
  const [tipo, setTipo] = useState("todos");
  const [zona, setZona] = useState("todas");

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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.65], [1, 0.94]);

  // El video arranca dentro de un marco redondeado y se abre hasta llenar la pantalla.
  const inset = useTransform(scrollYProgress, [0, 0.35], [4, 0]);
  const radius = useTransform(scrollYProgress, [0, 0.35], [56, 0]);
  const frame = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col overflow-hidden bg-[#F6F8FB]"
    >
      <motion.div className="absolute inset-0" style={{ clipPath: frame }}>
        <motion.div className="absolute inset-0" style={{ y: bgY, scale: 1.1 }}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover [filter:brightness(1.3)_saturate(0.85)]"
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
        {/* Velo claro: deja leer el texto oscuro sin apagar el video */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F6F8FB]/90 via-[#F6F8FB]/55 to-[#F6F8FB]/0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F6F8FB]/70 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        className="relative flex-1 flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-12 w-full pt-28 md:pt-32 pb-14 md:pb-20"
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
      >
        {/* Eyebrow badge editorial */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-dorado/35 shadow-sm self-start mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-dorado" />
          <span className="font-body text-[11px] font-semibold tracking-[0.2em] uppercase text-navy/80">
            ALTUM SCI · Servicios & Consultoría Inmobiliaria
          </span>
          <span className="hidden sm:inline font-body text-[11px] text-[#8A6A1B] font-medium">
            · Neuquén & Río Negro
          </span>
        </motion.div>

        <h1
          className="font-display font-semibold leading-[1.02] mb-6 max-w-4xl"
          style={{
            fontSize: "clamp(2.4rem, min(6.4vw, 9.5vh), 5.5rem)",
            letterSpacing: "-0.03em",
          }}
          aria-label={TITLE_LINES.map((l) => l.text).join(" ")}
        >
          {TITLE_LINES.map((line, i) => (
            <span
              key={line.text}
              className="block overflow-hidden pb-[0.08em]"
              aria-hidden="true"
            >
              <span
                className={`hero-line block ${line.cls}`}
                style={{ "--d": `${0.3 + i * 0.14}s` } as React.CSSProperties}
              >
                {line.text}
              </span>
            </span>
          ))}
        </h1>

        {/* Búsqueda en una frase */}
        <div
          style={{ "--d": "0.9s" } as React.CSSProperties}
          className="hero-rise [--rise:30px] w-full max-w-4xl rounded-[2rem] border border-white/90 bg-white/80 backdrop-blur-xl shadow-[0_24px_60px_-28px_rgba(14,26,51,0.35)] p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 ring-1 ring-dorado/20"
        >
          <p className="flex-1 font-display text-navy/85 text-lg md:text-2xl leading-[1.9] md:leading-[2]">
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
            className="group shrink-0 inline-flex items-center justify-center gap-3 self-stretch md:self-auto rounded-full bg-dorado hover:bg-gold-400 text-tierra font-body text-[11px] font-semibold tracking-[0.18em] uppercase px-8 py-4 transition-all duration-300 shadow-[0_10px_25px_-8px_rgba(184,150,90,0.6)]"
          >
            Buscar
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Chips de filtro rápido */}
        <div
          style={{ "--d": "1.0s" } as React.CSSProperties}
          className="hero-rise mt-3.5 flex flex-wrap items-center gap-2 text-xs font-body"
        >
          <span className="text-navy/45 text-[11px] uppercase tracking-wider font-semibold mr-1">
            Destacados:
          </span>
          {[
            { label: "Lotes en Mari Menuco", t: "lote", z: "Neuquén" },
            { label: "Residencias Cipolletti", t: "venta", z: "Cipolletti" },
            { label: "Oportunidades Catriel", t: "todos", z: "Catriel" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setTipo(item.t);
                setZona(item.z);
              }}
              className="px-3 py-1 rounded-full bg-white/70 hover:bg-white border border-black/5 hover:border-dorado/50 text-navy/70 hover:text-navy text-[11px] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Respaldo y contacto */}
        <div
          style={{ "--d": "1.15s" } as React.CSSProperties}
          className="hero-rise mt-5 flex flex-wrap items-center justify-between gap-y-3 font-body text-[11px] tracking-[0.14em] uppercase text-navy/60 pt-3 border-t border-navy/10 max-w-4xl"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Operaciones seguras con Martillera Matriculada (Mat. 35 RP 2026)
          </span>
          <a
            href={WA_HERO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-navy hover:text-[#8A6A1B] border-b border-navy/30 hover:border-dorado transition-colors"
          >
            <span>Hablar directamente con Estela</span>
            <span>→</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
