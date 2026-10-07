import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.melodybug.co.kr").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/order/complete", "/order/fail"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
