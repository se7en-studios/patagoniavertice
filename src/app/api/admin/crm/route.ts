import { NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";
import { CRMStoreData, DEFAULT_CRM_DATA } from "@/lib/crm-types";

const PRIMARY_PATH = path.join(process.cwd(), "src", "data", "crm-data.json");
const TMP_PATH = path.join(os.tmpdir(), "altum-crm-data.json");

function readCRMStore(): CRMStoreData {
  try {
    if (fs.existsSync(TMP_PATH)) {
      const raw = fs.readFileSync(TMP_PATH, "utf-8");
      return JSON.parse(raw) as CRMStoreData;
    }
    if (fs.existsSync(PRIMARY_PATH)) {
      const raw = fs.readFileSync(PRIMARY_PATH, "utf-8");
      return JSON.parse(raw) as CRMStoreData;
    }
  } catch (err) {
    console.error("Error reading CRM store:", err);
  }
  return DEFAULT_CRM_DATA;
}

function writeCRMStore(data: CRMStoreData): boolean {
  let saved = false;
  try {
    const dir = path.dirname(PRIMARY_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PRIMARY_PATH, JSON.stringify(data, null, 2), "utf-8");
    saved = true;
  } catch {
    // En entornos serverless (Vercel) el directorio de código es read-only; guardamos en tmpdir
  }

  try {
    fs.writeFileSync(TMP_PATH, JSON.stringify(data, null, 2), "utf-8");
    saved = true;
  } catch (err) {
    console.error("Error writing CRM store to tmp:", err);
  }

  return saved;
}

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
