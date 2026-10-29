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
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // En la home el navbar arranca transparente sobre el hero; en el resto de las páginas siempre va sólido.
  const solid = scrolled || pathname !== "/";
  // La home va en tema claro; el resto de las páginas sigue oscuro.
  const light = pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500`}
      style={
        solid && light
          ? {
              background: "rgba(246,248,251,0.82)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              borderBottom: "1px solid rgba(14,26,51,0.08)",
              boxShadow: "0 4px 30px rgba(14,26,51,0.08)",
            }
          : solid
          ? {
              background: "rgba(8,14,26,0.82)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              borderBottom: "1px solid rgba(201,168,76,0.15)",
              boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
            }
          : {
              background: "transparent",
            }
      }
    >
      {/* Gold progress line on scroll */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-dorado/60 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0, opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ transformOrigin: "left" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 md:h-20">
        {/* ── Logo & Brand ── */}
        <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
          <motion.img
            src="/logoo.png"
            alt="ALTUM SCI - Servicios y Consultoría Inmobiliaria"
            className="h-11 md:h-14 w-auto object-contain"
            style={light ? undefined : { mixBlendMode: "screen", filter: "brightness(1.08)" }}
            whileHover={{ filter: "brightness(1.2)" }}
            transition={{ duration: 0.2 }}
          />
          <div className="hidden 2xl:flex flex-col border-l border-dorado/25 pl-3 py-0.5">
            <span className={`font-display ${light ? "text-navy" : "text-crema"} text-xs md:text-sm font-semibold tracking-[0.16em] uppercase group-hover:text-dorado transition-colors`}>
              ALTUM <span className="text-dorado">SCI</span>
            </span>
            <span className="hidden font-body text-[9px] tracking-[0.22em] text-crema/45 uppercase">
              Servicios &amp; Consultoría Inmobiliaria
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
                className="relative font-body text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 py-1"
                style={{
                  color: active
                    ? light ? "#8A6A1B" : "#C9A84C"
                    : activeHover === l.href
                      ? light ? "rgba(15,27,51,1)" : "rgba(245,239,230,1)"
                      : light ? "rgba(15,27,51,0.65)" : "rgba(245,239,230,0.65)",
                }}
              >
                {l.label}
                {/* Animated underline */}
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: "#C9A84C", transformOrigin: "left" }}
                  animate={{ scaleX: active || activeHover === l.href ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                />
              </Link>
            );
          })}
        </nav>

        {/* ── Right: CTA ── */}
        <div className="hidden lg:flex items-center gap-3.5">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-body ${
              light
                ? "text-navy/80 border-navy/15 bg-white/75 shadow-sm"
                : "text-crema/70 border-crema/10"
            } text-[11px] tracking-wider hover:text-dorado transition-colors flex items-center gap-2 group px-3.5 py-1.5 border hover:border-dorado/60 rounded-full`}
          >
            <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-dorado/60">
              <Image
                src="/estela-avatar.jpg"
                alt="Estela Mari Rojas"
                fill
                sizes="20px"
                className="object-cover"
              />
            </div>
            <span className="font-medium">WhatsApp con Estela</span>
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
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <motion.span
            className={`block w-6 h-px ${light ? "bg-navy" : "bg-crema"} origin-center`}
            animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className={`block w-6 h-px ${light ? "bg-navy" : "bg-crema"}`}
            animate={open ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className={`block w-6 h-px ${light ? "bg-navy" : "bg-crema"} origin-center`}
            animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden"
            style={{
              background: light ? "rgba(246,248,251,0.98)" : "rgba(8,14,26,0.97)",
              backdropFilter: "blur(20px)",
              borderBottom: light
                ? "1px solid rgba(14,26,51,0.08)"
                : "1px solid rgba(201,168,76,0.1)",
            }}
          >
            <nav
              className="flex flex-col gap-0 px-6 py-4"
              aria-label="Menú móvil"
            >
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.06,
                    duration: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`border-b ${light ? "border-navy/[0.08]" : "border-crema/[0.06]"} last:border-b-0`}
                >
                  <Link
                    href={l.href}
                    className={`block font-body text-[11px] tracking-[0.25em] uppercase py-4 transition-colors ${
                      pathname === l.href
                        ? light ? "text-[#8A6A1B]" : "text-dorado"
                        : light ? "text-navy/70 hover:text-[#8A6A1B]" : "text-crema/60 hover:text-dorado"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: links.length * 0.06 + 0.05,
                  duration: 0.25,
                }}
                className="pt-4 pb-2"
              >
                <Link
                  href="/contacto"
                  className="btn-shimmer block font-body text-tierra text-[11px] tracking-[0.12em] font-medium uppercase px-5 py-3 text-center"
                >
                  Consultar Ahora
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


