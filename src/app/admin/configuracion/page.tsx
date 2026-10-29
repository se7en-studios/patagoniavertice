"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SiteConfig, ServicioConfig } from "@/lib/site-config";

export default function AdminConfiguracionPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

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
        setMensaje({ tipo: "exito", texto: "¡Configuración guardada y actualizada en la landing page!" });
        setTimeout(() => setMensaje(null), 5000);
      } else {
        setMensaje({ tipo: "error", texto: data.error || "No se pudo guardar la configuración" });
      }
    } catch {
      setMensaje({ tipo: "error", texto: "Error al conectar con el servidor" });
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
      <div className="py-20 text-center text-crema/40 font-body text-sm">
        Cargando configuración...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-crema/10 pb-6">
        <div>
          <span className="font-body text-dorado text-[10px] tracking-[0.25em] uppercase font-semibold">
            Personalización de la Landing Page
          </span>
          <h1 className="font-display text-3xl font-medium text-crema mt-1">
            Perfil de la Propietaria &amp; Servicios
          </h1>
          <p className="font-body text-crema/50 text-sm mt-0.5">
            Cambiá tu foto, bio, teléfono y los servicios que se muestran en el sitio web.
          </p>
        </div>

        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="px-6 py-3 bg-dorado text-tierra font-body text-xs font-bold tracking-wider uppercase hover:bg-dorado-light transition-all shadow-md self-start md:self-auto disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      {mensaje && (
        <div
          className={`p-4 text-xs font-body flex items-center gap-2 border ${
            mensaje.tipo === "exito"
              ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-200"
              : "bg-red-950/80 border-red-500/50 text-red-200"
          }`}
        >
          <span>{mensaje.tipo === "exito" ? "✓" : "⚠️"}</span>
          <span>{mensaje.texto}</span>
        </div>
      )}

      <form onSubmit={handleGuardar} className="space-y-10">
        {/* ── BLOQUE 1: PERFIL DE LA MARTILLERA ── */}
        <div className="p-8 bg-[#090E1C] border border-crema/10 space-y-6">
          <div className="flex items-center gap-3 border-b border-crema/10 pb-4">
            <span className="text-xl">👤</span>
            <div>
              <h2 className="font-display text-xl text-crema font-semibold">
                Perfil Profesional (Estela Mari Rojas)
              </h2>
              <p className="font-body text-xs text-crema/40">
                Se refleja en la sección Nosotros, credenciales y en el pie de página.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Foto preview */}
            <div className="md:col-span-4 flex flex-col items-center gap-3">
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-dorado shadow-xl">
                <Image
                  src={config.perfil.foto || "/estela.jpg"}
                  alt={config.perfil.nombre}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-body text-[10px] text-crema/40 uppercase">
                Foto actual de perfil
              </span>
            </div>

            {/* Inputs de foto y nombre */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1 font-semibold">
                  URL de Fotografía de Perfil
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
                  className="w-full bg-navy-950 border border-crema/20 px-3.5 py-2.5 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                />
                <p className="font-body text-[10px] text-crema/30 mt-1">
                  Podés usar <code>/estela.jpg</code> o pegar cualquier enlace HTTPS directo a tu foto.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1 font-semibold">
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
                    className="w-full bg-navy-950 border border-crema/20 px-3.5 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                  />
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1 font-semibold">
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
                    className="w-full bg-navy-950 border border-crema/20 px-3.5 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Matrícula & Colegio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1 font-semibold">
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
                className="w-full bg-navy-950 border border-crema/20 px-3.5 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1 font-semibold">
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
                className="w-full bg-navy-950 border border-crema/20 px-3.5 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
              />
            </div>
          </div>

          {/* Contacto directo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1 font-semibold">
                Número de WhatsApp (con código de país)
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
                className="w-full bg-navy-950 border border-crema/20 px-3.5 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1 font-semibold">
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
                className="w-full bg-navy-950 border border-crema/20 px-3.5 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1 font-semibold">
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
                className="w-full bg-navy-950 border border-crema/20 px-3.5 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
              />
            </div>
          </div>

          {/* Bio / Descripción */}
          <div>
            <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1 font-semibold">
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
              className="w-full bg-navy-950 border border-crema/20 p-3 text-crema font-body text-xs focus:outline-none focus:border-dorado"
            />
          </div>
        </div>

        {/* ── BLOQUE 2: SERVICIOS QUE OFRECE ── */}
        <div className="p-8 bg-[#090E1C] border border-crema/10 space-y-6">
          <div className="flex items-center justify-between border-b border-crema/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">🛠️</span>
              <div>
                <h2 className="font-display text-xl text-crema font-semibold">
                  Servicios Ofrecidos en la Landing
                </h2>
                <p className="font-body text-xs text-crema/40">
                  Podés modificar títulos, descripciones o sumar nuevos servicios.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAgregarServicio}
              className="px-3.5 py-1.5 border border-dorado text-dorado font-body text-[11px] font-semibold tracking-wider uppercase hover:bg-dorado hover:text-tierra transition-all"
            >
              + Agregar Servicio
            </button>
          </div>

          <div className="space-y-4">
            {config.servicios.map((srv, idx) => (
              <div
                key={srv.id}
                className="p-5 bg-navy-950/70 border border-crema/10 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-body text-[10px] text-dorado tracking-wider uppercase font-semibold">
                    Servicio #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEliminarServicio(srv.id)}
                    className="text-red-400 hover:text-red-300 text-xs font-body uppercase tracking-wider"
                  >
                    Eliminar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5">
                    <label className="block font-body text-[9px] uppercase tracking-wider text-crema/50 mb-1">
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
                      className="w-full bg-navy-900 border border-crema/20 px-3 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                    />
                  </div>

                  <div className="sm:col-span-7">
                    <label className="block font-body text-[9px] uppercase tracking-wider text-crema/50 mb-1">
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
                      className="w-full bg-navy-900 border border-crema/20 px-3 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit final */}
        <div className="pt-4 flex justify-end gap-4">
          <button
            type="submit"
            disabled={guardando}
            className="px-8 py-3.5 bg-dorado text-tierra font-body text-xs font-bold tracking-wider uppercase hover:bg-dorado-light transition-all shadow-xl disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar Toda la Configuración"}
          </button>
        </div>
      </form>
    </div>
  );
}
