import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/marketing/Hero";
import Manifiesto from "@/components/marketing/Manifiesto";
import BandaLago from "@/components/marketing/BandaLago";
import SectionRail from "@/components/marketing/SectionRail";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { createClient } from "@/lib/supabase/server";
import type { PropiedadDestacada } from "@/components/marketing/PropiedadesDestacadasHome";
import { getSiteConfig } from "@/lib/site-config";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://altumsci.com.ar";

export const metadata: Metadata = {
  title:
    "ALTUM SCI · Servicios & Consultoría Inmobiliaria - Neuquén & Patagonia",
  description:
    "Lotes exclusivos frente al lago Mari Menuco, residencias en Cipolletti y oportunidades de inversión en Río Negro y Neuquén. Asesoría directa y martillera matriculada Estela Mari Rojas (Mat. 35 RP 2026).",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title:
      "ALTUM SCI · Servicios & Consultoría Inmobiliaria - Neuquén & Patagonia",
    description:
      "Terrenos frente al lago Mari Menuco, loteos y residencias en Neuquén y Río Negro. Seguridad jurídica, confidencialidad y transparencia total.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ALTUM SCI · Servicios & Consultoría Inmobiliaria",
      },
    ],
  },
};

const PropiedadesDestacadasHome = dynamic(
  () => import("@/components/marketing/PropiedadesDestacadasHome"),
);
const Servicios = dynamic(() => import("@/components/marketing/Servicios"));
const ZonasInteractivas = dynamic(
  () => import("@/components/marketing/ZonasInteractivas"),
);
const TasadorExpress = dynamic(
  () => import("@/components/marketing/TasadorExpress"),
);
const CalculadoraRentabilidad = dynamic(
  () => import("@/components/marketing/CalculadoraRentabilidad"),
);
const Nosotros = dynamic(() => import("@/components/marketing/Nosotros"));
const FAQ = dynamic(() => import("@/components/marketing/FAQ"));

export default async function HomePage() {
  let propiedadesDestacadas: PropiedadDestacada[] = [];
  const siteConfig = getSiteConfig();

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("propiedades")
      .select(
        "id, titulo, ciudad, barrio, precio, moneda, tipo, superficie_m2, imagenes",
      )
      .eq("publicado", true)
      .order("destacado", { ascending: false })
      .limit(6);

    if (data) {
      propiedadesDestacadas = data as unknown as PropiedadDestacada[];
    }
  } catch {
    /* Supabase not configured yet */
  }

  return (
    <>
      <SectionRail />

      <div id="sec-inicio">
        <Hero heroConfig={siteConfig.hero} />
        <Manifiesto statsCustom={siteConfig.statsManifiesto} />
      </div>

      <div id="sec-lago">
        <BandaLago config={siteConfig.bandaLago} />
      </div>

      <div id="sec-propiedades">
        <PropiedadesDestacadasHome propiedades={propiedadesDestacadas} />
      </div>

      <div id="sec-servicios">
        <Servicios serviciosCustom={siteConfig.servicios} />
      </div>

      <div id="sec-zonas">
        <ZonasInteractivas zonasCustom={siteConfig.zonas} />
      </div>

      <div id="sec-tasador">
        <TasadorExpress />
      </div>

      <div id="sec-calculadora">
        <CalculadoraRentabilidad />
      </div>

      <div id="sec-nosotros">
        <Nosotros perfil={siteConfig.perfil} />
      </div>

      <div id="sec-faq">
        <FAQ faqsCustom={siteConfig.faqs} />
        <FaqJsonLd />
      </div>
    </>
  );
}
