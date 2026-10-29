import { NextResponse } from "next/server";
import { getSiteConfig, saveSiteConfig, SiteConfig } from "@/lib/site-config";

export async function GET() {
  try {
    const config = getSiteConfig();
    return NextResponse.json({ success: true, data: config });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al obtener configuración";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SiteConfig;
    if (!body || !body.perfil) {
      return NextResponse.json({ success: false, error: "Datos de configuración incompletos" }, { status: 400 });
    }

    const saved = saveSiteConfig(body);
    if (!saved) {
      return NextResponse.json({ success: false, error: "No se pudo guardar la configuración" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: body });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al guardar la configuración";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
