import Link from "next/link";
import { coverImage, galleryImages } from "@/lib/property-images";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import FavoriteButton from "@/components/catalogo/FavoriteButton";
import ShareButton from "@/components/catalogo/ShareButton";
import PrintButton from "@/components/catalogo/PrintButton";
import WhatsAppLink from "@/components/catalogo/WhatsAppLink";
import PropiedadesSimilares, {
  type SimilarItem,
} from "@/components/catalogo/PropiedadesSimilares";

const SIMILARES_MAX = 3;

// Estilos de impresión para "Descargar ficha en PDF" (window.print()).
const PRINT_CSS = `
@media print {
  @page { margin: 14mm; }
  nav, footer, .fixed, .no-print { display: none !important; }
  .print-only { display: block !important; }
  .print-hero { height: 220px !important; }
  .sticky { position: static !important; }
  main, section { background: #fff !important; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  article, .print-avoid { break-inside: avoid; }
}
.print-only { display: none; }
`;

// Evita que valores con comas/paréntesis rompan el filtro .or() de PostgREST.
const sanitizeFilter = (v: string) => v.replace(/[,()"\\]/g, " ").trim();

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

const FALLBACK_PROPIEDADES_DETALLE: Record<string, DemoPropiedad> = {
  "mari-menuco-primera-linea": {
    id: "mari-menuco-primera-linea",
    titulo: "Lote Frente al Lago - Bahía de las Playas",
    barrio: "Barrio Privado Bahía de las Playas",
    ciudad: "Mari Menuco, Neuquén",
    tipo: "lote",
    estado: "disponible",
    superficie_m2: 1000,
    imagenes: [
      "/mari-menuco/bahia-playas-1.jpg",
      "/mari-menuco/bahia-playas-2.jpg",
      "/mari-menuco/bahia-playas-3.jpg",
    ],
    descripcion:
      "Terreno exclusivo en primera línea de costa sobre el Lago Mari Menuco, dentro del desarrollo Bahía de las Playas. Cuenta con acceso directo a la playa, bajada náutica exclusiva, tendido de agua potable y energía eléctrica en puerta de lote, además de los proyectos aprobados de WakePark y Club House social.",
    precio: 48000,
    moneda: "USD",
    ubicacion: "Costa Norte · Lago Mari Menuco, Neuquén",
    caracteristicas: [
      "Frente directo al Lago Mari Menuco",
      "Bajada náutica privada",
      "Red de agua potable y energía eléctrica",
      "Seguridad 24 hs y acceso controlado",
      "Supervisión notarial Estela Mari Rojas (Mat. 35 RP 2026)",
    ],
  },
  "residencia-cipolletti-premium": {
    id: "residencia-cipolletti-premium",
    titulo: "Residencia Vanguardista con Piscina & Parque",
    barrio: "Barrio Residencial Consolidado",
    ciudad: "Cipolletti, Río Negro",
    tipo: "venta",
    estado: "disponible",
    superficie_m2: 310,
    dormitorios: 4,
    banos: 3,
    imagenes: ["/casa.avif", "/noche.avif"],
    descripcion:
      "Propiedad de categoría desarrollada en dos plantas sobre lote parquizado en Cipolletti, a 10 minutos de Neuquén Capital. Cuenta con aberturas de aluminio con DVH, calefacción por losa radiante, piscina climatizada, quincho totalmente equipado y cochera doble.",
    precio: 195000,
    moneda: "USD",
    ubicacion: "Cipolletti, Río Negro",
    caracteristicas: [
      "Piscina climatizada y solárium",
      "Quincho cerrado con parrilla de acero inoxidable",
      "Calefacción central por losa radiante",
      "Carpintería de alta prestación con DVH",
      "Escritura traslativa de dominio inmediata",
    ],
  },
  "lote-panoramico-mari-menuco": {
    id: "lote-panoramico-mari-menuco",
    titulo: "Terreno Panorámico con Bajada Náutica",
    barrio: "Bahía de las Playas · Sector Terrazas",
    ciudad: "Mari Menuco, Neuquén",
    tipo: "lote",
    estado: "disponible",
    superficie_m2: 850,
    imagenes: [
      "/mari-menuco/bahia-playas-2.jpg",
      "/mari-menuco/bahia-playas-1.jpg",
      "/mari-menuco/bahia-playas-3.jpg",
    ],
    descripcion:
      "Lote emplazado sobre una terraza natural sobreelevada que asegura visuales panorámicas despejadas de 180° hacia el Lago Mari Menuco. Factibilidad constructiva inmediata con agua y luz en lote.",
    precio: 36000,
    moneda: "USD",
    ubicacion: "Sector Terrazas · Bahía de las Playas, Mari Menuco",
    caracteristicas: [
      "Visuales abiertas 180° al espejo de agua",
      "Agua potable y energía eléctrica en puerta",
      "Acceso a playa y bajada de lanchas",
      "Proximidad a WakePark y Club House",
    ],
  },
  "fraccion-desarrollo-alto-valle": {
    id: "fraccion-desarrollo-alto-valle",
    titulo: "Fracción Estratégica para Inversión & Logística",
    barrio: "Corredor Petrolero & Productivo",
    ciudad: "Catriel, Río Negro",
    tipo: "desarrollo",
    estado: "disponible",
    superficie_m2: 2500,
    imagenes: ["/bosque.avif"],
    descripcion:
      "Fracción de 2.500 m² ubicada estratégicamente sobre el corredor energético del norte patagónico en Catriel. Ideal para base operativa de empresas de servicios petroleros, galpón logístico o desarrollo habitacional corporativo.",
    precio: 95000,
    moneda: "USD",
    ubicacion: "Acceso Ruta Nacional 151 · Catriel, Río Negro",
    caracteristicas: [
      "Frente sobre corredor de alto tránsito",
      "Factibilidad comercial e industrial",
      "Alta demanda de renta corporativa en USD",
      "Títulos perfectos listos para transferir",
    ],
  },
  "departamento-corporativo-cipolletti": {
    id: "departamento-corporativo-cipolletti",
    titulo: "Semipiso Premium en Torre Central",
    barrio: "Distrito Financiero",
    ciudad: "Cipolletti, Río Negro",
    tipo: "venta",
    estado: "disponible",
    superficie_m2: 125,
    dormitorios: 2,
    banos: 2,
    imagenes: ["/noche.avif", "/casa.avif"],
    descripcion:
      "Semipiso de categoría en el área central de Cipolletti, con rápido acceso al puente interprovincial hacia Neuquén Capital. Amplio estar comedor con salida a balcón terraza con parrilla, suite principal con vestidor y cochera cubierta.",
    precio: 125000,
    moneda: "USD",
    ubicacion: "Centro · Cipolletti, Río Negro",
    caracteristicas: [
      "Cochera cubierta y baulera",
      "Balcón terraza con parrilla propia",
      "Aberturas DVH y pisos de porcelanato",
      "Excelente renta ejecutiva en USD",
    ],
  },
  "lote-segunda-linea-playas": {
    id: "lote-segunda-linea-playas",
    titulo: "Lote con Servicios y Factibilidad Inmediata",
    barrio: "Bahía de las Playas · Sector Club House",
    ciudad: "Mari Menuco, Neuquén",
    tipo: "lote",
    estado: "disponible",
    superficie_m2: 750,
    imagenes: [
      "/mari-menuco/bahia-playas-3.jpg",
      "/mari-menuco/bahia-playas-2.jpg",
      "/mari-menuco/bahia-playas-1.jpg",
    ],
    descripcion:
      "El ticket de ingreso más competitivo de Bahía de las Playas en el Lago Mari Menuco. Lote plano de 750 m² con agua y electricidad, próximo al pórtico de acceso y al futuro Club House social.",
    precio: 32000,
    moneda: "USD",
    ubicacion: "Sector Club House · Bahía de las Playas, Mari Menuco",
    caracteristicas: [
      "Agua potable y energía eléctrica",
      "Contiguo al futuro Club House",
      "Acceso completo a playa y sector náutico",
      "Financiación personalizada disponible",
    ],
  },
};

async function fetchPropiedad(id: string): Promise<DemoPropiedad | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("propiedades")
      .select("*")
      .eq("id", id)
      .eq("publicado", true)
      .single();
    if (data) return data as unknown as DemoPropiedad;
  } catch {
    /* fallback below */
  }
  return FALLBACK_PROPIEDADES_DETALLE[id] ?? null;
}

async function fetchSimilares(p: DemoPropiedad): Promise<SimilarItem[]> {
  try {
    const supabase = await createClient();
    const conds = [`ciudad.eq.${sanitizeFilter(p.ciudad)}`];
    if (p.tipo) conds.push(`tipo.eq.${sanitizeFilter(p.tipo)}`);
    const { data } = await supabase
      .from("propiedades")
      .select("id,titulo,ciudad,barrio,tipo,imagenes,precio,moneda")
      .eq("publicado", true)
      .neq("id", p.id)
      .or(conds.join(","))
      .limit(24);
    const score = (x: SimilarItem) =>
      (x.ciudad === p.ciudad ? 2 : 0) +
      (x.tipo === p.tipo ? 1 : 0) +
      (p.barrio && x.barrio === p.barrio ? 1 : 0);
    return ((data ?? []) as unknown as SimilarItem[])
      .sort((a, b) => score(b) - score(a))
      .slice(0, SIMILARES_MAX);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await fetchPropiedad(id);
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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const propiedad = await fetchPropiedad(id);

  if (!propiedad) notFound();

  const similares = await fetchSimilares(propiedad);

  const imagenes = propiedad.imagenes?.length
    ? propiedad.imagenes
    : ["/mari-menuco/bahia-playas-1.jpg"];

  const cover = coverImage(propiedad.imagenes);
  const galeria = galleryImages(propiedad.imagenes, cover);

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Propiedades", item: `${siteUrl}/proyectos` },
      { "@type": "ListItem", position: 3, name: propiedad.titulo },
    ],
  };

  return (
    <main className="bg-crema min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* ── Hero Gallery ─────────────────────────────────────────────────── */}
      <section className="print-hero relative h-[65vh] md:h-[75vh] bg-navy-950 overflow-hidden">
        <Image
          src={cover}
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
            <nav
              aria-label="Breadcrumb"
              className="px-4 py-2 bg-navy-950/80 backdrop-blur-md border border-crema/20 text-crema font-body text-[11px] tracking-[0.14em] uppercase"
            >
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <li>
                  <Link href="/" className="hover:text-dorado focus-visible:outline focus-visible:outline-2 focus-visible:outline-dorado">
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/proyectos" className="hover:text-dorado focus-visible:outline focus-visible:outline-2 focus-visible:outline-dorado">
                    Propiedades
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-dorado max-w-[40vw] truncate">
                  {propiedad.titulo}
                </li>
              </ol>
            </nav>

            <span className="px-3.5 py-1.5 bg-dorado text-tierra font-body text-[10px] font-semibold tracking-[0.2em] uppercase shadow-md">
              {propiedad.tipo ? tipoLabel[propiedad.tipo] : "Propiedad"}
            </span>
          </div>
        </div>

        {/* Hero Title info bottom */}
        <div className="absolute bottom-10 left-0 right-0 z-10 text-crema">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="inline-flex items-center gap-2.5 mb-3 px-3.5 py-1 rounded-full bg-[#070E1B]/80 backdrop-blur-md border border-white/15 rd-label !text-[10px] !tracking-[0.2em] text-dorado">
              <span className="rd-ping" />
              <span>{propiedad.ciudad}</span>
              {propiedad.barrio && <span>· {propiedad.barrio}</span>}
            </div>
            <h1
              className="rd-display text-white max-w-4xl"
              style={{
                fontSize: "clamp(2.25rem, 4.5vw, 4.1rem)",
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
              {galeria.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-tierra/10">
                  <h3 className="font-display text-tierra text-xl lg:text-2xl font-medium">
                    Galería de Imágenes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {galeria.map((img, i) => (
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
                    <WhatsAppLink
                      href={waLink}
                      origen="ficha"
                      className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 bg-dorado text-tierra font-body text-xs font-semibold tracking-[0.18em] uppercase hover:bg-dorado-light transition-all shadow-lg text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crema"
                    >
                      <span>Consultar por WhatsApp</span>
                      <span aria-hidden="true">→</span>
                    </WhatsAppLink>

                    <Link
                      href={`/contacto?propiedad=${encodeURIComponent(propiedad.titulo)}`}
                      className="w-full inline-flex items-center justify-center py-3.5 px-6 border border-crema/20 text-crema/80 font-body text-xs tracking-[0.14em] uppercase hover:border-dorado hover:text-dorado transition-colors text-center"
                    >
                      Agendar Visita Presencial
                    </Link>
                  </div>

                  {/* Favorito / compartir / PDF */}
                  <div className="no-print grid grid-cols-2 gap-2 pt-2">
                    <FavoriteButton
                      id={propiedad.id}
                      titulo={propiedad.titulo}
                      showLabel
                      className="py-3 px-3 border border-crema/20 text-crema/80 font-body text-[10px] tracking-[0.14em] uppercase hover:border-dorado hover:text-dorado"
                    />
                    <ShareButton
                      titulo={propiedad.titulo}
                      className="py-3 px-3 border border-crema/20 text-crema/80 font-body text-[10px] tracking-[0.14em] uppercase hover:border-dorado hover:text-dorado"
                    />
                    <PrintButton className="col-span-2 py-3 px-3 border border-crema/20 text-crema/80 font-body text-[10px] tracking-[0.14em] uppercase hover:border-dorado hover:text-dorado" />
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

      <PropiedadesSimilares items={similares} />

      <p className="print-only px-6 py-4 font-body text-xs text-tierra/70">
        Ficha generada desde {siteUrl}/proyectos/{propiedad.id} · Altum Inmobiliaria · WhatsApp +{WHATSAPP_NUMBER}
      </p>
    </main>
  );
}
