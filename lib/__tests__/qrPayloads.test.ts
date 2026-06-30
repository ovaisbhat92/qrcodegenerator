import { describe, it, expect } from "vitest";
import {
  generateUrlPayload,
  generateTextPayload,
  generatePhonePayload,
  generateVCardPayload,
  generateLocationPayload,
  generateUpiPayload,
  generateWhatsAppPayload,
  generateEmailPayload,
  generateSmsPayload,
} from "../qrPayloads";
import { validateUpi } from "../validators";
import type { VCardInput, LocationInput, UpiInput, WhatsAppInput, EmailInput, SmsInput } from "@/types/qr";

// ── generateUrlPayload ────────────────────────────────────────────────────────

describe("generateUrlPayload", () => {
  it("prepends https:// when protocol is missing", () => {
    expect(generateUrlPayload("example.com")).toBe("https://example.com");
  });

  it("leaves https:// URLs unchanged", () => {
    expect(generateUrlPayload("https://example.com/path?q=1")).toBe(
      "https://example.com/path?q=1"
    );
  });

  it("leaves http:// URLs as-is", () => {
    expect(generateUrlPayload("http://example.com")).toBe("http://example.com");
  });

  it("returns empty string for empty input", () => {
    expect(generateUrlPayload("")).toBe("");
  });

  it("trims surrounding whitespace before processing", () => {
    expect(generateUrlPayload("  example.com  ")).toBe("https://example.com");
  });

  it("strips ASCII control characters", () => {
    expect(generateUrlPayload("https://example.com/\x00path")).toBe(
      "https://example.com/path"
    );
  });
});

// ── generateTextPayload ───────────────────────────────────────────────────────

describe("generateTextPayload", () => {
  it("returns the text unchanged", () => {
    expect(generateTextPayload("Hello, world!")).toBe("Hello, world!");
  });

  it("strips ASCII control characters including newlines (U+0000–U+001F, U+007F)", () => {
    expect(generateTextPayload("hello\x00world")).toBe("helloworld");
    expect(generateTextPayload("tab\x09here")).toBe("tabhere");
    expect(generateTextPayload("newline\x0Ahere")).toBe("newlinehere");
    expect(generateTextPayload("del\x7fchar")).toBe("delchar");
  });

  it("returns empty string for empty input", () => {
    expect(generateTextPayload("")).toBe("");
  });
});

// ── generatePhonePayload ──────────────────────────────────────────────────────

describe("generatePhonePayload", () => {
  it("produces tel:{number} format", () => {
    expect(generatePhonePayload("+1 555-123-4567")).toBe("tel:+1 555-123-4567");
  });

  it("trims surrounding whitespace from the number", () => {
    expect(generatePhonePayload("  +447911123456  ")).toBe("tel:+447911123456");
  });

  it("preserves digits-only numbers", () => {
    expect(generatePhonePayload("5551234567")).toBe("tel:5551234567");
  });
});

// ── generateVCardPayload ──────────────────────────────────────────────────────

const BASE_VCARD: VCardInput = {
  fullName: "Jane Smith",
  phone: "",
  email: "",
  company: "",
  jobTitle: "",
  website: "",
  address: "",
};

describe("generateVCardPayload", () => {
  it("starts with BEGIN:VCARD and ends with END:VCARD\\r\\n", () => {
    const result = generateVCardPayload(BASE_VCARD);
    expect(result.startsWith("BEGIN:VCARD")).toBe(true);
    expect(result.endsWith("END:VCARD\r\n")).toBe(true);
  });

  it("includes VERSION:3.0", () => {
    expect(generateVCardPayload(BASE_VCARD)).toContain("VERSION:3.0");
  });

  it("includes the full name in the FN field", () => {
    expect(generateVCardPayload(BASE_VCARD)).toContain("FN:Jane Smith");
  });

  it("omits optional fields when they are empty", () => {
    const result = generateVCardPayload(BASE_VCARD);
    expect(result).not.toContain("ORG:");
    expect(result).not.toContain("TITLE:");
    expect(result).not.toContain("TEL:");
    expect(result).not.toContain("EMAIL:");
    expect(result).not.toContain("URL:");
    expect(result).not.toContain("ADR:");
  });

  it("includes TEL when phone is provided", () => {
    const result = generateVCardPayload({ ...BASE_VCARD, phone: "+1 555-000-0001" });
    expect(result).toContain("TEL;TYPE=CELL:+1 555-000-0001");
  });

  it("includes EMAIL when email is provided", () => {
    const result = generateVCardPayload({ ...BASE_VCARD, email: "jane@example.com" });
    expect(result).toContain("EMAIL:jane@example.com");
  });

  it("includes ORG when company is provided", () => {
    const result = generateVCardPayload({ ...BASE_VCARD, company: "Acme Corp" });
    expect(result).toContain("ORG:Acme Corp");
  });

  it("includes TITLE when jobTitle is provided", () => {
    const result = generateVCardPayload({ ...BASE_VCARD, jobTitle: "Product Manager" });
    expect(result).toContain("TITLE:Product Manager");
  });

  it("includes URL when website is provided", () => {
    const result = generateVCardPayload({ ...BASE_VCARD, website: "https://janesmith.com" });
    expect(result).toContain("URL:https://janesmith.com");
  });

  it("includes ADR when address is provided", () => {
    const result = generateVCardPayload({ ...BASE_VCARD, address: "123 Main St" });
    expect(result).toContain("ADR:");
    expect(result).toContain("123 Main St");
  });

  it("separates lines with CRLF (\\r\\n)", () => {
    const result = generateVCardPayload(BASE_VCARD);
    expect(result).toContain("\r\n");
  });
});

// ── generateLocationPayload ───────────────────────────────────────────────────

describe("generateLocationPayload", () => {
  it("returns the Maps link as-is in mapslink mode", () => {
    const input: LocationInput = {
      mode: "mapslink",
      mapsLink: "https://maps.app.goo.gl/abc123",
      lat: "",
      lng: "",
    };
    expect(generateLocationPayload(input)).toBe("https://maps.app.goo.gl/abc123");
  });

  it("trims whitespace from the Maps link", () => {
    const input: LocationInput = {
      mode: "mapslink",
      mapsLink: "  https://maps.app.goo.gl/abc123  ",
      lat: "",
      lng: "",
    };
    expect(generateLocationPayload(input)).toBe("https://maps.app.goo.gl/abc123");
  });

  it("produces a valid Google Maps URL from lat/long coordinates", () => {
    const input: LocationInput = {
      mode: "coordinates",
      lat: "40.7128",
      lng: "-74.0060",
      mapsLink: "",
    };
    const result = generateLocationPayload(input);
    expect(result).toContain("https://www.google.com/maps");
    expect(result).toContain("40.7128");
    expect(result).toContain("-74.0060");
  });

  it("embeds coordinates in the URL query string for coordinates mode", () => {
    const input: LocationInput = {
      mode: "coordinates",
      lat: "51.5074",
      lng: "-0.1278",
      mapsLink: "",
    };
    const result = generateLocationPayload(input);
    expect(result).toBe("https://www.google.com/maps?q=51.5074,-0.1278");
  });
});

// ── generateUpiPayload ────────────────────────────────────────────────────────

const BASE_UPI: UpiInput = {
  upiId: "test@upi",
  payeeName: "Test User",
  amount: "100",
  note: "Payment",
};

describe("generateUpiPayload", () => {
  it("generates correct URL with all fields", () => {
    const result = generateUpiPayload(BASE_UPI);
    expect(result).toBe(
      "upi://pay?pa=test@upi&pn=Test%20User&am=100&cu=INR&tn=Payment"
    );
  });

  it("omits am and tn when amount and note are empty", () => {
    const result = generateUpiPayload({ ...BASE_UPI, amount: "", note: "" });
    expect(result).toBe("upi://pay?pa=test@upi&pn=Test%20User&cu=INR");
    expect(result).not.toContain("&am=");
    expect(result).not.toContain("&tn=");
  });

  it("omits am but includes tn when only note is provided", () => {
    const result = generateUpiPayload({ ...BASE_UPI, amount: "" });
    expect(result).toContain("&tn=Payment");
    expect(result).not.toContain("&am=");
  });

  it("encodes spaces in payee name", () => {
    const result = generateUpiPayload({ ...BASE_UPI, payeeName: "My Shop" });
    expect(result).toContain("pn=My%20Shop");
  });

  it("encodes special characters in note", () => {
    const result = generateUpiPayload({ ...BASE_UPI, note: "Hello & World" });
    expect(result).toContain("tn=Hello%20%26%20World");
  });
});

// ── generateWhatsAppPayload ───────────────────────────────────────────────────

const BASE_WA: WhatsAppInput = { countryCode: "91", phone: "9876543210", message: "" };

describe("generateWhatsAppPayload", () => {
  it("produces a wa.me URL with country code + phone", () => {
    expect(generateWhatsAppPayload(BASE_WA)).toBe("https://wa.me/919876543210");
  });

  it("appends encoded message when provided", () => {
    const result = generateWhatsAppPayload({ ...BASE_WA, message: "Hello World" });
    expect(result).toBe("https://wa.me/919876543210?text=Hello%20World");
  });

  it("omits ?text param when message is empty", () => {
    expect(generateWhatsAppPayload(BASE_WA)).not.toContain("?text");
  });

  it("omits ?text param when message is whitespace only", () => {
    expect(generateWhatsAppPayload({ ...BASE_WA, message: "   " })).not.toContain("?text");
  });
});

// ── generateEmailPayload ──────────────────────────────────────────────────────

const BASE_EMAIL: EmailInput = { email: "test@example.com", subject: "", body: "" };

describe("generateEmailPayload", () => {
  it("produces a mailto URI with only the email address", () => {
    expect(generateEmailPayload(BASE_EMAIL)).toBe("mailto:test@example.com");
  });

  it("ignores subject — returns only email", () => {
    expect(generateEmailPayload({ ...BASE_EMAIL, subject: "Hello" })).toBe("mailto:test@example.com");
  });

  it("ignores subject and body — returns only email", () => {
    const result = generateEmailPayload({ ...BASE_EMAIL, subject: "Hi", body: "Hello there" });
    expect(result).toBe("mailto:test@example.com");
  });

  it("never encodes subject special characters into payload", () => {
    const result = generateEmailPayload({ ...BASE_EMAIL, subject: "Hello & World" });
    expect(result).toBe("mailto:test@example.com");
  });
});

// ── generateSmsPayload ────────────────────────────────────────────────────────

const BASE_SMS: SmsInput = { phone: "+91 9876543210", message: "" };

describe("generateSmsPayload", () => {
  it("produces sms: URI with phone number only when no message", () => {
    expect(generateSmsPayload(BASE_SMS)).toBe("sms:+919876543210");
  });

  it("includes encoded message in sms:?body= format when provided", () => {
    expect(generateSmsPayload({ ...BASE_SMS, message: "Hi there" })).toBe("sms:+919876543210?body=Hi%20there");
  });

  it("auto-prefixes +91 for 10-digit Indian numbers starting with 6-9", () => {
    expect(generateSmsPayload({ phone: "9876543210", message: "" })).toBe("sms:+919876543210");
  });

  it("strips spaces, dashes, and parentheses from phone number", () => {
    expect(generateSmsPayload({ phone: "+1 (555) 123-4567", message: "" })).toBe("sms:+15551234567");
  });

  it("handles whitespace-only message identically to empty message", () => {
    expect(generateSmsPayload({ ...BASE_SMS, message: "   " })).toBe("sms:+919876543210");
  });
});

// ── validateUpi ───────────────────────────────────────────────────────────────

describe("validateUpi", () => {
  it("passes validation with all fields valid", () => {
    expect(validateUpi(BASE_UPI).valid).toBe(true);
  });

  it("passes validation when amount and note are empty", () => {
    expect(validateUpi({ ...BASE_UPI, amount: "", note: "" }).valid).toBe(true);
  });

  it("fails when UPI ID is empty", () => {
    const r = validateUpi({ ...BASE_UPI, upiId: "" });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/required/i);
  });

  it("fails when UPI ID has no @ symbol", () => {
    const r = validateUpi({ ...BASE_UPI, upiId: "invalididformat" });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/@/);
  });

  it("fails when amount is negative", () => {
    const r = validateUpi({ ...BASE_UPI, amount: "-50" });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/positive/i);
  });

  it("fails when payee name is empty", () => {
    const r = validateUpi({ ...BASE_UPI, payeeName: "" });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/payee/i);
  });
});
