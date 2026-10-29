import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/marketing/Hero";
import Manifiesto from "@/components/marketing/Manifiesto";
import BandaLago from "@/components/marketing/BandaLago";
import CintaMarquee from "@/components/marketing/CintaMarquee";
import Ubicacion from "@/components/marketing/Ubicacion";
import SectionRail from "@/components/marketing/SectionRail";
import DecodeText from "@/components/ui/DecodeText";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { createClient } from "@/lib/supabase/server";
import type { PropiedadDestacada } from "@/components/marketing/PropiedadesDestacadasHome";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://altumsci.com.ar";

// ── Metadata específica de la home ──────────────────────────────────────────
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
  },
};

const CINTA_UBICACIONES = ["Mari Menuco", "Cipolletti", "Catriel", "General Roca", "Vaca Muerta"];
const CINTA_SERVICIOS = ["Compra & Venta", "Tasaciones", "Loteos", "Consultoría", "Contratos"];

// ── Lazy loading de secciones below-fold ────────────────────────────────────
const Nosotros = dynamic(() => import("@/components/marketing/Nosotros"));
const Servicios = dynamic(() => import("@/components/marketing/Servicios"));
const Proceso = dynamic(() => import("@/components/marketing/Proceso"));
const PropiedadesDestacadasHome = dynamic(
  () => import("@/components/marketing/PropiedadesDestacadasHome"),
);
const TasadorExpress = dynamic(
  () => import("@/components/marketing/TasadorExpress"),
);
const ZonasInteractivas = dynamic(
  () => import("@/components/marketing/ZonasInteractivas"),
);
const GuiaInversion = dynamic(
  () => import("@/components/marketing/GuiaInversion"),
);
const CalculadoraRentabilidad = dynamic(
  () => import("@/components/marketing/CalculadoraRentabilidad"),
);
const PorQueElegirnos = dynamic(
  () => import("@/components/marketing/BentoDiferenciadores"),
);
const FAQ = dynamic(() => import("@/components/marketing/FAQ"));
const CTAFinal = dynamic(() => import("@/components/marketing/CTAFinal"));
// Next 15 no permite ssr:false en Server Components; el canvas solo usa window dentro de useEffect.
const SpotlightCursor = dynamic(() => import("@/components/ui/SpotlightCursor"));

import { getSiteConfig } from "@/lib/site-config";

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
      <SpotlightCursor />
      <DecodeText />
      <SectionRail />

      <div id="sec-inicio">
        <Hero />
      </div>
      <Manifiesto />

      {/* Cinta de texto que reacciona a la velocidad del scroll */}
      <CintaMarquee items={CINTA_UBICACIONES} />

      {/* Banda full-bleed con parallax: Mari Menuco */}
      <div id="sec-lago">
        <BandaLago />
      </div>

      <div id="sec-propiedades">
        <PropiedadesDestacadasHome propiedades={propiedadesDestacadas} />
      </div>

      <Ubicacion />

      <div id="sec-tasador">
        <TasadorExpress />
      </div>

      <div id="sec-nosotros">
        <Nosotros perfil={siteConfig.perfil} />
      </div>

      <div id="sec-zonas">
        <ZonasInteractivas />
      </div>

      <GuiaInversion />

      <div id="sec-calculadora">
        <CalculadoraRentabilidad />
      </div>

      <CintaMarquee items={CINTA_SERVICIOS} direction={-1} />

      <div id="sec-servicios">
        <Servicios serviciosCustom={siteConfig.servicios} />
      </div>

      <div id="sec-proceso">
        <Proceso />
      </div>

      <PorQueElegirnos />

      <div id="sec-faq">
        <FAQ />
        <FaqJsonLd />
      </div>

      <CTAFinal />
    </>
  );
}
