"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  User,
  Briefcase,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Save,
  Sparkles,
} from "lucide-react";
import { SiteConfig, ServicioConfig } from "@/lib/site-config";

export default function AdminConfiguracionPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setConfig(data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setGuardando(true);
    setMensaje(null);

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (data.success) {
        setMensaje({
          tipo: "exito",
          texto: "¡Configuración guardada y actualizada en la landing page!",
        });
        setTimeout(() => setMensaje(null), 5000);
      } else {
        setMensaje({
          tipo: "error",
          texto: data.error || "No se pudo guardar la configuración",
        });
      }
    } catch {
      setMensaje({
        tipo: "error",
        texto: "Error al conectar con el servidor",
      });
    } finally {
      setGuardando(false);
    }
  };

  const handleAgregarServicio = () => {
    if (!config) return;
    const nuevoServicio: ServicioConfig = {
      id: `servicio-${Date.now()}`,
      titulo: "Nuevo Servicio Inmobiliario",
      descripcion: "Descripción del servicio prestado por ALTUM SCI.",
      activo: true,
    };
    setConfig({
      ...config,
      servicios: [...config.servicios, nuevoServicio],
    });
  };

  const handleEliminarServicio = (id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      servicios: config.servicios.filter((s) => s.id !== id),
    });
  };

  if (loading || !config) {
    return (
      <div className="py-20 text-center text-crema/40 text-sm">
        Cargando configuración...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-dorado">
            Identidad &amp; Contenidos
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-crema mt-1">
            Perfil de la titular &amp; servicios
          </h1>
          <p className="text-sm text-crema/45 mt-1">
            Editá tu foto, bio profesional, canales de contacto directo y servicios en la web.
          </p>
        </div>

        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="inline-flex items-center gap-2 self-start md:self-auto rounded-xl bg-dorado px-5 py-3 text-[12px] font-semibold text-tierra shadow-[0_10px_24px_-10px_rgba(184,150,90,0.8)] hover:bg-dorado-light transition-all hover:-translate-y-px disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{guardando ? "Guardando..." : "Guardar cambios"}</span>
        </button>
      </div>

      {mensaje && (
        <div
          className={`flex items-center gap-2 rounded-2xl border p-4 text-xs font-medium ${
            mensaje.tipo === "exito"
              ? "border-emerald-500/40 bg-emerald-950/70 text-emerald-200"
              : "border-red-500/40 bg-red-950/70 text-red-200"
          }`}
        >
          {mensaje.tipo === "exito" ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-400" />
          )}
          <span>{mensaje.texto}</span>
        </div>
      )}

      <form onSubmit={handleGuardar} className="space-y-8">
        {/* ── BLOQUE 1: PERFIL DE LA MARTILLERA ── */}
        <section className="rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dorado/15 text-dorado">
              <User className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl text-crema font-medium">
                Perfil profesional · Estela Mari Rojas
              </h2>
              <p className="text-xs text-crema/40">
                Se refleja en la sección Nosotros, tarjeta institucional y pie de página.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Foto preview dual */}
            <div className="md:col-span-5 flex flex-col items-center gap-3">
              <div className="relative w-44 aspect-square rounded-2xl overflow-hidden border border-dorado/40 shadow-xl bg-black/40">
                <Image
                  src={config.perfil.foto || "/estela.jpg"}
                  alt={config.perfil.nombre}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-crema/45">
                <Sparkles className="h-3 w-3 text-dorado" />
                <span>Pieza institucional oficial</span>
              </div>
            </div>

            {/* Inputs de foto y nombre */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                  Ruta o URL de Fotografía
                </label>
                <input
                  type="text"
                  value={config.perfil.foto}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      perfil: { ...config.perfil, foto: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
                <p className="text-[11px] text-crema/35 mt-1">
                  Predeterminado: <code>/estela.jpg</code>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={config.perfil.nombre}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        perfil: { ...config.perfil, nombre: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                    Título Profesional
                  </label>
                  <input
                    type="text"
                    value={config.perfil.titulo}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        perfil: { ...config.perfil, titulo: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Matrícula & Colegio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06]">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                Matrícula Oficial
              </label>
              <input
                type="text"
                value={config.perfil.matricula}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    perfil: { ...config.perfil, matricula: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                Colegio Profesional
              </label>
              <input
                type="text"
                value={config.perfil.colegio}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    perfil: { ...config.perfil, colegio: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
              />
            </div>
          </div>

          {/* Contacto directo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                WhatsApp Directo
              </label>
              <input
                type="text"
                value={config.perfil.whatsapp}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    perfil: { ...config.perfil, whatsapp: e.target.value },
                  })
                }
                placeholder="5492996095742"
                className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                value={config.perfil.telefono}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    perfil: { ...config.perfil, telefono: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={config.perfil.email}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    perfil: { ...config.perfil, email: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
              Descripción / Biografía Profesional
            </label>
            <textarea
              rows={4}
              value={config.perfil.bio}
              onChange={(e) =>
                setConfig({
                  ...config,
                  perfil: { ...config.perfil, bio: e.target.value },
                })
              }
              className="w-full rounded-xl border border-white/[0.08] bg-[#060913] p-3 text-xs leading-relaxed text-crema focus:border-dorado/60 focus:outline-none"
            />
          </div>
        </section>

        {/* ── BLOQUE 2: SERVICIOS QUE OFRECE ── */}
        <section className="rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dorado/15 text-dorado">
                <Briefcase className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl text-crema font-medium">
                  Servicios ofrecidos en la landing
                </h2>
                <p className="text-xs text-crema/40">
                  Podés modificar títulos, descripciones o sumar nuevos servicios.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAgregarServicio}
              className="inline-flex items-center gap-1.5 rounded-xl border border-dorado/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-dorado hover:bg-dorado hover:text-tierra transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Agregar</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.servicios.map((srv, idx) => (
              <div
                key={srv.id}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-dorado">
                    Servicio #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEliminarServicio(srv.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-red-400/70 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] uppercase tracking-wider text-crema/45 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      value={srv.titulo}
                      onChange={(e) => {
                        const nuevos = [...config.servicios];
                        nuevos[idx].titulo = e.target.value;
                        setConfig({ ...config, servicios: nuevos });
                      }}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-7">
                    <label className="block text-[10px] uppercase tracking-wider text-crema/45 mb-1">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={srv.descripcion}
                      onChange={(e) => {
                        const nuevos = [...config.servicios];
                        nuevos[idx].descripcion = e.target.value;
                        setConfig({ ...config, servicios: nuevos });
                      }}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit final */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={guardando}
            className="inline-flex items-center gap-2 rounded-xl bg-dorado px-7 py-3.5 text-xs font-semibold text-tierra shadow-[0_10px_24px_-10px_rgba(184,150,90,0.8)] hover:bg-dorado-light transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{guardando ? "Guardando..." : "Guardar toda la configuración"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
