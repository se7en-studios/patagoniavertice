import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

// GET: List all properties (both active and inactive)
export async function GET() {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("propiedades")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error inesperado";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST: Create a new property
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getAdminSupabase();

    const nuevaPropiedad = {
      titulo: body.titulo,
      descripcion: body.descripcion || "",
      tipo: body.tipo || "lote",
      estado: body.estado || "disponible",
      precio: body.precio ? Number(body.precio) : null,
      moneda: body.moneda || "USD",
      superficie_m2: body.superficie_m2 ? Number(body.superficie_m2) : null,
      ubicacion: body.ubicacion || body.ciudad || "Neuquén",
      barrio: body.barrio || null,
      ciudad: body.ciudad || "Neuquén",
      imagenes: Array.isArray(body.imagenes) && body.imagenes.length > 0 ? body.imagenes : ["/mari-menuco/bahia-playas-1.jpg"],
      destacado: Boolean(body.destacado),
      publicado: body.publicado !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("propiedades")
      .insert([nuevaPropiedad])
      .select();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al crear la propiedad";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT: Update an existing property
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "ID de propiedad requerido" }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    const actualizacion = {
      titulo: body.titulo,
      descripcion: body.descripcion,
      tipo: body.tipo,
      estado: body.estado,
      precio: body.precio ? Number(body.precio) : null,
      moneda: body.moneda,
      superficie_m2: body.superficie_m2 ? Number(body.superficie_m2) : null,
      ubicacion: body.ubicacion,
      barrio: body.barrio,
      ciudad: body.ciudad,
      imagenes: body.imagenes,
      destacado: Boolean(body.destacado),
      publicado: Boolean(body.publicado),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("propiedades")
      .update(actualizacion)
      .eq("id", body.id)
      .select();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al actualizar la propiedad";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE: Remove a property
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID de propiedad requerido" }, { status: 400 });
    }

    const supabase = getAdminSupabase();
    const { error } = await supabase.from("propiedades").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Propiedad eliminada correctamente" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al eliminar la propiedad";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
