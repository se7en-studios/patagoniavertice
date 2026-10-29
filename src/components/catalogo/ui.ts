export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dorado";

export const tipoLabel: Record<string, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
  desarrollo: "Desarrollo",
  lote: "Lote / Terreno",
  chacra: "Chacra",
};

export const estadoLabel: Record<string, string> = {
  disponible: "Disponible",
  en_construccion: "A estrenar / En pozo",
  reservado: "Reservado",
  vendido: "Vendido",
};

export function formatPrecio(
  precio: number | null | undefined,
  moneda: string,
): string {
  return precio ? `${moneda} ${precio.toLocaleString("es-AR")}` : "Consultar";
}
