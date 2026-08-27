import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/stock",
        "/livreur",
        "/api/",
        "/commande/suivi",
        "/commande/confirmation",
      ],
    },
    sitemap: "https://smoak-paris.vercel.app/sitemap.xml",
  };
}
