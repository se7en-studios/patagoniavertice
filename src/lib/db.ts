import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase";
import type { Propiedad } from "@/lib/supabase/types";

// Colecciones: propiedades, leads, leads_altum. Sin índices compuestos: se filtra/ordena en memoria
// (catálogo chico). ponytail: si el catálogo pasa de ~500 propiedades, paginar con índices.
const MAX_DOCS = 500;

const withId = <T>(d: QueryDocumentSnapshot): T =>
  ({ id: d.id, ...d.data() }) as T;
const byDateDesc = (a: { created_at?: string }, b: { created_at?: string }) =>
  (b.created_at ?? "").localeCompare(a.created_at ?? "");

// ── Propiedades (público) ──────────────────────────────────────────────
export async function listPublicadas(
  opts: { destacado?: boolean; limit?: number } = {},
): Promise<Propiedad[]> {
  const snap = await getDb()
    .collection("propiedades")
    .where("publicado", "==", true)
    .limit(MAX_DOCS)
    .get();
  let items = snap.docs.map((d) => withId<Propiedad>(d));
  if (opts.destacado) items = items.filter((p) => p.destacado);
  items.sort(
    (a, b) => Number(b.destacado) - Number(a.destacado) || byDateDesc(a, b),
  );
  return opts.limit ? items.slice(0, opts.limit) : items;
}

export async function getPublicada(id: string): Promise<Propiedad | null> {
  if (!id) return null;
  const d = await getDb().collection("propiedades").doc(id).get();
  const data = d.data();
  return d.exists && data?.publicado
    ? ({ id: d.id, ...data } as Propiedad)
    : null;
}

export async function listSimilares(
  p: Pick<Propiedad, "id" | "ciudad" | "tipo">,
  limit = 24,
): Promise<Propiedad[]> {
  const all = await listPublicadas();
  return all
    .filter(
      (x) =>
        x.id !== p.id &&
        (x.ciudad === p.ciudad || (p.tipo && x.tipo === p.tipo)),
    )
    .slice(0, limit);
}

// ── Propiedades (admin) ────────────────────────────────────────────────
export async function listTodas(): Promise<Propiedad[]> {
  const snap = await getDb().collection("propiedades").limit(MAX_DOCS).get();
  return snap.docs.map((d) => withId<Propiedad>(d)).sort(byDateDesc);
}

export async function crearPropiedad(
  data: Omit<Propiedad, "id">,
): Promise<Propiedad> {
  const ref = await getDb().collection("propiedades").add(data);
  return { id: ref.id, ...data } as Propiedad;
}

export async function actualizarPropiedad(
  id: string,
  data: Partial<Propiedad>,
): Promise<Propiedad | null> {
  const ref = getDb().collection("propiedades").doc(id);
  if (!(await ref.get()).exists) return null;
  await ref.update(data);
  return { id, ...(await ref.get()).data() } as Propiedad;
}

export async function eliminarPropiedad(id: string): Promise<void> {
  await getDb().collection("propiedades").doc(id).delete();
}

// ── Leads ──────────────────────────────────────────────────────────────
export type LeadCollection = "leads" | "leads_altum";

export async function addLead(
  collection: LeadCollection,
  data: Record<string, unknown>,
): Promise<string> {
  const ref = await getDb()
    .collection(collection)
    .add({
      ...data,
      estado: data.estado ?? "nuevo",
      created_at: new Date().toISOString(),
    });
  return ref.id;
}

/** Une las dos colecciones de leads (formulario de contacto + formularios de la landing). */
export async function listLeads(): Promise<
  Array<Record<string, unknown> & { id: string; created_at?: string }>
> {
  const db = getDb();
  const [a, b] = await Promise.all([
    db.collection("leads").limit(MAX_DOCS).get(),
    db.collection("leads_altum").limit(MAX_DOCS).get(),
  ]);
  return [...a.docs, ...b.docs]
    .map((d) => withId<{ id: string; created_at?: string }>(d))
    .sort(byDateDesc);
}

export async function updateLeadEstado(
  id: string,
  estado: string,
): Promise<Record<string, unknown> | null> {
  const db = getDb();
  for (const name of ["leads", "leads_altum"] as const) {
    const ref = db.collection(name).doc(id);
    if ((await ref.get()).exists) {
      await ref.update({ estado });
      return { id, ...(await ref.get()).data() };
    }
  }
  return null;
}
