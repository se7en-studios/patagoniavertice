"use client";

import { WHATSAPP_URL } from "@/lib/constants";
import { track } from "@/lib/analytics";

const itemCls =
  "flex-1 flex items-center justify-center py-3.5 font-body text-[11px] tracking-[0.16em] uppercase font-semibold";

export default function MobileCtaBar() {
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
      <a
        href="/#tasador-express"
        onClick={() =>
          track("cta_click", { origen: "mobile_bar", accion: "tasar" })
        }
        className={`${itemCls} bg-dorado text-tierra`}
      >
        Tasar
      </a>
    </nav>
  );
}
