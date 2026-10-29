import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export async function GET() {
  try {
    const supabase = getAdminSupabase();

    // Consultamos la tabla principal de leads
    const { data: leads, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback a leads_altum si existe
      const { data: leadsAltum } = await supabase
        .from("leads_altum")
        .select("*")
        .order("created_at", { ascending: false });

      return NextResponse.json({ success: true, data: leadsAltum || [] });
    }

    return NextResponse.json({ success: true, data: leads || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al obtener leads";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, estado } = await request.json();
    if (!id || !estado) {
      return NextResponse.json({ success: false, error: "ID y estado requeridos" }, { status: 400 });
    }

    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("leads")
      .update({ estado })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al actualizar lead";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
