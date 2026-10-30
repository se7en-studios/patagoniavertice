"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  Home,
  Building2,
  Compass,
  Trees,
  Store,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { guardarLeadAltum } from "@/app/actions/leads-altum";
import { track } from "@/lib/analytics";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const TIPOS_INMUEBLE = [
  { id: "casa", label: "Casa / Residencia", Icon: Home },
  { id: "depto", label: "Departamento", Icon: Building2 },
  { id: "terreno", label: "Lote / Terreno", Icon: Compass },
  { id: "chacra", label: "Chacra / Fracción", Icon: Trees },
  { id: "comercial", label: "Local / Galpón", Icon: Store },
];

const LOCALIDADES = [
  "Cipolletti",
  "Mari Menuco / Lagos",
  "Catriel (Polo Energético)",
  "General Roca",
  "Neuquén Capital",
  "Otras zonas Patagonia",
];

const RANGOS_SUPERFICIE = [
  "Hasta 70 m²",
  "70 a 150 m²",
  "150 a 300 m²",
  "300 a 800 m²",
  "Más de 800 m² / Lote",
];

const BENCHMARK_ZONA: Record<
  string,
  { rangoM2: string; demanda: string; tendencia: string }
> = {
  Cipolletti: {
    rangoM2: "USD 1.350 – 1.850 / m² cub.",
    demanda: "Muy Alta · Polo Residencial",
    tendencia: "+8.4% anual en USD",
  },
  "Mari Menuco / Lagos": {
    rangoM2: "USD 38 – 55 / m² en lote",
    demanda: "Alta · Segunda Residencia & Náutica",
    tendencia: "+14.0% plusvalía anual",
  },
  "Catriel (Polo Energético)": {
    rangoM2: "USD 950 – 1.420 / m²",
    demanda: "Sostenida · Demanda Corporativa",
    tendencia: "Renta 12–14% anual USD",
  },
  "General Roca": {
    rangoM2: "USD 1.050 – 1.480 / m²",
    demanda: "Estable · Eje Alto Valle",
    tendencia: "+6.5% anual en USD",
  },
  "Neuquén Capital": {
    rangoM2: "USD 1.650 – 2.350 / m²",
    demanda: "Máxima · Centro Financiero",
    tendencia: "+9.2% anual en USD",
  },
  "Otras zonas Patagonia": {
    rangoM2: "Valuación según micro-zona",
    demanda: "Análisis personalizado",
    tendencia: "Mercado en expansión",
  },
};

export default function TasadorExpress() {
  const [tipo, setTipo] = useState("casa");
  const [localidad, setLocalidad] = useState("Cipolletti");
  const [superficie, setSuperficie] = useState("70 a 150 m²");
  const [operacion, setOperacion] = useState<"vender" | "alquilar">("vender");
  const [step, setStep] = useState<1 | 2>(1);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviadoOk, setEnviadoOk] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iniciado = useRef(false);

  const benchmark =
    BENCHMARK_ZONA[localidad] || BENCHMARK_ZONA["Otras zonas Patagonia"];

  const marcarInicio = () => {
    if (iniciado.current) return;
    iniciado.current = true;
    track("tasador_start");
  };

  const solicitarTasacion = async () => {
    if (!nombre.trim() || !telefono.trim()) {
      setError("Por favor completá tu nombre y WhatsApp para enviarte el informe.");
      return;
    }
    setError(null);
    setEnviando(true);
    const tipoLabel = TIPOS_INMUEBLE.find((t) => t.id === tipo)?.label || tipo;
    const result = await guardarLeadAltum({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      tipo_consulta: "tasacion",
      origen: "tasador",
      mensaje: `Solicitud de tasación (${operacion}): ${tipoLabel}, ${localidad}, ${superficie}.`,
      detalle: { tipo: tipoLabel, localidad, superficie, operacion },
    });
    setEnviando(false);
    setEnviadoOk(true);
    track("tasador_complete", { tipo, localidad, operacion });
    if (result.success) track("lead_submit", { origen: "tasador" });
    track("whatsapp_click", { origen: "tasador" });
    window.open(generarMensajeWhatsApp(), "_blank", "noopener,noreferrer");
  };

  const generarMensajeWhatsApp = () => {
    const texto = `Hola Estela Mari Rojas (ALTUM SCI). Quisiera solicitar la tasación profesional de mi inmueble:
• Tipo: ${TIPOS_INMUEBLE.find((t) => t.id === tipo)?.label || tipo}
• Localidad: ${localidad}
• Superficie aprox: ${superficie}
• Objetivo: ${operacion === "vender" ? "Venta Inmobiliaria" : "Alquiler / Administración"}
Mi nombre es ${nombre.trim()}. ¿Cuándo podríamos coordinar el relevamiento?`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        className="py-24 lg:py-32 relative overflow-hidden text-navy bg-white border-y border-navy/[0.06]"
        id="tasador-express"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: PropTech Trust & Methodology */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6F8FB] border border-navy/10">
                <span className="w-1.5 h-1.5 rounded-full bg-dorado" />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8A6A1B] font-semibold">
                  Valuación Técnica Certificada
                </span>
              </div>

              <h2
                className="font-display font-medium leading-[1.04] text-navy"
                style={{
                  fontSize: "clamp(2.3rem, 4.2vw, 3.5rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                Conocé el valor real de tu activo en{" "}
                <em className="not-italic italic text-[#A47C1B]">Patagonia.</em>
              </h2>

              <p className="font-body text-navy/60 text-sm lg:text-base leading-relaxed">
                Combinamos inteligencia de precios de cierres efectivos en el
                Alto Valle con dictamen técnico firmado por{" "}
                <strong className="text-navy font-medium">
                  Estela Mari Rojas
                </strong>{" "}
                (Martillera Pública Colegiada Mat. 35 RP 2026).
              </p>

              {/* Live Market Benchmark Box */}
              <div className="rounded-2xl bg-[#0B1528] text-white p-5 border border-navy/10 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-dorado">
                    <Sparkles className="w-3.5 h-3.5" />
                    Benchmark en vivo · {localidad}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    {benchmark.tendencia}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <span className="block font-mono text-[9.5px] uppercase text-white/50">
                      Valor de Referencia
                    </span>
                    <span className="font-display text-sm sm:text-base font-semibold text-white">
                      {benchmark.rangoM2}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9.5px] uppercase text-white/50">
                      Nivel de Liquidez
                    </span>
                    <span className="font-body text-xs font-medium text-white/90">
                      {benchmark.demanda}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Pillars */}
              <div className="space-y-3 pt-2">
                {[
                  {
                    t: "Comparables de Escrituras Reales",
                    d: "Valuamos sobre cierres efectivos de la zona, no precios de publicación distorsionados.",
                  },
                  {
                    t: "Validez Notarial, Bancaria y Sucesoria",
                    d: "Informe técnico respaldado por matrícula profesional del Colegio de Martilleros.",
                  },
                  {
                    t: "Entrega de Dictamen en 24 Horas",
                    d: "Relevamiento presencial o satelital con informe ejecutivo de comercialización.",
                  },
                ].map((item) => (
                  <div key={item.t} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#8A6A1B] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-body text-xs font-semibold text-navy">
                        {item.t}
                      </h4>
                      <p className="font-body text-navy/55 text-xs leading-relaxed">
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Firma Estela */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-navy/[0.08] bg-[#F6F8FB] p-3.5">
                <div className="relative h-11 w-11 rounded-full overflow-hidden border border-dorado/60 shrink-0">
                  <Image
                    src="/estela-avatar.jpg"
                    alt="Estela Mari Rojas"
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-navy truncate">
                    Estela Mari Rojas
                  </p>
                  <p className="font-mono text-[10px] text-[#8A6A1B] uppercase tracking-wider font-semibold truncate">
                    Martillera &amp; Corredora Pública · Mat. 35 RP 2026
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Minimalist Interactive Configurator */}
            <div className="lg:col-span-7">
              <div className="p-7 sm:p-9 lg:p-11 rounded-[2rem] border border-navy/10 bg-[#F6F8FB] shadow-[0_24px_60px_-30px_rgba(14,26,51,0.16)]">
                {/* Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-navy/[0.08]">
                  <div>
                    <span className="font-mono text-[#8A6A1B] text-[10px] tracking-[0.2em] uppercase font-semibold">
                      Paso 0{step} de 02
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-medium text-navy mt-0.5">
                      {step === 1
                        ? "Configurá las características del activo"
                        : "Recibí tu valuación profesional"}
                    </h3>
                  </div>

                  {/* Segmented Control Venta / Alquiler */}
                  <div className="inline-flex bg-white p-1 rounded-full border border-navy/10">
                    <button
                      type="button"
                      onClick={() => setOperacion("vender")}
                      className={`px-4 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all ${
                        operacion === "vender"
                          ? "bg-navy text-white font-semibold shadow-sm"
                          : "text-navy/55 hover:text-navy"
                      }`}
                    >
                      Venta
                    </button>
                    <button
                      type="button"
                      onClick={() => setOperacion("alquilar")}
                      className={`px-4 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all ${
                        operacion === "alquilar"
                          ? "bg-navy text-white font-semibold shadow-sm"
                          : "text-navy/55 hover:text-navy"
                      }`}
                    >
                      Alquiler
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-7"
                    >
                      {/* 1. Tipo */}
                      <div>
                        <label className="block font-mono text-[10px] tracking-[0.18em] uppercase text-navy/55 mb-3 font-semibold">
                          01 · Tipología de Propiedad
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {TIPOS_INMUEBLE.map(({ id, label, Icon }) => {
                            const active = tipo === id;
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => {
                                  marcarInicio();
                                  setTipo(id);
                                }}
                                className={`p-3.5 text-left rounded-2xl border transition-all flex items-center gap-3 ${
                                  active
                                    ? "border-navy bg-navy text-white shadow-sm"
                                    : "border-navy/10 bg-white text-navy/75 hover:border-navy/30 hover:text-navy"
                                }`}
                              >
                                <Icon
                                  className={`w-4 h-4 shrink-0 ${
                                    active ? "text-dorado" : "text-[#8A6A1B]"
                                  }`}
                                />
                                <span className="font-body text-xs font-medium truncate">
                                  {label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Localidad */}
                      <div>
                        <label className="block font-mono text-[10px] tracking-[0.18em] uppercase text-navy/55 mb-3 font-semibold">
                          02 · Ubicación en Patagonia
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {LOCALIDADES.map((loc) => {
                            const active = localidad === loc;
                            return (
                              <button
                                key={loc}
                                type="button"
                                onClick={() => {
                                  marcarInicio();
                                  setLocalidad(loc);
                                }}
                                className={`py-2.5 px-3.5 text-center rounded-xl border font-body text-xs transition-all ${
                                  active
                                    ? "border-dorado bg-[#FBF0CF]/70 text-navy font-semibold"
                                    : "border-navy/10 bg-white text-navy/65 hover:border-navy/25 hover:text-navy"
                                }`}
                              >
                                {loc}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. Superficie */}
                      <div>
                        <label className="block font-mono text-[10px] tracking-[0.18em] uppercase text-navy/55 mb-3 font-semibold">
                          03 · Superficie Estimada
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {RANGOS_SUPERFICIE.map((sup) => {
                            const active = superficie === sup;
                            return (
                              <button
                                key={sup}
                                type="button"
                                onClick={() => {
                                  marcarInicio();
                                  setSuperficie(sup);
                                }}
                                className={`px-4 py-2 rounded-full border font-body text-xs transition-all ${
                                  active
                                    ? "border-navy bg-navy text-white font-medium"
                                    : "border-navy/10 bg-white text-navy/65 hover:border-navy/25 hover:text-navy"
                                }`}
                              >
                                {sup}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer Step 1 */}
                      <div className="pt-4 border-t border-navy/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <span className="font-mono text-[11px] text-navy/55">
                          Referencia zonal:{" "}
                          <strong className="text-navy">
                            {benchmark.rangoM2}
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            marcarInicio();
                            setStep(2);
                          }}
                          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-dorado text-tierra font-body text-xs font-semibold tracking-[0.16em] uppercase hover:bg-dorado-light transition-all shadow-sm"
                        >
                          <span>Continuar al Dictamen</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-6"
                    >
                      {/* Ficha Resumen */}
                      <div className="p-5 rounded-2xl bg-white border border-navy/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-body">
                        <div>
                          <span className="block font-mono text-[9.5px] uppercase text-navy/45">
                            Tipología
                          </span>
                          <span className="font-semibold text-navy">
                            {TIPOS_INMUEBLE.find((t) => t.id === tipo)?.label}
                          </span>
                        </div>
                        <div>
                          <span className="block font-mono text-[9.5px] uppercase text-navy/45">
                            Localidad
                          </span>
                          <span className="font-semibold text-navy">
                            {localidad}
                          </span>
                        </div>
                        <div>
                          <span className="block font-mono text-[9.5px] uppercase text-navy/45">
                            Superficie
                          </span>
                          <span className="font-semibold text-navy">
                            {superficie}
                          </span>
                        </div>
                        <div>
                          <span className="block font-mono text-[9.5px] uppercase text-navy/45">
                            Referencia m²
                          </span>
                          <span className="font-mono font-semibold text-[#8A6A1B]">
                            {benchmark.rangoM2}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-navy/55 mb-1.5">
                            Tu Nombre y Apellido *
                          </label>
                          <input
                            type="text"
                            required
                            autoComplete="name"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Laura Méndez"
                            className="w-full bg-white border border-navy/15 rounded-xl px-4 py-3 text-sm font-body text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-navy/55 mb-1.5">
                            Tu WhatsApp o Teléfono *
                          </label>
                          <input
                            type="tel"
                            required
                            autoComplete="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="Ej: +54 9 299 ..."
                            className="w-full bg-white border border-navy/15 rounded-xl px-4 py-3 text-sm font-body text-navy placeholder:text-navy/35 focus:outline-none focus:border-navy transition-colors"
                          />
                        </div>
                      </div>

                      {enviadoOk && (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-body">
                          ✓ Tu solicitud quedó registrada en el CRM de Estela Mari
                          Rojas y abrimos WhatsApp para coordinar.
                        </div>
                      )}

                      {error && (
                        <p
                          role="alert"
                          className="font-body text-xs text-red-600"
                        >
                          {error}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-5 py-3.5 rounded-full border border-navy/15 bg-white font-body text-xs uppercase tracking-wider text-navy/65 hover:text-navy transition-colors"
                        >
                          ← Modificar datos
                        </button>

                        <button
                          type="button"
                          onClick={solicitarTasacion}
                          disabled={enviando}
                          className="flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0B1528] hover:bg-dorado text-white hover:text-tierra font-body text-xs font-semibold tracking-[0.16em] uppercase transition-all shadow-md disabled:opacity-60"
                        >
                          <span>
                            {enviando
                              ? "Procesando..."
                              : "Solicitar Valuación Oficial"}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
