"use client";

import { useRef, useState } from "react";
import { guardarLeadAltum } from "@/app/actions/leads-altum";
import { track } from "@/lib/analytics";
import { motion } from "framer-motion";
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

export default function CalculadoraRentabilidad() {
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
    <section
      className="py-24 lg:py-36 relative overflow-hidden text-crema"
      style={{ background: "#050811" }}
      id="calculadora-inversion"
    >
      {/* Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] opacity-10 blur-[150px] pointer-events-none rounded-full"
        style={{ background: "#C9A84C" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-10 bg-dorado" />
              <span className="eyebrow tracking-[0.25em] text-dorado">
                ALTUM SCI · Simulador Financiero Inmobiliario
              </span>
            </div>
            <h2
              className="font-display font-medium text-crema leading-[1.05]"
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Calculadora de Inversión &amp;{" "}
              <em className="not-italic italic text-dorado">Rentabilidad</em>
            </h2>
            <p className="font-body text-crema/55 text-sm lg:text-base max-w-2xl mt-4">
              Proyectá el retorno estimado de tu capital según el modelo
              inmobiliario en Río Negro, Neuquén y zonas de influencia
              energética.
            </p>
          </div>

          <div className="flex items-center gap-2 border border-dorado/30 bg-navy-950/80 px-4 py-2 self-start lg:self-auto backdrop-blur-sm">
            <span className="text-dorado text-xs">✦</span>
            <span className="font-body text-crema/70 text-xs tracking-wider uppercase font-medium">
              Datos Auditados de Mercado Real
            </span>
          </div>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Controls Left Column */}
          <div className="lg:col-span-6 space-y-8 p-8 lg:p-10 bg-navy-950/85 border border-dorado/25 backdrop-blur-xl shadow-2xl">
            {/* 1. Selector de Estrategia */}
            <div>
              <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-dorado mb-3 font-semibold">
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
                    className={`p-4 text-left border transition-all ${
                      modeloSeleccionado.id === mod.id
                        ? "border-dorado bg-dorado/15 text-dorado shadow-sm"
                        : "border-crema/10 bg-navy-900/40 text-crema/60 hover:border-crema/30 hover:text-crema"
                    }`}
                  >
                    <span className="font-display text-sm font-semibold block mb-1">
                      {mod.nombre}
                    </span>
                    <span className="font-body text-[10px] tracking-wider text-crema/65 uppercase block">
                      ROI: ~{mod.roiAnual}% Anual
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Slider Capital a Invertir */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-body text-[11px] tracking-[0.2em] uppercase text-dorado font-semibold">
                  2. Capital Inicial a Invertir
                </label>
                <span className="font-display text-dorado text-2xl font-bold">
                  USD {montoUSD.toLocaleString("es-AR")}
                </span>
              </div>

              <input
                type="range"
                min={20000}
                max={500000}
                step={5000}
                value={montoUSD}
                onChange={(e) => {
                  marcarUso("monto");
                  setMontoUSD(Number(e.target.value));
                }}
                className="w-full accent-[#C9A84C] cursor-pointer h-2 bg-navy-900 rounded-lg appearance-none"
              />

              <div className="flex justify-between text-[10px] font-body text-crema/65 tracking-wider mt-2">
                <span>USD 20.000</span>
                <span>USD 250.000</span>
                <span>USD 500.000+</span>
              </div>
            </div>

            {/* 3. Horizonte Temporal */}
            <div>
              <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-dorado mb-3 font-semibold">
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
                    className={`py-2.5 text-center font-body text-xs border transition-all ${
                      horizonteAnios === anios
                        ? "border-dorado bg-dorado text-tierra font-bold shadow-sm"
                        : "border-crema/10 bg-navy-900/40 text-crema/50 hover:text-crema hover:border-crema/30"
                    }`}
                  >
                    {anios} {anios === 1 ? "Año" : "Años"}
                  </button>
                ))}
              </div>
            </div>

            {/* Nota Informativa del Modelo */}
            <div className="p-4 bg-navy-900/80 border-l-2 border-dorado text-xs font-body text-crema/70 space-y-1">
              <span className="text-dorado font-semibold block uppercase text-[10px] tracking-wider">
                Zona de Mayor Demanda: {modeloSeleccionado.zonaRecomendada}
              </span>
              <p>{modeloSeleccionado.descripcion}</p>
            </div>
          </div>

          {/* Results Projection Right Column */}
          <div className="lg:col-span-6 space-y-6">
            <div
              className="p-8 lg:p-12 border border-dorado/40 shadow-2xl space-y-8 backdrop-blur-xl relative overflow-hidden"
              style={{ background: "rgba(10,18,35,0.92)" }}
            >
              {/* Header Box */}
              <div>
                <span className="font-body text-dorado text-[10px] tracking-[0.25em] uppercase block mb-1 font-semibold">
                  Proyección a {horizonteAnios}{" "}
                  {horizonteAnios === 1 ? "año" : "años"}
                </span>
                <h3 className="font-display text-3xl font-medium text-crema">
                  Retorno Estimado Total
                </h3>
              </div>

              {/* Big Stat */}
              <div className="p-6 bg-navy-950/85 border border-dorado/30 space-y-1">
                <span className="font-body text-crema/65 text-[11px] uppercase tracking-wider block">
                  Ganancia Proyectada (Renta + Plusvalía)
                </span>
                <motion.div
                  key={retornoTotalEstimado}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-display text-4xl lg:text-5xl font-bold text-dorado tracking-tight drop-shadow-sm"
                >
                  +USD{" "}
                  {Math.round(retornoTotalEstimado).toLocaleString("es-AR")}
                </motion.div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="font-body text-emerald-400 text-xs font-semibold">
                    ▲ +{porcentajeGanancia}% de apreciación neta
                  </span>
                  <span className="text-crema/55 text-xs">·</span>
                  <span className="font-body text-crema/50 text-xs">
                    Renta anual: ~{modeloSeleccionado.roiAnual}% USD
                  </span>
                </div>
              </div>

              {/* Desglose Métrico */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-crema/10">
                <div className="space-y-1">
                  <span className="font-body text-crema/65 text-[10px] uppercase tracking-wider block">
                    Renta Anual Estimada
                  </span>
                  <span className="font-display text-xl text-crema font-semibold">
                    USD {Math.round(rentaAnualEstimada).toLocaleString("es-AR")}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-body text-crema/65 text-[10px] uppercase tracking-wider block">
                    Patrimonio Final Estimado
                  </span>
                  <span className="font-display text-xl text-dorado font-semibold">
                    USD{" "}
                    {Math.round(valorFinalPatrimonio).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>

              {/* Botón Call to Action */}
              <div className="pt-4 space-y-3">
                {enviado ? (
                  <p className="font-body text-xs text-dorado text-center">
                    Recibimos tus datos. Estela te responde personalmente por
                    WhatsApp o mail.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="font-body text-crema/65 text-[11px]">
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
                        className="w-full bg-navy-900/80 border border-crema/15 px-3.5 py-2.5 text-xs font-body text-crema focus:outline-none focus:border-dorado transition-colors"
                      />
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="Tu WhatsApp o teléfono"
                        aria-label="Tu WhatsApp o teléfono"
                        className="w-full bg-navy-900/80 border border-crema/15 px-3.5 py-2.5 text-xs font-body text-crema focus:outline-none focus:border-dorado transition-colors"
                      />
                    </div>
                    {error && (
                      <p
                        role="alert"
                        className="font-body text-xs text-red-400"
                      >
                        {error}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={dejarContacto}
                      disabled={enviando}
                      className="w-full py-3 px-6 border border-dorado text-dorado font-body text-xs font-semibold tracking-[0.18em] uppercase hover:bg-dorado/10 transition-all disabled:opacity-60"
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
                  className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 bg-dorado text-tierra font-body text-xs font-semibold tracking-[0.18em] uppercase hover:bg-dorado-light transition-all shadow-xl text-center"
                >
                  <span>Consultar Oportunidades para este Perfil</span>
                  <span>→</span>
                </a>

                <div className="flex items-center justify-center gap-2 text-center text-crema/65 text-[10px] font-body">
                  <span>✦</span>
                  <span>
                    Asesoría personalizada por Estela Mari Rojas (Mat. 35 RP
                    2026)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
