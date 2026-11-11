import type { WriteBatch } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase";
import {
  CRMStoreData,
  DEFAULT_CRM_DATA,
  ClienteCRM,
  TareaCRM,
  EventoCalendario,
  TipoCliente,
  CategoriaTarea,
} from "@/lib/crm-types";

// Firestore: un documento por registro en crm_clientes / crm_tareas / crm_eventos,
// y crm_meta/leads { items } para leadsMeta. Solo se escriben los documentos que cambiaron.
const LIST_KEYS = ["clientes", "tareas", "eventos"] as const;
type ListKey = (typeof LIST_KEYS)[number];
const COLLECTION: Record<ListKey, string> = {
  clientes: "crm_clientes",
  tareas: "crm_tareas",
  eventos: "crm_eventos",
};
const BATCH_LIMIT = 400;

type Rec = { id: string; created_at?: string };
type Existing = Map<string, { json: string; created_at: string; rec: Rec }>;
interface Snapshot {
  store: CRMStoreData;
  existing: Record<ListKey, Existing>;
  metaJson: string | null;
  empty: boolean;
}

const clean = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const newestFirst = (a: Rec, b: Rec) =>
  (b.created_at ?? "").localeCompare(a.created_at ?? "");

/** JSON con claves ordenadas: Firestore devuelve los campos en otro orden que el guardado. */
function stable(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return `{${Object.keys(o)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stable(o[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(v) ?? "null";
}

async function loadSnapshot(): Promise<Snapshot> {
  const db = getDb();
  const [clientes, tareas, eventos, meta] = await Promise.all([
    db.collection(COLLECTION.clientes).get(),
    db.collection(COLLECTION.tareas).get(),
    db.collection(COLLECTION.eventos).get(),
    db.collection("crm_meta").doc("leads").get(),
  ]);

  const existing = {} as Record<ListKey, Existing>;
  const lists = {} as Record<ListKey, Rec[]>;
  [clientes, tareas, eventos].forEach((snap, i) => {
    const k = LIST_KEYS[i];
    existing[k] = new Map();
    lists[k] = snap.docs
      .map((d) => ({ ...d.data(), id: d.id }) as Rec)
      .sort(newestFirst);
    for (const rec of lists[k]) {
      existing[k].set(rec.id, {
        json: stable(rec),
        created_at: rec.created_at ?? "",
        rec,
      });
    }
  });

  const items = (meta.data()?.items ?? {}) as CRMStoreData["leadsMeta"];
  const empty = LIST_KEYS.every((k) => lists[k].length === 0) && !meta.exists;
  // Sin datos todavía: se muestra (y se siembra al primer guardado) el contenido de ejemplo, como antes.
  const store: CRMStoreData = empty
    ? clean(DEFAULT_CRM_DATA)
    : ({
        clientes: lists.clientes,
        tareas: lists.tareas,
        eventos: lists.eventos,
        leadsMeta: items,
      } as CRMStoreData);

  return {
    store,
    existing,
    metaJson: meta.exists ? stable(items) : null,
    empty,
  };
}

/**
 * Persiste `store` contra lo que hay en Firestore. Escribe solo lo que cambió.
 * Con `deleteSince`, borra los registros que ya no vienen en `store` y que existían antes de esa
 * fecha (el admin los vio y los eliminó); los más nuevos (leads web) se conservan y se devuelven.
 */
async function syncStore(
  store: CRMStoreData,
  snap: Snapshot,
  deleteSince?: string,
): Promise<CRMStoreData> {
  const db = getDb();
  const ops: Array<(b: WriteBatch) => void> = [];
  const merged: CRMStoreData = { ...store };

  for (const k of LIST_KEYS) {
    const incoming = store[k] as Rec[];
    const col = db.collection(COLLECTION[k]);
    const ids = new Set(incoming.map((r) => r.id));

    for (const rec of incoming) {
      if (snap.existing[k].get(rec.id)?.json !== stable(rec)) {
        ops.push((b) => b.set(col.doc(rec.id), clean(rec)));
      }
    }

    const survivors: Rec[] = [];
    for (const [id, prev] of snap.existing[k]) {
      if (ids.has(id)) continue;
      const seenByAdmin =
        deleteSince !== undefined &&
        (!prev.created_at || prev.created_at <= deleteSince);
      if (seenByAdmin) ops.push((b) => b.delete(col.doc(id)));
      else survivors.push(prev.rec);
    }
    (merged as unknown as Record<ListKey, Rec[]>)[k] = [
      ...survivors,
      ...incoming,
    ].sort(newestFirst);
  }

  if (snap.metaJson !== stable(store.leadsMeta ?? {})) {
    ops.push((b) =>
      b.set(db.collection("crm_meta").doc("leads"), {
        items: clean(store.leadsMeta ?? {}),
      }),
    );
  }

  for (let i = 0; i < ops.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    ops.slice(i, i + BATCH_LIMIT).forEach((op) => op(batch));
    await batch.commit();
  }
  return merged;
}

export async function readCRMStore(): Promise<CRMStoreData> {
  return (await loadSnapshot()).store;
}

/** Guardado desde el admin. `since` = momento (hora del servidor) en que el admin cargó el CRM por última vez. */
export async function writeCRMStore(
  data: CRMStoreData,
  since?: string,
): Promise<CRMStoreData> {
  return syncStore(data, await loadSnapshot(), since);
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

export async function registrarWebLeadEnCRM(
  input: WebLeadCRMInput,
): Promise<CRMStoreData> {
  const snap = await loadSnapshot();
  const store = snap.store;
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
  } else if (
    input.tipo_consulta === "inversion" ||
    input.origen === "calculadora"
  ) {
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
  const horaVisita =
    (input.detalle?.hora_visita as string | undefined) || "11:00";

  // 1. Buscar si el cliente ya existe por teléfono o email
  const existingIdx = store.clientes.findIndex((c) => {
    if (
      telClean &&
      c.telefono.replace(/\D/g, "").slice(-8) ===
        telClean.replace(/\D/g, "").slice(-8) &&
      telClean.replace(/\D/g, "").length >= 7
    ) {
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

  // Sin deleteSince: solo agrega/actualiza, nunca borra lo que el admin tenga.
  // ponytail: lectura-modificación-escritura sin transacción; la ventana de carrera es de milisegundos.
  return syncStore(store, snap);
}
