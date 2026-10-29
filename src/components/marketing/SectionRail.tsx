"use client";

import { useEffect, useState } from "react";

const STOPS = [
  { id: "sec-inicio", label: "Inicio" },
  { id: "sec-lago", label: "Mari Menuco" },
  { id: "sec-propiedades", label: "Propiedades" },
  { id: "sec-tasador", label: "Tasación" },
  { id: "sec-nosotros", label: "Nosotros" },
  { id: "sec-zonas", label: "Zonas" },
  { id: "sec-calculadora", label: "Inversión" },
  { id: "sec-servicios", label: "Servicios" },
  { id: "sec-proceso", label: "Proceso" },
  { id: "sec-faq", label: "Preguntas" },
];

// Riel lateral (solo escritorio ancho): un punto dorado marca en qué parte de la página estás.
export default function SectionRail() {
  const [active, setActive] = useState(-1);

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
    <nav
      aria-label="Recorrido de la página"
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 2xl:block transition-opacity duration-500"
      style={{ opacity: active < 0 ? 0 : 1 }}
    >
      <ol className="relative grid gap-4">
        <span
          aria-hidden="true"
          className="absolute bottom-1 left-[5px] top-1 w-px bg-crema/15"
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
                    ? "scale-125 border-dorado bg-dorado shadow-[0_0_14px_3px_rgba(201,168,76,0.6)]"
                    : i < active
                      ? "border-dorado/60 bg-dorado/40"
                      : "border-crema/30 bg-navy-950"
                }`}
              />
              <span className="whitespace-nowrap bg-navy-950/85 px-2.5 py-1 font-body text-[10px] uppercase tracking-[0.18em] text-crema opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {s.label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
