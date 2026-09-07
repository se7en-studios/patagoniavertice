import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./styles/typography.css";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import FloatingDock from "@/components/marketing/FloatingDock";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SmoothScroll from "@/components/ui/SmoothScroll";

// ── Tipografías Ultra-Modern Luxury Minimalist ──────────────────────────────
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://altumsci.com.ar";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Altum Inmobiliaria - Propiedades en Río Negro y la Patagonia",
    template: "%s | Altum Inmobiliaria",
  },
  description:
    "Inmobiliaria y consultoría de propiedades en Neuquén y la Patagonia Argentina. Lotes frente al lago Mari Menuco, asesoría directa y matriculada.",
  keywords: [
    "inmobiliaria Neuquén",
    "propiedades Neuquén",
    "lotes Mari Menuco",
    "terrenos Mari Menuco",
    "Bahía de las Playas Neuquén",
    "inversión inmobiliaria Patagonia",
    "Altum Inmobiliaria",
    "terrenos frente al lago Neuquén",
    "comprar propiedad Patagonia",
    "consultoría inmobiliaria Patagonia",
    "agente inmobiliario Neuquén",
    "mercado inmobiliario Patagonia",
  ],
  authors: [{ name: "Altum Inmobiliaria", url: siteUrl }],
  creator: "Altum Inmobiliaria",
  publisher: "Altum Inmobiliaria",
  category: "Real Estate",
  verification: {
    google: "googled9f5728c228e184a",
  },
  // Geo tags para SEO local
  other: {
    "geo.region": "AR-Q",
    "geo.placename": "Neuquén, Argentina",
    "geo.position": "-38.9516;-68.0591",
    ICBM: "-38.9516, -68.0591",
    "og:locale:alternate": "es_AR",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    siteName: "Altum Inmobiliaria",
    title: "Altum Inmobiliaria - Lotes en Mari Menuco, Neuquén",
    description:
      "Terrenos frente al lago Mari Menuco, en el Barrio Privado Bahía de las Playas, Neuquén. Trato directo, transparencia total.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Altum Inmobiliaria - Lotes frente al lago Mari Menuco, Neuquén",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Altum Inmobiliaria - Lotes en Mari Menuco, Neuquén",
    description:
      "Terrenos frente al lago Mari Menuco, Neuquén. Consultanos sin compromiso.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "es-AR": siteUrl,
    },
  },
};

// ─── Schema.org JSON-LD avanzado ────────────────────────────────────────────

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "LocalBusiness"],
  "@id": `${siteUrl}/#organization`,
  name: "Altum Inmobiliaria",
  alternateName: "Altum SDI",
  description:
    "Inmobiliaria especializada en terrenos frente al lago Mari Menuco, Neuquén. Servicios de compra, venta y consultoría inmobiliaria.",
  url: siteUrl,
  telephone: "+54-9-2996-09-5742",
  email: "altumsci@gmail.com",
  priceRange: "$$",
  image: `${siteUrl}/og-image.jpg`,
  logo: `${siteUrl}/logoo.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Neuquén",
    addressRegion: "Neuquén",
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -38.9516,
    longitude: -68.0591,
  },
  areaServed: [
    {
      "@type": "City",
      name: "Neuquén",
      containedInPlace: { "@type": "AdministrativeArea", name: "Neuquén" },
    },
    { "@type": "State", name: "Neuquén" },
    { "@type": "State", name: "Patagonia Argentina" },
  ],
  serviceType: [
    "Compra y venta de terrenos",
    "Consultoría inmobiliaria",
    "Redacción de contratos inmobiliarios",
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+54-9-2996-09-5742",
    contactType: "customer service",
    availableLanguage: "Spanish",
    contactOption: "TollFree",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "Altum Inmobiliaria",
  description: "Inmobiliaria especializada en Mari Menuco, Neuquén",
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "es-AR",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Dónde opera Altum Inmobiliaria?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Actualmente operamos en Neuquén, con foco en el Barrio Privado Bahía de las Playas, sobre el lago Mari Menuco, a 65 km de Neuquén capital.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta vender una propiedad con Altum?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La comisión de venta es un porcentaje estándar sobre el precio de cierre, acordado antes de iniciar cualquier operación. No hay costos ocultos ni cargos previos. Solo cobramos si concretamos la venta.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué incluye el servicio de administración de alquileres?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gestionamos todo el ciclo: búsqueda y selección de inquilinos, firma y seguimiento del contrato, cobro mensual del alquiler, atención de reclamos y coordinación de mantenimiento.",
      },
    },
    {
      "@type": "Question",
      name: "¿Puedo comprar un lote en Mari Menuco si estoy en otro país o ciudad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, trabajamos con compradores no residentes. Coordinamos visitas virtuales, gestionamos poderes notariales y acompañamos en cada paso de manera remota.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <head>
        {/* Preconnect a dominios externos para mejorar LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://wa.me" />

        {/* Schema.org - LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        {/* Schema.org - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Schema.org - FAQPage (rich snippets) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="font-body antialiased bg-crema text-tierra">
        <SmoothScroll>
          <ScrollProgress />
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingDock />
        </SmoothScroll>
      </body>
    </html>
  );
}
