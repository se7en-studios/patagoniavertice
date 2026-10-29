import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { PropiedadDestacada } from "@/components/marketing/PropiedadesDestacadasHome";
import HomeClara from "@/components/home/HomeClara";

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

  return <HomeClara propiedades={propiedadesDestacadas} perfil={siteConfig.perfil} />;
}
