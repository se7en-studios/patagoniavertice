"use client";

import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Search,
  Mail,
  Phone,
  MessageCircle,
  Inbox,
  Clock,
} from "lucide-react";

interface LeadItem {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string | null;
  propiedad_id?: string | null;
  origen?: string | null;
  estado: "nuevo" | "contactado" | "en_seguimiento" | "cerrado";
  created_at: string;
}

const ESTADOS: {
  id: LeadItem["estado"];
  label: string;
  dot: string;
  active: string;
}[] = [
  { id: "nuevo", label: "Nuevo", dot: "bg-dorado", active: "bg-dorado text-tierra" },
  { id: "contactado", label: "Contactado", dot: "bg-sky-400", active: "bg-sky-400 text-[#06101f]" },
  { id: "en_seguimiento", label: "Seguimiento", dot: "bg-violet-400", active: "bg-violet-400 text-[#100820]" },
  { id: "cerrado", label: "Cerrado", dot: "bg-emerald-400", active: "bg-emerald-400 text-[#04140c]" },
];

const iniciales = (n: string) =>
  n
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

function hace(fecha: string) {
  const min = Math.floor((Date.now() - new Date(fecha).getTime()) / 60000);
  if (min < 60) return `hace ${Math.max(min, 1)} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `hace ${d} días`;
  return new Date(fecha).toLocaleDateString("es-AR");
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const cargarLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLeads(data.data);
      }
    } catch (err) {
      console.error("Error al cargar leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLeads();
  }, []);

  const handleCambiarEstado = async (id: string, nuevoEstado: string) => {
    // Optimista: se actualiza al instante y se revierte si falla.
    const previo = leads;
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, estado: nuevoEstado as LeadItem["estado"] } : l)),
    );
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();
    } catch {
      setLeads(previo);
      alert("Error al actualizar el estado");
    }
  };

  const conteo = useMemo(() => {
    const c: Record<string, number> = { todos: leads.length };
    for (const l of leads) c[l.estado || "nuevo"] = (c[l.estado || "nuevo"] ?? 0) + 1;
    return c;
  }, [leads]);

  const leadsFiltrados = leads.filter((l) => {
    if (filtroEstado !== "todos" && (l.estado || "nuevo") !== filtroEstado) return false;
    if (busqueda) {
      const q = busqueda.toLowerCase();
      return [l.nombre, l.email, l.telefono, l.mensaje]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-dorado">
            Bandeja de consultas
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-crema mt-1">
            Tasaciones &amp; leads
          </h1>
          <p className="text-sm text-crema/45 mt-1">
            Solicitudes de tasación y contactos recibidos desde la landing.
          </p>
        </div>

        <button
          onClick={cargarLeads}
          className="inline-flex items-center gap-2 self-start md:self-auto rounded-xl border border-white/10 px-4 py-2.5 text-[12px] text-crema/80 hover:border-dorado hover:text-dorado transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-[#0A1020] p-2">
        <div className="flex flex-wrap items-center gap-1">
          {[{ id: "todos", label: "Todos", dot: "bg-crema/50" }, ...ESTADOS].map((tab) => {
            const active = filtroEstado === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFiltroEstado(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12px] transition-colors ${
                  active ? "bg-white/[0.08] text-crema" : "text-crema/50 hover:text-crema hover:bg-white/[0.03]"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${tab.dot}`} />
                {tab.label}
                <span
                  className={`rounded-md px-1.5 text-[10px] tabular-nums ${
                    active ? "bg-dorado/20 text-dorado" : "bg-white/[0.05] text-crema/40"
                  }`}
                >
                  {conteo[tab.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <label className="relative block lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-crema/30" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, mail o mensaje…"
            className="w-full rounded-xl border border-white/[0.07] bg-[#060913] py-2.5 pl-9 pr-3 text-[13px] text-crema placeholder:text-crema/30 focus:border-dorado/60 focus:outline-none"
          />
        </label>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : leadsFiltrados.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 py-20 text-center">
          <Inbox className="mx-auto h-9 w-9 text-crema/25" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-crema/50">
            {busqueda ? "Ninguna consulta coincide con la búsqueda." : "No hay consultas en esta categoría."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leadsFiltrados.map((l) => {
            const estado = l.estado || "nuevo";
            const cleanPhone = l.telefono ? l.telefono.replace(/\D/g, "") : null;
            const waUrl = cleanPhone
              ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hola ${l.nombre}, te contacto desde ALTUM SCI en respuesta a tu consulta inmobiliaria.`,
                )}`
              : null;
            const esNuevo = estado === "nuevo";

            return (
              <article
                key={l.id}
                className={`relative overflow-hidden rounded-2xl border bg-[#0A1020] p-5 lg:p-6 transition-colors ${
                  esNuevo ? "border-dorado/30" : "border-white/[0.07] hover:border-white/15"
                }`}
              >
                {esNuevo && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-dorado" aria-hidden="true" />
                )}

                <div className="flex flex-col lg:flex-row gap-5">
                  <div className="flex gap-4 min-w-0 flex-1">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dorado/35 to-dorado/10 text-[13px] font-semibold text-dorado">
                      {iniciales(l.nombre) || "?"}
                    </span>

                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="font-display text-lg font-semibold text-crema">{l.nombre}</h3>
                        {l.origen && (
                          <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-wider text-crema/55">
                            {l.origen}
                          </span>
                        )}
                        <span
                          className="inline-flex items-center gap-1 text-[11px] text-crema/35"
                          title={new Date(l.created_at).toLocaleString("es-AR")}
                        >
                          <Clock className="h-3 w-3" />
                          {hace(l.created_at)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-crema/55">
                        {l.email && (
                          <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1.5 hover:text-dorado">
                            <Mail className="h-3.5 w-3.5" /> {l.email}
                          </a>
                        )}
                        {l.telefono && (
                          <a href={`tel:${l.telefono}`} className="inline-flex items-center gap-1.5 hover:text-dorado">
                            <Phone className="h-3.5 w-3.5" /> {l.telefono}
                          </a>
                        )}
                      </div>

                      <p className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-[13px] leading-relaxed text-crema/75 whitespace-pre-line">
                        {l.mensaje || "Sin mensaje adicional."}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:w-64 shrink-0">
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-[12px] font-semibold text-[#052e14] hover:bg-[#2fe074] transition-colors shadow-[0_10px_24px_-12px_rgba(37,211,102,0.7)]"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Responder por WhatsApp
                      </a>
                    )}

                    <div>
                      <p className="mb-1.5 text-[10px] uppercase tracking-[0.18em] text-crema/35">Estado</p>
                      <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/[0.07] bg-[#060913] p-1">
                        {ESTADOS.map((e) => (
                          <button
                            key={e.id}
                            onClick={() => estado !== e.id && handleCambiarEstado(l.id, e.id)}
                            className={`rounded-lg px-2 py-1.5 text-[11px] transition-colors ${
                              estado === e.id
                                ? `${e.active} font-semibold`
                                : "text-crema/50 hover:text-crema hover:bg-white/[0.04]"
                            }`}
                          >
                            {e.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
