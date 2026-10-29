export type TipoCliente =
  | "comprador"
  | "inversor"
  | "vendedor"
  | "inquilino"
  | "propietario";

export type EstadoCliente =
  | "activo"
  | "en_negociacion"
  | "visita_programada"
  | "reserva_firmada"
  | "operacion_cerrada"
  | "pausado";

export interface NotaCliente {
  id: string;
  fecha: string;
  texto: string;
  tipo?: "nota" | "llamada" | "whatsapp" | "visita" | "propuesta";
}

export interface ClienteCRM {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  dni_cuit?: string;
  ciudad_origen?: string;
  tipo: TipoCliente;
  estado: EstadoCliente;
  presupuesto_usd?: number | null;
  zona_interes: string;
  propiedad_interes?: string;
  origen: string;
  prioridad: "alta" | "media" | "baja";
  etiquetas: string[];
  notas: NotaCliente[];
  proximo_contacto?: string | null;
  created_at: string;
  updated_at: string;
}

export type PrioridadTarea = "urgente" | "alta" | "media" | "baja";
export type EstadoTarea = "pendiente" | "en_curso" | "completada";
export type CategoriaTarea =
  | "comercial"
  | "tasacion"
  | "legal_notarial"
  | "visita"
  | "administracion"
  | "marketing";

export interface SubtareaItem {
  id: string;
  texto: string;
  completada: boolean;
}

export interface TareaCRM {
  id: string;
  titulo: string;
  descripcion?: string;
  categoria: CategoriaTarea;
  prioridad: PrioridadTarea;
  estado: EstadoTarea;
  fecha_vencimiento: string; // YYYY-MM-DD
  hora?: string;
  cliente_id?: string | null;
  cliente_nombre?: string | null;
  propiedad_titulo?: string | null;
  subtareas: SubtareaItem[];
  created_at: string;
}

export type TipoEvento =
  | "visita"
  | "tasacion"
  | "firma_escribania"
  | "reunion"
  | "llamada"
  | "recordatorio";

export type EstadoEvento =
  | "programado"
  | "confirmado"
  | "realizado"
  | "reprogramado"
  | "cancelado";

export interface EventoCalendario {
  id: string;
  titulo: string;
  tipo: TipoEvento;
  estado: EstadoEvento;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // HH:mm
  hora_fin?: string; // HH:mm
  ubicacion?: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
  propiedad_titulo?: string;
  notas?: string;
  created_at: string;
}

export interface LeadMetaCRM {
  lead_id: string;
  prioridad?: "alta" | "media" | "baja";
  notas?: string;
  presupuesto_usd?: number | null;
  proximo_paso?: string;
  convertido_cliente_id?: string;
}

export interface CRMStoreData {
  clientes: ClienteCRM[];
  tareas: TareaCRM[];
  eventos: EventoCalendario[];
  leadsMeta: Record<string, LeadMetaCRM>;
}

function fechaOffset(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().split("T")[0];
}

export const DEFAULT_CRM_DATA: CRMStoreData = {
  clientes: [
    {
      id: "cli-1",
      nombre: "Martín Echeverría",
      telefono: "+54 9 299 412-8890",
      email: "m.echeverria@energiaaustral.com.ar",
      dni_cuit: "20-28451920-4",
      ciudad_origen: "Neuquén Capital",
      tipo: "inversor",
      estado: "en_negociacion",
      presupuesto_usd: 95000,
      zona_interes: "Mari Menuco",
      propiedad_interes: "Lote Frente al Lago - Bahía de las Playas",
      origen: "Landing · Calculadora",
      prioridad: "alta",
      etiquetas: ["Contado USD", "Bahía de las Playas", "Inversor"],
      notas: [
        {
          id: "n-1",
          fecha: new Date(Date.now() - 86400000 * 2).toISOString(),
          texto: "Visitó Bahía de las Playas el sábado. Le interesaron los lotes 12 y 14 de primera línea con bajada náutica.",
          tipo: "visita",
        },
        {
          id: "n-2",
          fecha: new Date(Date.now() - 86400000).toISOString(),
          texto: "Envié copia de factibilidad de servicios y modelo de boleto de compraventa para revisión de su escribano.",
          tipo: "propuesta",
        },
      ],
      proximo_contacto: fechaOffset(1),
      created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "cli-2",
      nombre: "Dra. Valeria Santillán",
      telefono: "+54 9 299 504-3312",
      email: "valesantillan.nqn@gmail.com",
      dni_cuit: "27-31094821-9",
      ciudad_origen: "Cipolletti",
      tipo: "comprador",
      estado: "visita_programada",
      presupuesto_usd: 195000,
      zona_interes: "Cipolletti",
      propiedad_interes: "Residencia Vanguardista con Piscina & Parque",
      origen: "WhatsApp Directo",
      prioridad: "alta",
      etiquetas: ["Familia", "Barrio Cerrado", "Crédito + Efectivo"],
      notas: [
        {
          id: "n-3",
          fecha: new Date(Date.now() - 86400000 * 3).toISOString(),
          texto: "Busca mudarse antes de fin de año a barrio cerrado en Cipolletti. Tiene preaprobado complementario y 75% en billete USD.",
          tipo: "llamada",
        },
      ],
      proximo_contacto: fechaOffset(0),
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "cli-3",
      nombre: "Roberto Bermejo (Servicios Petroleros Sur)",
      telefono: "+54 9 299 622-1940",
      email: "rbermejo@spspatagonia.com",
      dni_cuit: "30-71429810-2",
      ciudad_origen: "Catriel / Añelo",
      tipo: "inquilino",
      estado: "activo",
      presupuesto_usd: 2400,
      zona_interes: "Catriel",
      propiedad_interes: "Viviendas corporativas para 3 ingenieros",
      origen: "Referido",
      prioridad: "media",
      etiquetas: ["Corporativo", "Contrato 24 meses", "Petrolera"],
      notas: [
        {
          id: "n-4",
          fecha: new Date(Date.now() - 86400000 * 4).toISOString(),
          texto: "Solicita 2 unidades amobladas en Catriel o Cipolletti norte con cochera para camionetas de flota.",
          tipo: "whatsapp",
        },
      ],
      proximo_contacto: fechaOffset(2),
      created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: "cli-4",
      nombre: "Carlos & Lucía Mendizábal",
      telefono: "+54 9 298 465-7102",
      email: "cmendizabal@agrovalle.com.ar",
      dni_cuit: "20-18920341-7",
      ciudad_origen: "General Roca",
      tipo: "vendedor",
      estado: "activo",
      presupuesto_usd: 140000,
      zona_interes: "General Roca",
      propiedad_interes: "Chacra de 4 ha con casa principal y riego",
      origen: "Tasador Express",
      prioridad: "alta",
      etiquetas: ["Tasación Oficial", "Exclusividad", "Chacra"],
      notas: [
        {
          id: "n-5",
          fecha: new Date(Date.now() - 86400000).toISOString(),
          texto: "Relevamiento fotográfico y de planos realizado. Preparar dictamen de tasación firmada (Mat. 35 RP 2026).",
          tipo: "visita",
        },
      ],
      proximo_contacto: fechaOffset(1),
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  tareas: [
    {
      id: "tar-1",
      titulo: "Enviar dictamen de tasación oficial · Familia Mendizábal",
      descripcion:
        "Incluir comparables de chacras en General Roca, revisión de matrícula catastral y firma digital colegiada Mat. 35 RP 2026.",
      categoria: "tasacion",
      prioridad: "urgente",
      estado: "en_curso",
      fecha_vencimiento: fechaOffset(0),
      hora: "13:00",
      cliente_id: "cli-4",
      cliente_nombre: "Carlos & Lucía Mendizábal",
      propiedad_titulo: "Chacra 4 ha · General Roca",
      subtareas: [
        { id: "st-1", texto: "Verificar plano de mensura y derecho de riego", completada: true },
        { id: "st-2", texto: "Calcular matriz comparativa de valores USD/m²", completada: true },
        { id: "st-3", texto: "Emitir PDF membretado ALTUM SCI y enviar por WhatsApp", completada: false },
      ],
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "tar-2",
      titulo: "Coordinar reserva y boleto de compraventa · Lote 14 Mari Menuco",
      descripcion:
        "Revisar borrador de boleto con escribanía para Martín Echeverría. Confirmar transferencia de seña en USD.",
      categoria: "legal_notarial",
      prioridad: "urgente",
      estado: "pendiente",
      fecha_vencimiento: fechaOffset(0),
      hora: "17:30",
      cliente_id: "cli-1",
      cliente_nombre: "Martín Echeverría",
      propiedad_titulo: "Lote Frente al Lago - Bahía de las Playas",
      subtareas: [
        { id: "st-4", texto: "Pedir certificado de libre deuda de expensas del barrio", completada: true },
        { id: "st-5", texto: "Confirmar turno en escribanía de Cipolletti", completada: false },
      ],
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "tar-3",
      titulo: "Confirmar visita presencial en Cipolletti con Dra. Santillán",
      descripcion:
        "Llevar ficha técnica impresa, planos de arquitectura y opciones de financiación.",
      categoria: "visita",
      prioridad: "alta",
      estado: "pendiente",
      fecha_vencimiento: fechaOffset(1),
      hora: "11:00",
      cliente_id: "cli-2",
      cliente_nombre: "Dra. Valeria Santillán",
      propiedad_titulo: "Residencia Vanguardista con Piscina & Parque",
      subtareas: [
        { id: "st-6", texto: "Avisar a guardia del barrio cerrado", completada: true },
        { id: "st-7", texto: "Enviar ubicación por WhatsApp 2 horas antes", completada: false },
      ],
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "tar-4",
      titulo: "Preparar propuesta de alquiler corporativo para Servicios Petroleros Sur",
      descripcion:
        "Seleccionar 3 propiedades disponibles en Catriel y Cipolletti norte con contrato a 24 meses en USD.",
      categoria: "comercial",
      prioridad: "media",
      estado: "pendiente",
      fecha_vencimiento: fechaOffset(2),
      hora: "10:00",
      cliente_id: "cli-3",
      cliente_nombre: "Roberto Bermejo (Servicios Petroleros Sur)",
      propiedad_titulo: "Cartera Corporativa Catriel",
      subtareas: [],
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "tar-5",
      titulo: "Actualizar fotos de portada de lotes en Bahía de las Playas",
      descripcion:
        "Verificar que los 3 lotes destacados estén activos en la home de ALTUM SCI.",
      categoria: "marketing",
      prioridad: "baja",
      estado: "completada",
      fecha_vencimiento: fechaOffset(-1),
      hora: "09:30",
      cliente_id: null,
      cliente_nombre: null,
      propiedad_titulo: "Bahía de las Playas · Mari Menuco",
      subtareas: [],
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
  ],
  eventos: [
    {
      id: "ev-1",
      titulo: "Entrega de Tasación Oficial · Familia Mendizábal",
      tipo: "tasacion",
      estado: "confirmado",
      fecha: fechaOffset(0),
      hora_inicio: "13:00",
      hora_fin: "14:00",
      ubicacion: "Videollamada / WhatsApp",
      cliente_nombre: "Carlos & Lucía Mendizábal",
      cliente_telefono: "+54 9 298 465-7102",
      propiedad_titulo: "Chacra 4 ha · General Roca",
      notas: "Presentar rango de valor de realización inmediata y valor de mercado óptimo.",
      created_at: new Date().toISOString(),
    },
    {
      id: "ev-2",
      titulo: "Reunión por Reserva Lote 14 · Bahía de las Playas",
      tipo: "firma_escribania",
      estado: "confirmado",
      fecha: fechaOffset(0),
      hora_inicio: "17:30",
      hora_fin: "18:30",
      ubicacion: "Oficina Cipolletti / Escribanía",
      cliente_nombre: "Martín Echeverría",
      cliente_telefono: "+54 9 299 412-8890",
      propiedad_titulo: "Lote Frente al Lago - Bahía de las Playas",
      notas: "Llevar carpeta técnica del loteo y recibo oficial de reserva.",
      created_at: new Date().toISOString(),
    },
    {
      id: "ev-3",
      titulo: "Visita guiada · Residencia Vanguardista Cipolletti",
      tipo: "visita",
      estado: "programado",
      fecha: fechaOffset(1),
      hora_inicio: "11:00",
      hora_fin: "12:15",
      ubicacion: "Barrio Residencial Consolidado, Cipolletti",
      cliente_nombre: "Dra. Valeria Santillán",
      cliente_telefono: "+54 9 299 504-3312",
      propiedad_titulo: "Residencia Vanguardista con Piscina & Parque",
      notas: "Asiste junto a su esposo. Mostrar área de piscina, quincho y planos de ampliación.",
      created_at: new Date().toISOString(),
    },
    {
      id: "ev-4",
      titulo: "Recorrida de Lotes en Mari Menuco (Bahía de las Playas)",
      tipo: "visita",
      estado: "confirmado",
      fecha: fechaOffset(3),
      hora_inicio: "10:30",
      hora_fin: "13:00",
      ubicacion: "Lago Mari Menuco · Bajada Náutica",
      cliente_nombre: "Inversores Alto Valle",
      cliente_telefono: "+54 9 299 609-5742",
      propiedad_titulo: "Terreno Panorámico con Bajada Náutica",
      notas: "Mostrar obras de tendido eléctrico, sector Club House y costa del lago.",
      created_at: new Date().toISOString(),
    },
    {
      id: "ev-5",
      titulo: "Presentación Cartera Corporativa · Servicios Petroleros Sur",
      tipo: "reunion",
      estado: "programado",
      fecha: fechaOffset(2),
      hora_inicio: "16:00",
      hora_fin: "17:00",
      ubicacion: "Cipolletti / Catriel",
      cliente_nombre: "Roberto Bermejo",
      cliente_telefono: "+54 9 299 622-1940",
      propiedad_titulo: "Unidades Corporativas Catriel",
      notas: "Revisar requisitos de facturación y seguro de caución.",
      created_at: new Date().toISOString(),
    },
  ],
  leadsMeta: {},
};
