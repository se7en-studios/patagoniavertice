"use client";

import { useRef, useState } from "react";
import { guardarLeadAltum } from "@/app/actions/leads-altum";
import { track } from "@/lib/analytics";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const TIPOS = ["Casa / Residencia", "Departamento", "Lote / Terreno", "Chacra / Campo", "Local / Galpón"];
const ZONAS = ["Cipolletti", "Mari Menuco / Lagos", "Catriel", "General Roca", "Neuquén Capital", "Otra zona"];
const SUPERFICIES = ["Hasta 70 m²", "70 a 150 m²", "150 a 300 m²", "Más de 300 m²"];

function Options({
  name, items, value, onChange,
}: { name: string; items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="opts">
      {items.map((it, i) => {
        const id = `${name}-${i}`;
        return (
          <span key={it} style={{ display: "contents" }}>
            <input type="radio" name={name} id={id} checked={value === it} onChange={() => onChange(it)} />
            <label htmlFor={id}>{it}</label>
          </span>
        );
      })}
    </div>
  );
}

export default function HomeTasador() {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [zona, setZona] = useState(ZONAS[0]);
  const [sup, setSup] = useState(SUPERFICIES[1]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const iniciado = useRef(false);

  const marcarInicio = () => {
    if (iniciado.current) return;
    iniciado.current = true;
    track("tasador_start");
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    const result = await guardarLeadAltum({
      nombre,
      telefono,
      tipo_consulta: "tasacion",
      origen: "tasador",
      mensaje: `Solicitud de tasación: ${tipo}, ${zona}, ${sup}.`,
      detalle: { tipo, localidad: zona, superficie: sup },
    });
    setEnviando(false);
    if (!result.success) {
      setError(result.error ?? "No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp.");
      return;
    }
    track("tasador_complete", { tipo, localidad: zona });
    track("lead_submit", { origen: "tasador" });
    const texto = `Hola Estela, quiero tasar una propiedad. Tipo: ${tipo}. Zona: ${zona}. Superficie: ${sup}. Soy ${nombre}.`;
    track("whatsapp_click", { origen: "tasador" });
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
    setPaso(1);
    setNombre("");
    setTelefono("");
    setError(null);
    setEnviado(true);
  };
  if (enviado) {
    return (
      <div className="form done">
        <span className="badge sage"><i></i>Consulta recibida</span>
        <h3>Gracias, ya tenemos tus datos</h3>
        <p className="lead">Estela te va a contactar para coordinar la tasación. Si no se abrió WhatsApp, escribinos desde el botón del menú.</p>
        <button type="button" className="btn ghost" onClick={() => setEnviado(false)}>Hacer otra tasación</button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={enviar} onFocus={marcarInicio} noValidate>
      <div className="steps" aria-hidden="true">
        <span className="on" />
        <span className={paso === 2 ? "on" : ""} />
      </div>

      {paso === 1 ? (
        <div>
          <fieldset><legend>1. Tipo de propiedad</legend><Options name="tipo" items={TIPOS} value={tipo} onChange={setTipo} /></fieldset>
          <fieldset><legend>2. Zona</legend><Options name="zona" items={ZONAS} value={zona} onChange={setZona} /></fieldset>
          <fieldset><legend>3. Superficie estimada</legend><Options name="sup" items={SUPERFICIES} value={sup} onChange={setSup} /></fieldset>
          <button type="button" className="btn gold" onClick={() => setPaso(2)}>Continuar →</button>
        </div>
      ) : (
        <div>
          <div className="field"><label htmlFor="ht-nombre">Tu nombre</label>
            <input id="ht-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" placeholder="Nombre y apellido" /></div>
          <div className="field"><label htmlFor="ht-tel">WhatsApp</label>
            <input id="ht-tel" type="tel" inputMode="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} autoComplete="tel" placeholder="299 000 0000" /></div>
          <div className="row">
            <button type="button" className="btn ghost" onClick={() => setPaso(1)}>← Volver</button>
            <button type="submit" className="btn gold" disabled={enviando}>{enviando ? "Enviando…" : "Pedir tasación"}</button>
          </div>
          {error && <p className="note" role="alert">{error}</p>}
        </div>
      )}
    </form>
  );
}
