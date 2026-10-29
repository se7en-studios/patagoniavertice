"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { track } from "@/lib/analytics";

const CONCIERGE_OPTIONS = [
  {
    id: "comprar",
    icon: "🏡",
    label: "Quiero Comprar o Invertir",
    sub: "Lotes en Mari Menuco y propiedades en Río Negro",
    query:
      "Hola ALTUM SCI, busco asesoramiento para comprar o invertir en un lote o propiedad.",
  },
  {
    id: "tasar",
    icon: "🔑",
    label: "Quiero Vender o Tasar",
    sub: "Tasación oficial con Estela Mari Rojas (Mat. 35 RP 2026)",
    query:
      "Hola Estela Mari Rojas (ALTUM SCI), quisiera solicitar la tasación profesional de mi inmueble.",
  },
  {
    id: "alquilar",
    icon: "🏢",
    label: "Alquiler Corporativo & Renta",
    sub: "Gestión segura en Cipolletti, Catriel y Neuquén",
    query:
      "Hola ALTUM SCI, me interesa consultar por alquiler o administración corporativa.",
  },
  {
    id: "legal",
    icon: "⚖️",
    label: "Asesoría Notarial & Contratos",
    sub: "Supervisión legal colegiada y títulos",
    query:
      "Hola ALTUM SCI, necesito asesoramiento notarial y legal para una operación inmobiliaria.",
  },
];

export default function FloatingDock() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Botón flotante Luxury Concierge */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setModalOpen((prev) => !prev)}
          aria-label={
            modalOpen
              ? "Cerrar asistente"
              : "Abrir Asistente WhatsApp Concierge"
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-5 py-3.5 rounded-full font-body text-[11px] tracking-[0.16em] uppercase font-semibold text-tierra shadow-2xl transition-all duration-300"
          style={{
            background: modalOpen ? "#F5EFE6" : "#C9A84C",
            border: "1px solid rgba(201,168,76,0.6)",
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.4)",
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-pulse shrink-0" />
          <WaMiniIcon />
          <span>{modalOpen ? "Cerrar" : "ALTUM SCI Concierge"}</span>
        </motion.button>
      </div>

      {/* Modal Desplegable Luxury Concierge */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm p-6 bg-navy-950/95 text-crema border border-dorado/40 shadow-2xl backdrop-blur-2xl"
            style={{ background: "rgba(8,14,26,0.95)" }}
          >
            {/* Header Concierge */}
            <div className="flex items-start justify-between border-b border-crema/10 pb-4 mb-4">
              <div>
                <span className="font-body text-dorado text-[10px] tracking-[0.2em] uppercase font-medium">
                  ALTUM SCI Concierge
                </span>
                <h3 className="font-display text-lg font-medium text-crema">
                  ¿En qué podemos asesorarte?
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-crema/65 hover:text-crema p-1 text-sm"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {/* Opciones */}
            <div className="space-y-2.5 mb-5">
              {CONCIERGE_OPTIONS.map((opt) => (
                <a
                  key={opt.id}
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(opt.query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    track("whatsapp_click", { origen: `concierge_${opt.id}` });
                    setModalOpen(false);
                  }}
                  className="flex items-center gap-3.5 p-3 border border-crema/10 bg-navy-900/50 hover:border-dorado/60 hover:bg-dorado/10 transition-all group"
                >
                  <span className="text-xl shrink-0">{opt.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="font-display text-xs font-semibold text-crema group-hover:text-dorado transition-colors block truncate">
                      {opt.label}
                    </span>
                    <span className="font-body text-[10px] text-crema/65 block truncate">
                      {opt.sub}
                    </span>
                  </div>
                  <span className="text-dorado text-xs transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              ))}
            </div>

            {/* Footer con llamada directa */}
            <div className="pt-3 border-t border-crema/10 flex items-center justify-between text-[11px] font-body text-crema/65">
              <span>¿Preferís llamar?</span>
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                onClick={() =>
                  track("cta_click", { origen: "concierge", accion: "llamar" })
                }
                className="text-dorado hover:underline font-medium flex items-center gap-1"
              >
                <span>+54 9 299 609-5742</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function WaMiniIcon() {
  return (
    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
