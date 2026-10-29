"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  FileSignature,
  KeyRound,
  TrendingUp,
} from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

const WA = WHATSAPP_NUMBER;

const servicios = [
  {
    num: "01",
    titulo: "Compra y Venta de Inmuebles",
    descripcion:
      "Gestionamos la compra y venta de propiedades residenciales y comerciales en Río Negro y la Patagonia.",
    waText: "Hola%2C%20me%20interesa%20comprar%20o%20vender%20un%20inmueble",
  },
  {
    num: "02",
    titulo: "Administración de Alquileres",
    descripcion:
      "Administramos tu propiedad de forma integral: búsqueda de inquilinos, cobros y mantenimiento.",
    waText:
      "Hola%2C%20me%20interesa%20la%20administraci%C3%B3n%20de%20alquiler",
  },
  {
    num: "03",
    titulo: "Consultoría Estratégica",
    descripcion:
      "Análisis de mercado, valuación de activos y asesoramiento en decisiones de inversión.",
    waText:
      "Hola%2C%20me%20interesa%20una%20consultor%C3%ADa%20estrat%C3%A9gica",
  },
  {
    num: "04",
    titulo: "Redacción y Revisión de Contratos",
    descripcion:
      "Redactamos y revisamos contratos de compraventa, locación y opciones de compra.",
    waText: "Hola%2C%20me%20interesa%20la%20revisi%C3%B3n%20de%20un%20contrato",
  },
];

const ICONOS = [Building2, KeyRound, TrendingUp, FileSignature];

// La tarjeta crece y se opaca del todo al llegar al centro de la pantalla.
function ServiceCard({
  s,
  i,
  prefersReduced,
}: {
  s: (typeof servicios)[number];
  i: number;
  prefersReduced: boolean | null;
}) {
  const Icon = ICONOS[i % ICONOS.length];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.5"],
  });
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? [1, 1] : [0.94, 1],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? [1, 1] : [0.45, 1],
  );

  // Spotlight dorado que sigue al cursor (solo CSS vars, sin re-render)
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      onMouseMove={handleMove}
      className="group relative overflow-hidden rounded-3xl p-8 lg:p-10 bg-white border border-white shadow-[0_18px_40px_-26px_rgba(14,26,51,0.35)] hover:shadow-[0_28px_60px_-28px_rgba(14,26,51,0.45)] transition-shadow duration-500"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(201,168,76,0.14), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <span
        className="absolute -bottom-3 right-4 font-display font-bold text-navy/[0.05] group-hover:text-dorado/[0.18] transition-colors duration-500 select-none pointer-events-none leading-none"
        style={{ fontSize: "7.5rem" }}
        aria-hidden="true"
      >
        {s.num}
      </span>

      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FBF0CF] text-[#7A5A12] transition-all duration-500 group-hover:bg-dorado group-hover:text-tierra">
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <span className="rounded-full bg-[#EAF0F7] px-3 py-1 font-body text-[11px] text-navy/60 tracking-[0.2em] uppercase">
            {s.num}
          </span>
        </div>
        <h3
          className="font-display font-medium text-navy leading-tight mb-4"
          style={{ fontSize: "clamp(1.3rem, 2vw, 1.6rem)" }}
        >
          {s.titulo}
        </h3>
        <p className="font-body text-[15px] leading-relaxed mb-8 text-navy/65 group-hover:text-navy/85 transition-colors duration-300">
          {s.descripcion}
        </p>
        <a
          href={`https://wa.me/${WA}?text=${s.waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.18em] uppercase text-[#8A6A1B] hover:text-navy transition-colors duration-200"
        >
          Consultar por WhatsApp
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </motion.div>
  );
}

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
  const prefersReduced = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);

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

  // El índice lateral sigue al servicio que está en foco.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.6", "end 0.6"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = listaServicios.length;
    setActivo(Math.max(0, Math.min(n - 1, Math.floor(v * n))));
  });

  return (
    <section className="py-24 lg:py-32 bg-[#EAF0F7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 mb-24 lg:mb-32">
          {/* Header fijo con índice (sticky en desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12 lg:mb-0 lg:sticky lg:top-32 lg:self-start"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-10 bg-dorado" />
              <span className="eyebrow !text-[#8A6A1B]">Lo que hacemos</span>
            </div>
            <h2
              className="font-display font-medium text-navy leading-[1.0] mb-5"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Nuestros{" "}
              <em className="not-italic italic text-[#A47C1B]">servicios</em>
            </h2>
            <p className="font-body text-navy/65 text-[15px] leading-relaxed max-w-md">
              Cuatro líneas de trabajo para acompañarte en cada etapa de tu
              operación inmobiliaria en la Patagonia.
            </p>

            {/* Índice: se enciende el servicio en foco */}
            <ol className="hidden lg:flex mt-10 gap-2" aria-label="Servicios">
              {listaServicios.map((s, i) => (
                <li
                  key={s.num}
                  aria-current={i === activo ? "true" : undefined}
                  className={`rounded-full px-4 py-2 font-body text-[11px] tracking-[0.2em] transition-colors duration-300 ${
                    i === activo
                      ? "bg-dorado text-tierra font-semibold"
                      : "bg-white text-navy/45"
                  }`}
                >
                  {s.num}
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Lista */}
          <div ref={listRef} className="grid grid-cols-1 gap-5 lg:gap-6">
            {listaServicios.map((s, i) => (
              <ServiceCard
                key={s.num}
                s={s}
                i={i}
                prefersReduced={prefersReduced}
              />
            ))}
          </div>
        </div>

        {/* Video - separado con border */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="pt-20 lg:pt-24 border-t border-navy/10"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-10 bg-dorado/60" />
                <span className="eyebrow !text-navy/50">
                  Video institucional
                </span>
              </div>
              <h3
                className="font-display font-medium text-navy leading-[1.0]"
                style={{
                  fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Conocé nuestro{" "}
                <em className="not-italic italic text-[#A47C1B]">proceso</em>
              </h3>
            </div>
            <p className="font-body text-navy/55 text-[15px] leading-relaxed max-w-xs lg:text-right">
              Un recorrido visual por cómo trabajamos en cada operación.
            </p>
          </div>

          <div className="flex justify-center">
            <VideoPlayer
              src="/videos/ALTUMSCI.mp4"
              poster="/videos/altumsci-poster.jpg"
              title="Servicios Altum"
            />
          </div>

          <div className="text-center mt-10">
            <a
              href={`https://wa.me/${WA}?text=Vi%20vuestro%20video%20y%20quiero%20consultar`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shimmer inline-flex items-center gap-3 rounded-full font-body text-tierra text-[11px] tracking-[0.15em] font-semibold uppercase px-9 py-4"
            >
              Consultar ahora
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
