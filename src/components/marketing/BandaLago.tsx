"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const PUNTOS = [
  "Frente al lago con bajada náutica",
  "Agua y energía en el lote",
  "Escrituración con martillera colegiada",
];

// Foto enmarcada con parallax y una tarjeta de vidrio encima.
export default function BandaLago() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const reduced = useReducedMotion();
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["-10%", "10%"],
  );
  // Capas: el marco se abre al entrar y la tarjeta viaja más rápido que la foto.
  const frameScale = useTransform(
    scrollYProgress,
    [0, 0.35],
    reduced ? [1, 1] : [0.92, 1],
  );
  const cardY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [90, -90],
  );

  return (
    <section
      ref={ref}
      className="relative bg-[#F6F8FB] px-4 lg:px-8 py-10 lg:py-16"
    >
      <motion.div
        style={{ scale: frameScale }}
        className="relative h-[80vh] min-h-[560px] max-w-[1400px] mx-auto overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] shadow-[0_30px_70px_-30px_rgba(14,26,51,0.45)] border border-dorado/20"
      >
        <motion.div className="absolute inset-x-0 -inset-y-[12%]" style={{ y }}>
          <Image
            src="/mari-menuco/bahia-playas-2.jpg"
            alt="Costa del lago Mari Menuco con sombrilla de paja"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-navy-950/20" />

        {/* Badge superior izquierdo sobre la foto */}
        <div className="absolute top-6 left-6 lg:top-10 lg:left-10 z-10 hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-navy-950/70 backdrop-blur-md border border-white/20 text-white font-body text-[11px] tracking-[0.16em] uppercase">
          <span className="w-2 h-2 rounded-full bg-dorado animate-pulse" />
          <span>Bahía de las Playas · Lago Mari Menuco</span>
        </div>

        <div className="relative h-full px-5 lg:px-14 flex items-end lg:items-center justify-center lg:justify-end pb-5 lg:pb-0">
          <motion.div style={{ y: cardY }} className="w-full max-w-md">
            <motion.div
              className="w-full rounded-[2rem] border border-white/95 bg-white/88 backdrop-blur-xl shadow-[0_30px_70px_-25px_rgba(14,26,51,0.55)] p-7 lg:p-9 ring-1 ring-dorado/25"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between gap-2 mb-5">
                <span className="inline-flex items-center rounded-full bg-[#FBF0CF] text-[#7A5A12] font-body text-[11px] font-semibold tracking-[0.14em] uppercase px-3.5 py-1.5">
                  Mari Menuco · Neuquén
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-navy/50 font-semibold">
                  Desde USD 32.000
                </span>
              </div>
              <h2
                className="font-display font-medium text-navy leading-[1.04] mb-4"
                style={{
                  fontSize: "clamp(2.2rem, 4.4vw, 3.4rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                Tu lote,{" "}
                <em className="not-italic italic text-[#A47C1B]">
                  frente al lago
                </em>
              </h2>

              {/* Mini indicadores clave */}
              <div className="grid grid-cols-3 gap-2 mb-5 py-3 border-y border-navy/10 text-center">
                <div>
                  <span className="block font-display text-base font-bold text-navy">
                    750–1000 m²
                  </span>
                  <span className="block font-body text-[9px] uppercase tracking-wider text-navy/55">
                    Superficie
                  </span>
                </div>
                <div className="border-x border-navy/10">
                  <span className="block font-display text-base font-bold text-navy">
                    65 km
                  </span>
                  <span className="block font-body text-[9px] uppercase tracking-wider text-navy/55">
                    De Neuquén
                  </span>
                </div>
                <div>
                  <span className="block font-display text-base font-bold text-[#8A6A1B]">
                    100%
                  </span>
                  <span className="block font-body text-[9px] uppercase tracking-wider text-navy/55">
                    Con Servicios
                  </span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-7">
                {PUNTOS.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-3 font-body text-navy/80 text-[14px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-dorado shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/proyectos?ciudad=Neuquén"
                  className="btn-shimmer flex-1 inline-flex items-center justify-center gap-2.5 rounded-full font-body text-tierra text-[11px] tracking-[0.16em] font-semibold uppercase px-6 py-3.5 shadow-md"
                >
                  Ver lotes disponibles
                  <span aria-hidden="true">→</span>
                </Link>
                <a
                  href="https://wa.me/5492996095742?text=Hola%20Estela%20(ALTUM%20SCI)%2C%20quisiera%20recibir%20informaci%C3%B3n%20sobre%20los%20lotes%20en%20Mari%20Menuco."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-navy/15 bg-white hover:border-dorado px-4 py-3.5 font-body text-[11px] font-semibold uppercase tracking-wider text-navy hover:text-[#8A6A1B] transition-colors"
                >
                  Consultar
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
