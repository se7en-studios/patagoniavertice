"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const IMAGES = [
  {
    url: "/casa.avif",
    alt: "Casa junto al lago - Patagonia",
    caption: "Neuquén, Patagonia",
  },
  {
    url: "/bosque.avif",
    alt: "Bosque patagónico",
    caption: "Río Negro · Neuquén",
  },
  {
    url: "/noche.avif",
    alt: "Patagonia de noche",
    caption: "Patagonia Argentina",
  },
];

export default function PatagoniaGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 grid-rows-2 gap-2 h-[500px] md:h-[580px]"
    >
      {/* Imagen 1 - ocupa las 2 filas izquierda */}
      <motion.div
        style={{ y: y1 }}
        className="relative row-span-2 overflow-hidden group"
      >
        <Image
          src={IMAGES[0].url}
          alt={IMAGES[0].alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute bottom-3 left-3 text-xs text-white/80 tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {IMAGES[0].caption}
        </span>
      </motion.div>

      {/* Imagen 2 - fila superior derecha */}
      <motion.div style={{ y: y2 }} className="relative overflow-hidden group">
        <Image
          src={IMAGES[1].url}
          alt={IMAGES[1].alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute bottom-3 left-3 text-xs text-white/80 tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {IMAGES[1].caption}
        </span>
      </motion.div>

      {/* Imagen 3 - fila inferior derecha con badge */}
      <motion.div style={{ y: y3 }} className="relative overflow-hidden group">
        <Image
          src={IMAGES[2].url}
          alt={IMAGES[2].alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div
          className="absolute top-3 right-3 px-2 py-1 text-xs font-medium tracking-widest uppercase z-10"
          style={{ backgroundColor: "#C9A84C", color: "#1A2752" }}
        >
          Patagonia
        </div>
      </motion.div>
    </div>
  );
}
