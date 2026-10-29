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
        className="relative h-[78vh] min-h-[540px] max-w-[1400px] mx-auto overflow-hidden rounded-[2.5rem] lg:rounded-[3rem]"
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

        <div className="relative h-full px-5 lg:px-14 flex items-end lg:items-center justify-center lg:justify-end pb-5 lg:pb-0">
          <motion.div style={{ y: cardY }} className="w-full max-w-md">
          <motion.div
            className="w-full rounded-[2rem] border border-white/90 bg-white/80 backdrop-blur-xl shadow-[0_30px_70px_-30px_rgba(14,26,51,0.5)] p-7 lg:p-9"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center rounded-full bg-[#FBF0CF] text-[#7A5A12] font-body text-[11px] font-semibold tracking-[0.14em] uppercase px-3.5 py-1.5 mb-5">
              Mari Menuco · Neuquén
            </span>
            <h2
              className="font-display font-medium text-navy leading-[1.04] mb-5"
              style={{
                fontSize: "clamp(2.2rem, 4.4vw, 3.5rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Tu lote,{" "}
              <em className="not-italic italic text-[#A47C1B]">
                frente al lago
              </em>
            </h2>
            <ul className="space-y-2.5 mb-8">
              {PUNTOS.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 font-body text-navy/75 text-[15px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-dorado shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <Link
              href="/proyectos"
              className="btn-shimmer inline-flex items-center gap-3 rounded-full font-body text-tierra text-[11px] tracking-[0.16em] font-semibold uppercase px-8 py-4"
            >
              Ver lotes disponibles
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
