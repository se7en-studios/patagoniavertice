"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { focusRing } from "./ui";

interface Props {
  titulo: string;
  /** Ruta relativa a compartir; si falta se comparte la URL actual (con filtros). */
  path?: string;
  label?: string;
  className?: string;
}

export default function ShareButton({
  titulo,
  path,
  label = "Compartir",
  className = "",
}: Props) {
  const [msg, setMsg] = useState("");

  const flash = (m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(""), 2500);
  };

  const onClick = async () => {
    const url = path
      ? new URL(path, window.location.origin).toString()
      : window.location.href;
    track("share_click", { titulo, url });
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: titulo, url });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        /* otro error: cae al copiado */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("Link copiado");
    } catch {
      flash("No se pudo copiar");
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${titulo}`}
      className={`inline-flex items-center justify-center gap-2 transition-colors ${focusRing} ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
      </svg>
      <span>{msg || label}</span>
      <span role="status" aria-live="polite" className="sr-only">
        {msg}
      </span>
    </button>
  );
}
