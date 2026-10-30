import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import CatalogoInteractivo, {
  ItemPropiedad,
} from "@/components/marketing/CatalogoInteractivo";
import GuiaInversion from "@/components/marketing/GuiaInversion";

export const metadata = {
  title: "Propiedades & Oportunidades de Inversión | ALTUM SCI",
  description:
    "Catálogo exclusivo de lotes frente al lago en Mari Menuco, residencias en Cipolletti, departamentos y chacras en Río Negro y Neuquén. Asesoría directa y matriculada.",
};

const CATALOGO_FALLBACK: ItemPropiedad[] = [
  {
    id: "mari-menuco-primera-linea",
    titulo: "Lote Frente al Lago · Bahía de las Playas",
    barrio: "Barrio Privado Bahía de las Playas",
    ciudad: "Mari Menuco",
    tipo: "lote",
    estado: "disponible",
    imagenes: [
      "/mari-menuco/bahia-playas-1.jpg",
      "/mari-menuco/bahia-playas-2.jpg",
      "/mari-menuco/bahia-playas-3.jpg",
    ],
    descripcion:
      "Terreno exclusivo en primera línea de costa sobre el Lago Mari Menuco (a 65 km de Neuquén Capital). Cuenta con bajada náutica privada, servicios de agua y energía eléctrica, y proyectos aprobados de WakePark y Club House.",
    precio: 48000,
    moneda: "USD",
    superficie_m2: 1000,
    created_at: "2026-10-28",
  },
  {
    id: "residencia-cipolletti-premium",
    titulo: "Residencia Contemporánea con Piscina & Parque",
    barrio: "Barrio Residencial Consolidado",
    ciudad: "Cipolletti",
    tipo: "venta",
    estado: "disponible",
    imagenes: ["/casa.avif", "/noche.avif"],
    descripcion:
      "Propiedad de categoría desarrollada en dos plantas con aberturas DVH, calefacción por losa radiante, piscina climatizada, quincho integrado y parquización consolidada a 10 minutos de Neuquén Capital.",
    precio: 195000,
    moneda: "USD",
    superficie_m2: 310,
    created_at: "2026-10-25",
  },
  {
    id: "lote-panoramico-mari-menuco",
    titulo: "Terreno Panorámico con Bajada Náutica",
    barrio: "Bahía de las Playas · Sector Terrazas",
    ciudad: "Mari Menuco",
    tipo: "lote",
    estado: "disponible",
    imagenes: ["/mari-menuco/bahia-playas-2.jpg"],
    descripcion:
      "Ubicado en terraza natural sobreelevada con visuales abiertas de 180° al espejo de agua. Factibilidad constructiva inmediata, agua potable y red eléctrica en lote.",
    precio: 36000,
    moneda: "USD",
    superficie_m2: 850,
    created_at: "2026-10-24",
  },
  {
    id: "fraccion-desarrollo-catriel",
    titulo: "Fracción Estratégica para Renta & Logística",
    barrio: "Corredor Petrolero Norte",
    ciudad: "Catriel",
    tipo: "chacra",
    estado: "disponible",
    imagenes: ["/bosque.avif"],
    descripcion:
      "Fracción sobre corredor estratégico del eje energético norte patagónico. Ideal para base operativa, vivienda de ejecutivos o desarrollo comercial con renta en USD.",
    precio: 95000,
    moneda: "USD",
    superficie_m2: 2500,
    created_at: "2026-10-20",
  },
  {
    id: "departamento-corporativo-cipolletti",
    titulo: "Semipiso Premium en Torre Central",
    barrio: "Distrito Financiero",
    ciudad: "Cipolletti",
    tipo: "venta",
    estado: "disponible",
    imagenes: ["/noche.avif"],
    descripcion:
      "Semipiso luminoso con balcón terraza con parrilla, cochera cubierta y terminaciones de primera calidad. Alta demanda para alquiler corporativo.",
    precio: 125000,
    moneda: "USD",
    superficie_m2: 125,
    created_at: "2026-10-18",
  },
  {
    id: "lote-clubhouse-mari-menuco",
    titulo: "Lote con Servicios · Sector Club House",
    barrio: "Bahía de las Playas",
    ciudad: "Mari Menuco",
    tipo: "lote",
    estado: "disponible",
    imagenes: ["/mari-menuco/bahia-playas-3.jpg"],
    descripcion:
      "El ticket más competitivo para ingresar a Bahía de las Playas en Lago Mari Menuco. Lote plano de 750 m² con agua y luz, próximo al pórtico y futuro Club House.",
    precio: 32000,
    moneda: "USD",
    superficie_m2: 750,
    created_at: "2026-10-15",
  },
];

export default async function ProyectosPage() {
  let propiedades: ItemPropiedad[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("propiedades")
      .select("*")
      .eq("publicado", true)
      .order("destacado", { ascending: false });

    if (data && data.length > 0) {
      propiedades = data as unknown as ItemPropiedad[];
    }
  } catch {
    /* Supabase no disponible */
  }

  if (propiedades.length === 0) {
    propiedades = CATALOGO_FALLBACK;
  }

  return (
    <main className="bg-[#F6F8FB] min-h-screen">
      {/* ── Hero Minimalista PropTech (Estilo se7endev) ─────────────────── */}
      <section className="pt-36 pb-20 bg-[#070E1B] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/15 mb-5">
            <span className="rd-ping" />
            <span className="rd-label !text-[10px] !tracking-[0.22em] text-dorado">
              [PORTFOLIO ACTIVO · NEUQUÉN &amp; RÍO NEGRO]
            </span>
          </div>

          <h1
            className="rd-display text-white mb-5 max-w-4xl"
            style={{
              fontSize: "clamp(2.5rem, 5.4vw, 4.4rem)",
            }}
          >
            Activos inmobiliarios en{" "}
            <em className="rd-serif text-dorado">
              Patagonia Norte.
            </em>
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-5 border-t border-white/10">
            <p className="font-body text-white/70 text-sm lg:text-base max-w-2xl leading-relaxed">
              <strong>ALTUM SCI</strong> comercializa lotes frente al Lago Mari
              Menuco (desde USD 32.000), residencias en Cipolletti y fracciones
              logísticas en Catriel (Vaca Muerta) con títulos auditados y
              escrituración supervisada por la Martillera Estela Mari Rojas.
            </p>
            <span className="rd-label !text-[10.5px] !tracking-[0.18em] text-dorado shrink-0">
              Martillera Estela Mari Rojas · Mat. 35 RP 2026
            </span>
          </div>
        </div>
      </section>

      {/* ── Catálogo con Filtros Reactivos ────────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-[#F6F8FB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Suspense
            fallback={
              <div className="py-24 text-center font-body text-navy/50">
                Cargando catálogo...
              </div>
            }
          >
            <CatalogoInteractivo propiedadesIniciales={propiedades} />
          </Suspense>
        </div>
      </section>

      {/* ── Lead Magnet: Guía de Inversión ────────────────────────────────── */}
      <GuiaInversion />
    </main>
  );
}
