"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

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

      curX += dx * 0.22;
      curY += dy * 0.22;

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
      const cursorHost = target?.closest("[data-cursor]");
      if (cursorHost) {
        const text = cursorHost.getAttribute("data-cursor");
        setLabel(text || "VER ↗");
        el.classList.remove("is-hovered");
        return;
      }
      setLabel(null);
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
      className={`fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center will-change-transform transition-all duration-200 ${
        label
          ? "px-3.5 py-1.5 rounded-full bg-[#070E1B]/95 border border-dorado/60 text-dorado shadow-[0_12px_28px_rgba(7,14,27,0.45)] backdrop-blur-md"
          : "cursor-dot"
      }`}
    >
      {label && (
        <span className="rd-label !text-[9.5px] !tracking-[0.2em] whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
}
