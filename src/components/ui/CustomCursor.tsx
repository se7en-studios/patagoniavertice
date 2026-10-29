"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No activar en pantallas táctiles
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = ref.current;
    if (!el) return;

    let mouseX = -100;
    let mouseY = -100;
    let curX = -100;
    let curY = -100;
    let rafId: number | null = null;

    const animate = () => {
      const dx = mouseX - curX;
      const dy = mouseY - curY;

      curX += dx * 0.2;
      curY += dy * 0.2;

      el.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;

      if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest("a, button, [role='button'], select, label")) {
        el.classList.add("is-hovered");
      } else {
        el.classList.remove("is-hovered");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-dot fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block will-change-transform"
    />
  );
}
