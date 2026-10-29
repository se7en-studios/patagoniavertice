"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Barra dorada con inercia; escala en X (transform) en vez de animar el ancho.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-[3px] pointer-events-none">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-dorado/40 via-dorado to-[#E8D5B7]"
        style={{ scaleX }}
      />
    </div>
  );
}
