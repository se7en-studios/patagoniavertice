import Link from "next/link";

export default function HomeFooter() {
  return (
    <footer>
      <div className="wrap">
        <span>ALTUM SCI · Servicios y consultoría inmobiliaria · Neuquén y Río Negro</span>
        <span>
          Martillera matriculada · Mat. 35 RP 2026 ·{" "}
          <Link href="/contacto">Contacto</Link>
        </span>
      </div>
    </footer>
  );
}
