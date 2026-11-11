export const ADMIN_COOKIE = "altum_admin_session";
export const ADMIN_COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7, // 7 días
};

/** Token de sesión derivado de un secreto (no adivinable como el viejo valor fijo "authenticated"). Web Crypto: sirve en middleware (edge) y en rutas (node). */
export async function adminToken(): Promise<string> {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_MASTER_PIN ||
    "altum2026";
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`altum-admin:${secret}`),
  );
  return Array.from(new Uint8Array(hash), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export async function isValidAdminCookie(value?: string): Promise<boolean> {
  return !!value && value === (await adminToken());
}
