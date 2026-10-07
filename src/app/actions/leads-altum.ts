"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  emailSchema,
  esEnvioSospechoso,
  mensajeSchema,
  nombreSchema,
  telefonoSchema,
} from "@/lib/validacion-leads";

export type TipoConsulta = "venta" | "alquiler" | "consultoria" | "contratos";

export interface LeadAltumInput {
  nombre: string;
  email: string;
  telefono?: string;
  tipo_consulta: TipoConsulta;
  mensaje: string;
  /** Honeypot: debe llegar vacío. */
  empresa_web?: string;
  /** Date.now() del momento en que se renderizó el formulario. */
  renderedAt?: number;
}

export interface LeadAltumResult {
  success: boolean;
  error?: string;
}

const leadAltumSchema = z.object({
  nombre: nombreSchema,
  email: emailSchema,
  telefono: telefonoSchema,
  tipo_consulta: z.enum(["venta", "alquiler", "consultoria", "contratos"], {
    message: "Seleccioná el tipo de consulta.",
  }),
  mensaje: mensajeSchema,
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

  const supabase = createClient();

  const { error } = await supabase.from("leads_altum").insert({
    ...parsed.data,
    estado: "nuevo",
  });

  if (error) {
    console.error("[leads_altum] insert error:", error.message);
    return { success: false, error: "Error al enviar. Intentá de nuevo." };
  }

  return { success: true };
}
