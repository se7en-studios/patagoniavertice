"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

interface Props {
  href: string;
  origen: "ficha" | "catalogo";
  className?: string;
  children: ReactNode;
}

export default function WhatsAppLink({
  href,
  origen,
  className,
  children,
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { origen })}
      className={className}
    >
      {children}
    </a>
  );
}
