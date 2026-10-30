"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 180);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = STOPS.map((s) => document.getElementById(s.id));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = els.indexOf(e.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { rootMargin: "-42% 0px -48% 0px" },
    );
    els.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const progressRatio =
    STOPS.length > 1 ? Math.max(0, active) / (STOPS.length - 1) : 0;

  return (
    <nav
      aria-label="Recorrido de la página"
      className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block transition-opacity duration-500"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="rounded-2xl bg-white/85 backdrop-blur-md border border-navy/10 px-2.5 py-3.5 shadow-[0_12px_32px_-12px_rgba(14,26,51,0.18)]">
        {/* Indicador numérico de estación activa */}
        <div className="mb-3 pb-2 border-b border-navy/[0.08] text-center">
          <span className="block font-mono text-[9px] font-bold text-[#8A6A1B] tracking-wider">
            0{active + 1}
          </span>
          <span className="block font-mono text-[8px] text-navy/35">
            /0{STOPS.length}
          </span>
        </div>

        <ol className="relative grid gap-3 justify-items-center">
          {/* Línea base gris */}
          <span
            aria-hidden="true"
            className="absolute bottom-1 left-1/2 -translate-x-1/2 top-1 w-[1.5px] bg-navy/12 rounded-full"
          />
          {/* Línea de progreso dorada animada con GPU scaleY */}
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={{ scaleY: progressRatio }}
            transition={{ type: "spring", stiffness: 120, damping: 24 }}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 top-1 w-[1.5px] bg-dorado origin-top rounded-full"
          />

          {STOPS.map((s, i) => {
            const isCurrent = i === active;
            const isPast = i < active;
            return (
              <li key={s.id} className="relative">
                <a
                  href={`#${s.id}`}
                  aria-label={s.label}
                  aria-current={isCurrent ? "location" : undefined}
                  className="group relative flex items-center"
                >
                  <span
                    aria-hidden="true"
                    className={`relative z-10 block size-2.5 rounded-full border transition-all duration-300 ${
                      isCurrent
                        ? "scale-125 border-dorado bg-[#0B1528] ring-4 ring-dorado/25"
                        : isPast
                          ? "border-dorado bg-dorado"
                          : "border-navy/25 bg-white group-hover:border-dorado"
                    }`}
                  />
                  <span className="pointer-events-none absolute left-6 whitespace-nowrap rounded-full bg-[#0B1528] text-white border border-dorado/40 px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                    <span className="text-dorado mr-1.5">0{i + 1}</span>
                    {s.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
