import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./styles/typography.css";
import AppShell from "@/components/marketing/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { contact, siteName, siteTagline, siteUrl } from "@/lib/seo";

// ── Tipografías inspiradas en se7endev.vercel.app (Archivo Variable wdth + Instrument Serif Italic + Chivo Mono) ──
const archivoWide = localFont({
  src: "./fonts/archivo-wdth-latin.woff2",
  weight: "100 900",
  variable: "--font-outfit",
  display: "swap",
});

const archivoBody = localFont({
  src: "./fonts/archivo-latin.woff2",
  weight: "100 900",
  variable: "--font-plus-jakarta",
  display: "swap",
});

const instrumentSerif = localFont({
  src: "./fonts/instrument-serif-italic.woff2",
  weight: "400",
  style: "italic",
  variable: "--font-playfair",
  display: "swap",
});

const chivoMono = localFont({
  src: "./fonts/chivo-mono-latin.woff2",
  weight: "100 900",
  variable: "--font-geist-mono",
  display: "swap",
});

const defaultTitle = `${siteName} · ${siteTagline}`;
const defaultDescription =
  "Lotes frente al lago Mari Menuco, propiedades en Cipolletti, Catriel y Río Negro. Asesoría directa con martillera matriculada Estela Mari Rojas (Mat. 35 RP 2026).";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s | ${siteName}` },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "Real Estate",
  verification: { google: "googled9f5728c228e184a" },
  icons: {
    icon: [
      { url: "/favicon-altum.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon-altum.png"],
    apple: [
      { url: "/favicon-altum.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ─── Schema.org global: solo datos reales (site-config.json) ────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "LocalBusiness"],
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  alternateName: "Altum Inmobiliaria",
  description:
    "Servicios y consultoría inmobiliaria en Neuquén y Río Negro: compra, venta, tasaciones y administración de alquileres.",
  url: siteUrl,
  logo: `${siteUrl}/logoo.png`,
  image: `${siteUrl}/opengraph-image`,
  telephone: contact.telephone,
  email: contact.email,
  areaServed: [
    { "@type": "AdministrativeArea", name: "Neuquén" },
    { "@type": "AdministrativeArea", name: "Río Negro" },
  ],
  employee: {
    "@type": "Person",
    name: "Estela Mari Rojas",
    jobTitle: "Martillera y Corredora Pública Colegiada",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "es-AR",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${archivoWide.variable} ${archivoBody.variable} ${instrumentSerif.variable} ${chivoMono.variable}`}
    >
      <head>
        {/* Preconnect a dominios externos para mejorar LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://wa.me" />

        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className="font-body antialiased bg-crema text-tierra">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
