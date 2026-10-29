import Link from "next/link";
import Image from "next/image";
import { coverImage } from "@/lib/property-images";
import { formatPrecio, tipoLabel } from "./ui";

export interface SimilarItem {
  id: string;
  titulo: string;
  ciudad: string;
  barrio?: string | null;
  tipo: string | null;
  imagenes: string[] | null;
  precio: number | null;
  moneda: string;
}

export default function PropiedadesSimilares({
  items,
}: {
  items: SimilarItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="similares-titulo"
      className="py-16 bg-white border-t border-tierra/10 no-print"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h2
          id="similares-titulo"
          className="font-display text-tierra text-2xl lg:text-3xl font-medium mb-8"
        >
          Propiedades similares
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((p) => (
            <li key={p.id}>
              <Link
                href={`/proyectos/${p.id}`}
                className="group block bg-crema border border-tierra/10 hover:border-dorado/40 hover:shadow-xl transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dorado"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-navy-950">
                  <Image
                    src={coverImage(p.imagenes)}
                    alt={p.titulo}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <p className="font-body text-dorado text-[11px] tracking-[0.2em] uppercase font-semibold">
                    {p.ciudad}
                    {p.barrio ? ` · ${p.barrio}` : ""}
                    {p.tipo ? ` · ${tipoLabel[p.tipo] ?? p.tipo}` : ""}
                  </p>
                  <h3 className="font-display text-tierra text-lg font-medium leading-snug">
                    {p.titulo}
                  </h3>
                  <p className="font-display text-tierra text-xl font-semibold">
                    {formatPrecio(p.precio, p.moneda)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
