import type { VCardInput, LocationInput, UpiInput } from "@/types/qr";

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
  const nameParts = vcard.fullName.trim().split(/\s+/);
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : "";

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
    `FN:${escapeVCard(vcard.fullName.trim())}`,
  ];
  if (vcard.company)  lines.push(`ORG:${escapeVCard(vcard.company)}`);
  if (vcard.jobTitle) lines.push(`TITLE:${escapeVCard(vcard.jobTitle)}`);
  if (vcard.phone)    lines.push(`TEL:${vcard.phone.trim()}`);
  if (vcard.email)    lines.push(`EMAIL:${vcard.email.trim()}`);
  if (vcard.website)  lines.push(`URL:${vcard.website.trim()}`);
  if (vcard.address)  lines.push(`ADR:;;${escapeVCard(vcard.address)};;;;`);
  lines.push("END:VCARD");

  return lines.join("\r\n");
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
