"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { WHATSAPP_URL } from "@/lib/constants";
import { track } from "@/lib/analytics";

const itemCls =
  "flex-1 flex items-center justify-center py-3.5 rd-label !text-[10px] !tracking-[0.18em]";

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

  return (
    <motion.nav
      aria-label="Contacto rápido"
      aria-hidden={!visible}
      initial={false}
      animate={{ y: visible ? 0 : 120, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="lg:hidden fixed inset-x-3.5 z-50 flex items-center overflow-hidden rounded-full border border-dorado/45 bg-[#070E1B]/95 shadow-[0_18px_40px_-12px_rgba(7,14,27,0.65)] backdrop-blur-xl"
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
        className={`${itemCls} text-white/90 border-r border-white/10`}
      >
        Llamar
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        onClick={() => track("whatsapp_click", { origen: "mobile_bar" })}
        className={`${itemCls} gap-2 text-white border-r border-white/10`}
      >
        <span className="relative w-5 h-5 rounded-full overflow-hidden ring-1 ring-dorado shrink-0">
          <Image
            src="/estela-avatar.jpg"
            alt="Estela Mari Rojas"
            fill
            sizes="20px"
            className="object-cover"
          />
        </span>
        <span>WhatsApp</span>
      </a>
      <Link
        href="/#tasador-express"
        tabIndex={visible ? 0 : -1}
        onClick={() =>
          track("cta_click", { origen: "mobile_bar", accion: "tasar" })
        }
        className={`${itemCls} bg-dorado text-tierra gap-1`}
      >
        <span>Tasar</span>
        <span aria-hidden="true">↗</span>
      </Link>
    </motion.nav>
  );
}
