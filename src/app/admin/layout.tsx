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
  Users,
  CalendarDays,
  CheckSquare,
  Globe,
} from "lucide-react";
import { useCRM } from "@/lib/use-crm";

interface PerfilData {
  nombre: string;
  matricula: string;
  foto: string;
}

const avatarDe = (foto: string) =>
  !foto || foto === "/estela.jpg" ? "/estela-avatar.jpg" : foto;

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  exact?: boolean;
}

const NAV_GROUPS: { titulo: string; items: NavItem[] }[] = [
  {
    titulo: "General",
    items: [
      {
        href: "/admin",
        label: "Dashboard 360°",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    titulo: "CRM Comercial",
    items: [
      { href: "/admin/clientes", label: "Clientes & Cartera", icon: Users },
      { href: "/admin/leads", label: "Consultas & Pipeline", icon: Inbox },
      {
        href: "/admin/calendario",
        label: "Calendario & Visitas",
        icon: CalendarDays,
      },
      {
        href: "/admin/tareas",
        label: "Tareas & Pendientes",
        icon: CheckSquare,
      },
    ],
  },
  {
    titulo: "Catálogo & Web",
    items: [
      {
        href: "/admin/propiedades",
        label: "Propiedades & Lotes",
        icon: Home,
      },
      {
        href: "/admin/configuracion",
        label: "Editor de Landing",
        icon: Globe,
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { tareas, eventos, clientes } = useCRM();

  const [perfil, setPerfil] = useState<PerfilData>({
    nombre: "Estela Mari Rojas",
    matricula: "Mat. 35 RP 2026",
    foto: "/estela.jpg",
  });

  useEffect(() => {
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

  const allItems = NAV_GROUPS.flatMap((g) => g.items);
  const actual =
    allItems.find((n) => isActive(n.href, n.exact)) ?? allItems[0];

  const hoyISO = new Date().toISOString().split("T")[0];
  const tareasPendientes = tareas.filter(
    (t) => t.estado !== "completada",
  ).length;
  const eventosHoy = eventos.filter(
    (e) => e.fecha === hoyISO && e.estado !== "cancelado",
  ).length;

  const badgeCount = (href: string): number | null => {
    if (href === "/admin/tareas") return tareasPendientes || null;
    if (href === "/admin/calendario") return eventosHoy || null;
    if (href === "/admin/clientes") return clientes.length || null;
    return null;
  };

  const hoy = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-[#060913] text-crema flex flex-col md:flex-row font-body selection:bg-dorado selection:text-tierra cursor-default">
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
      <aside className="relative z-20 w-full md:w-72 md:sticky md:top-0 md:h-screen bg-[#090E1C]/95 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/[0.06] flex flex-col shrink-0">
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
              <span className="text-[9px] tracking-[0.24em] text-crema/40 uppercase block">
                CRM &amp; Gestión Web
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-crema/80 p-2 rounded-lg hover:bg-white/5"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        <div
          className={`flex-1 flex-col min-h-0 overflow-y-auto ${
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
              <Settings className="h-4 w-4 text-crema/25 group-hover:text-dorado transition-colors" />
            </Link>
          </div>

          {/* Navegación agrupada */}
          <nav className="flex-1 px-4 space-y-5 pb-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.titulo} className="space-y-1">
                <p className="px-3 pb-1 text-[9px] tracking-[0.28em] uppercase text-crema/30 font-semibold">
                  {group.titulo}
                </p>
                {group.items.map(({ href, label, icon: Icon, exact }) => {
                  const active = isActive(href, exact);
                  const badge = badgeCount(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                        active
                          ? "bg-dorado/[0.12] text-crema font-medium"
                          : "text-crema/55 hover:text-crema hover:bg-white/[0.04]"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-dorado" />
                      )}
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            active
                              ? "bg-dorado text-tierra shadow-[0_6px_16px_-6px_rgba(184,150,90,0.7)]"
                              : "bg-white/[0.04] text-crema/60"
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.8} />
                        </span>
                        <span className="truncate">{label}</span>
                      </div>

                      {badge !== null && (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ${
                            active
                              ? "bg-dorado text-tierra"
                              : "bg-white/[0.07] text-crema/65"
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Pie */}
          <div className="p-4 space-y-1 border-t border-white/[0.06]">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-crema/55 hover:text-dorado hover:bg-white/[0.04] transition-colors"
            >
              <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
              <span>Ver sitio web en vivo</span>
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
        <header className="sticky top-0 z-20 h-20 border-b border-white/[0.06] bg-[#060913]/80 backdrop-blur-xl px-6 lg:px-10 flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-crema/35">
              <span>ALTUM SCI · CRM</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-crema/80 font-medium">{actual.label}</span>
            </div>
            <p className="text-[11px] text-crema/35 capitalize mt-0.5 hidden sm:block">
              {hoy}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/tareas?action=new"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-crema/80 text-[11px] font-medium hover:border-dorado/50 hover:text-dorado transition-colors"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span>+ Pendiente</span>
            </Link>
            <Link
              href="/admin/calendario?action=new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-crema/80 text-[11px] font-medium hover:border-dorado/50 hover:text-dorado transition-colors"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>+ Agendar visita</span>
            </Link>
            <Link
              href="/admin/propiedades?action=new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dorado text-tierra text-[12px] font-semibold hover:bg-dorado-light transition-all shadow-[0_10px_24px_-10px_rgba(184,150,90,0.8)] hover:-translate-y-px"
            >
              <Plus className="h-4 w-4" strokeWidth={2.2} />
              <span>Nueva propiedad</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
