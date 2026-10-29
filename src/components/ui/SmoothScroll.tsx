"use client";

import { ReactLenis } from "lenis/react";

/**
 * Smooth scroll global con Lenis. syncTouch queda desactivado: en mobile el
 * scroll nativo es más fluido y evita jank con los parallax.
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
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
