import type { MetadataRoute } from "next";

const SITE_URL = "https://smoak-paris.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/commande", "/contact", "/qui-sommes-nous", "/cgv", "/mentions-legales", "/confidentialite"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/commande" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/commande" ? 0.9 : 0.5,
  }));
}
