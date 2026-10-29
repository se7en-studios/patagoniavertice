"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  animate,
} from "framer-motion";
import { WHATSAPP_URL } from "@/lib/constants";

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
      duration: 1.6,
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
  return (
    <section className="relative bg-[#F6F8FB] px-4 lg:px-8 py-10 lg:py-16">
      <div className="relative max-w-[1400px] mx-auto overflow-hidden rounded-[2rem] lg:rounded-[3rem] flex flex-col lg:flex-row min-h-[560px] bg-white border border-dorado/20 shadow-[0_30px_70px_-40px_rgba(14,26,51,0.45)]">
        {/* LEFT - content panel */}
        <div className="relative lg:w-[55%] py-16 sm:py-20 lg:py-28 px-7 sm:px-10 lg:px-20 flex flex-col justify-center overflow-hidden">
          {/* Palabra decorativa */}
          <div
            className="absolute -bottom-8 -left-4 font-display text-navy/[0.035] font-medium leading-none select-none pointer-events-none"
            style={{
              fontSize: "clamp(6rem, 16vw, 13rem)",
              letterSpacing: "-0.05em",
            }}
            aria-hidden="true"
          >
            invertí
          </div>

          <div className="relative">
            <motion.span
              className="inline-flex items-center rounded-full bg-[#FBF0CF] text-[#7A5A12] font-body text-[11px] font-semibold tracking-[0.14em] uppercase px-3.5 py-1.5 mb-7"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Dando el primer paso
            </motion.span>

            <motion.h2
              className="font-display text-navy font-semibold leading-[1.05] mb-6"
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4.4rem)",
                letterSpacing: "-0.03em",
              }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.05 }}
            >
              La Patagonia crece.
              <br />
              <span className="italic text-[#A47C1B]">Tu capital también.</span>
            </motion.h2>

            <motion.p
              className="font-body text-navy/65 text-[15px] leading-relaxed mb-9 max-w-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.12 }}
            >
              Nuestro equipo está disponible para orientarte sin compromiso.
              Cada proyecto es una oportunidad única en una región que no para
              de expandirse.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3.5"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.18 }}
            >
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={spawnRipple}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-body text-[11px] tracking-[0.15em] font-semibold uppercase shadow-[0_14px_30px_-14px_rgba(37,211,102,0.8)] hover:bg-[#20bd5a] transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Consultar por WhatsApp
              </a>
              <Link
                href="/contacto"
                className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-navy/20 text-navy font-body text-[11px] tracking-[0.15em] font-semibold uppercase hover:border-dorado hover:text-[#8A6A1B] transition-all duration-200 hover:-translate-y-0.5"
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
              </Link>
            </motion.div>

            {/* Contador de operaciones */}
            <p className="font-body text-navy/60 text-[13px] tracking-wider mt-9">
              <span className="font-display text-[#8A6A1B] text-2xl font-semibold">
                <OperacionesCounter />
              </span>{" "}
              operaciones concretadas en la Patagonia
            </p>
          </div>
        </div>

        {/* RIGHT - image panel */}
        <div className="relative lg:w-[45%] min-h-[360px] lg:min-h-0 overflow-hidden">
          <Image
            src="/mari-menuco/bahia-playas-1.jpg"
            alt="Costa del Lago Mari Menuco - Altum SCI Propiedades en Patagonia"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(14,26,51,0.78) 0%, rgba(14,26,51,0.18) 55%, transparent 100%)",
            }}
          />

          <div className="absolute bottom-7 left-7 right-7 space-y-3.5">
            <p
              className="font-display text-white font-medium italic leading-snug drop-shadow-sm"
              style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.4rem)" }}
            >
              &ldquo;Donde el paisaje patagónico define el valor de tu patrimonio.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2.5 border-t border-white/20">
              <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-dorado shrink-0">
                <Image
                  src="/estela-avatar.jpg"
                  alt="Estela Mari Rojas"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-display text-white text-xs font-semibold">
                  Estela Mari Rojas
                </p>
                <p className="font-body text-dorado text-[10px] tracking-[0.2em] uppercase">
                  Martillera Pública · Mat. 35 RP 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
