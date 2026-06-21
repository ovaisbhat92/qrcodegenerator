import type { QRType } from "@/types/qr";

// Structural type matching qr-code-styling's download API so we avoid
// importing the class at module level (it accesses browser APIs on load).
export interface QRDownloadable {
  download(options: { name: string; extension: string }): Promise<void>;
}

const FILENAMES: Record<QRType, string> = {
  url: "url-qr-code",
  text: "text-qr-code",
  wifi: "wifi-qr-code",
};

export function getFilename(qrType: QRType): string {
  return FILENAMES[qrType] ?? "qr-code";
}

export function downloadPNG(qr: QRDownloadable, qrType: QRType): void {
  qr.download({ name: getFilename(qrType), extension: "png" });
}

export function downloadSVG(qr: QRDownloadable, qrType: QRType): void {
  qr.download({ name: getFilename(qrType), extension: "svg" });
}
