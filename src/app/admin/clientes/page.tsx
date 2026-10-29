"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  DollarSign,
  Calendar,
  Tag,
  Edit2,
  Trash2,
  X,
  FileText,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useCRM } from "@/lib/use-crm";
import {
  ClienteCRM,
  EstadoCliente,
  NotaCliente,
  TipoCliente,
} from "@/lib/crm-types";

const TIPOS_CLIENTE: { id: TipoCliente; label: string; badge: string }[] = [
  {
    id: "comprador",
    label: "Comprador",
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  },
  {
    id: "inversor",
    label: "Inversor",
    badge: "bg-dorado/15 text-dorado border-dorado/35",
  },
  {
    id: "vendedor",
    label: "Propietario Vendedor",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  },
  {
    id: "inquilino",
    label: "Inquilino / Empresa",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  {
    id: "propietario",
    label: "Propietario Alquiler",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
];

const ESTADOS_CLIENTE: { id: EstadoCliente; label: string; dot: string }[] = [
  { id: "activo", label: "Activo", dot: "bg-sky-400" },
  { id: "visita_programada", label: "Visita Programada", dot: "bg-amber-400" },
  { id: "en_negociacion", label: "En Negociación", dot: "bg-dorado" },
  { id: "reserva_firmada", label: "Reserva / Boleto", dot: "bg-violet-400" },
  { id: "operacion_cerrada", label: "Operación Cerrada", dot: "bg-emerald-400" },
  { id: "pausado", label: "En Pausa", dot: "bg-crema/30" },
];

const ZONAS = [
  "Mari Menuco",
  "Cipolletti",
  "Catriel",
  "General Roca",
  "Neuquén Capital",
  "Añelo / Vaca Muerta",
  "Bariloche & Cordillera",
];

const iniciales = (n: string) =>
  n
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

function ClientesCRMContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    clientes,
    loading,
    guardarCliente,
    eliminarCliente,
    agregarNotaCliente,
  } = useCRM();

  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [clienteActivoId, setClienteActivoId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Nota nueva en la bitácora
  const [textoNota, setTextoNota] = useState("");
  const [tipoNota, setTipoNota] = useState<NotaCliente["tipo"]>("whatsapp");

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    dni_cuit: "",
    ciudad_origen: "Neuquén Capital",
    tipo: "comprador" as TipoCliente,
    estado: "activo" as EstadoCliente,
    presupuesto_usd: "",
    zona_interes: "Mari Menuco",
    propiedad_interes: "",
    origen: "WhatsApp Directo",
    prioridad: "alta" as "alta" | "media" | "baja",
    etiquetasTexto: "",
    proximo_contacto: new Date().toISOString().split("T")[0],
    notaInicial: "",
  });

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      abrirNuevo();
    }
  }, [searchParams]);

  const abrirNuevo = () => {
    setEditingId(null);
    setForm({
      nombre: "",
      telefono: "",
      email: "",
      dni_cuit: "",
      ciudad_origen: "Neuquén Capital",
      tipo: "comprador",
      estado: "activo",
      presupuesto_usd: "",
      zona_interes: "Mari Menuco",
      propiedad_interes: "",
      origen: "WhatsApp Directo",
      prioridad: "alta",
      etiquetasTexto: "",
      proximo_contacto: new Date().toISOString().split("T")[0],
      notaInicial: "",
    });
    setModalOpen(true);
  };

  const abrirEdicion = (c: ClienteCRM) => {
    setEditingId(c.id);
    setForm({
      nombre: c.nombre,
      telefono: c.telefono || "",
      email: c.email || "",
      dni_cuit: c.dni_cuit || "",
      ciudad_origen: c.ciudad_origen || "",
      tipo: c.tipo,
      estado: c.estado,
      presupuesto_usd: c.presupuesto_usd ? String(c.presupuesto_usd) : "",
      zona_interes: c.zona_interes || "Mari Menuco",
      propiedad_interes: c.propiedad_interes || "",
      origen: c.origen || "WhatsApp Directo",
      prioridad: c.prioridad || "media",
      etiquetasTexto: (c.etiquetas || []).join(", "),
      proximo_contacto: c.proximo_contacto || "",
      notaInicial: "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const existente = editingId
      ? clientes.find((c) => c.id === editingId)
      : undefined;

    const etiquetas = form.etiquetasTexto
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const notas: NotaCliente[] = existente ? [...existente.notas] : [];
    if (!editingId && form.notaInicial.trim()) {
      notas.unshift({
        id: `n-${Date.now()}`,
        fecha: new Date().toISOString(),
        texto: form.notaInicial.trim(),
        tipo: "nota",
      });
    }

    await guardarCliente({
      id: editingId || undefined,
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim(),
      dni_cuit: form.dni_cuit.trim() || undefined,
      ciudad_origen: form.ciudad_origen.trim() || undefined,
      tipo: form.tipo,
      estado: form.estado,
      presupuesto_usd: form.presupuesto_usd
        ? Number(form.presupuesto_usd)
        : null,
      zona_interes: form.zona_interes,
      propiedad_interes: form.propiedad_interes.trim() || undefined,
      origen: form.origen.trim(),
      prioridad: form.prioridad,
      etiquetas,
      notas,
      proximo_contacto: form.proximo_contacto || null,
    });

    setModalOpen(false);
    router.replace("/admin/clientes");
  };

  const clienteDetalle = useMemo(
    () => clientes.find((c) => c.id === clienteActivoId) || null,
    [clientes, clienteActivoId],
  );

  const clientesFiltrados = useMemo(() => {
    return clientes.filter((c) => {
      if (filtroTipo !== "todos" && c.tipo !== filtroTipo) return false;
      if (filtroEstado !== "todos" && c.estado !== filtroEstado) return false;
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        const match = [
          c.nombre,
          c.telefono,
          c.email,
          c.dni_cuit,
          c.zona_interes,
          c.propiedad_interes,
          ...(c.etiquetas || []),
        ]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [clientes, filtroTipo, filtroEstado, busqueda]);

  // Métricas de cartera
  const totalCarteraUSD = useMemo(
    () =>
      clientes
        .filter((c) => c.tipo === "comprador" || c.tipo === "inversor")
        .reduce((acc, c) => acc + (c.presupuesto_usd || 0), 0),
    [clientes],
  );
  const enNegociacionCount = clientes.filter(
    (c) => c.estado === "en_negociacion" || c.estado === "reserva_firmada",
  ).length;
  const altaPrioridadCount = clientes.filter(
    (c) => c.prioridad === "alta" && c.estado !== "operacion_cerrada",
  ).length;

  const handleAgregarNota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteDetalle || !textoNota.trim()) return;
    await agregarNotaCliente(clienteDetalle.id, textoNota.trim(), tipoNota);
    setTextoNota("");
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-dorado">
            CRM Inmobiliario · Cartera Activa
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-crema mt-1">
            Clientes, Inversores &amp; Propietarios
          </h1>
          <p className="text-sm text-crema/45 mt-1">
            Administrá compradores, inversores de lotes, propietarios vendedores
            y seguimiento personalizado.
          </p>
        </div>

        <button
          onClick={abrirNuevo}
          className="inline-flex items-center gap-2 self-start md:self-auto rounded-xl bg-dorado px-5 py-3 text-[12px] font-semibold text-tierra shadow-[0_10px_24px_-10px_rgba(184,150,90,0.8)] hover:bg-dorado-light transition-all hover:-translate-y-px"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          <span>Nuevo cliente</span>
        </button>
      </div>

      {/* KPIs de Cartera */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/[0.07] bg-[#0A1020] p-5">
          <span className="text-[10px] uppercase tracking-[0.18em] text-crema/45">
            Total en Cartera
          </span>
          <p className="mt-2 font-display text-3xl font-semibold text-crema tabular-nums">
            {clientes.length}
          </p>
          <p className="mt-1 text-xs text-crema/40">
            Clientes registrados en seguimiento
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#0A1020] p-5">
          <span className="text-[10px] uppercase tracking-[0.18em] text-dorado">
            En Negociación / Reserva
          </span>
          <p className="mt-2 font-display text-3xl font-semibold text-dorado tabular-nums">
            {enNegociacionCount}
          </p>
          <p className="mt-1 text-xs text-crema/40">
            Operaciones próximas a cierre
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#0A1020] p-5">
          <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-300">
            Demanda Activa (Compras/Inversión)
          </span>
          <p className="mt-2 font-display text-3xl font-semibold text-crema tabular-nums">
            USD {totalCarteraUSD.toLocaleString("es-AR")}
          </p>
          <p className="mt-1 text-xs text-crema/40">
            Capital total buscado por inversores
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#0A1020] p-5">
          <span className="text-[10px] uppercase tracking-[0.18em] text-amber-300">
            Prioridad Alta
          </span>
          <p className="mt-2 font-display text-3xl font-semibold text-crema tabular-nums">
            {altaPrioridadCount}
          </p>
          <p className="mt-1 text-xs text-crema/40">
            Requieren seguimiento prioritario
          </p>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-[#0A1020] p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFiltroTipo("todos")}
            className={`rounded-xl px-3.5 py-2 text-xs transition-colors ${
              filtroTipo === "todos"
                ? "bg-dorado text-tierra font-semibold"
                : "text-crema/55 hover:text-crema hover:bg-white/[0.04]"
            }`}
          >
            Todos ({clientes.length})
          </button>
          {TIPOS_CLIENTE.map((t) => (
            <button
              key={t.id}
              onClick={() => setFiltroTipo(t.id)}
              className={`rounded-xl px-3.5 py-2 text-xs transition-colors ${
                filtroTipo === t.id
                  ? "bg-dorado text-tierra font-semibold"
                  : "text-crema/55 hover:text-crema hover:bg-white/[0.04]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
          >
            <option value="todos">Todos los estados</option>
            {ESTADOS_CLIENTE.map((est) => (
              <option key={est.id} value={est.id}>
                {est.label}
              </option>
            ))}
          </select>

          <label className="relative block sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-crema/30" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, zona, etiqueta..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#060913] py-2.5 pl-9 pr-3 text-xs text-crema placeholder:text-crema/30 focus:border-dorado/60 focus:outline-none"
            />
          </label>
        </div>
      </div>

      {/* Layout Principal: Lista + Panel Ficha 360 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div
          className={`${
            clienteDetalle ? "lg:col-span-7" : "lg:col-span-12"
          } space-y-3`}
        >
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl bg-white/[0.03] animate-pulse"
                />
              ))}
            </div>
          ) : clientesFiltrados.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 py-16 text-center">
              <Users className="mx-auto h-9 w-9 text-crema/25" />
              <p className="mt-3 text-sm text-crema/50">
                No se encontraron clientes con los filtros seleccionados.
              </p>
            </div>
          ) : (
            clientesFiltrados.map((c) => {
              const tipoObj =
                TIPOS_CLIENTE.find((t) => t.id === c.tipo) || TIPOS_CLIENTE[0];
              const estadoObj =
                ESTADOS_CLIENTE.find((e) => e.id === c.estado) ||
                ESTADOS_CLIENTE[0];
              const cleanPhone = c.telefono.replace(/\D/g, "");
              const isSelected = clienteActivoId === c.id;

              return (
                <article
                  key={c.id}
                  onClick={() => setClienteActivoId(c.id)}
                  className={`group rounded-2xl border p-5 transition-all cursor-pointer ${
                    isSelected
                      ? "border-dorado bg-[#101935] shadow-[0_14px_34px_-16px_rgba(201,168,76,0.35)]"
                      : "border-white/[0.07] bg-[#0A1020] hover:border-dorado/40"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-dorado/30 to-dorado/10 font-display text-sm font-bold text-dorado ring-1 ring-dorado/30">
                        {iniciales(c.nombre)}
                      </div>

                      <div className="min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-semibold text-crema group-hover:text-dorado transition-colors">
                            {c.nombre}
                          </h3>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tipoObj.badge}`}
                          >
                            {tipoObj.label}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[10px] text-crema/70">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${estadoObj.dot}`}
                            />
                            {estadoObj.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-crema/55">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-dorado/70" />
                            {c.zona_interes}
                          </span>
                          {c.presupuesto_usd && (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
                              <DollarSign className="h-3.5 w-3.5" />
                              USD {c.presupuesto_usd.toLocaleString("es-AR")}
                            </span>
                          )}
                          {c.propiedad_interes && (
                            <span className="text-crema/45 truncate max-w-xs">
                              · {c.propiedad_interes}
                            </span>
                          )}
                        </div>

                        {c.etiquetas && c.etiquetas.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {c.etiquetas.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] text-crema/60"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Acciones rápidas */}
                    <div
                      className="flex items-center gap-2 self-end sm:self-center shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Hola ${c.nombre.split(" ")[0]}, te escribo de ALTUM SCI por tu búsqueda en ${c.zona_interes}.`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Escribir por WhatsApp"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 px-3 py-2 text-xs font-semibold text-[#2fe074] hover:bg-[#25D366] hover:text-[#04240e] transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span className="hidden md:inline">WhatsApp</span>
                        </a>
                      )}
                      <button
                        onClick={() => abrirEdicion(c)}
                        className="rounded-xl border border-white/10 p-2 text-crema/70 hover:border-dorado hover:text-dorado transition-colors"
                        title="Editar ficha"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Panel Lateral: Ficha 360° y Bitácora del Cliente */}
        {clienteDetalle && (
          <div className="lg:col-span-5 lg:sticky lg:top-24 rounded-3xl border border-dorado/35 bg-[#0A1020] p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] text-dorado font-semibold">
                  Ficha 360° del Cliente
                </span>
                <h2 className="font-display text-2xl font-semibold text-crema mt-0.5">
                  {clienteDetalle.nombre}
                </h2>
                <p className="text-xs text-crema/45">
                  {clienteDetalle.ciudad_origen || "Patagonia"} · Origen:{" "}
                  {clienteDetalle.origen}
                </p>
              </div>
              <button
                onClick={() => setClienteActivoId(null)}
                className="rounded-lg p-1.5 text-crema/40 hover:text-crema hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Botonera de contacto directo */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`https://wa.me/${clienteDetalle.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hola ${clienteDetalle.nombre.split(" ")[0]}, soy Estela Mari Rojas de ALTUM SCI.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 px-3 text-xs font-semibold text-[#052e14] hover:bg-[#2fe074] transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${clienteDetalle.telefono}`}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-3 text-xs text-crema hover:border-dorado hover:text-dorado transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Llamar</span>
              </a>
              <a
                href={`mailto:${clienteDetalle.email}`}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 px-3 text-xs text-crema hover:border-dorado hover:text-dorado transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email</span>
              </a>
            </div>

            {/* Datos clave */}
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[#060913] p-4 border border-white/[0.06] text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-crema/40 block">
                  Presupuesto / Valor
                </span>
                <span className="font-display text-base font-bold text-dorado">
                  {clienteDetalle.presupuesto_usd
                    ? `USD ${clienteDetalle.presupuesto_usd.toLocaleString("es-AR")}`
                    : "A definir"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-crema/40 block">
                  Zona de Interés
                </span>
                <span className="font-medium text-crema">
                  {clienteDetalle.zona_interes}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-white/[0.05]">
                <span className="text-[10px] uppercase tracking-wider text-crema/40 block">
                  Propiedad / Búsqueda Específica
                </span>
                <span className="text-crema/85">
                  {clienteDetalle.propiedad_interes || "Cartera general"}
                </span>
              </div>
              {clienteDetalle.dni_cuit && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-crema/40 block">
                    DNI / CUIT
                  </span>
                  <span className="font-mono text-crema/75">
                    {clienteDetalle.dni_cuit}
                  </span>
                </div>
              )}
              {clienteDetalle.proximo_contacto && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-crema/40 block">
                    Próximo seguimiento
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
                    <Clock className="h-3 w-3" />
                    {clienteDetalle.proximo_contacto}
                  </span>
                </div>
              )}
            </div>

            {/* Cambio rápido de estado */}
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-crema/40 mb-2">
                Etapa de la operación
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {ESTADOS_CLIENTE.map((est) => (
                  <button
                    key={est.id}
                    type="button"
                    onClick={() =>
                      guardarCliente({
                        ...clienteDetalle,
                        estado: est.id,
                      })
                    }
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] border transition-all ${
                      clienteDetalle.estado === est.id
                        ? "border-dorado bg-dorado/20 text-crema font-semibold"
                        : "border-white/[0.06] bg-white/[0.02] text-crema/55 hover:text-crema"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${est.dot}`} />
                    <span className="truncate">{est.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bitácora de Seguimiento */}
            <div className="space-y-3 pt-2 border-t border-white/[0.08]">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-dorado font-semibold">
                Bitácora de Seguimiento ({clienteDetalle.notas?.length || 0})
              </span>

              <form onSubmit={handleAgregarNota} className="space-y-2">
                <div className="flex gap-1.5">
                  {(
                    [
                      { id: "whatsapp", label: "WhatsApp" },
                      { id: "llamada", label: "Llamada" },
                      { id: "visita", label: "Visita" },
                      { id: "propuesta", label: "Propuesta" },
                      { id: "nota", label: "Nota" },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTipoNota(t.id)}
                      className={`rounded-lg px-2.5 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                        tipoNota === t.id
                          ? "bg-dorado text-tierra font-semibold"
                          : "bg-white/[0.04] text-crema/50 hover:text-crema"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={textoNota}
                    onChange={(e) => setTextoNota(e.target.value)}
                    placeholder="Registrar avance, oferta o comentario..."
                    className="flex-1 rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2 text-xs text-crema placeholder:text-crema/30 focus:border-dorado/60 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-dorado px-3.5 py-2 text-xs font-semibold text-tierra hover:bg-dorado-light"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {!clienteDetalle.notas || clienteDetalle.notas.length === 0 ? (
                  <p className="text-xs text-crema/40 py-4 text-center">
                    Sin notas registradas todavía.
                  </p>
                ) : (
                  clienteDetalle.notas.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-xl border border-white/[0.06] bg-[#060913] p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-crema/40">
                        <span className="uppercase tracking-wider font-semibold text-dorado">
                          {n.tipo || "nota"}
                        </span>
                        <span>
                          {new Date(n.fecha).toLocaleDateString("es-AR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-crema/80 leading-relaxed">{n.texto}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer ficha */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs">
              <button
                onClick={() => abrirEdicion(clienteDetalle)}
                className="inline-flex items-center gap-1.5 text-dorado hover:underline"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Editar todos los datos</span>
              </button>
              <button
                onClick={() => {
                  if (
                    confirm(
                      `¿Eliminar a ${clienteDetalle.nombre} de la cartera?`,
                    )
                  ) {
                    eliminarCliente(clienteDetalle.id);
                    setClienteActivoId(null);
                  }
                }}
                className="inline-flex items-center gap-1 text-red-400/70 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Crear / Editar Cliente */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-white/[0.1] bg-[#0A1020] p-6 md:p-8 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-dorado">
                  CRM ALTUM SCI
                </span>
                <h2 className="font-display text-2xl text-crema font-medium mt-0.5">
                  {editingId ? "Editar Ficha de Cliente" : "Nuevo Cliente en Cartera"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-2 text-crema/40 hover:text-crema hover:bg-white/[0.06]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-dorado font-semibold mb-1">
                    Nombre y Apellido / Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    placeholder="Ej: Martín Echeverría"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-dorado font-semibold mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.telefono}
                    onChange={(e) =>
                      setForm({ ...form, telefono: e.target.value })
                    }
                    placeholder="+54 9 299 000-0000"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="cliente@email.com"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    DNI / CUIT
                  </label>
                  <input
                    type="text"
                    value={form.dni_cuit}
                    onChange={(e) =>
                      setForm({ ...form, dni_cuit: e.target.value })
                    }
                    placeholder="20-00000000-0"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Ciudad de Residencia
                  </label>
                  <input
                    type="text"
                    value={form.ciudad_origen}
                    onChange={(e) =>
                      setForm({ ...form, ciudad_origen: e.target.value })
                    }
                    placeholder="Neuquén / Cipolletti"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Perfil
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) =>
                      setForm({ ...form, tipo: e.target.value as TipoCliente })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    {TIPOS_CLIENTE.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
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
                        estado: e.target.value as EstadoCliente,
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    {ESTADOS_CLIENTE.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Presupuesto USD
                  </label>
                  <input
                    type="number"
                    value={form.presupuesto_usd}
                    onChange={(e) =>
                      setForm({ ...form, presupuesto_usd: e.target.value })
                    }
                    placeholder="Ej: 65000"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
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
                        prioridad: e.target.value as "alta" | "media" | "baja",
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    <option value="alta">Alta Prioridad</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Zona de Interés
                  </label>
                  <select
                    value={form.zona_interes}
                    onChange={(e) =>
                      setForm({ ...form, zona_interes: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    {ZONAS.map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Propiedad o Requerimiento Específico
                  </label>
                  <input
                    type="text"
                    value={form.propiedad_interes}
                    onChange={(e) =>
                      setForm({ ...form, propiedad_interes: e.target.value })
                    }
                    placeholder="Ej: Lote primera línea en Bahía de las Playas / Casa 3 dorm."
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Etiquetas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={form.etiquetasTexto}
                    onChange={(e) =>
                      setForm({ ...form, etiquetasTexto: e.target.value })
                    }
                    placeholder="Contado USD, Mari Menuco, Escritura inmediata"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Fecha Próximo Contacto
                  </label>
                  <input
                    type="date"
                    value={form.proximo_contacto}
                    onChange={(e) =>
                      setForm({ ...form, proximo_contacto: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>

              {!editingId && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Nota Inicial de Seguimiento
                  </label>
                  <textarea
                    rows={2}
                    value={form.notaInicial}
                    onChange={(e) =>
                      setForm({ ...form, notaInicial: e.target.value })
                    }
                    placeholder="Detalles de la primera conversación, horarios disponibles para visita, etc."
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] p-3 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              )}

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
                  {editingId ? "Guardar Cambios" : "Registrar Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminClientesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-crema/40 text-sm">
          Cargando cartera de clientes...
        </div>
      }
    >
      <ClientesCRMContent />
    </Suspense>
  );
}
