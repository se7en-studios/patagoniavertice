"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const PUNTOS = [
  "Frente al lago con bajada náutica",
  "Agua y energía en el lote",
  "Escrituración con martillera colegiada",
];

export default function BandaLago() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      className="relative h-[78vh] min-h-[520px] overflow-hidden bg-navy-950"
    >
      <motion.div className="absolute inset-x-0 -inset-y-[14%]" style={{ y }}>
        <Image
          src="/mari-menuco/bahia-playas-2.jpg"
          alt="Costa del lago Mari Menuco con sombrilla de paja"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-navy-950/50 lg:bg-transparent" />
      <div className="absolute inset-0 bg-gradient-to-l from-navy-950/90 via-navy-950/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-900 to-transparent" />

      <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-end">
        <motion.div
          className="max-w-xl lg:mr-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-10 bg-dorado" />
            <span className="eyebrow">Mari Menuco · Neuquén</span>
          </div>
          <h2
            className="font-display font-medium text-crema leading-[1.02] mb-6"
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)",
              letterSpacing: "-0.025em",
            }}
          >
            Tu lote,{" "}
            <em className="not-italic italic text-dorado">frente al lago</em>
          </h2>
          <ul className="space-y-2.5 mb-9">
            {PUNTOS.map((p) => (
              <li
                key={p}
                className="flex items-center gap-3 font-body text-crema/85 text-[15px]"
              >
                <span className="w-1.5 h-1.5 rotate-45 bg-dorado shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          <Link
            href="/proyectos"
            className="btn-shimmer inline-flex items-center gap-3 font-body text-tierra text-[11px] tracking-[0.16em] font-semibold uppercase px-9 py-4"
          >
            Ver lotes disponibles
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
