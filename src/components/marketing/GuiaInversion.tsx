"use client";

import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { guardarLeadAltum } from "@/app/actions/leads-altum";
import { track } from "@/lib/analytics";

const PUNTOS = [
  "Análisis de plusvalía y precios por m² en Alto Valle.",
  "Renta en USD en Catriel y zonas de influencia energética.",
  "Procedimiento 100% legal y remoto para no residentes.",
  "Supervisado por Martillera Colegiada (Mat. 35 RP 2026).",
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const rise = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const FIELD =
  "w-full bg-white border border-navy/15 rounded-full px-5 py-3 text-sm font-body text-navy placeholder:text-navy/40 focus:outline-none focus:border-dorado focus-visible:ring-2 focus-visible:ring-dorado/40 transition-colors";
const LABEL =
  "block font-body text-[10px] tracking-wider uppercase text-navy/55 mb-1.5 ml-1";

export default function GuiaInversion() {
  const [solicitado, setSolicitado] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudadInteres, setCiudadInteres] = useState("Cipolletti");

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    const result = await guardarLeadAltum({
      nombre,
      telefono,
      tipo_consulta: "guia",
      origen: "guia",
      mensaje: `Solicita la Guía de Inversión 2026. Zona de interés: ${ciudadInteres}.`,
      detalle: { zona: ciudadInteres },
    });
    setEnviando(false);
    // Si el guardado falla igual abrimos WhatsApp: la consulta llega por ahí y no se pierde.
    track("guia_download", { zona: ciudadInteres });
    if (result.success) track("lead_submit", { origen: "guia" });
    track("whatsapp_click", { origen: "guia" });
    setSolicitado(true);

    const mensaje = `Hola Altum Inmobiliaria. Solicito la "Guía Estratégica de Inversión Inmobiliaria en Río Negro & Vaca Muerta 2026":
• Nombre: ${nombre}
• Teléfono: ${telefono}
• Zona de Mayor Interés: ${ciudadInteres}`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`,
      "_blank",
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        className="py-20 lg:py-24 bg-[#F6F8FB] text-navy relative overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(600px circle at 25% 50%, rgba(201,168,76,0.12), transparent 70%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center p-8 lg:p-14 rounded-[2.5rem] border border-dorado/25 bg-white shadow-[0_30px_70px_-34px_rgba(14,26,51,0.32)]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-5">
                <div
                  aria-hidden="true"
                  className="hidden sm:flex shrink-0 w-20 h-28 rounded-2xl bg-navy text-white flex-col justify-between p-3 shadow-[0_18px_40px_-16px_rgba(14,26,51,0.6)]"
                >
                  <span className="font-body text-[7px] tracking-[0.2em] uppercase text-dorado">
                    Altum SCI
                  </span>
                  <span className="font-display text-lg leading-none">
                    Guía
                    <br />
                    <span className="text-dorado">2026</span>
                  </span>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#FBF0CF] text-[#7A5A12] text-[11px] font-body tracking-[0.2em] uppercase font-semibold px-4 py-2">
                  <span>✦</span>
                  <span>Informe Exclusivo para Inversores</span>
                </span>
              </div>

              <h2
                className="font-display text-3xl lg:text-4xl text-navy font-medium leading-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                Guía Estratégica de Inversión en{" "}
                <em className="not-italic italic text-[#A47C1B] font-normal">
                  Río Negro & Vaca Muerta 2026
                </em>
              </h2>

              <p className="font-body text-navy/65 text-sm lg:text-base leading-relaxed">
                Descubrí las zonas con mayor tasa de plusvalía, rendimientos en
                alquiler corporativo y aspectos fiscales y notariales clave
                antes de comprar en la Patagonia.
              </p>

              <motion.ul
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
              >
                {PUNTOS.map((p) => (
                  <motion.li
                    key={p}
                    variants={rise}
                    className="flex items-start gap-2.5 rounded-2xl bg-[#F6F8FB] border border-navy/5 px-4 py-3 text-xs text-navy/80 font-body"
                  >
                    <span
                      aria-hidden="true"
                      className="w-4 h-4 mt-px rounded-full bg-[#DFF1EA] text-[#2F7D6B] flex items-center justify-center text-[9px] font-bold shrink-0"
                    >
                      ✓
                    </span>
                    <span>{p}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* Right Lead Capture Box */}
            <div className="lg:col-span-5 p-6 lg:p-8 rounded-[2rem] bg-[#EAF0F7] border border-white">
              {solicitado ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#DFF1EA] text-[#2F7D6B] flex items-center justify-center text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="font-display text-2xl text-navy">
                    ¡Solicitud enviada!
                  </h3>
                  <p className="font-body text-navy/60 text-xs leading-relaxed">
                    Te hemos redirigido a WhatsApp para enviarte la guía de
                    forma inmediata.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <span className="font-body text-[#8A6A1B] text-[10px] tracking-[0.2em] uppercase block mb-1">
                      Acceso Inmediato y Gratuito
                    </span>
                    <h3 className="font-display text-xl text-navy font-medium">
                      Recibir la Guía por WhatsApp
                    </h3>
                  </div>

                  <div>
                    <label htmlFor="guia-nombre" className={LABEL}>
                      Nombre Completo
                    </label>
                    <input
                      id="guia-nombre"
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Marcelo Fernández"
                      className={FIELD}
                    />
                  </div>

                  <div>
                    <label htmlFor="guia-tel" className={LABEL}>
                      Teléfono / WhatsApp
                    </label>
                    <input
                      id="guia-tel"
                      type="tel"
                      required
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+54 9 11 0000 0000"
                      className={FIELD}
                    />
                  </div>

                  <div>
                    <label htmlFor="guia-zona" className={LABEL}>
                      Zona de Interés
                    </label>
                    <select
                      id="guia-zona"
                      value={ciudadInteres}
                      onChange={(e) => setCiudadInteres(e.target.value)}
                      className={FIELD}
                    >
                      <option value="Cipolletti">
                        Cipolletti (Alto Valle)
                      </option>
                      <option value="Catriel">Catriel (Renta Petrolera)</option>
                      <option value="General Roca">
                        General Roca (Lotes & Chacras)
                      </option>
                      <option value="Bariloche">
                        Bariloche (Renta Turística)
                      </option>
                    </select>
                  </div>

                  {error && (
                    <p role="alert" className="font-body text-xs text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full py-3.5 px-6 rounded-full bg-dorado text-tierra font-body text-xs font-semibold tracking-[0.16em] uppercase hover:bg-dorado-light transition-all shadow-lg text-center disabled:opacity-60"
                  >
                    {enviando ? "Enviando..." : "Solicitar Guía en PDF"}
                  </button>

                  <p className="text-[10px] font-body text-navy/55 text-center">
                    Sin spam. Estela te responde personalmente por WhatsApp o
                    mail.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
