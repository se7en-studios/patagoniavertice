import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Propiedad } from "@/lib/supabase/types";

function PropiedadCard({ propiedad }: { propiedad: Propiedad }) {
  const imagen =
    propiedad.imagenes?.[0] ??
    `https://placehold.co/600x400/1C1A17/B8965A?text=${encodeURIComponent(propiedad.titulo)}`;

  const tipoLabel: Record<string, string> = {
    venta: "Venta",
    alquiler: "Alquiler",
    desarrollo: "Desarrollo",
    lote: "Lote",
  };

  return (
    <Link href={`/proyectos/${propiedad.id}`} className="group block">
      <div className="overflow-hidden aspect-[4/3] mb-5 relative">
        <Image
          src={imagen}
          alt={propiedad.titulo}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-body text-dorado text-xs tracking-widest uppercase mb-2">
            {propiedad.tipo ? tipoLabel[propiedad.tipo] : ""} ·{" "}
            {propiedad.ciudad}
          </div>
          <h3 className="font-display text-tierra text-xl font-medium leading-snug group-hover:text-dorado transition-colors">
            {propiedad.titulo}
          </h3>
          {propiedad.barrio && (
            <p className="font-body text-tierra/50 text-sm mt-1">
              {propiedad.barrio}
            </p>
          )}
        </div>
        {propiedad.precio && (
          <div className="text-right shrink-0">
            <div className="font-body text-tierra/40 text-xs mb-1">
              {propiedad.moneda}
            </div>
            <div className="font-display text-tierra text-xl font-medium">
              {propiedad.precio.toLocaleString("es-AR")}
            </div>
          </div>
        )}
      </div>
      {propiedad.superficie_m2 && (
        <div className="mt-3 font-body text-tierra/40 text-xs">
          {propiedad.superficie_m2} m²
        </div>
      )}
    </Link>
  );
}

export default async function PropiedadesDestacadas() {
  const supabase = await createClient();
  const { data: propiedades } = await supabase
    .from("propiedades")
    .select("*")
    .eq("publicado", true)
    .eq("destacado", true)
    .limit(3);

  if (!propiedades || propiedades.length === 0) return null;

  return (
    <section id="proyectos" className="py-32 bg-crema">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-dorado" />
              <span className="font-body text-dorado text-xs tracking-[0.4em] uppercase">
                Destacados
              </span>
            </div>
            <h2 className="font-display text-tierra text-5xl lg:text-6xl font-medium leading-[1.1]">
              Proyectos <span className="italic">seleccionados</span>
            </h2>
          </div>
          <Link
            href="/proyectos"
            className="font-body text-tierra/60 text-sm tracking-widest uppercase border-b border-tierra/20 pb-1 hover:text-dorado hover:border-dorado transition-colors self-start md:self-auto"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {propiedades.map((p) => (
            <PropiedadCard key={p.id} propiedad={p as Propiedad} />
          ))}
        </div>
      </div>
    </section>
  );
}
