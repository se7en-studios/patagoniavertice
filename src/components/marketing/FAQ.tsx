"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/components/seo/faqData";


const categorias = ["Todas", "Comprar & Invertir", "Venta & Tasaciones", "Alquileres", "Marco Legal"] as const;

export default function FAQ() {
  const [categoriaActiva, setCategoriaActiva] = useState<(typeof categorias)[number]>("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtradas = faqs.filter((faq) => {
    const matchCat = categoriaActiva === "Todas" || faq.categoria === categoriaActiva;
    const matchText =
      busqueda.trim() === "" ||
      faq.pregunta.toLowerCase().includes(busqueda.toLowerCase()) ||
      faq.respuesta.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchText;
  });

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      className="py-24 lg:py-36 bg-navy-900 relative overflow-hidden text-crema"
      style={{ background: "#080E1A" }}
      aria-labelledby="faq-heading"
      id="faq"
    >
      {/* Subtle background grain */}
      <div className="absolute inset-0 grain-overlay opacity-[0.03] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Sticky Header & Search */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-dorado" />
              <span className="eyebrow">Dudas & Asesoramiento</span>
            </div>

            <h2
              id="faq-heading"
              className="font-display font-medium text-crema leading-[1.05]"
              style={{
                fontSize: "clamp(2.3rem, 4.2vw, 3.6rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Preguntas{" "}
              <em className="not-italic italic text-dorado font-normal">frecuentes</em>
            </h2>

            <p className="font-body text-crema/45 text-sm lg:text-base leading-relaxed">
              Resolvemos tus inquietudes sobre trámites de compraventa, tasaciones, contratos y gestión de alquileres en Río Negro.
            </p>

            {/* Buscador de preguntas */}
            <div className="relative">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar duda o tema (ej: tasación, escritura)..."
                className="w-full bg-navy-950/80 border border-crema/15 px-4 py-3 text-xs font-body text-crema placeholder:text-crema/55 focus:outline-none focus:border-dorado transition-colors"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-crema/65 hover:text-crema text-xs"
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
                className="inline-flex items-center gap-3 font-body text-dorado text-xs tracking-[0.18em] uppercase hover:underline"
              >
                <span>¿Tenés una consulta específica? Hablá con nosotros</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Right: Category filters & Accordion List */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-crema/10">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoriaActiva(cat);
                    setOpenIndex(0);
                  }}
                  className={`font-body text-[10px] tracking-[0.16em] uppercase px-3.5 py-2 border transition-all ${
                    categoriaActiva === cat
                      ? "border-dorado bg-dorado text-tierra font-semibold shadow-sm"
                      : "border-crema/10 bg-navy-950/40 text-crema/50 hover:text-crema hover:border-crema/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="divide-y divide-crema/8">
              {filtradas.length > 0 ? (
                filtradas.map((faq, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div key={faq.pregunta} className="py-5">
                      <button
                        onClick={() => toggle(i)}
                        className="w-full flex items-start justify-between gap-4 text-left group"
                        aria-expanded={isOpen}
                      >
                        <span className="font-display font-medium text-crema group-hover:text-dorado transition-colors text-lg lg:text-xl leading-snug">
                          {faq.pregunta}
                        </span>

                        <span
                          className={`shrink-0 w-6 h-6 flex items-center justify-center border border-crema/15 text-dorado text-xs transition-transform duration-300 ${
                            isOpen ? "rotate-45 border-dorado" : ""
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
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="pt-4 font-body text-sm text-crema/55 leading-relaxed">
                              {faq.respuesta}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-crema/65 font-body text-sm">
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
