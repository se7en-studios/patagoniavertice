"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { guardarLeadAltum } from "@/app/actions/leads-altum";
import { track } from "@/lib/analytics";

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
    <section
      className="py-24 bg-navy-950 text-crema relative overflow-hidden"
      style={{ background: "#060A13" }}
    >
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[300px] opacity-10 blur-[130px] pointer-events-none rounded-full"
        style={{ background: "#C9A84C" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center p-8 lg:p-14 border border-dorado/30 bg-navy-900/60 backdrop-blur-xl">
          {/* Left Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 text-dorado text-[11px] font-body tracking-[0.25em] uppercase font-semibold">
              <span>✦</span>
              <span>Informe Exclusivo para Inversores</span>
            </div>

            <h2
              className="font-display text-3xl lg:text-4xl text-crema font-medium leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Guía Estratégica de Inversión en{" "}
              <em className="not-italic italic text-dorado font-normal">
                Río Negro & Vaca Muerta 2026
              </em>
            </h2>

            <p className="font-body text-crema/60 text-sm lg:text-base leading-relaxed">
              Descubrí las zonas con mayor tasa de plusvalía, rendimientos en
              alquiler corporativo y aspectos fiscales y notariales clave antes
              de comprar en la Patagonia.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-crema/80 font-body">
                <span className="text-dorado">✓</span>
                <span>
                  Análisis de plusvalía y precios por m² en Alto Valle.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-crema/80 font-body">
                <span className="text-dorado">✓</span>
                <span>
                  Renta en USD en Catriel y zonas de influencia energética.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-crema/80 font-body">
                <span className="text-dorado">✓</span>
                <span>
                  Procedimiento 100% legal y remoto para no residentes.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-crema/80 font-body">
                <span className="text-dorado">✓</span>
                <span>
                  Supervisado por Martillera Colegiada (Mat. 35 RP 2026).
                </span>
              </div>
            </div>
          </div>

          {/* Right Lead Capture Box */}
          <div
            className="lg:col-span-5 p-6 lg:p-8 bg-navy-950 border border-dorado/40 shadow-2xl"
            style={{ background: "#080E1A" }}
          >
            {solicitado ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-dorado/20 text-dorado flex items-center justify-center text-xl font-bold">
                  ✓
                </div>
                <h3 className="font-display text-2xl text-crema">
                  ¡Solicitud enviada!
                </h3>
                <p className="font-body text-crema/60 text-xs leading-relaxed">
                  Te hemos redirigido a WhatsApp para enviarte la guía de forma
                  inmediata.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="font-body text-dorado text-[10px] tracking-[0.2em] uppercase block mb-1">
                    Acceso Inmediato y Gratuito
                  </span>
                  <h3 className="font-display text-xl text-crema font-medium">
                    Recibir la Guía por WhatsApp
                  </h3>
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-wider uppercase text-crema/50 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Marcelo Fernández"
                    className="w-full bg-navy-900/80 border border-crema/15 px-3.5 py-2.5 text-xs font-body text-crema focus:outline-none focus:border-dorado transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-wider uppercase text-crema/50 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+54 9 11 0000 0000"
                    className="w-full bg-navy-900/80 border border-crema/15 px-3.5 py-2.5 text-xs font-body text-crema focus:outline-none focus:border-dorado transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-wider uppercase text-crema/50 mb-1">
                    Zona de Interés
                  </label>
                  <select
                    value={ciudadInteres}
                    onChange={(e) => setCiudadInteres(e.target.value)}
                    className="w-full bg-navy-900/80 border border-crema/15 px-3.5 py-2.5 text-xs font-body text-crema focus:outline-none focus:border-dorado transition-colors"
                  >
                    <option value="Cipolletti">Cipolletti (Alto Valle)</option>
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
                  <p role="alert" className="font-body text-xs text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full py-3.5 px-6 bg-dorado text-tierra font-body text-xs font-semibold tracking-[0.16em] uppercase hover:bg-dorado-light transition-all shadow-lg text-center disabled:opacity-60"
                >
                  {enviando ? "Enviando..." : "Solicitar Guía en PDF"}
                </button>

                <p className="text-[10px] font-body text-crema/55 text-center">
                  Sin spam. Estela te responde personalmente por WhatsApp o
                  mail.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
