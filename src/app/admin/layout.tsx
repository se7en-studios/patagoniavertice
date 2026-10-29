"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

interface PerfilData {
  nombre: string;
  matricula: string;
  foto: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [perfil, setPerfil] = useState<PerfilData>({
    nombre: "Estela Mari Rojas",
    matricula: "Mat. 35 RP 2026",
    foto: "/estela.jpg",
  });

  useEffect(() => {
    // Cargar perfil dinámico de la propietaria
    fetch("/api/admin/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.perfil) {
          setPerfil({
            nombre: data.data.perfil.nombre,
            matricula: data.data.perfil.matricula,
            foto: data.data.perfil.foto || "/estela.jpg",
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch {
      router.push("/auth/login");
    }
  };

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: "📊",
      active: pathname === "/admin",
    },
    {
      href: "/admin/propiedades",
      label: "Propiedades & Lotes",
      icon: "🏡",
      active: pathname.startsWith("/admin/propiedades"),
    },
    {
      href: "/admin/leads",
      label: "Consultas & Leads",
      icon: "📋",
      active: pathname.startsWith("/admin/leads"),
    },
    {
      href: "/admin/configuracion",
      label: "Perfil & Contenidos",
      icon: "⚙️",
      active: pathname.startsWith("/admin/configuracion"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#060913] text-crema flex flex-col md:flex-row font-body selection:bg-dorado selection:text-tierra">
      {/* ── Sidebar Desktop ── */}
      <aside className="w-full md:w-72 bg-[#090E1C] border-r border-dorado/20 flex flex-col shrink-0 md:min-h-screen">
        {/* Brand header */}
        <div className="p-6 border-b border-crema/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <img
              src="/logoo.png"
              alt="ALTUM SCI"
              className="h-10 w-auto object-contain"
              style={{ mixBlendMode: "screen", filter: "brightness(1.1)" }}
            />
            <div>
              <span className="font-display font-semibold text-crema text-sm tracking-wider block">
                ALTUM <span className="text-dorado">SCI</span>
              </span>
              <span className="font-body text-[9px] tracking-widest text-crema/40 uppercase block">
                Panel de Control
              </span>
            </div>
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-crema p-2"
            aria-label="Abrir menú móvil"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Profile Card de Estela */}
        <div className="p-5 border-b border-crema/10 bg-navy-950/60">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-dorado/50 shrink-0">
              <Image
                src={perfil.foto}
                alt={perfil.nombre}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-display text-xs font-semibold text-crema truncate">
                {perfil.nombre}
              </h4>
              <p className="font-body text-[10px] text-dorado/80 tracking-wider truncate uppercase">
                {perfil.matricula}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-body text-[9px] text-crema/40 uppercase">
                  En línea
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          className={`flex-1 p-4 space-y-1.5 ${
            mobileMenuOpen ? "block" : "hidden md:block"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-xs tracking-wider uppercase transition-all rounded-sm ${
                item.active
                  ? "bg-dorado text-tierra font-bold shadow-md"
                  : "text-crema/60 hover:text-crema hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="pt-6 mt-6 border-t border-crema/10 space-y-1.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-2.5 text-xs tracking-wider uppercase text-crema/50 hover:text-dorado transition-colors"
            >
              <span>🌐</span>
              <span>Ver Sitio Web</span>
              <span className="ml-auto text-[10px]">↗</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs tracking-wider uppercase text-red-400/70 hover:text-red-400 hover:bg-red-950/20 transition-all rounded-sm text-left"
            >
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header bar */}
        <header className="h-16 border-b border-crema/10 bg-[#080D1A]/80 backdrop-blur-md px-6 lg:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-dorado text-xs">✦</span>
            <span className="font-body text-xs uppercase tracking-widest text-crema/50">
              Sistema de Gestión Inmobiliaria ALTUM SCI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/propiedades?action=new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-dorado text-tierra font-body text-[11px] font-bold tracking-wider uppercase hover:bg-dorado-light transition-all shadow-sm rounded-sm"
            >
              <span>+</span>
              <span>Nueva Propiedad</span>
            </Link>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
