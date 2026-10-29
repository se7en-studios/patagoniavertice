import { z } from "zod";

/* Límites compartidos por las server actions de leads.
   Deben coincidir con los CHECK de char_length en la base. */

export const MIN_FILL_MS = 3000;

export const nombreSchema = z
  .string()
  .trim()
  .min(2, "Ingresá tu nombre completo.")
  .max(120, "El nombre es demasiado largo.");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "El email es demasiado largo.")
  .email("El email no es válido.");

export const telefonoSchema = z
  .string()
  .trim()
  .max(40, "El teléfono es demasiado largo.")
  .regex(
    /^[0-9 +()-]*$/,
    "El teléfono solo puede tener números, espacios y + - ( ).",
  )
  .optional()
  .transform((v) => v || null);

export const mensajeSchema = z
  .string()
  .trim()
  .min(1, "Completá los campos obligatorios.")
  .max(5000, "El mensaje es demasiado largo.");

/** true si parece un bot: honeypot lleno o formulario enviado en < 3 s.
 *  Tolerante a desfasajes de reloj: solo descarta si 0 <= elapsed < 3000. */
export function esEnvioSospechoso(
  honeypot: unknown,
  renderedAt: unknown,
  now: number = Date.now(),
): boolean {
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;
  const ts = Number(renderedAt);
  if (!Number.isFinite(ts)) return false;
  const elapsed = now - ts;
  return elapsed >= 0 && elapsed < MIN_FILL_MS;
}
