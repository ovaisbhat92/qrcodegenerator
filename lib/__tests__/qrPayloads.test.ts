import { describe, it, expect } from "vitest";
import {
  generateUrlPayload,
  generateTextPayload,
  generatePhonePayload,
  generateVCardPayload,
  generateLocationPayload,
} from "../qrPayloads";
import type { VCardInput, LocationInput } from "@/types/qr";

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
  it("starts with BEGIN:VCARD and ends with END:VCARD", () => {
    const result = generateVCardPayload(BASE_VCARD);
    expect(result.startsWith("BEGIN:VCARD")).toBe(true);
    expect(result.endsWith("END:VCARD")).toBe(true);
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
    expect(result).toContain("TEL:+1 555-000-0001");
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
