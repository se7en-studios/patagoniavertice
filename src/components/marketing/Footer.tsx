"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { WHATSAPP_URL } from "@/lib/constants";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Propiedades" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

const serviceLinks = [
  { href: "/servicios", label: "Venta" },
  { href: "/servicios", label: "Alquiler" },
  { href: "/servicios", label: "Consultoría" },
  { href: "/servicios", label: "Contratos" },
];

const zonaLinks = [
  { href: "/inmobiliaria-cipoletti", label: "Cipolletti" },
  { href: "/inmobiliaria-catriel", label: "Catriel" },
  { href: "/propiedades-rio-negro", label: "General Roca" },
  { href: "/propiedades-rio-negro", label: "Río Negro" },
];

export default function Footer() {
  const light = usePathname() === "/";
  const t = (c: string) => tone(light, c);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const markY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["45%", "0%"]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <footer ref={ref} style={{ background: light ? "#EAF0F7" : "#0D1628" }} className={t("text-crema")}>
      {/* Top gold accent line */}
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, #C9A84C, transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <img
                src="/logoo.png"
                alt="ALTUM SCI - Servicios & Consultoría Inmobiliaria"
                className="h-16 md:h-24 w-auto object-contain"
                style={light ? undefined : { mixBlendMode: "screen", filter: "brightness(1.05)" }}
              />
            </Link>
            <p className={t("font-body text-crema/50 text-sm leading-relaxed mb-4")}>
              <strong>ALTUM SCI</strong> · Servicios &amp; Consultoría Inmobiliaria. Liderado por <strong>Estela Mari Rojas</strong> (Martillera &amp; Corredora Colegiada Mat. 35 RP 2026). Operaciones con seguridad jurídica y notarial en Neuquén y Río Negro.
            </p>
            <p className={t("font-body text-dorado/70 text-[11px] tracking-[0.18em] uppercase")}>
              Neuquén · Río Negro · Patagonia
            </p>
          </div>

          {/* ── Navegación ── */}
          <div>
            <h4 className={t("font-body text-dorado text-[11px] tracking-[0.25em] uppercase mb-6")}>
              Navegación
            </h4>
            <nav className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className={t("footer-link self-start font-body text-crema/65 text-sm hover:text-dorado transition-colors duration-200")}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Servicios ── */}
          <div>
            <h4 className={t("font-body text-dorado text-[11px] tracking-[0.25em] uppercase mb-6")}>
              Servicios
            </h4>
            <nav className="flex flex-col gap-3">
              {serviceLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className={t("footer-link self-start font-body text-crema/65 text-sm hover:text-dorado transition-colors duration-200")}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Contacto ── */}
          <div>
            <h4 className={t("font-body text-dorado text-[11px] tracking-[0.25em] uppercase mb-6")}>
              Contacto
            </h4>

            <div className={t("flex flex-col gap-4 font-body text-crema/65 text-sm mb-7")}>
              {/* Dirección */}
              <div className="flex items-start gap-3">
                <LocationIcon />
                <span>
                  Cipolletti,
                  <br />
                  Patagonia Argentina
                </span>
              </div>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={t("flex items-center gap-3 hover:text-dorado transition-colors duration-200")}
              >
                <WaIcon />
                +54 9 2996 09-5742
              </a>

              {/* Email */}
              <a
                href="mailto:altumsci@gmail.com"
                className={t("flex items-center gap-3 hover:text-dorado transition-colors duration-200")}
              >
                <EmailIcon />
                altumsci@gmail.com
              </a>
            </div>

            {/* Redes sociales */}
            <div className="flex items-center gap-2">
              <SocialLink
                light={light}
                href="https://instagram.com/altumsci"
                label="Instagram Altum Inmobiliaria"
              >
                <InstagramIcon />
              </SocialLink>
              <SocialLink
                light={light}
                href="https://linkedin.com/company/altum-sdi"
                label="LinkedIn Altum Inmobiliaria"
              >
                <LinkedInIcon />
              </SocialLink>
              <SocialLink
                light={light}
                href={WHATSAPP_URL}
                label="WhatsApp Altum Inmobiliaria"
              >
                <WaIconSm />
              </SocialLink>
            </div>
          </div>
        </div>

        {/* ── Zonas que cubrimos ── */}
        <div className={t("border-t border-crema/8 pt-10 pb-2 mb-6")}>
          <h4 className={t("font-body text-dorado text-[11px] tracking-[0.25em] uppercase mb-4")}>
            Zonas que cubrimos
          </h4>
          <div className="flex flex-wrap gap-2">
            {zonaLinks.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className={t("font-body text-crema/65 text-xs tracking-wide border border-crema/10 px-3.5 py-1.5 hover:border-dorado/50 hover:text-dorado transition-colors duration-200") + (light ? " rounded-full bg-white" : "")}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className={t("border-t border-crema/8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4")}>
          <p className={t("font-body text-crema/60 text-xs tracking-wider")}>
            © 2026 ALTUM SCI · Servicios &amp; Consultoría Inmobiliaria · Mat. 35 RP 2026. Todos los derechos reservados.
          </p>

          <div className={t("flex items-center gap-2 font-body text-xs tracking-wider text-crema/55")}>
            <span>Hecho por</span>
            <a
              href="https://se7endev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-all duration-200 group"
            >
              <img
                src="/se7en-logo.png"
                alt="se7en studios"
                className="h-4.5 w-auto object-contain inline-block group-hover:brightness-110 transition-all duration-200"
              />
            </a>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/contacto"
              className={t("footer-link font-body text-crema/55 text-xs tracking-wider hover:text-dorado transition-colors duration-200")}
            >
              Contacto
            </Link>
            <span className={t("text-crema/10 select-none")}>·</span>
            <Link
              href="/admin"
              className={t("font-body text-crema/55 text-xs tracking-wider hover:text-dorado transition-colors duration-200 flex items-center gap-1.5")}
            >
              <span className={t("w-1.5 h-1.5 rounded-full bg-dorado/60 inline-block")} />
              Acceso Propietaria
            </Link>
            <span className={t("text-crema/10 select-none")}>·</span>
            <span className={t("font-body text-crema/15 text-xs tracking-wider")}>
              Río Negro, Argentina
            </span>
          </div>
        </div>
      </div>

      {light && (
        <motion.div
          aria-hidden="true"
          style={{ y: markY, opacity: markOpacity }}
          className="select-none overflow-hidden text-center font-display font-semibold leading-[0.8] tracking-tight text-navy/[0.06]"
        >
          <span style={{ fontSize: "clamp(4rem, 19vw, 16rem)" }}>ALTUM SCI</span>
        </motion.div>
      )}
    </footer>
  );
}

// Clases oscuras → claras. Solo se aplica en la home (light); el resto del sitio sigue oscuro.
function tone(light: boolean, cls: string) {
  if (!light) return cls;
  return cls
    .replace(/bg-navy-950\/\d+/g, "bg-white/95")
    .replace(/bg-navy-900\/\d+/g, "bg-white")
    .replace(/border-crema\/\d+/g, "border-navy/10")
    .replace(/text-crema\/(\d+)/g, (_, n) => `text-navy/${Math.max(Number(n), 60)}`)
    .replace(/text-crema(?![\w/])/g, "text-navy")
    .replace(/(hover:)?text-dorado(\/\d+)?/g, "$1text-[#8A6A1B]");
}

/* ── Icon helpers ───────────────────────────────────────────────────────── */

function SocialLink({
  href,
  label,
  light,
  children,
}: {
  href: string;
  light: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={tone(light, "w-8 h-8 flex items-center justify-center border border-crema/10 text-crema/55 hover:border-dorado/50 hover:text-dorado transition-all duration-200") + (light ? " rounded-full bg-white" : "")}
    >
      {children}
    </a>
  );
}

function LocationIcon() {
  return (
    <svg
      className="w-4 h-4 text-dorado/60 mt-0.5 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      className="w-4 h-4 text-dorado/60 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function WaIcon() {
  return (
    <svg
      className="w-4 h-4 text-dorado/60 shrink-0 fill-current"
      viewBox="0 0 24 24"
    >
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
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
