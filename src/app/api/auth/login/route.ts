import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_OPTIONS,
  adminToken,
} from "@/lib/admin-session";

/** Email + contraseña contra Firebase Auth (Identity Toolkit REST). Requiere FIREBASE_API_KEY. */
async function firebaseSignIn(
  email: string,
  password: string,
): Promise<boolean> {
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!apiKey) return false;
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: false }),
    },
  );
  return res.ok;
}

export async function POST(request: Request) {
  try {
    const { password, email } = await request.json();
    const MASTER_PIN = process.env.ADMIN_MASTER_PIN || "altum2026";

    const ok =
      (password && String(password).trim() === MASTER_PIN) ||
      (email && password && (await firebaseSignIn(email, password)));

    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Contraseña o credenciales incorrectas" },
        { status: 401 },
      );
    }

    (await cookies()).set(
      ADMIN_COOKIE,
      await adminToken(),
      ADMIN_COOKIE_OPTIONS,
    );
    return NextResponse.json({
      success: true,
      message: "Sesión iniciada con éxito",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error al procesar el ingreso";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
