"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import { guardarLeadAltum, type TipoConsulta } from "@/app/actions/leads-altum";

/* ── Schema Zod ──────────────────────────────────────────────────────────── */

const schema = z.object({
  nombre: z.string().min(2, "Ingresá tu nombre completo").max(100),
  email: z.string().email("Ingresá un email válido"),
  telefono: z.string().max(30).optional().or(z.literal("")),
  tipo_consulta: z
    .enum(["venta", "alquiler", "consultoria", "contratos"] as const)
    .refine((v) => v !== undefined, {
      message: "Seleccioná el tipo de consulta",
    }),
  mensaje: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(2000),
});

type FormValues = z.infer<typeof schema>;

/* ── Labels y opciones ───────────────────────────────────────────────────── */

const TIPOS: { value: TipoConsulta; label: string }[] = [
  { value: "venta", label: "Venta" },
  { value: "alquiler", label: "Alquiler" },
  { value: "consultoria", label: "Consultoría" },
  { value: "contratos", label: "Contratos" },
];

/* ── Estilos compartidos ─────────────────────────────────────────────────── */

const inputBase =
  "w-full bg-transparent border-b border-tierra/15 py-3.5 font-body text-tierra text-sm " +
  "focus:outline-none focus:border-dorado transition-colors duration-200 placeholder:text-tierra/25";

const labelBase =
  "font-body text-tierra/40 text-[10px] tracking-[0.25em] uppercase mb-2 block";

/* ── Toast interno ───────────────────────────────────────────────────────── */

type ToastState = { type: "success" | "error"; message: string } | null;

function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onClose, 4500);
    return () => clearTimeout(id);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      role="alert"
      className={`
        fixed bottom-6 right-6 z-50 flex items-start gap-3
        px-5 py-4 max-w-sm
        border font-body text-sm leading-relaxed
        animate-fade-in-up
        ${
          isSuccess
            ? "bg-[#0D1628] border-dorado/30 text-crema"
            : "bg-red-950 border-red-500/30 text-red-100"
        }
      `}
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
    >
      {/* Icon */}
      <span className="shrink-0 mt-0.5">
        {isSuccess ? (
          <svg
            className="w-4 h-4 text-dorado"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </span>
      <span>{toast.message}</span>
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="ml-auto shrink-0 opacity-40 hover:opacity-80 transition-opacity"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

import { useSearchParams } from "next/navigation";

export default function FormularioContacto() {
  const [toast, setToast] = useState<ToastState>(null);
  // Anti-spam: momento de render + honeypot (los valida el servidor).
  const [renderedAt] = useState(() => Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo_consulta: "venta",
    },
  });

  const propiedadQuery = searchParams.get("propiedad");

  useEffect(() => {
    if (propiedadQuery) {
      setValue(
        "mensaje",
        `Hola, quisiera recibir más información y coordinar una visita para la propiedad: ${propiedadQuery}.`,
        { shouldValidate: true }
      );
      setValue("tipo_consulta", "venta", { shouldValidate: true });
    }
  }, [propiedadQuery, setValue]);

  const tipoSeleccionado = watch("tipo_consulta");

  const onSubmit = async (data: FormValues) => {
    const result = await guardarLeadAltum({
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono || undefined,
      tipo_consulta: data.tipo_consulta,
      mensaje: data.mensaje,
      empresa_web: honeypotRef.current?.value,
      renderedAt,
    });

    if (result.success) {
      setToast({
        type: "success",
        message: "Consulta enviada. Te contactamos a la brevedad.",
      });
      reset();
    } else {
      setToast({
        type: "error",
        message: result.error ?? "Error al enviar. Intentá de nuevo.",
      });
    }
  };

  return (
    <>
      {propiedadQuery && (
        <div className="mb-6 p-4 border border-dorado/40 bg-dorado/10 text-tierra font-body text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-dorado font-bold">✦</span>
            <span>
              Consultando sobre: <strong>{propiedadQuery}</strong>
            </span>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-8"
      >
        {/* Honeypot: invisible para personas, los bots lo completan */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}
        >
          <label>
            Empresa web
            <input
              ref={honeypotRef}
              type="text"
              name="empresa_web"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </label>
        </div>

        {/* Nombre + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label className={labelBase}>
              Nombre <span className="text-dorado">*</span>
            </label>
            <input
              type="text"
              placeholder="Tu nombre completo"
              className={inputBase}
              {...register("nombre")}
            />
            {errors.nombre && (
              <p className="font-body text-red-600 text-[11px] mt-1.5">
                {errors.nombre.message}
              </p>
            )}
          </div>
          <div>
            <label className={labelBase}>
              Email <span className="text-dorado">*</span>
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className={inputBase}
              {...register("email")}
            />
            {errors.email && (
              <p className="font-body text-red-600 text-[11px] mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label className={labelBase}>Teléfono</label>
          <input
            type="tel"
            placeholder="+54 299 000 0000"
            className={inputBase}
            {...register("telefono")}
          />
        </div>

        {/* Tipo de consulta - pills */}
        <div>
          <label className={labelBase}>
            Tipo de consulta <span className="text-dorado">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {TIPOS.map((t) => {
              const selected = tipoSeleccionado === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() =>
                    setValue("tipo_consulta", t.value, { shouldValidate: true })
                  }
                  className={`
                    font-body text-[10px] tracking-[0.18em] uppercase px-4 py-2
                    border transition-all duration-200
                    ${
                      selected
                        ? "border-dorado bg-dorado/10 text-tierra"
                        : "border-tierra/15 text-tierra/40 hover:border-tierra/30 hover:text-tierra/60"
                    }
                  `}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          {errors.tipo_consulta && (
            <p className="font-body text-red-600 text-[11px] mt-1.5">
              {errors.tipo_consulta.message}
            </p>
          )}
        </div>

        {/* Mensaje */}
        <div>
          <label className={labelBase}>
            Mensaje <span className="text-dorado">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Contanos qué estás buscando..."
            className={inputBase}
            {...register("mensaje")}
          />
          {errors.mensaje && (
            <p className="font-body text-red-600 text-[11px] mt-1.5">
              {errors.mensaje.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            mt-2 w-full sm:w-auto px-12 py-4
            bg-tierra text-crema
            font-body text-[11px] tracking-[0.15em] font-medium uppercase
            hover:bg-dorado transition-colors duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2.5
          "
        >
          {isSubmitting ? (
            <>
              <svg
                className="w-3.5 h-3.5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Enviando...
            </>
          ) : (
            "Enviar consulta"
          )}
        </button>
      </form>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
