"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Ruler,
  Star,
  Inbox,
  ArrowUpRight,
  MessageCircle,
  Plus,
  UserCog,
  Globe,
  Sparkles,
} from "lucide-react";
import { Propiedad } from "@/lib/supabase/types";

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

  const totalPropiedades = propiedades.length;
  const totalLotes = propiedades.filter((p) => p.tipo === "lote").length;
  const totalDestacadas = propiedades.filter((p) => p.destacado).length;
  const totalPublicadas = propiedades.filter((p) => p.publicado).length;
  const totalLeads = leads.length;
  const leadsNuevos = leads.filter((l) => !l.estado || l.estado === "nuevo").length;
  const leadsSemana = leads.filter(
    (l) => Date.now() - new Date(l.created_at).getTime() < 7 * 86400000,
  ).length;

  const kpis = [
    {
      label: "Catálogo total",
      value: totalPropiedades,
      sub: `${totalPublicadas} publicadas en el sitio`,
      icon: Building2,
      accent: "from-dorado/25 to-dorado/0",
      iconCls: "bg-dorado/15 text-dorado",
    },
    {
      label: "Lotes & terrenos",
      value: totalLotes,
      sub: "Mari Menuco y zonas clave",
      icon: Ruler,
      accent: "from-sky-400/20 to-sky-400/0",
      iconCls: "bg-sky-400/15 text-sky-300",
    },
    {
      label: "En portada",
      value: totalDestacadas,
      sub: "Destacadas en la landing",
      icon: Star,
      accent: "from-amber-300/20 to-amber-300/0",
      iconCls: "bg-amber-300/15 text-amber-200",
    },
    {
      label: "Consultas",
      value: totalLeads,
      sub: `${leadsSemana} en los últimos 7 días`,
      icon: Inbox,
      accent: "from-emerald-400/20 to-emerald-400/0",
      iconCls: "bg-emerald-400/15 text-emerald-300",
    },
  ];

  const accesos = [
    { href: "/admin/propiedades?action=new", label: "Publicar inmueble", icon: Plus },
    { href: "/admin/leads", label: "Responder consultas", icon: MessageCircle },
    { href: "/admin/configuracion", label: "Editar perfil", icon: UserCog },
    { href: "/", label: "Ver sitio", icon: Globe, external: true },
  ];

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Bienvenida */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#121A33] via-[#0C1326] to-[#090E1C] p-7 lg:p-9">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-dorado/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dorado/30 bg-dorado/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-dorado">
              <Sparkles className="h-3 w-3" />
              Panel de control
            </span>
            <h1 className="mt-4 font-display text-3xl lg:text-4xl font-medium text-crema">
              {saludo()}, <span className="italic text-dorado">Estela</span>
            </h1>
            <p className="mt-2 text-sm text-crema/50 max-w-lg">
              {loading
                ? "Cargando el resumen de hoy…"
                : leadsNuevos > 0
                  ? `Tenés ${leadsNuevos} ${leadsNuevos === 1 ? "consulta nueva" : "consultas nuevas"} esperando respuesta.`
                  : "Estás al día con todas las consultas. Buen momento para publicar algo nuevo."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {accesos.map(({ href, label, icon: Icon, external }) => (
              <Link
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5 w-full sm:w-32 hover:border-dorado/40 hover:bg-white/[0.06] transition-all"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-crema/70 group-hover:bg-dorado group-hover:text-tierra transition-colors">
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <span className="text-[12px] leading-tight text-crema/75 group-hover:text-crema">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, icon: Icon, accent, iconCls }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0A1020] p-5"
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accent}`}
              aria-hidden="true"
            />
            <div className="relative flex items-start justify-between">
              <span className="text-[11px] uppercase tracking-[0.16em] text-crema/45">
                {label}
              </span>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconCls}`}>
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </span>
            </div>
            <div className="relative mt-3 font-display text-4xl font-semibold text-crema tabular-nums">
              {loading ? (
                <span className="inline-block h-9 w-14 rounded-lg bg-white/[0.06] animate-pulse" />
              ) : (
                value
              )}
            </div>
            <p className="relative mt-1.5 text-xs text-crema/40">{sub}</p>
          </div>
        ))}
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
                {leads.slice(0, 5).map((l) => (
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
