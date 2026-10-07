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

export type ContactoState = {
  success?: boolean;
  error?: string;
};

const contactoSchema = z.object({
  nombre: nombreSchema,
  email: emailSchema,
  telefono: telefonoSchema,
  asunto: z
    .string()
    .trim()
    .max(200, "El asunto es demasiado largo.")
    .optional(),
  mensaje: mensajeSchema,
  propiedad_id: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined)
    .pipe(z.uuid("Propiedad inválida.").optional()),
});

/** FormData.get devuelve File | string | null; solo aceptamos strings. */
function campo(formData: FormData, key: string): string | undefined {
  const v = formData.get(key);
  return typeof v === "string" ? v : undefined;
}

export async function enviarConsulta(
  _prev: ContactoState,
  formData: FormData,
): Promise<ContactoState> {
  // Bots: éxito falso, sin insertar, para que no aprendan a evitarlo.
  if (
    esEnvioSospechoso(
      campo(formData, "empresa_web"),
      campo(formData, "rendered_at"),
    )
  ) {
    return { success: true };
  }

  const parsed = contactoSchema.safeParse({
    nombre: campo(formData, "nombre") ?? "",
    email: campo(formData, "email") ?? "",
    telefono: campo(formData, "telefono"),
    asunto: campo(formData, "asunto"),
    mensaje: campo(formData, "mensaje") ?? "",
    propiedad_id: campo(formData, "propiedad_id"),
  });
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Por favor completá los campos obligatorios.",
    };
  }

  const { nombre, email, telefono, asunto, mensaje, propiedad_id } =
    parsed.data;
  const mensajeFinal = asunto ? `Asunto: ${asunto}\n\n${mensaje}` : mensaje;
  if (mensajeFinal.length > 5000) {
    return { error: "El mensaje es demasiado largo." };
  }

  const supabase = createClient();
  const { error } = await supabase.from("leads").insert({
    nombre,
    email,
    telefono,
    mensaje: mensajeFinal,
    propiedad_id: propiedad_id ?? null,
    estado: "nuevo",
  });

  if (error) {
    console.error("Error inserting lead:", error);
    return { error: "Hubo un error al enviar tu consulta. Intentá de nuevo." };
  }

  return { success: true };
}
