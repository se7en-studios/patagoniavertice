"use client";

import { track } from "@/lib/analytics";
import { useFavorites } from "@/lib/favorites";
import { focusRing } from "./ui";

interface Props {
  id: string;
  titulo: string;
  /** Muestra texto al lado del corazón (ficha). */
  showLabel?: boolean;
  className?: string;
}

export default function FavoriteButton({
  id,
  titulo,
  showLabel = false,
  className = "",
}: Props) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={
        active
          ? `Quitar ${titulo} de favoritos`
          : `Guardar ${titulo} en favoritos`
      }
      onClick={() => {
        const activo = toggle(id);
        track("favorite_toggle", { id, activo });
      }}
      className={`inline-flex items-center justify-center gap-2 transition-colors ${focusRing} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3 5.5 6.2 5.5c2 0 3.4 1.1 4.1 2.3L12 10l1.7-2.2c.7-1.2 2.1-2.3 4.1-2.3 3.2 0 5 3.1 3.7 6.3C19.5 16.4 12 21 12 21z" />
      </svg>
      {showLabel && <span>{active ? "Guardada" : "Guardar"}</span>}
    </button>
  );
}
