import { NextResponse } from "next/server";
import { CRMStoreData } from "@/lib/crm-types";
import { readCRMStore, writeCRMStore } from "@/lib/crm-server-sync";

// Auth: middleware (matcher /api/admin/*)
// serverTime: el admin lo devuelve en el POST (`since`) para que el servidor sepa qué registros ya vio.
export async function GET() {
  try {
    const data = await readCRMStore();
    return NextResponse.json({
      success: true,
      data,
      serverTime: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al cargar CRM";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { since, ...body } = (await request.json()) as CRMStoreData & {
      since?: string;
    };
    if (
      !body ||
      !Array.isArray(body.clientes) ||
      !Array.isArray(body.tareas) ||
      !Array.isArray(body.eventos)
    ) {
      return NextResponse.json(
        { success: false, error: "Formato de datos CRM inválido" },
        { status: 400 },
      );
    }
    const data = await writeCRMStore(
      { ...body, leadsMeta: body.leadsMeta ?? {} },
      typeof since === "string" ? since : undefined,
    );
    return NextResponse.json({
      success: true,
      data,
      serverTime: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al guardar CRM";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
