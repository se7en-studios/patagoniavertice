"use client";

import { useEffect, useState } from "react";

interface LeadItem {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string | null;
  propiedad_id?: string | null;
  estado: "nuevo" | "contactado" | "en_seguimiento" | "cerrado";
  created_at: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");

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
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, estado: nuevoEstado as LeadItem["estado"] } : l))
        );
      }
    } catch {
      alert("Error al actualizar el estado");
    }
  };

  const leadsFiltrados = leads.filter((l) => {
    if (filtroEstado !== "todos" && l.estado !== filtroEstado) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-crema/10 pb-6">
        <div>
          <span className="font-body text-dorado text-[10px] tracking-[0.25em] uppercase font-semibold">
            Bandeja de Consultas
          </span>
          <h1 className="font-display text-3xl font-medium text-crema mt-1">
            Tasaciones &amp; Leads
          </h1>
          <p className="font-body text-crema/50 text-sm mt-0.5">
            Solicitudes de tasación y contactos recibidos desde la landing.
          </p>
        </div>

        <button
          onClick={cargarLeads}
          className="px-4 py-2 border border-crema/20 text-crema font-body text-xs uppercase tracking-wider hover:border-dorado hover:text-dorado transition-colors self-start md:self-auto"
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "todos", label: `Todos (${leads.length})` },
          { id: "nuevo", label: "Nuevos" },
          { id: "contactado", label: "Contactados" },
          { id: "en_seguimiento", label: "En Seguimiento" },
          { id: "cerrado", label: "Cerrados" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFiltroEstado(tab.id)}
            className={`px-3 py-1.5 text-xs font-body tracking-wider uppercase transition-colors rounded-sm ${
              filtroEstado === tab.id
                ? "bg-dorado text-tierra font-bold"
                : "bg-[#090E1C] border border-crema/10 text-crema/60 hover:text-crema"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leads Table / List */}
      {loading ? (
        <div className="py-20 text-center text-crema/40 font-body text-sm">
          Cargando solicitudes...
        </div>
      ) : leadsFiltrados.length === 0 ? (
        <div className="py-20 text-center text-crema/40 font-body text-sm border border-crema/10 bg-[#090E1C] p-8">
          No hay consultas en esta categoría.
        </div>
      ) : (
        <div className="space-y-4">
          {leadsFiltrados.map((l) => {
            const cleanPhone = l.telefono ? l.telefono.replace(/\D/g, "") : null;
            const waUrl = cleanPhone
              ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hola ${l.nombre}, te contacto desde ALTUM SCI en respuesta a tu consulta inmobiliaria.`
                )}`
              : null;

            return (
              <div
                key={l.id}
                className="p-6 bg-[#090E1C] border border-crema/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-dorado/40 transition-colors"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-crema">
                      {l.nombre}
                    </h3>
                    <span className="text-[10px] text-crema/40 font-body">
                      {new Date(l.created_at).toLocaleString("es-AR")}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-wider px-2 py-0.5 font-body rounded-sm ${
                        l.estado === "nuevo"
                          ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                          : l.estado === "contactado"
                          ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                          : l.estado === "cerrado"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : "bg-zinc-800 text-crema/60"
                      }`}
                    >
                      {l.estado}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-body text-crema/60">
                    <span>✉️ {l.email}</span>
                    {l.telefono && <span>📞 {l.telefono}</span>}
                  </div>

                  <p className="text-sm font-body text-crema/80 bg-navy-950/80 p-3 border border-crema/10 rounded-sm">
                    {l.mensaje || "Sin mensaje adicional."}
                  </p>
                </div>

                {/* Right: Actions and Status Switcher */}
                <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 shrink-0">
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-[#25D366] text-black font-body text-xs font-bold uppercase tracking-wider hover:bg-[#20bd5a] transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <span>WhatsApp Inmediato</span>
                      <span>→</span>
                    </a>
                  )}

                  <div className="flex items-center gap-2 text-xs font-body">
                    <span className="text-crema/40 text-[10px] uppercase tracking-wider">
                      Estado:
                    </span>
                    <select
                      value={l.estado}
                      onChange={(e) => handleCambiarEstado(l.id, e.target.value)}
                      className="bg-navy-950 border border-crema/20 px-2.5 py-1 text-crema text-xs focus:outline-none focus:border-dorado"
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="contactado">Contactado</option>
                      <option value="en_seguimiento">En Seguimiento</option>
                      <option value="cerrado">Cerrado / Concretado</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
