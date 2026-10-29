import fs from "fs";
import os from "os";
import path from "path";

export interface PerfilOwner {
  nombre: string;
  titulo: string;
  matricula: string;
  colegio: string;
  telefono: string;
  whatsapp: string;
  email: string;
  foto: string;
  bio: string;
  cobertura: string;
  aniosExperiencia: number | string;
  operacionesConcretadas: number | string;
  horarioAtencion?: string;
  direccionOficina?: string;
  fraseConfianza?: string;
  subfraseConfianza?: string;
}

export interface ServicioConfig {
  id: string;
  titulo: string;
  descripcion: string;
  activo: boolean;
}

export interface ZonaConfig {
  id: string;
  nombre: string;
  provincia: string;
  destacado: string;
  descripcion: string;
  tipoInversion: string;
  activo: boolean;
}

export interface HeroLandingConfig {
  eyebrow: string;
  anuncioTop: string;
  mostrarAnuncioTop: boolean;
  tituloPrincipal: string;
  tituloCursiva: string;
  subtitulo: string;
  ctaPrimario: string;
  ctaSecundario: string;
  loteDestacadoTitulo: string;
  loteDestacadoPrecio: string;
}

export interface StatManifiesto {
  id: string;
  valor: string;
  etiqueta: string;
  detalle: string;
}

export interface BandaLagoConfig {
  etiqueta: string;
  titulo: string;
  tituloCursiva: string;
  descripcion: string;
  precioDesde: string;
  superficieRef: string;
  distanciaRef: string;
}

export interface FaqLandingItem {
  id: string;
  categoria?: string;
  pregunta: string;
  respuesta: string;
}

export interface SiteConfig {
  perfil: PerfilOwner;
  hero: HeroLandingConfig;
  statsManifiesto: StatManifiesto[];
  bandaLago: BandaLagoConfig;
  servicios: ServicioConfig[];
  zonas: ZonaConfig[];
  faqs: FaqLandingItem[];
}

const CONFIG_PATH = path.join(process.cwd(), "src", "data", "site-config.json");
const TMP_CONFIG_PATH = path.join(os.tmpdir(), "altum-site-config.json");

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  perfil: {
    nombre: "Estela Mari Rojas",
    titulo: "Martillera y Corredora Pública Colegiada",
    matricula: "Mat. 35 RP 2026",
    colegio:
      "Colegio de Martilleros y Corredores Públicos de Río Negro (IV Circunscripción)",
    telefono: "+54 9 299 609-5742",
    whatsapp: "5492996095742",
    email: "altumsci@gmail.com",
    foto: "/estela.jpg",
    bio: "Martillera y Corredora Pública con amplia trayectoria en el mercado inmobiliario patagónico. Especializada en desarrollo territorial, loteos premium frente al lago Mari Menuco, tasaciones periciales oficiales y contratos corporativos con máxima seguridad jurídica y notarial.",
    cobertura: "Mari Menuco, Cipolletti, Catriel, General Roca y Río Negro",
    aniosExperiencia: "+15",
    operacionesConcretadas: "+320",
    horarioAtencion: "Lunes a Sábados · 09:00 a 19:30 hs",
    direccionOficina: "Cipolletti · Río Negro & Corredor Mari Menuco",
    fraseConfianza: "Una operación clara empieza con información.",
    subfraseConfianza:
      "Revisar la documentación, dejar los acuerdos por escrito y contar con asesoramiento profesional puede evitarte problemas después.",
  },
  hero: {
    eyebrow: "ALTUM SCI · Servicios & Consultoría Inmobiliaria",
    anuncioTop: "Lotes frente al lago Mari Menuco · Escrituración garantizada",
    mostrarAnuncioTop: true,
    tituloPrincipal: "Invertí en el eje estratégico",
    tituloCursiva: "de la Patagonia.",
    subtitulo:
      "Terrenos exclusivos en Lago Mari Menuco, residencias en Cipolletti y activos corporativos en el corredor de Vaca Muerta con respaldo de Martillera Pública Matriculada.",
    ctaPrimario: "Explorar propiedades",
    ctaSecundario: "Hablar con Estela",
    loteDestacadoTitulo: "Bahía de las Playas · Mari Menuco",
    loteDestacadoPrecio: "Desde USD 32.000 · 750 a 1.000 m²",
  },
  statsManifiesto: [
    {
      id: "st-1",
      valor: "4",
      etiqueta: "Zonas estratégicas",
      detalle: "Mari Menuco, Cipolletti, Catriel y General Roca",
    },
    {
      id: "st-2",
      valor: "65 km",
      etiqueta: "Conectividad",
      detalle: "Autovía directa Neuquén ↔ Lago Mari Menuco",
    },
    {
      id: "st-3",
      valor: "24 hs",
      etiqueta: "Tasación oficial",
      detalle: "Dictamen técnico con firma colegiada Mat. 35 RP 2026",
    },
    {
      id: "st-4",
      valor: "100%",
      etiqueta: "Seguridad jurídica",
      detalle: "Auditoría de títulos y operatoria presencial o remota",
    },
  ],
  bandaLago: {
    etiqueta: "Mari Menuco · Neuquén",
    titulo: "Tu lote propio,",
    tituloCursiva: "frente al lago",
    descripcion:
      "Terrenos urbanizados en Bahía de las Playas con aguas cristalinas, bajada náutica, factibilidad de servicios y alta revalorización patrimonial.",
    precioDesde: "Desde USD 32.000",
    superficieRef: "750 a 1.000 m²",
    distanciaRef: "65 km de Neuquén Capital",
  },
  servicios: [
    {
      id: "venta",
      titulo: "Compra & Venta de Inmuebles",
      descripcion:
        "Gestión integral de compraventa de residencias, lotes y chacras con auditoría de títulos y contratos garantizados.",
      activo: true,
    },
    {
      id: "loteos",
      titulo: "Desarrollo & Loteos frente al Lago",
      descripcion:
        "Comercialización exclusiva de terrenos en Bahía de las Playas (Mari Menuco) con factibilidad de servicios y alta plusvalía.",
      activo: true,
    },
    {
      id: "tasaciones",
      titulo: "Tasaciones Periciales Oficiales",
      descripcion:
        "Dictámenes de valuación con firma colegiada (Mat. 35 RP 2026) válidos para bancos, sucesiones, escrituraciones y compraventa.",
      activo: true,
    },
    {
      id: "alquileres",
      titulo: "Alquiler Corporativo & Residencial",
      descripcion:
        "Administración llave en mano de propiedades para empresas petroleras y familias en Cipolletti y Catriel.",
      activo: true,
    },
    {
      id: "consultoria",
      titulo: "Consultoría Legal & Notarial",
      descripcion:
        "Asesoramiento en cesiones de derechos, reglamentos de copropiedad y operaciones a distancia para no residentes.",
      activo: true,
    },
  ],
  zonas: [
    {
      id: "mari-menuco",
      nombre: "Mari Menuco",
      provincia: "Neuquén",
      descripcion:
        "Epicentro recreativo y residencial de aguas cristalinas a 45 minutos de Neuquén Capital.",
      destacado: "Barrio Privado Bahía de las Playas",
      tipoInversion: "Lotes & Casas de Lago · Alta Plusvalía",
      activo: true,
    },
    {
      id: "cipolletti",
      nombre: "Cipolletti",
      provincia: "Río Negro",
      descripcion:
        "Plaza residencial consolidada con acceso inmediato a Neuquén Capital y barrios privados.",
      destacado: "Residencial & Barrios Cerrados",
      tipoInversion: "Residencial & Corporativo · Rentabilidad Estable",
      activo: true,
    },
    {
      id: "catriel",
      nombre: "Catriel & Vaca Muerta",
      provincia: "Río Negro",
      descripcion:
        "Nodo energético estratégico con alta demanda de vivienda para empresas de servicios petroleros.",
      destacado: "Alquileres Corporativos en USD",
      tipoInversion: "Renta Corporativa en USD · Fracciones Logísticas",
      activo: true,
    },
    {
      id: "general-roca",
      nombre: "General Roca",
      provincia: "Río Negro",
      descripcion:
        "Cabecera del Alto Valle con fuerte desarrollo comercial, chacras productivas y nuevos loteos.",
      destacado: "Chacras & Lotes en Expansión",
      tipoInversion: "Chacras, Campos & Loteos en Expansión",
      activo: true,
    },
  ],
  faqs: [
    {
      id: "faq-1",
      categoria: "Comprar & Invertir",
      pregunta: "¿Puedo comprar un lote en Mari Menuco si vivo fuera de Neuquén?",
      respuesta:
        "Sí. En ALTUM SCI gestionamos todo el proceso de forma 100% legal y remota mediante poderes notariales, visitas virtuales en vivo y firma certificada ante escribano.",
    },
    {
      id: "faq-2",
      categoria: "Venta & Tasaciones",
      pregunta: "¿En cuánto tiempo entregan el dictamen de tasación oficial?",
      respuesta:
        "Coordinamos la visita o relevamiento técnico en el día y entregamos el informe de valuación firmado por la Martillera Estela Mari Rojas (Mat. 35 RP 2026) dentro de las 24 a 48 horas hábiles.",
    },
    {
      id: "faq-3",
      categoria: "Alquileres",
      pregunta: "¿Administran alquileres corporativos para empresas petroleras?",
      respuesta:
        "Sí. Gestionamos contratos corporativos en Cipolletti, Catriel y el corredor de Vaca Muerta con solvencia verificada, cobro puntual y mantenimiento integral.",
    },
  ],
};

export function getSiteConfig(): SiteConfig {
  try {
    if (fs.existsSync(TMP_CONFIG_PATH)) {
      const raw = fs.readFileSync(TMP_CONFIG_PATH, "utf-8");
      return { ...DEFAULT_SITE_CONFIG, ...(JSON.parse(raw) as SiteConfig) };
    }
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8");
      return { ...DEFAULT_SITE_CONFIG, ...(JSON.parse(data) as SiteConfig) };
    }
  } catch (err) {
    console.error("Error reading site config, using fallback", err);
  }

  return DEFAULT_SITE_CONFIG;
}

export function saveSiteConfig(newConfig: SiteConfig): boolean {
  let saved = false;
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), "utf-8");
    saved = true;
  } catch {
    // En producción serverless el FS de código es de solo lectura
  }

  try {
    fs.writeFileSync(TMP_CONFIG_PATH, JSON.stringify(newConfig, null, 2), "utf-8");
    saved = true;
  } catch (err) {
    console.error("Error saving site config to tmp", err);
  }

  return saved;
}
