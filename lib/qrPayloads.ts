import type { VCardInput, LocationInput, UpiInput, WhatsAppInput, EmailInput, SmsInput } from "@/types/qr";

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

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fullName}`,
    `N:${lastName};${firstName};;;`,
    phone    ? `TEL;TYPE=CELL:${phone}`    : null,
    email    ? `EMAIL:${email}`            : null,
    company  ? `ORG:${company}`            : null,
    jobTitle ? `TITLE:${jobTitle}`         : null,
    website  ? `URL:${website}`            : null,
    address  ? `ADR:;;${address};;;;`      : null,
    "END:VCARD",
  ].filter(Boolean);

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
  const email = input.email.trim();
  const params: string[] = [];
  if (input.subject.trim()) params.push(`subject=${encodeURIComponent(input.subject.trim())}`);
  if (input.body.trim()) params.push(`body=${encodeURIComponent(input.body.trim())}`);
  return params.length > 0 ? `mailto:${email}?${params.join("&")}` : `mailto:${email}`;
}

export function generateSmsPayload(input: SmsInput): string {
  const digits = input.phone.trim().replace(/[\s\-().+]/g, "");
  const phone = `+${digits}`;
  if (input.format === "smsto") {
    if (input.message.trim()) return `SMSTO:${phone}:${input.message.trim()}`;
    return `SMSTO:${phone}`;
  }
  // Default: sms: scheme (Android/iOS compatible)
  if (input.message.trim()) return `sms:${phone}?body=${encodeURIComponent(input.message.trim())}`;
  return `sms:${phone}`;
}
