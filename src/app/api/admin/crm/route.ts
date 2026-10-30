import { NextResponse } from "next/server";
import { CRMStoreData } from "@/lib/crm-types";
import { readCRMStore, writeCRMStore } from "@/lib/crm-server-sync";

export async function GET() {
  try {
    const data = readCRMStore();
    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al cargar CRM";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CRMStoreData;
    if (!body || !Array.isArray(body.clientes)) {
      return NextResponse.json(
        { success: false, error: "Formato de datos CRM inválido" },
        { status: 400 },
      );
    }
    writeCRMStore(body);
    return NextResponse.json({ success: true, data: body });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al guardar CRM";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
