"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { notificarLead } from "@/lib/notify-lead";

export type ContactoState = {
  success?: boolean;
  error?: string;
};

const schema = z.object({
  nombre: z.string().trim().min(1).max(100),
  email: z.string().trim().min(1).max(150),
  telefono: z.string().trim().max(30).optional(),
  asunto: z.string().trim().max(150).optional(),
  mensaje: z.string().trim().min(1).max(3000),
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function enviarConsulta(
  _prev: ContactoState,
  formData: FormData,
): Promise<ContactoState> {
  const parsed = schema.safeParse({
    nombre: formData.get("nombre") ?? "",
    email: formData.get("email") ?? "",
    telefono: formData.get("telefono") ?? undefined,
    asunto: formData.get("asunto") ?? undefined,
    mensaje: formData.get("mensaje") ?? "",
  });
  if (!parsed.success) {
    return { error: "Por favor completá los campos obligatorios." };
  }
  const d = parsed.data;
  if (!EMAIL_REGEX.test(d.email)) {
    return { error: "El email ingresado no es válido." };
  }
  const mensaje = d.asunto ? `Asunto: ${d.asunto}\n\n${d.mensaje}` : d.mensaje;

  const supabase = createClient();
  const { error } = await supabase.from("leads").insert({
    nombre: d.nombre,
    email: d.email,
    telefono: d.telefono || null,
    mensaje,
    estado: "nuevo",
  });

  if (error) {
    console.error("Error inserting lead:", error);
    return { error: "Hubo un error al enviar tu consulta. Intentá de nuevo." };
  }

  await notificarLead("Nuevo lead ALTUM SCI (contacto)", {
    Nombre: d.nombre,
    Email: d.email,
    Teléfono: d.telefono,
    Mensaje: mensaje,
  });

  return { success: true };
}
