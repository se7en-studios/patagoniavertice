"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/components/seo/faqData";

const categorias = [
  "Todas",
  "Comprar & Invertir",
  "Venta & Tasaciones",
  "Alquileres",
  "Marco Legal",
] as const;

export default function FAQ() {
  const [categoriaActiva, setCategoriaActiva] =
    useState<(typeof categorias)[number]>("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtradas = faqs.filter((faq) => {
    const matchCat =
      categoriaActiva === "Todas" || faq.categoria === categoriaActiva;
    const matchText =
      busqueda.trim() === "" ||
      faq.pregunta.toLowerCase().includes(busqueda.toLowerCase()) ||
      faq.respuesta.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchText;
  });

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      className="py-24 lg:py-36 bg-[#F6F8FB] relative overflow-hidden text-navy"
      aria-labelledby="faq-heading"
      id="faq"
    >
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Sticky Header & Search */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start space-y-6">
            <span className="inline-flex items-center rounded-full bg-[#FBF0CF] text-[#7A5A12] font-body text-[11px] font-semibold tracking-[0.14em] uppercase px-3.5 py-1.5">
              Dudas &amp; Asesoramiento
            </span>

            <h2
              id="faq-heading"
              className="font-display font-medium text-navy leading-[1.05]"
              style={{
                fontSize: "clamp(2.3rem, 4.2vw, 3.6rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Preguntas{" "}
              <em className="not-italic italic text-[#A47C1B] font-normal">
                frecuentes
              </em>
            </h2>

            <p className="font-body text-navy/60 text-sm lg:text-base leading-relaxed">
              Resolvemos tus inquietudes sobre trámites de compraventa,
              tasaciones, contratos y gestión de alquileres en Río Negro.
            </p>

            {/* Buscador de preguntas */}
            <div className="relative">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar en las preguntas frecuentes"
                placeholder="Buscar duda o tema (ej: tasación, escritura)..."
                className="w-full rounded-full bg-white border border-navy/10 shadow-sm px-5 py-3.5 text-sm font-body text-navy placeholder:text-navy/45 focus:outline-none focus:border-dorado transition-colors"
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

            {/* Direct Contact Button */}
            <div className="pt-4">
              <a
                href="https://wa.me/5492996095742?text=Hola%20Altum%2C%20tengo%20una%20consulta%20que%20no%20figura%20en%20las%20preguntas%20frecuentes."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-body text-[#8A6A1B] text-xs tracking-[0.18em] uppercase hover:underline"
              >
                <span>¿Tenés una consulta específica? Hablá con nosotros</span>
                <span>→</span>
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
                  className={`font-body text-[10px] tracking-[0.16em] uppercase px-4 py-2.5 rounded-full border transition-all ${
                    categoriaActiva === cat
                      ? "border-dorado bg-dorado text-tierra font-semibold shadow-sm"
                      : "border-navy/10 bg-white text-navy/60 hover:text-navy hover:border-navy/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQ Items: cada tarjeta entra con el scroll, escalonada */}
            <div className="space-y-3">
              {filtradas.length > 0 ? (
                filtradas.map((faq, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <motion.div
                      key={faq.pregunta}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.6,
                        delay: Math.min(i, 5) * 0.07,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`rounded-3xl bg-white border px-6 py-5 transition-all duration-300 ${
                        isOpen
                          ? "border-dorado/50 shadow-[0_18px_40px_-24px_rgba(14,26,51,0.35)]"
                          : "border-white shadow-[0_8px_24px_-18px_rgba(14,26,51,0.25)] hover:border-navy/10"
                      }`}
                    >
                      <button
                        onClick={() => toggle(i)}
                        className="w-full flex items-start justify-between gap-4 text-left group"
                        aria-expanded={isOpen}
                      >
                        <span className="font-display font-medium text-navy group-hover:text-[#8A6A1B] transition-colors text-lg lg:text-xl leading-snug">
                          {faq.pregunta}
                        </span>

                        <span
                          aria-hidden="true"
                          className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all duration-300 ${
                            isOpen
                              ? "rotate-45 bg-dorado text-tierra"
                              : "bg-[#EAF0F7] text-navy"
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
                              duration: 0.35,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="pt-4 font-body text-sm text-navy/65 leading-relaxed">
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
