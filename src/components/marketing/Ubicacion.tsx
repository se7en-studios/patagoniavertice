"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Droplets, Route, Zap } from "lucide-react";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Lago+Mari+Menuco+Neuqu%C3%A9n";

const ROUTE_D =
  "M70 320 C150 320 150 210 240 210 S330 150 360 120 S420 100 450 96";

const DATOS = [
  {
    icon: Route,
    titulo: "A 65 km de Neuquén Capital",
    detalle: "Autovía directa por RP 7 y RP 51 hasta Bahía de las Playas",
  },
  {
    icon: Droplets,
    titulo: "Frente al lago con aguas cristalinas",
    detalle: "Costa de playa y bajada náutica privada para embarcaciones",
  },
  {
    icon: Zap,
    titulo: "Servicios disponibles en el lote",
    detalle: "Tendido de agua, energía eléctrica y escrituración colegiada",
  },
];

export default function Ubicacion() {
  return (
    <section className="relative bg-[#F6F8FB] py-20 lg:py-28 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-5">
          <span className="inline-flex items-center rounded-full bg-[#FBF0CF] text-[#7A5A12] font-body text-[11px] font-semibold tracking-[0.14em] uppercase px-3.5 py-1.5 mb-5">
            Conectividad &amp; Ubicación
          </span>
          <h2
            className="font-display font-medium text-navy leading-[1.04] mb-5"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Un paraíso natural, a{" "}
            <em className="not-italic italic text-[#A47C1B] tabular-nums">
              65 km
            </em>{" "}
            de la ciudad
          </h2>
          <p className="font-body text-navy/65 text-[15px] leading-relaxed mb-8 max-w-md">
            Mari Menuco combina la tranquilidad del lago con la cercanía a
            Neuquén Capital y Cipolletti: ideal para vivir, descansar el fin de
            semana o invertir con alta plusvalía.
          </p>

          <ul className="space-y-4">
            {DATOS.map(({ icon: Icon, titulo, detalle }, idx) => (
              <motion.li
                key={titulo}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="flex items-start gap-4 rounded-2xl border border-dorado/20 bg-white p-3.5 shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FBF0CF]/80 text-[#8A6A1B]">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-display text-navy font-semibold text-base sm:text-lg leading-tight">
                    {titulo}
                  </p>
                  <p className="font-body text-navy/60 text-xs sm:text-sm mt-1">
                    {detalle}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="rounded-[2rem] border border-dorado/25 bg-white p-4 sm:p-6 shadow-[0_30px_70px_-34px_rgba(14,26,51,0.4)]"
          >
            <svg
              viewBox="0 0 520 380"
              className="block w-full h-auto"
              role="img"
              aria-label="Ruta de 65 km desde Neuquén Capital hasta el lago Mari Menuco"
            >
              <defs>
                <linearGradient id="lagoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#9EC9EB" />
                  <stop offset="100%" stopColor="#CBE3F6" />
                </linearGradient>
                <pattern
                  id="mapGrid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#1A2752"
                    strokeOpacity="0.045"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="520" height="380" rx="24" fill="#EAF2F9" />
              <rect width="520" height="380" rx="24" fill="url(#mapGrid)" />

              {/* Curvas topográficas sutiles */}
              <path
                d="M280 40 C350 15 500 30 515 110 C525 165 460 205 390 190 C320 175 250 120 280 40 Z"
                fill="none"
                stroke="#9EC9EB"
                strokeOpacity="0.45"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />

              {/* Lago Mari Menuco */}
              <path
                d="M330 70 C380 40 480 50 500 100 C515 140 470 170 410 160 C360 152 300 120 330 70 Z"
                fill="url(#lagoGrad)"
                stroke="#7EB4E2"
                strokeWidth="1.5"
              />
              <path
                d="M350 96 C385 80 440 82 470 104"
                fill="none"
                stroke="#fff"
                strokeOpacity=".7"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Etiquetas de ruta */}
              <g opacity="0.85">
                <rect
                  x="142"
                  y="246"
                  width="52"
                  height="22"
                  rx="11"
                  fill="#fff"
                  stroke="#C9D6E6"
                />
                <text
                  x="168"
                  y="261"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#1A2752"
                >
                  RP 7
                </text>
                <rect
                  x="275"
                  y="150"
                  width="56"
                  height="22"
                  rx="11"
                  fill="#fff"
                  stroke="#C9D6E6"
                />
                <text
                  x="303"
                  y="165"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#1A2752"
                >
                  RP 51
                </text>
              </g>

              {/* Rosa de los vientos */}
              <g transform="translate(46, 46)" opacity="0.55">
                <circle r="16" fill="#fff" stroke="#1A2752" strokeWidth="1" />
                <path d="M0 -11 L3 0 L0 -2 L-3 0 Z" fill="#1A2752" />
                <text
                  y="-19"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill="#1A2752"
                >
                  N
                </text>
              </g>

              {/* Ruta punteada de base + trazado dorado animado una sola vez al entrar */}
              <path
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
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Hitos intermedios */}
              <circle
                cx="188"
                cy="242"
                r="6"
                fill="#fff"
                stroke="#D9AB47"
                strokeWidth="3"
              />
              <circle
                cx="315"
                cy="168"
                r="6"
                fill="#fff"
                stroke="#D9AB47"
                strokeWidth="3"
              />

              {/* Neuquén Capital */}
              <circle cx="70" cy="320" r="11" fill="#0F1B33" />
              <circle cx="70" cy="320" r="4" fill="#fff" />
              <text
                x="78"
                y="350"
                textAnchor="middle"
                fontSize="13"
                fontWeight="800"
                fill="#0F1B33"
              >
                Neuquén Capital
              </text>
              <text
                x="78"
                y="364"
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="#545D70"
              >
                Km 0 · Punto de partida
              </text>

              {/* Destino: Bahía de las Playas · Mari Menuco */}
              <g>
                <circle
                  cx="450"
                  cy="96"
                  r="22"
                  fill="#D9AB47"
                  fillOpacity="0.25"
                />
                <circle
                  cx="450"
                  cy="96"
                  r="11"
                  fill="#D9AB47"
                  stroke="#fff"
                  strokeWidth="3"
                />
                <text
                  x="430"
                  y="192"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill="#0F1B33"
                >
                  Bahía de las Playas
                </text>
                <text
                  x="430"
                  y="207"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#8A6A1B"
                >
                  Lago Mari Menuco · Km 65
                </text>
              </g>
            </svg>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-navy/10 px-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#DCECF8] text-[#25587F] font-body text-[11px] font-semibold tracking-[0.1em] uppercase px-3.5 py-1.5">
                  Mari Menuco · Neuquén
                </span>
                <span className="inline-flex items-center rounded-full bg-[#FBF0CF] text-[#7A5A12] font-body text-[11px] font-semibold tracking-[0.1em] uppercase px-3.5 py-1.5">
                  ~45 min por autovía
                </span>
              </div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-dorado/40 bg-white px-4 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-navy hover:bg-dorado hover:text-tierra transition-colors shadow-sm"
              >
                Abrir en Google Maps
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
