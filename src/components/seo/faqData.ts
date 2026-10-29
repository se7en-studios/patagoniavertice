// Fuente única de las preguntas frecuentes (la usan FAQ.tsx y FaqJsonLd).
export interface FAQData {
  categoria: "Comprar & Invertir" | "Venta & Tasaciones" | "Alquileres" | "Marco Legal";
  pregunta: string;
  respuesta: string;
}

export const faqs: FAQData[] = [
  {
    categoria: "Comprar & Invertir",
    pregunta: "¿Cuáles son las zonas donde opera Altum Inmobiliaria?",
    respuesta:
      "Trabajamos activamente en todo el Alto Valle y la provincia de Río Negro: Cipolletti, Catriel, General Roca, Viedma y San Carlos de Bariloche. También asesoramos en Neuquén capital y zonas limítrofes. Si tenés interés en otra localidad patagónica, evaluamos cada caso de forma personalizada.",
  },
  {
    categoria: "Comprar & Invertir",
    pregunta: "¿Puedo comprar una propiedad en la Patagonia si resido en otra ciudad o país?",
    respuesta:
      "Sí, contamos con un protocolo especializado para compradores e inversores no residentes. Gestionamos visitas virtuales en alta definición, revisión dominial notarial, poderes de representación y firma remota para que puedas operar desde Buenos Aires, el exterior o cualquier punto del país con total seguridad jurídica.",
  },
  {
    categoria: "Venta & Tasaciones",
    pregunta: "¿Cómo se determina el valor de tasación de un inmueble?",
    respuesta:
      "Nuestras tasaciones están a cargo de la Martillera Colegiada Estela Mari Rojas (Mat. 35 RP 2026). Realizamos un Análisis Comparativo de Mercado (ACM) basado en valores de cierre reales de operaciones efectivas en la zona, estado constructivo, ubicación y potencial de plusvalía.",
  },
  {
    categoria: "Venta & Tasaciones",
    pregunta: "¿Cuánto tiempo demora en promedio concretar una venta?",
    respuesta:
      "En propiedades con documentación en regla y tasación ajustada a mercado, el plazo promedio de reserva y cierre se sitúa entre 30 y 60 días. Contamos con una base activa de compradores calificados e inversores corporativos en Río Negro.",
  },
  {
    categoria: "Alquileres",
    pregunta: "¿Qué incluye la Administración Integral de Alquileres de Altum?",
    respuesta:
      "Brindamos un servicio 'llave en mano': rigurosa evaluación crediticia y laboral de los inquilinos, redacción del contrato conforme a la ley, cobro mensual puntual, liquidación bancaria, atención de reclamos y supervisión periódica del estado del inmueble.",
  },
  {
    categoria: "Marco Legal",
    pregunta: "¿Qué documentación necesito para poner en venta mi propiedad?",
    respuesta:
      "Para iniciar la comercialización solicitamos: copia de la escritura de dominio o boleto sellado, plano de mensura / subdivisión aprobado, estado parcelario y libre deuda de impuestos provinciales y municipales. Nuestro equipo te asiste en caso de faltar algún certificado.",
  },
  {
    categoria: "Marco Legal",
    pregunta: "¿Los contratos cuentan con respaldo colegiado en Río Negro?",
    respuesta:
      "Absolutamente. Cada contrato, reserva y boleto de compraventa es redactado y auditado bajo la supervisión de martillera matriculada en el Colegio de Martilleros y Corredores Públicos de Río Negro (IV Circunscripción), garantizando cláusulas transparentes y sin sorpresas.",
  },
];
