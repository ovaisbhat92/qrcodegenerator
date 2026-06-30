import type { VCardInput, LocationInput, UpiInput, WhatsAppInput, EmailInput, SmsInput, WifiInput } from "@/types/qr";

// Strip ASCII control characters (U+0000–U+001F, U+007F) to prevent QR data corruption.
function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x1F\x7F]/g, "");
}

export function generateUrlPayload(url: string): string {
  const cleaned = stripControlChars(url).trim();
  if (!cleaned) return "";
  if (!/^https?:\/\//i.test(cleaned)) {
    return `https://${cleaned}`;
  }
  return cleaned;
}

export function generateTextPayload(text: string): string {
  return stripControlChars(text);
}

export function generatePhonePayload(phone: string): string {
  return `tel:${phone.trim()}`;
}

function escapeVCard(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function generateVCardPayload(vcard: VCardInput): string {
  const fullName = vcard.fullName.trim();
  const nameParts = fullName.split(/\s+/);
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "";

  const phone   = vcard.phone.trim();
  const email   = vcard.email.trim();
  const company = vcard.company.trim();
  const jobTitle = vcard.jobTitle.trim();
  const website = vcard.website.trim();
  const address = vcard.address.trim();

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fullName}`,
    `N:${lastName};${firstName};;;`,
  ];

  if (phone)    lines.push(`TEL;TYPE=CELL:${phone}`);
  if (email)    lines.push(`EMAIL:${email}`);
  if (company)  lines.push(`ORG:${company}`);
  if (jobTitle) lines.push(`TITLE:${jobTitle}`);
  if (website)  lines.push(`URL:${website}`);
  if (address)  lines.push(`ADR:;;${address};;;;`);

  lines.push("END:VCARD");

  // CRITICAL: vCard spec requires \r\n line endings for device compatibility
  return lines.join("\r\n") + "\r\n";
}

export function generateLocationPayload(location: LocationInput): string {
  if (location.mode === "mapslink") {
    return location.mapsLink.trim();
  }
  return `https://www.google.com/maps?q=${location.lat.trim()},${location.lng.trim()}`;
}

export function generateUpiPayload(upi: UpiInput): string {
  let url = `upi://pay?pa=${upi.upiId.trim()}&pn=${encodeURIComponent(upi.payeeName.trim())}`;
  if (upi.amount.trim()) url += `&am=${upi.amount.trim()}`;
  url += "&cu=INR";
  if (upi.note.trim()) url += `&tn=${encodeURIComponent(upi.note.trim())}`;
  return url;
}

export function generateWhatsAppPayload(input: WhatsAppInput): string {
  const phone = `${input.countryCode}${input.phone.trim()}`;
  if (input.message.trim()) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(input.message.trim())}`;
  }
  return `https://wa.me/${phone}`;
}

export function generateEmailPayload(input: EmailInput): string {
  // Subject and body are intentionally excluded — keeping payload short ensures reliable scanning.
  return `mailto:${input.email.trim()}`;
}

export function generateSmsPayload(input: SmsInput): string {
  const cleanPhone = input.phone.replace(/[\s\-\(\)]/g, "");
  // Preserve existing + prefix; auto-prefix +91 for 10-digit Indian numbers (6–9)
  const formattedPhone = cleanPhone.startsWith("+")
    ? cleanPhone
    : cleanPhone.length === 10 && ["6","7","8","9"].includes(cleanPhone[0])
      ? `+91${cleanPhone}`
      : `+${cleanPhone}`;
  const message = input.message.trim();
  // sms:?body= format reliably pre-fills the message body on Android and iOS
  return message
    ? `sms:${formattedPhone}?body=${encodeURIComponent(message)}`
    : `sms:${formattedPhone}`;
}

export function generateWifiPayload(input: WifiInput): string {
  return `WIFI:T:${input.encryption};S:${input.ssid};P:${input.password};H:${input.hidden};;`;
}
