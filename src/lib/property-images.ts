const FALLBACK_COVER = "/mari-menuco/bahia-playas-2.jpg";

// Flyers con texto/precio incrustado: no sirven de portada porque chocan con los overlays de cards y héroes.
const FLYER_IMAGES: readonly string[] = [
  "/mari-menuco/bahia-playas-1.jpg",
  "/mari-menuco/bahia-playas-flyer.jpg",
];

/** Primera foto "limpia" de la propiedad; si solo hay flyers, una foto de respaldo del lago. */
export function coverImage(imagenes: string[] | null | undefined): string {
  return (
    (imagenes ?? []).find((src) => !FLYER_IMAGES.includes(src)) ??
    FALLBACK_COVER
  );
}

/** Fotos para la galería de la ficha: sin flyers y sin repetir la portada. */
export function galleryImages(
  imagenes: string[] | null | undefined,
  cover: string,
): string[] {
  return (imagenes ?? []).filter(
    (src) => src !== cover && !FLYER_IMAGES.includes(src),
  );
}
