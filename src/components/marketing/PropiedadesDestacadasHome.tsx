"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { coverImage } from "@/lib/property-images";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { guardarLeadAltum } from "@/app/actions/leads-altum";

const tipoLabel: Record<string, string> = {
  venta: "Venta Exclusiva",
  alquiler: "Alquiler Corporativo",
  desarrollo: "Inversión & Plusvalía",
  lote: "Lote / Terreno",
  chacra: "Chacra / Campo",
};

const categoriaLabel: Record<string, string> = {
  venta: "Casa / Residencia",
  alquiler: "Corporativo",
  desarrollo: "Oportunidad",
  lote: "Frente al Lago",
  chacra: "Fracción",
};

export interface PropiedadDestacada {
  id: string;
  titulo: string;
  ciudad: string;
  barrio?: string | null;
  precio: number | null;
  moneda: string;
  tipo: string;
  superficie_m2?: number | null;
  imagenes: string[];
  destacado_badge?: string;
  descripcion_corta?: string;
  servicios?: string[];
}

const PROPIEDADES_SHOWCASE_FALLBACK: PropiedadDestacada[] = [
  {
    id: "mari-menuco-primera-linea",
    titulo: "Lote Frente al Lago - Bahía de las Playas",
    ciudad: "Mari Menuco, Neuquén",
    barrio: "Barrio Privado Bahía de las Playas",
    precio: 48000,
    moneda: "USD",
    tipo: "lote",
    superficie_m2: 1000,
    imagenes: [
      "/mari-menuco/bahia-playas-1.jpg",
      "/mari-menuco/bahia-playas-2.jpg",
      "/mari-menuco/bahia-playas-3.jpg",
    ],
    destacado_badge: "Frente al Lago · Oportunidad",
    descripcion_corta:
      "Terreno exclusivo en primera línea de costa sobre el Lago Mari Menuco. Cuenta con bajada náutica privada, servicios de agua y energía eléctrica, y proyectos aprobados de WakePark y Club House.",
    servicios: [
      "Costa directa de lago",
      "Bajada náutica privada",
      "Agua potable y energía",
      "Seguridad y acceso controlado",
    ],
  },
  {
    id: "residencia-cipolletti-premium",
    titulo: "Residencia Vanguardista con Piscina & Parque",
    ciudad: "Cipolletti, Río Negro",
    barrio: "Barrio Residencial Consolidado",
    precio: 195000,
    moneda: "USD",
    tipo: "venta",
    superficie_m2: 310,
    imagenes: ["/casa.avif", "/noche.avif"],
    destacado_badge: "Diseño Contemporáneo",
    descripcion_corta:
      "Propiedad de categoría desarrollada en dos plantas con aberturas DVH, piscina climatizada, quincho integrado y parquización consolidada a 10 minutos de Neuquén Capital.",
    servicios: [
      "Piscina y quincho equipado",
      "Calefacción por losa radiante",
      "Seguridad 24 hs",
      "Escritura inmediata",
    ],
  },
  {
    id: "lote-panoramico-mari-menuco",
    titulo: "Terreno Panorámico con Bajada Náutica",
    ciudad: "Mari Menuco, Neuquén",
    barrio: "Bahía de las Playas · Sector Terrazas",
    precio: 36000,
    moneda: "USD",
    tipo: "lote",
    superficie_m2: 850,
    imagenes: [
      "/mari-menuco/bahia-playas-2.jpg",
      "/mari-menuco/bahia-playas-1.jpg",
      "/mari-menuco/bahia-playas-3.jpg",
    ],
    destacado_badge: "Vista al Lago 180°",
    descripcion_corta:
      "Ubicado en cota sobreelevada natural con visuales abiertas de 180° al espejo de agua. Factibilidad constructiva inmediata y acceso directo a la playa y sector deportivo.",
    servicios: [
      "Vista panorámica 180°",
      "Agua y luz en puerta de lote",
      "Uso de Club House y WakePark",
      "Supervisión notarial colegiada",
    ],
  },
  {
    id: "fraccion-desarrollo-alto-valle",
    titulo: "Fracción Estratégica para Inversión & Logística",
    ciudad: "Catriel, Río Negro",
    barrio: "Corredor Petrolero & Productivo",
    precio: 95000,
    moneda: "USD",
    tipo: "desarrollo",
    superficie_m2: 2500,
    imagenes: ["/bosque.avif"],
    destacado_badge: "Alta Renta Corporativa",
    descripcion_corta:
      "Fracción sobre corredor estratégico del eje energético norte patagónico. Ideal para base operativa, desarrollo habitacional corporativo o galpón logístico con renta en USD.",
    servicios: [
      "Acceso directo a ruta",
      "Aptitud comercial y logística",
      "Alta demanda petrolera",
      "Títulos perfectos",
    ],
  },
  {
    id: "departamento-corporativo-cipolletti",
    titulo: "Semipiso Premium en Torre Central",
    ciudad: "Cipolletti, Río Negro",
    barrio: "Distrito Financiero",
    precio: 125000,
    moneda: "USD",
    tipo: "venta",
    superficie_m2: 125,
    imagenes: ["/noche.avif", "/casa.avif"],
    destacado_badge: "A Estrenar",
    descripcion_corta:
      "Semipiso luminoso con balcón terraza, cochera cubierta y terminaciones de primera calidad. Excelente liquidez y rentabilidad para alquiler ejecutivo.",
    servicios: [
      "Cochera cubierta incluida",
      "Balcón terraza con parrilla",
      "Aberturas de aluminio DVH",
      "Renta estimada 8-10% USD",
    ],
  },
  {
    id: "lote-segunda-linea-playas",
    titulo: "Lote con Servicios y Factibilidad Inmediata",
    ciudad: "Mari Menuco, Neuquén",
    barrio: "Bahía de las Playas · Sector Club House",
    precio: 32000,
    moneda: "USD",
    tipo: "lote",
    superficie_m2: 750,
    imagenes: [
      "/mari-menuco/bahia-playas-3.jpg",
      "/mari-menuco/bahia-playas-2.jpg",
      "/mari-menuco/bahia-playas-1.jpg",
    ],
    destacado_badge: "Escrituración Inmediata",
    descripcion_corta:
      "El ticket más competitivo para ingresar a Bahía de las Playas en Lago Mari Menuco. Lote plano de 750 m² con agua y luz, a pasos del futuro Club House.",
    servicios: [
      "Agua y energía en el lote",
      "Cercanía al Club House",
      "Acceso a bajada náutica",
      "Financiación disponible",
    ],
  },
];

function formatSuperficie(m2?: number | null): string {
  return m2 ? `${m2.toLocaleString("es-AR")} m²` : "Consultar superficie";
}

function calcularUsdM2(p: PropiedadDestacada): number | null {
  if (!p.precio || !p.superficie_m2 || p.superficie_m2 <= 0) return null;
  return Math.round(p.precio / p.superficie_m2);
}

const CATEGORIAS_TAB = [
  { id: "todas", label: "Todas las Oportunidades" },
  { id: "mari-menuco", label: "Mari Menuco (Lagos)" },
  { id: "residencial", label: "Casas & Residencias" },
  { id: "inversion", label: "Inversión & Lotes" },
];

export default function PropiedadesDestacadasHome({
  propiedades,
}: {
  propiedades: PropiedadDestacada[];
}) {
  const [tabActiva, setTabActiva] = useState("todas");
  const [quickViewProp, setQuickViewProp] = useState<PropiedadDestacada | null>(
    null,
  );
  const [fotoActivaIdx, setFotoActivaIdx] = useState(0);
  const [cardFotoIdx, setCardFotoIdx] = useState<Record<string, number>>({});

  // Estado del formulario de agendamiento dentro de Vista Rápida
  const [nombreVisita, setNombreVisita] = useState("");
  const [telefonoVisita, setTelefonoVisita] = useState("");
  const [fechaVisita, setFechaVisita] = useState("");
  const [horaVisita, setHoraVisita] = useState("11:00");
  const [enviandoVisita, setEnviandoVisita] = useState(false);
  const [visitaAgendadaOk, setVisitaAgendadaOk] = useState(false);

  // Estado del Comparador de Propiedades (máx 3)
  const [compararIds, setCompararIds] = useState<string[]>([]);
  const [modalComparador, setModalComparador] = useState(false);

  const reduced = useReducedMotion();

  const listaBase = useMemo(() => {
    return propiedades && propiedades.length > 0
      ? propiedades
      : PROPIEDADES_SHOWCASE_FALLBACK;
  }, [propiedades]);

  const listaFiltrada = useMemo(() => {
    let result = listaBase;
    if (tabActiva === "mari-menuco") {
      result = listaBase.filter(
        (p) =>
          p.ciudad.toLowerCase().includes("menuco") ||
          p.barrio?.toLowerCase().includes("playas"),
      );
    } else if (tabActiva === "residencial") {
      result = listaBase.filter(
        (p) => p.tipo === "venta" || p.tipo === "alquiler",
      );
    } else if (tabActiva === "inversion") {
      result = listaBase.filter(
        (p) =>
          p.tipo === "lote" || p.tipo === "desarrollo" || p.tipo === "chacra",
      );
    }
    return result.slice(0, 6);
  }, [listaBase, tabActiva]);

  const propiedadesComparadas = useMemo(
    () => listaBase.filter((p) => compararIds.includes(p.id)),
    [listaBase, compararIds],
  );

  const toggleComparar = (id: string) => {
    setCompararIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const abrirQuickView = (prop: PropiedadDestacada) => {
    setQuickViewProp(prop);
    setFotoActivaIdx(0);
    setVisitaAgendadaOk(false);
  };

  const handleAgendarDesdeQuickView = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickViewProp || !nombreVisita.trim() || !telefonoVisita.trim()) return;
    setEnviandoVisita(true);
    const precioStr = quickViewProp.precio
      ? `${quickViewProp.moneda} ${quickViewProp.precio.toLocaleString("es-AR")}`
      : "Consultar";

    await guardarLeadAltum({
      nombre: nombreVisita.trim(),
      telefono: telefonoVisita.trim(),
      tipo_consulta:
        quickViewProp.tipo === "lote" || quickViewProp.tipo === "desarrollo"
          ? "inversion"
          : "venta",
      origen: "quick-view-propiedad",
      mensaje: `Consulta / Solicitud de visita para "${quickViewProp.titulo}" (${quickViewProp.ciudad} · ${precioStr}).${
        fechaVisita ? ` Fecha solicitada: ${fechaVisita} (${horaVisita} hs).` : ""
      }`,
      detalle: {
        propiedad: quickViewProp.titulo,
        localidad: quickViewProp.ciudad,
        ...(quickViewProp.precio ? { presupuesto_usd: quickViewProp.precio } : {}),
        ...(fechaVisita
          ? { fecha_visita: fechaVisita, hora_visita: horaVisita }
          : {}),
      },
    });
    setEnviandoVisita(false);
    setVisitaAgendadaOk(true);

    const waText = `Hola Estela (ALTUM SCI), me interesa la propiedad *${quickViewProp.titulo}* (${quickViewProp.ciudad} - ${precioStr}).${
      fechaVisita
        ? `\nMe gustaría coordinar una visita el día ${fechaVisita} a las ${horaVisita} hs.`
        : ""
    }\nMi nombre es ${nombreVisita.trim()}.`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const imprimirFichaPropiedad = (p: PropiedadDestacada) => {
    const precioLabel = p.precio
      ? `${p.moneda} ${p.precio.toLocaleString("es-AR")}`
      : "Consultar valor";
    const usdM2 = calcularUsdM2(p);
    const win = window.open("", "_blank", "width=860,height=920");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Ficha Técnica · ${p.titulo} | ALTUM SCI</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #0E1A33; margin: 0; padding: 36px; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #C9A84C; padding-bottom: 18px; margin-bottom: 24px; }
          .brand { font-size: 22px; font-weight: 700; letter-spacing: 0.08em; color: #0E1A33; }
          .sub { font-size: 11px; color: #8A6A1B; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px; }
          .badge { display: inline-block; background: #FBF0CF; color: #7A5A12; padding: 5px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
          h1 { font-size: 28px; margin: 12px 0 6px; color: #0E1A33; }
          .loc { font-size: 14px; color: #556; margin-bottom: 20px; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 22px 0; }
          .box { border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; background: #F8FAFC; }
          .box-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748B; }
          .box-val { font-size: 20px; font-weight: 700; color: #0E1A33; margin-top: 4px; }
          .desc { font-size: 14px; line-height: 1.65; color: #334155; margin: 20px 0; }
          .footer { margin-top: 36px; padding-top: 18px; border-top: 1px solid #CBD5E1; font-size: 12px; color: #475569; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">ALTUM SCI</div>
            <div class="sub">Servicios & Consultoría Inmobiliaria · Patagonia Argentina</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:700;font-size:13px;">Estela Mari Rojas</div>
            <div style="font-size:11px;color:#8A6A1B;">Martillera & Corredora Pública · Mat. 35 RP 2026</div>
            <div style="font-size:11px;color:#64748B;">WhatsApp: +54 9 299 609-5742</div>
          </div>
        </div>
        <span class="badge">${tipoLabel[p.tipo] ?? p.tipo}</span>
        <h1>${p.titulo}</h1>
        <div class="loc">${p.barrio ? `${p.barrio} · ` : ""}${p.ciudad}</div>
        <div class="grid">
          <div class="box">
            <div class="box-label">Valor de Referencia</div>
            <div class="box-val">${precioLabel}</div>
          </div>
          <div class="box">
            <div class="box-label">Superficie Total</div>
            <div class="box-val">${formatSuperficie(p.superficie_m2)}</div>
          </div>
          <div class="box">
            <div class="box-label">Valor por m²</div>
            <div class="box-val">${usdM2 ? `${p.moneda} ${usdM2}/m²` : "Consultar"}</div>
          </div>
        </div>
        <p class="desc">${
          p.descripcion_corta ||
          "Propiedad seleccionada con títulos verificados, factibilidad inmediata y acompañamiento integral hasta la escrituración."
        }</p>
        <div class="footer">
          <span>ALTUM SCI · Cipolletti, Mari Menuco, Catriel y General Roca</span>
          <span>Documento informativo · Emitido el ${new Date().toLocaleDateString("es-AR")}</span>
        </div>
        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <section
      className="py-16 lg:py-22 relative overflow-hidden bg-[#F6F8FB]"
      id="propiedades-destacadas"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header Editorial estilo se7endev */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10 pb-7 border-b border-navy/10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="rd-label !text-[10px] text-navy/40">[02]</span>
              <div className="h-px w-8 bg-dorado" />
              <span className="rd-label !text-[10px] !tracking-[0.24em] text-[#8A6A1B]">
                ALTUM SCI · Portfolio Curado 2026
              </span>
            </div>
            <h2
              className="rd-display text-navy"
              style={{
                fontSize: "clamp(2.35rem, 4.4vw, 3.85rem)",
              }}
            >
              Propiedades &amp; Terrenos de{" "}
              <em className="rd-serif text-[#A47C1B]">
                primer nivel
              </em>
            </h2>
            <p className="font-body text-navy/65 text-sm lg:text-base max-w-xl mt-3.5">
              Lotes exclusivos en Mari Menuco, residencias en Cipolletti y
              fracciones estratégicas con plusvalía real en el eje Neuquén – Río
              Negro.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {compararIds.length > 0 && (
              <button
                type="button"
                onClick={() => setModalComparador(true)}
                className="inline-flex items-center gap-2 rounded-full bg-navy text-white px-5 py-2.5 rd-label !text-[10px] !tracking-[0.16em] shadow-md hover:bg-navy/90 transition-all"
              >
                <span>Comparar ({compararIds.length})</span>
              </button>
            )}
            <Link
              href="/proyectos"
              className="rd-btn border border-navy/15 bg-white hover:bg-[#0B1528] text-navy hover:text-white rd-label !text-[10px] !tracking-[0.16em] pl-5 pr-2 py-2 shadow-sm transition-all"
            >
              <span className="rd-roll" data-text="Ver Catálogo Completo">
                <span>Ver Catálogo Completo</span>
              </span>
              <span className="rd-btn__icon w-7 h-7 bg-dorado text-tierra">
                ↗
              </span>
            </Link>
          </div>
        </div>

        {/* Filter Pills con Indicador Deslizante (Spring Layout) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-white border border-navy/10 shadow-sm">
            {CATEGORIAS_TAB.map((tab) => {
              const isTabActive = tabActiva === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTabActiva(tab.id)}
                  className={`relative rd-label !text-[10px] !tracking-[0.16em] px-5 py-2.5 transition-colors rounded-full z-10 ${
                    isTabActive
                      ? "text-white"
                      : "text-navy/60 hover:text-navy"
                  }`}
                >
                  {isTabActive && (
                    <motion.span
                      layoutId="prop-tab-pill"
                      className="absolute inset-0 rounded-full bg-[#0B1528] shadow-md -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
          <span className="rd-label !text-[10px] !tracking-[0.16em] text-navy/45 hidden md:inline-block">
            [0{listaFiltrada.length} ACTIVOS AUDITADOS · MAT. 35 RP]
          </span>
        </div>

        {/* Grid de Propiedades */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          <AnimatePresence mode="popLayout">
            {listaFiltrada.map((p, idx) => {
              const precioLabel = p.precio
                ? `${p.moneda} ${p.precio.toLocaleString("es-AR")}`
                : "Consultar precio";
              const usdM2 = calcularUsdM2(p);
              const valorM2 = usdM2
                ? `${p.moneda} ${usdM2.toLocaleString("es-AR")}/m²`
                : null;
              const isComparando = compararIds.includes(p.id);

              const detailHref = `/proyectos/${p.id}`;
              const fotosCard =
                p.imagenes && p.imagenes.length > 0
                  ? p.imagenes
                  : [coverImage(p.imagenes)];
              const currentCardIdx = cardFotoIdx[p.id] ?? 0;
              const currentCardSrc =
                fotosCard[currentCardIdx % fotosCard.length] ||
                coverImage(p.imagenes);

              return (
                <motion.article
                  layout
                  key={p.id}
                  initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.42,
                    delay: reduced ? 0 : (idx % 3) * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative flex flex-col rounded-3xl bg-white border border-dorado/20 hover:border-dorado/60 overflow-hidden shadow-[0_18px_40px_-24px_rgba(14,26,51,0.22)] hover:shadow-[0_28px_60px_-26px_rgba(14,26,51,0.35)] hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Imagen & Badges con Carrusel Inline */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-navy/5">
                    <Image
                      src={currentCardSrc}
                      alt={p.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 cursor-pointer"
                      onClick={() => abrirQuickView(p)}
                    />

                    {/* Controles de Carrusel Inline (si tiene más de 1 foto) */}
                    {fotosCard.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Foto anterior"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardFotoIdx((prev) => ({
                              ...prev,
                              [p.id]:
                                ((prev[p.id] ?? 0) - 1 + fotosCard.length) %
                                fotosCard.length,
                            }));
                          }}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-navy-950/75 hover:bg-navy-950 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/15"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          aria-label="Siguiente foto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardFotoIdx((prev) => ({
                              ...prev,
                              [p.id]: ((prev[p.id] ?? 0) + 1) % fotosCard.length,
                            }));
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-navy-950/75 hover:bg-navy-950 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/15"
                        >
                          ›
                        </button>
                        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-navy-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          {fotosCard.map((_, dotIdx) => (
                            <span
                              key={dotIdx}
                              className={`block h-1 rounded-full transition-all ${
                                dotIdx === currentCardIdx % fotosCard.length
                                  ? "w-3.5 bg-dorado"
                                  : "w-1 bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Gradient Overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent pointer-events-none"
                    />

                    {/* Badge Superior Izquierdo: Índice + Tipo */}
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5">
                      <span className="rd-label !text-[9.5px] !tracking-[0.18em] rounded-full bg-[#070E1B]/85 backdrop-blur-md text-dorado border border-white/15 px-2.5 py-1">
                        0{idx + 1}
                      </span>
                      <span className="rd-label !text-[9px] !tracking-[0.18em] rounded-full bg-dorado text-tierra px-3 py-1 shadow-sm">
                        {tipoLabel[p.tipo] ?? p.tipo}
                      </span>
                      {p.destacado_badge && (
                        <span className="rd-label !text-[8.5px] !tracking-[0.15em] rounded-full bg-navy-950/85 text-dorado border border-dorado/40 px-2.5 py-1">
                          {p.destacado_badge}
                        </span>
                      )}
                    </div>

                    {/* Botón Comparar Superior Derecho */}
                    <button
                      type="button"
                      onClick={() => toggleComparar(p.id)}
                      className={`absolute top-3.5 right-3.5 rd-label !text-[9.5px] !tracking-[0.14em] rounded-full px-3 py-1 shadow-sm transition-all ${
                        isComparando
                          ? "bg-emerald-600 text-white border border-emerald-400"
                          : "bg-white/95 text-navy hover:bg-dorado hover:text-tierra"
                      }`}
                    >
                      {isComparando ? "✓ Comparando" : "+ Comparar"}
                    </button>

                    {/* Precio flotante sobre la foto con tipografía condensada se7endev */}
                    <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-2 pointer-events-none">
                      <div>
                        <p className="rd-condensed text-white text-[1.65rem] leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                          {precioLabel}
                        </p>
                        {valorM2 && (
                          <span className="rd-label !text-[9.5px] !tracking-[0.16em] text-dorado/95 block mt-1">
                            {valorM2}
                          </span>
                        )}
                      </div>
                      <span className="rd-label !text-[9.5px] !tracking-[0.16em] text-white bg-navy-950/80 border border-white/15 px-2.5 py-1 rounded-full">
                        {p.ciudad.split(",")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="rd-label !text-[10px] !tracking-[0.18em] text-[#8A6A1B] truncate">
                          {p.barrio ? `${p.barrio}` : p.ciudad}
                        </p>
                        <span className="rd-label !text-[9px] !tracking-[0.14em] text-navy/45 shrink-0">
                          {categoriaLabel[p.tipo] ?? p.tipo}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => abrirQuickView(p)}
                        className="text-left w-full"
                      >
                        <h3 className="font-display text-navy text-lg font-medium tracking-tight leading-snug group-hover:text-[#8A6A1B] transition-colors duration-200 mb-4 line-clamp-2">
                          {p.titulo}
                        </h3>
                      </button>

                      {/* Metadatos: Superficie & Seguridad con Hairline */}
                      <div className="grid grid-cols-2 gap-2 py-3 border-y border-navy/10 mb-5 rd-label !text-[10px] !tracking-[0.14em] text-navy/70">
                        <div className="flex items-center gap-2">
                          <SurfaceIcon />
                          <span className="truncate">
                            {formatSuperficie(p.superficie_m2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#8A6A1B] justify-end">
                          <span className="w-1.5 h-1.5 rounded-full bg-dorado" />
                          <span className="truncate">
                            Mat. 35 RP 2026
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons con estilo se7endev */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => abrirQuickView(p)}
                        className="rd-btn flex-1 justify-between bg-[#0B1528] hover:bg-dorado text-white hover:text-tierra rd-label !text-[9.5px] !tracking-[0.16em] pl-4 pr-1.5 py-1.5 shadow-sm"
                      >
                        <span className="rd-roll" data-text="Vista Rápida & Visita">
                          <span>Vista Rápida &amp; Visita</span>
                        </span>
                        <span className="rd-btn__icon w-6 h-6 bg-dorado text-tierra">
                          ↗
                        </span>
                      </button>

                      <Link
                        href={detailHref}
                        className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-full border border-navy/15 text-navy/80 hover:text-[#8A6A1B] hover:border-dorado rd-label !text-[9.5px] !tracking-[0.16em] transition-colors"
                      >
                        Ficha
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Barra Flotante de Comparación */}
      <AnimatePresence>
        {compararIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl rounded-2xl bg-navy-950/95 border border-dorado/40 px-4 py-3 text-white shadow-2xl backdrop-blur-md flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 overflow-x-auto">
              <span className="font-mono text-[10px] uppercase tracking-wider text-dorado shrink-0">
                Comparador ({compararIds.length}/3):
              </span>
              <div className="flex items-center gap-1.5">
                {propiedadesComparadas.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-body truncate max-w-[140px]"
                  >
                    <span className="truncate">{item.titulo}</span>
                    <button
                      type="button"
                      onClick={() => toggleComparar(item.id)}
                      className="text-white/60 hover:text-white"
                      aria-label="Quitar"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCompararIds([])}
                className="text-[10px] font-body uppercase tracking-wider text-white/60 hover:text-white px-2 py-1"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setModalComparador(true)}
                className="px-4 py-2 rounded-full bg-dorado text-tierra font-body text-[10px] font-semibold uppercase tracking-widest hover:bg-dorado-light transition-colors"
              >
                Comparar Ahora →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Vista Rápida (Quick-View + Agendar Visita + Ficha PDF) */}
      <AnimatePresence>
        {quickViewProp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProp(null)}
          >
            <motion.div
              className="w-full max-w-4xl rounded-[2rem] bg-white border border-dorado/30 overflow-hidden shadow-2xl text-navy my-auto max-h-[92vh] overflow-y-auto"
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Columna Izquierda: Galería + Métricas */}
                <div className="lg:col-span-6 bg-[#0B1528] text-white p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-navy/30 mb-3">
                      <Image
                        src={
                          quickViewProp.imagenes?.[fotoActivaIdx] ||
                          coverImage(quickViewProp.imagenes)
                        }
                        alt={quickViewProp.titulo}
                        fill
                        sizes="(max-width: 1024px) 100vw, 450px"
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="font-body text-[9px] font-semibold uppercase tracking-[0.18em] rounded-full bg-dorado text-tierra px-3 py-1">
                          {tipoLabel[quickViewProp.tipo] ?? quickViewProp.tipo}
                        </span>
                      </div>
                    </div>

                    {/* Miniaturas si hay más de 1 foto */}
                    {quickViewProp.imagenes &&
                      quickViewProp.imagenes.length > 1 && (
                        <div className="flex gap-2 mb-5">
                          {quickViewProp.imagenes.map((imgUrl, i) => (
                            <button
                              key={imgUrl + i}
                              type="button"
                              onClick={() => setFotoActivaIdx(i)}
                              className={`relative h-14 w-20 rounded-xl overflow-hidden border-2 transition-all ${
                                fotoActivaIdx === i
                                  ? "border-dorado scale-105"
                                  : "border-white/15 opacity-60 hover:opacity-100"
                              }`}
                            >
                              <Image
                                src={imgUrl}
                                alt=""
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}

                    {/* Indicadores Clave */}
                    <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center mb-4">
                      <div>
                        <span className="block font-mono text-[10px] uppercase text-white/55">
                          Valor Total
                        </span>
                        <span className="font-display text-base sm:text-lg font-bold text-dorado">
                          {quickViewProp.precio
                            ? `${quickViewProp.moneda} ${quickViewProp.precio.toLocaleString("es-AR")}`
                            : "Consultar"}
                        </span>
                      </div>
                      <div className="border-x border-white/10">
                        <span className="block font-mono text-[10px] uppercase text-white/55">
                          Superficie
                        </span>
                        <span className="font-display text-base sm:text-lg font-bold text-white">
                          {formatSuperficie(quickViewProp.superficie_m2)}
                        </span>
                      </div>
                      <div>
                        <span className="block font-mono text-[10px] uppercase text-white/55">
                          Valor / m²
                        </span>
                        <span className="font-display text-base sm:text-lg font-bold text-emerald-400">
                          {calcularUsdM2(quickViewProp)
                            ? `USD ${calcularUsdM2(quickViewProp)}/m²`
                            : "Consultar"}
                        </span>
                      </div>
                    </div>

                    {/* Servicios / Highlights */}
                    <div className="space-y-1.5">
                      {(
                        quickViewProp.servicios || [
                          "Títulos verificados por Martillera Colegiada",
                          "Factibilidad y servicios verificados",
                          "Acompañamiento notarial integral",
                        ]
                      ).map((srv) => (
                        <div
                          key={srv}
                          className="flex items-center gap-2 text-xs font-body text-white/80"
                        >
                          <span className="text-dorado">✓</span>
                          <span>{srv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botón Ficha Imprimible PDF */}
                  <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => imprimirFichaPropiedad(quickViewProp)}
                      className="inline-flex items-center gap-2 text-xs font-body text-dorado hover:underline"
                    >
                      <span>🖨️ Descargar / Imprimir Ficha PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleComparar(quickViewProp.id)}
                      className="text-xs font-body text-white/75 hover:text-white px-3 py-1 rounded-full bg-white/10"
                    >
                      {compararIds.includes(quickViewProp.id)
                        ? "✓ En comparador"
                        : "+ Sumar al comparador"}
                    </button>
                  </div>
                </div>

                {/* Columna Derecha: Descripción + Formulario de Visita Directa */}
                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="font-body text-[10px] uppercase tracking-[0.2em] text-[#8A6A1B] font-semibold">
                        {quickViewProp.barrio || quickViewProp.ciudad}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuickViewProp(null)}
                        className="w-8 h-8 rounded-full bg-navy/5 hover:bg-navy/10 flex items-center justify-center text-navy/60 shrink-0"
                        aria-label="Cerrar"
                      >
                        ✕
                      </button>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-navy leading-tight mb-3">
                      {quickViewProp.titulo}
                    </h3>

                    <p className="font-body text-xs sm:text-sm text-navy/65 leading-relaxed mb-6">
                      {quickViewProp.descripcion_corta ||
                        "Propiedad seleccionada por ALTUM SCI en la Patagonia. Coordiná una visita presencial o videollamada técnica con Estela Mari Rojas (Mat. 35 RP 2026)."}
                    </p>

                    {/* Formulario de Agendamiento Directo */}
                    <div className="rounded-2xl bg-[#F6F8FB] border border-navy/10 p-5">
                      <h4 className="font-display text-base font-semibold text-navy mb-1">
                        Coordinar Visita o Solicitar Dossier
                      </h4>
                      <p className="font-body text-[11px] text-navy/55 mb-4">
                        Se agenda automáticamente en el calendario de Estela y
                        abre WhatsApp directo.
                      </p>

                      {visitaAgendadaOk ? (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                          <p className="font-semibold">
                            ✓ ¡Solicitud registrada en nuestro CRM!
                          </p>
                          <p>
                            Estela Mari Rojas recibió tu pedido de visita y te
                            responderá a la brevedad.
                          </p>
                        </div>
                      ) : (
                        <form
                          onSubmit={handleAgendarDesdeQuickView}
                          className="space-y-3"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                              type="text"
                              required
                              value={nombreVisita}
                              onChange={(e) => setNombreVisita(e.target.value)}
                              placeholder="Tu nombre *"
                              className="w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-xs font-body text-navy focus:border-dorado focus:outline-none"
                            />
                            <input
                              type="tel"
                              required
                              value={telefonoVisita}
                              onChange={(e) => setTelefonoVisita(e.target.value)}
                              placeholder="Tu WhatsApp *"
                              className="w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-xs font-body text-navy focus:border-dorado focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                              type="date"
                              value={fechaVisita}
                              onChange={(e) => setFechaVisita(e.target.value)}
                              className="w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-xs font-body text-navy focus:border-dorado focus:outline-none"
                            />
                            <select
                              value={horaVisita}
                              onChange={(e) => setHoraVisita(e.target.value)}
                              className="w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-xs font-body text-navy focus:border-dorado focus:outline-none"
                            >
                              <option value="10:00">10:00 hs (Mañana)</option>
                              <option value="12:00">12:00 hs (Mediodía)</option>
                              <option value="15:30">15:30 hs (Tarde)</option>
                              <option value="17:30">17:30 hs ( Tarde/Lago)</option>
                            </select>
                          </div>
                          <button
                            type="submit"
                            disabled={enviandoVisita}
                            className="w-full py-3.5 px-5 rounded-full bg-dorado text-tierra font-body text-[11px] font-semibold uppercase tracking-[0.16em] hover:bg-dorado-light transition-all shadow-md disabled:opacity-60"
                          >
                            {enviandoVisita
                              ? "Registrando..."
                              : "Agendar Visita y Hablar por WhatsApp →"}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-navy/10 flex items-center justify-between text-[11px] font-body text-navy/55">
                    <span>Martillera Estela Mari Rojas · Mat. 35 RP 2026</span>
                    <Link
                      href="/proyectos"
                      onClick={() => setQuickViewProp(null)}
                      className="text-[#8A6A1B] font-semibold hover:underline"
                    >
                      Ir al catálogo completo →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Comparador Lado a Lado */}
      <AnimatePresence>
        {modalComparador && propiedadesComparadas.length > 0 && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalComparador(false)}
          >
            <motion.div
              className="w-full max-w-5xl rounded-[2rem] bg-white border border-dorado/30 p-6 sm:p-8 shadow-2xl text-navy my-auto max-h-[92vh] overflow-y-auto"
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-navy/10">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A6A1B] font-semibold">
                    ALTUM SCI · Análisis Comparativo
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold text-navy">
                    Comparativa de Propiedades Seleccionadas
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalComparador(false)}
                  className="w-9 h-9 rounded-full bg-navy/5 hover:bg-navy/10 flex items-center justify-center text-navy/60"
                  aria-label="Cerrar comparador"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {propiedadesComparadas.map((item) => {
                  const usdM2 = calcularUsdM2(item);
                  const minUsdM2 = Math.min(
                    ...propiedadesComparadas
                      .map((x) => calcularUsdM2(x) ?? Infinity)
                      .filter(Boolean),
                  );
                  const isMejorM2 =
                    usdM2 !== null &&
                    propiedadesComparadas.length > 1 &&
                    usdM2 === minUsdM2;

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-navy/12 bg-[#F6F8FB] overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[16/10] bg-navy/10">
                          <Image
                            src={coverImage(item.imagenes)}
                            alt={item.titulo}
                            fill
                            sizes="320px"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => toggleComparar(item.id)}
                            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-navy-950/80 text-white text-xs flex items-center justify-center"
                            title="Quitar"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="p-5 space-y-3">
                          <div>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8A6A1B] font-semibold">
                              {item.ciudad}
                            </span>
                            <h4 className="font-display text-lg font-semibold text-navy leading-snug mt-0.5">
                              {item.titulo}
                            </h4>
                          </div>

                          <div className="space-y-2 pt-3 border-t border-navy/10 text-xs font-body">
                            <div className="flex justify-between py-1 border-b border-navy/5">
                              <span className="text-navy/55">Valor Total</span>
                              <span className="font-bold text-navy">
                                {item.precio
                                  ? `${item.moneda} ${item.precio.toLocaleString("es-AR")}`
                                  : "Consultar"}
                              </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-navy/5">
                              <span className="text-navy/55">Superficie</span>
                              <span className="font-semibold text-navy">
                                {formatSuperficie(item.superficie_m2)}
                              </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-navy/5">
                              <span className="text-navy/55">Valor / m²</span>
                              <span
                                className={`font-mono font-bold ${
                                  isMejorM2 ? "text-emerald-700" : "text-navy"
                                }`}
                              >
                                {usdM2 ? `USD ${usdM2}/m²` : "—"}
                                {isMejorM2 && " ★ Mejor m²"}
                              </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-navy/5">
                              <span className="text-navy/55">Categoría</span>
                              <span className="text-navy font-medium">
                                {tipoLabel[item.tipo] ?? item.tipo}
                              </span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-navy/55">Respaldo</span>
                              <span className="text-[#8A6A1B] font-semibold">
                                Mat. 35 RP 2026
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setModalComparador(false);
                            abrirQuickView(item);
                          }}
                          className="flex-1 py-2.5 px-4 rounded-full bg-dorado text-tierra font-body text-[10px] font-semibold uppercase tracking-widest hover:bg-dorado-light transition-colors"
                        >
                          Agendar Visita
                        </button>
                        <button
                          type="button"
                          onClick={() => imprimirFichaPropiedad(item)}
                          className="py-2.5 px-3 rounded-full border border-navy/15 bg-white text-navy text-xs"
                          title="Imprimir Ficha PDF"
                        >
                          🖨️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function SurfaceIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-dorado shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  );
}
