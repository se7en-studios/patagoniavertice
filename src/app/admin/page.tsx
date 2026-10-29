"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const totalLeads = leads.length;

  return (
    <div className="space-y-10">
      {/* Title & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-crema/10 pb-6">
        <div>
          <span className="font-body text-dorado text-[10px] tracking-[0.25em] uppercase font-semibold">
            Panel de Control General
          </span>
          <h1 className="font-display text-3xl font-medium text-crema mt-1">
            Bienvenida, Estela
          </h1>
          <p className="font-body text-crema/50 text-sm mt-0.5">
            Gestión en tiempo real de catálogo, tasaciones y contenidos de ALTUM SCI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/propiedades?action=new"
            className="px-5 py-2.5 bg-dorado text-tierra font-body text-xs font-bold tracking-wider uppercase hover:bg-dorado-light transition-all shadow-md"
          >
            + Publicar Inmueble
          </Link>
          <Link
            href="/admin/configuracion"
            className="px-4 py-2.5 border border-crema/20 text-crema font-body text-xs tracking-wider uppercase hover:border-dorado hover:text-dorado transition-colors"
          >
            Editar Perfil
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-[#090E1C] border border-crema/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-[10px] tracking-wider text-crema/40 uppercase">
              Total Catálogo
            </span>
            <span className="text-xl">🏡</span>
          </div>
          <div className="font-display text-3xl text-crema font-bold">
            {loading ? "..." : totalPropiedades}
          </div>
          <span className="font-body text-dorado text-xs mt-1 block">
            Propiedades registradas
          </span>
        </div>

        <div className="p-6 bg-[#090E1C] border border-crema/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-[10px] tracking-wider text-crema/40 uppercase">
              Lotes &amp; Terrenos
            </span>
            <span className="text-xl">📐</span>
          </div>
          <div className="font-display text-3xl text-crema font-bold">
            {loading ? "..." : totalLotes}
          </div>
          <span className="font-body text-crema/40 text-xs mt-1 block">
            Mari Menuco y zonas clave
          </span>
        </div>

        <div className="p-6 bg-[#090E1C] border border-crema/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-[10px] tracking-wider text-crema/40 uppercase">
              En Portada (Home)
            </span>
            <span className="text-xl">⭐</span>
          </div>
          <div className="font-display text-3xl text-dorado font-bold">
            {loading ? "..." : totalDestacadas}
          </div>
          <span className="font-body text-crema/40 text-xs mt-1 block">
            Destacadas en la landing
          </span>
        </div>

        <div className="p-6 bg-[#090E1C] border border-crema/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-[10px] tracking-wider text-crema/40 uppercase">
              Consultas &amp; Leads
            </span>
            <span className="text-xl">📩</span>
          </div>
          <div className="font-display text-3xl text-emerald-400 font-bold">
            {loading ? "..." : totalLeads}
          </div>
          <span className="font-body text-crema/40 text-xs mt-1 block">
            Tasaciones y contactos
          </span>
        </div>
      </div>

      {/* Grid: Recent Properties & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Propiedades Recientes */}
        <div className="lg:col-span-8 bg-[#090E1C] border border-crema/10 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-crema/10">
            <div>
              <h3 className="font-display text-xl text-crema font-medium">
                Propiedades &amp; Lotes en Catálogo
              </h3>
              <p className="font-body text-xs text-crema/40 mt-0.5">
                Últimas unidades sincronizadas con la base de datos
              </p>
            </div>
            <Link
              href="/admin/propiedades"
              className="text-dorado font-body text-xs tracking-wider uppercase hover:underline"
            >
              Ver todas ({totalPropiedades}) →
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-crema/40 font-body text-sm">
              Cargando catálogo...
            </div>
          ) : propiedades.length === 0 ? (
            <div className="py-12 text-center text-crema/40 font-body text-sm">
              Aún no hay propiedades cargadas en Supabase.
              <div className="mt-4">
                <Link
                  href="/admin/propiedades?action=new"
                  className="px-4 py-2 bg-dorado text-tierra font-body text-xs font-semibold uppercase inline-block"
                >
                  + Cargar Primera Propiedad
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-crema/10">
              {propiedades.slice(0, 5).map((p) => {
                const img =
                  p.imagenes && p.imagenes.length > 0
                    ? p.imagenes[0]
                    : "/mari-menuco/bahia-playas-1.jpg";

                return (
                  <div
                    key={p.id}
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-14 h-14 rounded-sm overflow-hidden border border-crema/15 shrink-0">
                        <Image
                          src={img}
                          alt={p.titulo}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-display text-sm font-semibold text-crema truncate group-hover:text-dorado transition-colors">
                          {p.titulo}
                        </h4>
                        <p className="font-body text-[11px] text-crema/50">
                          {p.ciudad} {p.barrio && `· ${p.barrio}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-body text-[9px] uppercase px-2 py-0.5 bg-dorado/10 text-dorado border border-dorado/30">
                            {p.tipo || "lote"}
                          </span>
                          <span
                            className={`font-body text-[9px] uppercase px-2 py-0.5 ${
                              p.estado === "disponible"
                                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                                : "bg-zinc-800 text-crema/70"
                            }`}
                          >
                            {p.estado || "disponible"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <span className="font-display text-base font-bold text-dorado block">
                          {p.precio
                            ? `${p.moneda || "USD"} ${p.precio.toLocaleString("es-AR")}`
                            : "Consultar"}
                        </span>
                        <span className="font-body text-[10px] text-crema/40 block">
                          {p.superficie_m2 ? `${p.superficie_m2} m²` : ""}
                        </span>
                      </div>

                      <Link
                        href={`/admin/propiedades?edit=${p.id}`}
                        className="px-3 py-1.5 border border-crema/20 text-crema/70 hover:text-dorado hover:border-dorado font-body text-[11px] tracking-wider uppercase transition-colors"
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

        {/* Right Column: Leads & Consultas */}
        <div className="lg:col-span-4 bg-[#090E1C] border border-crema/10 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-crema/10">
              <h3 className="font-display text-xl text-crema font-medium">
                Últimos Leads
              </h3>
              <Link
                href="/admin/leads"
                className="text-dorado font-body text-xs tracking-wider uppercase hover:underline"
              >
                Ver todos →
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-crema/40 font-body text-xs">
                Cargando leads...
              </div>
            ) : leads.length === 0 ? (
              <div className="py-8 text-center text-crema/40 font-body text-xs">
                No hay consultas registradas aún.
              </div>
            ) : (
              <div className="space-y-3.5">
                {leads.slice(0, 4).map((l) => (
                  <div
                    key={l.id}
                    className="p-3 bg-navy-950/70 border border-crema/10 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-crema">{l.nombre}</span>
                      <span className="text-[10px] text-crema/40">
                        {new Date(l.created_at).toLocaleDateString("es-AR")}
                      </span>
                    </div>
                    <p className="text-crema/60 text-[11px] line-clamp-2">
                      {l.mensaje || "Interesado en propiedades"}
                    </p>
                    {l.telefono && (
                      <a
                        href={`https://wa.me/${l.telefono.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 text-[10px] tracking-wider uppercase hover:underline flex items-center gap-1 pt-1"
                      >
                        <span>Responder por WhatsApp →</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-crema/10">
            <Link
              href="/admin/configuracion"
              className="w-full py-3 bg-navy-900 border border-dorado/30 text-dorado font-body text-xs font-semibold tracking-wider uppercase hover:bg-dorado hover:text-tierra transition-all flex items-center justify-center gap-2"
            >
              <span>⚙️</span>
              <span>Ajustes de Perfil &amp; Textos</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
