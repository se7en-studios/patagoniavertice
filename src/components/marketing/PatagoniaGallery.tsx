"use client";

import Image from "next/image";

const IMAGES = [
  {
    url: "/mari-menuco/bahia-playas-1.jpg",
    alt: "Bahía de las Playas - Lago Mari Menuco",
    caption: "Lago Mari Menuco · Neuquén",
  },
  {
    url: "/casa.avif",
    alt: "Residencias de categoría en Cipolletti",
    caption: "Cipolletti · Río Negro",
  },
  {
    url: "/bosque.avif",
    alt: "Entorno natural patagónico",
    caption: "Corredor Patagónico",
  },
];

export default function PatagoniaGallery() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-3.5 h-[440px] sm:h-[520px] md:h-[560px]">
      {/* Imagen 1 - ocupa las 2 filas izquierda */}
      <div className="relative row-span-2 overflow-hidden rounded-3xl border border-dorado/25 shadow-lg group">
        <Image
          src={IMAGES[0].url}
          alt={IMAGES[0].alt}
          fill
          sizes="(max-width: 768px) 50vw, 35vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 right-4 text-[11px] font-body font-medium text-white tracking-wider uppercase">
          {IMAGES[0].caption}
        </span>
      </div>

      {/* Imagen 2 - fila superior derecha */}
      <div className="relative overflow-hidden rounded-3xl border border-dorado/20 shadow-md group">
        <Image
          src={IMAGES[1].url}
          alt={IMAGES[1].alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/65 via-transparent to-transparent" />
        <span className="absolute bottom-3.5 left-4 text-[10px] font-body font-medium text-white tracking-wider uppercase">
          {IMAGES[1].caption}
        </span>
      </div>

      {/* Imagen 3 - fila inferior derecha con badge */}
      <div className="relative overflow-hidden rounded-3xl border border-dorado/20 shadow-md group">
        <Image
          src={IMAGES[2].url}
          alt={IMAGES[2].alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/65 via-transparent to-transparent" />
        <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase z-10 bg-dorado text-tierra shadow-sm">
          Patagonia
        </div>
        <span className="absolute bottom-3.5 left-4 text-[10px] font-body font-medium text-white tracking-wider uppercase">
          {IMAGES[2].caption}
        </span>
      </div>
    </div>
  );
}
