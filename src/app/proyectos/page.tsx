import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import CatalogoInteractivo, {
  ItemPropiedad,
} from "@/components/marketing/CatalogoInteractivo";
import GuiaInversion from "@/components/marketing/GuiaInversion";

export const metadata = {
  title: "Propiedades & Oportunidades de Inversión",
  description:
    "Catálogo exclusivo de residencias, loteos, departamentos y chacras en Río Negro y la Patagonia Argentina. Asesoría directa y matriculada.",
};

export default async function ProyectosPage() {
  let propiedades: ItemPropiedad[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("propiedades")
      .select("*")
      .eq("publicado", true)
      .order("destacado", { ascending: false });

    if (data) {
      propiedades = data as unknown as ItemPropiedad[];
    }
  } catch {
    /* Supabase no disponible */
  }

  return (
    <main className="bg-crema min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="pt-40 pb-28 relative overflow-hidden text-crema"
        style={{
          background:
            "linear-gradient(145deg, #060A13 0%, #0D1628 50%, #080E1A 100%)",
        }}
      >
        <div className="absolute inset-0 grain-overlay opacity-[0.04] pointer-events-none" />
        <div
          className="absolute top-1/3 right-10 w-[500px] h-[300px] opacity-15 blur-[120px] pointer-events-none rounded-full"
          style={{ background: "#C9A84C" }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-10 bg-dorado" />
            <span className="font-body text-dorado text-[11px] tracking-[0.35em] uppercase">
              Portfolio Inmobiliario
            </span>
          </div>

          <h1
            className="font-display text-crema font-medium leading-[1.05] mb-6 max-w-4xl"
            style={{
              fontSize: "clamp(2.8rem, 6.5vw, 5.2rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Propiedades seleccionadas en{" "}
            <em className="not-italic italic text-dorado font-normal">
              Río Negro & Patagonia
            </em>
          </h1>

          <p className="font-body text-crema/50 text-[15px] lg:text-base leading-relaxed max-w-2xl mb-8">
            Explorá residencias exclusivas, loteos con alta plusvalía y unidades
            de inversión con asesoramiento notarial y matriculado.
          </p>

          <div className="flex items-center gap-3 text-xs font-body text-dorado">
            <span>✦</span>
            <span>
              Supervisión por Martillera Colegiada Estela Mari Rojas (Mat. 35 RP
              2026)
            </span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dorado/30 to-transparent" />
      </section>

      {/* ── Catálogo con Filtros Reactivos ─────────────────────────────────────── */}
      <section className="py-20 bg-crema">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Suspense
            fallback={
              <div className="py-24 text-center font-body text-tierra/50">
                Cargando propiedades...
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
