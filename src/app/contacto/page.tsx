import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import FormularioContacto from "@/components/marketing/FormularioContacto";
import { WHATSAPP_URL } from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://altumsci.com.ar";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactate con Altum Inmobiliaria. Asesores inmobiliarios en Cipoletti, Catriel y toda la región de Río Negro.",
  alternates: { canonical: `${siteUrl}/contacto` },
};

/* ── Datos de contacto ───────────────────────────────────────────────────── */

const WA_HREF =
  "https://wa.me/5492996095742?text=Hola%2C%20quisiera%20contactarme%20con%20Altum%20Inmobiliaria";

const contactInfo = [
  {
    icon: <LocationIcon />,
    label: "Cipoletti",
    value: "Cipoletti, Río Negro\nPatagonia Argentina",
    href: "https://maps.google.com/?q=Cipoletti,+Rio+Negro,+Argentina",
  },
  {
    icon: <LocationIcon />,
    label: "Catriel",
    value: "Catriel, Río Negro\nPatagonia Argentina",
    href: "https://maps.google.com/?q=Catriel,+Rio+Negro,+Argentina",
  },
  {
    icon: <EmailIcon />,
    label: "Email",
    value: "altumsci@gmail.com",
    href: "mailto:altumsci@gmail.com",
  },
];

/* ── Página ──────────────────────────────────────────────────────────────── */

export default function ContactoPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* ── Panel izquierdo - sticky, imagen + info ─────────────────────── */}
      <div className="relative lg:w-1/2 lg:sticky lg:top-0 lg:h-screen overflow-hidden">
        {/* Background */}
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
          alt="Patagonia - Altum Inmobiliaria"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />

        {/* Navy overlay - ALTUM brand */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(150deg, rgba(15,26,62,0.82) 0%, rgba(26,39,82,0.68) 45%, rgba(10,18,40,0.92) 100%)",
          }}
        />
        <div className="absolute inset-0 grain-overlay opacity-[0.04] mix-blend-overlay" />
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-dorado/20 to-transparent" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-10 lg:p-14 pt-36">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-10 bg-dorado" />
            <span className="eyebrow">Hablemos</span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-crema font-medium leading-[1.0] mb-5"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Tu <em className="not-italic italic text-dorado">propiedad</em>
            <br />
            en buenas manos
          </h1>

          <p className="font-body text-crema/40 text-[14px] leading-relaxed mb-10 max-w-xs">
            Respondemos todas las consultas. Sin compromiso, sin demoras.
          </p>

          {/* Info items */}
          <div className="space-y-5 mb-10">
            {contactInfo.map((c) => (
              <div key={c.label} className="flex items-start gap-4">
                <div className="w-9 h-9 border border-dorado/20 flex items-center justify-center text-dorado shrink-0">
                  {c.icon}
                </div>
                <div>
                  <p className="eyebrow text-crema/25 text-[9px] mb-0.5">
                    {c.label}
                  </p>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        c.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="font-body text-crema/55 text-[13px] hover:text-dorado transition-colors whitespace-pre-line"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="font-body text-crema/55 text-[13px] whitespace-pre-line">
                      {c.value}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* WhatsApp destacado */}
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 border border-dorado/20 flex items-center justify-center text-dorado shrink-0">
                <WaIconSm />
              </div>
              <div>
                <p className="eyebrow text-crema/25 text-[9px] mb-0.5">
                  WhatsApp
                </p>
                <a
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-crema/55 text-[13px] hover:text-[#25D366] transition-colors"
                >
                  +54 9 2996 09-5742
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA directo */}
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-3
              px-7 py-3.5 self-start
              bg-[#25D366] text-white
              font-body text-[11px] tracking-[0.15em] font-medium uppercase
              hover:bg-[#20bd5a] transition-colors duration-300
            "
          >
            <WaIconSm />
            Escribir por WhatsApp
          </a>

          <div className="mt-10 h-px bg-gradient-to-r from-dorado/30 to-transparent" />
        </div>
      </div>

      {/* ── Panel derecho - formulario ───────────────────────────────────── */}
      <div className="lg:w-1/2 bg-crema flex flex-col justify-center px-8 lg:px-16 py-28 lg:py-32 min-h-screen">
        <div className="max-w-lg w-full mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-10 bg-dorado" />
            <span className="eyebrow">Formulario</span>
          </div>

          <h2
            className="font-display text-tierra font-medium leading-[1.05] mb-3"
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              letterSpacing: "-0.02em",
            }}
          >
            ¿Tenés una{" "}
            <em className="not-italic italic text-dorado">consulta?</em>
          </h2>
          <Suspense
            fallback={
              <div className="p-8 text-tierra/40 font-body text-xs">
                Cargando formulario...
              </div>
            }
          >
            <FormularioContacto />
          </Suspense>

          {/* WhatsApp alternativo */}
          <div className="mt-10 pt-8 border-t border-arena">
            <p className="font-body text-tierra/35 text-[12px] mb-4 tracking-wide">
              ¿Preferís contacto directo?
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-3
                px-7 py-3.5
                bg-[#25D366] text-white
                font-body text-[11px] tracking-[0.15em] font-medium uppercase
                hover:bg-[#20bd5a] transition-colors duration-300
              "
            >
              <WaIconLg />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────────── */

function LocationIcon() {
  return (
    <svg
      className="w-4 h-4"
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
      className="w-4 h-4"
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

const WA_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

function WaIconSm() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d={WA_PATH} />
    </svg>
  );
}

function WaIconLg() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d={WA_PATH} />
    </svg>
  );
}
