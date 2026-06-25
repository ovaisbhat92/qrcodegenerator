import type { MetadataRoute } from "next";

const BASE = "https://qrcodegenerator.space";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1.0 },
    { path: "/qr-code-generator", priority: 1.0 },
    { path: "/url-qr-code-generator", priority: 0.8 },
    { path: "/text-qr-code-generator", priority: 0.8 },
    { path: "/phone-qr-code-generator", priority: 0.8 },
    { path: "/vcard-qr-code-generator", priority: 0.8 },
    { path: "/location-qr-code-generator", priority: 0.8 },
    { path: "/upi-qr-code-generator", priority: 0.8 },
    { path: "/qr-code-scanner", priority: 0.8 },
  ];

  return pages.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
  }));
}
