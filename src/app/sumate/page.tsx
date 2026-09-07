import type { Metadata } from "next";
import Image from "next/image";
import SumateContent from "@/components/marketing/SumateContent";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://altumsci.com.ar";

export const metadata: Metadata = {
  title: "Sumate al Equipo",
  description:
    "Desarrollá tu carrera profesional en bienes raíces en Río Negro y la Patagonia. Buscamos martilleros, corredores y agentes comerciales apasionados por el Real Estate.",
  alternates: { canonical: `${siteUrl}/sumate` },
};

export default function SumatePage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Hero */}
      <div
        className="relative bg-navy-950 pt-40 pb-32 overflow-hidden text-crema"
        style={{ background: "#060A13" }}
      >
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=75"
            alt="Equipo Altum Inmobiliaria en la Patagonia"
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(6,10,19,0.55), rgba(6,10,19,0.95))",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-10 bg-dorado" />
            <span className="font-body text-dorado text-[11px] tracking-[0.3em] uppercase">
              Carrera Inmobiliaria
            </span>
          </div>
          <h1
            className="font-display text-crema font-medium leading-[1.05] mb-6 max-w-3xl"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Construí tu futuro{" "}
            <span className="italic text-dorado font-normal">con Altum</span>
          </h1>
          <p className="font-body text-crema/45 text-base leading-relaxed max-w-xl">
            Somos un equipo comprometido con el desarrollo y la transparencia en
            Río Negro y la Patagonia. Si buscás un entorno profesional con
            respaldo legal y comisiones competitivas, queremos conocerte.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dorado/30 to-transparent" />
      </div>

      <SumateContent />
    </main>
  );
}
