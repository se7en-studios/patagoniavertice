"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { notificarLead } from "@/lib/notify-lead";

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
}

export interface LeadAltumResult {
  success: boolean;
  error?: string;
}

const schema = z
  .object({
    nombre: z.string().trim().min(2, "Ingresá tu nombre.").max(100),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("El email no es válido.")
      .max(150)
      .optional()
      .or(z.literal("")),
    telefono: z
      .string()
      .trim()
      .regex(/^[+\d\s()-]{6,30}$/, "El teléfono no es válido.")
      .optional()
      .or(z.literal("")),
    tipo_consulta: z.enum([
      "venta",
      "alquiler",
      "consultoria",
      "contratos",
      "tasacion",
      "inversion",
      "guia",
    ]),
    mensaje: z
      .string()
      .trim()
      .min(1, "Completá los campos obligatorios.")
      .max(3000),
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
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }
  const d = parsed.data;

  const supabase = createClient();
  const { error } = await supabase.from("leads_altum").insert({
    nombre: d.nombre,
    email: d.email || null,
    telefono: d.telefono || null,
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
    Teléfono: d.telefono,
    Origen: d.origen,
    Tipo: d.tipo_consulta,
    Mensaje: d.mensaje,
  });

  return { success: true };
}
