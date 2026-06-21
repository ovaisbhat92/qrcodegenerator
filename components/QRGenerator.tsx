"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
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

const STORAGE_KEY = "qr-customization";

const DEFAULT_VCARD: VCardInput = {
  fullName: "", phone: "", email: "",
  company: "", jobTitle: "", website: "", address: "",
};

const DEFAULT_LOCATION: LocationInput = {
  mode: "coordinates", lat: "", lng: "", mapsLink: "",
};

// ── localStorage persistence for customization ───────────────────────────────

function usePersistedCustomization() {
  const [customization, setCustomization] = useState<CustomizationOptions>(DEFAULT_CUSTOMIZATION);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CustomizationOptions>;
        setCustomization({ ...DEFAULT_CUSTOMIZATION, ...parsed });
      }
    } catch {
      // ignore parse errors or unavailable storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customization));
    } catch {
      // ignore (private browsing / quota exceeded)
    }
  }, [customization, hydrated]);

  const resetToDefaults = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setCustomization({ ...DEFAULT_CUSTOMIZATION });
  }, []);

  return { customization, setCustomization, resetToDefaults };
}

// ── Main component ────────────────────────────────────────────────────────────

export default function QRGenerator({ defaultType = "url" }: { defaultType?: QRType }) {
  const [qrType, setQrType] = useState<QRType>(defaultType);
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [vcardInput, setVcardInput] = useState<VCardInput>(DEFAULT_VCARD);
  const [locationInput, setLocationInput] = useState<LocationInput>(DEFAULT_LOCATION);

  const { customization, setCustomization, resetToDefaults } = usePersistedCustomization();
  const previewRef = useRef<QRPreviewHandle>(null);

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
      <div className="relative mb-10 text-center">
        <div className="absolute right-0 top-0">
          <DarkModeToggle />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          QR Code Generator
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Create custom QR codes for URLs, text, phone, contacts, and locations — free, instant, and client-side.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Left column ── */}
        <div className="flex-1 space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Content
            </h2>
            <QRTypeSelector value={qrType} onChange={setQrType} />
            <div className="mt-5">
              {qrType === "url" && (
                <UrlForm value={urlInput} onChange={setUrlInput} validation={validation} />
              )}
              {qrType === "text" && (
                <TextForm value={textInput} onChange={setTextInput} validation={validation} />
              )}
              {qrType === "phone" && (
                <PhoneForm value={phoneInput} onChange={setPhoneInput} validation={validation} />
              )}
              {qrType === "vcard" && (
                <VCardForm value={vcardInput} onChange={setVcardInput} validation={validation} />
              )}
              {qrType === "location" && (
                <LocationForm value={locationInput} onChange={setLocationInput} validation={validation} />
              )}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Customization
            </h2>
            <CustomizationPanel
              options={customization}
              onChange={setCustomization}
              onReset={resetToDefaults}
            />
          </Card>
        </div>

        {/* ── Right column: sticky preview + download ── */}
        <div className="lg:w-80 xl:w-96">
          <div className="sticky top-8 space-y-4">
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
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
                onDownloadWebP={() => previewRef.current?.downloadWebP()}
                onDownloadPDF={async () => { await previewRef.current?.downloadPDF(); }}
                onCopyToClipboard={async () => { await previewRef.current?.copyToClipboard(); }}
                disabled={isDisabled}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dark mode toggle ─────────────────────────────────────────────────────────

function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />; // placeholder to avoid layout shift

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" strokeLinecap="round" />
      <line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round" />
      <line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round" />
      <line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeLinecap="round" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
        <p className="text-xs text-gray-400">https:// will be added automatically</p>
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
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Text content</label>
        <span className={`text-xs ${value.length > 1800 ? "text-red-500" : "text-gray-400"}`}>
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
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
        <input type="tel" placeholder="+1 555-123-4567" value={value.phone}
          onChange={(e) => set("phone", e.target.value)} className={input(false)} autoComplete="tel" />
      </Field>
      <Field label="Email">
        <input type="email" placeholder="jane@example.com" value={value.email}
          onChange={(e) => set("email", e.target.value)} className={input(false)} autoComplete="email" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Company">
          <input type="text" placeholder="Acme Corp" value={value.company}
            onChange={(e) => set("company", e.target.value)} className={input(false)} autoComplete="organization" />
        </Field>
        <Field label="Job title">
          <input type="text" placeholder="Product Manager" value={value.jobTitle}
            onChange={(e) => set("jobTitle", e.target.value)} className={input(false)} autoComplete="organization-title" />
        </Field>
      </div>
      <Field label="Website">
        <input type="url" placeholder="https://janesmith.com" value={value.website}
          onChange={(e) => set("website", e.target.value)} className={input(false)} autoComplete="url" />
      </Field>
      <Field label="Address">
        <input type="text" placeholder="123 Main St, New York, NY 10001" value={value.address}
          onChange={(e) => set("address", e.target.value)} className={input(false)} autoComplete="street-address" />
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
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-700">
        {(["coordinates", "mapslink"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => set("mode", mode)}
            className={[
              "flex flex-1 items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
              value.mode === mode
                ? "bg-white text-brand-600 shadow-sm dark:bg-gray-600 dark:text-brand-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
            ].join(" ")}
          >
            {mode === "coordinates" ? "Lat / Long" : "Maps Link"}
          </button>
        ))}
      </div>

      {value.mode === "coordinates" ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude">
            <input type="text" inputMode="decimal" placeholder="40.7128" value={value.lat}
              onChange={(e) => set("lat", e.target.value)}
              className={input(!validation.valid && !value.lat.trim())} />
          </Field>
          <Field label="Longitude">
            <input type="text" inputMode="decimal" placeholder="-74.0060" value={value.lng}
              onChange={(e) => set("lng", e.target.value)}
              className={input(!validation.valid && !value.lng.trim())} />
          </Field>
          {!validation.valid && validation.error && (
            <p className="col-span-2 text-xs text-red-500">{validation.error}</p>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
      {children}
    </div>
  );
}

function input(hasError: boolean) {
  return [
    "w-full rounded-lg border px-3 py-2 text-sm text-gray-800 outline-none transition-colors",
    "bg-white dark:bg-gray-700 dark:text-gray-100",
    "placeholder:text-gray-300 dark:placeholder:text-gray-500",
    "focus:ring-2 focus:ring-brand-500/30",
    hasError
      ? "border-red-300 focus:border-red-400"
      : "border-gray-200 focus:border-brand-500 dark:border-gray-600 dark:focus:border-brand-400",
  ].join(" ");
}
