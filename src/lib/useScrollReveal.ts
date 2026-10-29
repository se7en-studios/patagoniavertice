"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealOptions {
  y?: number;
  duration?: number;
  delay?: number;
  /** Fracción del viewport (desde abajo) que debe entrar antes de revelar. */
  offset?: number;
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Reveal on scroll reutilizable (IntersectionObserver + Web Animations API).
 * El elemento debe arrancar oculto con la clase `opacity-0`; al entrar al
 * viewport anima opacidad y desplazamiento una sola vez. Con
 * prefers-reduced-motion se muestra sin animar.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {},
) {
  const ref = useRef<T>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 24,
      duration = 0.8,
      delay = 0,
      offset = 0.2,
    } = optionsRef.current;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        el.animate(
          [
            { opacity: 0, transform: `translateY(${y}px)` },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: EASE,
            fill: "forwards",
          },
        );
      },
      { rootMargin: `0px 0px -${offset * 100}% 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
