"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ProyectoCard = {
  id: string;
  titulo: string;
  ubicacion: string | null;
  descripcion: string | null;
  estado: string | null;
  imagen: string | null;
};

const estadoBadge: Record<string, { label: string; bg: string; text: string }> = {
  disponible:      { label: "EN PREVENTA",  bg: "bg-dorado",    text: "text-tierra" },
  en_construccion: { label: "EN EJECUCIÓN", bg: "bg-[#2563EB]", text: "text-white"  },
  reservado:       { label: "RESERVADO",    bg: "bg-piedra/60", text: "text-crema"  },
  vendido:         { label: "ENTREGADO",    bg: "bg-salvia",    text: "text-white"  },
};

const AUTOPLAY_MS = 5000;

export default function ProyectosSliderClient({ proyectos }: { proyectos: ProyectoCard[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = proyectos.length;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const navigate = useCallback((idx: number) => {
    if (idx === current) return;
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    setProgress(0);
  }, [current]);

  const prev = useCallback(() => navigate((current - 1 + total) % total), [current, total, navigate]);
  const next = useCallback(() => navigate((current + 1) % total), [current, total, navigate]);

  // Auto-advance
  useEffect(() => {
    if (paused || total <= 1) return;

    setProgress(0);

    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + (100 / (AUTOPLAY_MS / 50)), 100));
    }, 50);

    intervalRef.current = setTimeout(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % total);
      setProgress(0);
    }, AUTOPLAY_MS);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, paused, total]);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="font-body text-crema/55 text-sm tracking-wider">
          Próximamente nuevos proyectos disponibles.
        </p>
      </div>
    );
  }

  const p = proyectos[current];
  const badge = p.estado ? (estadoBadge[p.estado] ?? estadoBadge.disponible) : estadoBadge.disponible;

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -50 : 50 }),
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 border border-tierra/8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Image panel */}
      <div className="relative overflow-hidden bg-arena aspect-[4/3] lg:aspect-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={p.id + "-img"}
            src={p.imagen ?? `https://placehold.co/800x600/EAD9C4/C49555?text=${encodeURIComponent(p.titulo)}`}
            alt={p.titulo}
            className="absolute inset-0 w-full h-full object-cover"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(28,25,22,0.65) 0%, transparent 55%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, rgba(28,25,22,0.25) 100%)" }} />

        {/* Ghost counter */}
        <div
          className="absolute top-6 left-6 font-display text-crema/10 font-medium leading-none select-none"
          style={{ fontSize: "clamp(5rem, 12vw, 8rem)", letterSpacing: "-0.05em" }}
        >
          {String(current + 1).padStart(2, "0")}
        </div>

        {/* Total */}
        <div className="absolute bottom-6 right-6 font-body text-crema/50 text-xs tracking-widest">
          / {String(total).padStart(2, "0")}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-crema/10">
          <motion.div
            className="h-full bg-dorado"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0 }}
          />
        </div>
      </div>

      {/* Content panel */}
      <div className="bg-tierra flex flex-col justify-between p-10 lg:p-14">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={p.id + "-content"}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Badge */}
            <div className="mb-8 flex items-center gap-3">
              <span className={`font-body text-[10px] tracking-[0.25em] px-3 py-1.5 ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
              {(p.estado === "en_construccion" || p.estado === "disponible") && (
                <span className={`inline-block w-1.5 h-1.5 rounded-full badge-pulse ${p.estado === "en_construccion" ? "bg-[#2563EB]" : "bg-dorado"}`} />
              )}
            </div>

            <div className="eyebrow text-dorado/35 mb-4">
              Proyecto {String(current + 1).padStart(2, "0")}
            </div>

            <h3
              className="font-display text-crema font-medium leading-[1.05] mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
            >
              {p.titulo}
            </h3>

            {p.ubicacion && (
              <div className="flex items-center gap-2 mb-5">
                <svg className="w-3.5 h-3.5 text-dorado/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-body text-crema/60 text-sm">{p.ubicacion}</span>
              </div>
            )}

            {p.descripcion && (
              <p className="font-body text-crema/55 text-[15px] leading-relaxed line-clamp-3 mb-8">
                {p.descripcion}
              </p>
            )}

            <Link
              href={`/proyectos/${p.id}`}
              className="inline-flex items-center gap-3 font-body text-[11px] tracking-[0.15em] font-medium uppercase text-crema border border-crema/12 px-7 py-3.5 hover:bg-dorado hover:text-tierra hover:border-dorado transition-all duration-300"
            >
              Ver Proyecto
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 border border-crema/12 flex items-center justify-center text-crema/60 hover:border-dorado hover:text-dorado transition-all duration-200"
            aria-label="Anterior"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="w-10 h-10 border border-crema/12 flex items-center justify-center text-crema/60 hover:border-dorado hover:text-dorado transition-all duration-200"
            aria-label="Siguiente"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2 ml-2">
            {proyectos.map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(i)}
                className={`h-px transition-all duration-500 ${i === current ? "w-10 bg-dorado" : "w-4 bg-crema/15 hover:bg-crema/30"}`}
                aria-label={`Proyecto ${i + 1}`}
              />
            ))}
          </div>

          {/* Pause indicator */}
          {paused && (
            <span className="ml-auto font-body text-crema/15 text-[9px] tracking-[0.25em] uppercase">
              pausado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
