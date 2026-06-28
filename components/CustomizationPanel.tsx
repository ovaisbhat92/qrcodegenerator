"use client";

import { useRef } from "react";
import { trackPresetSelected, trackLogoUploaded } from "@/lib/analytics";
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
  onReset: () => void;
}

// ── Preset designs ────────────────────────────────────────────────────────────

type PresetKey = Pick<
  CustomizationOptions,
  "fgColor" | "bgColor" | "transparentBg" | "dotStyle" | "cornerStyle" | "cornerColor" | "gradient" | "cornerGradient"
>;

function linearGrad(startColor: string, endColor: string): import("@/types/qr").GradientOptions {
  return { type: "linear", rotation: 135, startColor, endColor };
}

const PRESETS: { name: string; color: string; preset: PresetKey }[] = [
  {
    name: "Classic",
    color: "#000000",
    preset: {
      fgColor: "#000000", bgColor: "#ffffff", transparentBg: false,
      dotStyle: "dots", cornerStyle: "square", cornerColor: "#000000",
      gradient: null, cornerGradient: null,
    },
  },
  {
    name: "Blue Business",
    color: "#1E40AF",
    preset: {
      fgColor: "#1E40AF", bgColor: "#ffffff", transparentBg: false,
      dotStyle: "dots", cornerStyle: "rounded", cornerColor: "#1E40AF",
      gradient: null, cornerGradient: linearGrad("#1E40AF", "#3B82F6"),
    },
  },
  {
    name: "Green Payment",
    color: "#15803D",
    preset: {
      fgColor: "#15803D", bgColor: "#ffffff", transparentBg: false,
      dotStyle: "dots", cornerStyle: "rounded", cornerColor: "#15803D",
      gradient: null, cornerGradient: linearGrad("#15803D", "#22c55e"),
    },
  },
  {
    name: "Purple Social",
    color: "#7C3AED",
    preset: {
      fgColor: "#7C3AED", bgColor: "#F5F3FF", transparentBg: false,
      dotStyle: "dots", cornerStyle: "rounded", cornerColor: "#7C3AED",
      gradient: null, cornerGradient: linearGrad("#7C3AED", "#a855f7"),
    },
  },
  {
    name: "Minimal Grey",
    color: "#4B5563",
    preset: {
      fgColor: "#4B5563", bgColor: "#F9FAFB", transparentBg: false,
      dotStyle: "dots", cornerStyle: "rounded", cornerColor: "#4B5563",
      gradient: null, cornerGradient: null,
    },
  },
];

export default function CustomizationPanel({ options, onChange, onReset }: Props) {
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
      trackLogoUploaded({ file_type: file.type });
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
        ? { type: "linear", startColor: options.fgColor, endColor: "#06b6d4", rotation: 0 }
        : null
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Quick Presets ── */}
      <Section title="Quick Presets">
        <div className="grid grid-cols-5 gap-1.5">
          {PRESETS.map(({ name, color, preset }) => (
            <button
              key={name}
              type="button"
              onClick={() => { onChange({ ...options, ...preset }); trackPresetSelected({ preset_name: name.toLowerCase() }); }}
              className="group flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors"
              style={{ background: "transparent" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-input)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              aria-label={`Apply ${name} preset`}
              title={name}
            >
              <div
                className="h-8 w-8 rounded-md border border-[rgba(255,255,255,0.12)] shadow-sm"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span
                className="text-center text-[10px] leading-tight"
                style={{ color: "var(--text-secondary)" }}
              >
                {name}
              </span>
            </button>
          ))}
        </div>
      </Section>

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
        <div role="group" aria-label="Error correction level" className="flex gap-2">
          {(["L", "M", "Q", "H"] as ErrorCorrection[]).map((ec) => (
            <button
              key={ec}
              type="button"
              onClick={() => set("errorCorrection", ec)}
              aria-pressed={options.errorCorrection === ec}
              className={pill(options.errorCorrection === ec)}
            >
              {ec}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs" style={{ color: "var(--text-hint)" }}>
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
        <div role="group" aria-label="Dot style" className="grid grid-cols-2 gap-2">
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
              aria-pressed={options.dotStyle === id}
              className={pill(options.dotStyle === id)}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Corner Style ── */}
      <Section title="Corner / Eye Style">
        <div role="group" aria-label="Corner style" className="grid grid-cols-3 gap-2 mb-3">
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
              aria-pressed={options.cornerStyle === id}
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
            <div role="group" aria-label="Gradient type" className="flex gap-2">
              {(["linear", "radial"] as GradientType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    set("gradient", { ...options.gradient!, type: t })
                  }
                  aria-pressed={options.gradient!.type === t}
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
        {/* Hidden file input — triggered programmatically */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          className="hidden"
          onChange={handleLogoUpload}
          aria-hidden="true"
          tabIndex={-1}
        />
        {!options.logo ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors hover:border-brand-500 hover:text-brand-500"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            aria-label="Upload logo image — PNG, JPG, or SVG, maximum 1 MB"
          >
            <span aria-hidden="true">📁</span>
            <span>Upload PNG / JPG / SVG (max 1 MB)</span>
          </button>
        ) : (
          <div className="space-y-3">
            <div
              className="flex items-center gap-3 rounded-lg px-3 py-2"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={options.logo.dataUrl}
                alt="Uploaded logo preview"
                className="h-8 w-8 rounded object-contain"
              />
              <span className="flex-1 text-sm" style={{ color: "var(--text-secondary)" }}>Logo uploaded</span>
              <button
                type="button"
                onClick={removeLogo}
                className="text-xs text-red-500 hover:text-red-400"
                aria-label="Remove uploaded logo"
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
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
              ⚠️ Large logos reduce scannability. Keep under 30% and use error correction H.
            </p>
          </div>
        )}
      </Section>

      {/* ── Reset ── */}
      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-lg py-2 text-sm transition-colors"
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(6,182,212,0.4)";
          (e.currentTarget as HTMLButtonElement).style.color = "#06b6d4";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
        }}
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
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-hint)" }}>
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
  const id = `slider-${label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
  return (
    <div className="mb-2">
      <div className="mb-1 flex items-center justify-between">
        <label htmlFor={id} className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</label>
        <span aria-hidden="true" className="font-mono text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {value}{unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider w-full accent-brand-500"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value}${unit}`}
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
  const textId = `color-text-${label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
  return (
    <div className={`mb-2 flex items-center justify-between gap-3 ${disabled ? "pointer-events-none opacity-40" : ""}`}>
      <label htmlFor={textId} className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 cursor-pointer rounded border p-0.5"
          style={{ borderColor: "var(--border)", background: "var(--bg-input)" }}
          disabled={disabled}
          aria-label={`${label} color picker`}
        />
        <input
          id={textId}
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          maxLength={7}
          disabled={disabled}
          className="w-24 rounded border px-2 py-1 font-mono text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors"
          style={{ background: "var(--bg-input)", borderColor: "var(--border)", color: "var(--text-primary)" }}
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
      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          checked ? "bg-brand-500" : "",
        ].join(" ")}
        style={checked ? {} : { background: "var(--border)" }}
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
    "rounded-lg px-3 py-1.5 text-sm font-medium",
    active ? "btn-cyan" : "btn-ghost",
  ].join(" ");
}

// Keep DEFAULT_CUSTOMIZATION accessible for backwards compat (used by onReset callers)
export { DEFAULT_CUSTOMIZATION };
