import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProyectosSliderClient, {
  type ProyectoCard,
} from "./ProyectosSliderClient";

const fallback: ProyectoCard[] = [
  {
    id: "demo-1",
    titulo: "Altos del Limay",
    ubicacion: "Cipoletti, Río Negro",
    descripcion:
      "Complejo residencial en altura con vistas panorámicas al río Limay. Unidades de 2 y 3 ambientes con amenities de primer nivel.",
    estado: "en_construccion",
    imagen:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  },
  {
    id: "demo-2",
    titulo: "Parque Patagónico",
    ubicacion: "Centenario, Río Negro",
    descripcion:
      "Loteo premium en entorno natural. 80 lotes de entre 500 y 1.200 m² con acceso a áreas verdes y seguridad perimetral.",
    estado: "disponible",
    imagen:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
  },
  {
    id: "demo-3",
    titulo: "Vértice Confluencia",
    ubicacion: "Allen, Río Negro",
    descripcion:
      "Desarrollo de viviendas unifamiliares en el corazón residencial de Río Negro. Diseño contemporáneo con materiales de la región.",
    estado: "vendido",
    imagen:
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80",
  },
];

export default async function ProyectosSlider() {
  let proyectos: ProyectoCard[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("propiedades")
      .select("id, titulo, ubicacion, descripcion, estado, imagenes")
      .eq("publicado", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (data && data.length > 0) {
      proyectos = data.map((p) => ({
        id: p.id,
        titulo: p.titulo,
        ubicacion: p.ubicacion,
        descripcion: p.descripcion,
        estado: p.estado,
        imagen: p.imagenes?.[0] ?? null,
      }));
    }
  } catch {
    // Supabase not configured yet - use fallback
  }

  const items = proyectos.length > 0 ? proyectos : fallback;

  return (
    <section className="bg-tierra">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-10 bg-dorado" />
              <span className="font-body text-dorado text-[11px] tracking-[0.35em] uppercase">
                Portafolio
              </span>
            </div>
            <h2
              className="font-display text-crema font-medium leading-[1.05]"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Nuestros <span className="italic text-dorado">proyectos</span>
            </h2>
            <p className="font-body text-crema/30 text-sm mt-4 max-w-sm">
              Desarrollos que transforman regiones y generan valor real.
            </p>
          </div>
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-3 font-body text-crema/40 text-[11px] tracking-[0.2em] uppercase border-b border-crema/15 pb-1 hover:text-dorado hover:border-dorado transition-colors duration-200 self-start md:self-auto shrink-0"
          >
            Ver todos los proyectos
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Slider */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-28">
        <ProyectosSliderClient proyectos={items} />
      </div>
    </section>
  );
}
