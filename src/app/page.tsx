import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/marketing/Hero";
import Ubicacion from "@/components/marketing/Ubicacion";
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


// ── Lazy loading de secciones below-fold ────────────────────────────────────
const Nosotros = dynamic(() => import("@/components/marketing/Nosotros"));
const PropiedadesDestacadasHome = dynamic(
  () => import("@/components/marketing/PropiedadesDestacadasHome"),
);
const TasadorExpress = dynamic(
  () => import("@/components/marketing/TasadorExpress"),
);
const FAQ = dynamic(() => import("@/components/marketing/FAQ"));
const CTAFinal = dynamic(() => import("@/components/marketing/CTAFinal"));

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
      <DecodeText />

      <div id="sec-inicio">
        <Hero />
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

      <div id="sec-faq">
        <FAQ />
        <FaqJsonLd />
      </div>

      <CTAFinal />
    </>
  );
}
