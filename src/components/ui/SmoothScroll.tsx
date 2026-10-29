"use client";

import { ReactLenis } from "lenis/react";

/**
 * Smooth scroll global con Lenis optimizado para respuesta inmediata sin lag.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.14,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
