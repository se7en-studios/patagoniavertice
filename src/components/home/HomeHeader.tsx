import Link from "next/link";
import { WHATSAPP_URL } from "@/lib/constants";
import { StarMark } from "./HomeIcons";

const LINKS = [
  { href: "/#propiedades", label: "Propiedades" },
  { href: "/#ubicacion", label: "Ubicación" },
  { href: "/#tasador-express", label: "Tasación" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function HomeHeader() {
  return (
    <header className="top">
      <div className="wrap nav">
        <Link className="logo" href="/" aria-label="Altum SCI, inicio">
          <StarMark />
          ALTUM <span>SCI</span>
        </Link>
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <a className="btn primary sm" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </div>
    </header>
  );
}
