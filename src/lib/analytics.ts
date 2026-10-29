// Eventos de analítica. No hace nada si GA4 no está configurado (NEXT_PUBLIC_GA_ID).

export type AnalyticsEvent =
  | "whatsapp_click"
  | "lead_submit"
  | "tasador_start"
  | "tasador_complete"
  | "calculadora_use"
  | "guia_download"
  | "search_submit"
  | "favorite_toggle"
  | "compare_open"
  | "share_click"
  | "cta_click";

type GtagFn = (
  command: "event",
  name: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

export function track(
  event: AnalyticsEvent,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
}
