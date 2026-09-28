import type { MetadataRoute } from "next";
import { CLUB } from "@/data/nbb";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/espace-dirigeants" },
    sitemap: `${CLUB.siteUrl}/sitemap.xml`,
  };
}
