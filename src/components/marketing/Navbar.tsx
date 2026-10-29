"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { WHATSAPP_URL } from "@/lib/constants";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Propiedades" },
  { href: "/servicios", label: "Servicios" },
  { href: "/#tasador-express", label: "Tasaciones" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 40;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || pathname !== "/";
  const light = pathname === "/";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={
        solid && light
          ? {
              background: "rgba(255,255,255,0.94)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(201,168,76,0.22)",
              boxShadow: "0 10px 30px -15px rgba(14,26,51,0.12)",
            }
          : solid
            ? {
                background: "rgba(8,14,26,0.94)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(201,168,76,0.18)",
                boxShadow: "0 10px 30px -15px rgba(0,0,0,0.45)",
              }
            : {
                background:
                  "linear-gradient(to bottom, rgba(246,248,251,0.85) 0%, rgba(246,248,251,0) 100%)",
              }
      }
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between h-16 md:h-20">
        {/* ── Logo & Brand ── */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="flex items-center justify-center rounded-2xl bg-[#0B1528] px-3 py-1.5 border border-dorado/40 shadow-[0_6px_18px_-6px_rgba(14,26,51,0.35)] group-hover:border-dorado transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logoo.png"
              alt="ALTUM SCI - Servicios y Consultoría Inmobiliaria"
              className="h-8 md:h-10 w-auto object-contain"
              style={{
                mixBlendMode: "screen",
                filter: "brightness(1.12)",
              }}
            />
          </div>
          <div className="hidden xl:flex flex-col pl-1">
            <span
              className={`font-display ${
                light ? "text-navy" : "text-crema"
              } text-sm font-semibold tracking-[0.15em] uppercase leading-tight group-hover:text-[#8A6A1B] transition-colors`}
            >
              ALTUM <span className="text-[#A47C1B]">SCI</span>
            </span>
            <span
              className={`font-body text-[9px] tracking-[0.2em] uppercase ${
                light ? "text-navy/55" : "text-crema/50"
              }`}
            >
              Mat. 35 RP 2026
            </span>
          </div>
        </Link>

        {/* ── Desktop nav ── */}
        <nav
          className="hidden lg:flex items-center gap-5 xl:gap-7"
          aria-label="Navegación principal"
        >
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => setActiveHover(l.href)}
                onMouseLeave={() => setActiveHover(null)}
                className="relative font-body text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-200 py-1.5"
                style={{
                  color: active
                    ? light
                      ? "#8A6A1B"
                      : "#C9A84C"
                    : activeHover === l.href
                      ? light
                        ? "rgba(15,27,51,1)"
                        : "rgba(245,239,230,1)"
                      : light
                        ? "rgba(15,27,51,0.72)"
                        : "rgba(245,239,230,0.72)",
                }}
              >
                {l.label}
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-[1.5px]"
                  style={{ background: "#C9A84C", transformOrigin: "left" }}
                  animate={{
                    scaleX: active || activeHover === l.href ? 1 : 0,
                  }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                />
              </Link>
            );
          })}
        </nav>

        {/* ── Right: CTA ── */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-body ${
              light
                ? "text-navy border-dorado/35 bg-white hover:bg-[#FBF0CF]/40 shadow-sm"
                : "text-crema border-crema/20 bg-white/5 hover:bg-white/10"
            } text-[11px] tracking-wider hover:border-dorado transition-all flex items-center gap-2.5 px-3.5 py-1.5 border rounded-full`}
          >
            <div className="relative shrink-0">
              <div className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-dorado">
                <Image
                  src="/estela-avatar.jpg"
                  alt="Estela Mari Rojas"
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>
            <span className="font-semibold">WhatsApp con Estela</span>
          </a>
          <Link
            href="/#tasador-express"
            className="btn-shimmer rounded-full font-body text-tierra text-[11px] tracking-[0.14em] font-semibold uppercase px-5 py-2.5 hover:scale-[1.02] transition-transform duration-200 shadow-md"
          >
            ✦ Tasar Inmueble
          </Link>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl border ${
            light
              ? "border-navy/15 bg-white/90 text-navy"
              : "border-white/15 bg-white/5 text-crema"
          } gap-1.5`}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <motion.span
            className={`block w-5 h-[1.5px] ${light ? "bg-navy" : "bg-crema"} origin-center`}
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className={`block w-5 h-[1.5px] ${light ? "bg-navy" : "bg-crema"}`}
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className={`block w-5 h-[1.5px] ${light ? "bg-navy" : "bg-crema"} origin-center`}
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden"
            style={{
              background: light
                ? "rgba(255,255,255,0.98)"
                : "rgba(8,14,26,0.98)",
              borderBottom: light
                ? "1px solid rgba(14,26,51,0.08)"
                : "1px solid rgba(201,168,76,0.15)",
            }}
          >
            <nav
              className="flex flex-col gap-0 px-6 py-4"
              aria-label="Menú móvil"
            >
              {links.map((l) => (
                <div
                  key={l.href}
                  className={`border-b ${
                    light ? "border-navy/[0.07]" : "border-crema/[0.06]"
                  } last:border-b-0`}
                >
                  <Link
                    href={l.href}
                    className={`block font-body text-xs tracking-[0.22em] uppercase py-3.5 font-medium transition-colors ${
                      pathname === l.href
                        ? light
                          ? "text-[#8A6A1B]"
                          : "text-dorado"
                        : light
                          ? "text-navy/75 hover:text-[#8A6A1B]"
                          : "text-crema/70 hover:text-dorado"
                    }`}
                  >
                    {l.label}
                  </Link>
                </div>
              ))}
              <div className="pt-4 pb-2 space-y-2.5">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2.5 rounded-full border py-3 px-5 font-body text-xs tracking-wider font-semibold ${
                    light
                      ? "border-dorado/45 bg-[#FBF0CF]/40 text-navy"
                      : "border-crema/20 bg-white/5 text-crema"
                  }`}
                >
                  <div className="relative w-5 h-5 rounded-full overflow-hidden ring-1 ring-dorado">
                    <Image
                      src="/estela-avatar.jpg"
                      alt="Estela Mari Rojas"
                      fill
                      sizes="20px"
                      className="object-cover"
                    />
                  </div>
                  <span>Hablar con Estela por WhatsApp</span>
                </a>
                <Link
                  href="/#tasador-express"
                  className="btn-shimmer block rounded-full font-body text-tierra text-xs tracking-[0.14em] font-semibold uppercase px-5 py-3 text-center shadow-md"
                >
                  ✦ Tasar Inmueble
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
