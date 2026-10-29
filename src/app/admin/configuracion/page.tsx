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
  LayoutTemplate,
  Waves,
  MapPin,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import {
  SiteConfig,
  ServicioConfig,
  ZonaConfig,
  FaqLandingItem,
  StatManifiesto,
  DEFAULT_SITE_CONFIG,
} from "@/lib/site-config";

type TabConfig = "portada" | "lago" | "perfil" | "servicios" | "faq";

export default function AdminConfiguracionPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [tab, setTab] = useState<TabConfig>("portada");
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
          setConfig({
            ...DEFAULT_SITE_CONFIG,
            ...data.data,
            hero: { ...DEFAULT_SITE_CONFIG.hero, ...(data.data.hero || {}) },
            bandaLago: {
              ...DEFAULT_SITE_CONFIG.bandaLago,
              ...(data.data.bandaLago || {}),
            },
            perfil: {
              ...DEFAULT_SITE_CONFIG.perfil,
              ...(data.data.perfil || {}),
            },
            statsManifiesto:
              Array.isArray(data.data.statsManifiesto) &&
              data.data.statsManifiesto.length > 0
                ? data.data.statsManifiesto
                : DEFAULT_SITE_CONFIG.statsManifiesto,
            servicios:
              Array.isArray(data.data.servicios) &&
              data.data.servicios.length > 0
                ? data.data.servicios
                : DEFAULT_SITE_CONFIG.servicios,
            zonas:
              Array.isArray(data.data.zonas) && data.data.zonas.length > 0
                ? data.data.zonas
                : DEFAULT_SITE_CONFIG.zonas,
            faqs:
              Array.isArray(data.data.faqs) && data.data.faqs.length > 0
                ? data.data.faqs
                : DEFAULT_SITE_CONFIG.faqs,
          });
        } else {
          setConfig(DEFAULT_SITE_CONFIG);
        }
      })
      .catch(() => setConfig(DEFAULT_SITE_CONFIG))
      .finally(() => setLoading(false));
  }, []);

  const handleGuardar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!config) return;

    setGuardando(true);
    setMensaje(null);

    try {
      try {
        localStorage.setItem("altum_site_config_v1", JSON.stringify(config));
      } catch {
        // ignore storage quota errors
      }

      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();
      if (data.success) {
        setMensaje({
          tipo: "exito",
          texto:
            "¡Todos los cambios de la Landing Page y Perfil fueron guardados y publicados!",
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

  const handleAgregarZona = () => {
    if (!config) return;
    const nuevaZona: ZonaConfig = {
      id: `zona-${Date.now()}`,
      nombre: "Nueva Zona Patagónica",
      provincia: "Neuquén",
      descripcion: "Descripción estratégica de la zona de operación.",
      destacado: "Alta proyección",
      tipoInversion: "Lotes y Residencial",
      activo: true,
    };
    setConfig({
      ...config,
      zonas: [...config.zonas, nuevaZona],
    });
  };

  const handleEliminarZona = (id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      zonas: config.zonas.filter((z) => z.id !== id),
    });
  };

  const handleAgregarFaq = () => {
    if (!config) return;
    const nuevaFaq: FaqLandingItem = {
      id: `faq-${Date.now()}`,
      pregunta: "¿Nueva pregunta frecuente sobre operatoria o lotes?",
      respuesta:
        "Respuesta detallada con el respaldo de Estela Mari Rojas (Mat. 35 RP 2026).",
    };
    setConfig({
      ...config,
      faqs: [...config.faqs, nuevaFaq],
    });
  };

  const handleEliminarFaq = (id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      faqs: config.faqs.filter((f) => f.id !== id),
    });
  };

  if (loading || !config) {
    return (
      <div className="py-20 text-center text-crema/40 text-sm">
        Cargando editor integral de la landing page...
      </div>
    );
  }

  const TABS: {
    id: TabConfig;
    label: string;
    sub: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: "portada",
      label: "Portada & Manifiesto",
      sub: "Hero principal y métricas",
      icon: LayoutTemplate,
    },
    {
      id: "lago",
      label: "Mari Menuco",
      sub: "Banda Lago y destacados",
      icon: Waves,
    },
    {
      id: "perfil",
      label: "Perfil Estela & Contacto",
      sub: "Foto, matrícula y WhatsApp",
      icon: User,
    },
    {
      id: "servicios",
      label: "Servicios & Zonas",
      sub: "Prestaciones y cobertura",
      icon: Briefcase,
    },
    {
      id: "faq",
      label: "Preguntas Frecuentes",
      sub: "Respuestas a clientes",
      icon: HelpCircle,
    },
  ];

  return (
    <div className="space-y-7 max-w-[1250px]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-dorado">
            CMS Inmobiliario · Control Total de Contenidos
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-crema mt-1">
            Editor de Landing Page &amp; Identidad
          </h1>
          <p className="text-sm text-crema/45 mt-1">
            Administrá todos los textos, cifras, zonas, preguntas frecuentes, servicios y datos de contacto del sitio público.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-medium text-crema/75 hover:border-dorado/40 hover:text-dorado transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Ver Landing en vivo</span>
          </a>
          <button
            type="button"
            onClick={() => handleGuardar()}
            disabled={guardando}
            className="inline-flex items-center gap-2 rounded-xl bg-dorado px-5 py-3 text-xs font-semibold text-tierra shadow-[0_10px_24px_-10px_rgba(184,150,90,0.8)] hover:bg-dorado-light transition-all hover:-translate-y-px disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{guardando ? "Guardando..." : "Guardar y Publicar Cambios"}</span>
          </button>
        </div>
      </div>

      {mensaje && (
        <div
          className={`flex items-center gap-2.5 rounded-2xl border p-4 text-xs font-medium ${
            mensaje.tipo === "exito"
              ? "border-emerald-500/40 bg-emerald-950/70 text-emerald-200"
              : "border-red-500/40 bg-red-950/70 text-red-200"
          }`}
        >
          {mensaje.tipo === "exito" ? (
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          )}
          <span>{mensaje.texto}</span>
        </div>
      )}

      {/* Barra de Pestañas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                active
                  ? "border-dorado/50 bg-dorado/12 text-crema shadow-[0_10px_24px_-14px_rgba(201,168,76,0.45)]"
                  : "border-white/[0.07] bg-[#0A1020] text-crema/65 hover:border-white/15 hover:text-crema"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  active
                    ? "bg-dorado text-tierra"
                    : "bg-white/[0.05] text-crema/60"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate">{t.label}</div>
                <div className="text-[10px] text-crema/40 truncate mt-0.5">
                  {t.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleGuardar} className="space-y-8">
        {/* ══════════════════════════════════════════════════════════════════
            TAB 1: PORTADA (HERO) & MANIFIESTO
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "portada" && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dorado/15 text-dorado">
                    <LayoutTemplate className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-xl text-crema font-medium">
                      Portada Principal (Hero de Inicio)
                    </h2>
                    <p className="text-xs text-crema/40">
                      Textos de bienvenida, etiqueta superior, llamada a la acción y lote destacado en portada.
                    </p>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 text-xs text-crema/75 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.hero.mostrarAnuncioTop}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero: {
                          ...config.hero,
                          mostrarAnuncioTop: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 rounded accent-[#C9A84C]"
                  />
                  <span>Mostrar insignia superior</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                    Etiqueta / Eyebrow Superior
                  </label>
                  <input
                    type="text"
                    value={config.hero.eyebrow}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero: { ...config.hero, eyebrow: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                    Texto de Anuncio / Destacado
                  </label>
                  <input
                    type="text"
                    value={config.hero.anuncioTop}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero: { ...config.hero, anuncioTop: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                    Título Principal (Línea 1)
                  </label>
                  <input
                    type="text"
                    value={config.hero.tituloPrincipal}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero: {
                          ...config.hero,
                          tituloPrincipal: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                    Título en Cursiva Dorada (Línea 2)
                  </label>
                  <input
                    type="text"
                    value={config.hero.tituloCursiva}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero: { ...config.hero, tituloCursiva: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                  Subtítulo Descriptivo de Portada
                </label>
                <textarea
                  rows={3}
                  value={config.hero.subtitulo}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      hero: { ...config.hero, subtitulo: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] p-3 text-xs leading-relaxed text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/[0.06]">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-crema/50 mb-1">
                    Texto Botón Principal
                  </label>
                  <input
                    type="text"
                    value={config.hero.ctaPrimario}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero: { ...config.hero, ctaPrimario: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-crema/50 mb-1">
                    Texto Botón Secundario
                  </label>
                  <input
                    type="text"
                    value={config.hero.ctaSecundario}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero: { ...config.hero, ctaSecundario: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-crema/50 mb-1">
                    Tarjeta Hero · Título
                  </label>
                  <input
                    type="text"
                    value={config.hero.loteDestacadoTitulo}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero: {
                          ...config.hero,
                          loteDestacadoTitulo: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-crema/50 mb-1">
                    Tarjeta Hero · Valor / Superficie
                  </label>
                  <input
                    type="text"
                    value={config.hero.loteDestacadoPrecio}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        hero: {
                          ...config.hero,
                          loteDestacadoPrecio: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Métricas del Manifiesto */}
            <section className="rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 lg:p-8 space-y-5">
              <div>
                <h2 className="font-display text-xl text-crema font-medium">
                  Indicadores de Respaldo (Sección Manifiesto)
                </h2>
                <p className="text-xs text-crema/40">
                  Cifras clave que aparecen debajo de la portada para reforzar autoridad institucional.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.statsManifiesto.map((st: StatManifiesto, idx: number) => (
                  <div
                    key={st.id}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3"
                  >
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-dorado">
                      Indicador #{idx + 1}
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-crema/45 mb-1">
                          Cifra / Valor
                        </label>
                        <input
                          type="text"
                          value={st.valor}
                          onChange={(e) => {
                            const next = [...config.statsManifiesto];
                            next[idx] = { ...next[idx], valor: e.target.value };
                            setConfig({ ...config, statsManifiesto: next });
                          }}
                          className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs font-semibold text-dorado focus:border-dorado/60 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] text-crema/45 mb-1">
                          Etiqueta Principal
                        </label>
                        <input
                          type="text"
                          value={st.etiqueta}
                          onChange={(e) => {
                            const next = [...config.statsManifiesto];
                            next[idx] = {
                              ...next[idx],
                              etiqueta: e.target.value,
                            };
                            setConfig({ ...config, statsManifiesto: next });
                          }}
                          className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-crema/45 mb-1">
                        Detalle secundario
                      </label>
                      <input
                        type="text"
                        value={st.detalle}
                        onChange={(e) => {
                          const next = [...config.statsManifiesto];
                          next[idx] = { ...next[idx], detalle: e.target.value };
                          setConfig({ ...config, statsManifiesto: next });
                        }}
                        className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema/80 focus:border-dorado/60 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 2: MARI MENUCO (BANDA LAGO)
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "lago" && (
          <section className="rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 lg:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dorado/15 text-dorado">
                <Waves className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl text-crema font-medium">
                  Sección Destacada · Lago Mari Menuco
                </h2>
                <p className="text-xs text-crema/40">
                  Personalizá la sección inmersiva del perilago, precios de referencia y llamada a la acción.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                  Etiqueta Superior
                </label>
                <input
                  type="text"
                  value={config.bandaLago.etiqueta}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      bandaLago: {
                        ...config.bandaLago,
                        etiqueta: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                  Título Principal
                </label>
                <input
                  type="text"
                  value={config.bandaLago.titulo}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      bandaLago: {
                        ...config.bandaLago,
                        titulo: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                  Destacado en Cursiva
                </label>
                <input
                  type="text"
                  value={config.bandaLago.tituloCursiva}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      bandaLago: {
                        ...config.bandaLago,
                        tituloCursiva: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                Descripción Comercial de Mari Menuco
              </label>
              <textarea
                rows={3}
                value={config.bandaLago.descripcion}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    bandaLago: {
                      ...config.bandaLago,
                      descripcion: e.target.value,
                    },
                  })
                }
                className="w-full rounded-xl border border-white/[0.08] bg-[#060913] p-3 text-xs leading-relaxed text-crema focus:border-dorado/60 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                  Precio / Referencia Visible
                </label>
                <input
                  type="text"
                  value={config.bandaLago.precioDesde}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      bandaLago: {
                        ...config.bandaLago,
                        precioDesde: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                  Superficie de Referencia
                </label>
                <input
                  type="text"
                  value={config.bandaLago.superficieRef}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      bandaLago: {
                        ...config.bandaLago,
                        superficieRef: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                  Distancia / Conectividad
                </label>
                <input
                  type="text"
                  value={config.bandaLago.distanciaRef}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      bandaLago: {
                        ...config.bandaLago,
                        distanciaRef: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 3: PERFIL DE ESTELA & CONTACTO
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "perfil" && (
          <section className="rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 lg:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dorado/15 text-dorado">
                <User className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl text-crema font-medium">
                  Perfil Profesional · Estela Mari Rojas
                </h2>
                <p className="text-xs text-crema/40">
                  Se actualiza automáticamente en la sección Nosotros, botones de WhatsApp y pie de página.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex flex-col items-center gap-3">
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
                  <span>Fotografía institucional</span>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                      Ruta de Foto
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
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                      Años de Trayectoria
                    </label>
                    <input
                      type="text"
                      value={config.perfil.aniosExperiencia || "+15"}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          perfil: {
                            ...config.perfil,
                            aniosExperiencia: e.target.value,
                          },
                        })
                      }
                      className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                      Operaciones / Asesorías
                    </label>
                    <input
                      type="text"
                      value={config.perfil.operacionesConcretadas || "+320"}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          perfil: {
                            ...config.perfil,
                            operacionesConcretadas: e.target.value,
                          },
                        })
                      }
                      className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

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
                  Colegio Profesional / Jurisdicción
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                  WhatsApp Directo (sin +)
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
                  Teléfono Visible
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                  Horario de Atención
                </label>
                <input
                  type="text"
                  value={config.perfil.horarioAtencion || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      perfil: {
                        ...config.perfil,
                        horarioAtencion: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                  Dirección / Base Operativa
                </label>
                <input
                  type="text"
                  value={config.perfil.direccionOficina || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      perfil: {
                        ...config.perfil,
                        direccionOficina: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1">
                Biografía Profesional (Sección Nosotros)
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
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 4: SERVICIOS & ZONAS DE COBERTURA
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "servicios" && (
          <div className="space-y-6">
            {/* Servicios */}
            <section className="rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dorado/15 text-dorado">
                    <Briefcase className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-xl text-crema font-medium">
                      Servicios Inmobiliarios Ofrecidos
                    </h2>
                    <p className="text-xs text-crema/40">
                      Podés editar títulos, descripciones, activar/pausar o sumar nuevos servicios.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAgregarServicio}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-dorado/40 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-dorado hover:bg-dorado hover:text-tierra transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Nuevo Servicio</span>
                </button>
              </div>

              <div className="space-y-3">
                {config.servicios.map((srv, idx) => (
                  <div
                    key={srv.id}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-dorado">
                          Servicio #{idx + 1}
                        </span>
                        <label className="inline-flex items-center gap-1.5 text-[11px] text-crema/65 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={srv.activo !== false}
                            onChange={(e) => {
                              const nuevos = [...config.servicios];
                              nuevos[idx] = {
                                ...nuevos[idx],
                                activo: e.target.checked,
                              };
                              setConfig({ ...config, servicios: nuevos });
                            }}
                            className="h-3.5 w-3.5 rounded accent-[#C9A84C]"
                          />
                          <span>Visible en web</span>
                        </label>
                      </div>
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
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] uppercase tracking-wider text-crema/45 mb-1">
                          Título
                        </label>
                        <input
                          type="text"
                          value={srv.titulo}
                          onChange={(e) => {
                            const nuevos = [...config.servicios];
                            nuevos[idx] = {
                              ...nuevos[idx],
                              titulo: e.target.value,
                            };
                            setConfig({ ...config, servicios: nuevos });
                          }}
                          className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-8">
                        <label className="block text-[10px] uppercase tracking-wider text-crema/45 mb-1">
                          Descripción
                        </label>
                        <input
                          type="text"
                          value={srv.descripcion}
                          onChange={(e) => {
                            const nuevos = [...config.servicios];
                            nuevos[idx] = {
                              ...nuevos[idx],
                              descripcion: e.target.value,
                            };
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

            {/* Zonas de cobertura */}
            <section className="rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dorado/15 text-dorado">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-xl text-crema font-medium">
                      Zonas Estratégicas de Cobertura
                    </h2>
                    <p className="text-xs text-crema/40">
                      Localidades donde opera ALTUM SCI (Mari Menuco, Cipolletti, Catriel, General Roca, etc.).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAgregarZona}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-dorado/40 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-dorado hover:bg-dorado hover:text-tierra transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Agregar Zona</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.zonas.map((z, idx) => (
                  <div
                    key={z.id}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-dorado">
                        Zona #{idx + 1} · {z.nombre}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleEliminarZona(z.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-red-400/70 hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-crema/45 mb-1">
                          Nombre Localidad
                        </label>
                        <input
                          type="text"
                          value={z.nombre}
                          onChange={(e) => {
                            const next = [...config.zonas];
                            next[idx] = { ...next[idx], nombre: e.target.value };
                            setConfig({ ...config, zonas: next });
                          }}
                          className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-crema/45 mb-1">
                          Provincia
                        </label>
                        <input
                          type="text"
                          value={z.provincia}
                          onChange={(e) => {
                            const next = [...config.zonas];
                            next[idx] = {
                              ...next[idx],
                              provincia: e.target.value,
                            };
                            setConfig({ ...config, zonas: next });
                          }}
                          className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-crema/45 mb-1">
                        Descripción de la plaza
                      </label>
                      <textarea
                        rows={2}
                        value={z.descripcion}
                        onChange={(e) => {
                          const next = [...config.zonas];
                          next[idx] = {
                            ...next[idx],
                            descripcion: e.target.value,
                          };
                          setConfig({ ...config, zonas: next });
                        }}
                        className="w-full rounded-xl border border-white/[0.08] bg-[#060913] p-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] text-crema/45 mb-1">
                          Diferencial / Destacado
                        </label>
                        <input
                          type="text"
                          value={z.destacado}
                          onChange={(e) => {
                            const next = [...config.zonas];
                            next[idx] = {
                              ...next[idx],
                              destacado: e.target.value,
                            };
                            setConfig({ ...config, zonas: next });
                          }}
                          className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-dorado focus:border-dorado/60 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-crema/45 mb-1">
                          Tipo de Inversión
                        </label>
                        <input
                          type="text"
                          value={z.tipoInversion}
                          onChange={(e) => {
                            const next = [...config.zonas];
                            next[idx] = {
                              ...next[idx],
                              tipoInversion: e.target.value,
                            };
                            setConfig({ ...config, zonas: next });
                          }}
                          className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TAB 5: PREGUNTAS FRECUENTES (FAQ)
        ══════════════════════════════════════════════════════════════════ */}
        {tab === "faq" && (
          <section className="rounded-3xl border border-white/[0.07] bg-[#0A1020] p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dorado/15 text-dorado">
                  <HelpCircle className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-xl text-crema font-medium">
                    Preguntas Frecuentes (FAQ) de la Landing
                  </h2>
                  <p className="text-xs text-crema/40">
                    Despejá dudas habituales sobre escrituración, expensas, financiación y visitas a Mari Menuco.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAgregarFaq}
                className="inline-flex items-center gap-1.5 rounded-xl border border-dorado/40 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-dorado hover:bg-dorado hover:text-tierra transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Nueva Pregunta</span>
              </button>
            </div>

            <div className="space-y-3">
              {config.faqs.map((faq, idx) => (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-dorado">
                      Pregunta Frecuente #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEliminarFaq(faq.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-red-400/70 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Eliminar</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-crema/45 mb-1">
                      Pregunta
                    </label>
                    <input
                      type="text"
                      value={faq.pregunta}
                      onChange={(e) => {
                        const next = [...config.faqs];
                        next[idx] = { ...next[idx], pregunta: e.target.value };
                        setConfig({ ...config, faqs: next });
                      }}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3.5 py-2 text-xs font-medium text-crema focus:border-dorado/60 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-crema/45 mb-1">
                      Respuesta Oficial
                    </label>
                    <textarea
                      rows={3}
                      value={faq.respuesta}
                      onChange={(e) => {
                        const next = [...config.faqs];
                        next[idx] = { ...next[idx], respuesta: e.target.value };
                        setConfig({ ...config, faqs: next });
                      }}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#060913] p-3 text-xs leading-relaxed text-crema/85 focus:border-dorado/60 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Submit final */}
        <div className="flex items-center justify-between rounded-2xl border border-dorado/25 bg-dorado/[0.06] px-5 py-4">
          <p className="text-xs text-crema/70">
            Recordá guardar tus cambios para que impacten inmediatamente en la web pública.
          </p>
          <button
            type="submit"
            disabled={guardando}
            className="inline-flex items-center gap-2 rounded-xl bg-dorado px-7 py-3 text-xs font-semibold text-tierra shadow-[0_10px_24px_-10px_rgba(184,150,90,0.8)] hover:bg-dorado-light transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{guardando ? "Guardando..." : "Guardar toda la configuración"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
