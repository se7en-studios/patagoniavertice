"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/components/seo/faqData";
import type { FaqLandingItem } from "@/lib/site-config-types";

const GUIAS_EDITORIAL_HIGHLIGHTS = [
  {
    num: "01",
    tag: "Comparativa 2026",
    titulo: "Lago Mari Menuco vs. Bariloche y Villa La Angostura",
    resumen: "Ticket de ingreso desde USD 32.000 vs. USD 95.000+ y plusvalía anual proyectada.",
    href: "/guias/mari-menuco-vs-bariloche-villa-la-angostura-donde-invertir-lote-lago",
  },
  {
    num: "02",
    tag: "Análisis de Renta",
    titulo: "Lote en Mari Menuco vs. Departamento en Cipolletti",
    resumen: "Comparativa entre flujo de alquiler inmediato (6–8%) y apreciación de tierra (11–14%).",
    href: "/guias/invertir-lote-mari-menuco-vs-departamento-cipolletti-rentabilidad-usd",
  },
  {
    num: "03",
    tag: "Debida Diligencia",
    titulo: "Cómo comprar un terreno en Mari Menuco desde Buenos Aires o el exterior",
    resumen: "Los 4 pasos notariales, boleto certificado y escritura remota con Martillera Mat. 35 RP.",
    href: "/guias/como-comprar-terreno-mari-menuco-desde-buenos-aires-exterior-remoto",
  },
];

const categorias = [
  "Todas",
  "Comprar & Invertir",
  "Venta & Tasaciones",
  "Alquileres",
  "Marco Legal",
] as const;

export default function FAQ({ faqsCustom }: { faqsCustom?: FaqLandingItem[] }) {
  const [categoriaActiva, setCategoriaActiva] =
    useState<(typeof categorias)[number]>("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const baseFaqs =
    faqsCustom && faqsCustom.length > 0
      ? faqsCustom.map((f) => ({
          categoria: f.categoria || "Comprar & Invertir",
          pregunta: f.pregunta,
          respuesta: f.respuesta,
        }))
      : faqs;

  const filtradas = baseFaqs
    .filter((faq) => {
      const matchCat =
        categoriaActiva === "Todas" || faq.categoria === categoriaActiva;
      const matchText =
        busqueda.trim() === "" ||
        faq.pregunta.toLowerCase().includes(busqueda.toLowerCase()) ||
        faq.respuesta.toLowerCase().includes(busqueda.toLowerCase());
      return matchCat && matchText;
    })
    .slice(0, busqueda.trim() ? 8 : 4);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      className="py-16 lg:py-24 bg-white border-t border-navy/10 relative overflow-hidden text-navy"
      aria-labelledby="faq-heading"
      id="faq"
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* ── Tira Editorial: Informes & Comparativas de Inversión 2026 ── */}
        <div className="mb-16 pb-14 border-b border-navy/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <span className="rd-label !text-[10px] text-navy/40">[08]</span>
                <div className="h-px w-8 bg-dorado" />
                <span className="rd-label !text-[10px] !tracking-[0.22em] text-[#8A6A1B]">
                  Research &amp; Comparativas Patrimoniales
                </span>
              </div>
              <h3 className="rd-display text-2xl sm:text-3xl text-navy">
                Guías técnicas para invertir en{" "}
                <em className="rd-serif text-[#A47C1B]">Patagonia Norte</em>
              </h3>
            </div>

            <Link
              href="/guias"
              className="rd-btn self-start sm:self-auto bg-[#0B1528] hover:bg-dorado text-white hover:text-tierra rd-label !text-[10px] !tracking-[0.16em] pl-5 pr-2 py-2"
            >
              <span className="rd-roll" data-text="Ver las 6 Guías Completas">
                <span>Ver las 6 Guías Completas</span>
              </span>
              <span className="rd-btn__icon w-7 h-7 bg-dorado text-tierra">
                ↗
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-navy/10 rounded-[1.75rem] border border-navy/10 bg-[#F6F8FB] overflow-hidden">
            {GUIAS_EDITORIAL_HIGHLIGHTS.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group p-6 hover:bg-white transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rd-label !text-[10px] !tracking-[0.18em] text-[#8A6A1B]">
                      [{g.num} · {g.tag}]
                    </span>
                    <span className="rd-label !text-[10px] text-navy/35 group-hover:text-dorado transition-colors">
                      ↗
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-medium tracking-tight text-navy group-hover:text-[#8A6A1B] transition-colors leading-snug mb-2">
                    {g.titulo}
                  </h4>
                  <p className="font-body text-xs text-navy/60 leading-relaxed">
                    {g.resumen}
                  </p>
                </div>
                <span className="rd-label !text-[9.5px] !tracking-[0.16em] text-navy/70 group-hover:text-[#8A6A1B] mt-4 pt-3 border-t border-navy/10 block">
                  Leer informe técnico completo →
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Sticky Header & Search */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start space-y-6">
            <div className="flex items-center gap-3">
              <span className="rd-label !text-[10px] text-navy/40">[09]</span>
              <div className="h-px w-8 bg-dorado" />
              <span className="rd-label !text-[10px] !tracking-[0.22em] text-[#8A6A1B]">
                Dudas &amp; Asesoramiento Colegiado
              </span>
            </div>

            <h2
              id="faq-heading"
              className="rd-display text-navy"
              style={{
                fontSize: "clamp(2.35rem, 4.2vw, 3.6rem)",
              }}
            >
              Preguntas{" "}
              <em className="rd-serif text-[#A47C1B]">
                frecuentes
              </em>
            </h2>

            <p className="font-body text-navy/65 text-sm lg:text-base leading-relaxed">
              Resolvemos tus inquietudes sobre trámites de compraventa,
              tasaciones, contratos y gestión de alquileres en Río Negro y Neuquén.
            </p>

            {/* Buscador de preguntas */}
            <div className="relative">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar en las preguntas frecuentes"
                placeholder="Buscar duda o tema (ej: tasación, escritura)..."
                className="w-full rounded-full bg-[#F6F8FB] border border-navy/12 shadow-sm px-5 py-3.5 text-sm font-body text-navy placeholder:text-navy/45 focus:outline-none focus:border-dorado focus:bg-white transition-colors"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  aria-label="Borrar búsqueda"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/50 hover:text-navy text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Direct Contact Card */}
            <div className="pt-2">
              <a
                href="https://wa.me/5492996095742?text=Hola%20Estela%20(ALTUM%20SCI)%2C%20tengo%20una%20consulta%20que%20no%20figura%20en%20las%20preguntas%20frecuentes."
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 p-4 rounded-2xl bg-[#F6F8FB] hover:bg-white border border-navy/10 hover:border-dorado shadow-sm transition-all"
              >
                <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-dorado/50 shrink-0">
                  <Image
                    src="/estela-avatar.jpg"
                    alt="Estela Mari Rojas"
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-semibold text-navy group-hover:text-[#8A6A1B] transition-colors">
                    ¿Tenés una consulta específica?
                  </span>
                  <span className="block rd-label !text-[9.5px] !tracking-[0.14em] text-navy/60 mt-0.5">
                    Hablar directo con Estela por WhatsApp ↗
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Category filters & Accordion List */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoriaActiva(cat);
                    setOpenIndex(0);
                  }}
                  className={`rd-label !text-[10px] !tracking-[0.16em] px-4 py-2.5 rounded-full border transition-all ${
                    categoriaActiva === cat
                      ? "border-[#0B1528] bg-[#0B1528] text-white shadow-sm"
                      : "border-navy/10 bg-white text-navy/60 hover:text-navy hover:border-navy/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQ Items con numeración arquitectónica */}
            <div className="divide-y divide-navy/10 rounded-[1.85rem] border border-navy/10 bg-[#F6F8FB] overflow-hidden">
              {filtradas.length > 0 ? (
                filtradas.map((faq, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <motion.div
                      key={faq.pregunta}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.45,
                        delay: Math.min(i, 5) * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`px-6 py-5 transition-colors duration-300 ${
                        isOpen ? "bg-white" : "hover:bg-white/70"
                      }`}
                    >
                      <button
                        onClick={() => toggle(i)}
                        className="w-full flex items-start justify-between gap-4 text-left group"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-baseline gap-3.5">
                          <span className="rd-label !text-[10px] !tracking-[0.16em] text-[#8A6A1B] shrink-0">
                            [0{i + 1}]
                          </span>
                          <span className="font-display font-medium tracking-tight text-navy group-hover:text-[#8A6A1B] transition-colors text-base sm:text-lg leading-snug">
                            {faq.pregunta}
                          </span>
                        </div>

                        <span
                          aria-hidden="true"
                          className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm transition-all duration-300 ${
                            isOpen
                              ? "rotate-45 bg-dorado text-tierra"
                              : "bg-white border border-navy/10 text-navy"
                          }`}
                        >
                          +
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.32,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="pt-3.5 pl-9 font-body text-sm text-navy/65 leading-relaxed">
                              {faq.respuesta}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-navy/55 font-body text-sm">
                  No se encontraron preguntas con el término ingresado.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
