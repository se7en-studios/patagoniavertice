"use client";

import { coverImage } from "@/lib/property-images";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { useSearchParams } from "next/navigation";

export interface ItemPropiedad {
  id: string;
  titulo: string;
  barrio?: string;
  ciudad: string;
  tipo: string;
  estado: string;
  imagenes: string[];
  descripcion: string;
  precio: number | null;
  moneda: string;
}

const tipoLabel: Record<string, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
  desarrollo: "Desarrollo",
  lote: "Lote / Terreno",
  chacra: "Chacra",
};

const estadoBadge: Record<string, { label: string; color: string }> = {
  disponible: { label: "Disponible", color: "bg-dorado text-tierra font-semibold" },
  en_construccion: { label: "A Estrenar / Pozo", color: "bg-navy-950 text-dorado border border-dorado/40" },
  reservado: { label: "Reservado", color: "bg-zinc-800 text-crema/70" },
  vendido: { label: "Vendido", color: "bg-emerald-950 text-emerald-300 border border-emerald-500/30" },
};

const CIUDADES_FILTRO = ["Todas", "Cipolletti", "Catriel", "General Roca", "Bariloche"] as const;
const TIPOS_FILTRO = ["Todos", "venta", "alquiler", "lote", "chacra"] as const;
const PRECIOS_FILTRO = [
  { id: "todos", label: "Cualquier Precio" },
  { id: "hasta-80", label: "Hasta USD 80.000" },
  { id: "80-180", label: "USD 80.000 - 180.000" },
  { id: "mas-180", label: "Más de USD 180.000" },
] as const;

export default function CatalogoInteractivo({
  propiedadesIniciales,
}: {
  propiedadesIniciales: ItemPropiedad[];
}) {
  const searchParams = useSearchParams();
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>("Todos");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>("Todas");
  const [precioFiltro, setPrecioFiltro] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");

  // Pre-aplicar filtros desde URL params (ej: desde el buscador del Hero)
  useEffect(() => {
    const tipo = searchParams.get("tipo");
    const ciudad = searchParams.get("ciudad");
    if (tipo && TIPOS_FILTRO.includes(tipo as typeof TIPOS_FILTRO[number])) {
      setTipoSeleccionado(tipo);
    }
    if (ciudad && CIUDADES_FILTRO.includes(ciudad as typeof CIUDADES_FILTRO[number])) {
      setCiudadSeleccionada(ciudad);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const propiedadesFiltradas = useMemo(() => {
    return propiedadesIniciales.filter((p) => {
      // Tipo
      if (tipoSeleccionado !== "Todos" && p.tipo !== tipoSeleccionado) return false;

      // Ciudad
      if (ciudadSeleccionada !== "Todas" && p.ciudad !== ciudadSeleccionada) return false;

      // Precio
      if (p.precio !== null) {
        if (precioFiltro === "hasta-80" && p.precio > 80000) return false;
        if (precioFiltro === "80-180" && (p.precio < 80000 || p.precio > 180000)) return false;
        if (precioFiltro === "mas-180" && p.precio <= 180000) return false;
      }

      // Buscador
      if (busqueda.trim() !== "") {
        const query = busqueda.toLowerCase();
        const coincideTitulo = p.titulo.toLowerCase().includes(query);
        const coincideBarrio = p.barrio?.toLowerCase().includes(query);
        const coincideCiudad = p.ciudad.toLowerCase().includes(query);
        const coincideDesc = p.descripcion.toLowerCase().includes(query);
        if (!coincideTitulo && !coincideBarrio && !coincideCiudad && !coincideDesc) return false;
      }

      return true;
    });
  }, [propiedadesIniciales, tipoSeleccionado, ciudadSeleccionada, precioFiltro, busqueda]);

  const limpiarFiltros = () => {
    setTipoSeleccionado("Todos");
    setCiudadSeleccionada("Todas");
    setPrecioFiltro("todos");
    setBusqueda("");
  };

  return (
    <div className="space-y-12">
      {/* ── Control Bar de Filtros ────────────────────────────────────────── */}
      <div className="p-6 lg:p-8 bg-white border border-tierra/10 shadow-sm space-y-6">
        {/* Fila 1: Buscador de texto libre */}
        <div className="relative">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por barrio, calle o característica (ej: piscina, vista al lago, centro)..."
            className="w-full bg-crema/40 border border-tierra/15 px-4 py-3.5 text-xs font-body text-tierra placeholder:text-tierra/40 focus:outline-none focus:border-dorado transition-colors"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-tierra/40 hover:text-tierra text-xs"
            >
              ✕ Limpiar
            </button>
          )}
        </div>

        {/* Fila 2: Filtros desplegables / botones */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Ciudad */}
          <div>
            <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-tierra/50 mb-2 font-medium">
              Ubicación / Ciudad
            </label>
            <select
              value={ciudadSeleccionada}
              onChange={(e) => setCiudadSeleccionada(e.target.value)}
              className="w-full bg-crema/40 border border-tierra/15 px-3 py-2.5 text-xs font-body text-tierra focus:outline-none focus:border-dorado transition-colors"
            >
              {CIUDADES_FILTRO.map((c) => (
                <option key={c} value={c}>
                  {c === "Todas" ? "Todas las ciudades" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Operación */}
          <div>
            <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-tierra/50 mb-2 font-medium">
              Tipo de Inmueble
            </label>
            <select
              value={tipoSeleccionado}
              onChange={(e) => setTipoSeleccionado(e.target.value)}
              className="w-full bg-crema/40 border border-tierra/15 px-3 py-2.5 text-xs font-body text-tierra focus:outline-none focus:border-dorado transition-colors"
            >
              {TIPOS_FILTRO.map((t) => (
                <option key={t} value={t}>
                  {t === "Todos" ? "Todos los tipos" : tipoLabel[t] || t}
                </option>
              ))}
            </select>
          </div>

          {/* Rango de Precios */}
          <div>
            <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-tierra/50 mb-2 font-medium">
              Rango de Precio (USD)
            </label>
            <select
              value={precioFiltro}
              onChange={(e) => setPrecioFiltro(e.target.value)}
              className="w-full bg-crema/40 border border-tierra/15 px-3 py-2.5 text-xs font-body text-tierra focus:outline-none focus:border-dorado transition-colors"
            >
              {PRECIOS_FILTRO.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fila 3: Contador y Reset */}
        <div className="flex items-center justify-between pt-2 border-t border-tierra/10 font-body text-xs text-tierra/60">
          <span>
            Mostrando <strong>{propiedadesFiltradas.length}</strong> de{" "}
            {propiedadesIniciales.length} propiedades
          </span>

          {(tipoSeleccionado !== "Todos" ||
            ciudadSeleccionada !== "Todas" ||
            precioFiltro !== "todos" ||
            busqueda !== "") && (
            <button
              onClick={limpiarFiltros}
              className="text-dorado font-medium hover:underline text-[11px] tracking-wider uppercase"
            >
              Reestablecer filtros
            </button>
          )}
        </div>
      </div>

      {/* ── Grid de Propiedades ───────────────────────────────────────────── */}
      {propiedadesFiltradas.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {propiedadesFiltradas.map((p) => {
              const imagen = coverImage(p.imagenes);
              const badge = estadoBadge[p.estado] ?? estadoBadge.disponible;

              return (
                <motion.article
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="group bg-white border border-tierra/10 overflow-hidden shadow-sm hover:shadow-2xl hover:border-dorado/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Imagen principal con Badges */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-navy-950">
                      <Image
                        src={imagen}
                        alt={p.titulo}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="px-2.5 py-1 bg-navy-950/90 text-dorado border border-dorado/30 font-body text-[9px] font-semibold tracking-[0.2em] uppercase backdrop-blur-md">
                          {p.tipo ? tipoLabel[p.tipo] : "Propiedad"}
                        </span>
                        <span
                          className={`px-2.5 py-1 font-body text-[9px] uppercase tracking-[0.15em] ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      {/* Precio en imagen */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="font-body text-crema/70 text-[10px] tracking-wider uppercase block">
                          Valor
                        </span>
                        <span className="font-display text-crema text-2xl font-bold tracking-tight">
                          {p.precio
                            ? `${p.moneda} ${p.precio.toLocaleString("es-AR")}`
                            : "Consultar"}
                        </span>
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 font-body text-dorado text-[11px] tracking-[0.2em] uppercase font-semibold">
                        <span>{p.ciudad}</span>
                        {p.barrio && <span>· {p.barrio}</span>}
                      </div>

                      <h2 className="font-display text-tierra text-xl font-medium leading-snug group-hover:text-dorado transition-colors">
                        <Link href={`/proyectos/${p.id}`}>{p.titulo}</Link>
                      </h2>

                      <p className="font-body text-tierra/60 text-xs leading-relaxed line-clamp-3">
                        {p.descripcion}
                      </p>
                    </div>
                  </div>

                  {/* Acciones Footer */}
                  <div className="p-6 pt-0 border-t border-tierra/5 grid grid-cols-2 gap-2 mt-4">
                    <Link
                      href={`/proyectos/${p.id}`}
                      className="py-3 px-3 border border-tierra/20 text-tierra text-center font-body text-[10px] tracking-[0.14em] uppercase font-semibold hover:border-dorado hover:text-dorado transition-colors"
                    >
                      Ver Detalle
                    </Link>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hola Altum Inmobiliaria, quisiera consultar por la propiedad: ${p.titulo} (${p.ciudad} - USD ${p.precio?.toLocaleString("es-AR") || "Consultar"})`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-3 bg-dorado text-tierra text-center font-body text-[10px] tracking-[0.14em] uppercase font-semibold hover:bg-dorado-light transition-all"
                    >
                      Consultar
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="p-16 text-center bg-white border border-tierra/10 space-y-4">
          <p className="font-display text-2xl text-tierra font-medium">
            No se encontraron propiedades con los filtros seleccionados
          </p>
          <p className="font-body text-tierra/50 text-sm">
            Probá ajustando la ubicación, el rango de precios o el término de búsqueda.
          </p>
          <button
            onClick={limpiarFiltros}
            className="inline-flex items-center gap-2 px-6 py-3 bg-dorado text-tierra font-body text-[10px] font-semibold tracking-widest uppercase hover:bg-dorado-light transition-all"
          >
            Ver todas las propiedades
          </button>
        </div>
      )}
    </div>
  );
}
