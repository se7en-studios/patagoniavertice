import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const tipoLabel: Record<string, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
  desarrollo: "Desarrollo",
  lote: "Lote / Terreno",
  chacra: "Chacra",
};

const estadoLabel: Record<string, string> = {
  disponible: "Disponible para Operación",
  reservado: "En proceso de Reserva",
  vendido: "Vendido / Entregado",
  en_construccion: "A Estrenar / En Pozo",
};

interface DemoPropiedad {
  id: string;
  titulo: string;
  barrio?: string;
  ciudad: string;
  tipo: string;
  estado: string;
  superficie_m2?: number;
  ambientes?: string;
  dormitorios?: number;
  banos?: number;
  imagenes: string[];
  descripcion: string;
  precio: number | null;
  moneda: string;
  ubicacion?: string;
  caracteristicas?: string[];
}

async function fetchPropiedad(id: string): Promise<DemoPropiedad | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("propiedades")
      .select("*")
      .eq("id", id)
      .eq("publicado", true)
      .single();
    return data ? (data as unknown as DemoPropiedad) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const item = await fetchPropiedad(params.id);
  if (item) {
    return {
      title: item.titulo,
      description: item.descripcion.slice(0, 160),
    };
  }
  return {
    title: "Propiedad",
    description: "Detalle de propiedad en Neuquén y la Patagonia.",
  };
}

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://altumsci.com.ar";

export default async function PropiedadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const propiedad = await fetchPropiedad(params.id);

  if (!propiedad) notFound();

  const imagenes = propiedad.imagenes?.length
    ? propiedad.imagenes
    : ["/mari-menuco/bahia-playas-1.jpg"];

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola Altum Inmobiliaria, quisiera consultar información detallada y coordinar una visita para la propiedad: ${propiedad.titulo} (${propiedad.ciudad} - USD ${propiedad.precio?.toLocaleString("es-AR") || "Consultar"})`,
  )}`;

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: propiedad.titulo,
    description: propiedad.descripcion,
    url: `${siteUrl}/proyectos/${propiedad.id}`,
    image: imagenes.map((img) =>
      img.startsWith("http") ? img : `${siteUrl}${img}`,
    ),
    ...(propiedad.precio
      ? {
          offers: {
            "@type": "Offer",
            price: propiedad.precio,
            priceCurrency: propiedad.moneda || "USD",
            availability:
              propiedad.estado === "vendido"
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
          },
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: propiedad.barrio || propiedad.ciudad,
      addressRegion: propiedad.ciudad,
      addressCountry: "AR",
    },
    ...(propiedad.superficie_m2
      ? {
          floorSize: {
            "@type": "QuantitativeValue",
            value: propiedad.superficie_m2,
            unitCode: "MTK",
          },
        }
      : {}),
  };

  return (
    <main className="bg-crema min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />
      {/* ── Hero Gallery ─────────────────────────────────────────────────── */}
      <section className="relative h-[65vh] md:h-[75vh] bg-navy-950 overflow-hidden">
        <Image
          src={imagenes[0]}
          alt={propiedad.titulo}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-black/30" />

        {/* Back link & Top Badge */}
        <div className="absolute top-32 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
            <Link
              href="/proyectos"
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy-950/80 backdrop-blur-md border border-crema/20 text-crema font-body text-[11px] tracking-[0.18em] uppercase hover:border-dorado hover:text-dorado transition-colors"
            >
              <span>←</span>
              <span>Volver al Catálogo</span>
            </Link>

            <span className="px-3.5 py-1.5 bg-dorado text-tierra font-body text-[10px] font-semibold tracking-[0.2em] uppercase shadow-md">
              {propiedad.tipo ? tipoLabel[propiedad.tipo] : "Propiedad"}
            </span>
          </div>
        </div>

        {/* Hero Title info bottom */}
        <div className="absolute bottom-10 left-0 right-0 z-10 text-crema">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-2 font-body text-dorado text-xs tracking-[0.25em] uppercase font-medium">
              <span>{propiedad.ciudad}</span>
              {propiedad.barrio && <span>· {propiedad.barrio}</span>}
            </div>
            <h1
              className="font-display font-medium text-crema leading-[1.05] max-w-4xl"
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
                letterSpacing: "-0.02em",
              }}
            >
              {propiedad.titulo}
            </h1>
          </div>
        </div>
      </section>

      {/* ── Main Content Grid ────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-crema">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: Details & Extra Photos */}
            <div className="lg:col-span-8 space-y-12">
              {/* Quick Specs Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white border border-tierra/10 shadow-sm text-center">
                {propiedad.superficie_m2 && (
                  <div className="space-y-1">
                    <span className="font-body text-tierra/40 text-[10px] uppercase tracking-wider block">
                      Superficie
                    </span>
                    <span className="font-display text-tierra text-xl font-medium">
                      {propiedad.superficie_m2} m²
                    </span>
                  </div>
                )}
                {propiedad.dormitorios && (
                  <div className="space-y-1">
                    <span className="font-body text-tierra/40 text-[10px] uppercase tracking-wider block">
                      Dormitorios
                    </span>
                    <span className="font-display text-tierra text-xl font-medium">
                      {propiedad.dormitorios}
                    </span>
                  </div>
                )}
                {propiedad.banos && (
                  <div className="space-y-1">
                    <span className="font-body text-tierra/40 text-[10px] uppercase tracking-wider block">
                      Baños
                    </span>
                    <span className="font-display text-tierra text-xl font-medium">
                      {propiedad.banos}
                    </span>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="font-body text-tierra/40 text-[10px] uppercase tracking-wider block">
                    Estado
                  </span>
                  <span className="font-body text-dorado text-xs font-semibold uppercase tracking-wider">
                    {propiedad.estado
                      ? estadoLabel[propiedad.estado]
                      : "Disponible"}
                  </span>
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-6">
                <h2 className="font-display text-tierra text-2xl lg:text-3xl font-medium">
                  Descripción de la Propiedad
                </h2>
                <div className="font-body text-tierra/70 text-sm lg:text-base leading-relaxed whitespace-pre-line space-y-4">
                  {propiedad.descripcion}
                </div>
              </div>

              {/* Características & Amenities */}
              {propiedad.caracteristicas &&
                propiedad.caracteristicas.length > 0 && (
                  <div className="space-y-6 pt-6 border-t border-tierra/10">
                    <h3 className="font-display text-tierra text-xl lg:text-2xl font-medium">
                      Prestaciones & Comodidades
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {propiedad.caracteristicas.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3.5 bg-white border border-tierra/10 text-xs font-body text-tierra/85"
                        >
                          <span className="text-dorado font-bold">✦</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Galería adicional de fotos */}
              {imagenes.length > 1 && (
                <div className="space-y-6 pt-6 border-t border-tierra/10">
                  <h3 className="font-display text-tierra text-xl lg:text-2xl font-medium">
                    Galería de Imágenes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {imagenes.slice(1).map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-[4/3] overflow-hidden border border-tierra/10 shadow-sm"
                      >
                        <Image
                          src={img}
                          alt={`${propiedad?.titulo} ${i + 2}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Pricing & Contact Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div
                  className="p-8 bg-navy-950 text-crema border border-dorado/35 shadow-2xl space-y-6"
                  style={{ background: "#080E1A" }}
                >
                  {/* Precio */}
                  <div className="border-b border-crema/10 pb-6">
                    <span className="font-body text-dorado text-[10px] tracking-[0.2em] uppercase block mb-1">
                      Valor de Publicación
                    </span>
                    <div className="font-display text-3xl lg:text-4xl text-crema font-semibold">
                      {propiedad.precio
                        ? `${propiedad.moneda} ${propiedad.precio.toLocaleString("es-AR")}`
                        : "Consultar Precio"}
                    </div>
                    {propiedad.ubicacion && (
                      <p className="font-body text-crema/40 text-xs mt-2">
                        📍 {propiedad.ubicacion}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3.5">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 bg-dorado text-tierra font-body text-xs font-semibold tracking-[0.18em] uppercase hover:bg-dorado-light transition-all shadow-lg text-center"
                    >
                      <span>Consultar por WhatsApp</span>
                      <span>→</span>
                    </a>

                    <Link
                      href={`/contacto?propiedad=${encodeURIComponent(propiedad.titulo)}`}
                      className="w-full inline-flex items-center justify-center py-3.5 px-6 border border-crema/20 text-crema/80 font-body text-xs tracking-[0.14em] uppercase hover:border-dorado hover:text-dorado transition-colors text-center"
                    >
                      Agendar Visita Presencial
                    </Link>
                  </div>

                  {/* Trust badge */}
                  <div className="pt-4 border-t border-crema/10 text-center space-y-1">
                    <p className="font-body text-crema/40 text-[10px] tracking-wider uppercase">
                      Supervisión Profesional
                    </p>
                    <p className="font-body text-dorado/80 text-xs font-medium">
                      Estela Mari Rojas · Mat. 35 RP 2026
                    </p>
                    <p className="font-body text-crema/30 text-[10px]">
                      Colegio de Martilleros de Río Negro (IV Circ.)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
