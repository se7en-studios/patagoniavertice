"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  BadgeDollarSign,
  Building2,
  Scale,
  Phone,
  ArrowUpRight,
  X,
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { track } from "@/lib/analytics";

const CONCIERGE_OPTIONS = [
  {
    id: "comprar",
    Icon: Compass,
    label: "Lotes Mari Menuco & Compras",
    sub: "Bahía de las Playas y residencias en Cipolletti",
    query:
      "Hola ALTUM SCI, busco asesoramiento para comprar o invertir en un lote o propiedad.",
  },
  {
    id: "tasar",
    Icon: BadgeDollarSign,
    label: "Tasación Oficial Matriculada",
    sub: "Dictamen técnico con Estela Mari Rojas (Mat. 35 RP 2026)",
    query:
      "Hola Estela Mari Rojas (ALTUM SCI), quisiera solicitar la tasación profesional de mi inmueble.",
  },
  {
    id: "alquilar",
    Icon: Building2,
    label: "Alquiler Corporativo & Renta",
    sub: "Gestión llave en mano en Cipolletti, Catriel y Neuquén",
    query:
      "Hola ALTUM SCI, me interesa consultar por alquiler o administración corporativa.",
  },
  {
    id: "legal",
    Icon: Scale,
    label: "Asesoría Notarial & Contratos",
    sub: "Supervisión legal colegiada y operatoria remota",
    query:
      "Hola ALTUM SCI, necesito asesoramiento notarial y legal para una operación inmobiliaria.",
  },
];

export default function FloatingDock() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Botón flotante PropTech Concierge estilo se7endev */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setModalOpen((prev) => !prev)}
          aria-label={
            modalOpen
              ? "Cerrar asistente"
              : "Abrir Asistente WhatsApp Concierge"
          }
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="rd-btn flex items-center gap-3 pl-2 pr-4 py-2 rounded-full bg-[#070E1B] text-white border border-dorado/45 shadow-[0_16px_38px_-10px_rgba(7,14,27,0.65)] hover:border-dorado transition-colors"
        >
          <div className="relative shrink-0">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-dorado/75">
              <Image
                src="/estela-avatar.jpg"
                alt="Estela Mari Rojas"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070E1B]" />
          </div>
          <span
            className="rd-roll rd-label !text-[10px] !tracking-[0.16em] text-white/95"
            data-text={modalOpen ? "Cerrar Concierge" : "Hablar con Estela"}
          >
            <span>{modalOpen ? "Cerrar Concierge" : "Hablar con Estela"}</span>
          </span>
          <span className="rd-btn__icon w-6 h-6 bg-dorado text-tierra text-[11px]">
            {modalOpen ? "✕" : "↗"}
          </span>
        </motion.button>
      </div>

      {/* Modal Desplegable PropTech Concierge */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block fixed bottom-20 right-6 z-50 w-[92vw] max-w-sm p-6 rounded-3xl bg-white text-navy border border-navy/10 shadow-[0_30px_70px_-20px_rgba(11,21,40,0.35)] backdrop-blur-2xl"
          >
            {/* Header Concierge */}
            <div className="flex items-center justify-between border-b border-navy/10 pb-4 mb-4 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-dorado/60 shrink-0">
                  <Image
                    src="/estela-avatar.jpg"
                    alt="Estela Mari Rojas"
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rd-label !text-[9px] !tracking-[0.16em] text-[#8A6A1B] truncate">
                    <span className="rd-ping" />
                    Respuesta &lt; 15 min · Mat. 35 RP
                  </span>
                  <h3 className="font-display text-base font-semibold tracking-tight text-navy truncate">
                    ¿En qué puedo asesorarte hoy?
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-full bg-navy/5 hover:bg-navy/10 flex items-center justify-center text-navy/60 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Opciones con Staggered Entrance */}
            <div className="space-y-2 mb-4">
              {CONCIERGE_OPTIONS.map((opt, idx) => {
                const Icon = opt.Icon;
                return (
                  <motion.a
                    key={opt.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: idx * 0.04 }}
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(opt.query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      track("whatsapp_click", { origen: `concierge_${opt.id}` });
                      setModalOpen(false);
                    }}
                    className="flex items-center gap-3.5 p-3 rounded-2xl border border-navy/[0.08] bg-[#F6F8FB]/70 hover:bg-white hover:border-dorado/60 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-navy/10 flex items-center justify-center text-[#8A6A1B] group-hover:bg-[#0B1528] group-hover:text-dorado transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-display text-xs font-semibold text-navy group-hover:text-[#8A6A1B] transition-colors block truncate">
                        {opt.label}
                      </span>
                      <span className="font-body text-[10.5px] text-navy/55 block truncate">
                        {opt.sub}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-navy/35 group-hover:text-[#8A6A1B] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                  </motion.a>
                );
              })}
            </div>

            {/* Footer con llamada directa */}
            <div className="pt-3 border-t border-navy/[0.08] flex items-center justify-between text-[11px] font-body text-navy/60">
              <span>Línea directa patagónica</span>
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                onClick={() =>
                  track("cta_click", { origen: "concierge", accion: "llamar" })
                }
                className="text-navy hover:text-[#8A6A1B] font-mono text-[11px] font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3 h-3 text-[#8A6A1B]" />
                <span>+54 9 299 609-5742</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
