import fs from "fs";
import os from "os";
import path from "path";
import {
  CRMStoreData,
  DEFAULT_CRM_DATA,
  ClienteCRM,
  TareaCRM,
  EventoCalendario,
  TipoCliente,
  CategoriaTarea,
} from "@/lib/crm-types";

const PRIMARY_PATH = path.join(process.cwd(), "src", "data", "crm-data.json");
const TMP_PATH = path.join(os.tmpdir(), "altum-crm-data.json");

export function readCRMStore(): CRMStoreData {
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

export function writeCRMStore(data: CRMStoreData): boolean {
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

export interface WebLeadCRMInput {
  nombre: string;
  email?: string;
  telefono?: string;
  tipo_consulta: string;
  mensaje: string;
  origen?: string;
  detalle?: Record<string, string | number>;
}

export function registrarWebLeadEnCRM(input: WebLeadCRMInput): CRMStoreData {
  const store = readCRMStore();
  const nowIso = new Date().toISOString();
  const todayStr = nowIso.split("T")[0];

  const telClean = (input.telefono || "").trim();
  const emailClean = (input.email || "").trim().toLowerCase();

  // Mapear tipo_consulta a TipoCliente y CategoriaTarea
  let tipoCliente: TipoCliente = "comprador";
  let catTarea: CategoriaTarea = "comercial";

  if (input.tipo_consulta === "tasacion") {
    tipoCliente = "propietario";
    catTarea = "tasacion";
  } else if (input.tipo_consulta === "inversion" || input.origen === "calculadora") {
    tipoCliente = "inversor";
    catTarea = "comercial";
  } else if (input.tipo_consulta === "alquiler") {
    tipoCliente = "inquilino";
    catTarea = "comercial";
  } else if (input.tipo_consulta === "contratos") {
    tipoCliente = "propietario";
    catTarea = "legal_notarial";
  }

  const zonaInteres =
    (input.detalle?.localidad as string) ||
    (input.detalle?.zona as string) ||
    (input.detalle?.ciudad as string) ||
    "Mari Menuco / Alto Valle";

  const propiedadInteres =
    (input.detalle?.propiedad as string) ||
    (input.detalle?.sector as string) ||
    (input.detalle?.tipo as string) ||
    undefined;

  const fechaVisita = input.detalle?.fecha_visita as string | undefined;
  const horaVisita = (input.detalle?.hora_visita as string | undefined) || "11:00";

  // 1. Buscar si el cliente ya existe por teléfono o email
  const existingIdx = store.clientes.findIndex((c) => {
    if (telClean && c.telefono.replace(/\D/g, "").slice(-8) === telClean.replace(/\D/g, "").slice(-8) && telClean.replace(/\D/g, "").length >= 7) {
      return true;
    }
    if (emailClean && c.email && c.email.toLowerCase() === emailClean) {
      return true;
    }
    return false;
  });

  let clienteId: string;

  if (existingIdx >= 0) {
    const existing = store.clientes[existingIdx];
    clienteId = existing.id;
    store.clientes[existingIdx] = {
      ...existing,
      estado: fechaVisita ? "visita_programada" : existing.estado,
      propiedad_interes: propiedadInteres || existing.propiedad_interes,
      updated_at: nowIso,
      notas: [
        {
          id: `nota-web-${Date.now()}`,
          fecha: nowIso,
          texto: `[Consulta Web · ${input.origen || input.tipo_consulta}] ${input.mensaje}`,
          tipo: fechaVisita ? "visita" : "whatsapp",
        },
        ...existing.notas,
      ],
    };
  } else {
    clienteId = `cli-web-${Date.now()}`;
    const nuevoCliente: ClienteCRM = {
      id: clienteId,
      nombre: input.nombre,
      telefono: telClean || "Sin teléfono",
      email: input.email || "",
      tipo: tipoCliente,
      estado: fechaVisita ? "visita_programada" : "activo",
      presupuesto_usd:
        typeof input.detalle?.presupuesto_usd === "number"
          ? input.detalle.presupuesto_usd
          : null,
      zona_interes: zonaInteres,
      propiedad_interes: propiedadInteres,
      origen: `Web (${input.origen || input.tipo_consulta})`,
      prioridad: "alta",
      etiquetas: [
        "Lead Web",
        input.tipo_consulta.toUpperCase(),
        ...(fechaVisita ? ["Visita Solicitada"] : []),
      ],
      notas: [
        {
          id: `nota-web-${Date.now()}`,
          fecha: nowIso,
          texto: input.mensaje,
          tipo: fechaVisita ? "visita" : "nota",
        },
      ],
      proximo_contacto: fechaVisita || todayStr,
      created_at: nowIso,
      updated_at: nowIso,
    };
    store.clientes = [nuevoCliente, ...store.clientes];
  }

  // 2. Crear Tarea automática para Estela en /admin/tareas
  const tituloTarea =
    input.tipo_consulta === "tasacion"
      ? `Responder solicitud de tasación: ${input.nombre} (${zonaInteres})`
      : fechaVisita
        ? `Confirmar visita agendada con ${input.nombre} (${propiedadInteres || zonaInteres})`
        : `Contactar consulta web de ${input.nombre} (${propiedadInteres || input.tipo_consulta})`;

  const nuevaTarea: TareaCRM = {
    id: `tar-web-${Date.now()}`,
    titulo: tituloTarea,
    descripcion: `${input.mensaje}${telClean ? ` · Tel/WA: ${telClean}` : ""}`,
    categoria: fechaVisita ? "visita" : catTarea,
    prioridad: "alta",
    estado: "pendiente",
    fecha_vencimiento: fechaVisita || todayStr,
    hora: horaVisita,
    cliente_id: clienteId,
    cliente_nombre: input.nombre,
    propiedad_titulo: propiedadInteres || zonaInteres,
    subtareas: [
      {
        id: `sub-${Date.now()}-1`,
        texto: "Contactar por WhatsApp / Teléfono",
        completada: false,
      },
      {
        id: `sub-${Date.now()}-2`,
        texto:
          input.tipo_consulta === "tasacion"
            ? "Coordinar inspección y relevamiento dominial"
            : "Enviar ficha técnica y coordinar visita",
        completada: false,
      },
    ],
    created_at: nowIso,
  };
  store.tareas = [nuevaTarea, ...store.tareas];

  // 3. Si solicitó visita con fecha, agendar en /admin/calendario
  if (fechaVisita) {
    const nuevoEvento: EventoCalendario = {
      id: `ev-web-${Date.now()}`,
      titulo: `Visita Web: ${propiedadInteres || zonaInteres}`,
      tipo: input.tipo_consulta === "tasacion" ? "tasacion" : "visita",
      estado: "programado",
      fecha: fechaVisita,
      hora_inicio: horaVisita,
      ubicacion: zonaInteres,
      cliente_nombre: input.nombre,
      cliente_telefono: telClean,
      propiedad_titulo: propiedadInteres,
      notas: input.mensaje,
      created_at: nowIso,
    };
    store.eventos = [nuevoEvento, ...store.eventos];
  }

  writeCRMStore(store);
  return store;
}

