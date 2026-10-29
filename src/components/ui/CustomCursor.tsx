"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let mouseX = -100, mouseY = -100;
    let curX = -100, curY = -100;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("a, button, [role='button'], select, label")) {
        el.classList.add("is-hovered");
      } else {
        el.classList.remove("is-hovered");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });

    const animate = () => {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      const w = el.offsetWidth / 2;
      const h = el.offsetHeight / 2;
      el.style.transform = `translate(${curX - w}px, ${curY - h}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-dot fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
    />
  );
}
