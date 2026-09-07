"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
  useMotionValue,
  animate,
} from "framer-motion";
import { WHATSAPP_URL } from "@/lib/constants";

const MotionLink = motion(Link);

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 2 + (i % 3),
  duration: 6 + (i % 5),
  delay: i * 0.4,
}));

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-dorado/40"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** Botón magnético: sigue el cursor dentro de un radio, vuelve al centro al salir. */
function MagneticWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: relX * 0.3, y: relY * 0.3 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

/* Ripple: ola desde el punto de click */
function spawnRipple(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const span = document.createElement("span");
  span.className = "ripple-span";
  span.style.width = span.style.height = `${size}px`;
  span.style.left = `${e.clientX - rect.left - size / 2}px`;
  span.style.top = `${e.clientY - rect.top - size / 2}px`;
  el.appendChild(span);
  span.addEventListener("animationend", () => span.remove());
}

function OperacionesCounter() {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, 200, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [inView, count]);

  return (
    <span ref={ref} className="tabular-nums">
      +{display}
    </span>
  );
}

export default function CTAFinal() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex flex-col lg:flex-row min-h-[600px]"
    >
      {/* LEFT - content panel */}
      <div className="relative lg:w-[55%] bg-tierra py-28 lg:py-36 px-8 lg:px-20 flex flex-col justify-center overflow-hidden">
        {/* Grain */}
        <div className="absolute inset-0 grain-overlay opacity-[0.04] pointer-events-none" />

        {/* Partículas doradas flotantes */}
        <FloatingParticles />

        {/* Decorative large word */}
        <div
          className="absolute -bottom-8 -left-4 font-display text-crema/[0.04] font-medium leading-none select-none pointer-events-none"
          style={{
            fontSize: "clamp(7rem, 18vw, 14rem)",
            letterSpacing: "-0.05em",
          }}
          aria-hidden="true"
        >
          invertí
        </div>

        <div className="relative">
          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-4 mb-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px w-10 bg-dorado/50" />
            <span className="eyebrow text-crema/30">Dando el primer paso</span>
          </motion.div>

          {/* Title - split-line reveal: each line slides up from a mask */}
          <h2
            className="font-display text-crema font-medium leading-[1.05] mb-8"
            style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
              letterSpacing: "-0.03em",
            }}
          >
            {(
              [
                { text: "La Patagonia crece.", italic: false },
                { text: "Tu capital también.", italic: true },
              ] as const
            ).map((line, i) => (
              <span key={i} style={{ display: "block", lineHeight: 1.1 }}>
                <motion.span
                  style={{ display: "block" }}
                  className={line.italic ? "text-dorado font-bold" : "font-semibold text-crema"}
                  initial={
                    prefersReduced
                      ? { opacity: 0 }
                      : { clipPath: "inset(0 0 100% 0)", y: 20, opacity: 0 }
                  }
                  whileInView={
                    prefersReduced
                      ? { opacity: 1 }
                      : { clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1 }
                  }
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.75,
                    delay: 0.1 + i * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h2>

          {/* Subtitle */}
          <motion.p
            className="font-body text-crema/35 text-[15px] leading-relaxed mb-12 max-w-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Nuestro equipo está disponible para orientarte sin compromiso. Cada
            proyecto es una oportunidad única en una región que no para de
            expandirse.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <MagneticWrapper>
              <motion.a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={spawnRipple}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-9 py-4 bg-[#25D366] text-white font-body text-[11px] tracking-[0.15em] font-semibold uppercase hover:bg-[#20bd5a] transition-colors duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar por WhatsApp
              </motion.a>
            </MagneticWrapper>
            <MotionLink
              href="/contacto"
              onClick={spawnRipple}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-9 py-4 border border-crema/15 text-crema/60 font-body text-[11px] tracking-[0.15em] font-medium uppercase hover:border-dorado hover:text-dorado transition-colors duration-300"
            >
              Formulario de contacto
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </MotionLink>
          </motion.div>

          {/* Contador de operaciones */}
          <motion.p
            className="font-body text-crema/40 text-[13px] tracking-wider mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className="font-display text-dorado text-2xl font-medium">
              <OperacionesCounter />
            </span>{" "}
            operaciones ya cerradas en la Patagonia
          </motion.p>

          {/* Gold accent line - scaleX from center on viewport entry */}
          <motion.div
            className="h-px bg-dorado/40 mt-8"
            style={{ transformOrigin: "center" }}
            initial={
              prefersReduced ? { opacity: 0 } : { scaleX: 0, opacity: 0 }
            }
            whileInView={
              prefersReduced ? { opacity: 1 } : { scaleX: 1, opacity: 1 }
            }
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* RIGHT - image panel */}
      <motion.div
        className="relative lg:w-[45%] min-h-[400px] lg:min-h-0 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 w-full h-[116%] -top-[8%]"
          style={{ y: imgY }}
        >
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
            alt="Paisaje patagónico - Altum Inmobiliaria, propiedades en Río Negro"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
            priority={false}
          />
        </motion.div>
        {/* Gradient overlay blending into left panel */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(28,25,22,0.6) 0%, rgba(28,25,22,0.15) 50%, transparent 100%)",
          }}
        />
        {/* Bottom overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(28,25,22,0.5) 0%, transparent 60%)",
          }}
        />

        {/* Floating quote */}
        <motion.div
          className="absolute bottom-10 left-8 right-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <p
            className="font-display text-crema/60 font-medium italic leading-snug"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.3rem)" }}
          >
            &ldquo;Donde el paisaje define el valor.&rdquo;
          </p>
          <p className="font-body text-crema/25 text-[10px] tracking-[0.25em] uppercase mt-2">
            - Altum Inmobiliaria
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
