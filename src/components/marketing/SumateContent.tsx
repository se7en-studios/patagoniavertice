"use client";

import { useState } from "react";
import { TrendingUp, MapPin, BookOpen, Users, Building2, Clock } from "lucide-react";

const beneficios = [
  {
    icon: TrendingUp,
    titulo: "Crecimiento real",
    descripcion: "Trabajá en proyectos que transforman regiones y generan impacto concreto en la Patagonia.",
  },
  {
    icon: MapPin,
    titulo: "Proyectos únicos",
    descripcion: "Participá en desarrollos en el Alto Valle y Neuquén, una de las zonas de mayor crecimiento de Argentina.",
  },
  {
    icon: BookOpen,
    titulo: "Desarrollo profesional",
    descripcion: "Capacitación continua y posibilidades reales de crecimiento dentro de la empresa.",
  },
  {
    icon: Users,
    titulo: "Equipo humano",
    descripcion: "Un ambiente de trabajo colaborativo donde cada persona es parte del resultado final.",
  },
  {
    icon: Building2,
    titulo: "Proyectos propios",
    descripcion: "A diferencia de las grandes constructoras, participás en el proceso completo desde la idea hasta la entrega.",
  },
  {
    icon: Clock,
    titulo: "Estabilidad",
    descripcion: "Una empresa con visión de largo plazo y pipeline de proyectos asegurado para los próximos años.",
  },
];

const areas = [
  "Arquitectura",
  "Ingeniería Civil",
  "Administración",
  "Ventas y Comercial",
  "Obra / Terreno",
  "Logística",
  "Otro",
];

function PostulacionForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-6 py-8">
        <div className="w-14 h-14 border border-dorado/40 flex items-center justify-center">
          <svg className="w-6 h-6 text-dorado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-crema text-3xl font-medium mb-3">¡Postulación recibida!</h3>
          <p className="font-body text-crema/40 text-sm leading-relaxed max-w-sm">
            Gracias por tu interés. Revisaremos tu perfil y te contactaremos a la brevedad.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label className="font-body text-crema/40 text-[10px] tracking-[0.25em] uppercase mb-2 block">
            Nombre <span className="text-dorado">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            required
            className="w-full bg-transparent border-b border-crema/15 py-3.5 font-body text-crema text-sm focus:outline-none focus:border-dorado transition-colors placeholder:text-crema/20"
            placeholder="Tu nombre completo"
          />
        </div>
        <div>
          <label className="font-body text-crema/40 text-[10px] tracking-[0.25em] uppercase mb-2 block">
            Email <span className="text-dorado">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-transparent border-b border-crema/15 py-3.5 font-body text-crema text-sm focus:outline-none focus:border-dorado transition-colors placeholder:text-crema/20"
            placeholder="tu@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label className="font-body text-crema/40 text-[10px] tracking-[0.25em] uppercase mb-2 block">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            className="w-full bg-transparent border-b border-crema/15 py-3.5 font-body text-crema text-sm focus:outline-none focus:border-dorado transition-colors placeholder:text-crema/20"
            placeholder="+54 299 000 0000"
          />
        </div>
        <div>
          <label className="font-body text-crema/40 text-[10px] tracking-[0.25em] uppercase mb-2 block">
            Área de interés <span className="text-dorado">*</span>
          </label>
          <select
            name="area"
            required
            className="w-full bg-tierra border-b border-crema/15 py-3.5 font-body text-crema text-sm focus:outline-none focus:border-dorado transition-colors"
          >
            <option value="">Seleccioná un área</option>
            {areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="font-body text-crema/40 text-[10px] tracking-[0.25em] uppercase mb-2 block">Mensaje / Experiencia</label>
        <textarea
          name="mensaje"
          rows={4}
          className="w-full bg-transparent border-b border-crema/15 py-3.5 font-body text-crema text-sm focus:outline-none focus:border-dorado transition-colors placeholder:text-crema/20 resize-none"
          placeholder="Contanos sobre tu experiencia y por qué querés sumarte..."
        />
      </div>

      <div>
        <label className="font-body text-crema/40 text-[10px] tracking-[0.25em] uppercase mb-3 block">
          CV <span className="text-dorado">*</span>
          <span className="text-crema/25 normal-case tracking-normal ml-2 text-[9px]">PDF, DOC, DOCX · máx. 5MB</span>
        </label>
        <label className="inline-flex items-center gap-3 border border-crema/20 px-5 py-3 cursor-pointer hover:border-dorado transition-colors duration-200 group">
          <svg className="w-4 h-4 text-dorado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span className="font-body text-crema/50 text-[11px] tracking-[0.1em] group-hover:text-crema/70 transition-colors">
            Adjuntar CV
          </span>
          <input type="file" name="cv" accept=".pdf,.doc,.docx" className="hidden" />
        </label>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="mt-2 w-full sm:w-auto px-12 py-4 btn-shimmer text-tierra font-body text-[11px] tracking-[0.15em] font-medium uppercase disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? "Enviando..." : "Enviar postulación"}
      </button>
    </form>
  );
}

export default function SumateContent() {
  return (
    <>
      {/* Beneficios */}
      <section className="py-28 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-10 bg-dorado" />
                <span className="font-body text-dorado text-[11px] tracking-[0.25em] uppercase">Por qué elegirnos</span>
              </div>
              <h2
                className="font-display text-tierra font-medium leading-[1.05]"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.02em" }}
              >
                Lo que te{" "}
                <span className="italic text-dorado">ofrecemos</span>
              </h2>
            </div>
            <p className="font-body text-tierra/40 text-sm leading-relaxed max-w-xs">
              Más que un trabajo - una oportunidad de construir algo que dure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-tierra/8">
            {beneficios.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.titulo}
                  className="bg-[#FAFAF8] p-10 group hover:bg-tierra transition-colors duration-500 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 w-0.5 bg-dorado h-0 group-hover:h-full transition-all duration-500" />
                  <div className="text-dorado mb-5 transition-transform duration-300 group-hover:scale-110 origin-left">
                    <Icon size={28} strokeWidth={1} />
                  </div>
                  <h3 className="font-display text-tierra text-xl font-medium mb-3 group-hover:text-crema transition-colors duration-500">
                    {b.titulo}
                  </h3>
                  <p className="font-body text-tierra/50 text-sm leading-relaxed group-hover:text-crema/50 transition-colors duration-500">
                    {b.descripcion}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="py-28 bg-tierra">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-20">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-10 bg-dorado" />
                <span className="font-body text-dorado text-[11px] tracking-[0.25em] uppercase">Postulate</span>
              </div>
              <h2
                className="font-display text-crema font-medium leading-[1.05] mb-6"
                style={{ fontSize: "clamp(2rem, 3vw, 2.8rem)", letterSpacing: "-0.02em" }}
              >
                Mandanos tu{" "}
                <span className="italic text-dorado">perfil</span>
              </h2>
              <p className="font-body text-crema/40 text-sm leading-relaxed">
                Completá el formulario y adjuntá tu CV. Revisamos cada postulación
                personalmente y respondemos a todos.
              </p>
              <div className="mt-12 h-px bg-gradient-to-r from-dorado/30 to-transparent" />
            </div>
            <div className="lg:col-span-3">
              <PostulacionForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
