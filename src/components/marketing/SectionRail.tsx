"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const STOPS = [
  { id: "sec-inicio", label: "Inicio" },
  { id: "sec-lago", label: "Mari Menuco" },
  { id: "sec-propiedades", label: "Propiedades" },
  { id: "sec-servicios", label: "Propuesta & Servicios" },
  { id: "sec-zonas", label: "Territorios" },
  { id: "sec-tasador", label: "Tasación" },
  { id: "sec-calculadora", label: "Simulador ROI" },
  { id: "sec-nosotros", label: "Estela Rojas" },
  { id: "sec-faq", label: "Preguntas" },
];

export default function SectionRail() {
  const [active, setActive] = useState(-1);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const els = STOPS.map((s) => document.getElementById(s.id));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Barra superior dorada de progreso de lectura (GPU scaleX) */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 z-[60] h-[2.5px] bg-gradient-to-r from-[#8A6A1B] via-dorado to-[#E5C875] origin-left pointer-events-none"
      />

      <nav
        aria-label="Recorrido de la página"
        className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 2xl:block transition-opacity duration-500"
        style={{ opacity: active < 0 ? 0 : 1 }}
      >
        <ol className="relative grid gap-3.5">
          <span
            aria-hidden="true"
            className="absolute bottom-1 left-[5px] top-1 w-px bg-navy/15"
          />
          {STOPS.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-label={s.label}
                aria-current={i === active ? "location" : undefined}
                className="group relative flex items-center gap-3"
              >
                <span
                  aria-hidden="true"
                  className={`relative z-10 block size-[11px] rounded-full border transition-all duration-500 ${
                    i === active
                      ? "scale-125 border-dorado bg-dorado shadow-[0_0_14px_3px_rgba(201,168,76,0.5)]"
                      : i < active
                        ? "border-dorado/60 bg-dorado/40"
                        : "border-navy/25 bg-white"
                  }`}
                />
                <span className="whitespace-nowrap rounded-full bg-white/95 border border-navy/10 px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-navy opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {s.label}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
