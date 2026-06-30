import type { VCardInput, LocationInput, UpiInput, WhatsAppInput, EmailInput, SmsInput, WifiInput } from "@/types/qr";

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

export function validatePhone(phone: string): ValidationResult {
  const trimmed = phone.trim();
  if (!trimmed) return { valid: false, error: "Phone number is required" };
  if (!/^[+\d][\d\s\-().]{2,}$/.test(trimmed)) {
    return { valid: false, error: "Enter a valid phone number (e.g. +1 555-123-4567)" };
  }
  return { valid: true };
}

export function validateVCard(vcard: VCardInput): ValidationResult {
  if (!vcard.fullName.trim()) {
    return { valid: false, error: "Full name is required" };
  }
  return { valid: true };
}

export function validateUpi(upi: UpiInput): ValidationResult {
  const id = upi.upiId.trim();
  if (!id) return { valid: false, error: "UPI ID is required" };
  if (!id.includes("@")) {
    return { valid: false, error: "UPI ID must be in the format name@upi (e.g. name@okaxis)" };
  }
  if (!upi.payeeName.trim()) return { valid: false, error: "Payee name is required" };
  if (upi.amount.trim()) {
    const amt = parseFloat(upi.amount.trim());
    if (isNaN(amt) || amt <= 0) {
      return { valid: false, error: "Amount must be a positive number" };
    }
  }
  return { valid: true };
}

const MAPS_URL_RE =
  /^https?:\/\/(www\.)?google\.[a-z.]+\/maps|^https?:\/\/maps\.google\.|^https?:\/\/(goo\.gl\/maps|maps\.app\.goo\.gl)/i;

export function validateLocation(location: LocationInput): ValidationResult {
  if (location.mode === "mapslink") {
    const url = location.mapsLink.trim();
    if (!url) return { valid: false, error: "Google Maps link is required" };
    if (!MAPS_URL_RE.test(url)) {
      return { valid: false, error: "Enter a valid Google Maps URL" };
    }
    return { valid: true };
  }
  if (!location.lat.trim() || !location.lng.trim()) {
    return { valid: false, error: "Latitude and longitude are required" };
  }
  const lat = parseFloat(location.lat);
  const lng = parseFloat(location.lng);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    return { valid: false, error: "Latitude must be between -90 and 90" };
  }
  if (isNaN(lng) || lng < -180 || lng > 180) {
    return { valid: false, error: "Longitude must be between -180 and 180" };
  }
  return { valid: true };
}

export function validateWhatsApp(input: WhatsAppInput): ValidationResult {
  if (!input.countryCode) {
    return { valid: false, error: "Please select a country code" };
  }
  const phone = input.phone.trim();
  if (!phone) {
    return { valid: false, error: "Phone number is required" };
  }
  if (!/^\d{7,15}$/.test(phone)) {
    return { valid: false, error: "Phone number must be 7–15 digits (no spaces or dashes)" };
  }
  return { valid: true };
}

export function validateEmail(input: EmailInput): ValidationResult {
  const email = input.email.trim();
  if (!email) return { valid: false, error: "Email address is required" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: "Please enter a valid email address (e.g. name@example.com)" };
  }
  return { valid: true };
}

export function validateSms(input: SmsInput): ValidationResult {
  const phone = input.phone.trim();
  if (!phone) {
    return { valid: false, error: "Phone number is required" };
  }
  return { valid: true };
}

export function validateWifi(input: WifiInput): ValidationResult {
  if (!input.ssid.trim()) {
    return { valid: false, error: "Network name (SSID) is required" };
  }
  if (input.encryption !== "nopass" && !input.password.trim()) {
    return { valid: false, error: "Password is required for WPA/WPA2 and WEP networks" };
  }
  return { valid: true };
}
