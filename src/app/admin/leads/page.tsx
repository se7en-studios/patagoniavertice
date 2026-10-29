"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  Search,
  Mail,
  Phone,
  MessageCircle,
  Inbox,
  Clock,
  UserPlus,
  CalendarPlus,
  LayoutGrid,
  List,
  Check,
} from "lucide-react";
import { useCRM } from "@/lib/use-crm";

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
  {
    id: "nuevo",
    label: "Nuevo",
    dot: "bg-dorado",
    active: "bg-dorado text-tierra",
  },
  {
    id: "contactado",
    label: "Contactado",
    dot: "bg-sky-400",
    active: "bg-sky-400 text-[#06101f]",
  },
  {
    id: "en_seguimiento",
    label: "En Seguimiento",
    dot: "bg-violet-400",
    active: "bg-violet-400 text-[#100820]",
  },
  {
    id: "cerrado",
    label: "Cerrado / Ganado",
    dot: "bg-emerald-400",
    active: "bg-emerald-400 text-[#04140c]",
  },
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
  const router = useRouter();
  const { leadsMeta, guardarLeadMeta, guardarCliente, guardarEvento } =
    useCRM();

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState<"lista" | "kanban">("lista");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [notificacion, setNotificacion] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(null), 4000);
  };

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
    const previo = leads;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, estado: nuevoEstado as LeadItem["estado"] } : l,
      ),
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
    }
  };

  const handleConvertirACliente = async (l: LeadItem) => {
    const esTasacion =
      l.origen === "tasador" ||
      (l.mensaje || "").toLowerCase().includes("tasac");
    await guardarCliente({
      nombre: l.nombre,
      telefono: l.telefono || "+54 9 299",
      email: l.email || "",
      tipo: esTasacion ? "vendedor" : "comprador",
      estado: "activo",
      zona_interes: "Mari Menuco",
      propiedad_interes: l.mensaje || "Consulta desde la web",
      origen: l.origen || "Formulario Web",
      prioridad: "alta",
      etiquetas: ["Lead Web", l.origen || "Landing"].filter(Boolean),
      notas: l.mensaje
        ? [
            {
              id: `n-${Date.now()}`,
              fecha: new Date().toISOString(),
              texto: `Consulta original: ${l.mensaje}`,
              tipo: "nota",
            },
          ]
        : [],
      proximo_contacto: new Date().toISOString().split("T")[0],
    });
    await guardarLeadMeta(l.id, { convertido_cliente_id: "convertido" });
    if (l.estado === "nuevo") {
      handleCambiarEstado(l.id, "en_seguimiento");
    }
    notify(`"${l.nombre}" fue sumado a Clientes & Cartera CRM.`);
  };

  const handleAgendarVisitaRapida = async (l: LeadItem) => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const fechaISO = manana.toISOString().split("T")[0];
    await guardarEvento({
      titulo: `Seguimiento / Visita · ${l.nombre}`,
      tipo: "visita",
      estado: "programado",
      fecha: fechaISO,
      hora_inicio: "11:00",
      hora_fin: "12:00",
      ubicacion: "A coordinar con el cliente",
      cliente_nombre: l.nombre,
      cliente_telefono: l.telefono || undefined,
      notas: l.mensaje || undefined,
    });
    notify(`Compromiso agendado para mañana (${fechaISO}) en el Calendario.`);
  };

  const conteo = useMemo(() => {
    const c: Record<string, number> = { todos: leads.length };
    for (const l of leads)
      c[l.estado || "nuevo"] = (c[l.estado || "nuevo"] ?? 0) + 1;
    return c;
  }, [leads]);

  const leadsFiltrados = leads.filter((l) => {
    if (filtroEstado !== "todos" && (l.estado || "nuevo") !== filtroEstado)
      return false;
    if (busqueda) {
      const q = busqueda.toLowerCase();
      return [l.nombre, l.email, l.telefono, l.mensaje]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-dorado">
            Pipeline Comercial &amp; Web
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-crema mt-1">
            Consultas, Tasaciones &amp; Leads
          </h1>
          <p className="text-sm text-crema/45 mt-1">
            Gestioná cada consulta entrante, agregá notas y convertila en
            cliente o visita agendada con un clic.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <div className="flex rounded-xl border border-white/10 bg-[#0A1020] p-1">
            <button
              onClick={() => setVista("lista")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                vista === "lista"
                  ? "bg-dorado text-tierra font-semibold"
                  : "text-crema/55 hover:text-crema"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Lista</span>
            </button>
            <button
              onClick={() => setVista("kanban")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                vista === "kanban"
                  ? "bg-dorado text-tierra font-semibold"
                  : "text-crema/55 hover:text-crema"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Pipeline</span>
            </button>
          </div>

          <button
            onClick={cargarLeads}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-[12px] text-crema/80 hover:border-dorado hover:text-dorado transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>
      </div>

      {notificacion && (
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/70 p-4 text-xs font-medium text-emerald-200">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{notificacion}</span>
          </div>
          <button
            onClick={() => router.push("/admin/clientes")}
            className="text-dorado underline text-xs"
          >
            Ir a Clientes →
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-[#0A1020] p-2">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: "todos", label: "Todos", dot: "bg-crema/50" },
            ...ESTADOS,
          ].map((tab) => {
            const active = filtroEstado === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFiltroEstado(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12px] transition-colors ${
                  active
                    ? "bg-white/[0.08] text-crema"
                    : "text-crema/50 hover:text-crema hover:bg-white/[0.03]"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${tab.dot}`} />
                {tab.label}
                <span
                  className={`rounded-md px-1.5 text-[10px] tabular-nums ${
                    active
                      ? "bg-dorado/20 text-dorado"
                      : "bg-white/[0.05] text-crema/40"
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

      {/* Contenido */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 rounded-2xl bg-white/[0.03] animate-pulse"
            />
          ))}
        </div>
      ) : leadsFiltrados.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 py-20 text-center">
          <Inbox className="mx-auto h-9 w-9 text-crema/25" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-crema/50">
            {busqueda
              ? "Ninguna consulta coincide con la búsqueda."
              : "No hay consultas en esta categoría."}
          </p>
        </div>
      ) : vista === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {ESTADOS.map((col) => {
            const items = leadsFiltrados.filter(
              (l) => (l.estado || "nuevo") === col.id,
            );
            return (
              <div
                key={col.id}
                className="rounded-3xl border border-white/[0.07] bg-[#080D1A] p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                    <h2 className="font-display text-sm font-semibold text-crema">
                      {col.label}
                    </h2>
                  </div>
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-semibold text-crema/65">
                    {items.length}
                  </span>
                </div>

                {items.length === 0 ? (
                  <p className="py-10 text-center text-xs text-crema/30">
                    Sin consultas
                  </p>
                ) : (
                  <div className="space-y-3">
                    {items.map((l) => {
                      const cleanPhone = l.telefono
                        ? l.telefono.replace(/\D/g, "")
                        : null;
                      return (
                        <div
                          key={l.id}
                          className="rounded-2xl border border-white/[0.07] bg-[#0A1020] p-4 space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-display text-sm font-semibold text-crema truncate">
                              {l.nombre}
                            </span>
                            <span className="text-[10px] text-crema/35 shrink-0">
                              {hace(l.created_at)}
                            </span>
                          </div>
                          <p className="text-xs text-crema/60 line-clamp-3">
                            {l.mensaje || "Sin mensaje."}
                          </p>
                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
                            {cleanPhone ? (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-semibold"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                WhatsApp
                              </a>
                            ) : (
                              <span />
                            )}
                            <button
                              onClick={() => handleConvertirACliente(l)}
                              className="inline-flex items-center gap-1 text-[11px] text-dorado hover:underline"
                            >
                              <UserPlus className="h-3 w-3" />A Cartera
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {leadsFiltrados.map((l) => {
            const estado = l.estado || "nuevo";
            const cleanPhone = l.telefono
              ? l.telefono.replace(/\D/g, "")
              : null;
            const waUrl = cleanPhone
              ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hola ${l.nombre}, soy Estela Mari Rojas de ALTUM SCI en respuesta a tu consulta inmobiliaria.`,
                )}`
              : null;
            const esNuevo = estado === "nuevo";
            const meta = leadsMeta[l.id];

            return (
              <article
                key={l.id}
                className={`relative overflow-hidden rounded-2xl border bg-[#0A1020] p-5 lg:p-6 transition-colors ${
                  esNuevo
                    ? "border-dorado/30"
                    : "border-white/[0.07] hover:border-white/15"
                }`}
              >
                {esNuevo && (
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-dorado"
                    aria-hidden="true"
                  />
                )}

                <div className="flex flex-col lg:flex-row gap-5">
                  <div className="flex gap-4 min-w-0 flex-1">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dorado/35 to-dorado/10 text-[13px] font-semibold text-dorado">
                      {iniciales(l.nombre) || "?"}
                    </span>

                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="font-display text-lg font-semibold text-crema">
                          {l.nombre}
                        </h3>
                        {l.origen && (
                          <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] uppercase tracking-wider text-crema/55">
                            {l.origen}
                          </span>
                        )}
                        {meta?.convertido_cliente_id && (
                          <span className="rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                            ✓ En Cartera CRM
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
                          <a
                            href={`mailto:${l.email}`}
                            className="inline-flex items-center gap-1.5 hover:text-dorado"
                          >
                            <Mail className="h-3.5 w-3.5" /> {l.email}
                          </a>
                        )}
                        {l.telefono && (
                          <a
                            href={`tel:${l.telefono}`}
                            className="inline-flex items-center gap-1.5 hover:text-dorado"
                          >
                            <Phone className="h-3.5 w-3.5" /> {l.telefono}
                          </a>
                        )}
                      </div>

                      <p className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-[13px] leading-relaxed text-crema/75 whitespace-pre-line">
                        {l.mensaje || "Sin mensaje adicional."}
                      </p>

                      {/* Nota interna rápida de la consulta */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          defaultValue={meta?.notas || ""}
                          onBlur={(e) =>
                            guardarLeadMeta(l.id, { notas: e.target.value })
                          }
                          placeholder="Agregar nota interna sobre esta consulta..."
                          className="flex-1 rounded-xl border border-white/[0.06] bg-[#060913] px-3 py-1.5 text-xs text-crema placeholder:text-crema/30 focus:border-dorado/60 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 lg:w-64 shrink-0">
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

                    {/* Botones de acción CRM */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleConvertirACliente(l)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-dorado/35 bg-dorado/10 px-2.5 py-2 text-[11px] font-semibold text-dorado hover:bg-dorado hover:text-tierra transition-colors"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>Sumar Cliente</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAgendarVisitaRapida(l)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2 text-[11px] text-crema/80 hover:border-dorado hover:text-dorado transition-colors"
                      >
                        <CalendarPlus className="h-3.5 w-3.5" />
                        <span>Agendar</span>
                      </button>
                    </div>

                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-crema/35">
                        Etapa del Pipeline
                      </p>
                      <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/[0.07] bg-[#060913] p-1">
                        {ESTADOS.map((e) => (
                          <button
                            key={e.id}
                            onClick={() =>
                              estado !== e.id && handleCambiarEstado(l.id, e.id)
                            }
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
