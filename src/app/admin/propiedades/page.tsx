"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Building2,
  Plus,
  Search,
  Star,
  Edit2,
  Trash2,
  MapPin,
  Check,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { Propiedad } from "@/lib/supabase/types";

const IMAGENES_DISPONIBLES = [
  { url: "/mari-menuco/bahia-playas-1.jpg", label: "Mari Menuco Playa 1" },
  { url: "/mari-menuco/bahia-playas-2.jpg", label: "Mari Menuco Lago 2" },
  { url: "/mari-menuco/bahia-playas-3.jpg", label: "Mari Menuco Lote 3" },
  { url: "/casa.avif", label: "Casa Contemporánea" },
  { url: "/bosque.avif", label: "Fracción / Chacra / Campo" },
  { url: "/noche.avif", label: "Departamento / Semipiso" },
];

function AdminPropiedadesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo: "lote",
    estado: "disponible",
    precio: "",
    moneda: "USD",
    superficie_m2: "",
    ciudad: "Neuquén",
    barrio: "Bahía de las Playas",
    ubicacion: "Barrio Privado Bahía de las Playas, Mari Menuco",
    imagenes: ["/mari-menuco/bahia-playas-1.jpg"],
    destacado: true,
    publicado: true,
  });

  const cargarPropiedades = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/propiedades");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPropiedades(data.data);
      }
    } catch (err) {
      console.error("Error al cargar propiedades", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPropiedades();
  }, []);

  useEffect(() => {
    const action = searchParams.get("action");
    const edit = searchParams.get("edit");

    if (action === "new") {
      resetForm();
      setModalOpen(true);
    } else if (edit && propiedades.length > 0) {
      const target = propiedades.find((p) => p.id === edit);
      if (target) {
        prefillForm(target);
        setModalOpen(true);
      }
    }
  }, [searchParams, propiedades]);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      titulo: "",
      descripcion: "",
      tipo: "lote",
      estado: "disponible",
      precio: "",
      moneda: "USD",
      superficie_m2: "",
      ciudad: "Neuquén",
      barrio: "Bahía de las Playas",
      ubicacion: "Barrio Privado Bahía de las Playas, Mari Menuco",
      imagenes: ["/mari-menuco/bahia-playas-1.jpg"],
      destacado: false,
      publicado: true,
    });
  };

  const prefillForm = (p: Propiedad) => {
    setEditingId(p.id);
    setForm({
      titulo: p.titulo || "",
      descripcion: p.descripcion || "",
      tipo: p.tipo || "lote",
      estado: p.estado || "disponible",
      precio: p.precio ? String(p.precio) : "",
      moneda: p.moneda || "USD",
      superficie_m2: p.superficie_m2 ? String(p.superficie_m2) : "",
      ciudad: p.ciudad || "Neuquén",
      barrio: p.barrio || "",
      ubicacion: p.ubicacion || "",
      imagenes:
        p.imagenes && p.imagenes.length > 0
          ? p.imagenes
          : ["/mari-menuco/bahia-playas-1.jpg"],
      destacado: Boolean(p.destacado),
      publicado: p.publicado !== false,
    });
  };

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const body = {
        id: editingId || undefined,
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        tipo: form.tipo,
        estado: form.estado,
        precio: form.precio ? parseFloat(form.precio) : null,
        moneda: form.moneda,
        superficie_m2: form.superficie_m2 ? parseFloat(form.superficie_m2) : null,
        ciudad: form.ciudad,
        barrio: form.barrio.trim() || null,
        ubicacion: form.ubicacion.trim() || null,
        imagenes: form.imagenes,
        destacado: form.destacado,
        publicado: form.publicado,
      };

      const res = await fetch("/api/admin/propiedades", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        notify(
          editingId
            ? "Propiedad actualizada correctamente"
            : "Propiedad creada y publicada con éxito"
        );
        setModalOpen(false);
        resetForm();
        cargarPropiedades();
        router.replace("/admin/propiedades");
      } else {
        alert(data.error || "Ocurrió un error al guardar");
      }
    } catch {
      alert("Error al conectar con el servidor");
    } finally {
      setGuardando(false);
    }
  };

  const handleToggleDestacado = async (p: Propiedad) => {
    const nuevoDestacado = !p.destacado;
    setPropiedades((prev) =>
      prev.map((item) =>
        item.id === p.id ? { ...item, destacado: nuevoDestacado } : item
      )
    );

    try {
      const res = await fetch("/api/admin/propiedades", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, destacado: nuevoDestacado }),
      });
      const data = await res.json();
      if (data.success) {
        notify(
          nuevoDestacado
            ? `"${p.titulo}" ahora aparece en Portada`
            : `"${p.titulo}" quitada de Portada`
        );
      }
    } catch {
      cargarPropiedades();
    }
  };

  const handleTogglePublicado = async (p: Propiedad) => {
    const nuevoPublicado = !p.publicado;
    setPropiedades((prev) =>
      prev.map((item) =>
        item.id === p.id ? { ...item, publicado: nuevoPublicado } : item
      )
    );

    try {
      const res = await fetch("/api/admin/propiedades", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, publicado: nuevoPublicado }),
      });
      const data = await res.json();
      if (data.success) {
        notify(
          nuevoPublicado
            ? `"${p.titulo}" ahora es pública en el sitio`
            : `"${p.titulo}" pausada (oculta del sitio)`
        );
      }
    } catch {
      cargarPropiedades();
    }
  };

  const handleEliminar = async (id: string, titulo: string) => {
    if (
      !confirm(
        `¿Confirmás la eliminación permanente de "${titulo}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setPropiedades((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/admin/propiedades?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        notify(`"${titulo}" fue eliminada.`);
      } else {
        alert(data.error || "No se pudo eliminar");
        cargarPropiedades();
      }
    } catch {
      alert("Error al eliminar");
      cargarPropiedades();
    }
  };

  const propiedadesFiltradas = useMemo(() => {
    return propiedades.filter((p) => {
      if (filtroTipo !== "todos" && p.tipo !== filtroTipo) return false;
      if (busqueda) {
        const q = busqueda.toLowerCase();
        const coincideTitulo = p.titulo?.toLowerCase().includes(q);
        const coincideCiudad = p.ciudad?.toLowerCase().includes(q);
        const coincideBarrio = p.barrio?.toLowerCase().includes(q);
        if (!coincideTitulo && !coincideCiudad && !coincideBarrio) return false;
      }
      return true;
    });
  }, [propiedades, filtroTipo, busqueda]);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-dorado">
            Catálogo &amp; Lotes
          </span>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-crema mt-1">
            Gestión de propiedades
          </h1>
          <p className="text-sm text-crema/45 mt-1">
            Publicá, editá precios, características y visibilidad en la landing.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 self-start md:self-auto rounded-xl bg-dorado px-5 py-3 text-[12px] font-semibold text-tierra shadow-[0_10px_24px_-10px_rgba(184,150,90,0.8)] hover:bg-dorado-light transition-all hover:-translate-y-px"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          <span>Nueva propiedad</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/70 p-4 text-xs font-medium text-emerald-200">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-[#0A1020] p-2">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: "todos", label: "Todas" },
            { id: "lote", label: "Lotes" },
            { id: "venta", label: "Casas" },
            { id: "alquiler", label: "Alquileres" },
            { id: "desarrollo", label: "Inversión" },
          ].map((tab) => {
            const active = filtroTipo === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFiltroTipo(tab.id)}
                className={`rounded-xl px-4 py-2 text-[12px] transition-colors ${
                  active
                    ? "bg-white/[0.08] text-crema font-medium"
                    : "text-crema/50 hover:text-crema hover:bg-white/[0.03]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <label className="relative block lg:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-crema/30" />
          <input
            type="text"
            placeholder="Buscar por título, ciudad o barrio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-xl border border-white/[0.07] bg-[#060913] py-2.5 pl-9 pr-3 text-[13px] text-crema placeholder:text-crema/30 focus:border-dorado/60 focus:outline-none"
          />
        </label>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-96 rounded-3xl bg-white/[0.03] animate-pulse"
            />
          ))}
        </div>
      ) : propiedadesFiltradas.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 py-20 text-center">
          <Building2 className="mx-auto h-9 w-9 text-crema/25" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-crema/50">
            No se encontraron propiedades con el filtro actual.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedadesFiltradas.map((p) => {
            const img =
              p.imagenes && p.imagenes.length > 0
                ? p.imagenes[0]
                : "/mari-menuco/bahia-playas-1.jpg";

            return (
              <article
                key={p.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0A1020] hover:border-dorado/40 transition-all duration-300 shadow-lg"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy-950">
                    <Image
                      src={img}
                      alt={p.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1020] via-black/30 to-black/30" />

                    {/* Top tags */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-dorado px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-tierra shadow-md">
                        {p.tipo || "lote"}
                      </span>
                      {p.destacado && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-black/75 backdrop-blur-md px-2 py-1 text-[10px] font-medium tracking-wider text-dorado border border-dorado/40">
                          <Star className="h-3 w-3 fill-dorado" />
                          Portada
                        </span>
                      )}
                    </div>

                    {/* Visibility status top right */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublicado(p)}
                      title={p.publicado ? "Visible en la web" : "Oculta de la web"}
                      className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium backdrop-blur-md transition-colors ${
                        p.publicado
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                          : "bg-black/80 text-crema/40 border border-white/10"
                      }`}
                    >
                      {p.publicado ? (
                        <>
                          <Eye className="h-3 w-3" />
                          <span>Pública</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          <span>Pausada</span>
                        </>
                      )}
                    </button>

                    {/* Price bottom */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <span className="font-display text-2xl font-bold text-crema drop-shadow-md">
                        {p.precio
                          ? `${p.moneda || "USD"} ${p.precio.toLocaleString("es-AR")}`
                          : "Consultar"}
                      </span>
                      {p.superficie_m2 && (
                        <span className="text-[11px] font-medium text-crema/70 backdrop-blur-sm bg-black/40 px-2 py-0.5 rounded-md">
                          {p.superficie_m2} m²
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-crema/45">
                      <MapPin className="h-3.5 w-3.5 text-dorado/70 shrink-0" />
                      <span className="truncate">
                        {p.barrio ? `${p.barrio}, ` : ""}
                        {p.ciudad}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-semibold text-crema group-hover:text-dorado transition-colors line-clamp-1">
                      {p.titulo}
                    </h3>

                    <p className="text-xs text-crema/55 line-clamp-2 leading-relaxed">
                      {p.descripcion || "Sin descripción cargada."}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 border-t border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleDestacado(p)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-colors ${
                      p.destacado
                        ? "bg-dorado/20 text-dorado border border-dorado/40"
                        : "text-crema/40 hover:text-crema hover:bg-white/[0.04]"
                    }`}
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${p.destacado ? "fill-dorado" : ""}`}
                    />
                    <span>{p.destacado ? "En portada" : "Destacar"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        prefillForm(p);
                        setModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-crema/80 hover:border-dorado hover:text-dorado transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleEliminar(p.id, p.titulo)}
                      className="rounded-xl border border-transparent p-1.5 text-red-400/60 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      title="Eliminar propiedad"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Modal Formulario Crear / Editar ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-white/[0.1] bg-[#0A1020] p-6 md:p-8 my-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-dorado">
                  {editingId ? "Actualizar Inmueble" : "Nueva Publicación"}
                </span>
                <h2 className="font-display text-2xl text-crema font-medium mt-1">
                  {editingId ? "Editar Propiedad" : "Publicar Propiedad"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-2 text-crema/40 hover:text-crema hover:bg-white/[0.06]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="space-y-5">
              {/* Título */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-dorado mb-1.5">
                  Título de la Propiedad *
                </label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Lote Frente al Lago · Bahía de las Playas"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-4 py-2.5 text-sm text-crema placeholder:text-crema/30 focus:border-dorado/60 focus:outline-none"
                />
              </div>

              {/* Grid Tipo, Estado, Moneda, Precio */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Tipo
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    <option value="lote">Lote / Terreno</option>
                    <option value="venta">Casa / Residencia</option>
                    <option value="alquiler">Alquiler Corporativo</option>
                    <option value="desarrollo">Desarrollo / Inversión</option>
                    <option value="chacra">Chacra / Campo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Estado
                  </label>
                  <select
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="reservado">Reservado</option>
                    <option value="vendido">Vendido</option>
                    <option value="en_construccion">En Construcción</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Moneda
                  </label>
                  <select
                    value={form.moneda}
                    onChange={(e) => setForm({ ...form, moneda: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Precio Numérico
                  </label>
                  <input
                    type="number"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    placeholder="Ej: 48000"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Superficie, Ciudad, Barrio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Superficie m²
                  </label>
                  <input
                    type="number"
                    value={form.superficie_m2}
                    onChange={(e) =>
                      setForm({ ...form, superficie_m2: e.target.value })
                    }
                    placeholder="Ej: 1000"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Ciudad
                  </label>
                  <select
                    value={form.ciudad}
                    onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  >
                    <option value="Neuquén">Neuquén (Mari Menuco)</option>
                    <option value="Cipolletti">Cipolletti</option>
                    <option value="Catriel">Catriel</option>
                    <option value="General Roca">General Roca</option>
                    <option value="Añelo">Añelo (Vaca Muerta)</option>
                    <option value="Bariloche">Bariloche & Cordillera</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                    Barrio / Zona
                  </label>
                  <input
                    type="text"
                    value={form.barrio}
                    onChange={(e) => setForm({ ...form, barrio: e.target.value })}
                    placeholder="Ej: Bahía de las Playas"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060913] px-3 py-2.5 text-xs text-crema focus:border-dorado/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Selector de Fotografía */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1.5">
                  Fotografía de Portada
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {IMAGENES_DISPONIBLES.map((img) => {
                    const isSelected = form.imagenes.includes(img.url);
                    return (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setForm({ ...form, imagenes: [img.url] })}
                        className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? "border-dorado ring-2 ring-dorado/40 scale-105"
                            : "border-white/10 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.label}
                          fill
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-crema/50 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  placeholder="Detalles sobre escrituración, bajada náutica, servicios o comodidades..."
                  className="w-full rounded-xl border border-white/[0.08] bg-[#060913] p-3 text-xs text-crema placeholder:text-crema/30 focus:border-dorado/60 focus:outline-none"
                />
              </div>

              {/* Checkboxes: Destacado & Publicado */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-crema/80">
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={(e) =>
                      setForm({ ...form, destacado: e.target.checked })
                    }
                    className="accent-dorado w-4 h-4 rounded"
                  />
                  <span>Destacar en Portada (Home)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-crema/80">
                  <input
                    type="checkbox"
                    checked={form.publicado}
                    onChange={(e) =>
                      setForm({ ...form, publicado: e.target.checked })
                    }
                    className="accent-dorado w-4 h-4 rounded"
                  />
                  <span>Publicar en la web inmediatamente</span>
                </label>
              </div>

              {/* Botones de acción */}
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
                  disabled={guardando}
                  className="rounded-xl bg-dorado px-6 py-2.5 text-xs font-semibold text-tierra hover:bg-dorado-light transition-all disabled:opacity-50"
                >
                  {guardando
                    ? "Guardando..."
                    : editingId
                    ? "Actualizar Propiedad"
                    : "Publicar Propiedad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPropiedadesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-crema/40 text-sm">
          Cargando catálogo...
        </div>
      }
    >
      <AdminPropiedadesContent />
    </Suspense>
  );
}
