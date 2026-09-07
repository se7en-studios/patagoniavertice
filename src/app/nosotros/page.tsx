import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Eye, Handshake, Shield, Star, Lightbulb, Users } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://altumsci.com.ar";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conocé la historia y valores de Altum Inmobiliaria, consultora especializada en operaciones de alto nivel en Río Negro y la Patagonia.",
  alternates: { canonical: `${siteUrl}/nosotros` },
};

const valores = [
  {
    icon: Eye,
    titulo: "Visión",
    descripcion:
      "Anticipamos las necesidades del mercado patagónico y actuamos antes que nadie.",
  },
  {
    icon: Handshake,
    titulo: "Compromiso",
    descripcion:
      "Cumplimos lo prometido en cada etapa, desde la preventa hasta la entrega.",
  },
  {
    icon: Shield,
    titulo: "Confianza",
    descripcion:
      "Construimos relaciones sólidas con inversores, clientes y comunidades.",
  },
  {
    icon: Star,
    titulo: "Excelencia",
    descripcion:
      "Estándares de calidad que superan las expectativas del mercado regional.",
  },
  {
    icon: Lightbulb,
    titulo: "Innovación",
    descripcion:
      "Incorporamos tecnología y diseño contemporáneo en cada proyecto.",
  },
  {
    icon: Users,
    titulo: "Equipo",
    descripcion:
      "Un grupo humano comprometido con el desarrollo de la Patagonia.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative bg-tierra pt-40 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=60"
            alt="Patagonia Inmobiliaria"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(28,26,23,0.6), rgba(28,26,23,0.95))",
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-10 bg-dorado" />
            <span className="font-body text-dorado text-[11px] tracking-[0.3em] uppercase">
              Altum Inmobiliaria
            </span>
          </div>
          <h1
            className="font-display text-crema font-medium leading-[1.05] mb-6 max-w-3xl"
            style={{
              fontSize: "clamp(3rem, 6vw, 5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Quiénes <span className="italic text-dorado">somos</span>
          </h1>
          <p className="font-body text-crema/40 text-base leading-relaxed max-w-xl">
            Somos una consultora inmobiliaria especializada en operaciones de
            alto nivel en Río Negro y la Patagonia. Servicio directo,
            transparencia total, sin intermediarios.
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, #B8965A40, transparent)",
          }}
        />
      </div>

      {/* Historia & Credencial Oficial */}
      <section className="py-28 bg-crema">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-20">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-10 bg-dorado" />
                <span className="font-body text-dorado text-[11px] tracking-[0.25em] uppercase">
                  Nuestra historia
                </span>
              </div>
              <h2
                className="font-display text-tierra font-medium leading-[1.05] mb-8"
                style={{
                  fontSize: "clamp(2rem, 3.5vw, 3rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Servicio a medida,{" "}
                <span className="italic text-dorado">calidad sin atajos</span>
              </h2>
              <div className="space-y-5 font-body text-tierra/55 text-sm leading-relaxed">
                <p>
                  Altum Inmobiliaria nació del profundo conocimiento del
                  territorio patagónico y de la convicción de que la Patagonia
                  merece un servicio inmobiliario a la altura de su paisaje y su
                  gente.
                </p>
                <p>
                  Trabajamos con un estándar simple: atención personalizada,
                  comunicación directa y rigor profesional en cada operación.
                  Cada cliente recibe un acompañamiento a medida, sin
                  intermediarios ni vueltas.
                </p>
                <p>
                  Desde la tasación inicial hasta la firma de la escritura,
                  cuidamos cada detalle para que tu operación genere valor real
                  y duradero.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
                  alt="Altum Inmobiliaria - propiedades en la Patagonia"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 w-40 h-40 border border-dorado/20 pointer-events-none" />
              <div className="absolute -top-5 -left-5 w-24 h-24 border border-dorado/10 pointer-events-none" />
            </div>
          </div>

          {/* Credencial Institucional */}
          <div
            className="p-8 lg:p-12 bg-navy-950 text-crema border border-dorado/30 relative overflow-hidden"
            style={{ background: "#080E1A" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-3 flex justify-center">
                <div className="relative w-36 h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden border-2 border-dorado shadow-xl">
                  <Image
                    src="/estela.jpg"
                    alt="Estela Mari Rojas - Martillera y Corredora Pública"
                    fill
                    sizes="(max-width: 768px) 150px, 200px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="lg:col-span-6 space-y-3 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-dorado text-[11px] font-body tracking-[0.2em] uppercase">
                  <span>✦</span>
                  <span>Matrícula Profesional Oficial</span>
                </div>
                <h3 className="font-display text-2xl lg:text-3xl text-crema font-medium">
                  Estela Mari Rojas
                </h3>
                <p className="font-body text-crema/65 text-sm leading-relaxed">
                  Martillera y Corredora Pública Colegiada ·{" "}
                  <strong>Matrícula 35 RP 2026</strong>.<br />
                  Colegio de Martilleros y Corredores Públicos de Río Negro (IV
                  Circunscripción). Seguridad jurídica, transparencia notarial y
                  máxima ética en cada contrato.
                </p>
              </div>
              <div className="lg:col-span-3 flex flex-col gap-3 justify-center">
                <a
                  href="https://wa.me/5492996095742?text=Hola%20Estela%2C%20quisiera%20hacerle%20una%20consulta%20inmobiliaria."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-dorado text-tierra font-body text-[11px] font-semibold tracking-[0.16em] uppercase hover:bg-dorado-light transition-all text-center shadow-lg"
                >
                  Contactar Directo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-28 bg-crema">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-10 bg-dorado" />
              <span className="font-body text-dorado text-[11px] tracking-[0.25em] uppercase">
                Lo que nos mueve
              </span>
              <div className="h-px w-10 bg-dorado" />
            </div>
            <h2
              className="font-display text-tierra font-medium leading-[1.05]"
              style={{
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Nuestros <span className="italic text-dorado">valores</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-tierra/8">
            {valores.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.titulo}
                  className="bg-crema p-10 group hover:bg-tierra transition-colors duration-500 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 w-0.5 bg-dorado h-0 group-hover:h-full transition-all duration-500" />
                  <div className="text-dorado mb-5 transition-transform duration-300 group-hover:scale-110 origin-left">
                    <Icon size={28} strokeWidth={1} />
                  </div>
                  <h3 className="font-display text-tierra text-2xl font-medium mb-3 group-hover:text-crema transition-colors duration-500">
                    {v.titulo}
                  </h3>
                  <p className="font-body text-tierra/50 text-sm leading-relaxed group-hover:text-crema/50 transition-colors duration-500">
                    {v.descripcion}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-tierra">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-10 bg-dorado" />
            <span className="font-body text-dorado text-[11px] tracking-[0.25em] uppercase">
              ¿Listo para invertir?
            </span>
            <div className="h-px w-10 bg-dorado" />
          </div>
          <h2
            className="font-display text-crema font-medium leading-[1.05] mb-10"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Invertí en el futuro de{" "}
            <span className="italic text-dorado">la Patagonia</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/proyectos"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 btn-shimmer text-tierra font-body text-[11px] tracking-[0.15em] font-medium uppercase"
            >
              Ver proyectos
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center px-10 py-4 border border-crema/25 text-crema font-body text-[11px] tracking-[0.15em] font-medium uppercase hover:border-dorado hover:text-dorado transition-colors duration-300"
            >
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
