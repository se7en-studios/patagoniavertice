"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CalendarDays,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Home,
  MessageCircle,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
} from "lucide-react";
import { useCRM } from "@/lib/use-crm";
import {
  EstadoEvento,
  EventoCalendario,
  TipoEvento,
} from "@/lib/crm-types";

const TIPOS_EVENTO: {
  id: TipoEvento;
  label: string;
  badge: string;
  dot: string;
}[] = [
  {
    id: "visita",
    label: "Visita a Propiedad / Lote",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  {
    id: "tasacion",
    label: "Tasación Pericial",
    badge: "bg-dorado/15 text-dorado border-dorado/35",
    dot: "bg-dorado",
  },
  {
    id: "firma_escribania",
    label: "Escribanía / Boleto / Reserva",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    dot: "bg-violet-400",
  },
  {
    id: "reunion",
    label: "Reunión Comercial",
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    dot: "bg-sky-400",
  },
  {
    id: "llamada",
    label: "Llamada / Videollamada",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dot: "bg-amber-400",
  },
  {
    id: "recordatorio",
    label: "Recordatorio Interno",
    badge: "bg-white/10 text-crema/70 border-white/15",
    dot: "bg-crema/50",
  },
];

const ESTADOS_EVENTO: { id: EstadoEvento; label: string; cls: string }[] = [
  { id: "programado", label: "Programado", cls: "text-amber-300 bg-amber-500/15" },
  { id: "confirmado", label: "Confirmado", cls: "text-emerald-300 bg-emerald-500/15" },
  { id: "realizado", label: "Realizado", cls: "text-sky-300 bg-sky-500/15" },
  { id: "reprogramado", label: "Reprogramado", cls: "text-violet-300 bg-violet-500/15" },
  { id: "cancelado", label: "Cancelado", cls: "text-red-300 bg-red-500/15" },
];

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function toISODate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function CalendarioCRMContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    eventos,
    clientes,
    guardarEvento,
    cambiarEstadoEvento,
    eliminarEvento,
  } = useCRM();

  const hoy = new Date();
  const hoyISO = hoy.toISOString().split("T")[0];

  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(hoyISO);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    titulo: "",
    tipo: "visita" as TipoEvento,
    estado: "confirmado" as EstadoEvento,
    fecha: hoyISO,
    hora_inicio: "11:00",
    hora_fin: "12:00",
    ubicacion: "Bahía de las Playas, Mari Menuco",
    cliente_nombre: "",
    cliente_telefono: "",
    propiedad_titulo: "",
    notas: "",
  });

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      abrirNuevo(fechaSeleccionada);
    }
  }, [searchParams, fechaSeleccionada]);

  const abrirNuevo = (fecha = fechaSeleccionada) => {
    setEditingId(null);
    setForm({
      titulo: "",
      tipo: "visita",
      estado: "confirmado",
      fecha,
      hora_inicio: "11:00",
      hora_fin: "12:00",
      ubicacion: "Bahía de las Playas, Mari Menuco",
      cliente_nombre: "",
      cliente_telefono: "",
      propiedad_titulo: "",
      notas: "",
    });
    setModalOpen(true);
  };

  const abrirEdicion = (ev: EventoCalendario) => {
    setEditingId(ev.id);
    setForm({
      titulo: ev.titulo,
      tipo: ev.tipo,
      estado: ev.estado,
      fecha: ev.fecha,
      hora_inicio: ev.hora_inicio,
      hora_fin: ev.hora_fin || "",
      ubicacion: ev.ubicacion || "",
      cliente_nombre: ev.cliente_nombre || "",
      cliente_telefono: ev.cliente_telefono || "",
      propiedad_titulo: ev.propiedad_titulo || "",
      notas: ev.notas || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await guardarEvento({
      id: editingId || undefined,
      titulo: form.titulo.trim(),
      tipo: form.tipo,
      estado: form.estado,
      fecha: form.fecha,
      hora_inicio: form.hora_inicio,
      hora_fin: form.hora_fin || undefined,
      ubicacion: form.ubicacion.trim() || undefined,
      cliente_nombre: form.cliente_nombre.trim() || undefined,
      cliente_telefono: form.cliente_telefono.trim() || undefined,
      propiedad_titulo: form.propiedad_titulo.trim() || undefined,
      notas: form.notas.trim() || undefined,
    });
    setFechaSeleccionada(form.fecha);
    setModalOpen(false);
    router.replace("/admin/calendario");
  };

  // Construcción de la grilla mensual (Lunes = 0 ... Domingo = 6)
  const celdasMes = useMemo(() => {
    const primerDia = new Date(anioActual, mesActual, 1);
    const ultimoDia = new Date(anioActual, mesActual + 1, 0);
    const offsetInicio = (primerDia.getDay() + 6) % 7; // Ajuste lunes inicio
    const totalDias = ultimoDia.getDate();

    const celdas: { day: number | null; iso: string | null }[] = [];
    for (let i = 0; i < offsetInicio; i++) {
      celdas.push({ day: null, iso: null });
    }
    for (let d = 1; d <= totalDias; d++) {
      celdas.push({ day: d, iso: toISODate(anioActual, mesActual, d) });
    }
    return celdas;
  }, [anioActual, mesActual]);

  const eventosPorDia = useMemo(() => {
    const map: Record<string, EventoCalendario[]> = {};
    for (const ev of eventos) {
      if (!map[ev.fecha]) map[ev.fecha] = [];
      map[ev.fecha].push(ev);
    }
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
    }
    return map;
  }, [eventos]);

  const eventosDelDiaSeleccionado = eventosPorDia[fechaSeleccionada] || [];

  const proximosEventos = useMemo(() => {
    return [...eventos]
      .filter((e) => e.fecha >= hoyISO && e.estado !== "cancelado")
      .sort((a, b) =>
        `${a.fecha} ${a.hora_inicio}`.localeCompare(
          `${b.fecha} ${b.hora_inicio}`,
        ),
      )
      .slice(0, 8);
  }, [eventos, hoyISO]);

  const irMesAnterior = () => {
    if (mesActual === 0) {
      setMesActual(11);
      setAnioActual((a) => a - 1);
    } else {
      setMesActual((m) => m - 1);
    }
  };

  const irMesSiguiente = () => {
    if (mesActual === 11) {
      setMesActual(0);
      setAnioActual((a) => a + 1);
    } else {
      setMesActual((m) => m + 1);
    }
  };

  const generarRecordatorioWA = (ev: EventoCalendario) => {
    const tel = (ev.cliente_telefono || "").replace(/\D/g, "");
    const texto = `Hola ${ev.cliente_nombre || ""}, te escribo de ALTUM SCI (Estela Mari Rojas) para confirmar nuestro compromiso agendado:
• Motivo: ${ev.titulo}
• Fecha: ${ev.fecha} a las ${ev.hora_inicio} hs
${ev.ubicacion ? `• Lugar: ${ev.ubicacion}` : ""}
¡Quedo a disposición!`;
    return `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-dorado">
            Agenda Comercial &amp; Notarial
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-crema mt-1">
            Calendario de Visitas &amp; Tasaciones
          </h1>
          <p className="text-sm text-crema/45 mt-1">
            Organizá recorridas en Mari Menuco, visitas en Cipolletti, firmas en
            escribanía y entregas de tasaciones.
          </p>
        </div>

        <button
          onClick={() => abrirNuevo(fechaSeleccionada)}
          className="inline-flex items-center gap-2 self-start md:self-auto rounded-xl bg-dorado px-5 py-3 text-[12px] font-semibold text-tierra shadow-[0_10px_24px_-10px_rgba(184,150,90,0.8)] hover:bg-dorado-light transition-all"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          <span>Agendar compromiso</span>
        </button>
      </div>

      {/* Layout Principal: Calendario Mensual (7 cols) + Agenda Lateral (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Grilla Mensual */}
        <div className="lg:col-span-7 rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 space-y-5">
          {/* Controles de Mes */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-crema">
                {MESES[mesActual]}{" "}
                <span className="text-dorado">{anioActual}</span>
              </h2>
              <p className="text-xs text-crema/40">
                Seleccioná un día para ver o agregar compromisos
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMesActual(hoy.getMonth());
                  setAnioActual(hoy.getFullYear());
                  setFechaSeleccionada(hoyISO);
                }}
                className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-crema/70 hover:border-dorado hover:text-dorado transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={irMesAnterior}
                className="rounded-xl border border-white/10 p-2 text-crema/70 hover:border-dorado hover:text-dorado transition-colors"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={irMesSiguiente}
                className="rounded-xl border border-white/10 p-2 text-crema/70 hover:border-dorado hover:text-dorado transition-colors"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Cabecera Días */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {DIAS_SEMANA.map((d) => (
              <div
                key={d}
                className="py-2 text-[10px] font-semibold uppercase tracking-widest text-crema/40"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Celdas del Mes */}
          <div className="grid grid-cols-7 gap-1.5">
            {celdasMes.map((celda, idx) => {
              if (!celda.day || !celda.iso) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-20 sm:h-24 rounded-2xl bg-white/[0.01]"
                  />
                );
              }
              const evs = eventosPorDia[celda.iso] || [];
              const esHoy = celda.iso === hoyISO;
              const esSeleccionado = celda.iso === fechaSeleccionada;

              return (
                <button
                  key={celda.iso}
                  type="button"
                  onClick={() => setFechaSeleccionada(celda.iso!)}
                  className={`h-20 sm:h-24 rounded-2xl border p-2 flex flex-col justify-between text-left transition-all ${
                    esSeleccionado
                      ? "border-dorado bg-dorado/15 shadow-[0_0_20px_rgba(201,168,76,0.2)]"
                      : esHoy
                        ? "border-dorado/40 bg-white/[0.04]"
                        : "border-white/[0.05] bg-[#060913]/70 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        esHoy
                          ? "bg-dorado text-tierra"
                          : esSeleccionado
                            ? "text-dorado"
                            : "text-crema/75"
                      }`}
                    >
                      {celda.day}
                    </span>
                    {evs.length > 0 && (
                      <span className="text-[10px] font-mono text-dorado">
                        {evs.length}
                      </span>
                    )}
                  </div>

                  {/* Píldoras de eventos dentro de la celda */}
                  <div className="space-y-1 w-full overflow-hidden">
                    {evs.slice(0, 2).map((ev) => {
                      const tObj =
                        TIPOS_EVENTO.find((t) => t.id === ev.tipo) ||
                        TIPOS_EVENTO[0];
                      return (
                        <div
                          key={ev.id}
                          className="flex items-center gap-1 truncate rounded px-1 py-0.5 bg-white/[0.05] text-[9px] text-crema/85"
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${tObj.dot}`}
                          />
                          <span className="truncate">{ev.hora_inicio}</span>
                        </div>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Leyenda de colores */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-white/[0.06] text-[11px] text-crema/55">
            {TIPOS_EVENTO.map((t) => (
              <span key={t.id} className="inline-flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Agenda del Día Seleccionado + Próximos Compromisos */}
        <div className="lg:col-span-5 space-y-6">
          {/* Agenda del Día Seleccionado */}
          <div className="rounded-3xl border border-dorado/30 bg-[#0A1020] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-dorado font-semibold">
                  Agenda del día
                </span>
                <h3 className="font-display text-xl font-medium text-crema mt-0.5">
                  {fechaSeleccionada === hoyISO
                    ? `Hoy (${fechaSeleccionada})`
                    : fechaSeleccionada}
                </h3>
              </div>
              <button
                onClick={() => abrirNuevo(fechaSeleccionada)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-dorado/15 border border-dorado/40 px-3 py-1.5 text-xs font-semibold text-dorado hover:bg-dorado hover:text-tierra transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Agendar acá</span>
              </button>
            </div>

            {eventosDelDiaSeleccionado.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl">
                <CalendarDays className="mx-auto h-7 w-7 text-crema/25" />
                <p className="mt-2 text-xs text-crema/45">
                  No hay visitas ni reuniones programadas para esta fecha.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {eventosDelDiaSeleccionado.map((ev) => {
                  const tipoObj =
                    TIPOS_EVENTO.find((t) => t.id === ev.tipo) ||
                    TIPOS_EVENTO[0];
                  const estObj =
                    ESTADOS_EVENTO.find((e) => e.id === ev.estado) ||
                    ESTADOS_EVENTO[0];

                  return (
                    <article
                      key={ev.id}
                      className="rounded-2xl border border-white/[0.08] bg-[#060913] p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider ${tipoObj.badge}`}
                          >
                            {tipoObj.label}
                          </span>
                          <span
                            className={`rounded-md px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider ${estObj.cls}`}
                          >
                            {estObj.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => abrirEdicion(ev)}
                            className="p-1 text-crema/45 hover:text-dorado"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => eliminarEvento(ev.id)}
                            className="p-1 text-crema/35 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-display text-base font-semibold text-crema">
                          {ev.titulo}
                        </h4>
                        <div className="mt-1.5 space-y-1 text-xs text-crema/60">
                          <p className="flex items-center gap-1.5 text-dorado font-medium">
                            <Clock className="h-3.5 w-3.5" />
                            {ev.hora_inicio}
                            {ev.hora_fin ? ` a ${ev.hora_fin} hs` : " hs"}
                          </p>
                          {ev.ubicacion && (
                            <p className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-crema/40" />
                              {ev.ubicacion}
                            </p>
                          )}
                          {ev.cliente_nombre && (
                            <p className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-crema/40" />
                              {ev.cliente_nombre}
                            </p>
                          )}
                          {ev.propiedad_titulo && (
                            <p className="flex items-center gap-1.5">
                              <Home className="h-3.5 w-3.5 text-crema/40" />
                              {ev.propiedad_titulo}
                            </p>
                          )}
                        </div>
                        {ev.notas && (
                          <p className="mt-2 rounded-xl bg-white/[0.03] p-2.5 text-xs text-crema/65">
                            {ev.notas}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
                        <div className="flex items-center gap-1">
                          {(
                            ["confirmado", "realizado", "reprogramado"] as const
                          ).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => cambiarEstadoEvento(ev.id, st)}
                              className={`rounded-lg px-2 py-1 text-[10px] capitalize transition-colors ${
                                ev.estado === st
                                  ? "bg-dorado text-tierra font-semibold"
                                  : "bg-white/[0.04] text-crema/50 hover:text-crema"
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>

                        {ev.cliente_telefono && (
                          <a
                            href={generarRecordatorioWA(ev)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 px-3 py-1 text-[11px] font-semibold text-[#2fe074] hover:bg-[#25D366] hover:text-[#04240e] transition-colors"
                          >
                            <MessageCircle className="h-3 w-3" />
                            <span>Recordar por WA</span>
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Próximos compromisos de la semana/mes */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 space-y-4">
            <h3 className="font-display text-lg font-medium text-crema">
              Próximos compromisos en agenda
            </h3>
            <div className="space-y-2.5">
              {proximosEventos.map((ev) => {
                const tObj =
                  TIPOS_EVENTO.find((t) => t.id === ev.tipo) || TIPOS_EVENTO[0];
                return (
                  <div
                    key={ev.id}
                    onClick={() => setFechaSeleccionada(ev.fecha)}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.05] bg-[#060913] p-3 hover:border-dorado/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${tObj.dot}`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-crema truncate">
                          {ev.titulo}
                        </p>
                        <p className="text-[11px] text-crema/45 truncate">
                          {ev.cliente_nombre || ev.ubicacion || "ALTUM SCI"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-[11px] font-mono text-dorado">
                        {ev.fecha === hoyISO ? "HOY" : ev.fecha}
                      </span>
                      <span className="block text-[10px] text-crema/45">
                        {ev.hora_inicio} hs
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Agendar / Editar Evento */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-white/[0.1] bg-[#0A1020] p-6 md:p-8 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-dorado">
                  Calendario ALTUM SCI
                </span>
                <h2 className="font-display text-2xl text-crema font-medium mt-0.5">
                  {editingId ? "Editar Compromiso" : "Agendar Visita o Reunión"}
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
                  Título del Compromiso *
                </label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Visita Lote 14 Bahía de las Playas con cliente"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Tipo de Evento
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) =>
                      setForm({ ...form, tipo: e.target.value as TipoEvento })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    {TIPOS_EVENTO.map((t) => (
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
                        estado: e.target.value as EstadoEvento,
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    {ESTADOS_EVENTO.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Hora Inicio *
                  </label>
                  <input
                    type="time"
                    required
                    value={form.hora_inicio}
                    onChange={(e) =>
                      setForm({ ...form, hora_inicio: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={form.hora_fin}
                    onChange={(e) =>
                      setForm({ ...form, hora_fin: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                  Ubicación / Punto de Encuentro
                </label>
                <input
                  type="text"
                  value={form.ubicacion}
                  onChange={(e) =>
                    setForm({ ...form, ubicacion: e.target.value })
                  }
                  placeholder="Ej: Guardia Bahía de las Playas, Mari Menuco / Escribanía Cipolletti"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Seleccionar Cliente de Cartera
                  </label>
                  <select
                    value=""
                    onChange={(e) => {
                      const cli = clientes.find((c) => c.id === e.target.value);
                      if (cli) {
                        setForm({
                          ...form,
                          cliente_nombre: cli.nombre,
                          cliente_telefono: cli.telefono,
                          propiedad_titulo:
                            cli.propiedad_interes || form.propiedad_titulo,
                        });
                      }
                    }}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    <option value="">— Autocompletar desde Cartera —</option>
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
                    placeholder="Ej: Lote Frente al Lago"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    value={form.cliente_nombre}
                    onChange={(e) =>
                      setForm({ ...form, cliente_nombre: e.target.value })
                    }
                    placeholder="Nombre completo"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    WhatsApp del Cliente (para recordatorio)
                  </label>
                  <input
                    type="text"
                    value={form.cliente_telefono}
                    onChange={(e) =>
                      setForm({ ...form, cliente_telefono: e.target.value })
                    }
                    placeholder="+54 9 299 000-0000"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                  Notas o Documentación a Llevar
                </label>
                <textarea
                  rows={2}
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                  placeholder="Ej: Llevar plano de subdivisión y modelo de reserva..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] p-3 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
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
                  {editingId ? "Guardar Cambios" : "Confirmar en Agenda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCalendarioPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-crema/40 text-sm">
          Cargando calendario...
        </div>
      }
    >
      <CalendarioCRMContent />
    </Suspense>
  );
}
