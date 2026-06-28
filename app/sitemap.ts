import type { MetadataRoute } from "next";

const BASE = "https://www.freeqrcodemaker.in";

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
    { path: "/image-to-qr-code", priority: 0.8 },
    { path: "/pdf-to-qr-code", priority: 0.8 },
    { path: "/whatsapp-qr-code-generator", priority: 0.8 },
    { path: "/email-qr-code-generator", priority: 0.8 },
    { path: "/sms-qr-code-generator", priority: 0.8 },
    { path: "/bulk-qr-generator", priority: 0.8 },
  ];

  return pages.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
  }));
}
