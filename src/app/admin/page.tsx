"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Star,
  Inbox,
  ArrowUpRight,
  MessageCircle,
  Plus,
  UserCog,
  Globe,
  Sparkles,
  Users,
  CheckSquare,
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from "lucide-react";
import { Propiedad } from "@/lib/supabase/types";
import { useCRM } from "@/lib/use-crm";

interface LeadItem {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string | null;
  estado: string;
  created_at: string;
}

const ESTADOS_LEAD = [
  { id: "nuevo", label: "Nuevos", color: "bg-dorado" },
  { id: "contactado", label: "Contactados", color: "bg-sky-400" },
  { id: "en_seguimiento", label: "En seguimiento", color: "bg-violet-400" },
  { id: "cerrado", label: "Cerrados", color: "bg-emerald-400" },
];

function saludo() {
  const h = new Date().getHours();
  if (h < 12) return "Buen día";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}

function hace(fecha: string) {
  const diff = Date.now() - new Date(fecha).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `hace ${Math.max(min, 1)} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `hace ${d} d`;
  return new Date(fecha).toLocaleDateString("es-AR");
}

const iniciales = (n: string) =>
  n
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

export default function AdminDashboardPage() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    clientes,
    tareas,
    eventos,
    loading: loadingCRM,
    cambiarEstadoTarea,
  } = useCRM();

  useEffect(() => {
    async function loadData() {
      try {
        const [propsRes, leadsRes] = await Promise.all([
          fetch("/api/admin/propiedades"),
          fetch("/api/admin/leads"),
        ]);

        const propsData = await propsRes.json();
        const leadsData = await leadsRes.json();

        if (propsData.success && Array.isArray(propsData.data)) {
          setPropiedades(propsData.data);
        }
        if (leadsData.success && Array.isArray(leadsData.data)) {
          setLeads(leadsData.data);
        }
      } catch (err) {
        console.error("Error cargando datos del dashboard", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const hoyISO = new Date().toISOString().slice(0, 10);

  const totalPropiedades = propiedades.length;
  const totalDestacadas = propiedades.filter((p) => p.destacado).length;
  const totalPublicadas = propiedades.filter((p) => p.publicado).length;
  const totalLeads = leads.length;
  const leadsNuevos = leads.filter((l) => !l.estado || l.estado === "nuevo").length;
  const leadsSemana = leads.filter(
    (l) => Date.now() - new Date(l.created_at).getTime() < 7 * 86400000,
  ).length;

  // Métricas CRM
  const totalClientes = clientes.length;
  const clientesEnNegociacion = clientes.filter(
    (c) =>
      c.estado === "visita_programada" ||
      c.estado === "reserva_firmada" ||
      c.estado === "activo",
  );
  const volumenCarteraUSD = clientes.reduce(
    (acc, c) => acc + (c.presupuesto_usd || 0),
    0,
  );

  const tareasPendientes = tareas.filter((t) => t.estado !== "completada");
  const tareasUrgentes = tareasPendientes.filter(
    (t) => t.prioridad === "urgente" || t.prioridad === "alta",
  );

  const eventosFuturos = [...eventos]
    .filter((ev) => ev.estado !== "cancelado" && ev.fecha >= hoyISO)
    .sort((a, b) =>
      `${a.fecha} ${a.hora_inicio}`.localeCompare(`${b.fecha} ${b.hora_inicio}`),
    );
  const eventosHoy = eventos.filter(
    (ev) => ev.estado !== "cancelado" && ev.fecha === hoyISO,
  );

  const kpis = [
    {
      label: "Cartera de Clientes",
      value: totalClientes,
      sub: `USD ${(volumenCarteraUSD / 1000).toFixed(0)}k demanda activa`,
      icon: Users,
      href: "/admin/clientes",
      accent: "from-dorado/25 to-dorado/0",
      iconCls: "bg-dorado/15 text-dorado",
    },
    {
      label: "Tareas & Pendientes",
      value: tareasPendientes.length,
      sub: `${tareasUrgentes.length} de prioridad alta / urgente`,
      icon: CheckSquare,
      href: "/admin/tareas",
      accent: "from-amber-400/20 to-amber-400/0",
      iconCls: "bg-amber-400/15 text-amber-300",
    },
    {
      label: "Visitas & Agenda",
      value: eventosFuturos.length,
      sub:
        eventosHoy.length > 0
          ? `${eventosHoy.length} compromiso(s) para hoy`
          : "Próximos recorridos agendados",
      icon: CalendarDays,
      href: "/admin/calendario",
      accent: "from-sky-400/20 to-sky-400/0",
      iconCls: "bg-sky-400/15 text-sky-300",
    },
    {
      label: "Consultas Web",
      value: totalLeads,
      sub: `${leadsNuevos} nuevas · ${leadsSemana} esta semana`,
      icon: Inbox,
      href: "/admin/leads",
      accent: "from-emerald-400/20 to-emerald-400/0",
      iconCls: "bg-emerald-400/15 text-emerald-300",
    },
    {
      label: "Catálogo Activo",
      value: totalPropiedades,
      sub: `${totalPublicadas} publicadas · ${totalDestacadas} en portada`,
      icon: Building2,
      href: "/admin/propiedades",
      accent: "from-violet-400/20 to-violet-400/0",
      iconCls: "bg-violet-400/15 text-violet-300",
    },
  ];

  const accesos = [
    { href: "/admin/clientes?action=new", label: "Nuevo cliente", icon: Users },
    { href: "/admin/tareas?action=new", label: "Crear tarea", icon: CheckSquare },
    { href: "/admin/calendario?action=new", label: "Agendar visita", icon: CalendarDays },
    { href: "/admin/propiedades?action=new", label: "Publicar lote", icon: Plus },
    { href: "/admin/configuracion", label: "Editar Landing", icon: UserCog },
    { href: "/", label: "Ver sitio", icon: Globe, external: true },
  ];

  return (
    <div className="space-y-8 max-w-[1440px]">
      {/* Bienvenida 360 */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#121A33] via-[#0C1326] to-[#090E1C] p-6 lg:p-8">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-dorado/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dorado/30 bg-dorado/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-dorado">
              <Sparkles className="h-3 w-3" />
              Centro de Comando CRM &amp; CMS · ALTUM SCI
            </span>
            <h1 className="mt-3.5 font-display text-3xl lg:text-4xl font-medium text-crema">
              {saludo()}, <span className="italic text-dorado">Estela</span>
            </h1>
            <p className="mt-2 text-sm text-crema/55 max-w-2xl">
              {loading || loadingCRM
                ? "Sincronizando tu agenda, clientes y catálogo inmobiliario…"
                : `Tenés ${tareasPendientes.length} tareas activas, ${eventosFuturos.length} eventos próximos en agenda y ${clientesEnNegociacion.length} clientes en etapa de visita, negociación o reserva.`}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {accesos.map(({ href, label, icon: Icon, external }) => (
              <Link
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                className="group flex flex-col items-start gap-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5 hover:border-dorado/40 hover:bg-white/[0.06] transition-all"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-crema/70 group-hover:bg-dorado group-hover:text-tierra transition-colors">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <span className="text-[11px] font-medium leading-tight text-crema/80 group-hover:text-crema">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map(({ label, value, sub, icon: Icon, href, accent, iconCls }) => (
          <Link
            key={label}
            href={href}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0A1020] p-5 hover:border-dorado/35 transition-all"
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accent}`}
              aria-hidden="true"
            />
            <div className="relative flex items-start justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-crema/50 group-hover:text-dorado transition-colors">
                {label}
              </span>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconCls}`}>
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </span>
            </div>
            <div className="relative mt-3 font-display text-4xl font-semibold text-crema tabular-nums">
              {loading && loadingCRM ? (
                <span className="inline-block h-9 w-14 rounded-lg bg-white/[0.06] animate-pulse" />
              ) : (
                value
              )}
            </div>
            <p className="relative mt-1.5 text-[11px] text-crema/45 truncate">{sub}</p>
          </Link>
        ))}
      </section>

      {/* FILA CRM OPERATIVO: TAREAS URGENTES + AGENDA DE VISITAS + CARTERA ACTIVA */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tareas Pendientes con Check Directo */}
        <div className="lg:col-span-4 rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-dorado font-semibold">
                  Operaciones del día
                </span>
                <h2 className="font-display text-xl text-crema font-medium">
                  Pendientes &amp; Tareas
                </h2>
              </div>
              <Link
                href="/admin/tareas"
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-dorado hover:bg-dorado/10 transition-colors"
              >
                Tablero <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {tareasPendientes.length === 0 ? (
              <div className="py-10 text-center rounded-2xl border border-dashed border-white/10">
                <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-400/60" />
                <p className="mt-2 text-xs text-crema/50">
                  ¡Todo al día! No tenés tareas pendientes.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {tareasPendientes.slice(0, 5).map((t) => {
                  const esUrgente =
                    t.prioridad === "urgente" || t.prioridad === "alta";
                  return (
                    <div
                      key={t.id}
                      className="group flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 hover:border-dorado/30 transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => cambiarEstadoTarea(t.id, "completada")}
                        title="Marcar como completada"
                        className="mt-0.5 text-crema/35 hover:text-emerald-400 transition-colors shrink-0"
                      >
                        <Circle className="h-4 w-4" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {esUrgente && (
                            <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                          )}
                          <p className="text-xs font-medium text-crema truncate">
                            {t.titulo}
                          </p>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-crema/45">
                          {t.cliente_nombre && (
                            <span className="text-dorado/90">
                              {t.cliente_nombre}
                            </span>
                          )}
                          {t.fecha_vencimiento && (
                            <span>
                              · Vence{" "}
                              {new Date(
                                t.fecha_vencimiento + "T12:00:00",
                              ).toLocaleDateString("es-AR", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/admin/tareas?action=new"
            className="mt-4 inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs font-medium text-crema/75 hover:border-dorado/40 hover:text-dorado transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Agregar nuevo pendiente
          </Link>
        </div>

        {/* Próximas Visitas & Calendario */}
        <div className="lg:col-span-4 rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-sky-300 font-semibold">
                  Recorridos &amp; Firmas
                </span>
                <h2 className="font-display text-xl text-crema font-medium">
                  Próxima Agenda
                </h2>
              </div>
              <Link
                href="/admin/calendario"
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-dorado hover:bg-dorado/10 transition-colors"
              >
                Calendario <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {eventosFuturos.length === 0 ? (
              <div className="py-10 text-center rounded-2xl border border-dashed border-white/10">
                <CalendarDays className="mx-auto h-7 w-7 text-crema/25" />
                <p className="mt-2 text-xs text-crema/50">
                  Sin visitas programadas próximamente.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {eventosFuturos.slice(0, 4).map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-crema truncate">
                        {ev.titulo}
                      </span>
                      <span className="shrink-0 rounded-md bg-dorado/15 px-2 py-0.5 text-[10px] font-semibold text-dorado">
                        {new Date(ev.fecha + "T12:00:00").toLocaleDateString(
                          "es-AR",
                          { day: "2-digit", month: "short" },
                        )}{" "}
                        · {ev.hora_inicio}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-crema/50">
                      <span className="inline-flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 text-dorado/70 shrink-0" />
                        {ev.ubicacion || "Mari Menuco / Neuquén"}
                      </span>
                      {ev.cliente_telefono && (
                        <a
                          href={`https://wa.me/${ev.cliente_telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${ev.cliente_nombre || ""}, te escribo de ALTUM SCI para confirmar nuestro compromiso "${ev.titulo}" el día ${ev.fecha} a las ${ev.hora_inicio} hs.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-300 hover:underline shrink-0 ml-2"
                        >
                          Confirmar WA
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/admin/calendario?action=new"
            className="mt-4 inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs font-medium text-crema/75 hover:border-dorado/40 hover:text-dorado transition-colors"
          >
            <Clock className="h-3.5 w-3.5" /> Agendar visita o reunión
          </Link>
        </div>

        {/* Clientes Calientes en Negociación / Reserva */}
        <div className="lg:col-span-4 rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-300 font-semibold">
                  Pipeline Comercial
                </span>
                <h2 className="font-display text-xl text-crema font-medium">
                  Clientes en Cierre
                </h2>
              </div>
              <Link
                href="/admin/clientes"
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-dorado hover:bg-dorado/10 transition-colors"
              >
                Cartera <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {clientes.length === 0 ? (
              <div className="py-10 text-center rounded-2xl border border-dashed border-white/10">
                <Users className="mx-auto h-7 w-7 text-crema/25" />
                <p className="mt-2 text-xs text-crema/50">
                  Sin clientes registrados en la cartera.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {clientes.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dorado/15 text-[11px] font-semibold text-dorado">
                        {iniciales(c.nombre)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-crema truncate">
                          {c.nombre}
                        </p>
                        <p className="text-[10px] text-crema/45 truncate">
                          {c.zona_interes} ·{" "}
                          {c.presupuesto_usd
                            ? `USD ${c.presupuesto_usd.toLocaleString("es-AR")}`
                            : "A definir"}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${c.telefono.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors shrink-0"
                    >
                      WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/admin/clientes"
            className="mt-4 inline-flex items-center justify-center gap-1.5 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs font-medium text-crema/75 hover:border-dorado/40 hover:text-dorado transition-colors"
          >
            <Users className="h-3.5 w-3.5" /> Ver ficha 360° de clientes
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Catálogo */}
        <div className="lg:col-span-8 rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl text-crema font-medium">
                Catálogo reciente
              </h2>
              <p className="text-xs text-crema/40 mt-0.5">
                Últimas unidades sincronizadas con la base de datos
              </p>
            </div>
            <Link
              href="/admin/propiedades"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-dorado hover:bg-dorado/10 transition-colors"
            >
              Ver todas ({totalPropiedades})
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[72px] rounded-2xl bg-white/[0.03] animate-pulse" />
              ))}
            </div>
          ) : propiedades.length === 0 ? (
            <div className="py-14 text-center rounded-2xl border border-dashed border-white/10">
              <Building2 className="mx-auto h-8 w-8 text-crema/25" strokeWidth={1.5} />
              <p className="mt-3 text-sm text-crema/50">
                Aún no hay propiedades cargadas.
              </p>
              <Link
                href="/admin/propiedades?action=new"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-dorado px-4 py-2 text-xs font-semibold text-tierra"
              >
                <Plus className="h-4 w-4" /> Cargar la primera
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {propiedades.slice(0, 5).map((p) => {
                const img =
                  p.imagenes && p.imagenes.length > 0
                    ? p.imagenes[0]
                    : "/mari-menuco/bahia-playas-1.jpg";
                const disponible = !p.estado || p.estado === "disponible";

                return (
                  <div
                    key={p.id}
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl p-3 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10">
                        <Image src={img} alt={p.titulo} fill sizes="64px" className="object-cover" />
                        {p.destacado && (
                          <span className="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-dorado text-tierra">
                            <Star className="h-3 w-3" fill="currentColor" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-[15px] font-semibold text-crema truncate group-hover:text-dorado transition-colors">
                          {p.titulo}
                        </h3>
                        <p className="text-[12px] text-crema/45 truncate">
                          {p.ciudad} {p.barrio && `· ${p.barrio}`}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="rounded-md bg-dorado/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-dorado">
                            {p.tipo || "lote"}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                              disponible
                                ? "bg-emerald-500/10 text-emerald-300"
                                : "bg-white/[0.06] text-crema/60"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${disponible ? "bg-emerald-400" : "bg-crema/40"}`}
                            />
                            {p.estado || "disponible"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <span className="font-display text-base font-bold text-crema block tabular-nums">
                          {p.precio
                            ? `${p.moneda || "USD"} ${p.precio.toLocaleString("es-AR")}`
                            : "Consultar"}
                        </span>
                        <span className="text-[11px] text-crema/40 block">
                          {p.superficie_m2 ? `${p.superficie_m2} m²` : ""}
                        </span>
                      </div>
                      <Link
                        href={`/admin/propiedades?edit=${p.id}`}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-[12px] text-crema/70 hover:border-dorado hover:text-dorado transition-colors"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Leads */}
        <div className="lg:col-span-4 space-y-6">
          {/* Embudo */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6">
            <h2 className="font-display text-xl text-crema font-medium">Embudo de consultas</h2>
            <p className="text-xs text-crema/40 mt-0.5 mb-5">Estado de cada lead recibido</p>
            <div className="space-y-3.5">
              {ESTADOS_LEAD.map((e) => {
                const n = leads.filter((l) => (l.estado || "nuevo") === e.id).length;
                const pct = totalLeads ? Math.round((n / totalLeads) * 100) : 0;
                return (
                  <div key={e.id}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="flex items-center gap-2 text-crema/70">
                        <span className={`h-2 w-2 rounded-full ${e.color}`} />
                        {e.label}
                      </span>
                      <span className="tabular-nums text-crema/50">
                        {n} <span className="text-crema/25">· {pct}%</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${e.color} transition-all duration-700`}
                        style={{ width: loading ? "0%" : `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Últimos leads */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-crema font-medium">Últimas consultas</h2>
              <Link
                href="/admin/leads"
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-dorado hover:bg-dorado/10 transition-colors"
              >
                Ver todas <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 rounded-2xl bg-white/[0.03] animate-pulse" />
                ))}
              </div>
            ) : leads.length === 0 ? (
              <div className="py-10 text-center">
                <Inbox className="mx-auto h-7 w-7 text-crema/25" strokeWidth={1.5} />
                <p className="mt-2 text-xs text-crema/45">No hay consultas registradas aún.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {leads.slice(0, 4).map((l) => (
                  <div
                    key={l.id}
                    className="flex gap-3 rounded-2xl p-2.5 hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dorado/30 to-dorado/10 text-[11px] font-semibold text-dorado">
                      {iniciales(l.nombre) || "?"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-medium text-crema">
                          {l.nombre}
                        </span>
                        <span className="shrink-0 text-[10px] text-crema/35">
                          {hace(l.created_at)}
                        </span>
                      </div>
                      <p className="text-[12px] text-crema/45 line-clamp-1">
                        {l.mensaje || "Interesado en propiedades"}
                      </p>
                      {l.telefono && (
                        <a
                          href={`https://wa.me/${l.telefono.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-300/90 hover:text-emerald-300"
                        >
                          <MessageCircle className="h-3 w-3" /> Responder por WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
