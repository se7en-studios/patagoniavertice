import Image from "next/image";
import Link from "next/link";
import { coverImage } from "@/lib/property-images";
import { WHATSAPP_NUMBER, WHATSAPP_URL } from "@/lib/constants";
import { faqs } from "@/components/seo/faqData";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import type { PerfilOwner } from "@/lib/site-config";
import type { PropiedadDestacada } from "@/components/marketing/PropiedadesDestacadasHome";
import { PROPIEDADES_SHOWCASE_FALLBACK } from "@/lib/propiedades-fallback";
import HomeTasador from "./HomeTasador";

const TIPO_LABEL: Record<string, string> = {
  venta: "Casa / Residencia",
  alquiler: "Alquiler",
  desarrollo: "Inversión",
  lote: "Lote / Terreno",
  chacra: "Chacra / Campo",
};
const MAX_CARDS = 5;

const precio = (p: PropiedadDestacada) =>
  p.precio ? `${p.moneda} ${p.precio.toLocaleString("es-AR")}` : "Consultar";

const waLink = (texto: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

const ICON = {
  fill: "none",
  stroke: "#7a5a12",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function PropiedadCard({ p }: { p: PropiedadDestacada }) {
  const frenteLago =
    p.tipo === "lote" || /lago|mari menuco/i.test(`${p.titulo} ${p.ciudad}`);
  return (
    <article className="card">
      <div className="pic">
        <Image
          src={coverImage(p.imagenes)}
          alt={p.titulo}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 360px"
          style={{ objectFit: "cover" }}
        />
        <span className="badge gold">{TIPO_LABEL[p.tipo] ?? "Propiedad"}</span>
        {frenteLago && (
          <span className="badge lake r">
            <i></i>Frente al lago
          </span>
        )}
      </div>
      <div className="body">
        <span className="zone">{p.barrio || p.ciudad}</span>
        <h3>{p.titulo}</h3>
        <div className="price">{precio(p)}</div>
        <div className="meta">
          {p.superficie_m2 ? (
            <span className="badge">{p.superficie_m2} m²</span>
          ) : null}
          <span className="badge sage">
            <i></i>Mat. colegiada
          </span>
        </div>
        <a
          className="btn primary"
          href={waLink(`Hola, quiero consultar por: ${p.titulo}`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar
        </a>
      </div>
    </article>
  );
}

export default function HomeClara({
  propiedades,
  perfil,
}: {
  propiedades: PropiedadDestacada[];
  perfil: PerfilOwner;
}) {
  const lista = (
    propiedades.length ? propiedades : PROPIEDADES_SHOWCASE_FALLBACK
  ).slice(0, MAX_CARDS);

  return (
    <>
      <section className="hero" id="inicio">
        <div className="wrap hero-grid">
          <div>
            <span className="badge gold">
              <i></i>Martillera matriculada · Neuquén y Río Negro
            </span>
            <h1>
              Invertí en el eje estratégico de la <em>Patagonia</em>.
            </h1>
            <p className="lead">
              Lotes frente al lago Mari Menuco, residencias y oportunidades de
              inversión, con el respaldo de una martillera matriculada.
            </p>
            <div className="actions">
              <a className="btn gold" href="#propiedades">
                Ver propiedades
              </a>
              <a
                className="btn ghost"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hablar con Estela
              </a>
            </div>
            <div className="chips">
              <span className="badge sage">
                <i></i>
                {perfil.matricula}
              </span>
              <span className="badge">
                Validez notarial y seguridad jurídica
              </span>
            </div>
          </div>
          <div className="scene">
            <Image
              src="/mari-menuco/bahia-playas-2.jpg"
              alt="Costa del lago Mari Menuco con una sombrilla de paja"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 520px"
              style={{ objectFit: "cover" }}
            />
            <div className="float">
              <div>
                <b>Bahía de las Playas</b>
                <small>Mari Menuco · Neuquén</small>
              </div>
              <span className="badge lake">
                <i></i>Frente al lago
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="propiedades" className="band">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Portafolio seleccionado</span>
            <h2>Propiedades y terrenos de primer nivel</h2>
            <p className="lead">
              Lotes en Mari Menuco, residencias en Cipolletti y fracciones con
              plusvalía real en el eje Neuquén – Río Negro.
            </p>
          </div>
          <div className="cards">
            {lista.map((p) => (
              <PropiedadCard key={p.id} p={p} />
            ))}
            <article className="card more">
              <span className="badge gold">Asesoría directa</span>
              <h3>¿Buscás algo específico?</h3>
              <p>
                Contanos qué zona y presupuesto tenés. Estela te responde con
                opciones reales.
              </p>
              <Link className="btn ghost" href="/proyectos">
                Ver catálogo completo
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section id="ubicacion">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Ubicación</span>
            <h2
              style={{
                fontSize: "clamp(30px,4.4vw,48px)",
                marginTop: 14,
                maxWidth: "14ch",
              }}
            >
              Un lago, a 65 km de la ciudad
            </h2>
            <p className="lead" style={{ marginTop: 16 }}>
              Mari Menuco combina la tranquilidad de la costa con la cercanía a
              Neuquén Capital: ideal para vivir, descansar o invertir.
            </p>
            <div className="facts">
              <div className="fact">
                <div className="ic">
                  <svg viewBox="0 0 24 24" {...ICON}>
                    <circle cx="6" cy="18" r="2" />
                    <circle cx="18" cy="6" r="2" />
                    <path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6" />
                  </svg>
                </div>
                <div>
                  <b>A 65 km de Neuquén Capital</b>
                  <span>Barrio Privado Bahía de las Playas</span>
                </div>
              </div>
              <div className="fact">
                <div className="ic">
                  <svg viewBox="0 0 24 24" {...ICON}>
                    <path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z" />
                  </svg>
                </div>
                <div>
                  <b>Frente al lago</b>
                  <span>Con bajada náutica privada</span>
                </div>
              </div>
              <div className="fact">
                <div className="ic">
                  <svg viewBox="0 0 24 24" {...ICON}>
                    <path d="M13 3L5 14h6l-1 7 8-11h-6z" />
                  </svg>
                </div>
                <div>
                  <b>Servicios en el lote</b>
                  <span>Tendido de agua y luz</span>
                </div>
              </div>
            </div>
          </div>
          <div className="route">
            <svg
              viewBox="0 0 420 260"
              role="img"
              aria-label="Recorrido de 65 km entre Neuquén Capital y Mari Menuco"
            >
              <rect width="420" height="260" rx="20" fill="#eaf0f7" />
              <path
                d="M240 150c40-30 90-20 120 10 20 24-10 58-60 52-40-5-92-20-60-62z"
                fill="#bcd8f0"
              />
              <path
                d="M60 190C120 190 140 110 210 130S300 120 340 150"
                fill="none"
                stroke="#0f1b33"
                strokeWidth="3"
                strokeDasharray="2 9"
                strokeLinecap="round"
              />
              <circle cx="60" cy="190" r="10" fill="#0f1b33" />
              <circle cx="60" cy="190" r="4" fill="#fff" />
              <circle cx="340" cy="150" r="12" fill="#d9ab47" />
              <circle cx="340" cy="150" r="4.5" fill="#0f1b33" />
              <text
                x="60"
                y="222"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#0f1b33"
              >
                Neuquén
              </text>
              <text
                x="340"
                y="124"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#0f1b33"
              >
                Mari Menuco
              </text>
              <rect x="146" y="82" width="74" height="28" rx="14" fill="#fff" />
              <text
                x="183"
                y="101"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill="#7a5a12"
              >
                65 km
              </text>
            </svg>
            <div className="foot">
              <span className="badge lake">
                <i></i>Mari Menuco · Neuquén
              </span>
              <a
                className="badge"
                href="https://www.google.com/maps/search/Bah%C3%ADa+de+las+Playas+Mari+Menuco"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver en Google Maps ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="tasador-express" className="band">
        <div className="wrap tasa">
          <div>
            <span className="eyebrow">Tasación oficial certificada</span>
            <h2 style={{ fontSize: "clamp(30px,4.4vw,48px)", marginTop: 14 }}>
              ¿Cuánto vale tu propiedad en Patagonia?
            </h2>
            <p className="lead" style={{ marginTop: 16 }}>
              Tasaciones con rigor técnico y legal a cargo de {perfil.nombre},{" "}
              {perfil.titulo.toLowerCase()}.
            </p>
            <ul className="ticks">
              <li>
                Análisis comparativo de mercado real, sin sobrevaluaciones.
              </li>
              <li>Validez notarial, judicial y bancaria.</li>
              <li>Dictamen en 24 horas, con trámite legal y remoto.</li>
            </ul>
          </div>
          <HomeTasador />
        </div>
      </section>

      <section id="nosotros">
        <div className="wrap about">
          <div className="portrait">
            <Image
              src={perfil.foto}
              alt={perfil.nombre}
              fill
              sizes="340px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div>
            <span className="eyebrow">Quiénes somos</span>
            <h2>
              Atención personalizada, con la firma de una martillera colegiada.
            </h2>
            <p className="lead">{perfil.bio}</p>
            <div className="chips">
              <span className="badge sage">
                <i></i>
                {perfil.matricula}
              </span>
              <span className="badge">{perfil.titulo}</span>
              <span className="badge lake">
                <i></i>Trámite legal y remoto
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="band">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2>Lo que más nos preguntan</h2>
          </div>
          <div className="faq">
            {faqs.map((f, i) => (
              <details key={f.pregunta} open={i === 0}>
                <summary>{f.pregunta}</summary>
                <p>{f.respuesta}</p>
              </details>
            ))}
          </div>
          <FaqJsonLd />
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="cta">
            <h2>Tu próximo lote empieza con una conversación.</h2>
            <p>
              Escribinos por WhatsApp y te respondemos con opciones reales para
              tu zona y presupuesto.
            </p>
            <div className="row">
              <a
                className="btn gold"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Escribir por WhatsApp
              </a>
              <span
                className="badge"
                style={{
                  background: "rgba(255,255,255,.1)",
                  borderColor: "rgba(255,255,255,.2)",
                  color: "#e6ecf7",
                }}
              >
                {perfil.telefono}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
