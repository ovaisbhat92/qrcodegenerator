"use client";

import { useState, useMemo, useRef } from "react";
import type { QRType, CustomizationOptions, VCardInput, LocationInput } from "@/types/qr";
import { DEFAULT_CUSTOMIZATION } from "@/types/qr";
import {
  generateUrlPayload,
  generateTextPayload,
  generatePhonePayload,
  generateVCardPayload,
  generateLocationPayload,
} from "@/lib/qrPayloads";
import {
  validateUrl,
  validateText,
  validatePhone,
  validateVCard,
  validateLocation,
} from "@/lib/validators";
import QRTypeSelector from "@/components/QRTypeSelector";
import CustomizationPanel from "@/components/CustomizationPanel";
import QRPreview, { type QRPreviewHandle } from "@/components/QRPreview";
import DownloadButtons from "@/components/DownloadButtons";

const DEFAULT_VCARD: VCardInput = {
  fullName: "",
  phone: "",
  email: "",
  company: "",
  jobTitle: "",
  website: "",
  address: "",
};

const DEFAULT_LOCATION: LocationInput = {
  mode: "coordinates",
  lat: "",
  lng: "",
  mapsLink: "",
};

export default function QRGenerator() {
  const [qrType, setQrType] = useState<QRType>("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [vcardInput, setVcardInput] = useState<VCardInput>(DEFAULT_VCARD);
  const [locationInput, setLocationInput] = useState<LocationInput>(DEFAULT_LOCATION);
  const [customization, setCustomization] = useState<CustomizationOptions>(
    DEFAULT_CUSTOMIZATION
  );

  const previewRef = useRef<QRPreviewHandle>(null);

  // Derive payload + validation every render (cheap — pure functions)
  const { payload, validation } = useMemo(() => {
    switch (qrType) {
      case "url": {
        const v = validateUrl(urlInput);
        return { validation: v, payload: v.valid ? generateUrlPayload(urlInput) : "" };
      }
      case "text": {
        const v = validateText(textInput);
        return { validation: v, payload: v.valid ? generateTextPayload(textInput) : "" };
      }
      case "phone": {
        const v = validatePhone(phoneInput);
        return { validation: v, payload: v.valid ? generatePhonePayload(phoneInput) : "" };
      }
      case "vcard": {
        const v = validateVCard(vcardInput);
        return { validation: v, payload: v.valid ? generateVCardPayload(vcardInput) : "" };
      }
      case "location": {
        const v = validateLocation(locationInput);
        return { validation: v, payload: v.valid ? generateLocationPayload(locationInput) : "" };
      }
    }
  }, [qrType, urlInput, textInput, phoneInput, vcardInput, locationInput]);

  const isDisabled = !validation?.valid || !payload;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          QR Code Generator
        </h1>
        <p className="mt-2 text-gray-500">
          Create custom QR codes for URLs, text, phone, contacts, and locations — free, instant, and client-side.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Left column: form + customization ── */}
        <div className="flex-1 space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Content
            </h2>
            <QRTypeSelector value={qrType} onChange={setQrType} />
            <div className="mt-5">
              {qrType === "url" && (
                <UrlForm
                  value={urlInput}
                  onChange={setUrlInput}
                  validation={validation}
                />
              )}
              {qrType === "text" && (
                <TextForm
                  value={textInput}
                  onChange={setTextInput}
                  validation={validation}
                />
              )}
              {qrType === "phone" && (
                <PhoneForm
                  value={phoneInput}
                  onChange={setPhoneInput}
                  validation={validation}
                />
              )}
              {qrType === "vcard" && (
                <VCardForm
                  value={vcardInput}
                  onChange={setVcardInput}
                  validation={validation}
                />
              )}
              {qrType === "location" && (
                <LocationForm
                  value={locationInput}
                  onChange={setLocationInput}
                  validation={validation}
                />
              )}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Customization
            </h2>
            <CustomizationPanel
              options={customization}
              onChange={setCustomization}
            />
          </Card>
        </div>

        {/* ── Right column: sticky preview + download ── */}
        <div className="lg:w-80 xl:w-96">
          <div className="sticky top-8 space-y-4">
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Preview
              </h2>
              <div className="flex justify-center">
                <QRPreview
                  ref={previewRef}
                  data={payload}
                  qrType={qrType}
                  options={customization}
                />
              </div>
            </Card>

            <Card>
              <DownloadButtons
                onDownloadPNG={() => previewRef.current?.downloadPNG()}
                onDownloadSVG={() => previewRef.current?.downloadSVG()}
                onDownloadJPEG={() => previewRef.current?.downloadJPEG()}
                disabled={isDisabled}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared types ─────────────────────────────────────────────────────────────

interface ValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

// ── URL form ──────────────────────────────────────────────────────────────────

function UrlForm({
  value,
  onChange,
  validation,
}: {
  value: string;
  onChange: (v: string) => void;
  validation: ValidationResult;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Website URL
      </label>
      <input
        type="url"
        inputMode="url"
        placeholder="https://example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={input(value !== "" && !validation.valid)}
        autoComplete="url"
      />
      {value && !validation.valid && validation.error && (
        <p className="text-xs text-red-500">{validation.error}</p>
      )}
      {value && validation.valid && !value.match(/^https?:\/\//i) && (
        <p className="text-xs text-gray-400">
          https:// will be added automatically
        </p>
      )}
    </div>
  );
}

// ── Text form ─────────────────────────────────────────────────────────────────

function TextForm({
  value,
  onChange,
  validation,
}: {
  value: string;
  onChange: (v: string) => void;
  validation: ValidationResult;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Text content</label>
        <span
          className={`text-xs ${
            value.length > 1800 ? "text-red-500" : "text-gray-400"
          }`}
        >
          {value.length}/2000
        </span>
      </div>
      <textarea
        rows={4}
        placeholder="Enter any text…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={2000}
        className={`${input(value !== "" && !validation.valid)} resize-none`}
      />
      {value && !validation.valid && validation.error && (
        <p className="text-xs text-red-500">{validation.error}</p>
      )}
      {validation.warning && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-600">
          ⚠️ {validation.warning}
        </p>
      )}
    </div>
  );
}

// ── Phone form ────────────────────────────────────────────────────────────────

function PhoneForm({
  value,
  onChange,
  validation,
}: {
  value: string;
  onChange: (v: string) => void;
  validation: ValidationResult;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Phone number
      </label>
      <input
        type="tel"
        inputMode="tel"
        placeholder="+1 555-123-4567"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={input(value !== "" && !validation.valid)}
        autoComplete="tel"
      />
      {value && !validation.valid && validation.error && (
        <p className="text-xs text-red-500">{validation.error}</p>
      )}
    </div>
  );
}

// ── vCard form ────────────────────────────────────────────────────────────────

function VCardForm({
  value,
  onChange,
  validation,
}: {
  value: VCardInput;
  onChange: (v: VCardInput) => void;
  validation: ValidationResult;
}) {
  const set = <K extends keyof VCardInput>(key: K, val: VCardInput[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-3">
      <Field label="Full name *">
        <input
          type="text"
          placeholder="Jane Smith"
          value={value.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          className={input(!validation.valid && !value.fullName.trim())}
          autoComplete="name"
        />
        {!validation.valid && !value.fullName.trim() && validation.error && (
          <p className="text-xs text-red-500">{validation.error}</p>
        )}
      </Field>

      <Field label="Phone">
        <input
          type="tel"
          placeholder="+1 555-123-4567"
          value={value.phone}
          onChange={(e) => set("phone", e.target.value)}
          className={input(false)}
          autoComplete="tel"
        />
      </Field>

      <Field label="Email">
        <input
          type="email"
          placeholder="jane@example.com"
          value={value.email}
          onChange={(e) => set("email", e.target.value)}
          className={input(false)}
          autoComplete="email"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Company">
          <input
            type="text"
            placeholder="Acme Corp"
            value={value.company}
            onChange={(e) => set("company", e.target.value)}
            className={input(false)}
            autoComplete="organization"
          />
        </Field>
        <Field label="Job title">
          <input
            type="text"
            placeholder="Product Manager"
            value={value.jobTitle}
            onChange={(e) => set("jobTitle", e.target.value)}
            className={input(false)}
            autoComplete="organization-title"
          />
        </Field>
      </div>

      <Field label="Website">
        <input
          type="url"
          placeholder="https://janesmith.com"
          value={value.website}
          onChange={(e) => set("website", e.target.value)}
          className={input(false)}
          autoComplete="url"
        />
      </Field>

      <Field label="Address">
        <input
          type="text"
          placeholder="123 Main St, New York, NY 10001"
          value={value.address}
          onChange={(e) => set("address", e.target.value)}
          className={input(false)}
          autoComplete="street-address"
        />
      </Field>
    </div>
  );
}

// ── Location form ─────────────────────────────────────────────────────────────

function LocationForm({
  value,
  onChange,
  validation,
}: {
  value: LocationInput;
  onChange: (v: LocationInput) => void;
  validation: ValidationResult;
}) {
  const set = <K extends keyof LocationInput>(key: K, val: LocationInput[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        {(["coordinates", "mapslink"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => set("mode", mode)}
            className={[
              "flex flex-1 items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
              value.mode === mode
                ? "bg-white text-brand-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            ].join(" ")}
          >
            {mode === "coordinates" ? "Lat / Long" : "Maps Link"}
          </button>
        ))}
      </div>

      {value.mode === "coordinates" ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude">
            <input
              type="text"
              inputMode="decimal"
              placeholder="40.7128"
              value={value.lat}
              onChange={(e) => set("lat", e.target.value)}
              className={input(!validation.valid && !value.lat.trim())}
            />
          </Field>
          <Field label="Longitude">
            <input
              type="text"
              inputMode="decimal"
              placeholder="-74.0060"
              value={value.lng}
              onChange={(e) => set("lng", e.target.value)}
              className={input(!validation.valid && !value.lng.trim())}
            />
          </Field>
          {!validation.valid && validation.error && (
            <p className="col-span-2 text-xs text-red-500">{validation.error}</p>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Google Maps link
          </label>
          <input
            type="url"
            placeholder="https://www.google.com/maps/place/..."
            value={value.mapsLink}
            onChange={(e) => set("mapsLink", e.target.value)}
            className={input(value.mapsLink !== "" && !validation.valid)}
          />
          {value.mapsLink && !validation.valid && validation.error && (
            <p className="text-xs text-red-500">{validation.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      {children}
    </div>
  );
}

function input(hasError: boolean) {
  return [
    "w-full rounded-lg border px-3 py-2 text-sm text-gray-800 outline-none transition-colors",
    "placeholder:text-gray-300 focus:ring-2 focus:ring-brand-500/30",
    hasError
      ? "border-red-300 focus:border-red-400"
      : "border-gray-200 focus:border-brand-500",
  ].join(" ");
}
