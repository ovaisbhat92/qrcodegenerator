import type { QRType } from "@/types/qr";

// Structural type matching qr-code-styling's download API so we avoid
// importing the class at module level (it accesses browser APIs on load).
export interface QRDownloadable {
  download(options: { name: string; extension: string }): Promise<void>;
  getRawData(extension: string): Promise<Blob>;
}

const FILENAMES: Record<QRType, string> = {
  url: "url-qr-code",
  text: "text-qr-code",
  phone: "phone-qr-code",
  vcard: "vcard-qr-code",
  location: "location-qr-code",
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

export function downloadJPEG(qr: QRDownloadable, qrType: QRType): void {
  qr.download({ name: getFilename(qrType), extension: "jpeg" });
}

export function downloadWebP(qr: QRDownloadable, qrType: QRType): void {
  qr.download({ name: getFilename(qrType), extension: "webp" });
}
