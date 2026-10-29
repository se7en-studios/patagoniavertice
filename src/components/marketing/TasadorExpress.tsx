"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useTransform,
} from "framer-motion";
import { guardarLeadAltum } from "@/app/actions/leads-altum";
import { track } from "@/lib/analytics";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const TIPOS_INMUEBLE = [
  { id: "casa", label: "Casa / Residencia", icon: "🏡" },
  { id: "depto", label: "Departamento", icon: "🏢" },
  { id: "terreno", label: "Lote / Terreno", icon: "📐" },
  { id: "chacra", label: "Chacra / Campo", icon: "🌾" },
  { id: "comercial", label: "Local / Galpón", icon: "🏬" },
];

const LOCALIDADES = [
  "Cipolletti",
  "Mari Menuco / Lagos",
  "Catriel (Polo Energético)",
  "General Roca",
  "Neuquén Capital",
  "Bariloche & Cordillera",
  "Otras zonas de Río Negro & Neuquén",
];

const RANGOS_SUPERFICIE = [
  "Hasta 70 m²",
  "70 a 150 m²",
  "150 a 300 m²",
  "300 a 800 m²",
  "Más de 800 m² / Fracción o Lote",
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function TasadorExpress() {
  const secRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: secRef, offset: ["start end", "end start"] });
  const blobY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const [tipo, setTipo] = useState("casa");
  const [localidad, setLocalidad] = useState("Cipolletti");
  const [superficie, setSuperficie] = useState("70 a 150 m²");
  const [operacion, setOperacion] = useState<"vender" | "alquilar">("vender");
  const [step, setStep] = useState<1 | 2>(1);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iniciado = useRef(false);

  const marcarInicio = () => {
    if (iniciado.current) return;
    iniciado.current = true;
    track("tasador_start");
  };

  const solicitarTasacion = async () => {
    setError(null);
    setEnviando(true);
    const tipoLabel = TIPOS_INMUEBLE.find((t) => t.id === tipo)?.label || tipo;
    const result = await guardarLeadAltum({
      nombre,
      telefono,
      tipo_consulta: "tasacion",
      origen: "tasador",
      mensaje: `Solicitud de tasación (${operacion}): ${tipoLabel}, ${localidad}, ${superficie}.`,
      detalle: { tipo: tipoLabel, localidad, superficie, operacion },
    });
    setEnviando(false);
    // Si el guardado falla igual abrimos WhatsApp: la consulta llega por ahí y no se pierde.
    track("tasador_complete", { tipo, localidad, operacion });
    if (result.success) track("lead_submit", { origen: "tasador" });
    track("whatsapp_click", { origen: "tasador" });
    window.open(generarMensajeWhatsApp(), "_blank", "noopener,noreferrer");
  };

  const generarMensajeWhatsApp = () => {
    const texto = `Hola Estela Mari Rojas (ALTUM SCI - Servicios & Consultoría Inmobiliaria). Quisiera solicitar la tasación profesional de mi inmueble:
• Tipo: ${TIPOS_INMUEBLE.find((t) => t.id === tipo)?.label || tipo}
• Localidad: ${localidad}
• Superficie aprox: ${superficie}
• Intención: ${operacion === "vender" ? "Venta Inmobiliaria" : "Alquiler / Administración"}
¿Cuándo podríamos coordinar la visita técnica o peritaje preliminar?`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
  };

  return (
    <MotionConfig reducedMotion="user">
    <section
      ref={secRef}
      className="py-24 lg:py-36 relative overflow-hidden text-navy bg-[#EAF0F7]"
      id="tasador-express"
    >
      {/* Background accents */}
      {/* Luz dorada que sube con el scroll */}
      <motion.div
        className="absolute top-0 right-0 w-[550px] h-[550px] pointer-events-none opacity-20 blur-[130px] rounded-full"
        style={{ background: "#C9A84C", y: blobY }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Context & Trust */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-dorado" />
              <span className="eyebrow tracking-[0.25em] !text-[#8A6A1B]">
                ALTUM SCI · Tasación Oficial Certificada
              </span>
            </div>

            <h2
              className="font-display font-medium leading-[1.05]"
              style={{
                fontSize: "clamp(2.3rem, 4.2vw, 3.6rem)",
                letterSpacing: "-0.02em",
              }}
            >
              ¿Cuánto vale tu propiedad en{" "}
              <em className="not-italic italic text-[#A47C1B]">Patagonia?</em>
            </h2>

            <p className="font-body text-navy/65 text-sm lg:text-base leading-relaxed">
              Tasaciones inmobiliarias con rigor técnico y legal a cargo de{" "}
              <strong>Estela Mari Rojas</strong> (Martillera &amp; Corredora
              Pública Colegiada Mat. 35 RP 2026).
            </p>

            {/* Checklist de Garantías */}
            <motion.div
              className="space-y-4 pt-4 border-t border-navy/10"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.div variants={rise} className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full bg-[#DFF1EA] flex items-center justify-center shrink-0 mt-0.5 text-[#2F7D6B] font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="font-body text-xs font-semibold tracking-wider uppercase text-navy">
                    Análisis Comparativo de Mercado Real
                  </h4>
                  <p className="font-body text-navy/55 text-xs">
                    Basado en operaciones efectivas y escrituras cerradas en la
                    zona, sin sobrevaluaciones ficticias.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={rise} className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full bg-[#DFF1EA] flex items-center justify-center shrink-0 mt-0.5 text-[#2F7D6B] font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="font-body text-xs font-semibold tracking-wider uppercase text-navy">
                    Validez Notarial, Judicial y Bancaria
                  </h4>
                  <p className="font-body text-navy/55 text-xs">
                    Revisión de títulos, planos y estado dominial para
                    garantizar una operación sin sorpresas.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={rise} className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full bg-[#DFF1EA] flex items-center justify-center shrink-0 mt-0.5 text-[#2F7D6B] font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="font-body text-xs font-semibold tracking-wider uppercase text-navy">
                    Dictamen Rápido y Personalizado
                  </h4>
                  <p className="font-body text-navy/55 text-xs">
                    Coordinamos inspección in situ o relevamiento satelital y
                    virtual inmediato.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Sello de confianza de Estela */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 flex items-center gap-3.5 rounded-2xl border border-dorado/30 bg-white/90 backdrop-blur-md p-3.5 shadow-sm"
            >
              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-dorado/50 shrink-0">
                <Image
                  src="/estela-avatar.jpg"
                  alt="Estela Mari Rojas"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-navy truncate">
                  Estela Mari Rojas
                </p>
                <p className="font-body text-[10px] text-[#8A6A1B] uppercase tracking-wider font-semibold truncate">
                  Martillera Colegiada · Mat. 35 RP 2026
                </p>
                <p className="font-body text-[10px] text-navy/50 truncate">
                  Colegio de Martilleros de Río Negro · Validez legal
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Card */}
          <div className="lg:col-span-7">
            <motion.div
              className="p-8 lg:p-10 rounded-[2rem] border border-white bg-white/80 relative backdrop-blur-xl shadow-[0_30px_70px_-30px_rgba(14,26,51,0.4)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header Card */}
              <div className="flex items-center justify-between pb-5 mb-4">
                <div>
                  <span className="font-body text-[#8A6A1B] text-[11px] tracking-[0.2em] uppercase">
                    Paso {step} de 2
                  </span>
                  <h3 className="font-display text-xl font-medium text-navy mt-0.5">
                    {step === 1
                      ? "Datos preliminares del inmueble"
                      : "Resumen y solicitud de tasación"}
                  </h3>
                </div>

                {/* Switch Operación */}
                <div className="flex bg-navy/5 p-1 rounded-full">
                  <button
                    onClick={() => setOperacion("vender")}
                    className={`px-3.5 py-1.5 rounded-full font-body text-[10px] tracking-widest uppercase transition-colors ${
                      operacion === "vender"
                        ? "bg-dorado text-tierra font-semibold"
                        : "text-navy/55 hover:text-navy"
                    }`}
                  >
                    Venta
                  </button>
                  <button
                    onClick={() => setOperacion("alquilar")}
                    className={`px-3.5 py-1.5 rounded-full font-body text-[10px] tracking-widest uppercase transition-colors ${
                      operacion === "alquilar"
                        ? "bg-dorado text-tierra font-semibold"
                        : "text-navy/55 hover:text-navy"
                    }`}
                  >
                    Alquiler
                  </button>
                </div>
              </div>

              <div className="h-1.5 rounded-full bg-navy/10 mb-8 overflow-hidden" aria-hidden="true">
                <motion.div
                  className="h-full w-full rounded-full bg-dorado origin-left"
                  initial={false}
                  animate={{ scaleX: step / 2 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    {/* Selector de Tipo */}
                    <div>
                      <label className="block font-body text-[11px] tracking-[0.16em] uppercase text-navy/60 mb-3">
                        1. Tipo de Propiedad
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {TIPOS_INMUEBLE.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              marcarInicio();
                              setTipo(t.id);
                            }}
                            className={`p-3 text-left rounded-2xl border transition-all flex items-center gap-2.5 ${
                              tipo === t.id
                                ? "border-dorado bg-[#FBF0CF] text-[#7A5A12] font-medium"
                                : "border-navy/10 bg-white text-navy/65 hover:border-navy/30 hover:text-navy"
                            }`}
                          >
                            <span className="text-base">{t.icon}</span>
                            <span className="font-body text-xs truncate">
                              {t.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selector de Localidad */}
                    <div>
                      <label className="block font-body text-[11px] tracking-[0.16em] uppercase text-navy/60 mb-3">
                        2. Localidad / Zona en Patagonia
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {LOCALIDADES.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => {
                              marcarInicio();
                              setLocalidad(loc);
                            }}
                            className={`p-2.5 text-center rounded-full border font-body text-xs transition-all ${
                              localidad === loc
                                ? "border-dorado bg-dorado text-tierra font-semibold"
                                : "border-navy/10 bg-white text-navy/65 hover:border-navy/30 hover:text-navy"
                            }`}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selector de Superficie */}
                    <div>
                      <label className="block font-body text-[11px] tracking-[0.16em] uppercase text-navy/60 mb-3">
                        3. Superficie estimada
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {RANGOS_SUPERFICIE.map((sup) => (
                          <button
                            key={sup}
                            type="button"
                            onClick={() => {
                              marcarInicio();
                              setSuperficie(sup);
                            }}
                            className={`px-4 py-2 rounded-full border font-body text-[11px] transition-all ${
                              superficie === sup
                                ? "border-dorado text-[#7A5A12] bg-[#FBF0CF] font-medium"
                                : "border-navy/10 bg-white text-navy/55 hover:text-navy"
                            }`}
                          >
                            {sup}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Siguiente Paso */}
                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          marcarInicio();
                          setStep(2);
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-dorado text-tierra font-body text-xs font-semibold tracking-[0.18em] uppercase hover:bg-dorado-light transition-all shadow-md"
                      >
                        <span>Continuar</span>
                        <span>→</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    {/* Resumen de Tasación */}
                    <div className="p-6 rounded-3xl bg-[#F6F8FB] border border-navy/10 space-y-3">
                      <h4 className="font-body text-[#8A6A1B] text-[11px] tracking-[0.2em] uppercase">
                        Detalles seleccionados
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-xs font-body text-navy/70 pt-2 border-t border-navy/10">
                        <div>
                          <span className="block text-navy/55 text-[10px] uppercase tracking-wider">
                            Inmueble
                          </span>
                          <span className="font-medium text-navy">
                            {TIPOS_INMUEBLE.find((t) => t.id === tipo)?.label}
                          </span>
                        </div>
                        <div>
                          <span className="block text-navy/55 text-[10px] uppercase tracking-wider">
                            Ubicación
                          </span>
                          <span className="font-medium text-navy">
                            {localidad}
                          </span>
                        </div>
                        <div>
                          <span className="block text-navy/55 text-[10px] uppercase tracking-wider">
                            Superficie
                          </span>
                          <span className="font-medium text-navy">
                            {superficie}
                          </span>
                        </div>
                        <div>
                          <span className="block text-navy/55 text-[10px] uppercase tracking-wider">
                            Operación
                          </span>
                          <span className="font-medium text-navy capitalize">
                            {operacion}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu nombre"
                        aria-label="Tu nombre"
                        className="w-full bg-white border border-navy/15 rounded-full px-5 py-3 text-sm font-body text-navy placeholder:text-navy/40 focus:outline-none focus:border-dorado focus-visible:ring-2 focus-visible:ring-dorado/40 transition-colors"
                      />
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Tu WhatsApp o teléfono"
                        aria-label="Tu WhatsApp o teléfono"
                        className="w-full bg-white border border-navy/15 rounded-full px-5 py-3 text-sm font-body text-navy placeholder:text-navy/40 focus:outline-none focus:border-dorado focus-visible:ring-2 focus-visible:ring-dorado/40 transition-colors"
                      />
                    </div>

                    <p className="font-body text-navy/60 text-xs leading-relaxed">
                      Estela te responde personalmente por WhatsApp. Al
                      continuar se abrirá la conversación con los datos de tu
                      inmueble ya cargados.
                    </p>

                    {error && (
                      <p
                        role="alert"
                        className="font-body text-xs text-red-600"
                      >
                        {error}
                      </p>
                    )}

                    {/* Botones Finales */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-3.5 rounded-full border border-navy/20 font-body text-xs uppercase tracking-wider text-navy/60 hover:text-navy transition-colors"
                      >
                        ← Volver a editar
                      </button>

                      <button
                        type="button"
                        onClick={solicitarTasacion}
                        disabled={enviando}
                        className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-dorado text-tierra font-body text-xs font-semibold tracking-[0.18em] uppercase hover:bg-dorado-light transition-all shadow-lg text-center disabled:opacity-60"
                      >
                        <span>
                          {enviando
                            ? "Enviando..."
                            : "Solicitar Tasación por WhatsApp"}
                        </span>
                        <span>→</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
    </MotionConfig>
  );
}
