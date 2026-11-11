import fs from "fs";
import path from "path";
import { getDb } from "@/lib/firebase";
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

// Fuente de verdad: Firestore config/site (lo escribe el admin). Fallback: el JSON versionado en el repo.
const CONFIG_PATH = path.join(process.cwd(), "src", "data", "site-config.json");
const configDoc = () => getDb().collection("config").doc("site");

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const snap = await configDoc().get();
    if (snap.exists)
      return { ...DEFAULT_SITE_CONFIG, ...(snap.data() as SiteConfig) };
  } catch (err) {
    console.error(
      "Error reading site config from Firestore, using repo fallback",
      err,
    );
  }

  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return {
        ...DEFAULT_SITE_CONFIG,
        ...(JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8")) as SiteConfig),
      };
    }
  } catch (err) {
    console.error("Error reading site config file, using defaults", err);
  }

  return DEFAULT_SITE_CONFIG;
}

export async function saveSiteConfig(newConfig: SiteConfig): Promise<boolean> {
  try {
    // JSON round-trip: Firestore rechaza `undefined`
    await configDoc().set(JSON.parse(JSON.stringify(newConfig)));
    return true;
  } catch (err) {
    console.error("Error saving site config to Firestore", err);
    return false;
  }
}
