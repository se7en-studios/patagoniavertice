"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import type { ItemPropiedad } from "@/components/marketing/CatalogoInteractivo";
import { estadoLabel, focusRing, formatPrecio, tipoLabel } from "./ui";

export const MAX_COMPARE = 3;

interface Props {
  items: ItemPropiedad[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function precioM2(p: ItemPropiedad): string {
  if (!p.precio || !p.superficie_m2) return "—";
  return `${p.moneda} ${Math.round(p.precio / p.superficie_m2).toLocaleString("es-AR")}`;
}

function rows(items: ItemPropiedad[]): { label: string; values: string[] }[] {
  return [
    {
      label: "Precio",
      values: items.map((p) => formatPrecio(p.precio, p.moneda)),
    },
    { label: "Precio por m²", values: items.map(precioM2) },
    {
      label: "Superficie",
      values: items.map((p) =>
        p.superficie_m2 ? `${p.superficie_m2.toLocaleString("es-AR")} m²` : "—",
      ),
    },
    {
      label: "Zona",
      values: items.map((p) =>
        [p.ciudad, p.barrio].filter(Boolean).join(" · "),
      ),
    },
    {
      label: "Tipo",
      values: items.map((p) => tipoLabel[p.tipo] ?? p.tipo ?? "—"),
    },
    {
      label: "Estado",
      values: items.map((p) => estadoLabel[p.estado] ?? p.estado ?? "—"),
    },
  ];
}

function CompareModal({
  items,
  onClose,
}: {
  items: ItemPropiedad[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const els = Array.from(
        ref.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previo?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-navy-950/80 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="comparador-titulo"
        className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-crema border border-dorado/40 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 p-5 border-b border-tierra/10 sticky top-0 bg-crema z-10">
          <h2
            id="comparador-titulo"
            className="font-display text-tierra text-2xl font-medium"
          >
            Comparar propiedades
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar comparador"
            className={`px-3 py-2 border border-tierra/25 text-tierra font-body text-[11px] tracking-[0.14em] uppercase hover:border-dorado ${focusRing}`}
          >
            ✕ Cerrar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left font-body text-sm text-tierra">
            <thead>
              <tr className="border-b border-tierra/10">
                <th scope="col" className="p-4 w-32 sm:w-40">
                  <span className="sr-only">Característica</span>
                </th>
                {items.map((p) => (
                  <th
                    key={p.id}
                    scope="col"
                    className="p-4 align-top font-display text-lg font-medium leading-snug"
                  >
                    <Link
                      href={`/proyectos/${p.id}`}
                      className={`hover:text-dorado underline-offset-4 hover:underline ${focusRing}`}
                    >
                      {p.titulo}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows(items).map((r) => (
                <tr
                  key={r.label}
                  className="border-b border-tierra/10 even:bg-white/60"
                >
                  <th
                    scope="row"
                    className="p-4 text-[10px] tracking-[0.2em] uppercase text-tierra/60 font-medium"
                  >
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={items[i].id} className="p-4">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function CompareBar({ items, onRemove, onClear }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) setOpen(false);
  }, [items.length]);

  if (items.length === 0) return null;

  const abrir = () => {
    track("compare_open", { cantidad: items.length });
    setOpen(true);
  };

  return (
    <>
      <div
        role="region"
        aria-label="Comparador de propiedades"
        className="fixed inset-x-3 bottom-20 lg:bottom-6 lg:left-6 lg:right-24 z-40 bg-navy-950 text-crema border border-dorado/40 shadow-2xl"
      >
        <div className="max-w-5xl mx-auto p-3 sm:p-4 flex flex-wrap items-center gap-3">
          <span className="font-body text-dorado text-[11px] tracking-[0.2em] uppercase font-semibold">
            Comparar ({items.length}/{MAX_COMPARE})
          </span>

          <ul className="flex flex-wrap gap-2 flex-1 min-w-0">
            {items.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-2 pl-3 pr-1 py-1 bg-crema/10 border border-crema/20 font-body text-xs max-w-[14rem]"
              >
                <span className="truncate">{p.titulo}</span>
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  aria-label={`Quitar ${p.titulo} de la comparación`}
                  className={`px-2 py-1 hover:text-dorado ${focusRing}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClear}
              className={`px-3 py-2.5 border border-crema/25 font-body text-[10px] tracking-[0.14em] uppercase hover:border-dorado ${focusRing}`}
            >
              Vaciar
            </button>
            <button
              type="button"
              onClick={abrir}
              disabled={items.length < 2}
              title={
                items.length < 2 ? "Elegí al menos 2 propiedades" : undefined
              }
              className={`px-4 py-2.5 bg-dorado text-tierra font-body text-[10px] font-semibold tracking-[0.14em] uppercase hover:bg-dorado-light disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
            >
              {items.length < 2 ? "Elegí 2 o más" : "Comparar ahora"}
            </button>
          </div>
        </div>
      </div>

      {open && <CompareModal items={items} onClose={() => setOpen(false)} />}
    </>
  );
}
