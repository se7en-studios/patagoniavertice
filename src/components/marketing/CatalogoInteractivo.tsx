"use client";

import { coverImage } from "@/lib/property-images";
import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { track } from "@/lib/analytics";
import { useFavorites } from "@/lib/favorites";
import FavoriteButton from "@/components/catalogo/FavoriteButton";
import ShareButton from "@/components/catalogo/ShareButton";
import WhatsAppLink from "@/components/catalogo/WhatsAppLink";
import CompareBar, { MAX_COMPARE } from "@/components/catalogo/CompareBar";
import {
  estadoLabel,
  focusRing,
  formatPrecio,
  tipoLabel,
} from "@/components/catalogo/ui";

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
  superficie_m2?: number | null;
  created_at?: string;
}

const estadoBadge: Record<string, string> = {
  disponible: "bg-dorado text-tierra font-semibold",
  en_construccion: "bg-navy-950 text-dorado border border-dorado/40",
  reservado: "bg-zinc-800 text-crema/70",
  vendido: "bg-emerald-950 text-emerald-300 border border-emerald-500/30",
};

const CIUDADES_FILTRO = [
  "Cipolletti",
  "Catriel",
  "General Roca",
  "Bariloche",
] as const;
const TIPOS_FILTRO = ["venta", "alquiler", "lote", "chacra"] as const;
const ORDENES = [
  { id: "", label: "Destacadas primero" },
  { id: "precio_asc", label: "Precio: menor a mayor" },
  { id: "precio_desc", label: "Precio: mayor a menor" },
  { id: "recientes", label: "Más recientes" },
] as const;

const fieldClass = `w-full bg-crema/40 border border-tierra/15 px-3 py-2.5 text-xs font-body text-tierra placeholder:text-tierra/40 focus:outline-none focus:border-dorado ${focusRing} transition-colors`;
const labelClass =
  "block font-body text-[10px] tracking-[0.2em] uppercase text-tierra/60 mb-2 font-medium";

interface Filtros {
  q: string;
  tipo: string;
  ciudad: string;
  pmin: number | null;
  pmax: number | null;
  smin: number | null;
  smax: number | null;
  orden: string;
  fav: boolean;
}

function num(v: string | null): number | null {
  if (v === null || v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function leerFiltros(sp: URLSearchParams): Filtros {
  const tipo = sp.get("tipo") ?? "";
  const ciudad = sp.get("ciudad") ?? "";
  const orden = sp.get("orden") ?? "";
  return {
    q: sp.get("q") ?? "",
    tipo: (TIPOS_FILTRO as readonly string[]).includes(tipo) ? tipo : "",
    ciudad: (CIUDADES_FILTRO as readonly string[]).includes(ciudad)
      ? ciudad
      : "",
    pmin: num(sp.get("pmin")),
    pmax: num(sp.get("pmax")),
    smin: num(sp.get("smin")),
    smax: num(sp.get("smax")),
    orden: ORDENES.some((o) => o.id === orden) ? orden : "",
    fav: sp.get("fav") === "1",
  };
}

function aplicarFiltros(
  items: ItemPropiedad[],
  f: Filtros,
  favIds: string[],
): ItemPropiedad[] {
  const query = f.q.trim().toLowerCase();
  const hayPrecio = f.pmin !== null || f.pmax !== null;
  const haySup = f.smin !== null || f.smax !== null;

  const out = items.filter((p) => {
    if (f.fav && !favIds.includes(p.id)) return false;
    if (f.tipo && p.tipo !== f.tipo) return false;
    if (f.ciudad && p.ciudad !== f.ciudad) return false;
    if (hayPrecio) {
      if (p.precio === null) return false;
      if (f.pmin !== null && p.precio < f.pmin) return false;
      if (f.pmax !== null && p.precio > f.pmax) return false;
    }
    if (haySup) {
      const s = p.superficie_m2;
      if (!s) return false;
      if (f.smin !== null && s < f.smin) return false;
      if (f.smax !== null && s > f.smax) return false;
    }
    if (query) {
      const hay = [p.titulo, p.barrio, p.ciudad, p.descripcion]
        .filter(Boolean)
        .some((t) => (t as string).toLowerCase().includes(query));
      if (!hay) return false;
    }
    return true;
  });

  if (f.orden === "precio_asc" || f.orden === "precio_desc") {
    const dir = f.orden === "precio_asc" ? 1 : -1;
    // Sin precio ("Consultar") siempre al final.
    return [...out].sort((a, b) => {
      if (a.precio === null && b.precio === null) return 0;
      if (a.precio === null) return 1;
      if (b.precio === null) return -1;
      return (a.precio - b.precio) * dir;
    });
  }
  if (f.orden === "recientes") {
    return [...out].sort((a, b) =>
      (b.created_at ?? "").localeCompare(a.created_at ?? ""),
    );
  }
  return out;
}

function descripcionChips(f: Filtros): { clave: string[]; label: string }[] {
  const chips: { clave: string[]; label: string }[] = [];
  if (f.q.trim())
    chips.push({ clave: ["q"], label: `Búsqueda: "${f.q.trim()}"` });
  if (f.tipo)
    chips.push({
      clave: ["tipo"],
      label: `Tipo: ${tipoLabel[f.tipo] ?? f.tipo}`,
    });
  if (f.ciudad) chips.push({ clave: ["ciudad"], label: `Ciudad: ${f.ciudad}` });
  if (f.pmin !== null)
    chips.push({
      clave: ["pmin"],
      label: `Precio desde ${f.pmin.toLocaleString("es-AR")}`,
    });
  if (f.pmax !== null)
    chips.push({
      clave: ["pmax"],
      label: `Precio hasta ${f.pmax.toLocaleString("es-AR")}`,
    });
  if (f.smin !== null)
    chips.push({
      clave: ["smin"],
      label: `Desde ${f.smin.toLocaleString("es-AR")} m²`,
    });
  if (f.smax !== null)
    chips.push({
      clave: ["smax"],
      label: `Hasta ${f.smax.toLocaleString("es-AR")} m²`,
    });
  if (f.fav) chips.push({ clave: ["fav"], label: "Solo mis favoritos" });
  return chips;
}

/** Input con estado local; confirma el valor al URL tras una pausa para no navegar en cada tecla. */
function DebouncedInput({
  id,
  value,
  onCommit,
  ...rest
}: {
  id: string;
  value: string;
  onCommit: (v: string) => void;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "id"
>) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    if (local === value) return;
    const t = window.setTimeout(() => onCommit(local), 400);
    return () => window.clearTimeout(t);
  }, [local, value, onCommit]);

  return (
    <input
      id={id}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      className={fieldClass}
      {...rest}
    />
  );
}

export default function CatalogoInteractivo({
  propiedadesIniciales,
}: {
  propiedadesIniciales: ItemPropiedad[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ids: favIds } = useFavorites();
  const [comparar, setComparar] = useState<string[]>([]);

  const filtros = useMemo(
    () => leerFiltros(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  // replace (no push): "atrás" vuelve a la página previa y la URL conserva los filtros al regresar de una ficha.
  const setParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      if (qs) track("search_submit", Object.fromEntries(next));
    },
    [router, pathname, searchParams],
  );

  const commitQ = useCallback(
    (v: string) => setParams({ q: v.trim() }),
    [setParams],
  );
  const commitPmin = useCallback(
    (v: string) => setParams({ pmin: num(v) === null ? null : v }),
    [setParams],
  );
  const commitPmax = useCallback(
    (v: string) => setParams({ pmax: num(v) === null ? null : v }),
    [setParams],
  );
  const commitSmin = useCallback(
    (v: string) => setParams({ smin: num(v) === null ? null : v }),
    [setParams],
  );
  const commitSmax = useCallback(
    (v: string) => setParams({ smax: num(v) === null ? null : v }),
    [setParams],
  );

  const propiedadesFiltradas = useMemo(
    () => aplicarFiltros(propiedadesIniciales, filtros, favIds),
    [propiedadesIniciales, filtros, favIds],
  );

  const chips = descripcionChips(filtros);
  const limpiarFiltros = () => router.replace(pathname, { scroll: false });

  const seleccionadas = useMemo(
    () =>
      comparar
        .map((id) => propiedadesIniciales.find((p) => p.id === id))
        .filter((p): p is ItemPropiedad => Boolean(p)),
    [comparar, propiedadesIniciales],
  );

  const toggleComparar = (id: string) =>
    setComparar((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= MAX_COMPARE
          ? prev
          : [...prev, id],
    );

  const waVacio = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola Altum Inmobiliaria, no encontré en el catálogo lo que busco.${
      chips.length
        ? ` Mi búsqueda: ${chips.map((c) => c.label).join(", ")}.`
        : ""
    } ¿Me ayudan?`,
  )}`;

  const sinFavoritos = filtros.fav && favIds.length === 0;

  return (
    <div className="space-y-8">
      {/* ── Control Bar de Filtros ────────────────────────────────────────── */}
      <form
        role="search"
        aria-label="Filtrar propiedades"
        onSubmit={(e) => e.preventDefault()}
        className="p-6 lg:p-8 bg-white border border-tierra/10 shadow-sm space-y-6"
      >
        <div>
          <label htmlFor="cat-q" className={labelClass}>
            Buscar
          </label>
          <DebouncedInput
            id="cat-q"
            type="search"
            value={filtros.q}
            onCommit={commitQ}
            placeholder="Barrio, calle o característica (ej: vista al lago, centro)..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="cat-ciudad" className={labelClass}>
              Ciudad
            </label>
            <select
              id="cat-ciudad"
              value={filtros.ciudad}
              onChange={(e) => setParams({ ciudad: e.target.value })}
              className={fieldClass}
            >
              <option value="">Todas las ciudades</option>
              {CIUDADES_FILTRO.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cat-tipo" className={labelClass}>
              Tipo de inmueble
            </label>
            <select
              id="cat-tipo"
              value={filtros.tipo}
              onChange={(e) => setParams({ tipo: e.target.value })}
              className={fieldClass}
            >
              <option value="">Todos los tipos</option>
              {TIPOS_FILTRO.map((t) => (
                <option key={t} value={t}>
                  {tipoLabel[t]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cat-pmin" className={labelClass}>
              Precio desde (USD)
            </label>
            <DebouncedInput
              id="cat-pmin"
              type="number"
              min={0}
              inputMode="numeric"
              value={filtros.pmin?.toString() ?? ""}
              onCommit={commitPmin}
              placeholder="Mínimo"
            />
          </div>
          <div>
            <label htmlFor="cat-pmax" className={labelClass}>
              Precio hasta (USD)
            </label>
            <DebouncedInput
              id="cat-pmax"
              type="number"
              min={0}
              inputMode="numeric"
              value={filtros.pmax?.toString() ?? ""}
              onCommit={commitPmax}
              placeholder="Máximo"
            />
          </div>

          <div>
            <label htmlFor="cat-smin" className={labelClass}>
              Superficie mínima (m²)
            </label>
            <DebouncedInput
              id="cat-smin"
              type="number"
              min={0}
              inputMode="numeric"
              value={filtros.smin?.toString() ?? ""}
              onCommit={commitSmin}
              placeholder="Mínima"
            />
          </div>
          <div>
            <label htmlFor="cat-smax" className={labelClass}>
              Superficie máxima (m²)
            </label>
            <DebouncedInput
              id="cat-smax"
              type="number"
              min={0}
              inputMode="numeric"
              value={filtros.smax?.toString() ?? ""}
              onCommit={commitSmax}
              placeholder="Máxima"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="cat-orden" className={labelClass}>
              Ordenar por
            </label>
            <select
              id="cat-orden"
              value={filtros.orden}
              onChange={(e) => setParams({ orden: e.target.value })}
              className={fieldClass}
            >
              {ORDENES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {chips.length > 0 && (
          <ul aria-label="Filtros activos" className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <li
                key={c.clave.join()}
                className="inline-flex items-center gap-1 pl-3 pr-1 py-1 bg-navy-950 text-crema border border-dorado/40 font-body text-xs"
              >
                <span>{c.label}</span>
                <button
                  type="button"
                  onClick={() =>
                    setParams(Object.fromEntries(c.clave.map((k) => [k, null])))
                  }
                  aria-label={`Quitar filtro: ${c.label}`}
                  className={`px-2 py-1 hover:text-dorado ${focusRing}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-tierra/10 font-body text-xs text-tierra/70">
          <span role="status" aria-live="polite">
            Mostrando <strong>{propiedadesFiltradas.length}</strong> de{" "}
            {propiedadesIniciales.length} propiedades
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-pressed={filtros.fav}
              onClick={() => setParams({ fav: filtros.fav ? null : "1" })}
              className={`px-3 py-2 border font-body text-[10px] tracking-[0.14em] uppercase font-semibold ${focusRing} ${
                filtros.fav
                  ? "bg-navy-950 text-dorado border-dorado"
                  : "border-tierra/25 text-tierra hover:border-dorado hover:text-dorado"
              }`}
            >
              {filtros.fav ? "✓ " : ""}Mis favoritos ({favIds.length})
            </button>
            <ShareButton
              titulo="Catálogo de propiedades Altum"
              label="Compartir búsqueda"
              className="px-3 py-2 border border-tierra/25 text-tierra font-body text-[10px] tracking-[0.14em] uppercase font-semibold hover:border-dorado hover:text-dorado"
            />
            {chips.length > 0 && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className={`px-2 py-2 text-dorado font-medium hover:underline text-[11px] tracking-wider uppercase ${focusRing}`}
              >
                Reestablecer filtros
              </button>
            )}
          </div>
        </div>
      </form>

      {/* ── Grid de Propiedades ───────────────────────────────────────────── */}
      {propiedadesFiltradas.length > 0 ? (
        <motion.ul
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {propiedadesFiltradas.map((p) => {
              const imagen = coverImage(p.imagenes);
              const badge = estadoBadge[p.estado] ?? estadoBadge.disponible;
              const enComparador = comparar.includes(p.id);
              const comparadorLleno =
                !enComparador && comparar.length >= MAX_COMPARE;

              return (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="list-none"
                >
                  <article className="group h-full bg-white border border-tierra/10 overflow-hidden shadow-sm hover:shadow-2xl hover:border-dorado/40 transition-all duration-300 flex flex-col justify-between">
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

                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          <span className="px-2.5 py-1 bg-navy-950/90 text-dorado border border-dorado/30 font-body text-[9px] font-semibold tracking-[0.2em] uppercase backdrop-blur-md">
                            {p.tipo
                              ? (tipoLabel[p.tipo] ?? p.tipo)
                              : "Propiedad"}
                          </span>
                          <span
                            className={`px-2.5 py-1 font-body text-[9px] uppercase tracking-[0.15em] ${badge}`}
                          >
                            {estadoLabel[p.estado] ?? estadoLabel.disponible}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 z-10">
                          <span className="font-body text-crema/70 text-[10px] tracking-wider uppercase block">
                            Valor
                          </span>
                          <span className="font-display text-crema text-2xl font-bold tracking-tight">
                            {formatPrecio(p.precio, p.moneda)}
                          </span>
                        </div>

                        <FavoriteButton
                          id={p.id}
                          titulo={p.titulo}
                          className="absolute bottom-3 right-3 z-10 w-10 h-10 bg-navy-950/85 text-dorado border border-dorado/40 hover:bg-navy-950"
                        />
                      </div>

                      {/* Contenido */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-2 font-body text-dorado text-[11px] tracking-[0.2em] uppercase font-semibold">
                          <span>{p.ciudad}</span>
                          {p.barrio && <span>· {p.barrio}</span>}
                          {p.superficie_m2 ? (
                            <span>
                              · {p.superficie_m2.toLocaleString("es-AR")} m²
                            </span>
                          ) : null}
                        </div>

                        <h2 className="font-display text-tierra text-xl font-medium leading-snug group-hover:text-dorado transition-colors">
                          <Link
                            href={`/proyectos/${p.id}`}
                            className={focusRing}
                          >
                            {p.titulo}
                          </Link>
                        </h2>

                        <p className="font-body text-tierra/70 text-xs leading-relaxed line-clamp-3">
                          {p.descripcion}
                        </p>
                      </div>
                    </div>

                    {/* Acciones Footer */}
                    <div className="px-6 pb-6 pt-4 border-t border-tierra/5 space-y-2 mt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/proyectos/${p.id}`}
                          className={`py-3 px-3 border border-tierra/20 text-tierra text-center font-body text-[10px] tracking-[0.14em] uppercase font-semibold hover:border-dorado hover:text-dorado transition-colors ${focusRing}`}
                        >
                          Ver Detalle
                        </Link>

                        <WhatsAppLink
                          origen="catalogo"
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                            `Hola Altum Inmobiliaria, quisiera consultar por la propiedad: ${p.titulo} (${p.ciudad} - ${formatPrecio(p.precio, p.moneda)})`,
                          )}`}
                          className={`py-3 px-3 bg-dorado text-tierra text-center font-body text-[10px] tracking-[0.14em] uppercase font-semibold hover:bg-dorado-light transition-all ${focusRing}`}
                        >
                          Consultar
                        </WhatsAppLink>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          aria-pressed={enComparador}
                          disabled={comparadorLleno}
                          onClick={() => toggleComparar(p.id)}
                          aria-label={
                            enComparador
                              ? `Quitar ${p.titulo} de la comparación`
                              : `Agregar ${p.titulo} a la comparación`
                          }
                          title={
                            comparadorLleno
                              ? `Máximo ${MAX_COMPARE} propiedades`
                              : undefined
                          }
                          className={`py-2.5 px-3 border font-body text-[10px] tracking-[0.14em] uppercase font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${focusRing} ${
                            enComparador
                              ? "bg-navy-950 text-dorado border-dorado"
                              : "border-tierra/20 text-tierra hover:border-dorado hover:text-dorado"
                          }`}
                        >
                          {enComparador ? "✓ Comparando" : "+ Comparar"}
                        </button>
                        <ShareButton
                          titulo={p.titulo}
                          path={`/proyectos/${p.id}`}
                          className="py-2.5 px-3 border border-tierra/20 text-tierra font-body text-[10px] tracking-[0.14em] uppercase font-semibold hover:border-dorado hover:text-dorado"
                        />
                      </div>
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="p-12 lg:p-16 text-center bg-white border border-tierra/10 space-y-5">
          <p className="font-display text-2xl text-tierra font-medium">
            {sinFavoritos
              ? "Todavía no guardaste favoritos"
              : "No encontramos propiedades con esos filtros"}
          </p>
          <p className="font-body text-tierra/70 text-sm max-w-xl mx-auto">
            {sinFavoritos
              ? "Tocá el corazón en cualquier propiedad para guardarla acá."
              : "Probá ampliando el rango de precio o la superficie, o contanos qué buscás y te ayudamos a encontrarlo."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={limpiarFiltros}
              className={`px-6 py-3 border border-tierra/25 text-tierra font-body text-[10px] font-semibold tracking-widest uppercase hover:border-dorado hover:text-dorado transition-colors ${focusRing}`}
            >
              Ver todas las propiedades
            </button>
            <WhatsAppLink
              origen="catalogo"
              href={waVacio}
              className={`px-6 py-3 bg-dorado text-tierra font-body text-[10px] font-semibold tracking-widest uppercase hover:bg-dorado-light transition-all ${focusRing}`}
            >
              Contanos qué buscás por WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      )}

      <CompareBar
        items={seleccionadas}
        onRemove={(id) => setComparar((prev) => prev.filter((x) => x !== id))}
        onClear={() => setComparar([])}
      />
    </div>
  );
}
