import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { password, email } = await request.json();

    const MASTER_PIN = process.env.ADMIN_MASTER_PIN || "altum2026";

    // 1. Verificación por Master PIN / Clave Maestra de Estela
    if (password && password.trim() === MASTER_PIN) {
      (await cookies()).set("altum_admin_session", "authenticated", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 días de sesión
      });

      return NextResponse.json({ success: true, message: "Sesión iniciada con éxito" });
    }

    // 2. Verificación por Supabase Auth si se ingresó email y contraseña
    if (email && password) {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        (await cookies()).set("altum_admin_session", "authenticated", {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });
        return NextResponse.json({ success: true, message: "Sesión iniciada con éxito" });
      }
    }

    return NextResponse.json(
      { success: false, error: "Contraseña o credenciales incorrectas" },
      { status: 401 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al procesar el ingreso";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
