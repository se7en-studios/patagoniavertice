"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQData {
  categoria: "Comprar & Invertir" | "Venta & Tasaciones" | "Alquileres" | "Marco Legal";
  pregunta: string;
  respuesta: string;
}

const faqs: FAQData[] = [
  {
    categoria: "Comprar & Invertir",
    pregunta: "¿Cuáles son las zonas donde opera Altum Inmobiliaria?",
    respuesta:
      "Trabajamos activamente en todo el Alto Valle y la provincia de Río Negro: Cipolletti, Catriel, General Roca, Viedma y San Carlos de Bariloche. También asesoramos en Neuquén capital y zonas limítrofes. Si tenés interés en otra localidad patagónica, evaluamos cada caso de forma personalizada.",
  },
  {
    categoria: "Comprar & Invertir",
    pregunta: "¿Puedo comprar una propiedad en la Patagonia si resido en otra ciudad o país?",
    respuesta:
      "Sí, contamos con un protocolo especializado para compradores e inversores no residentes. Gestionamos visitas virtuales en alta definición, revisión dominial notarial, poderes de representación y firma remota para que puedas operar desde Buenos Aires, el exterior o cualquier punto del país con total seguridad jurídica.",
  },
  {
    categoria: "Venta & Tasaciones",
    pregunta: "¿Cómo se determina el valor de tasación de un inmueble?",
    respuesta:
      "Nuestras tasaciones están a cargo de la Martillera Colegiada Estela Mari Rojas (Mat. 35 RP 2026). Realizamos un Análisis Comparativo de Mercado (ACM) basado en valores de cierre reales de operaciones efectivas en la zona, estado constructivo, ubicación y potencial de plusvalía.",
  },
  {
    categoria: "Venta & Tasaciones",
    pregunta: "¿Cuánto tiempo demora en promedio concretar una venta?",
    respuesta:
      "En propiedades con documentación en regla y tasación ajustada a mercado, el plazo promedio de reserva y cierre se sitúa entre 30 y 60 días. Contamos con una base activa de compradores calificados e inversores corporativos en Río Negro.",
  },
  {
    categoria: "Alquileres",
    pregunta: "¿Qué incluye la Administración Integral de Alquileres de Altum?",
    respuesta:
      "Brindamos un servicio 'llave en mano': rigurosa evaluación crediticia y laboral de los inquilinos, redacción del contrato conforme a la ley, cobro mensual puntual, liquidación bancaria, atención de reclamos y supervisión periódica del estado del inmueble.",
  },
  {
    categoria: "Marco Legal",
    pregunta: "¿Qué documentación necesito para poner en venta mi propiedad?",
    respuesta:
      "Para iniciar la comercialización solicitamos: copia de la escritura de dominio o boleto sellado, plano de mensura / subdivisión aprobado, estado parcelario y libre deuda de impuestos provinciales y municipales. Nuestro equipo te asiste en caso de faltar algún certificado.",
  },
  {
    categoria: "Marco Legal",
    pregunta: "¿Los contratos cuentan con respaldo colegiado en Río Negro?",
    respuesta:
      "Absolutamente. Cada contrato, reserva y boleto de compraventa es redactado y auditado bajo la supervisión de martillera matriculada en el Colegio de Martilleros y Corredores Públicos de Río Negro (IV Circunscripción), garantizando cláusulas transparentes y sin sorpresas.",
  },
];

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
