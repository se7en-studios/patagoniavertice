"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
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

  // Abrir modal si viene action=new o edit en URL
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
      imagenes: p.imagenes && p.imagenes.length > 0 ? p.imagenes : ["/mari-menuco/bahia-playas-1.jpg"],
      destacado: Boolean(p.destacado),
      publicado: p.publicado !== false,
    });
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const payload = {
        ...form,
        id: editingId || undefined,
        precio: form.precio ? Number(form.precio) : null,
        superficie_m2: form.superficie_m2 ? Number(form.superficie_m2) : null,
      };

      const res = await fetch("/api/admin/propiedades", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setNotification(editingId ? "Propiedad actualizada con éxito" : "Propiedad creada con éxito");
        setModalOpen(false);
        resetForm();
        router.replace("/admin/propiedades");
        cargarPropiedades();
        setTimeout(() => setNotification(null), 4000);
      } else {
        alert(data.error || "No se pudo guardar la propiedad");
      }
    } catch {
      alert("Error al conectar con el servidor");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id: string, titulo: string) => {
    if (!confirm(`¿Estás segura de eliminar la propiedad "${titulo}"?`)) return;

    try {
      const res = await fetch(`/api/admin/propiedades?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setNotification("Propiedad eliminada correctamente");
        cargarPropiedades();
        setTimeout(() => setNotification(null), 3000);
      } else {
        alert(data.error || "Error al eliminar");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  const handleToggleDestacado = async (p: Propiedad) => {
    try {
      await fetch("/api/admin/propiedades", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...p,
          destacado: !p.destacado,
        }),
      });
      cargarPropiedades();
    } catch {
      alert("Error al actualizar");
    }
  };

  const propiedadesFiltradas = useMemo(() => {
    return propiedades.filter((p) => {
      if (filtroTipo !== "todos" && p.tipo !== filtroTipo) return false;
      if (busqueda.trim() !== "") {
        const q = busqueda.toLowerCase();
        const coincideTitulo = p.titulo.toLowerCase().includes(q);
        const coincideCiudad = p.ciudad?.toLowerCase().includes(q);
        const coincideBarrio = p.barrio?.toLowerCase().includes(q);
        if (!coincideTitulo && !coincideCiudad && !coincideBarrio) return false;
      }
      return true;
    });
  }, [propiedades, filtroTipo, busqueda]);

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-crema/10 pb-6">
        <div>
          <span className="font-body text-dorado text-[10px] tracking-[0.25em] uppercase font-semibold">
            Catálogo de Inmuebles &amp; Lotes
          </span>
          <h1 className="font-display text-3xl font-medium text-crema mt-1">
            Gestión de Propiedades
          </h1>
          <p className="font-body text-crema/50 text-sm mt-0.5">
            Publicá, editá precios, características y visibilidad en la landing.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="px-6 py-3 bg-dorado text-tierra font-body text-xs font-bold tracking-wider uppercase hover:bg-dorado-light transition-all shadow-md self-start md:self-auto flex items-center gap-2"
        >
          <span>+</span>
          <span>Nueva Propiedad</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-body flex items-center gap-2">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#090E1C] border border-crema/10 flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Buscar por título, ciudad o barrio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-navy-950/80 border border-crema/15 px-3.5 py-2 text-crema font-body text-xs placeholder:text-crema/30 focus:outline-none focus:border-dorado transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "todos", label: "Todos" },
            { id: "lote", label: "Lotes" },
            { id: "venta", label: "Casas" },
            { id: "alquiler", label: "Alquileres" },
            { id: "desarrollo", label: "Inversión" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFiltroTipo(tab.id)}
              className={`px-3 py-1.5 text-[11px] font-body uppercase tracking-wider transition-colors ${
                filtroTipo === tab.id
                  ? "bg-dorado text-tierra font-bold"
                  : "bg-navy-950/60 text-crema/50 hover:text-crema hover:bg-navy-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="py-20 text-center text-crema/40 font-body text-sm">
          Cargando catálogo...
        </div>
      ) : propiedadesFiltradas.length === 0 ? (
        <div className="py-20 text-center text-crema/40 font-body text-sm border border-crema/10 bg-[#090E1C] p-8">
          No se encontraron propiedades con el filtro actual.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedadesFiltradas.map((p) => {
            const img =
              p.imagenes && p.imagenes.length > 0
                ? p.imagenes[0]
                : "/mari-menuco/bahia-playas-1.jpg";

            return (
              <div
                key={p.id}
                className="bg-[#090E1C] border border-crema/10 overflow-hidden flex flex-col justify-between group hover:border-dorado/40 transition-colors shadow-lg"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy-950">
                    <Image
                      src={img}
                      alt={p.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-1 bg-dorado text-tierra font-body text-[9px] font-bold tracking-wider uppercase">
                        {p.tipo || "lote"}
                      </span>
                      {p.destacado && (
                        <span className="px-2 py-0.5 bg-black/70 text-dorado border border-dorado/40 font-body text-[9px] tracking-wider uppercase">
                          ★ Portada
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <span className="font-display text-2xl font-bold text-dorado drop-shadow-md">
                        {p.precio
                          ? `${p.moneda || "USD"} ${p.precio.toLocaleString("es-AR")}`
                          : "Consultar"}
                      </span>
                      <span className="font-body text-[10px] text-crema/80 uppercase">
                        {p.superficie_m2 ? `${p.superficie_m2} m²` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Info Content */}
                  <div className="p-5 space-y-2.5">
                    <span className="font-body text-[10px] text-crema/40 uppercase tracking-widest block">
                      {p.barrio ? `${p.barrio}, ` : ""}
                      {p.ciudad}
                    </span>
                    <h3 className="font-display text-base font-semibold text-crema line-clamp-1 group-hover:text-dorado transition-colors">
                      {p.titulo}
                    </h3>
                    <p className="font-body text-xs text-crema/60 line-clamp-2 leading-relaxed">
                      {p.descripcion || "Sin descripción cargada."}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 border-t border-crema/10 bg-navy-950/60 flex items-center justify-between text-xs font-body">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleDestacado(p)}
                      title="Destacar en Home"
                      className={`text-xs px-2 py-1 rounded-sm border ${
                        p.destacado
                          ? "border-dorado text-dorado bg-dorado/10"
                          : "border-crema/10 text-crema/40 hover:text-crema"
                      }`}
                    >
                      {p.destacado ? "★ En Home" : "☆ Destacar"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        prefillForm(p);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-navy-900 border border-crema/20 text-crema hover:border-dorado hover:text-dorado text-[11px] font-semibold uppercase tracking-wider transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(p.id, p.titulo)}
                      className="px-2.5 py-1.5 text-red-400 hover:bg-red-950/40 text-[11px] tracking-wider uppercase transition-colors"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal Formulario Crear / Editar ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#080D1A] border border-dorado/40 p-6 md:p-8 my-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-crema/10 pb-4 mb-6">
              <div>
                <span className="font-body text-dorado text-[10px] tracking-widest uppercase font-semibold">
                  {editingId ? "Actualizar Inmueble" : "Nueva Publicación"}
                </span>
                <h2 className="font-display text-2xl text-crema font-medium mt-0.5">
                  {editingId ? "Editar Propiedad" : "Publicar Propiedad"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-crema/50 hover:text-crema text-lg p-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGuardar} className="space-y-5">
              {/* Título */}
              <div>
                <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1">
                  Título de la Propiedad *
                </label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Lote Frente al Lago · Bahía de las Playas"
                  className="w-full bg-navy-950 border border-crema/20 px-3.5 py-2.5 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                />
              </div>

              {/* Grid Tipo, Estado, Moneda, Precio */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1">
                    Tipo
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full bg-navy-950 border border-crema/20 px-3 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                  >
                    <option value="lote">Lote / Terreno</option>
                    <option value="venta">Casa / Residencia</option>
                    <option value="alquiler">Alquiler Corporativo</option>
                    <option value="desarrollo">Desarrollo / Inversión</option>
                    <option value="chacra">Chacra / Campo</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1">
                    Estado
                  </label>
                  <select
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                    className="w-full bg-navy-950 border border-crema/20 px-3 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="reservado">Reservado</option>
                    <option value="vendido">Vendido</option>
                    <option value="en_construccion">En Construcción</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1">
                    Moneda
                  </label>
                  <select
                    value={form.moneda}
                    onChange={(e) => setForm({ ...form, moneda: e.target.value })}
                    className="w-full bg-navy-950 border border-crema/20 px-3 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                  >
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                  </select>
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1">
                    Precio (Valor)
                  </label>
                  <input
                    type="number"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    placeholder="45000"
                    className="w-full bg-navy-950 border border-crema/20 px-3 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                  />
                </div>
              </div>

              {/* Superficie, Ciudad, Barrio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1">
                    Superficie (m²)
                  </label>
                  <input
                    type="number"
                    value={form.superficie_m2}
                    onChange={(e) => setForm({ ...form, superficie_m2: e.target.value })}
                    placeholder="1000"
                    className="w-full bg-navy-950 border border-crema/20 px-3 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                  />
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1">
                    Ciudad / Región
                  </label>
                  <input
                    type="text"
                    value={form.ciudad}
                    onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                    placeholder="Neuquén / Cipolletti / Catriel"
                    className="w-full bg-navy-950 border border-crema/20 px-3 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                  />
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1">
                    Barrio / Zona
                  </label>
                  <input
                    type="text"
                    value={form.barrio}
                    onChange={(e) => setForm({ ...form, barrio: e.target.value })}
                    placeholder="Bahía de las Playas / Los Tilos"
                    className="w-full bg-navy-950 border border-crema/20 px-3 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                  />
                </div>
              </div>

              {/* Selector de Foto / Galería */}
              <div>
                <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1">
                  Fotografía Principal
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {IMAGENES_DISPONIBLES.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setForm({ ...form, imagenes: [img.url] })}
                      className={`relative aspect-video border overflow-hidden transition-all ${
                        form.imagenes[0] === img.url
                          ? "border-dorado ring-2 ring-dorado"
                          : "border-crema/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img.url} alt={img.label} fill className="object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={form.imagenes[0] || ""}
                  onChange={(e) => setForm({ ...form, imagenes: [e.target.value] })}
                  placeholder="O ingresá una URL directa de imagen: https://..."
                  className="w-full bg-navy-950 border border-crema/20 px-3 py-2 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block font-body text-[10px] tracking-wider uppercase text-dorado mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Detalles sobre escrituración, bajada al lago, servicios, amenities..."
                  className="w-full bg-navy-950 border border-crema/20 p-3 text-crema font-body text-xs focus:outline-none focus:border-dorado"
                />
              </div>

              {/* Checkboxes Destacado y Publicado */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-body text-xs text-crema">
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                    className="accent-[#C9A84C] w-4 h-4 cursor-pointer"
                  />
                  <span>Mostrar como Destacado en Portada (Home)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-body text-xs text-crema">
                  <input
                    type="checkbox"
                    checked={form.publicado}
                    onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
                    className="accent-[#C9A84C] w-4 h-4 cursor-pointer"
                  />
                  <span>Visible al Público</span>
                </label>
              </div>

              {/* Botones de acción */}
              <div className="pt-4 border-t border-crema/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-crema/20 text-crema font-body text-xs uppercase tracking-wider hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-6 py-2.5 bg-dorado text-tierra font-body text-xs font-bold uppercase tracking-wider hover:bg-dorado-light transition-all shadow-md disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : editingId ? "Guardar Cambios" : "Publicar Inmueble"}
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
        <div className="p-8 text-[#A8B2C1] flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-dorado animate-ping" />
            <span className="font-serif italic text-sm">Cargando inventario ALTUM SCI...</span>
          </div>
        </div>
      }
    >
      <AdminPropiedadesContent />
    </Suspense>
  );
}
