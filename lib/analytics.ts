// PRIVACY: Only structural parameters are tracked here — never QR content
// (URLs, phone numbers, text, vCard data, location coordinates, etc.)

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function send(event: string, params: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

export function trackQRGenerated(params: {
  qr_type: string;
  has_logo: boolean;
  has_gradient: boolean;
  dot_style: string;
  error_correction: string;
}) {
  send("qr_generated", params);
}

export function trackQRDownloaded(params: {
  qr_type: string;
  file_format: string;
}) {
  send("qr_downloaded", params);
}

export function trackQRCopied(params: {
  qr_type: string;
}) {
  send("qr_copied", params);
}

export function trackPresetSelected(params: {
  preset_name: string;
}) {
  send("preset_selected", params);
}

export function trackLogoUploaded(params: {
  file_type: string;
}) {
  send("logo_uploaded", params);
}

// method: 'upload' | 'camera' — content_type is inferred from decoded value structure, never the raw content
export function trackQRScanned(params: {
  method: "upload" | "camera";
  content_type: string;
}) {
  send("qr_scanned", params);
}
