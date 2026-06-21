import type { WifiInput } from "@/types/qr";

export interface ValidationResult {
  valid: boolean;
  value?: string;       // normalized value (e.g. URL with https:// prepended)
  error?: string;
  warning?: string;
}

export function validateUrl(url: string): ValidationResult {
  const trimmed = url.trim();
  if (!trimmed) return { valid: false, error: "URL is required" };

  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  try {
    new URL(normalized);
    return { valid: true, value: normalized };
  } catch {
    return { valid: false, error: "Please enter a valid URL (e.g. example.com)" };
  }
}

const TEXT_WARN_AT = 500;
const TEXT_MAX = 2000;

export function validateText(text: string): ValidationResult {
  if (!text.trim()) return { valid: false, error: "Text content is required" };
  if (text.length > TEXT_MAX) {
    return {
      valid: false,
      error: `Text must be ${TEXT_MAX} characters or fewer (currently ${text.length})`,
    };
  }
  if (text.length > TEXT_WARN_AT) {
    return {
      valid: true,
      warning: `Long text (${text.length} chars) creates a very dense QR code that may be hard to scan. Consider shortening it.`,
    };
  }
  return { valid: true };
}

export function validateWifi(wifi: WifiInput): ValidationResult {
  if (!wifi.ssid.trim()) {
    return { valid: false, error: "Network name (SSID) is required" };
  }
  if (wifi.encryption !== "nopass" && !wifi.password) {
    return {
      valid: false,
      error: "Password is required for WPA/WPA2 and WEP networks",
    };
  }
  return { valid: true };
}
