"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { WHATSAPP_URL } from "@/lib/constants";
import { track } from "@/lib/analytics";

const itemCls =
  "flex-1 flex items-center justify-center py-3.5 font-body text-[11px] tracking-[0.16em] uppercase font-semibold";

// En la home el hero ya trae sus propios CTAs: la barra aparece al pasar esta altura.
const SHOW_AFTER_PX = 420;

export default function MobileCtaBar() {
  const light = usePathname() === "/";
  const [visible, setVisible] = useState(!light);

  useEffect(() => {
    if (!light) {
      setVisible(true);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [light]);

  if (!light) {
    return (
      <nav
        aria-label="Contacto rápido"
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex border-t border-dorado/40 backdrop-blur-xl"
        style={{
          background: "rgba(6,10,19,0.96)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <a
          href="tel:+5492996095742"
          onClick={() =>
            track("cta_click", { origen: "mobile_bar", accion: "llamar" })
          }
          className={`${itemCls} text-crema border-r border-crema/10`}
        >
          Llamar
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { origen: "mobile_bar" })}
          className={`${itemCls} text-crema border-r border-crema/10`}
        >
          WhatsApp
        </a>
        <Link
          href="/#tasador-express"
          onClick={() =>
            track("cta_click", { origen: "mobile_bar", accion: "tasar" })
          }
          className={`${itemCls} bg-dorado text-tierra`}
        >
          Tasar
        </Link>
      </nav>
    );
  }

  // Home: píldora de vidrio flotante que sube al aparecer.
  return (
    <motion.nav
      aria-label="Contacto rápido"
      aria-hidden={!visible}
      initial={false}
      animate={{ y: visible ? 0 : 120, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="lg:hidden fixed inset-x-4 z-50 flex overflow-hidden rounded-full border border-white/90 bg-white/85 shadow-[0_18px_40px_-14px_rgba(14,26,51,0.45)] backdrop-blur-xl"
      style={{
        bottom: "calc(env(safe-area-inset-bottom) + 12px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <a
        href="tel:+5492996095742"
        tabIndex={visible ? 0 : -1}
        onClick={() =>
          track("cta_click", { origen: "mobile_bar", accion: "llamar" })
        }
        className={`${itemCls} text-navy border-r border-navy/10`}
      >
        Llamar
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        onClick={() => track("whatsapp_click", { origen: "mobile_bar" })}
        className={`${itemCls} text-navy border-r border-navy/10`}
      >
        WhatsApp
      </a>
      <Link
        href="/#tasador-express"
        tabIndex={visible ? 0 : -1}
        onClick={() =>
          track("cta_click", { origen: "mobile_bar", accion: "tasar" })
        }
        className={`${itemCls} bg-dorado text-tierra`}
      >
        Tasar
      </Link>
    </motion.nav>
  );
}
