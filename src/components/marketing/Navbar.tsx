"use client";

import Link from "next/link";
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500`}
      style={
        scrolled
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
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center shrink-0 group">
          <motion.img
            src="/logoo.png"
            alt="Altum Inmobiliaria - Lotes en Neuquén"
            className="h-12 md:h-16 w-auto object-contain"
            style={{ mixBlendMode: "screen", filter: "brightness(1.05)" }}
            whileHover={{ filter: "brightness(1.2)" }}
            transition={{ duration: 0.2 }}
          />
        </Link>

        {/* ── Desktop nav ── */}
        <nav
          className="hidden lg:flex items-center gap-8"
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
                className="relative font-body text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 py-1"
                style={{
                  color: active
                    ? "#C9A84C"
                    : activeHover === l.href
                      ? "rgba(245,239,230,1)"
                      : "rgba(245,239,230,0.6)",
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
        <div className="hidden lg:flex items-center gap-5">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-crema/50 text-[11px] tracking-wider hover:text-[#25D366] transition-colors flex items-center gap-2 group"
          >
            <WaIcon />
            <span>WhatsApp</span>
          </a>
          <Link
            href="/contacto"
            className="btn-shimmer font-body text-tierra text-[11px] tracking-[0.12em] font-medium uppercase px-5 py-2.5 hover:scale-[1.03] transition-transform duration-200"
          >
            Consultar Ahora
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
            className="block w-6 h-px bg-crema origin-center"
            animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block w-6 h-px bg-crema"
            animate={open ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-6 h-px bg-crema origin-center"
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
              background: "rgba(8,14,26,0.97)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(201,168,76,0.1)",
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
                  className="border-b border-crema/[0.06] last:border-b-0"
                >
                  <Link
                    href={l.href}
                    className={`block font-body text-[11px] tracking-[0.25em] uppercase py-4 transition-colors ${
                      pathname === l.href
                        ? "text-dorado"
                        : "text-crema/60 hover:text-dorado"
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

function WaIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
