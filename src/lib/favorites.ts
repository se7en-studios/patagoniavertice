"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// Favoritos solo en el navegador (localStorage). Si el storage falla (modo privado,
// cookies bloqueadas) igual funcionan durante la sesión, guardados en memoria.
const KEY = "altum:favoritos";

let snapshot = "[]";
let loaded = false;
const listeners = new Set<() => void>();

function parseIds(raw: string): string[] {
  try {
    const v: unknown = JSON.parse(raw);
    return Array.isArray(v)
      ? v.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

function load(): void {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) snapshot = JSON.stringify(parseIds(raw));
  } catch {
    /* storage no disponible: queda en memoria */
  }
}

function emit(): void {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    snapshot = e.newValue ? JSON.stringify(parseIds(e.newValue)) : "[]";
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): string {
  load();
  return snapshot;
}

/** Agrega o quita el id. Devuelve true si quedó como favorito. */
export function toggleFavorite(id: string): boolean {
  load();
  const ids = parseIds(snapshot);
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  snapshot = JSON.stringify(next);
  try {
    window.localStorage.setItem(KEY, snapshot);
  } catch {
    /* storage no disponible: queda en memoria */
  }
  emit();
  return next.includes(id);
}

export function useFavorites(): {
  ids: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => boolean;
} {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const ids = useMemo(() => parseIds(raw), [raw]);
  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);
  return { ids, isFavorite, toggle: toggleFavorite };
}
