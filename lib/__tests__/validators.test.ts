import { describe, it, expect } from "vitest";
import {
  validateUrl,
  validateText,
  validatePhone,
  validateVCard,
  validateLocation,
  validateWhatsApp,
  validateEmail,
  validateSms,
  validateWifi,
} from "../validators";
import type { VCardInput, LocationInput, WhatsAppInput, EmailInput, SmsInput, WifiInput } from "@/types/qr";

// ── validateUrl ───────────────────────────────────────────────────────────────

describe("validateUrl", () => {
  it("accepts a valid https:// URL", () => {
    const result = validateUrl("https://example.com");
    expect(result.valid).toBe(true);
  });

  it("accepts a valid http:// URL", () => {
    expect(validateUrl("http://example.com").valid).toBe(true);
  });

  it("accepts a plain domain without protocol and normalizes it to https://", () => {
    const result = validateUrl("example.com");
    expect(result.valid).toBe(true);
    expect(result.value).toBe("https://example.com");
  });

  it("accepts a URL with path, query, and fragment", () => {
    expect(validateUrl("https://example.com/page?q=1#section").valid).toBe(true);
  });

  it("rejects an empty string with an error message", () => {
    const result = validateUrl("");
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("rejects a whitespace-only string", () => {
    expect(validateUrl("   ").valid).toBe(false);
  });

  it("rejects a random non-URL string with spaces", () => {
    const result = validateUrl("not a url !!!");
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("rejects a string with spaces that cannot form a valid URL", () => {
    expect(validateUrl("not a url with spaces").valid).toBe(false);
  });
});

// ── validateText ──────────────────────────────────────────────────────────────

describe("validateText", () => {
  it("accepts normal text", () => {
    expect(validateText("hello world").valid).toBe(true);
  });

  it("accepts text under the warning threshold (500 chars)", () => {
    const result = validateText("a".repeat(499));
    expect(result.valid).toBe(true);
    expect(result.warning).toBeUndefined();
  });

  it("rejects empty string", () => {
    const result = validateText("");
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("rejects whitespace-only string", () => {
    expect(validateText("   ").valid).toBe(false);
  });

  it("is valid but returns a warning for text between 500 and 2000 chars", () => {
    const result = validateText("a".repeat(600));
    expect(result.valid).toBe(true);
    expect(result.warning).toBeTruthy();
  });

  it("is valid but returns a warning at exactly 501 chars", () => {
    const result = validateText("a".repeat(501));
    expect(result.valid).toBe(true);
    expect(result.warning).toBeTruthy();
  });

  it("rejects text over 2000 characters with an error", () => {
    const result = validateText("a".repeat(2001));
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/2000/);
  });

  it("rejects text at exactly 2001 characters", () => {
    expect(validateText("a".repeat(2001)).valid).toBe(false);
  });
});

// ── validatePhone ─────────────────────────────────────────────────────────────

describe("validatePhone", () => {
  it("accepts a digits-only phone number", () => {
    expect(validatePhone("5551234567").valid).toBe(true);
  });

  it("accepts international format with leading +", () => {
    expect(validatePhone("+1 555-123-4567").valid).toBe(true);
  });

  it("accepts a UK number in international format", () => {
    expect(validatePhone("+44 7911 123456").valid).toBe(true);
  });

  it("accepts common formatting characters (hyphens, dots, parens)", () => {
    expect(validatePhone("+1 (555) 123-4567").valid).toBe(true);
  });

  it("rejects an empty string", () => {
    const result = validatePhone("");
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("rejects a whitespace-only string", () => {
    expect(validatePhone("   ").valid).toBe(false);
  });

  it("rejects a letters-only string", () => {
    expect(validatePhone("abcdefgh").valid).toBe(false);
  });

  it("rejects a string that is too short (fewer than 3 characters total)", () => {
    expect(validatePhone("+1").valid).toBe(false);
  });
});

// ── validateVCard ─────────────────────────────────────────────────────────────

const EMPTY_VCARD: VCardInput = {
  fullName: "",
  phone: "",
  email: "",
  company: "",
  jobTitle: "",
  website: "",
  address: "",
};

describe("validateVCard", () => {
  it("passes with only a full name (minimum required field)", () => {
    expect(validateVCard({ ...EMPTY_VCARD, fullName: "Jane Smith" }).valid).toBe(true);
  });

  it("passes with name plus optional fields populated", () => {
    expect(
      validateVCard({
        fullName: "Jane Smith",
        phone: "+1 555-000-0001",
        email: "jane@example.com",
        company: "Acme",
        jobTitle: "PM",
        website: "https://jane.dev",
        address: "123 Main St",
      }).valid
    ).toBe(true);
  });

  it("fails when fullName is empty", () => {
    const result = validateVCard(EMPTY_VCARD);
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("fails when fullName is whitespace only", () => {
    expect(validateVCard({ ...EMPTY_VCARD, fullName: "   " }).valid).toBe(false);
  });
});

// ── validateLocation ──────────────────────────────────────────────────────────

const EMPTY_LOCATION: LocationInput = {
  mode: "coordinates",
  lat: "",
  lng: "",
  mapsLink: "",
};

describe("validateLocation (coordinates mode)", () => {
  it("passes valid decimal lat/lng", () => {
    expect(
      validateLocation({ ...EMPTY_LOCATION, lat: "40.7128", lng: "-74.0060" }).valid
    ).toBe(true);
  });

  it("rejects empty lat", () => {
    expect(validateLocation({ ...EMPTY_LOCATION, lat: "", lng: "-74.0060" }).valid).toBe(false);
  });

  it("rejects empty lng", () => {
    expect(validateLocation({ ...EMPTY_LOCATION, lat: "40.7128", lng: "" }).valid).toBe(false);
  });

  it("rejects both lat and lng empty", () => {
    expect(validateLocation(EMPTY_LOCATION).valid).toBe(false);
  });

  it("rejects latitude out of range (>90)", () => {
    expect(
      validateLocation({ ...EMPTY_LOCATION, lat: "91", lng: "0" }).valid
    ).toBe(false);
  });

  it("rejects latitude out of range (<-90)", () => {
    expect(
      validateLocation({ ...EMPTY_LOCATION, lat: "-91", lng: "0" }).valid
    ).toBe(false);
  });

  it("rejects longitude out of range (>180)", () => {
    expect(
      validateLocation({ ...EMPTY_LOCATION, lat: "0", lng: "181" }).valid
    ).toBe(false);
  });

  it("rejects non-numeric lat", () => {
    expect(
      validateLocation({ ...EMPTY_LOCATION, lat: "abc", lng: "0" }).valid
    ).toBe(false);
  });
});

// ── validateWhatsApp ──────────────────────────────────────────────────────────

const BASE_WA_INPUT: WhatsAppInput = { countryCode: "91", phone: "9876543210", message: "" };

describe("validateWhatsApp", () => {
  it("passes with a valid country code and phone", () => {
    expect(validateWhatsApp(BASE_WA_INPUT).valid).toBe(true);
  });

  it("passes when optional message is provided", () => {
    expect(validateWhatsApp({ ...BASE_WA_INPUT, message: "Hello!" }).valid).toBe(true);
  });

  it("fails when country code is empty", () => {
    const r = validateWhatsApp({ ...BASE_WA_INPUT, countryCode: "" });
    expect(r.valid).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it("fails when phone is empty", () => {
    const r = validateWhatsApp({ ...BASE_WA_INPUT, phone: "" });
    expect(r.valid).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it("fails when phone has fewer than 7 digits", () => {
    const r = validateWhatsApp({ ...BASE_WA_INPUT, phone: "12345" });
    expect(r.valid).toBe(false);
  });

  it("fails when phone contains non-digit characters", () => {
    const r = validateWhatsApp({ ...BASE_WA_INPUT, phone: "+91-987" });
    expect(r.valid).toBe(false);
  });

  it("fails when phone exceeds 15 digits", () => {
    const r = validateWhatsApp({ ...BASE_WA_INPUT, phone: "1234567890123456" });
    expect(r.valid).toBe(false);
  });
});

// ── validateEmail ─────────────────────────────────────────────────────────────

const BASE_EMAIL_INPUT: EmailInput = { email: "test@example.com", subject: "", body: "" };

describe("validateEmail", () => {
  it("passes with a valid email address", () => {
    expect(validateEmail(BASE_EMAIL_INPUT).valid).toBe(true);
  });

  it("passes with optional subject and body", () => {
    expect(validateEmail({ ...BASE_EMAIL_INPUT, subject: "Hi", body: "Hello" }).valid).toBe(true);
  });

  it("fails when email is empty", () => {
    const r = validateEmail({ ...BASE_EMAIL_INPUT, email: "" });
    expect(r.valid).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it("fails when email has no @ symbol", () => {
    const r = validateEmail({ ...BASE_EMAIL_INPUT, email: "notanemail" });
    expect(r.valid).toBe(false);
  });

  it("fails when email has no domain part", () => {
    const r = validateEmail({ ...BASE_EMAIL_INPUT, email: "user@" });
    expect(r.valid).toBe(false);
  });

  it("fails when email has no TLD", () => {
    const r = validateEmail({ ...BASE_EMAIL_INPUT, email: "user@example" });
    expect(r.valid).toBe(false);
  });
});

// ── validateSms ───────────────────────────────────────────────────────────────

const BASE_SMS_INPUT: SmsInput = { phone: "+91 9876543210", message: "" };

describe("validateSms", () => {
  it("passes with a valid phone number", () => {
    expect(validateSms(BASE_SMS_INPUT).valid).toBe(true);
  });

  it("passes with an optional message", () => {
    expect(validateSms({ ...BASE_SMS_INPUT, message: "Hi there" }).valid).toBe(true);
  });

  it("fails when phone is empty", () => {
    const r = validateSms({ ...BASE_SMS_INPUT, phone: "" });
    expect(r.valid).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it("fails when phone is whitespace only", () => {
    const r = validateSms({ ...BASE_SMS_INPUT, phone: "   " });
    expect(r.valid).toBe(false);
  });
});

describe("validateLocation (mapslink mode)", () => {
  const mapsBase: LocationInput = { mode: "mapslink", mapsLink: "", lat: "", lng: "" };

  it("passes a google.com/maps URL", () => {
    expect(
      validateLocation({ ...mapsBase, mapsLink: "https://www.google.com/maps/place/Eiffel+Tower" }).valid
    ).toBe(true);
  });

  it("passes a maps.app.goo.gl short link", () => {
    expect(
      validateLocation({ ...mapsBase, mapsLink: "https://maps.app.goo.gl/abc123" }).valid
    ).toBe(true);
  });

  it("passes a goo.gl/maps short link", () => {
    expect(
      validateLocation({ ...mapsBase, mapsLink: "https://goo.gl/maps/abc123" }).valid
    ).toBe(true);
  });

  it("rejects an empty Maps link", () => {
    expect(validateLocation(mapsBase).valid).toBe(false);
  });

  it("rejects a non-Google URL", () => {
    expect(
      validateLocation({ ...mapsBase, mapsLink: "https://maps.apple.com/?q=paris" }).valid
    ).toBe(false);
  });

  it("rejects a plain Google URL that is not a Maps URL", () => {
    expect(
      validateLocation({ ...mapsBase, mapsLink: "https://www.google.com/search?q=paris" }).valid
    ).toBe(false);
  });
});

// ── validateWifi ─────────────────────────────────────────────────────────────

const BASE_WIFI: WifiInput = { ssid: "MyHome", password: "pass123", encryption: "WPA", hidden: false };

describe("validateWifi", () => {
  it("passes with valid WPA network", () => {
    expect(validateWifi(BASE_WIFI).valid).toBe(true);
  });

  it("fails when SSID is empty", () => {
    const r = validateWifi({ ...BASE_WIFI, ssid: "" });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/SSID/i);
  });

  it("fails when WPA has no password", () => {
    const r = validateWifi({ ...BASE_WIFI, password: "" });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/password/i);
  });

  it("passes open network with no password", () => {
    expect(validateWifi({ ...BASE_WIFI, encryption: "nopass", password: "" }).valid).toBe(true);
  });
});
