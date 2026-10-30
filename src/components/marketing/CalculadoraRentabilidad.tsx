"use client";

import { useEffect, useRef, useState } from "react";
import { guardarLeadAltum } from "@/app/actions/leads-altum";
import { track } from "@/lib/analytics";
import {
  motion,
  MotionConfig,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, TrendingUp, ShieldCheck } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

interface ModeloInversion {
  id: string;
  nombre: string;
  roiAnual: number;
  plusvaliaAnual: number;
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
    zonaRecomendada: "Mari Menuco & Lagos",
    tipoRenta: "Flujo de caja continuo en USD",
    descripcion:
      "Unidades residenciales y casas de lago comercializadas por estadía para turismo de fin de semana y temporada.",
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

function AnimNum({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 90, damping: 22 });
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  const text = useTransform(spring, (v) =>
    Math.round(v).toLocaleString("es-AR"),
  );
  return <motion.span>{text}</motion.span>;
}

export default function CalculadoraRentabilidad() {
  const [modeloSeleccionado, setModeloSeleccionado] = useState<ModeloInversion>(
    MODELOS_INVERSION[0],
  );
  const [montoUSD, setMontoUSD] = useState<number>(48000);
  const [horizonteAnios, setHorizonteAnios] = useState<number>(3);

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
    if (!nombre.trim() || !telefono.trim()) {
      setError("Completá tu nombre y WhatsApp para recibir las opciones.");
      return;
    }
    setError(null);
    setEnviando(true);
    const result = await guardarLeadAltum({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      tipo_consulta: "inversion",
      origen: "calculadora",
      mensaje: `Simuló una inversión: ${modeloSeleccionado.nombre}, USD ${montoUSD.toLocaleString("es-AR")}, ${horizonteAnios} años.`,
      detalle: {
        modelo: modeloSeleccionado.nombre,
        presupuesto_usd: montoUSD,
        horizonteAnios,
        zona: modeloSeleccionado.zonaRecomendada,
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
    const texto = `Hola Estela Mari Rojas (ALTUM SCI). Simulé una inversión en su plataforma:
• Estrategia: ${modeloSeleccionado.nombre}
• Capital Estimado: USD ${montoUSD.toLocaleString("es-AR")}
• Horizonte: ${horizonteAnios} años
• Retorno Proyectado: +USD ${Math.round(retornoTotalEstimado).toLocaleString("es-AR")} (+${porcentajeGanancia}%)
¿Qué activos tienen disponibles hoy para este perfil?`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        className="py-24 lg:py-32 relative overflow-hidden text-navy bg-white border-y border-navy/[0.06]"
        id="calculadora-inversion"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          {/* Header Minimalista */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6F8FB] border border-navy/10 mb-4">
                <TrendingUp className="w-3.5 h-3.5 text-[#8A6A1B]" />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8A6A1B] font-semibold">
                  Simulador Patrimonial en USD
                </span>
              </div>
              <h2
                className="font-display font-medium text-navy leading-[1.04]"
                style={{
                  fontSize: "clamp(2.3rem, 4.3vw, 3.6rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                Proyectá el rendimiento de tu{" "}
                <em className="font-editorial italic text-[#A47C1B]">capital.</em>
              </h2>
              <p className="font-body text-navy/60 text-sm lg:text-base max-w-xl mt-3">
                Compará tasas de apreciación de tierra en Mari Menuco frente a
                renta corporativa en el corredor energético de Río Negro y
                Neuquén.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-[#F6F8FB] px-4 py-2 self-start lg:self-auto">
              <ShieldCheck className="w-4 h-4 text-[#8A6A1B]" />
              <span className="font-mono text-navy/70 text-[10px] tracking-wider uppercase font-semibold">
                Parámetros de Mercado Real 2026
              </span>
            </div>
          </div>

          {/* Interactive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Minimalist Controls */}
            <div className="lg:col-span-6 p-7 sm:p-9 rounded-[2rem] bg-[#F6F8FB] border border-navy/10 flex flex-col justify-between space-y-7">
              {/* 1. Estrategia */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-navy/55 mb-3 font-semibold">
                  01 · Estrategia de Inversión
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MODELOS_INVERSION.map((mod) => {
                    const active = modeloSeleccionado.id === mod.id;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => {
                          marcarUso("modelo");
                          setModeloSeleccionado(mod);
                        }}
                        className={`p-4 text-left rounded-2xl border transition-all ${
                          active
                            ? "border-navy bg-navy text-white shadow-sm"
                            : "border-navy/10 bg-white text-navy/70 hover:border-navy/30 hover:text-navy"
                        }`}
                      >
                        <span className="font-display text-sm font-semibold block mb-1">
                          {mod.nombre}
                        </span>
                        <span
                          className={`font-mono text-[10px] tracking-wider uppercase block ${
                            active ? "text-dorado" : "text-[#8A6A1B]"
                          }`}
                        >
                          ROI Est: ~{mod.roiAnual}% + {mod.plusvaliaAnual}% Plusvalía
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Slider Capital */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-navy/55 font-semibold">
                    02 · Capital Inicial (USD)
                  </label>
                  <span className="font-display text-navy text-2xl font-bold">
                    USD {montoUSD.toLocaleString("es-AR")}
                  </span>
                </div>

                <input
                  type="range"
                  aria-label="Capital inicial a invertir en USD"
                  min={20000}
                  max={350000}
                  step={4000}
                  value={montoUSD}
                  onChange={(e) => {
                    marcarUso("monto");
                    setMontoUSD(Number(e.target.value));
                  }}
                  className="w-full accent-[#0B1528] cursor-pointer h-2 bg-navy/15 rounded-full appearance-none"
                />

                <div className="flex justify-between text-[10px] font-mono text-navy/45 mt-2">
                  <span>USD 20.000</span>
                  <span>USD 150.000</span>
                  <span>USD 350.000+</span>
                </div>
              </div>

              {/* 3. Horizonte */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-navy/55 mb-3 font-semibold">
                  03 · Horizonte de Inversión
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
                      className={`py-2.5 text-center rounded-xl font-mono text-xs border transition-all ${
                        horizonteAnios === anios
                          ? "border-dorado bg-[#FBF0CF] text-navy font-bold"
                          : "border-navy/10 bg-white text-navy/60 hover:text-navy"
                      }`}
                    >
                      {anios} {anios === 1 ? "Año" : "Años"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumen del Modelo */}
              <div className="p-4 rounded-2xl bg-white border border-navy/[0.08] text-xs font-body text-navy/65 space-y-1">
                <span className="font-mono text-[#8A6A1B] font-semibold block uppercase text-[10px] tracking-wider">
                  Foco Territorial: {modeloSeleccionado.zonaRecomendada}
                </span>
                <p>{modeloSeleccionado.descripcion}</p>
              </div>
            </div>

            {/* Right Column: Executive Dark Navy Results Panel */}
            <div className="lg:col-span-6 p-7 sm:p-10 rounded-[2rem] bg-[#0B1528] text-white border border-navy/20 shadow-[0_28px_64px_-28px_rgba(14,26,51,0.45)] flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="font-mono text-dorado text-[10px] tracking-[0.22em] uppercase block">
                      Proyección a {horizonteAnios}{" "}
                      {horizonteAnios === 1 ? "año" : "años"}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-medium text-white mt-0.5">
                      Patrimonio Proyectado
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                    +{porcentajeGanancia}% Neto
                  </span>
                </div>

                {/* Cifra Principal */}
                <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <span className="font-mono text-white/55 text-[10px] uppercase tracking-widest block">
                    Ganancia Acumulada (Renta + Plusvalía)
                  </span>
                  <div className="font-display text-4xl sm:text-5xl font-semibold text-dorado tracking-tight">
                    +USD <AnimNum value={retornoTotalEstimado} />
                  </div>
                  <p className="font-body text-white/60 text-xs pt-1">
                    Patrimonio final estimado:{" "}
                    <strong className="text-white">
                      USD <AnimNum value={valorFinalPatrimonio} />
                    </strong>
                  </p>
                </div>

                {/* Desglose 2 columnas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                    <span className="font-mono text-white/50 text-[10px] uppercase tracking-wider block">
                      Flujo Anual Estimado
                    </span>
                    <span className="font-display text-xl text-white font-semibold mt-1 block">
                      USD <AnimNum value={rentaAnualEstimada} /> / año
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                    <span className="font-mono text-white/50 text-[10px] uppercase tracking-wider block">
                      Valorización Tierra/Activo
                    </span>
                    <span className="font-display text-xl text-emerald-400 font-semibold mt-1 block">
                      +USD <AnimNum value={plusvaliaTotalEstimada} />
                    </span>
                  </div>
                </div>

                {/* Barra de proporción Capital vs Ganancia + Curva de Evolución 5 Años */}
                <div className="space-y-4">
                  <div>
                    <div className="relative h-2.5 rounded-full bg-dorado/85 overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-white/35 origin-left"
                        initial={false}
                        animate={{ scaleX: montoUSD / valorFinalPatrimonio }}
                        transition={{ type: "spring", stiffness: 90, damping: 20 }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 font-mono text-[10px] uppercase tracking-wider text-white/50">
                      <span>Capital Base (USD {montoUSD.toLocaleString("es-AR")})</span>
                      <span className="text-dorado">
                        Retorno (+USD {Math.round(retornoTotalEstimado).toLocaleString("es-AR")})
                      </span>
                    </div>
                  </div>

                  {/* Gráfico Interactivo de Evolución Anual (Año 1 a Año 5) */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/45">
                        Curva de Capitalización (1 a 5 Años)
                      </span>
                      <span className="font-mono text-[9.5px] text-dorado">
                        Horizonte activo: Año {horizonteAnios}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2.5 items-end h-20 pt-2">
                      {[1, 2, 3, 4, 5].map((yr) => {
                        const maxGain5 =
                          ((montoUSD * modeloSeleccionado.roiAnual) / 100) * 5 +
                          montoUSD *
                            (Math.pow(1 + modeloSeleccionado.plusvaliaAnual / 100, 5) -
                              1);
                        const yrGain =
                          ((montoUSD * modeloSeleccionado.roiAnual) / 100) * yr +
                          montoUSD *
                            (Math.pow(1 + modeloSeleccionado.plusvaliaAnual / 100, yr) -
                              1);
                        const heightPct = Math.max(
                          22,
                          Math.min(100, Math.round(((montoUSD + yrGain) / (montoUSD + maxGain5)) * 100)),
                        );
                        const isSelectedYr = yr === horizonteAnios;

                        return (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => {
                              if (yr !== 4) setHorizonteAnios(yr);
                            }}
                            className="group flex flex-col items-center justify-end h-full gap-1.5 focus:outline-none"
                          >
                            <div className="w-full h-14 flex items-end justify-center bg-white/[0.04] rounded-lg overflow-hidden p-0.5">
                              <motion.div
                                initial={false}
                                animate={{ height: `${heightPct}%` }}
                                transition={{
                                  type: "spring",
                                  stiffness: 140,
                                  damping: 22,
                                }}
                                className={`w-full rounded-md transition-colors ${
                                  isSelectedYr
                                    ? "bg-gradient-to-t from-[#8A6A1B] to-dorado shadow-[0_0_12px_rgba(201,168,76,0.45)]"
                                    : yr < horizonteAnios
                                      ? "bg-dorado/45"
                                      : "bg-white/15 group-hover:bg-white/30"
                                }`}
                              />
                            </div>
                            <span
                              className={`font-mono text-[9px] uppercase ${
                                isSelectedYr
                                  ? "text-dorado font-bold"
                                  : "text-white/45"
                              }`}
                            >
                              Año {yr}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Captura de Lead Directa al CRM */}
              <div className="pt-5 border-t border-white/10 space-y-3">
                {enviado ? (
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs font-body text-center">
                    ✓ Guardamos tu perfil de inversión en nuestro CRM. Estela Mari
                    Rojas te contactará con las carpetas disponibles.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-xs font-body text-white placeholder:text-white/40 focus:outline-none focus:border-dorado"
                      />
                      <input
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Tu WhatsApp"
                        className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-xs font-body text-white placeholder:text-white/40 focus:outline-none focus:border-dorado"
                      />
                    </div>
                    {error && (
                      <p className="font-body text-xs text-red-400">{error}</p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <button
                        type="button"
                        onClick={dejarContacto}
                        disabled={enviando}
                        className="flex-1 py-3 px-5 rounded-full bg-dorado text-tierra font-body text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-dorado-light transition-all"
                      >
                        {enviando
                          ? "Registrando..."
                          : "Recibir Carpetas para este Capital"}
                      </button>
                      <a
                        href={generarEnlaceWhatsApp()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          track("whatsapp_click", { origen: "calculadora" })
                        }
                        className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full border border-white/20 text-white hover:border-dorado hover:text-dorado font-body text-[11px] font-semibold uppercase tracking-wider transition-colors"
                      >
                        <span>WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
