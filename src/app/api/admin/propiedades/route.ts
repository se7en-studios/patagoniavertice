import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  actualizarPropiedad,
  crearPropiedad,
  eliminarPropiedad,
  listTodas,
} from "@/lib/db";

// Auth: middleware (matcher /api/admin/*)
const fail = (err: unknown, fallback: string) =>
  NextResponse.json(
    { success: false, error: err instanceof Error ? err.message : fallback },
    { status: 500 },
  );

const num = (v: unknown) => (v ? Number(v) : null);

// Toda escritura del admin regenera la landing al instante (home, catálogo, fichas, sitemap)
const refreshLanding = () => revalidatePath("/", "layout");

// GET: List all properties (both active and inactive)
export async function GET() {
  try {
    return NextResponse.json({ success: true, data: await listTodas() });
  } catch (err) {
    return fail(err, "Error inesperado");
  }
}

// POST: Create a new property
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const data = await crearPropiedad({
      titulo: body.titulo,
      descripcion: body.descripcion || "",
      tipo: body.tipo || "lote",
      estado: body.estado || "disponible",
      precio: num(body.precio),
      moneda: body.moneda || "USD",
      superficie_m2: num(body.superficie_m2),
      ubicacion: body.ubicacion || body.ciudad || "Neuquén",
      barrio: body.barrio || null,
      ciudad: body.ciudad || "Neuquén",
      imagenes:
        Array.isArray(body.imagenes) && body.imagenes.length > 0
          ? body.imagenes
          : ["/mari-menuco/bahia-playas-1.jpg"],
      destacado: Boolean(body.destacado),
      publicado: body.publicado !== false,
      created_at: now,
      updated_at: now,
    });

    refreshLanding();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return fail(err, "Error al crear la propiedad");
  }
}

// PUT: Update an existing property
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "ID de propiedad requerido" },
        { status: 400 },
      );
    }

    const data = await actualizarPropiedad(String(body.id), {
      titulo: body.titulo,
      descripcion: body.descripcion,
      tipo: body.tipo,
      estado: body.estado,
      precio: num(body.precio),
      moneda: body.moneda,
      superficie_m2: num(body.superficie_m2),
      ubicacion: body.ubicacion,
      barrio: body.barrio ?? null,
      ciudad: body.ciudad,
      imagenes: body.imagenes,
      destacado: Boolean(body.destacado),
      publicado: Boolean(body.publicado),
      updated_at: new Date().toISOString(),
    });

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Propiedad no encontrada" },
        { status: 404 },
      );
    }
    refreshLanding();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return fail(err, "Error al actualizar la propiedad");
  }
}

// DELETE: Remove a property
export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID de propiedad requerido" },
        { status: 400 },
      );
    }

    await eliminarPropiedad(id);
    refreshLanding();
    return NextResponse.json({
      success: true,
      message: "Propiedad eliminada correctamente",
    });
  } catch (err) {
    return fail(err, "Error al eliminar la propiedad");
  }
}
