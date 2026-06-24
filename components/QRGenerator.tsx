"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { trackQRGenerated } from "@/lib/analytics";
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
  const [customizationOpen, setCustomizationOpen] = useState(false);

  // Fire qr_generated 1.5 s after the payload stabilises — avoids a flood
  // of events while the user is still typing. Structural params only; no content.
  const prevPayloadRef = useRef("");
  useEffect(() => {
    if (!payload) return;
    const timer = setTimeout(() => {
      if (payload === prevPayloadRef.current) return;
      prevPayloadRef.current = payload;
      trackQRGenerated({
        qr_type: qrType,
        has_logo: customization.logo !== null,
        has_gradient: customization.gradient !== null,
        dot_style: customization.dotStyle,
        error_correction: customization.errorCorrection,
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [payload, qrType, customization]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* ── Hero ── */}
      <div className="relative mb-10 text-center">
        {/* Radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-48"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Theme toggle */}
        <div className="absolute right-0 top-0">
          <DarkModeToggle />
        </div>

        {/* Badge */}
        <div
          className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide"
          style={{
            border: "1px solid rgba(6,182,212,0.4)",
            color: "#06b6d4",
            background: "rgba(6,182,212,0.08)",
          }}
        >
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          Free · No signup · Browser-only
        </div>

        {/* Headline */}
        <h1
          className="gradient-text text-4xl font-extrabold lg:text-5xl"
          style={{ letterSpacing: "-0.5px" }}
        >
          QR Code Generator
        </h1>

        {/* Subheadline */}
        <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
          Create custom QR codes for URLs, text, phone, contacts, and locations — free, instant, and client-side.
        </p>

        {/* Privacy note */}
        <p
          className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs"
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            color: "var(--text-hint)",
          }}
        >
          <ShieldIcon />
          All processing happens in your browser. Nothing is sent to any server.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Left column ── */}
        <div className="flex-1 space-y-6">
          <Card>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-hint)" }}>
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

          <div
            className="rounded-2xl"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <button
              type="button"
              onClick={() => setCustomizationOpen((o) => !o)}
              aria-expanded={customizationOpen}
              aria-controls="customization-panel"
              className="flex w-full items-center justify-between px-6 py-4"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-hint)" }}>
                Customization
              </h2>
              <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#06b6d4" }}>
                Customize QR Code
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-300${customizationOpen ? " rotate-180" : ""}`}
                />
              </span>
            </button>
            <div
              id="customization-panel"
              style={{
                maxHeight: customizationOpen ? "2400px" : "0px",
                overflow: "hidden",
                transition: "max-height 0.4s ease",
              }}
            >
              <div className="px-6 pb-6 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <CustomizationPanel
                  options={customization}
                  onChange={setCustomization}
                  onReset={resetToDefaults}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column: sticky preview + download ── */}
        <div className="lg:w-80 xl:w-96">
          <div className="sticky top-8 space-y-4">
            <Card>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-hint)" }}>
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
              <p
                className="mt-3 text-center text-xs font-semibold"
                style={{ letterSpacing: "0.18em", color: "var(--text-hint)" }}
              >
                LIVE PREVIEW · SCAN TO TEST
              </p>
            </Card>

            <Card>
              <DownloadButtons
                qrType={qrType}
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
  if (!mounted) return <div className="h-9 w-9" />;

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="rounded-full p-2 transition-colors"
      style={{
        background: "var(--bg-input)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
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
  const hasError = value !== "" && !validation.valid && !!validation.error;
  return (
    <div className="space-y-1">
      <label htmlFor="url-input" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        Website URL
      </label>
      <input
        id="url-input"
        type="url"
        inputMode="url"
        placeholder="https://example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="themed-input"
        autoComplete="url"
        aria-invalid={hasError ? true : undefined}
        aria-describedby={hasError ? "url-input-error" : undefined}
      />
      {hasError && (
        <p id="url-input-error" role="alert" className="text-xs text-red-500">
          {validation.error}
        </p>
      )}
      {value && validation.valid && !value.match(/^https?:\/\//i) && (
        <p className="text-xs" style={{ color: "var(--text-hint)" }}>https:// will be added automatically</p>
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
  const hasError = value !== "" && !validation.valid && !!validation.error;
  const describedBy = [
    hasError ? "text-input-error" : "",
    validation.warning ? "text-input-warning" : "",
  ].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label htmlFor="text-input" className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Text content
        </label>
        <span
          aria-hidden="true"
          className={`text-xs ${value.length > 1800 ? "text-red-500" : ""}`}
          style={value.length > 1800 ? {} : { color: "var(--text-hint)" }}
        >
          {value.length}/2000
        </span>
      </div>
      <textarea
        id="text-input"
        rows={4}
        placeholder="Enter any text…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={2000}
        className="themed-input resize-none"
        aria-invalid={hasError ? true : undefined}
        aria-describedby={describedBy}
      />
      {hasError && (
        <p id="text-input-error" role="alert" className="text-xs text-red-500">
          {validation.error}
        </p>
      )}
      {validation.warning && (
        <p id="text-input-warning" className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
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
  const hasError = value !== "" && !validation.valid && !!validation.error;
  return (
    <div className="space-y-1">
      <label htmlFor="phone-input" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        Phone number
      </label>
      <input
        id="phone-input"
        type="tel"
        inputMode="tel"
        placeholder="+1 555-123-4567"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="themed-input"
        autoComplete="tel"
        aria-invalid={hasError ? true : undefined}
        aria-describedby={hasError ? "phone-input-error" : undefined}
      />
      {hasError && (
        <p id="phone-input-error" role="alert" className="text-xs text-red-500">
          {validation.error}
        </p>
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

  const nameHasError = !validation.valid && !value.fullName.trim();

  return (
    <div className="space-y-3">
      <Field label="Full name *" inputId="vcard-fullname">
        <input
          id="vcard-fullname"
          type="text"
          placeholder="Jane Smith"
          value={value.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          className="themed-input"
          autoComplete="name"
          aria-invalid={nameHasError ? true : undefined}
          aria-describedby={nameHasError ? "vcard-fullname-error" : undefined}
          aria-required="true"
        />
        {nameHasError && validation.error && (
          <p id="vcard-fullname-error" role="alert" className="text-xs text-red-500">
            {validation.error}
          </p>
        )}
      </Field>
      <Field label="Phone" inputId="vcard-phone">
        <input id="vcard-phone" type="tel" placeholder="+1 555-123-4567" value={value.phone}
          onChange={(e) => set("phone", e.target.value)} className="themed-input" autoComplete="tel" />
      </Field>
      <Field label="Email" inputId="vcard-email">
        <input id="vcard-email" type="email" placeholder="jane@example.com" value={value.email}
          onChange={(e) => set("email", e.target.value)} className="themed-input" autoComplete="email" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Company" inputId="vcard-company">
          <input id="vcard-company" type="text" placeholder="Acme Corp" value={value.company}
            onChange={(e) => set("company", e.target.value)} className="themed-input" autoComplete="organization" />
        </Field>
        <Field label="Job title" inputId="vcard-jobtitle">
          <input id="vcard-jobtitle" type="text" placeholder="Product Manager" value={value.jobTitle}
            onChange={(e) => set("jobTitle", e.target.value)} className="themed-input" autoComplete="organization-title" />
        </Field>
      </div>
      <Field label="Website" inputId="vcard-website">
        <input id="vcard-website" type="url" placeholder="https://janesmith.com" value={value.website}
          onChange={(e) => set("website", e.target.value)} className="themed-input" autoComplete="url" />
      </Field>
      <Field label="Address" inputId="vcard-address">
        <input id="vcard-address" type="text" placeholder="123 Main St, New York, NY 10001" value={value.address}
          onChange={(e) => set("address", e.target.value)} className="themed-input" autoComplete="street-address" />
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

  const coordsHaveError = !validation.valid && !!validation.error;
  const mapsHasError = value.mapsLink !== "" && !validation.valid;

  return (
    <div className="space-y-4">
      <div
        role="group"
        aria-label="Location input mode"
        className="flex gap-1 rounded-xl p-1"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}
      >
        {(["coordinates", "mapslink"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => set("mode", mode)}
            aria-pressed={value.mode === mode}
            className={[
              "flex flex-1 items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium",
              value.mode === mode ? "btn-cyan" : "",
            ].join(" ")}
            style={value.mode === mode ? {} : { color: "var(--text-secondary)" }}
          >
            {mode === "coordinates" ? "Lat / Long" : "Maps Link"}
          </button>
        ))}
      </div>

      {value.mode === "coordinates" ? (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude" inputId="location-lat">
            <input
              id="location-lat"
              type="text"
              inputMode="decimal"
              placeholder="40.7128"
              value={value.lat}
              onChange={(e) => set("lat", e.target.value)}
              className="themed-input"
              aria-invalid={coordsHaveError ? true : undefined}
              aria-describedby={coordsHaveError ? "location-coords-error" : undefined}
            />
          </Field>
          <Field label="Longitude" inputId="location-lng">
            <input
              id="location-lng"
              type="text"
              inputMode="decimal"
              placeholder="-74.0060"
              value={value.lng}
              onChange={(e) => set("lng", e.target.value)}
              className="themed-input"
              aria-invalid={coordsHaveError ? true : undefined}
              aria-describedby={coordsHaveError ? "location-coords-error" : undefined}
            />
          </Field>
          {coordsHaveError && (
            <p id="location-coords-error" role="alert" className="col-span-2 text-xs text-red-500">
              {validation.error}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <label htmlFor="location-maps-link" className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Google Maps link
          </label>
          <input
            id="location-maps-link"
            type="url"
            placeholder="https://www.google.com/maps/place/..."
            value={value.mapsLink}
            onChange={(e) => set("mapsLink", e.target.value)}
            className="themed-input"
            aria-invalid={mapsHasError ? true : undefined}
            aria-describedby={mapsHasError ? "location-maps-error" : undefined}
          />
          {mapsHasError && validation.error && (
            <p id="location-maps-error" role="alert" className="text-xs text-red-500">
              {validation.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, inputId, children }: { label: string; inputId: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
      }}
    >
      {children}
    </div>
  );
}
