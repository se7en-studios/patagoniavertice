import { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const aiAndSearchBots = [
    "*",
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Google-Extended",
    "Googlebot",
    "Bingbot",
    "Applebot-Extended",
    "DuckDuckBot",
  ];

  return {
    rules: aiAndSearchBots.map((userAgent) => ({
      userAgent,
      allow: ["/", "/guias/", "/proyectos/", "/en", "/llms.txt"],
      disallow: ["/admin/", "/api/", "/auth/"],
    })),
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
