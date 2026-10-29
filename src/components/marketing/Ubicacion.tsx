"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Droplets, MapPin, Route, Zap } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Lago+Mari+Menuco+Neuqu%C3%A9n";

const DATOS = [
  {
    icon: Route,
    titulo: "A 65 km de Neuquén Capital",
    detalle: "Barrio Privado Bahía de las Playas",
  },
  {
    icon: Droplets,
    titulo: "Frente al lago",
    detalle: "Con bajada náutica privada",
  },
  {
    icon: Zap,
    titulo: "Servicios en el lote",
    detalle: "Tendido de agua y luz",
  },
];

export default function Ubicacion() {
  return (
    <section className="bg-navy-900 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-10 bg-dorado" />
            <span className="eyebrow">Ubicación</span>
          </div>
          <h2
            className="font-display font-medium text-crema leading-[1.02] mb-6"
            style={{
              fontSize: "clamp(2.2rem, 4.6vw, 3.6rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Un lago, a{" "}
            <em className="not-italic italic text-dorado">
              <AnimatedNumber value={65} /> km
            </em>{" "}
            de la ciudad
          </h2>
          <p className="font-body text-crema/70 text-[15px] leading-relaxed mb-10 max-w-md">
            Mari Menuco combina la tranquilidad de la costa con la cercanía a
            Neuquén Capital: ideal para vivir, descansar o invertir.
          </p>

          <ul className="space-y-6">
            {DATOS.map(({ icon: Icon, titulo, detalle }) => (
              <li key={titulo} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-dorado/40 bg-dorado/10 text-dorado">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-display text-crema text-lg leading-tight">
                    {titulo}
                  </p>
                  <p className="font-body text-crema/60 text-sm mt-1">
                    {detalle}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="lg:col-span-7 relative"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-[4/3] lg:aspect-[16/11] overflow-hidden border border-dorado/30 shadow-2xl bg-navy-950"
          >
            <Image
              src="/mari-menuco/bahia-playas-2.jpg"
              alt="Costa del lago Mari Menuco"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-bottom transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 lg:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center bg-dorado text-tierra">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-crema text-xl leading-tight">
                    Mari Menuco · Neuquén
                  </p>
                  <p className="font-body text-crema/70 text-xs mt-0.5">
                    Barrio Privado Bahía de las Playas
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-dorado group-hover:text-crema transition-colors">
                Ver en Google Maps
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
