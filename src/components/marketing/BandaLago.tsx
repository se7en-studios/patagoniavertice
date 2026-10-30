"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import type { BandaLagoConfig } from "@/lib/site-config-types";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { guardarLeadAltum } from "@/app/actions/leads-altum";

const PUNTOS = [
  "Frente al lago con bajada náutica",
  "Agua y energía en el lote",
  "Escrituración con martillera colegiada",
];

interface SectorMasterplan {
  id: string;
  codigo: string;
  nombre: string;
  estado: "Disponible" | "Últimos Lotes" | "Preventa Activa";
  superficie: string;
  precioRef: string;
  lotesDisponibles: number;
  descripcion: string;
  servicios: string[];
}

const SECTORES_BAHIA: SectorMasterplan[] = [
  {
    id: "costa-lago",
    codigo: "Sector A",
    nombre: "Primera Línea de Costa",
    estado: "Últimos Lotes",
    superficie: "850 – 1.000 m²",
    precioRef: "Desde USD 48.000",
    lotesDisponibles: 4,
    descripcion:
      "Ubicación privilegiada sobre la ribera del Lago Mari Menuco, con acceso directo a la playa y bajada náutica exclusiva.",
    servicios: [
      "Frente directo al lago",
      "Bajada náutica privada",
      "Tendido de agua y energía",
      "Seguridad 24 hs",
    ],
  },
  {
    id: "terrazas-panoramicas",
    codigo: "Sector B",
    nombre: "Terrazas Panorámicas",
    estado: "Disponible",
    superficie: "750 – 900 m²",
    precioRef: "Desde USD 36.000",
    lotesDisponibles: 9,
    descripcion:
      "Lotes emplazados sobre una terraza natural sobreelevada que asegura visuales despejadas de 180° hacia el espejo de agua.",
    servicios: [
      "Vista panorámica asegurada",
      "Red eléctrica y agua potable",
      "Calles consolidadas",
      "Aptitud constructiva inmediata",
    ],
  },
  {
    id: "entorno-wakepark",
    codigo: "Sector C",
    nombre: "Entorno WakePark",
    estado: "Disponible",
    superficie: "750 – 850 m²",
    precioRef: "Desde USD 34.000",
    lotesDisponibles: 11,
    descripcion:
      "Sector contiguo al área deportiva y al proyecto aprobado de WakePark, ideal para perfil joven, deportivo y renta temporaria.",
    servicios: [
      "Contiguo al WakePark proyectado",
      "Alta demanda de alquiler temporario",
      "Agua y luz en puerta de lote",
      "Acceso rápido a sector náutico",
    ],
  },
  {
    id: "rincon-clubhouse",
    codigo: "Sector D",
    nombre: "Rincón Club House",
    estado: "Preventa Activa",
    superficie: "750 – 850 m²",
    precioRef: "Desde USD 32.000",
    lotesDisponibles: 14,
    descripcion:
      "El ticket de ingreso más competitivo de Bahía de las Playas, próximo al pórtico de acceso controlado y al futuro Club House social.",
    servicios: [
      "Valor de preventa con alta plusvalía",
      "Cercanía al Club House y pórtico",
      "Financiación personalizada",
      "Supervisión notarial Mat. 35 RP 2026",
    ],
  },
];

export default function BandaLago({ config }: { config?: BandaLagoConfig }) {
  const etiqueta = config?.etiqueta || "Mari Menuco · Neuquén";
  const precioDesde = config?.precioDesde || "Desde USD 32.000";
  const titulo = config?.titulo || "Tu lote,";
  const tituloCursiva = config?.tituloCursiva || "frente al lago";
  const superficieRef = config?.superficieRef || "750–1000 m²";
  const distanciaRef = config?.distanciaRef || "65 km";

  const [sectorActivo, setSectorActivo] = useState<SectorMasterplan>(
    SECTORES_BAHIA[0],
  );
  const [modalMasterplan, setModalMasterplan] = useState(false);
  const [nombreVisita, setNombreVisita] = useState("");
  const [telefonoVisita, setTelefonoVisita] = useState("");
  const [fechaVisita, setFechaVisita] = useState("");
  const [horaVisita, setHoraVisita] = useState("11:00");
  const [enviando, setEnviando] = useState(false);
  const [enviadoOk, setEnviadoOk] = useState(false);

  const bannerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start end", "end start"],
  });
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.09, 1.03, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], [18, -14]);

  const handleAgendarVisitaLago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreVisita.trim() || !telefonoVisita.trim()) return;
    setEnviando(true);
    await guardarLeadAltum({
      nombre: nombreVisita.trim(),
      telefono: telefonoVisita.trim(),
      tipo_consulta: "inversion",
      origen: "masterplan-lago",
      mensaje: `Solicitud de plano y visita a Bahía de las Playas (Mari Menuco) · ${sectorActivo.codigo}: ${sectorActivo.nombre} (${sectorActivo.precioRef}).${fechaVisita ? ` Fecha preferida: ${fechaVisita} a las ${horaVisita} hs.` : ""}`,
      detalle: {
        zona: "Mari Menuco · Bahía de las Playas",
        sector: `${sectorActivo.codigo} - ${sectorActivo.nombre}`,
        precio_ref: sectorActivo.precioRef,
        ...(fechaVisita
          ? { fecha_visita: fechaVisita, hora_visita: horaVisita }
          : {}),
      },
    });
    setEnviando(false);
    setEnviadoOk(true);

    const textoWa = `Hola Estela (ALTUM SCI), me interesa recibir el plano de lotes disponibles en Bahía de las Playas (Mari Menuco) · *${sectorActivo.codigo}: ${sectorActivo.nombre}* (${sectorActivo.precioRef}).${
      fechaVisita
        ? `\nMe gustaría coordinar una visita para el día ${fechaVisita} alrededor de las ${horaVisita} hs.`
        : ""
    }\nMi nombre es ${nombreVisita.trim()}.`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textoWa)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <section className="relative bg-[#F6F8FB] px-4 lg:px-8 py-8 lg:py-12">
      {/* Banner Compacto & Minimalista de Mari Menuco con Parallax GPU */}
      <div
        ref={bannerRef}
        className="relative h-[64vh] min-h-[480px] max-h-[620px] max-w-7xl mx-auto overflow-hidden rounded-[2rem] shadow-[0_24px_60px_-28px_rgba(14,26,51,0.38)] border border-navy/10"
      >
        <motion.div
          style={{ scale: bgScale, y: bgY }}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/mari-menuco/bahia-playas-2.jpg"
            alt="Costa del lago Mari Menuco con sombrilla de paja"
            fill
            sizes="(max-width: 1440px) 100vw, 1280px"
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/65 via-navy-950/15 to-navy-950/20" />

        {/* Badge superior izquierdo */}
        <div className="absolute top-5 left-5 lg:top-8 lg:left-8 z-10 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-950/85 border border-white/15 text-white font-mono text-[10px] tracking-[0.16em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-dorado animate-pulse" />
          <span>Bahía de las Playas · Lago Mari Menuco</span>
        </div>

        <div className="relative h-full px-5 lg:px-12 flex items-end lg:items-center justify-center lg:justify-end pb-5 lg:pb-0">
          <motion.div style={{ y: cardY }} className="w-full max-w-md will-change-transform">
            <motion.div
              className="w-full rounded-3xl border border-navy/10 bg-white/95 backdrop-blur-md shadow-2xl p-6 sm:p-7"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center rounded-full bg-[#FBF0CF] text-[#7A5A12] font-mono text-[10px] font-semibold tracking-[0.14em] uppercase px-3 py-1">
                  {etiqueta}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-navy/65 font-semibold">
                  {precioDesde}
                </span>
              </div>

              <h2
                className="font-display font-medium text-navy leading-[1.04] mb-3"
                style={{
                  fontSize: "clamp(2rem, 3.8vw, 2.9rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                {titulo}{" "}
                <em className="not-italic italic text-[#A47C1B]">
                  {tituloCursiva}
                </em>
              </h2>

              {/* Mini indicadores clave */}
              <div className="grid grid-cols-3 gap-2 mb-4 py-2.5 border-y border-navy/[0.08] text-center">
                <div>
                  <span className="block font-display text-sm sm:text-base font-bold text-navy">
                    {superficieRef}
                  </span>
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-navy/50">
                    Superficie
                  </span>
                </div>
                <div className="border-x border-navy/[0.08]">
                  <span className="block font-display text-sm sm:text-base font-bold text-navy">
                    {distanciaRef}
                  </span>
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-navy/50">
                    De Neuquén
                  </span>
                </div>
                <div>
                  <span className="block font-display text-sm sm:text-base font-bold text-[#8A6A1B]">
                    Agua + Luz
                  </span>
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-navy/50">
                    WakePark &amp; Club
                  </span>
                </div>
              </div>

              <ul className="space-y-1.5 mb-5">
                {PUNTOS.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2.5 font-body text-navy/75 text-xs sm:text-[13px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-dorado shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEnviadoOk(false);
                    setModalMasterplan(true);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#0B1528] hover:bg-dorado text-white hover:text-tierra font-body text-[11px] tracking-[0.14em] font-semibold uppercase px-5 py-3 transition-colors shadow-sm"
                >
                  <span>Masterplan &amp; Sectores</span>
                  <span aria-hidden="true">→</span>
                </button>
                <a
                  href="https://wa.me/5492996095742?text=Hola%20Estela%20(ALTUM%20SCI)%2C%20quisiera%20recibir%20informaci%C3%B3n%20sobre%20los%20lotes%20en%20Mari%20Menuco."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-navy/15 bg-white hover:border-navy px-4 py-3 font-body text-[11px] font-semibold uppercase tracking-wider text-navy transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Franja Interactiva de los 4 Sectores del Masterplan (Visible en Scroll) */}
      <div className="max-w-7xl mx-auto mt-5">
        <div className="rounded-3xl bg-white border border-navy/[0.08] p-5 sm:p-6 shadow-[0_14px_34px_-22px_rgba(14,26,51,0.16)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3.5 border-b border-navy/[0.07]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-dorado" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A6A1B] font-semibold">
                Masterplan Interactivo · 4 Sectores Disponibles en Bahía de las Playas
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEnviadoOk(false);
                setModalMasterplan(true);
              }}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-navy hover:text-[#8A6A1B] font-semibold transition-colors text-left sm:text-right"
            >
              Solicitar plano catastral y disponibilidad →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SECTORES_BAHIA.map((sec, idx) => {
              const isSelected = sec.id === sectorActivo.id;
              return (
                <motion.button
                  key={sec.id}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  onClick={() => {
                    setSectorActivo(sec);
                    setEnviadoOk(false);
                    setModalMasterplan(true);
                  }}
                  className={`group text-left p-4 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? "bg-[#0B1528] text-white border-[#0B1528] shadow-md"
                      : "bg-[#F6F8FB]/75 hover:bg-white text-navy border-navy/[0.08] hover:border-dorado/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.16em] font-semibold ${
                        isSelected ? "text-dorado" : "text-[#8A6A1B]"
                      }`}
                    >
                      {sec.codigo}
                    </span>
                    <span
                      className={`font-mono text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/10 text-white/90"
                          : "bg-navy/[0.06] text-navy/70"
                      }`}
                    >
                      {sec.lotesDisponibles} lotes disp.
                    </span>
                  </div>

                  <h3
                    className={`font-display text-base font-semibold mb-1 ${
                      isSelected ? "text-white" : "text-navy"
                    }`}
                  >
                    {sec.nombre}
                  </h3>

                  <p
                    className={`font-body text-xs line-clamp-2 mb-3 leading-relaxed ${
                      isSelected ? "text-white/65" : "text-navy/60"
                    }`}
                  >
                    {sec.descripcion}
                  </p>

                  <div
                    className={`flex items-center justify-between pt-2.5 border-t font-mono text-[10px] ${
                      isSelected
                        ? "border-white/10 text-dorado"
                        : "border-navy/[0.07] text-navy/75"
                    }`}
                  >
                    <span className="font-semibold">{sec.precioRef}</span>
                    <span>{sec.superficie} →</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal On-Demand: Masterplan Interactivo + Agendar Visita */}
      <AnimatePresence>
        {modalMasterplan && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalMasterplan(false)}
          >
            <motion.div
              className="w-full max-w-3xl rounded-3xl bg-white border border-navy/10 p-6 sm:p-8 shadow-2xl text-navy my-auto max-h-[92vh] overflow-y-auto"
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-navy/10">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A6A1B] font-semibold">
                    Masterplan · Bahía de las Playas (Mari Menuco)
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-navy mt-0.5">
                    Sectores, Disponibilidad y Agendamiento
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalMasterplan(false)}
                  className="w-8 h-8 rounded-full bg-navy/5 hover:bg-navy/10 flex items-center justify-center text-navy/60"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              {/* Pestañas de los 4 Sectores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                {SECTORES_BAHIA.map((sec) => {
                  const activo = sec.id === sectorActivo.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setSectorActivo(sec)}
                      className={`text-left p-3 rounded-2xl border transition-all ${
                        activo
                          ? "border-navy bg-navy text-white shadow-sm"
                          : "border-navy/10 bg-[#F6F8FB] text-navy hover:border-navy/30"
                      }`}
                    >
                      <span
                        className={`block font-mono text-[9.5px] uppercase ${
                          activo ? "text-dorado" : "text-[#8A6A1B]"
                        }`}
                      >
                        {sec.codigo} · {sec.lotesDisponibles} disp.
                      </span>
                      <span className="block font-display text-sm font-semibold truncate mt-0.5">
                        {sec.nombre}
                      </span>
                      <span
                        className={`block font-mono text-[10px] mt-0.5 ${
                          activo ? "text-white/75" : "text-navy/55"
                        }`}
                      >
                        {sec.precioRef}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detalle del Sector Activo */}
              <div className="p-5 rounded-2xl bg-[#F6F8FB] border border-navy/[0.08] mb-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-display text-xl font-semibold text-navy">
                      {sectorActivo.codigo} · {sectorActivo.nombre}
                    </h4>
                    <p className="font-mono text-xs text-[#8A6A1B] font-semibold">
                      {sectorActivo.precioRef} · Superficie:{" "}
                      {sectorActivo.superficie}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-white border border-navy/10 text-navy font-semibold">
                    {sectorActivo.estado} ({sectorActivo.lotesDisponibles} lotes)
                  </span>
                </div>
                <p className="font-body text-xs text-navy/70 leading-relaxed">
                  {sectorActivo.descripcion}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-navy/[0.07]">
                  {sectorActivo.servicios.map((srv) => (
                    <div
                      key={srv}
                      className="flex items-center gap-2 text-xs font-body text-navy/80"
                    >
                      <span className="text-[#8A6A1B] font-bold">✓</span>
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulario rápido de solicitud de plano / visita */}
              {enviadoOk ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
                  <p className="font-display text-base font-semibold">
                    ✓ Solicitud agendada en el CRM de Estela Mari Rojas
                  </p>
                  <p className="font-body text-xs">
                    Te abrimos WhatsApp para enviarte el plano actualizado de{" "}
                    {sectorActivo.nombre}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAgendarVisitaLago} className="space-y-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-navy/55 font-semibold">
                    Solicitar Plano PDF o Agendar Visita Guiada
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      required
                      value={nombreVisita}
                      onChange={(e) => setNombreVisita(e.target.value)}
                      placeholder="Tu Nombre y Apellido *"
                      className="w-full rounded-xl border border-navy/15 px-3.5 py-2.5 text-xs font-body text-navy focus:border-navy focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      value={telefonoVisita}
                      onChange={(e) => setTelefonoVisita(e.target.value)}
                      placeholder="Tu WhatsApp *"
                      className="w-full rounded-xl border border-navy/15 px-3.5 py-2.5 text-xs font-body text-navy focus:border-navy focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="date"
                      value={fechaVisita}
                      onChange={(e) => setFechaVisita(e.target.value)}
                      className="w-full rounded-xl border border-navy/15 px-3.5 py-2.5 text-xs font-body text-navy focus:border-navy focus:outline-none"
                    />
                    <select
                      value={horaVisita}
                      onChange={(e) => setHoraVisita(e.target.value)}
                      className="w-full rounded-xl border border-navy/15 px-3.5 py-2.5 text-xs font-body text-navy focus:border-navy focus:outline-none bg-white"
                    >
                      <option value="10:00">Mañana (10:00 hs)</option>
                      <option value="11:30">Mediodía (11:30 hs)</option>
                      <option value="15:00">Tarde (15:00 hs)</option>
                      <option value="17:00">Atardecer en el Lago (17:00 hs)</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full py-3.5 px-6 rounded-full bg-dorado text-tierra font-body text-xs font-semibold uppercase tracking-[0.16em] hover:bg-dorado-light transition-all shadow-sm disabled:opacity-60"
                  >
                    {enviando
                      ? "Agendando..."
                      : "Recibir Plano y Confirmar Visita →"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
