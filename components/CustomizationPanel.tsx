"use client";

import { useRef } from "react";
import type {
  CustomizationOptions,
  DotStyle,
  CornerStyle,
  ErrorCorrection,
  GradientType,
} from "@/types/qr";
import { DEFAULT_CUSTOMIZATION } from "@/types/qr";

interface Props {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
}

export default function CustomizationPanel({ options, onChange }: Props) {
  const set = <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => onChange({ ...options, [key]: value });

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      alert("Please upload a PNG, JPG, or SVG file.");
      e.target.value = "";
      return;
    }
    if (file.size > 1_048_576) {
      alert("Logo must be under 1 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      set("logo", { dataUrl, size: 0.3, padding: true });
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    set("logo", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const gradientEnabled = options.gradient !== null;

  function toggleGradient(enabled: boolean) {
    set(
      "gradient",
      enabled
        ? {
            type: "linear",
            startColor: options.fgColor,
            endColor: "#6366f1",
            rotation: 0,
          }
        : null
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Size & Spacing ── */}
      <Section title="Size & Spacing">
        <SliderRow
          label="Size"
          value={options.size}
          min={128}
          max={1024}
          step={8}
          unit="px"
          onChange={(v) => set("size", v)}
        />
        <SliderRow
          label="Margin"
          value={options.margin}
          min={0}
          max={40}
          step={1}
          unit="px"
          onChange={(v) => set("margin", v)}
        />
      </Section>

      {/* ── Error Correction ── */}
      <Section title="Error Correction">
        <div className="flex gap-2">
          {(["L", "M", "Q", "H"] as ErrorCorrection[]).map((ec) => (
            <button
              key={ec}
              type="button"
              onClick={() => set("errorCorrection", ec)}
              className={pill(options.errorCorrection === ec)}
            >
              {ec}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-400">
          H (30% redundancy) is best for logos. L uses less data.
        </p>
      </Section>

      {/* ── Colors ── */}
      <Section title="Colors">
        <ColorRow
          label="Foreground"
          value={options.fgColor}
          onChange={(v) => set("fgColor", v)}
        />
        <ColorRow
          label="Background"
          value={options.bgColor}
          onChange={(v) => set("bgColor", v)}
          disabled={options.transparentBg}
        />
        <ToggleRow
          label="Transparent background"
          checked={options.transparentBg}
          onChange={(v) => set("transparentBg", v)}
        />
      </Section>

      {/* ── Dot Style ── */}
      <Section title="Dot Style">
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["square",        "Square"],
              ["rounded",       "Rounded"],
              ["dots",          "Dots"],
              ["extra-rounded", "Extra Rounded"],
            ] as [DotStyle, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => set("dotStyle", id)}
              className={pill(options.dotStyle === id)}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Corner Style ── */}
      <Section title="Corner / Eye Style">
        <div className="grid grid-cols-3 gap-2 mb-3">
          {(
            [
              ["square",  "Square"],
              ["rounded", "Rounded"],
              ["circle",  "Circle"],
            ] as [CornerStyle, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => set("cornerStyle", id)}
              className={pill(options.cornerStyle === id)}
            >
              {label}
            </button>
          ))}
        </div>
        <ColorRow
          label="Corner color"
          value={options.cornerColor}
          onChange={(v) => set("cornerColor", v)}
        />
      </Section>

      {/* ── Gradient ── */}
      <Section title="Gradient">
        <ToggleRow
          label="Enable gradient on dots"
          checked={gradientEnabled}
          onChange={toggleGradient}
        />
        {gradientEnabled && options.gradient && (
          <div className="mt-3 space-y-3">
            <div className="flex gap-2">
              {(["linear", "radial"] as GradientType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    set("gradient", { ...options.gradient!, type: t })
                  }
                  className={pill(options.gradient!.type === t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <ColorRow
              label="Start color"
              value={options.gradient.startColor}
              onChange={(v) =>
                set("gradient", { ...options.gradient!, startColor: v })
              }
            />
            <ColorRow
              label="End color"
              value={options.gradient.endColor}
              onChange={(v) =>
                set("gradient", { ...options.gradient!, endColor: v })
              }
            />
            {options.gradient.type === "linear" && (
              <SliderRow
                label="Rotation"
                value={options.gradient.rotation}
                min={0}
                max={360}
                step={15}
                unit="°"
                onChange={(v) =>
                  set("gradient", { ...options.gradient!, rotation: v })
                }
              />
            )}
          </div>
        )}
      </Section>

      {/* ── Logo ── */}
      <Section title="Logo (optional)">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          className="hidden"
          onChange={handleLogoUpload}
          id="logo-upload"
        />
        {!options.logo ? (
          <label
            htmlFor="logo-upload"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500 hover:border-brand-500 hover:text-brand-600 transition-colors"
          >
            <span>📁</span>
            <span>Upload PNG / JPG / SVG (max 1 MB)</span>
          </label>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={options.logo.dataUrl}
                alt="Logo preview"
                className="h-8 w-8 rounded object-contain"
              />
              <span className="flex-1 text-sm text-gray-600">Logo uploaded</span>
              <button
                type="button"
                onClick={removeLogo}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <SliderRow
              label="Logo size"
              value={Math.round(options.logo.size * 100)}
              min={10}
              max={50}
              step={5}
              unit="%"
              onChange={(v) =>
                set("logo", { ...options.logo!, size: v / 100 })
              }
            />
            <ToggleRow
              label="White padding behind logo"
              checked={options.logo.padding}
              onChange={(v) =>
                set("logo", { ...options.logo!, padding: v })
              }
            />
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              ⚠️ Large logos reduce scannability. Keep under 30% and use error correction H.
            </p>
          </div>
        )}
      </Section>

      {/* ── Reset ── */}
      <button
        type="button"
        onClick={() => onChange({ ...DEFAULT_CUSTOMIZATION })}
        className="w-full rounded-lg border border-gray-200 py-2 text-sm text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
      >
        Reset to defaults
      </button>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </p>
      {children}
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm text-gray-600">{label}</label>
        <span className="font-mono text-sm font-medium text-gray-700">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider w-full accent-brand-600"
      />
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`mb-2 flex items-center justify-between gap-3 ${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      <label className="text-sm text-gray-600">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 cursor-pointer rounded border border-gray-200 p-0.5"
          disabled={disabled}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          maxLength={7}
          disabled={disabled}
          className="w-24 rounded border border-gray-200 px-2 py-1 font-mono text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <span className="text-sm text-gray-600">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none",
          checked ? "bg-brand-600" : "bg-gray-200",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

function pill(active: boolean) {
  return [
    "rounded-lg px-3 py-1.5 text-sm font-medium border transition-all",
    active
      ? "bg-brand-600 text-white border-brand-600"
      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300",
  ].join(" ");
}
