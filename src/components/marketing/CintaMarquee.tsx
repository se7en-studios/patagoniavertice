"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  useVelocity,
} from "framer-motion";

interface CintaMarqueeProps {
  items: string[];
  /** 1 = hacia la izquierda, -1 = hacia la derecha */
  direction?: 1 | -1;
}

const BASE_SPEED = 0.006; // % de la cinta por ms
const SPEED_BOOST_MAX = 6;

// Cinta de texto gigante: avanza sola y se acelera e inclina con la velocidad del scroll.
export default function CintaMarquee({
  items,
  direction = 1,
}: CintaMarqueeProps) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), {
    damping: 50,
    stiffness: 400,
  });
  const skew = useTransform(velocity, [-2000, 0, 2000], [-6, 0, 6]);
  const translate = useTransform(x, (v) => `${v}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const boost = Math.min(Math.abs(velocity.get()) / 400, SPEED_BOOST_MAX);
    let next = x.get() - direction * BASE_SPEED * delta * (1 + boost);
    // La pista tiene el contenido duplicado: al llegar a -50% vuelve a 0 sin salto.
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    x.set(next);
  });

  const row = [...items, ...items];
  return (
    <div
      className="relative overflow-hidden border-y border-dorado/15 bg-navy-950 py-6 lg:py-8"
      aria-hidden="true"
    >
      <motion.div style={{ skewX: reduced ? 0 : skew }}>
        <motion.div
          className="flex w-max items-center"
          style={{ x: translate }}
        >
          {row.map((t, i) => (
            <span key={i} className="flex items-center">
              <span
                className="font-display font-semibold uppercase leading-none tracking-tight whitespace-nowrap"
                style={{
                  fontSize: "clamp(2.5rem, 7vw, 6rem)",
                  color: i % 2 ? "transparent" : "rgba(245,239,230,0.92)",
                  WebkitTextStroke: i % 2 ? "1px rgba(201,168,76,0.7)" : "0",
                }}
              >
                {t}
              </span>
              <span className="mx-8 text-dorado text-2xl">✦</span>
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
