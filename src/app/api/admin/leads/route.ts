import { NextResponse } from "next/server";
import { listLeads, updateLeadEstado } from "@/lib/db";

// Auth: middleware (matcher /api/admin/*)
export async function GET() {
  try {
    return NextResponse.json({ success: true, data: await listLeads() });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error al obtener leads";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, estado } = await request.json();
    if (!id || !estado) {
      return NextResponse.json(
        { success: false, error: "ID y estado requeridos" },
        { status: 400 },
      );
    }

    const data = await updateLeadEstado(String(id), String(estado));
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Lead no encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Error al actualizar lead";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
