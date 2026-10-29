import fs from "fs";
import os from "os";
import path from "path";
import {
  SiteConfig,
  DEFAULT_SITE_CONFIG,
  PerfilOwner,
  ServicioConfig,
  ZonaConfig,
  HeroLandingConfig,
  StatManifiesto,
  BandaLagoConfig,
  FaqLandingItem,
} from "@/lib/site-config-types";

export type {
  SiteConfig,
  PerfilOwner,
  ServicioConfig,
  ZonaConfig,
  HeroLandingConfig,
  StatManifiesto,
  BandaLagoConfig,
  FaqLandingItem,
};
export { DEFAULT_SITE_CONFIG };

const CONFIG_PATH = path.join(process.cwd(), "src", "data", "site-config.json");
const TMP_CONFIG_PATH = path.join(os.tmpdir(), "altum-site-config.json");

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
