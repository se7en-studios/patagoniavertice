"use client";

import { useEffect } from "react";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVXYZ/+*#0123456789";
const DURATION_MS = 700;

// Las etiquetas `.eyebrow` se "decodifican" una vez al entrar en pantalla y terminan en el texto original.
export default function DecodeText() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const done = new WeakSet<Element>();

    const run = (el: HTMLElement) => {
      const nodes: { n: Text; full: string }[] = [];
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let t: Node | null;
      while ((t = w.nextNode())) {
        const full = t.textContent ?? "";
        if (full.trim().length > 1) nodes.push({ n: t as Text, full });
      }
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / DURATION_MS);
        for (const { n, full } of nodes) {
          n.textContent = full
            .split("")
            .map((c, i) =>
              c === " " || i < full.length * p
                ? c
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join("");
        }
        if (p < 1) requestAnimationFrame(step);
        else for (const { n, full } of nodes) n.textContent = full;
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && !done.has(e.target)) {
            done.add(e.target);
            run(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.6 },
    );
    document.querySelectorAll<HTMLElement>(".eyebrow").forEach((el) => {
      if (!el.closest(".hero-eyebrow")) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
