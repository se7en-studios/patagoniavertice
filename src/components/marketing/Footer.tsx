"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { WHATSAPP_URL } from "@/lib/constants";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Propiedades & Lotes" },
  { href: "/#sec-lago", label: "Lago Mari Menuco" },
  { href: "/#sec-tasador", label: "Tasación Oficial" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

const serviceLinks = [
  { href: "/servicios", label: "Compra & Venta" },
  { href: "/#sec-lago", label: "Loteos en Mari Menuco" },
  { href: "/#sec-tasador", label: "Tasaciones Mat. 35 RP" },
  { href: "/servicios", label: "Alquiler Corporativo" },
  { href: "/servicios", label: "Consultoría & Contratos" },
  { href: "/#sec-calculadora", label: "Calculadora ROI" },
];

const zonaLinks = [
  { href: "/#sec-lago", label: "Lago Mari Menuco" },
  { href: "/inmobiliaria-cipoletti", label: "Cipolletti" },
  { href: "/inmobiliaria-catriel", label: "Catriel · Vaca Muerta" },
  { href: "/propiedades-rio-negro", label: "General Roca" },
  { href: "/propiedades-rio-negro", label: "Río Negro & Neuquén" },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const markY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["35%", "0%"],
  );
  const markOpacity = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden bg-[#080F1E] text-crema border-t border-dorado/25"
    >
      {/* Resplandor ambiental dorado sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-75"
        style={{
          background:
            "radial-gradient(650px circle at 15% 0%, rgba(201,168,76,0.12), transparent 60%), radial-gradient(600px circle at 90% 85%, rgba(28,56,110,0.22), transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* Línea superior dorada brillante */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.85) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-28 md:pb-12">
        {/* ── Banner Institucional Rápido (Ideal en Celular y Desktop) ── */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent p-5 sm:p-7 mb-10 sm:mb-14 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden ring-2 ring-dorado/60 shrink-0 shadow-lg">
                <Image
                  src="/estela-avatar.jpg"
                  alt="Estela Mari Rojas - Martillera y Corredora Pública"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-dorado/15 border border-dorado/35 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-dorado">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Atención Directa de Titular
                </span>
                <h3 className="font-display text-lg sm:text-xl font-medium text-crema mt-1 truncate">
                  Estela Mari Rojas
                </h3>
                <p className="font-body text-xs text-crema/65 leading-snug">
                  Martillera y Corredora Pública Colegiada ·{" "}
                  <strong className="text-dorado font-medium">
                    Mat. 35 RP 2026
                  </strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full lg:w-auto">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-body text-xs font-semibold uppercase tracking-[0.14em] px-5 py-3.5 shadow-[0_10px_25px_-10px_rgba(37,211,102,0.7)] transition-all active:scale-[0.99]"
              >
                <WaIconSm />
                <span>WhatsApp Directo</span>
              </a>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-dorado/45 bg-dorado/10 hover:bg-dorado hover:text-tierra text-dorado font-body text-xs font-semibold uppercase tracking-[0.14em] px-5 py-3.5 transition-all active:scale-[0.99]"
              >
                <span>Solicitar Tasación</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Grilla Principal del Footer ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Columna 1: Marca & Respaldo Legal (4 cols en desktop) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logoo.png"
                alt="ALTUM SCI - Servicios & Consultoría Inmobiliaria"
                className="h-14 sm:h-16 w-auto object-contain"
                style={{
                  mixBlendMode: "screen",
                  filter: "brightness(1.12)",
                }}
              />
            </Link>

            <p className="font-body text-crema/65 text-xs sm:text-sm leading-relaxed mb-4 max-w-sm">
              <strong className="text-crema font-medium">ALTUM SCI</strong> ·
              Servicios &amp; Consultoría Inmobiliaria. Especialistas en loteos
              frente al Lago Mari Menuco, residencias en Cipolletti y activos
              corporativos en Río Negro y Neuquén con máxima seguridad jurídica.
            </p>

            <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-[11px] text-dorado/90 tracking-[0.14em] uppercase">
              <span>Neuquén · Río Negro · Patagonia</span>
            </div>
          </div>

          {/* Columnas 2 y 3 agrupadas en 2 columnas en celular para lectura compacta */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:col-span-5">
            {/* Navegación */}
            <div>
              <h4 className="font-body text-dorado text-[11px] font-semibold tracking-[0.22em] uppercase mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-dorado" />
                Explorar
              </h4>
              <nav className="flex flex-col gap-2.5">
                {navLinks.map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    className="footer-link self-start font-body text-crema/70 text-xs sm:text-sm hover:text-dorado transition-colors py-0.5"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Servicios */}
            <div>
              <h4 className="font-body text-dorado text-[11px] font-semibold tracking-[0.22em] uppercase mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-dorado" />
                Servicios
              </h4>
              <nav className="flex flex-col gap-2.5">
                {serviceLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="footer-link self-start font-body text-crema/70 text-xs sm:text-sm hover:text-dorado transition-colors py-0.5"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Columna 4: Contacto Directo Tarjetas Táctiles (3 cols en desktop) */}
          <div className="lg:col-span-3">
            <h4 className="font-body text-dorado text-[11px] font-semibold tracking-[0.22em] uppercase mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-dorado" />
              Canales Oficiales
            </h4>

            <div className="flex flex-col gap-2.5 font-body text-xs sm:text-sm mb-5">
              {/* WhatsApp / Teléfono */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-crema/80 hover:border-dorado/50 hover:text-dorado transition-all"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-dorado/15 text-dorado">
                  <WaIcon />
                </span>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider text-crema/45">
                    WhatsApp &amp; Teléfono
                  </span>
                  <span className="font-medium text-crema truncate block">
                    +54 9 299 609-5742
                  </span>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:altumsci@gmail.com"
                className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-crema/80 hover:border-dorado/50 hover:text-dorado transition-all"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-dorado/15 text-dorado">
                  <EmailIcon />
                </span>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider text-crema/45">
                    Correo Electrónico
                  </span>
                  <span className="font-medium text-crema truncate block">
                    altumsci@gmail.com
                  </span>
                </div>
              </a>

              {/* Ubicación */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-crema/80">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-dorado/15 text-dorado">
                  <LocationIcon />
                </span>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider text-crema/45">
                    Base Operativa
                  </span>
                  <span className="font-medium text-crema block">
                    Cipolletti &amp; Lago Mari Menuco
                  </span>
                </div>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="flex items-center gap-2.5">
              <SocialLink
                href="https://instagram.com/altumsci"
                label="Instagram Altum SCI"
              >
                <InstagramIcon />
              </SocialLink>
              <SocialLink
                href="https://linkedin.com/company/altum-sdi"
                label="LinkedIn Altum SCI"
              >
                <LinkedInIcon />
              </SocialLink>
              <SocialLink
                href={WHATSAPP_URL}
                label="WhatsApp Altum SCI"
              >
                <WaIconSm />
              </SocialLink>
            </div>
          </div>
        </div>

        {/* ── Zonas que cubrimos (Pills desplazables o wrap limpio en móvil) ── */}
        <div className="border-t border-white/10 pt-7 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="font-body text-dorado text-[10px] font-semibold tracking-[0.24em] uppercase shrink-0">
              Plazas &amp; Cobertura Territorial
            </h4>
            <div className="flex flex-wrap gap-2">
              {zonaLinks.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className="font-body text-crema/75 text-xs tracking-wide rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-1.5 hover:border-dorado/60 hover:bg-dorado/10 hover:text-dorado transition-all"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Barra Inferior Legal & Créditos (Optimizada para Celular) ── */}
        <div className="border-t border-white/10 pt-6 flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
          <p className="font-body text-crema/60 text-xs leading-relaxed max-w-xl">
            © {new Date().getFullYear()} <strong className="text-crema/85">ALTUM SCI</strong> · Servicios &amp; Consultoría Inmobiliaria · Martillera Estela Mari Rojas (Mat. 35 RP 2026). Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <Link
              href="/contacto"
              className="font-body text-crema/65 text-xs hover:text-dorado transition-colors"
            >
              Contacto
            </Link>

            <span className="text-white/15 select-none">•</span>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-dorado/35 bg-dorado/10 px-3.5 py-1.5 font-body text-xs font-medium text-dorado hover:bg-dorado hover:text-tierra transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-dorado animate-pulse" />
              <span>Acceso Propietaria (CRM)</span>
            </Link>

            <span className="hidden sm:inline text-white/15 select-none">•</span>

            <a
              href="https://se7endev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-xs text-crema/55 hover:text-crema transition-all group"
            >
              <span>Hecho por</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/se7en-logo.png"
                alt="se7en studios"
                className="h-4 w-auto object-contain inline-block opacity-85 group-hover:opacity-100 group-hover:brightness-110 transition-all"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Marca de agua gigante inferior */}
      <motion.div
        aria-hidden="true"
        style={{ y: markY, opacity: markOpacity }}
        className="pointer-events-none select-none overflow-hidden text-center font-display font-semibold leading-[0.78] tracking-tight text-white/[0.035] pb-2"
      >
        <span style={{ fontSize: "clamp(3.2rem, 18vw, 15rem)" }}>
          ALTUM SCI
        </span>
      </motion.div>
    </footer>
  );
}

/* ── Icon helpers ───────────────────────────────────────────────────────── */

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/12 bg-white/[0.03] text-crema/70 hover:border-dorado hover:bg-dorado hover:text-tierra transition-all duration-200"
    >
      {children}
    </a>
  );
}

function LocationIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function WaIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
      <WaPath />
    </svg>
  );
}

function WaIconSm() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <WaPath />
    </svg>
  );
}

function WaPath() {
  return (
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
