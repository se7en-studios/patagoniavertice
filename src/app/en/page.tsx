import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl, siteName } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export const metadata: Metadata = {
  title:
    "Patagonia & Vaca Muerta Real Estate Investment — Lake Mari Menuco Land & Corporate Housing",
  description:
    "ALTUM SCI is a licensed boutique real estate & property advisory firm in Neuquén and Río Negro (Patagonia, Argentina), led by Public Broker Estela Mari Rojas (License Mat. 35 RP 2026). Lakefront lots in Lake Mari Menuco from USD 32,000, executive residences in Cipolletti, and 12–14% USD yield corporate rentals in Vaca Muerta.",
  alternates: {
    canonical: `${siteUrl}/en`,
    languages: {
      "es-AR": siteUrl,
      en: `${siteUrl}/en`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteUrl}/en`,
    siteName,
    title:
      "Patagonia & Vaca Muerta Real Estate Investment | ALTUM SCI (Argentina)",
    description:
      "Lakefront land in Lake Mari Menuco from USD 32,000, residential properties in Cipolletti, and oil & gas corporate rentals in Catriel / Vaca Muerta with 100% remote notarized closing.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ALTUM SCI · Patagonia & Vaca Muerta Real Estate",
      },
    ],
  },
};

const EN_FAQS = [
  {
    q: "Can foreign investors or non-residents buy land in Lake Mari Menuco or Vaca Muerta remotely?",
    a: "Yes. ALTUM SCI structures 100% legal remote acquisitions for investors in the US, Europe, and Buenos Aires through apostilled or notarized powers of attorney, live video site inspections, and title verification signed by Licensed Public Broker Estela Mari Rojas (Mat. 35 RP 2026).",
  },
  {
    q: "How much does lakefront land cost in Lake Mari Menuco (Patagonia)?",
    a: "Serviced lots (750 to 1,000 m² with potable water, electricity, boat ramp access, and projected WakePark & Club House) in Bahía de las Playas start at USD 32,000 for Club House lots, USD 36,000 for Panoramic Terraces, and USD 48,000 for first-line waterfront lots.",
  },
  {
    q: "What rental yields do oil & gas corporate properties generate in the Vaca Muerta corridor?",
    a: "Executive residences and logistics parcels in Catriel, Cipolletti, and the Neuquén basin leased to oilfield service companies generate between 12% and 14% gross annual yield in US Dollars (USD).",
  },
];

export default function EnglishInvestorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: EN_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#F6F8FB] text-navy pt-28 pb-24">
      <JsonLd data={faqSchema} />

      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        {/* Language Switcher & Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-8 border-b border-navy/10">
          <span className="rd-label text-[10px] text-[#8A6A1B]">
            ( International Investor Desk · Northern Patagonia, Argentina )
          </span>
          <Link
            href="/"
            className="rd-label text-[10px] text-navy/60 hover:text-navy underline"
          >
            Ver versión en Español (ES) →
          </Link>
        </div>

        {/* Single Semantic H1 + 50-Word Direct Definition for LLMs */}
        <header className="max-w-4xl mb-12">
          <h1
            className="rd-display text-navy leading-[0.92] mb-6"
            style={{ fontSize: "clamp(2.4rem, 5.2vw, 4.5rem)" }}
          >
            INVEST IN PATAGONIA &amp;{" "}
            <em className="font-editorial italic text-[#A47C1B]">
              Vaca Muerta real estate.
            </em>
          </h1>

          {/* Direct 55-word citation-ready paragraph */}
          <p className="rd-body text-navy text-base sm:text-lg leading-relaxed font-medium bg-white p-6 rounded-3xl border-2 border-dorado/45 shadow-sm">
            <strong>ALTUM SCI</strong> is a licensed boutique real estate and
            asset advisory firm operating in{" "}
            <strong>Neuquén and Río Negro (Patagonia, Argentina)</strong>, led
            by Public Broker &amp; Appraiser <strong>Estela Mari Rojas</strong>{" "}
            (License <strong>Mat. 35 RP 2026</strong>). We specialize in{" "}
            <strong>Lake Mari Menuco waterfront lots (from USD 32,000)</strong>,
            executive residences in <strong>Cipolletti</strong>, and high-yield{" "}
            <strong>USD corporate rentals in the Vaca Muerta energy corridor</strong>.
          </p>
        </header>

        {/* Key Asset Classes Table (HTML Table for LLM & Investor Parsing) */}
        <section className="mb-14 rounded-3xl bg-white border border-navy/10 overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-[#0B1528] text-white flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">
              2026 Patagonia &amp; Vaca Muerta Real Estate Benchmarks (USD)
            </h2>
            <span className="rd-label text-[9.5px] text-dorado">
              Verified by Mat. 35 RP 2026
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-navy/10 bg-[#F6F8FB] rd-label text-[10px] text-navy/70">
                  <th className="p-4">Asset Class &amp; Location</th>
                  <th className="p-4">Entry Ticket (USD)</th>
                  <th className="p-4">Target Annual Yield / Appreciation</th>
                  <th className="p-4">Primary Demand Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/[0.07] rd-body text-xs sm:text-sm">
                <tr>
                  <td className="p-4 font-semibold text-navy">
                    Lake Mari Menuco Waterfront Lots (Bahía de las Playas)
                  </td>
                  <td className="p-4 font-medium text-[#7A5A12]">
                    USD 32,000 – USD 48,000 (750–1,000 m²)
                  </td>
                  <td className="p-4">+14% to +18% annual land appreciation</td>
                  <td className="p-4 text-navy/70">
                    45 min from Neuquén City · Water, electricity, boat ramp &amp; WakePark
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-navy">
                    Cipolletti Executive Residences &amp; Condos
                  </td>
                  <td className="p-4 font-medium text-[#7A5A12]">
                    USD 125,000 – USD 195,000+
                  </td>
                  <td className="p-4">8% – 10% USD rental yield + capital preservation</td>
                  <td className="p-4 text-navy/70">
                    10 min from Neuquén financial district · Gated communities
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-navy">
                    Catriel &amp; Vaca Muerta Corporate Housing / Logistics
                  </td>
                  <td className="p-4 font-medium text-[#7A5A12]">
                    From USD 95,000
                  </td>
                  <td className="p-4">12% – 14% gross annual USD yield</td>
                  <td className="p-4 text-navy/70">
                    Long-term leases with oil &amp; gas service contractors
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3 Pillars of Remote Acquisition */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="p-6 rounded-3xl bg-white border border-navy/[0.08]">
            <span className="rd-label text-[10px] text-[#8A6A1B] block mb-2">
              01 / Licensed Brokerage
            </span>
            <h3 className="font-display text-lg font-bold text-navy mb-2">
              Direct Title &amp; Legal Due Diligence
            </h3>
            <p className="rd-body text-xs sm:text-sm text-navy/70 leading-relaxed">
              Every property is audited directly by Licensed Public Broker Estela
              Mari Rojas (Mat. 35 RP 2026), ensuring clean deeds, cadastral
              verification, and full compliance under Argentine law.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-navy/[0.08]">
            <span className="rd-label text-[10px] text-[#8A6A1B] block mb-2">
              02 / 100% Remote Closing
            </span>
            <h3 className="font-display text-lg font-bold text-navy mb-2">
              Buy from the US, Europe, or Buenos Aires
            </h3>
            <p className="rd-body text-xs sm:text-sm text-navy/70 leading-relaxed">
              Live HD walkthroughs on site at Lake Mari Menuco or Cipolletti,
              notarized power-of-attorney execution, and traceable USD settlement.
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-white border border-navy/[0.08]">
            <span className="rd-label text-[10px] text-[#8A6A1B] block mb-2">
              03 / Turnkey Management
            </span>
            <h3 className="font-display text-lg font-bold text-navy mb-2">
              Corporate Lease Administration
            </h3>
            <p className="rd-body text-xs sm:text-sm text-navy/70 leading-relaxed">
              We vet corporate oilfield tenants, structure USD-indexed lease
              agreements, and manage ongoing property maintenance.
            </p>
          </div>
        </section>

        {/* FAQs in English */}
        <section className="mb-14">
          <h2 className="font-display text-2xl font-bold text-navy mb-5">
            Frequently Asked Questions (International Investors)
          </h2>
          <div className="space-y-3">
            {EN_FAQS.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl bg-white border border-navy/10 p-6"
              >
                <h3 className="font-display text-base sm:text-lg font-bold text-navy mb-2">
                  {item.q}
                </h3>
                <p className="rd-body text-navy/70 text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Direct CTA */}
        <div className="rounded-3xl bg-[#0B1528] text-white p-8 sm:p-10 border border-dorado/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="rd-label text-dorado text-[10px] block mb-1.5">
              Direct Advisory · Estela Mari Rojas (Mat. 35 RP 2026)
            </span>
            <h2 className="font-display text-2xl font-bold text-white">
              Request the Lake Mari Menuco Masterplan or Investment Dossier
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Hello Estela (ALTUM SCI), I am interested in receiving the investment dossier for Lake Mari Menuco / Patagonia real estate.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rd-btn"
            >
              <span className="rd-roll">
                <span>WhatsApp Advisory</span>
                <span aria-hidden="true">WhatsApp Advisory</span>
              </span>
              <span className="rd-btn__icon" aria-hidden="true">
                →
              </span>
            </a>
            <Link
              href="/proyectos"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 rd-label text-[10.5px] text-white hover:border-dorado hover:text-dorado transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
