"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Droplets, Route, Zap } from "lucide-react";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Lago+Mari+Menuco+Neuqu%C3%A9n";

const ROUTE_D =
  "M70 320 C150 320 150 210 240 210 S330 150 360 120 S420 100 450 96";
const KM_TOTAL = 65;

// `at` = progreso de la ruta (0-1) en el que se enciende cada dato.
const DATOS = [
  {
    icon: Route,
    titulo: "A 65 km de Neuquén Capital",
    detalle: "Barrio Privado Bahía de las Playas",
    at: 0.3,
  },
  {
    icon: Droplets,
    titulo: "Frente al lago",
    detalle: "Con bajada náutica privada",
    at: 0.6,
  },
  {
    icon: Zap,
    titulo: "Servicios en el lote",
    detalle: "Tendido de agua y luz",
    at: 0.9,
  },
];

function Dato({
  dato,
  route,
}: {
  dato: (typeof DATOS)[number];
  route: MotionValue<number>;
}) {
  const { icon: Icon, titulo, detalle, at } = dato;
  const opacity = useTransform(route, [at - 0.12, at], [0.3, 1]);
  const x = useTransform(route, [at - 0.12, at], [-10, 0]);
  const glow = useTransform(route, [at - 0.12, at], [0, 1]);
  return (
    <motion.li style={{ opacity, x }} className="flex items-center gap-4">
      <motion.span
        style={{ opacity: glow }}
        className="absolute h-11 w-11 rounded-2xl bg-[#FBF0CF]"
        aria-hidden="true"
      />
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-navy/10 bg-white text-[#8A6A1B] shadow-sm">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <div>
        <p className="font-display text-navy text-base sm:text-lg leading-tight">
          {titulo}
        </p>
        <p className="hidden sm:block font-body text-navy/60 text-sm mt-1">
          {detalle}
        </p>
      </div>
    </motion.li>
  );
}

export default function Ubicacion() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pinRef = useRef<SVGGElement>(null);
  const [stops, setStops] = useState<{ x: number; y: number }[]>([]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const done = useMotionValue(1);
  // Con reduced-motion queda el estado final, sin sticky ni scroll largo.
  const progress = reduced ? done : scrollYProgress;
  const route = useTransform(progress, [0.06, 0.92], [0, 1], { clamp: true });
  const km = useTransform(route, (v) => Math.round(v * KM_TOTAL));
  const labelOpacity = useTransform(route, [0.85, 1], [0.4, 1]);

  const movePin = (v: number) => {
    const path = pathRef.current;
    const pin = pinRef.current;
    if (!path || !pin) return;
    const pt = path.getPointAtLength(path.getTotalLength() * v);
    pin.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
  };
  useMotionValueEvent(route, "change", movePin);
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    setStops(
      DATOS.map(({ at }) => {
        const pt = path.getPointAtLength(total * at);
        return { x: pt.x, y: pt.y };
      }),
    );
    movePin(route.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={ref}
      className={`relative bg-[#F6F8FB] ${reduced ? "py-24" : "h-[280vh]"}`}
    >
      <div
        className={
          reduced
            ? "max-w-7xl mx-auto px-6 lg:px-12"
            : "sticky top-0 h-[100svh] min-h-[560px] flex items-center overflow-hidden pt-16"
        }
      >
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center rounded-full bg-[#FBF0CF] text-[#7A5A12] font-body text-[11px] font-semibold tracking-[0.14em] uppercase px-3.5 py-1.5 mb-5 lg:mb-7">
              Ubicación
            </span>
            <h2
              className="font-display font-medium text-navy leading-[1.02] mb-4 lg:mb-6"
              style={{
                fontSize: "clamp(2rem, 4.6vw, 3.6rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Un lago, a{" "}
              <em className="not-italic italic text-[#A47C1B] tabular-nums">
                <motion.span>{km}</motion.span> km
              </em>{" "}
              de la ciudad
            </h2>
            <p className="font-body text-navy/65 text-[15px] leading-relaxed mb-6 lg:mb-9 max-w-md">
              Mari Menuco combina la tranquilidad de la costa con la cercanía a
              Neuquén Capital: ideal para vivir, descansar o invertir.
            </p>

            <ul className="relative space-y-3 lg:space-y-5">
              {DATOS.map((d) => (
                <Dato key={d.titulo} dato={d} route={route} />
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[2rem] border border-white bg-white/80 backdrop-blur-xl p-3 sm:p-5 shadow-[0_30px_70px_-34px_rgba(14,26,51,0.45)]">
              <svg
                viewBox="0 0 520 380"
                className="block w-full h-auto max-h-[42svh] lg:max-h-[58svh]"
                role="img"
                aria-label="Ruta de 65 km desde Neuquén Capital hasta el lago Mari Menuco"
              >
                <rect width="520" height="380" rx="24" fill="#EAF2F9" />
                {/* Lago */}
                <path
                  d="M330 70 C380 40 480 50 500 100 C515 140 470 170 410 160 C360 152 300 120 330 70 Z"
                  fill="#BCD8F0"
                />
                <path
                  d="M350 96 C385 80 440 82 470 104"
                  fill="none"
                  stroke="#fff"
                  strokeOpacity=".7"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Ruta base + ruta que se dibuja */}
                <path
                  ref={pathRef}
                  d={ROUTE_D}
                  fill="none"
                  stroke="#C9D6E6"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="1 11"
                />
                <motion.path
                  d={ROUTE_D}
                  fill="none"
                  stroke="#D9AB47"
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{ pathLength: route }}
                />
                {/* Hitos de los tres datos */}
                {stops.map((s, i) => (
                  <Stop
                    key={DATOS[i].titulo}
                    x={s.x}
                    y={s.y}
                    at={DATOS[i].at}
                    route={route}
                  />
                ))}
                {/* Neuquén */}
                <circle cx="70" cy="320" r="11" fill="#0F1B33" />
                <circle cx="70" cy="320" r="4" fill="#fff" />
                <text
                  x="70"
                  y="354"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="800"
                  fill="#0F1B33"
                >
                  Neuquén
                </text>
                {/* Mari Menuco */}
                <motion.g style={{ opacity: labelOpacity }}>
                  <circle
                    cx="450"
                    cy="96"
                    r="14"
                    fill="#fff"
                    stroke="#D9AB47"
                    strokeWidth="4"
                  />
                  <text
                    x="440"
                    y="196"
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="800"
                    fill="#0F1B33"
                  >
                    Mari Menuco
                  </text>
                </motion.g>
                {/* Marcador que avanza */}
                <g ref={pinRef}>
                  <circle r="20" fill="#D9AB47" fillOpacity=".28" />
                  <circle r="9" fill="#D9AB47" stroke="#fff" strokeWidth="3" />
                </g>
              </svg>
              <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1">
                <span className="inline-flex items-center rounded-full bg-[#DCECF8] text-[#25587F] font-body text-[11px] font-semibold tracking-[0.1em] uppercase px-3.5 py-1.5">
                  Mari Menuco · Neuquén
                </span>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-navy hover:border-dorado hover:text-[#8A6A1B] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dorado"
                >
                  Ver en Google Maps
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stop({
  x,
  y,
  at,
  route,
}: {
  x: number;
  y: number;
  at: number;
  route: MotionValue<number>;
}) {
  const scale = useTransform(route, [at - 0.04, at], [0, 1]);
  return (
    <motion.circle
      cx={x}
      cy={y}
      r="8"
      fill="#fff"
      stroke="#D9AB47"
      strokeWidth="3"
      style={{ scale, transformBox: "fill-box", transformOrigin: "center" }}
    />
  );
}
