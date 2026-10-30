"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ClienteCRM,
  CRMStoreData,
  DEFAULT_CRM_DATA,
  EventoCalendario,
  LeadMetaCRM,
  NotaCliente,
  TareaCRM,
} from "@/lib/crm-types";

const STORAGE_KEY = "altum_crm_store_v1";

export function useCRM() {
  const [store, setStore] = useState<CRMStoreData>(DEFAULT_CRM_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carga inicial combinando API y localStorage
  useEffect(() => {
    let mounted = true;
    async function init() {
      let localData: CRMStoreData | null = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          localData = JSON.parse(raw) as CRMStoreData;
          if (mounted && localData?.clientes) {
            setStore(localData);
          }
        }
      } catch {
        // Ignore localStorage parse errors
      }

      try {
        const res = await fetch("/api/admin/crm");
        const json = await res.json();
        if (mounted && json.success && json.data) {
          const serverData = json.data as CRMStoreData;
          if (!localData) {
            setStore(serverData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
          } else {
            // Combinar nuevos registros creados desde formularios web en el servidor con localStorage
            const localClienteIds = new Set(localData.clientes.map((c) => c.id));
            const nuevosClientesServer = (serverData.clientes || []).filter(
              (c) => !localClienteIds.has(c.id),
            );
            const localTareaIds = new Set(localData.tareas.map((t) => t.id));
            const nuevasTareasServer = (serverData.tareas || []).filter(
              (t) => !localTareaIds.has(t.id),
            );
            const localEventoIds = new Set(localData.eventos.map((e) => e.id));
            const nuevosEventosServer = (serverData.eventos || []).filter(
              (e) => !localEventoIds.has(e.id),
            );

            const merged: CRMStoreData = {
              clientes: [...nuevosClientesServer, ...localData.clientes],
              tareas: [...nuevasTareasServer, ...localData.tareas],
              eventos: [...nuevosEventosServer, ...localData.eventos],
              leadsMeta: { ...serverData.leadsMeta, ...localData.leadsMeta },
            };
            setStore(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          }
        }
      } catch {
        // Fallback a localData o DEFAULT_CRM_DATA
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (next: CRMStoreData) => {
    setStore(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
    setSaving(true);
    try {
      await fetch("/api/admin/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
    } catch {
      // Silencioso: ya quedó guardado en localStorage
    } finally {
      setSaving(false);
    }
  }, []);

  // ── Acciones de Clientes ──────────────────────────────────────────────────
  const guardarCliente = useCallback(
    async (cliente: Omit<ClienteCRM, "id" | "created_at" | "updated_at"> & { id?: string }) => {
      const ahora = new Date().toISOString();
      let nuevosClientes: ClienteCRM[];

      if (cliente.id) {
        nuevosClientes = store.clientes.map((c) =>
          c.id === cliente.id
            ? {
                ...c,
                ...cliente,
                id: c.id,
                updated_at: ahora,
              }
            : c,
        );
      } else {
        const nuevo: ClienteCRM = {
          ...cliente,
          id: `cli-${Date.now()}`,
          created_at: ahora,
          updated_at: ahora,
        };
        nuevosClientes = [nuevo, ...store.clientes];
      }

      await persist({ ...store, clientes: nuevosClientes });
    },
    [store, persist],
  );

  const eliminarCliente = useCallback(
    async (id: string) => {
      await persist({
        ...store,
        clientes: store.clientes.filter((c) => c.id !== id),
      });
    },
    [store, persist],
  );

  const agregarNotaCliente = useCallback(
    async (
      clienteId: string,
      texto: string,
      tipo: NotaCliente["tipo"] = "nota",
    ) => {
      const nuevaNota: NotaCliente = {
        id: `nota-${Date.now()}`,
        fecha: new Date().toISOString(),
        texto,
        tipo,
      };
      const nuevosClientes = store.clientes.map((c) =>
        c.id === clienteId
          ? {
              ...c,
              notas: [nuevaNota, ...(c.notas || [])],
              updated_at: new Date().toISOString(),
            }
          : c,
      );
      await persist({ ...store, clientes: nuevosClientes });
    },
    [store, persist],
  );

  // ── Acciones de Tareas ────────────────────────────────────────────────────
  const guardarTarea = useCallback(
    async (tarea: Omit<TareaCRM, "id" | "created_at"> & { id?: string }) => {
      const ahora = new Date().toISOString();
      let nuevasTareas: TareaCRM[];

      if (tarea.id) {
        nuevasTareas = store.tareas.map((t) =>
          t.id === tarea.id ? { ...t, ...tarea, id: t.id } : t,
        );
      } else {
        const nueva: TareaCRM = {
          ...tarea,
          id: `tar-${Date.now()}`,
          created_at: ahora,
        };
        nuevasTareas = [nueva, ...store.tareas];
      }

      await persist({ ...store, tareas: nuevasTareas });
    },
    [store, persist],
  );

  const cambiarEstadoTarea = useCallback(
    async (id: string, estado: TareaCRM["estado"]) => {
      const nuevasTareas = store.tareas.map((t) =>
        t.id === id ? { ...t, estado } : t,
      );
      await persist({ ...store, tareas: nuevasTareas });
    },
    [store, persist],
  );

  const toggleSubtarea = useCallback(
    async (tareaId: string, subtareaId: string) => {
      const nuevasTareas = store.tareas.map((t) => {
        if (t.id !== tareaId) return t;
        return {
          ...t,
          subtareas: (t.subtareas || []).map((st) =>
            st.id === subtareaId ? { ...st, completada: !st.completada } : st,
          ),
        };
      });
      await persist({ ...store, tareas: nuevasTareas });
    },
    [store, persist],
  );

  const eliminarTarea = useCallback(
    async (id: string) => {
      await persist({
        ...store,
        tareas: store.tareas.filter((t) => t.id !== id),
      });
    },
    [store, persist],
  );

  // ── Acciones de Calendario / Eventos ──────────────────────────────────────
  const guardarEvento = useCallback(
    async (
      evento: Omit<EventoCalendario, "id" | "created_at"> & { id?: string },
    ) => {
      const ahora = new Date().toISOString();
      let nuevosEventos: EventoCalendario[];

      if (evento.id) {
        nuevosEventos = store.eventos.map((ev) =>
          ev.id === evento.id ? { ...ev, ...evento, id: ev.id } : ev,
        );
      } else {
        const nuevo: EventoCalendario = {
          ...evento,
          id: `ev-${Date.now()}`,
          created_at: ahora,
        };
        nuevosEventos = [...store.eventos, nuevo];
      }

      await persist({ ...store, eventos: nuevosEventos });
    },
    [store, persist],
  );

  const cambiarEstadoEvento = useCallback(
    async (id: string, estado: EventoCalendario["estado"]) => {
      const nuevosEventos = store.eventos.map((ev) =>
        ev.id === id ? { ...ev, estado } : ev,
      );
      await persist({ ...store, eventos: nuevosEventos });
    },
    [store, persist],
  );

  const eliminarEvento = useCallback(
    async (id: string) => {
      await persist({
        ...store,
        eventos: store.eventos.filter((ev) => ev.id !== id),
      });
    },
    [store, persist],
  );

  // ── Meta de Leads y Conversión a Cliente ──────────────────────────────────
  const guardarLeadMeta = useCallback(
    async (leadId: string, patch: Partial<LeadMetaCRM>) => {
      const actual = store.leadsMeta[leadId] || { lead_id: leadId };
      const nuevoMeta = {
        ...store.leadsMeta,
        [leadId]: { ...actual, ...patch },
      };
      await persist({ ...store, leadsMeta: nuevoMeta });
    },
    [store, persist],
  );

  return {
    clientes: store.clientes,
    tareas: store.tareas,
    eventos: store.eventos,
    leadsMeta: store.leadsMeta,
    loading,
    saving,
    guardarCliente,
    eliminarCliente,
    agregarNotaCliente,
    guardarTarea,
    cambiarEstadoTarea,
    toggleSubtarea,
    eliminarTarea,
    guardarEvento,
    cambiarEstadoEvento,
    eliminarEvento,
    guardarLeadMeta,
  };
}
