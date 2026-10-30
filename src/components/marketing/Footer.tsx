"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowUp,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Catálogo de Propiedades" },
  { href: "/#sec-lago", label: "Lago Mari Menuco" },
  { href: "/#sec-servicios", label: "Propuesta & Servicios" },
  { href: "/#sec-tasador", label: "Tasador Express" },
  { href: "/nosotros", label: "Quiénes Somos" },
  { href: "/contacto", label: "Contacto" },
];

const serviceLinks = [
  { href: "/#sec-servicios", label: "Compra & Venta de Activos" },
  { href: "/#sec-lago", label: "Loteos en Bahía de las Playas" },
  { href: "/#sec-tasador", label: "Tasaciones Oficiales Mat. 35 RP" },
  { href: "/#sec-servicios", label: "Gestión de Alquiler Corporativo" },
  { href: "/#sec-calculadora", label: "Simulador de Rentabilidad USD" },
  { href: "/#sec-servicios", label: "Estructuración Legal & Contratos" },
];

const zonaLinks = [
  { href: "/#sec-lago", label: "Mari Menuco" },
  { href: "/inmobiliaria-cipoletti", label: "Cipolletti" },
  { href: "/inmobiliaria-catriel", label: "Catriel · Vaca Muerta" },
  { href: "/propiedades-rio-negro", label: "General Roca" },
  { href: "/proyectos", label: "Neuquén Capital" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-[#060C18] text-white border-t border-white/10">
      {/* Patrón arquitectónico minimalista de grilla sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />

      {/* Luz ambiental dorada superior */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px circle at 20% 0%, rgba(201,168,76,0.11), transparent 65%), radial-gradient(600px circle at 85% 90%, rgba(26,54,104,0.22), transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* Línea divisoria dorada */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.7) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-14 sm:pt-20 pb-28 md:pb-14">
        {/* ── 1. Cabecera Ejecutiva de Conversión ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 sm:p-8 lg:p-10 mb-14 lg:mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-dorado/15 border border-dorado/30 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-dorado">
                  Asesoría Patrimonial Directa · Sin Intermediarios
                </span>
              </div>

              <h3
                className="font-display font-medium text-white leading-[1.06]"
                style={{
                  fontSize: "clamp(1.75rem, 3.2vw, 2.6rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                ¿Listo para evaluar tu próxima operación en{" "}
                <em className="font-editorial italic text-dorado">Patagonia?</em>
              </h3>

              <div className="flex items-center gap-3 pt-1">
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-dorado/60 shrink-0">
                  <Image
                    src="/estela-avatar.jpg"
                    alt="Estela Mari Rojas"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-display text-sm font-medium text-white">
                    Estela Mari Rojas
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-white/55">
                    Martillera &amp; Corredora Pública · Mat. 35 RP 2026
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-dorado hover:bg-dorado-light text-tierra font-body text-xs font-semibold uppercase tracking-[0.15em] px-7 py-4 shadow-[0_14px_30px_-10px_rgba(201,168,76,0.5)] transition-all"
              >
                <span>Hablar por WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link
                href="/#sec-tasador"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] hover:border-dorado hover:text-dorado text-white font-body text-xs font-semibold uppercase tracking-[0.15em] px-6 py-4 transition-all"
              >
                <span>Solicitar Tasación</span>
              </Link>
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Volver arriba"
                className="hidden sm:inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/12 bg-white/[0.03] hover:border-dorado hover:text-dorado text-white/70 transition-colors"
                title="Volver arriba"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── 2. Grilla Arquitectónica de 4 Columnas ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Identidad & Respaldo Colegiado (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="rounded-2xl bg-white border border-dorado/45 px-3 py-2 shadow-md group-hover:border-dorado transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-altum-crop.png"
                  alt="ALTUM SCI"
                  className="h-10 sm:h-11 w-auto object-contain"
                />
              </div>
              <div>
                <span className="block font-display text-base font-semibold tracking-[0.14em] uppercase text-white">
                  ALTUM <span className="text-dorado">SCI</span>
                </span>
                <span className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/45">
                  Real Estate &amp; Consultoría
                </span>
              </div>
            </Link>

            <p className="font-body text-white/60 text-xs sm:text-sm leading-relaxed max-w-sm">
              Firma boutique especializada en terrenos frente al Lago Mari
              Menuco, residencias de categoría en Cipolletti y activos de renta
              corporativa en el corredor energético de Río Negro y Neuquén.
            </p>

            <div className="inline-flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
              <ShieldCheck className="w-4 h-4 text-dorado shrink-0" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/75">
                Colegio de Martilleros · Mat. 35 RP 2026
              </span>
            </div>
          </div>

          {/* Cols 2 y 3: Navegación + Servicios (5 cols, 2 columnas en móvil) */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:col-span-5">
            <div>
              <h4 className="font-mono text-dorado text-[10px] font-semibold tracking-[0.22em] uppercase mb-4">
                01 / Plataforma
              </h4>
              <nav className="flex flex-col gap-2.5">
                {navLinks.map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    className="group inline-flex items-center gap-1.5 font-body text-white/65 text-xs sm:text-sm hover:text-white transition-colors"
                  >
                    <span>{l.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 text-dorado transition-all" />
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="font-mono text-dorado text-[10px] font-semibold tracking-[0.22em] uppercase mb-4">
                02 / Soluciones
              </h4>
              <nav className="flex flex-col gap-2.5">
                {serviceLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="group inline-flex items-center gap-1.5 font-body text-white/65 text-xs sm:text-sm hover:text-white transition-colors"
                  >
                    <span>{l.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 text-dorado transition-all" />
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Col 4: Contacto Directo & Plazas (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-dorado text-[10px] font-semibold tracking-[0.22em] uppercase mb-4">
              03 / Contacto Directo
            </h4>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 hover:border-dorado/50 transition-colors"
            >
              <Phone className="w-4 h-4 text-dorado shrink-0" />
              <div className="min-w-0">
                <span className="block font-mono text-[9.5px] uppercase tracking-wider text-white/45">
                  WhatsApp Directo
                </span>
                <span className="font-body text-xs sm:text-sm font-medium text-white truncate block">
                  +54 9 299 609-5742
                </span>
              </div>
            </a>

            <a
              href="mailto:altumsci@gmail.com"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 hover:border-dorado/50 transition-colors"
            >
              <Mail className="w-4 h-4 text-dorado shrink-0" />
              <div className="min-w-0">
                <span className="block font-mono text-[9.5px] uppercase tracking-wider text-white/45">
                  Email Oficial
                </span>
                <span className="font-body text-xs sm:text-sm font-medium text-white truncate block">
                  altumsci@gmail.com
                </span>
              </div>
            </a>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
              <MapPin className="w-4 h-4 text-dorado shrink-0" />
              <div className="min-w-0">
                <span className="block font-mono text-[9.5px] uppercase tracking-wider text-white/45">
                  Operación Regional
                </span>
                <span className="font-body text-xs sm:text-sm font-medium text-white block">
                  Cipolletti &amp; Mari Menuco
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Barra de Cobertura Territorial ── */}
        <div className="py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
            Mercados Activos en Patagonia:
          </span>
          <div className="flex flex-wrap gap-2">
            {zonaLinks.map((z) => (
              <Link
                key={z.label}
                href={z.href}
                className="font-mono text-[10.5px] text-white/70 hover:text-dorado border border-white/10 hover:border-dorado/50 bg-white/[0.02] px-3 py-1 rounded-full transition-colors"
              >
                {z.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── 4. Créditos, Acceso Propietaria y Firma ── */}
        <div className="pt-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
          <p className="font-body text-white/50 text-xs">
            © {new Date().getFullYear()}{" "}
            <strong className="text-white/80 font-medium">ALTUM SCI</strong> ·
            Estela Mari Rojas (Mat. 35 RP 2026). Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-dorado/35 bg-dorado/10 px-3.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-dorado hover:bg-dorado hover:text-tierra transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-dorado animate-pulse" />
              <span>Panel Propietaria (CRM)</span>
            </Link>

            <a
              href="https://se7endev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-xs text-white/45 hover:text-white transition-all group"
            >
              <span>Desarrollado por</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/se7en-logo.png"
                alt="se7en studios"
                className="h-4 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Marca tipográfica monumental sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden text-center font-display font-semibold leading-[0.75] tracking-tight text-white/[0.028] pb-1"
      >
        <span style={{ fontSize: "clamp(3.2rem, 16vw, 13.5rem)" }}>
          ALTUM SCI
        </span>
      </div>
    </footer>
  );
}
