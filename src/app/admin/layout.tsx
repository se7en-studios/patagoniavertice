"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Home,
  Inbox,
  Settings,
  ExternalLink,
  LogOut,
  Plus,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

interface PerfilData {
  nombre: string;
  matricula: string;
  foto: string;
}

// La foto institucional es una pieza gráfica cuadrada con logo y texto;
// para avatares chicos usamos el recorte del rostro.
const avatarDe = (foto: string) =>
  !foto || foto === "/estela.jpg" ? "/estela-avatar.jpg" : foto;

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/propiedades", label: "Propiedades & Lotes", icon: Home },
  { href: "/admin/leads", label: "Consultas & Leads", icon: Inbox },
  { href: "/admin/configuracion", label: "Perfil & Contenidos", icon: Settings },
];

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

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const actual = NAV.find((n) => isActive(n.href, n.exact)) ?? NAV[0];
  const hoy = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-[#060913] text-crema flex flex-col md:flex-row font-body selection:bg-dorado selection:text-tierra">
      {/* Glow ambiental */}
      <div
        className="pointer-events-none fixed inset-0 -z-0 opacity-60"
        style={{
          background:
            "radial-gradient(900px circle at 85% -10%, rgba(184,150,90,0.10), transparent 55%), radial-gradient(700px circle at 0% 100%, rgba(40,60,120,0.18), transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* ── Sidebar ── */}
      <aside className="relative z-10 w-full md:w-72 md:sticky md:top-0 md:h-screen bg-[#090E1C]/95 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/[0.06] flex flex-col shrink-0">
        {/* Marca */}
        <div className="px-6 h-20 flex items-center justify-between border-b border-white/[0.06]">
          <Link href="/admin" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logoo.png"
              alt="ALTUM SCI"
              className="h-9 w-auto object-contain"
              style={{ mixBlendMode: "screen", filter: "brightness(1.1)" }}
            />
            <div className="leading-tight">
              <span className="font-display font-semibold text-crema text-[15px] tracking-[0.12em] block">
                ALTUM <span className="text-dorado">SCI</span>
              </span>
              <span className="text-[9px] tracking-[0.28em] text-crema/35 uppercase block">
                Panel de gestión
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-crema/80 p-2 rounded-lg hover:bg-white/5"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={`flex-1 flex-col min-h-0 ${
            mobileMenuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Perfil */}
          <div className="p-4">
            <Link
              href="/admin/configuracion"
              className="group flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.07] hover:border-dorado/40 transition-colors"
            >
              <div className="relative shrink-0">
                <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-dorado/60 ring-offset-2 ring-offset-[#0B1122]">
                  <Image
                    src={avatarDe(perfil.foto)}
                    alt={perfil.nombre}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0B1122]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[13px] font-semibold text-crema truncate">
                  {perfil.nombre}
                </p>
                <p className="text-[10px] text-dorado/80 tracking-wider truncate uppercase">
                  {perfil.matricula}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-crema/25 group-hover:text-dorado transition-colors" />
            </Link>
          </div>

          {/* Navegación */}
          <nav className="flex-1 px-4 space-y-1">
            <p className="px-3 pb-2 text-[9px] tracking-[0.28em] uppercase text-crema/30">
              Gestión
            </p>
            {NAV.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                    active
                      ? "bg-dorado/[0.12] text-crema font-medium"
                      : "text-crema/55 hover:text-crema hover:bg-white/[0.04]"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-dorado" />
                  )}
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      active
                        ? "bg-dorado text-tierra shadow-[0_6px_16px_-6px_rgba(184,150,90,0.7)]"
                        : "bg-white/[0.04] text-crema/60"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Pie */}
          <div className="p-4 space-y-1 border-t border-white/[0.06]">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-crema/55 hover:text-dorado hover:bg-white/[0.04] transition-colors"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
              <span>Ver sitio web</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-red-300/60 hover:text-red-300 hover:bg-red-500/[0.08] transition-colors text-left"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.8} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-20 border-b border-white/[0.06] bg-[#060913]/75 backdrop-blur-xl px-6 lg:px-10 flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-crema/35">
              <span>ALTUM SCI</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-crema/70">{actual.label}</span>
            </div>
            <p className="text-[11px] text-crema/30 capitalize mt-0.5 hidden sm:block">
              {hoy}
            </p>
          </div>

          <Link
            href="/admin/propiedades?action=new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dorado text-tierra text-[12px] font-semibold hover:bg-dorado-light transition-all shadow-[0_10px_24px_-10px_rgba(184,150,90,0.8)] hover:-translate-y-px"
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            <span>Nueva propiedad</span>
          </Link>
        </header>

        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
