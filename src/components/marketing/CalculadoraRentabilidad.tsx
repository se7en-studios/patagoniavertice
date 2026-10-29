"use client";

import { useEffect, useRef, useState } from "react";
import { guardarLeadAltum } from "@/app/actions/leads-altum";
import { track } from "@/lib/analytics";
import {
  motion,
  MotionConfig,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface ModeloInversion {
  id: string;
  nombre: string;
  roiAnual: number; // Porcentaje ej: 14
  plusvaliaAnual: number; // Porcentaje ej: 10
  zonaRecomendada: string;
  tipoRenta: string;
  descripcion: string;
}

const MODELOS_INVERSION: ModeloInversion[] = [
  {
    id: "loteo-plusvalia",
    nombre: "Loteo Frente al Lago & Plusvalía",
    roiAnual: 14,
    plusvaliaAnual: 11,
    zonaRecomendada: "Mari Menuco & Cipolletti",
    tipoRenta: "Apreciación de capital acelerada a mediano plazo",
    descripcion:
      "Adquisición de lotes estratégicos en preventa o frente a espejos de agua con alta tasa de valorización por metro cuadrado.",
  },
  {
    id: "alquiler-corporativo",
    nombre: "Alquiler Corporativo Petrolero",
    roiAnual: 13,
    plusvaliaAnual: 7,
    zonaRecomendada: "Catriel & Vaca Muerta Norte",
    tipoRenta: "Renta mensual en USD / Moneda dura",
    descripcion:
      "Viviendas y semipisos alquilados a empresas de servicios petroleros y ejecutivos con contratos seguros y ocupación sostenida.",
  },
  {
    id: "alquiler-turistico",
    nombre: "Renta Turística & Recreativa",
    roiAnual: 12,
    plusvaliaAnual: 9,
    zonaRecomendada: "Bariloche & Mari Menuco",
    tipoRenta: "Flujo de caja continuo en USD",
    descripcion:
      "Unidades residenciales y chalets comercializados con tarifa diaria en plataformas internacionales y turismo premium.",
  },
  {
    id: "residencial-tradicional",
    nombre: "Residencial de Categoría",
    roiAnual: 8,
    plusvaliaAnual: 6,
    zonaRecomendada: "Cipolletti & Neuquén Capital",
    tipoRenta: "Contratos a mediano plazo y bajo riesgo",
    descripcion:
      "Casas en barrios cerrados y departamentos céntricos en zonas consolidadas con inquilinos calificados y nula vacancia.",
  },
];

// Cifra que "corre" hasta el nuevo valor cada vez que cambia la simulación.
function AnimNum({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 90, damping: 22 });
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString("es-AR"));
  return <motion.span>{text}</motion.span>;
}

export default function CalculadoraRentabilidad() {
  const secRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: secRef, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState<ModeloInversion>(
    MODELOS_INVERSION[0],
  );
  const [montoUSD, setMontoUSD] = useState<number>(60000);
  const [horizonteAnios, setHorizonteAnios] = useState<number>(3);

  // Cálculos de Proyección
  const rentaAnualEstimada = (montoUSD * modeloSeleccionado.roiAnual) / 100;
  const plusvaliaTotalEstimada =
    montoUSD *
    (Math.pow(1 + modeloSeleccionado.plusvaliaAnual / 100, horizonteAnios) - 1);
  const retornoTotalEstimado =
    rentaAnualEstimada * horizonteAnios + plusvaliaTotalEstimada;
  const valorFinalPatrimonio = montoUSD + retornoTotalEstimado;
  const porcentajeGanancia = Math.round(
    (retornoTotalEstimado / montoUSD) * 100,
  );

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const usoMarcado = useRef(false);

  const marcarUso = (control: string) => {
    if (usoMarcado.current) return;
    usoMarcado.current = true;
    track("calculadora_use", { control });
  };

  const dejarContacto = async () => {
    setError(null);
    setEnviando(true);
    const result = await guardarLeadAltum({
      nombre,
      telefono,
      tipo_consulta: "inversion",
      origen: "calculadora",
      mensaje: `Simuló una inversión: ${modeloSeleccionado.nombre}, USD ${montoUSD.toLocaleString("es-AR")}, ${horizonteAnios} años.`,
      detalle: {
        modelo: modeloSeleccionado.nombre,
        montoUSD,
        horizonteAnios,
      },
    });
    setEnviando(false);
    if (!result.success) {
      setError(
        result.error ?? "No pudimos enviar tus datos. Intentá de nuevo.",
      );
      return;
    }
    track("lead_submit", { origen: "calculadora" });
    setEnviado(true);
  };

  const generarEnlaceWhatsApp = () => {
    const texto = `Hola Estela Mari Rojas (ALTUM SCI). Estuve simulando una inversión con su Calculadora de Rentabilidad:
• Modelo de Interés: ${modeloSeleccionado.nombre}
• Capital Estimado: USD ${montoUSD.toLocaleString("es-AR")}
• Plazo Proyectado: ${horizonteAnios} años
• Retorno Total Proyectado: +USD ${Math.round(retornoTotalEstimado).toLocaleString("es-AR")} (+${porcentajeGanancia}%)
¿Qué oportunidades activas tienen disponibles para este perfil de inversión?`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
  };

  return (
    <MotionConfig reducedMotion="user">
    <section
      ref={secRef}
      className="py-24 lg:py-36 relative overflow-hidden text-navy bg-[#EAF0F7]"
      id="calculadora-inversion"
    >
      {/* Background Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] opacity-20 blur-[150px] pointer-events-none rounded-full"
        style={{ background: "#C9A84C", y: glowY }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-10 bg-dorado" />
              <span className="eyebrow tracking-[0.25em] !text-[#8A6A1B]">
                ALTUM SCI · Simulador Financiero Inmobiliario
              </span>
            </div>
            <h2
              className="font-display font-medium text-navy leading-[1.05]"
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Calculadora de Inversión &amp;{" "}
              <em className="not-italic italic text-[#A47C1B]">Rentabilidad</em>
            </h2>
            <p className="font-body text-navy/60 text-sm lg:text-base max-w-2xl mt-4">
              Proyectá el retorno estimado de tu capital según el modelo
              inmobiliario en Río Negro, Neuquén y zonas de influencia
              energética.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white bg-white/80 px-4 py-2 self-start lg:self-auto backdrop-blur-sm">
            <span className="text-[#8A6A1B] text-xs">✦</span>
            <span className="font-body text-navy/70 text-xs tracking-wider uppercase font-medium">
              Datos Auditados de Mercado Real
            </span>
          </div>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Controls Left Column */}
          <motion.div
            className="lg:col-span-6 space-y-8 p-8 lg:p-10 rounded-[2rem] bg-white/80 border border-white backdrop-blur-xl shadow-[0_30px_70px_-34px_rgba(14,26,51,0.35)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 1. Selector de Estrategia */}
            <div>
              <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-[#8A6A1B] mb-3 font-semibold">
                1. Seleccioná el Modelo de Inversión
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MODELOS_INVERSION.map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => {
                      marcarUso("modelo");
                      setModeloSeleccionado(mod);
                    }}
                    className={`p-4 text-left rounded-2xl border transition-all ${
                      modeloSeleccionado.id === mod.id
                        ? "border-dorado bg-[#FBF0CF] text-[#7A5A12] shadow-sm"
                        : "border-navy/10 bg-white text-navy/65 hover:border-navy/30 hover:text-navy"
                    }`}
                  >
                    <span className="font-display text-sm font-semibold block mb-1">
                      {mod.nombre}
                    </span>
                    <span className="font-body text-[10px] tracking-wider text-navy/55 uppercase block">
                      ROI: ~{mod.roiAnual}% Anual
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Slider Capital a Invertir */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-body text-[11px] tracking-[0.2em] uppercase text-[#8A6A1B] font-semibold">
                  2. Capital Inicial a Invertir
                </label>
                <span className="font-display text-[#8A6A1B] text-2xl font-bold">
                  USD {montoUSD.toLocaleString("es-AR")}
                </span>
              </div>

              <input
                type="range"
                aria-label="Capital inicial a invertir en USD"
                min={20000}
                max={500000}
                step={5000}
                value={montoUSD}
                onChange={(e) => {
                  marcarUso("monto");
                  setMontoUSD(Number(e.target.value));
                }}
                className="w-full accent-[#C9A84C] cursor-pointer h-2 bg-navy/10 rounded-full appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dorado/50"
              />

              <div className="flex justify-between text-[10px] font-body text-navy/55 tracking-wider mt-2">
                <span>USD 20.000</span>
                <span>USD 250.000</span>
                <span>USD 500.000+</span>
              </div>
            </div>

            {/* 3. Horizonte Temporal */}
            <div>
              <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-[#8A6A1B] mb-3 font-semibold">
                3. Plazo de Inversión Proyectado
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 5].map((anios) => (
                  <button
                    key={anios}
                    type="button"
                    onClick={() => {
                      marcarUso("horizonte");
                      setHorizonteAnios(anios);
                    }}
                    className={`py-2.5 text-center rounded-full font-body text-xs border transition-all ${
                      horizonteAnios === anios
                        ? "border-dorado bg-dorado text-tierra font-bold shadow-sm"
                        : "border-navy/10 bg-white text-navy/55 hover:text-navy hover:border-navy/30"
                    }`}
                  >
                    {anios} {anios === 1 ? "Año" : "Años"}
                  </button>
                ))}
              </div>
            </div>

            {/* Nota Informativa del Modelo */}
            <div className="p-4 rounded-2xl bg-[#F6F8FB] border border-navy/10 text-xs font-body text-navy/70 space-y-1">
              <span className="text-[#8A6A1B] font-semibold block uppercase text-[10px] tracking-wider">
                Zona de Mayor Demanda: {modeloSeleccionado.zonaRecomendada}
              </span>
              <p>{modeloSeleccionado.descripcion}</p>
            </div>
          </motion.div>

          {/* Results Projection Right Column */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              className="p-8 lg:p-12 rounded-[2rem] border border-white bg-white/90 shadow-[0_30px_70px_-34px_rgba(14,26,51,0.4)] space-y-8 backdrop-blur-xl relative overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header Box */}
              <div>
                <span className="font-body text-[#8A6A1B] text-[10px] tracking-[0.25em] uppercase block mb-1 font-semibold">
                  Proyección a {horizonteAnios}{" "}
                  {horizonteAnios === 1 ? "año" : "años"}
                </span>
                <h3 className="font-display text-3xl font-medium text-navy">
                  Retorno Estimado Total
                </h3>
              </div>

              {/* Big Stat */}
              <div className="p-6 rounded-3xl bg-[#F6F8FB] border border-navy/10 space-y-1">
                <span className="font-body text-navy/55 text-[11px] uppercase tracking-wider block">
                  Ganancia Proyectada (Renta + Plusvalía)
                </span>
                <div className="font-display text-4xl lg:text-5xl font-bold text-[#A47C1B] tracking-tight">
                  +USD <AnimNum value={retornoTotalEstimado} />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="font-body text-emerald-600 text-xs font-semibold">
                    ▲ +{porcentajeGanancia}% de apreciación neta
                  </span>
                  <span className="text-navy/40 text-xs">·</span>
                  <span className="font-body text-navy/55 text-xs">
                    Renta anual: ~{modeloSeleccionado.roiAnual}% USD
                  </span>
                </div>
              </div>

              {/* Desglose Métrico */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-navy/10">
                <div className="space-y-1">
                  <span className="font-body text-navy/55 text-[10px] uppercase tracking-wider block">
                    Renta Anual Estimada
                  </span>
                  <span className="font-display text-xl text-navy font-semibold">
                    USD <AnimNum value={rentaAnualEstimada} />
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-body text-navy/55 text-[10px] uppercase tracking-wider block">
                    Patrimonio Final Estimado
                  </span>
                  <span className="font-display text-xl text-[#A47C1B] font-semibold">
                    USD <AnimNum value={valorFinalPatrimonio} />
                  </span>
                </div>
              </div>

              {/* Capital vs. patrimonio final: la barra oscura se estira según la simulación */}
              <div aria-hidden="true">
                <div className="relative h-3 rounded-full bg-dorado/80 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-navy origin-left"
                    initial={false}
                    animate={{ scaleX: montoUSD / valorFinalPatrimonio }}
                    transition={{ type: "spring", stiffness: 90, damping: 20 }}
                  />
                </div>
                <div className="flex justify-between mt-2 font-body text-[10px] uppercase tracking-wider text-navy/55">
                  <span>Capital invertido</span>
                  <span>Ganancia proyectada</span>
                </div>
              </div>

              {/* Botón Call to Action */}
              <div className="pt-4 space-y-3">
                {enviado ? (
                  <p className="font-body text-xs text-[#8A6A1B] text-center">
                    Recibimos tus datos. Estela te responde personalmente por
                    WhatsApp o mail.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="font-body text-navy/60 text-[11px]">
                      Dejá tu contacto y Estela te responde personalmente por
                      WhatsApp o mail con oportunidades para este perfil.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        autoComplete="name"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu nombre"
                        aria-label="Tu nombre"
                        className="w-full bg-white border border-navy/15 rounded-full px-5 py-3 text-sm font-body text-navy placeholder:text-navy/40 focus:outline-none focus:border-dorado focus-visible:ring-2 focus-visible:ring-dorado/40 transition-colors"
                      />
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Tu WhatsApp o teléfono"
                        aria-label="Tu WhatsApp o teléfono"
                        className="w-full bg-white border border-navy/15 rounded-full px-5 py-3 text-sm font-body text-navy placeholder:text-navy/40 focus:outline-none focus:border-dorado focus-visible:ring-2 focus-visible:ring-dorado/40 transition-colors"
                      />
                    </div>
                    {error && (
                      <p
                        role="alert"
                        className="font-body text-xs text-red-600"
                      >
                        {error}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={dejarContacto}
                      disabled={enviando}
                      className="w-full py-3 px-6 rounded-full border border-dorado text-[#8A6A1B] font-body text-xs font-semibold tracking-[0.18em] uppercase hover:bg-dorado/10 transition-all disabled:opacity-60"
                    >
                      {enviando ? "Enviando..." : "Quiero que me contacten"}
                    </button>
                  </div>
                )}

                <a
                  href={generarEnlaceWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("whatsapp_click", { origen: "calculadora" })
                  }
                  className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-full bg-dorado text-tierra font-body text-xs font-semibold tracking-[0.18em] uppercase hover:bg-dorado-light transition-all shadow-xl text-center"
                >
                  <span>Consultar Oportunidades para este Perfil</span>
                  <span>→</span>
                </a>

                <div className="flex items-center justify-center gap-2 text-center text-navy/55 text-[10px] font-body">
                  <span>✦</span>
                  <span>
                    Asesoría personalizada por Estela Mari Rojas (Mat. 35 RP
                    2026)
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
    </MotionConfig>
  );
}
