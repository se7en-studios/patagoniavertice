"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { notificarLead } from "@/lib/notify-lead";
import {
  emailSchema,
  esEnvioSospechoso,
  mensajeSchema,
  nombreSchema,
  telefonoSchema,
} from "@/lib/validacion-leads";

export type TipoConsulta =
  | "venta"
  | "alquiler"
  | "consultoria"
  | "contratos"
  | "tasacion"
  | "inversion"
  | "guia";

export interface LeadAltumInput {
  nombre: string;
  email?: string;
  telefono?: string;
  tipo_consulta: TipoConsulta;
  mensaje: string;
  /** Dónde se capturó: "contacto", "tasador", "calculadora", "guia"... */
  origen?: string;
  /** Datos estructurados extra (inmueble, monto, etc.) */
  detalle?: Record<string, string | number>;
  /** Honeypot: debe llegar vacío. */
  empresa_web?: string;
  /** Date.now() del momento en que se renderizó el formulario. */
  renderedAt?: number;
}

export interface LeadAltumResult {
  success: boolean;
  error?: string;
}

const leadAltumSchema = z
  .object({
    nombre: nombreSchema,
    // Tasador/guía/calculadora solo piden teléfono: el email es opcional.
    email: emailSchema.optional().or(z.literal("")),
    telefono: telefonoSchema,
    tipo_consulta: z.enum(
      [
        "venta",
        "alquiler",
        "consultoria",
        "contratos",
        "tasacion",
        "inversion",
        "guia",
      ],
      { message: "Seleccioná el tipo de consulta." },
    ),
    mensaje: mensajeSchema,
    origen: z.string().trim().max(40).optional(),
    detalle: z
      .record(z.string(), z.union([z.string().max(200), z.number()]))
      .optional(),
  })
  .refine((d) => d.email || d.telefono, {
    message: "Dejanos un teléfono o un email para contactarte.",
  });

export async function guardarLeadAltum(
  data: LeadAltumInput,
): Promise<LeadAltumResult> {
  // Bots: éxito falso, sin insertar, para que no aprendan a evitarlo.
  if (esEnvioSospechoso(data?.empresa_web, data?.renderedAt)) {
    return { success: true };
  }

  const parsed = leadAltumSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error:
        parsed.error.issues[0]?.message ?? "Completá los campos obligatorios.",
    };
  }
  const d = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("leads_altum").insert({
    nombre: d.nombre,
    email: d.email || null,
    telefono: d.telefono,
    tipo_consulta: d.tipo_consulta,
    mensaje: d.mensaje,
    origen: d.origen ?? null,
    detalle: d.detalle ?? null,
    estado: "nuevo",
  });

  if (error) {
    console.error("[leads_altum] insert error:", error.message);
    return {
      success: false,
      error:
        "No pudimos enviar tu consulta. Intentá de nuevo o escribinos por WhatsApp.",
    };
  }

  await notificarLead(`Nuevo lead ALTUM SCI (${d.origen ?? d.tipo_consulta})`, {
    Nombre: d.nombre,
    Email: d.email,
    Teléfono: d.telefono ?? undefined,
    Origen: d.origen,
    Tipo: d.tipo_consulta,
    Mensaje: d.mensaje,
  });

  return { success: true };
}
