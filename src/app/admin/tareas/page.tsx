"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckSquare,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  Home,
  Trash2,
  Edit2,
  Check,
  X,
  LayoutGrid,
  List,
  AlertTriangle,
} from "lucide-react";
import { useCRM } from "@/lib/use-crm";
import {
  CategoriaTarea,
  EstadoTarea,
  PrioridadTarea,
  SubtareaItem,
  TareaCRM,
} from "@/lib/crm-types";

const CATEGORIAS: { id: CategoriaTarea; label: string; badge: string }[] = [
  {
    id: "comercial",
    label: "Comercial / Ventas",
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  },
  {
    id: "tasacion",
    label: "Tasación Oficial",
    badge: "bg-dorado/15 text-dorado border-dorado/35",
  },
  {
    id: "legal_notarial",
    label: "Legal & Escribanía",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  },
  {
    id: "visita",
    label: "Visita / Recorrida",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  {
    id: "administracion",
    label: "Alquileres & Cobros",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  {
    id: "marketing",
    label: "Publicación & Web",
    badge: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  },
];

const PRIORIDADES: { id: PrioridadTarea; label: string; cls: string }[] = [
  {
    id: "urgente",
    label: "Urgente",
    cls: "bg-red-500/20 text-red-300 border-red-500/40",
  },
  {
    id: "alta",
    label: "Alta",
    cls: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  {
    id: "media",
    label: "Media",
    cls: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  },
  {
    id: "baja",
    label: "Baja",
    cls: "bg-white/[0.06] text-crema/60 border-white/10",
  },
];

const COLUMNAS_KANBAN: { id: EstadoTarea; label: string; dot: string }[] = [
  { id: "pendiente", label: "Pendientes", dot: "bg-amber-400" },
  { id: "en_curso", label: "En Curso", dot: "bg-sky-400" },
  { id: "completada", label: "Completadas", dot: "bg-emerald-400" },
];

function TareasCRMContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    tareas,
    clientes,
    loading,
    guardarTarea,
    cambiarEstadoTarea,
    toggleSubtarea,
    eliminarTarea,
  } = useCRM();

  const [vista, setVista] = useState<"kanban" | "lista">("kanban");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>("todas");
  const [busqueda, setBusqueda] = useState("");
  const [quickTitle, setQuickTitle] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nuevaSubtareaTexto, setNuevaSubtareaTexto] = useState("");

  const hoyISO = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    categoria: "comercial" as CategoriaTarea,
    prioridad: "alta" as PrioridadTarea,
    estado: "pendiente" as EstadoTarea,
    fecha_vencimiento: hoyISO,
    hora: "10:00",
    cliente_id: "",
    propiedad_titulo: "",
    subtareas: [] as SubtareaItem[],
  });

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      abrirNueva();
    }
  }, [searchParams]);

  const abrirNueva = () => {
    setEditingId(null);
    setForm({
      titulo: "",
      descripcion: "",
      categoria: "comercial",
      prioridad: "alta",
      estado: "pendiente",
      fecha_vencimiento: hoyISO,
      hora: "10:00",
      cliente_id: "",
      propiedad_titulo: "",
      subtareas: [],
    });
    setModalOpen(true);
  };

  const abrirEdicion = (t: TareaCRM) => {
    setEditingId(t.id);
    setForm({
      titulo: t.titulo,
      descripcion: t.descripcion || "",
      categoria: t.categoria,
      prioridad: t.prioridad,
      estado: t.estado,
      fecha_vencimiento: t.fecha_vencimiento || hoyISO,
      hora: t.hora || "10:00",
      cliente_id: t.cliente_id || "",
      propiedad_titulo: t.propiedad_titulo || "",
      subtareas: t.subtareas || [],
    });
    setModalOpen(true);
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    await guardarTarea({
      titulo: quickTitle.trim(),
      categoria: "comercial",
      prioridad: "alta",
      estado: "pendiente",
      fecha_vencimiento: hoyISO,
      subtareas: [],
    });
    setQuickTitle("");
  };

  const handleAddSubtareaForm = () => {
    if (!nuevaSubtareaTexto.trim()) return;
    setForm({
      ...form,
      subtareas: [
        ...form.subtareas,
        {
          id: `st-${Date.now()}`,
          texto: nuevaSubtareaTexto.trim(),
          completada: false,
        },
      ],
    });
    setNuevaSubtareaTexto("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cli = clientes.find((c) => c.id === form.cliente_id);
    await guardarTarea({
      id: editingId || undefined,
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim() || undefined,
      categoria: form.categoria,
      prioridad: form.prioridad,
      estado: form.estado,
      fecha_vencimiento: form.fecha_vencimiento,
      hora: form.hora || undefined,
      cliente_id: cli ? cli.id : null,
      cliente_nombre: cli ? cli.nombre : null,
      propiedad_titulo: form.propiedad_titulo.trim() || null,
      subtareas: form.subtareas,
    });
    setModalOpen(false);
    router.replace("/admin/tareas");
  };

  const tareasFiltradas = useMemo(() => {
    return tareas.filter((t) => {
      if (filtroCategoria !== "todas" && t.categoria !== filtroCategoria)
        return false;
      if (filtroPrioridad !== "todas" && t.prioridad !== filtroPrioridad)
        return false;
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        const match = [
          t.titulo,
          t.descripcion,
          t.cliente_nombre,
          t.propiedad_titulo,
        ]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [tareas, filtroCategoria, filtroPrioridad, busqueda]);

  const totalPendientes = tareas.filter((t) => t.estado !== "completada").length;
  const urgentesCount = tareas.filter(
    (t) => t.prioridad === "urgente" && t.estado !== "completada",
  ).length;
  const vencenHoyCount = tareas.filter(
    (t) => t.fecha_vencimiento <= hoyISO && t.estado !== "completada",
  ).length;

  const renderCard = (t: TareaCRM) => {
    const cat =
      CATEGORIAS.find((c) => c.id === t.categoria) || CATEGORIAS[0];
    const prio =
      PRIORIDADES.find((p) => p.id === t.prioridad) || PRIORIDADES[2];
    const completada = t.estado === "completada";
    const vencida = !completada && t.fecha_vencimiento < hoyISO;
    const esHoy = !completada && t.fecha_vencimiento === hoyISO;
    const totalSub = t.subtareas?.length || 0;
    const hechasSub = (t.subtareas || []).filter((s) => s.completada).length;

    return (
      <article
        key={t.id}
        className={`rounded-2xl border p-4 transition-all space-y-3 ${
          completada
            ? "border-white/[0.05] bg-[#0A1020]/60 opacity-70"
            : t.prioridad === "urgente"
              ? "border-red-500/35 bg-[#0D1326] shadow-md"
              : "border-white/[0.08] bg-[#0A1020] hover:border-dorado/40"
        }`}
      >
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-md border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider ${cat.badge}`}
            >
              {cat.label}
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider ${prio.cls}`}
            >
              {prio.label}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => abrirEdicion(t)}
              className="rounded-lg p-1 text-crema/45 hover:text-dorado"
              title="Editar tarea"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => eliminarTarea(t.id)}
              className="rounded-lg p-1 text-crema/35 hover:text-red-400"
              title="Eliminar tarea"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Checkbox */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() =>
              cambiarEstadoTarea(
                t.id,
                completada ? "pendiente" : "completada",
              )
            }
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
              completada
                ? "border-emerald-400 bg-emerald-400 text-[#04140c]"
                : "border-white/25 hover:border-dorado"
            }`}
          >
            {completada && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
          </button>
          <div className="min-w-0 flex-1">
            <h3
              className={`font-display text-base font-medium leading-snug ${
                completada ? "line-through text-crema/45" : "text-crema"
              }`}
            >
              {t.titulo}
            </h3>
            {t.descripcion && (
              <p className="mt-1 text-xs text-crema/55 leading-relaxed">
                {t.descripcion}
              </p>
            )}
          </div>
        </div>

        {/* Subtareas interactivas */}
        {totalSub > 0 && (
          <div className="rounded-xl bg-[#060913] p-3 border border-white/[0.05] space-y-2">
            <div className="flex items-center justify-between text-[10px] text-crema/45">
              <span>Checklist operativo</span>
              <span className="font-mono text-dorado">
                {hechasSub}/{totalSub}
              </span>
            </div>
            <div className="space-y-1.5">
              {t.subtareas.map((st) => (
                <label
                  key={st.id}
                  className="flex items-center gap-2 text-xs text-crema/75 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={st.completada}
                    onChange={() => toggleSubtarea(t.id, st.id)}
                    className="accent-dorado h-3.5 w-3.5 rounded"
                  />
                  <span
                    className={
                      st.completada ? "line-through text-crema/35" : ""
                    }
                  >
                    {st.texto}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Meta info: Cliente, Propiedad y Fecha */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-[11px] text-crema/50">
          <div className="flex flex-wrap items-center gap-2.5">
            {t.cliente_nombre && (
              <span className="inline-flex items-center gap-1 text-crema/70">
                <User className="h-3 w-3 text-dorado" />
                {t.cliente_nombre}
              </span>
            )}
            {t.propiedad_titulo && (
              <span className="inline-flex items-center gap-1 text-crema/50 truncate max-w-[180px]">
                <Home className="h-3 w-3 text-sky-300" />
                {t.propiedad_titulo}
              </span>
            )}
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium ${
              vencida
                ? "bg-red-500/20 text-red-300"
                : esHoy
                  ? "bg-amber-500/20 text-amber-300"
                  : "bg-white/[0.04] text-crema/55"
            }`}
          >
            <Calendar className="h-3 w-3" />
            {esHoy ? "Hoy" : t.fecha_vencimiento}
            {t.hora ? ` · ${t.hora}` : ""}
          </span>
        </div>

        {/* Selector rápido de columna */}
        <div className="grid grid-cols-3 gap-1 pt-1">
          {COLUMNAS_KANBAN.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => cambiarEstadoTarea(t.id, col.id)}
              className={`rounded-lg py-1 text-[10px] transition-colors ${
                t.estado === col.id
                  ? "bg-dorado/20 text-dorado font-semibold border border-dorado/40"
                  : "bg-white/[0.02] text-crema/40 hover:text-crema"
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-dorado">
            Gestión Operativa &amp; Notarial
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-crema mt-1">
            Tareas &amp; Pendientes
          </h1>
          <p className="text-sm text-crema/45 mt-1">
            Seguimiento de dictámenes de tasación, trámites en escribanía,
            visitas y entregas.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex rounded-xl border border-white/10 bg-[#0A1020] p-1">
            <button
              onClick={() => setVista("kanban")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                vista === "kanban"
                  ? "bg-dorado text-tierra font-semibold"
                  : "text-crema/55 hover:text-crema"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Tablero</span>
            </button>
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
          </div>

          <button
            onClick={abrirNueva}
            className="inline-flex items-center gap-2 rounded-xl bg-dorado px-5 py-3 text-[12px] font-semibold text-tierra shadow-[0_10px_24px_-10px_rgba(184,150,90,0.8)] hover:bg-dorado-light transition-all"
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            <span>Nueva tarea</span>
          </button>
        </div>
      </div>

      {/* KPIs rápidos + Alta rápida */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/[0.07] bg-[#0A1020] p-4">
            <span className="text-[10px] uppercase tracking-wider text-crema/45 block">
              Activas
            </span>
            <span className="font-display text-2xl font-bold text-crema">
              {totalPendientes}
            </span>
          </div>
          <div className="rounded-2xl border border-red-500/25 bg-[#0A1020] p-4">
            <span className="text-[10px] uppercase tracking-wider text-red-300 block">
              Urgentes
            </span>
            <span className="font-display text-2xl font-bold text-red-300">
              {urgentesCount}
            </span>
          </div>
          <div className="rounded-2xl border border-amber-500/25 bg-[#0A1020] p-4">
            <span className="text-[10px] uppercase tracking-wider text-amber-300 block">
              Para Hoy
            </span>
            <span className="font-display text-2xl font-bold text-amber-300">
              {vencenHoyCount}
            </span>
          </div>
        </div>

        {/* Barra de creación rápida en 1 clic */}
        <form
          onSubmit={handleQuickAdd}
          className="lg:col-span-7 flex items-center gap-2 rounded-2xl border border-dorado/30 bg-[#0A1020] p-2.5"
        >
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Agregar pendiente rápido (ej: Llamar a escribano por lote 12)..."
            className="flex-1 bg-transparent px-3 py-2 text-xs text-crema placeholder:text-crema/35 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-dorado px-4 py-2.5 text-xs font-semibold text-tierra hover:bg-dorado-light transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Agregar rápido</span>
          </button>
        </form>
      </div>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-[#0A1020] p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFiltroCategoria("todas")}
            className={`rounded-xl px-3 py-1.5 text-xs transition-colors ${
              filtroCategoria === "todas"
                ? "bg-white/[0.1] text-crema font-semibold"
                : "text-crema/50 hover:text-crema"
            }`}
          >
            Todas
          </button>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFiltroCategoria(cat.id)}
              className={`rounded-xl px-3 py-1.5 text-xs transition-colors ${
                filtroCategoria === cat.id
                  ? "bg-dorado text-tierra font-semibold"
                  : "text-crema/50 hover:text-crema"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
          >
            <option value="todas">Todas las prioridades</option>
            {PRIORIDADES.map((p) => (
              <option key={p.id} value={p.id}>
                Prioridad {p.label}
              </option>
            ))}
          </select>

          <label className="relative block sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-crema/30" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar pendiente..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#060913] py-2 pl-8 pr-3 text-xs text-crema placeholder:text-crema/30 focus:border-dorado/60 focus:outline-none"
            />
          </label>
        </div>
      </div>

      {/* Contenido: Kanban o Lista */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-80 rounded-3xl bg-white/[0.03] animate-pulse"
            />
          ))}
        </div>
      ) : vista === "kanban" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {COLUMNAS_KANBAN.map((col) => {
            const items = tareasFiltradas.filter((t) => t.estado === col.id);
            return (
              <div
                key={col.id}
                className="rounded-3xl border border-white/[0.07] bg-[#080D1A] p-4 space-y-3"
              >
                <div className="flex items-center justify-between px-1 pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                    <h2 className="font-display text-base font-semibold text-crema">
                      {col.label}
                    </h2>
                  </div>
                  <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs font-semibold text-crema/65">
                    {items.length}
                  </span>
                </div>

                {items.length === 0 ? (
                  <div className="py-12 text-center text-xs text-crema/35 border border-dashed border-white/[0.06] rounded-2xl">
                    Sin tareas en esta columna
                  </div>
                ) : (
                  <div className="space-y-3">{items.map(renderCard)}</div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">{tareasFiltradas.map(renderCard)}</div>
      )}

      {/* Modal Crear / Editar Tarea Completa */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-white/[0.1] bg-[#0A1020] p-6 md:p-8 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-dorado">
                  Gestión de Pendientes
                </span>
                <h2 className="font-display text-2xl text-crema font-medium mt-0.5">
                  {editingId ? "Editar Tarea" : "Nueva Tarea Operativa"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-2 text-crema/40 hover:text-crema"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-dorado font-semibold mb-1">
                  Título de la Tarea *
                </label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Enviar informe de tasación firmado"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Categoría
                  </label>
                  <select
                    value={form.categoria}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        categoria: e.target.value as CategoriaTarea,
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={form.prioridad}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        prioridad: e.target.value as PrioridadTarea,
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    {PRIORIDADES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Estado
                  </label>
                  <select
                    value={form.estado}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        estado: e.target.value as EstadoTarea,
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    {COLUMNAS_KANBAN.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    value={form.fecha_vencimiento}
                    onChange={(e) =>
                      setForm({ ...form, fecha_vencimiento: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Hora Estimada
                  </label>
                  <input
                    type="time"
                    value={form.hora}
                    onChange={(e) => setForm({ ...form, hora: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Cliente Vinculado (Opcional)
                  </label>
                  <select
                    value={form.cliente_id}
                    onChange={(e) =>
                      setForm({ ...form, cliente_id: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    <option value="">— Sin cliente vinculado —</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Propiedad / Lote
                  </label>
                  <input
                    type="text"
                    value={form.propiedad_titulo}
                    onChange={(e) =>
                      setForm({ ...form, propiedad_titulo: e.target.value })
                    }
                    placeholder="Ej: Lote 14 Mari Menuco"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                  Descripción / Notas Operativas
                </label>
                <textarea
                  rows={2}
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  placeholder="Detalles adicionales..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] p-3 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>

              {/* Subtareas */}
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <label className="block text-[10px] uppercase tracking-wider text-dorado font-semibold">
                  Checklist de Subtareas
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nuevaSubtareaTexto}
                    onChange={(e) => setNuevaSubtareaTexto(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubtareaForm();
                      }
                    }}
                    placeholder="Ej: Pedir libre deuda municipal..."
                    className="flex-1 rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtareaForm}
                    className="rounded-xl border border-dorado/40 px-3 py-2 text-xs font-semibold text-dorado hover:bg-dorado hover:text-tierra transition-colors"
                  >
                    + Añadir paso
                  </button>
                </div>

                {form.subtareas.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {form.subtareas.map((st, idx) => (
                      <div
                        key={st.id}
                        className="flex items-center justify-between rounded-lg bg-[#060913] px-3 py-1.5 text-xs text-crema/80"
                      >
                        <span>
                          {idx + 1}. {st.texto}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              subtareas: form.subtareas.filter(
                                (item) => item.id !== st.id,
                              ),
                            })
                          }
                          className="text-red-400/70 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs text-crema/60 hover:text-crema"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-dorado px-6 py-2.5 text-xs font-semibold text-tierra hover:bg-dorado-light transition-all"
                >
                  {editingId ? "Guardar Cambios" : "Crear Tarea"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminTareasPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-crema/40 text-sm">
          Cargando tareas y pendientes...
        </div>
      }
    >
      <TareasCRMContent />
    </Suspense>
  );
}
