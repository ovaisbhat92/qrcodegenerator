"use client";

import { useState, useMemo, useRef } from "react";
import type { QRType, WifiInput, CustomizationOptions } from "@/types/qr";
import { DEFAULT_CUSTOMIZATION } from "@/types/qr";
import {
  generateUrlPayload,
  generateTextPayload,
  generateWifiPayload,
} from "@/lib/qrPayloads";
import {
  validateUrl,
  validateText,
  validateWifi,
} from "@/lib/validators";
import QRTypeSelector from "@/components/QRTypeSelector";
import CustomizationPanel from "@/components/CustomizationPanel";
import QRPreview, { type QRPreviewHandle } from "@/components/QRPreview";
import DownloadButtons from "@/components/DownloadButtons";

const DEFAULT_WIFI: WifiInput = {
  ssid: "",
  password: "",
  encryption: "WPA",
  hidden: false,
};

export default function QRGenerator() {
  const [qrType, setQrType] = useState<QRType>("url");
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [wifiInput, setWifiInput] = useState<WifiInput>(DEFAULT_WIFI);
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
      case "wifi": {
        const v = validateWifi(wifiInput);
        return { validation: v, payload: v.valid ? generateWifiPayload(wifiInput) : "" };
      }
    }
  }, [qrType, urlInput, textInput, wifiInput]);

  function handleTypeChange(type: QRType) {
    setQrType(type);
  }

  const isDisabled = !validation?.valid || !payload;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          QR Code Generator
        </h1>
        <p className="mt-2 text-gray-500">
          Create custom QR codes for URLs, text, and Wi-Fi networks — free, instant, and client-side.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ── Left column: form + customization ── */}
        <div className="flex-1 space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Content
            </h2>
            <QRTypeSelector value={qrType} onChange={handleTypeChange} />
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
              {qrType === "wifi" && (
                <WifiForm
                  value={wifiInput}
                  onChange={setWifiInput}
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
                disabled={isDisabled}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Input forms ─────────────────────────────────────────────────────────────

interface ValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

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

function WifiForm({
  value,
  onChange,
  validation,
}: {
  value: WifiInput;
  onChange: (v: WifiInput) => void;
  validation: ValidationResult;
}) {
  const set = <K extends keyof WifiInput>(key: K, val: WifiInput[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Network Name (SSID)
        </label>
        <input
          type="text"
          placeholder="MyWiFiNetwork"
          value={value.ssid}
          onChange={(e) => set("ssid", e.target.value)}
          className={input(!validation.valid && !value.ssid)}
          autoComplete="off"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Encryption
        </label>
        <select
          value={value.encryption}
          onChange={(e) =>
            set("encryption", e.target.value as WifiInput["encryption"])
          }
          className={input(false)}
        >
          <option value="WPA">WPA / WPA2 (recommended)</option>
          <option value="WEP">WEP</option>
          <option value="nopass">No Password (open network)</option>
        </select>
      </div>

      {value.encryption !== "nopass" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Network password"
            value={value.password}
            onChange={(e) => set("password", e.target.value)}
            className={input(!validation.valid && !value.password)}
            autoComplete="off"
          />
        </div>
      )}

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={value.hidden}
          onChange={(e) => set("hidden", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 accent-brand-600"
        />
        <span className="text-sm text-gray-700">Hidden network</span>
      </label>

      {!validation.valid && validation.error && (
        <p className="text-xs text-red-500">{validation.error}</p>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

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
