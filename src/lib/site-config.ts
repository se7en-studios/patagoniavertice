import fs from "fs";
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
  aniosExperiencia: number;
  operacionesConcretadas: number;
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
  destacado: string;
  activo: boolean;
}

export interface SiteConfig {
  perfil: PerfilOwner;
  servicios: ServicioConfig[];
  zonas: ZonaConfig[];
}

const CONFIG_PATH = path.join(process.cwd(), "src", "data", "site-config.json");

export function getSiteConfig(): SiteConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8");
      return JSON.parse(data) as SiteConfig;
    }
  } catch (err) {
    console.error("Error reading site config, using fallback", err);
  }

  // Fallback seguro
  return {
    perfil: {
      nombre: "Estela Mari Rojas",
      titulo: "Martillera y Corredora Pública Colegiada",
      matricula: "Mat. 35 RP 2026",
      colegio: "Colegio de Martilleros y Corredores Públicos de Río Negro (IV Circunscripción)",
      telefono: "+54 9 299 609-5742",
      whatsapp: "5492996095742",
      email: "altumsci@gmail.com",
      foto: "/estela.jpg",
      bio: "Martillera y Corredora Pública con amplia trayectoria en el mercado inmobiliario patagónico.",
      cobertura: "Mari Menuco, Cipolletti, Catriel, General Roca y Río Negro",
      aniosExperiencia: 12,
      operacionesConcretadas: 180,
    },
    servicios: [],
    zonas: [],
  };
}

export function saveSiteConfig(newConfig: SiteConfig): boolean {
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving site config", err);
    return false;
  }
}
